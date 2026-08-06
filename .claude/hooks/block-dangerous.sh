#!/usr/bin/env bash
#
# PreToolUse(Bash) — refuse a short list of irreversible commands.
#
# The tool call arrives as JSON on stdin; the command is `.tool_input.command`.
# There is no positional argument and no environment variable carrying it — the
# only ones a hook is given are CLAUDE_PROJECT_DIR, CLAUDE_PLUGIN_ROOT,
# CLAUDE_PLUGIN_DATA and CLAUDE_EFFORT. The first version of this file opened
# with `COMMAND="$1"`, so COMMAND was always the empty string, no pattern ever
# matched, and it exited 0 on `rm -rf /` for the repository's entire history:
# installed, running, and completely inert. Nothing in `npm run gate` could see
# the difference, which is why `scripts/hooks.test.mjs` now pins both halves —
# that the payload is read from stdin, and that a match is refused rather than
# merely logged.
#
# Refusing is a JSON decision on stdout, not a non-zero exit. A bare `exit 1` is
# a *non-blocking* error: Claude Code surfaces it and then runs the command
# anyway. (`exit 2` does block, but it addresses the model rather than the user,
# and any JSON printed alongside it is ignored.)
#
# `node`, not `jq`, parses the payload. package.json declares `node >=22.13.0`
# as an engine, so it is present wherever this repo is checked out, while `jq`
# is a system package `npm install` never provides — and a safety hook whose
# parser is missing on somebody else's machine is the same silent no-op again.

set -uo pipefail

# `process.getBuiltinModule` rather than `require`/`import` so the snippet does
# not depend on whether `node -e` is treated as CommonJS or as ESM.
readonly READ_FIELD='const fs = process.getBuiltinModule("node:fs");
process.stdout.write(JSON.parse(fs.readFileSync(0, "utf8"))?.tool_input?.command ?? "")'

readonly WRITE_DENIAL='process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "deny",
    permissionDecisionReason: process.argv[1],
  },
}))'

deny() {
  node -e "$WRITE_DENIAL" "$1"
  exit 0
}

# Node's own stack trace on malformed input would be the only thing the user
# sees; the denial reason below says the same thing in a sentence.
if ! tool_command=$(node -e "$READ_FIELD" 2>/dev/null); then
  # Fail closed. "Could not check" must not reach the user as "checked, allowed"
  # — that is precisely the state this hook was in before.
  deny "block-dangerous.sh could not parse the PreToolUse payload, so no safety check ran. Nothing was judged on its merits; re-run once you have confirmed the command is safe."
fi

# A longer `rm` guard than the original `rm[[:space:]]+-rf[[:space:]]+/`, which
# also fired on `rm -rf /tmp/scratch`. A rule that trips on routine cleanup is a
# rule people learn to route around, and this one has to hold for the case it
# exists for.
readonly RM_INVOCATION='(^|[;&|(]|[[:space:]])rm([[:space:]]|$)'
readonly RECURSIVE_AND_FORCE='[[:space:]]-([[:alpha:]]*r[[:alpha:]]*f|[[:alpha:]]*f[[:alpha:]]*r)[[:alpha:]]*([[:space:]]|$)'
# `/`, `/*`, `~`, `~/`, `~/*`, `$HOME`, `${HOME}` — the targets that take the
# machine or the account with them.
readonly ROOT_OR_HOME='[[:space:]](/|~|\$HOME|\$\{HOME\})(/?\*?)([[:space:]]|$)'

# `git push --force`, `git push -f`, and the `+refspec` spelling of the same
# thing — but deliberately not `--force-with-lease` or `--force-if-includes`,
# which refuse to overwrite commits the pusher has not seen and so keep the
# property this rule exists to protect. The old regex
# (`git[[:space:]]+push.*--force`) got this backwards on both counts: it matched
# the lease variants by substring, and missed `+refspec` entirely.
readonly FORCE_PUSH='(^|[;&|(]|[[:space:]])git([[:space:]]+-[^[:space:]]+)*[[:space:]]+push([[:space:]]+[^;&|]*)?[[:space:]](--force([[:space:]]|$)|-[[:alnum:]]*f[[:alnum:]]*([[:space:]]|$)|\+[^[:space:]]+)'

# Piping a download straight into a shell. Widened from the original `| sh` to
# cover bash/zsh and an intervening `sudo`, because the risk is identical.
readonly PIPE_TO_SHELL='(curl|wget)[^|]*\|[[:space:]]*(sudo[[:space:]]+)?(ba|z)?sh([[:space:]]|$)'

if [[ "$tool_command" =~ --no-preserve-root ]]; then
  deny "Blocked by .claude/hooks/block-dangerous.sh: --no-preserve-root removes the one guard rm has against deleting /."
fi

if [[ "$tool_command" =~ $RM_INVOCATION ]] &&
  [[ "$tool_command" =~ $RECURSIVE_AND_FORCE ]] &&
  [[ "$tool_command" =~ $ROOT_OR_HOME ]]; then
  deny "Blocked by .claude/hooks/block-dangerous.sh: a recursive, forced rm targeting / or the home directory. Name a specific path instead."
fi

if [[ "$tool_command" =~ $FORCE_PUSH ]]; then
  deny "Blocked by .claude/hooks/block-dangerous.sh: a plain force push discards commits nobody has seen, and the repository ruleset rejects it on main and dev regardless. Use --force-with-lease if a rewrite is genuinely intended."
fi

if [[ "$tool_command" =~ $PIPE_TO_SHELL ]]; then
  deny "Blocked by .claude/hooks/block-dangerous.sh: piping a download into a shell runs code nobody has read. Download it, read it, then run it."
fi

exit 0
