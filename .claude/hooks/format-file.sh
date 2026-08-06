#!/usr/bin/env bash
#
# PostToolUse(Edit|Write) — run this repo's own formatters over the file that
# was just written.
#
# It replaces two commands inlined in settings.json, `npx eslint --fix
# "$FILE_PATH"` and `npx prettier --write "$FILE_PATH"`. There is no $FILE_PATH.
# Hook input is JSON on stdin (`.tool_input.file_path`), and the only
# environment variables a hook is given are CLAUDE_PROJECT_DIR,
# CLAUDE_PLUGIN_ROOT, CLAUDE_PLUGIN_DATA and CLAUDE_EFFORT — so both ran against
# an empty argument on every edit for the repository's entire history, and the
# trailing `|| true` swallowed whatever they said about it.
#
# The `2>/dev/null` that came with them is gone. `eslint --fix` exits non-zero
# for any problem it could not fix, which is routine and not this hook's
# business — that is what the `|| true`s below are for. `eslint: command not
# found` is not routine, and the old redirection collapsed the two into one
# silence.
#
# `node`, not `jq`, parses the payload — see the note in block-dangerous.sh.

set -uo pipefail

readonly READ_FIELD='const fs = process.getBuiltinModule("node:fs");
process.stdout.write(JSON.parse(fs.readFileSync(0, "utf8"))?.tool_input?.file_path ?? "")'

file=$(node -e "$READ_FIELD" 2>/dev/null) || exit 0

# A tool call this hook has nothing to say about: no path in the payload, or a
# path that has since been moved or deleted.
[ -n "$file" ] && [ -f "$file" ] || exit 0

# Claude Code edits files outside the project too — this session's own
# ~/.claude/CLAUDE.md, a sibling checkout. Formatting those with *this* repo's
# Prettier config would rewrite someone else's file to this project's taste.
if [ -n "${CLAUDE_PROJECT_DIR:-}" ] && [ "${file#"$CLAUDE_PROJECT_DIR"/}" = "$file" ]; then
  exit 0
fi

# `npx --no --` on both: `--no` refuses to reach for the network if the binary
# is missing locally, and the bare `--` is load-bearing — without it npm parses
# the tool's own flags as npm config, warns about each one, and hands the value
# of the last flag to the tool as a filename.
#
# ESLint only for what the flat config actually has rules for; handed anything
# else it reports "ignored because no matching configuration" and does nothing.
# `--no-warn-ignored` covers the files eslint.config.js ignores on purpose
# (generated GraphQL types, `msw init`'s worker), which are edited rarely but
# would otherwise warn on every save.
case "$file" in
*.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs)
  npx --no -- eslint --fix --no-warn-ignored "$file" || true
  ;;
esac

# `--ignore-unknown` so an edit to a shell script or an SVG is skipped rather
# than failing with "No parser could be inferred". Prettier reads
# .prettierignore itself, so nothing here needs to restate it.
npx --no -- prettier --write --ignore-unknown --log-level warn "$file" || true

exit 0
