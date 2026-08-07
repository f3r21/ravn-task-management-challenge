#!/usr/bin/env bash
#
# Provision a lane worktree that cannot start subtly broken.
#
#   scripts/new-lane.sh <lane-name> [branch]
#
# Setting worktrees up by hand surfaced four silent failures, each found only by
# hitting it (#52). None of them fail loudly: the lane starts, looks fine, and is
# missing something it needs. That is what this script exists to stop — not to
# save typing. It is a port of the kit's `scripts/new-lane.sh`, and the two repos
# differ in three ways that are all called out below.
#
# What is NOT here, and why, because both were checked against THIS repo rather
# than inherited from the kit:
#
#   - Per-worktree MCP enablement. `enabledMcpjsonServers` is set at USER scope
#     in ~/.claude/settings.json, so every worktree inherits it. Verified the way
#     it has to be — by provisioning a lane, DELETING its settings.local.json and
#     running `claude mcp list` there, not by reading the key and inferring:
#       context7: ✔ connected · eslint: ✔ connected
#       playwright: ✔ connected · graphql: ✔ connected
#     The checklist still reads the lists back, because "connected" is not the
#     same as "the tracked config won" — see the shadowing check below.
#
#   - A hand-written permission allowlist. The script copies the primary
#     checkout's `.claude/settings.local.json` instead. That file accumulates
#     approvals a human granted over time; regenerating a guess at it would throw
#     them away and drift from whatever was actually approved. (Claude Code 2.1.223
#     here, past the 2.1.211 that #52 suspected of removing the need for the
#     allowlist — the file is copied because it is a human's record, not because
#     of any one version's classifier behaviour.)
#
# The one step people skip is the gate, and it is the one that matters most: a
# lane starting on a red tree misattributes the failure to its own first change.

set -euo pipefail

# This repo integrates on `dev`; `main` only takes periodic promotions of a
# verified-stable `dev`. The kit's copy of this script says `main`, so this line
# is the single most likely thing to be wrong in a copy-paste — which is why the
# usage message below states it out loud and a test pins that it does.
readonly BASE_BRANCH='dev'

die() {
  printf 'new-lane: %s\n' "$1" >&2
  exit 1
}

usage="usage: scripts/new-lane.sh <lane-name> [branch]  (lanes are cut from origin/$BASE_BRANCH)"
readonly usage

[ $# -ge 1 ] || die "$usage"

readonly LANE="$1"
readonly BRANCH="${2:-int/$LANE}"

# The target is built as `<worktree-root>/<lane>`, so a name carrying a separator
# would place the worktree somewhere nobody asked for — `../..` most of all.
# Rejected rather than sanitised: no legitimate lane name has a slash in it.
case "$LANE" in
*/* | '' | .*) die "lane name must be a single path segment, got '$LANE'
$usage" ;;
esac

# Resolve the MAIN checkout rather than trusting the working directory. Running
# this from an existing worktree and reaching for a relative `../wt/<lane>` is
# the obvious spelling — it is what #52 asked for — and it is wrong: from
# /…/wt/app-1, `..` is already the worktree root, so the new lane lands in
# /…/wt/wt/<lane>. `--git-common-dir` points at the main checkout's `.git` from
# anywhere in the repo, worktree or not.
GIT_COMMON_DIR=$(git rev-parse --path-format=absolute --git-common-dir) ||
  die 'not inside a git repository'
readonly MAIN_CHECKOUT="${GIT_COMMON_DIR%/.git}"
# Split from the declaration on purpose: `readonly x="$(cmd)"` masks cmd's exit
# status, so a failing `dirname` would sail past `set -e` (shellcheck SC2155).
WORKTREE_ROOT="$(dirname "$MAIN_CHECKOUT")/wt"
readonly WORKTREE_ROOT
readonly TARGET="$WORKTREE_ROOT/$LANE"

# A worktree nested inside the repo gets collected by Vitest, ESLint and Prettier
# at once, and its tests resolve the `@` alias to the OUTER src — two copies of
# every module in one graph, and roughly twenty phantom failures belonging to
# neither checkout. `vite.config.ts`, `eslint.config.js` and `.prettierignore`
# each carry a `.worktrees` entry because of that episode. `.git/info/exclude`
# hides such a directory from git but not from a test runner, so the only
# reliable fix is to never create it there.
case "$TARGET/" in
"$MAIN_CHECKOUT"/*) die "refusing to nest a worktree inside the repo: $TARGET" ;;
esac

[ -e "$TARGET" ] && die "already exists: $TARGET"

step() { printf '\n=== %s\n' "$1"; }

step "fetch"
git -C "$MAIN_CHECKOUT" fetch origin --prune

step "worktree add $BRANCH -> $TARGET"
mkdir -p "$WORKTREE_ROOT"
git -C "$MAIN_CHECKOUT" worktree add -b "$BRANCH" "$TARGET" "origin/$BASE_BRANCH"

step "npm ci"
# `npm ci` rather than `npm install`: a lane must run the locked tree, and ci is
# the only one that guarantees it.
(cd "$TARGET" && npm ci)

step "corvus sync (skills)"
# `.claude/skills/` is gitignored per-skill (see the corvus block in
# `.gitignore`), so `git worktree add` brings none of it and a lane starts with
# zero skills. `.corvusrc` is tracked precisely so it reaches every worktree;
# this only stops the restore being forgotten.
if command -v corvus >/dev/null 2>&1; then
  (cd "$TARGET" && corvus sync)
else
  printf 'corvus not on PATH — skills NOT restored; install it, then run "corvus sync" in the worktree\n' >&2
fi

step "local, gitignored files the worktree cannot inherit"
# `.env` is the difference from the kit, where this loop is an unexercised no-op:
# here the file exists, `src/lib/env.ts` requires VITE_API_URL and VITE_API_TOKEN
# together, and a lane without it silently runs the whole session against the MSW
# mock. It cannot break the gate — `vite.config.ts` pins both variables to '' for
# the test run, on purpose and for exactly this reason — so copying it before the
# gate below is safe as well as necessary.
#
# `.env.local` and `.vercel/` are deliberately NOT copied: they are the Vercel
# project link and a ~12-hour OIDC token, so a copy is stale by the time a lane
# reaches for it, and a stale token fails in a way that reads like a bug. A lane
# that needs them runs `vercel link && vercel env pull`.
for rel in .claude/settings.local.json .env; do
  if [ -f "$MAIN_CHECKOUT/$rel" ]; then
    mkdir -p "$(dirname "$TARGET/$rel")"
    cp "$MAIN_CHECKOUT/$rel" "$TARGET/$rel"
    printf 'copied %s\n' "$rel"
  else
    printf 'skipped %s (absent in %s)\n' "$rel" "$MAIN_CHECKOUT"
  fi
done

step "gate"
# The step a human skips, and the one that matters most.
gate_status=0
(cd "$TARGET" && npm run gate) || gate_status=$?

# ---------------------------------------------------------------------------
# Checklist. Every line is a value read back from the provisioned worktree, not a
# restatement of what the script tried to do — the failures this exists to catch
# all look like success from the inside.
# ---------------------------------------------------------------------------
skills_expected=$(sed -n 's/^skills=//p' "$TARGET/.corvusrc" 2>/dev/null | tr ',' '\n' | grep -c . || true)
skills_present=$(find "$TARGET/.claude/skills" -mindepth 1 -maxdepth 1 2>/dev/null | wc -l | tr -d ' ')

# Two ways a lane can end up without the tools it needs, and the second is the
# one that actually bit: a name declared in the tracked `.mcp.json` can ALSO
# exist in the LOCAL scope `claude mcp add` writes into ~/.claude.json, and local
# wins silently. Local scope is keyed by the MAIN checkout's absolute path, and a
# worktree resolves through it — verified in a fresh lane, which reported
# `context7`/`playwright` as "Project config" and `eslint`/`graphql` as "Local
# config", with no project entry of its own anywhere in ~/.claude.json. So a lane
# does not merely miss local-scope servers; it inherits the stale ones, over the
# tracked ones. On this machine that is why `graphql` answers every query
# `TypeError: fetch failed` — the shadowing entry sets GRAPHQL_ENDPOINT and no
# HEADERS, so no endpoint the running mcp-graphql reads and no Authorization
# header at all, while the tracked entry that has both never takes effect.
#
# Reported, not repaired: the fix is `claude mcp remove <name> -s local` in the
# main checkout, which throws away a config a human wrote, and a provisioner has
# no business doing that unasked.
#
# Paths go in as argv rather than being interpolated into the program text, so a
# path containing a quote cannot rewrite the script being run.
mcp_line=$(node -e '
  const fs = require("node:fs")
  const read = (p) => {
    try {
      return JSON.parse(fs.readFileSync(p, "utf8"))
    } catch {
      return null
    }
  }
  const project = read(process.argv[1])
  if (!project) {
    process.stdout.write("(no .mcp.json — MCP servers will NOT reach this lane)")
    process.exit(0)
  }
  const declared = Object.keys(project.mcpServers ?? {})
  const enabled = read(process.argv[2])?.enabledMcpjsonServers ?? []
  const local = Object.keys(read(process.argv[3])?.projects?.[process.argv[4]]?.mcpServers ?? {})
  const notEnabled = declared.filter((name) => !enabled.includes(name))
  const shadowed = declared.filter((name) => local.includes(name))
  process.stdout.write(
    (declared.join(", ") || "(none declared)") +
      (notEnabled.length ? "\n          <-- NOT enabled at user scope: " + notEnabled.join(", ") : "") +
      (shadowed.length
        ? "\n          <-- SHADOWED by local scope, tracked config ignored: " +
          shadowed.join(", ") +
          "\n              fix in the main checkout: claude mcp remove <name> -s local"
        : ""),
  )
' "$TARGET/.mcp.json" "$HOME/.claude/settings.json" "$HOME/.claude.json" "$MAIN_CHECKOUT")

# `grep -c` exits 1 on zero matches, which `set -e` would treat as fatal.
# Matching the idiom CLAUDE.md gives for "is this checkout wired to the live
# API": a token line with something after the `=`. The count, never the value —
# this output gets pasted into public places.
if [ -f "$TARGET/.env" ]; then
  token_count=$(grep -c '^VITE_API_TOKEN=.\+' "$TARGET/.env" || true)
  if [ "$token_count" -gt 0 ]; then
    env_line='.env copied, VITE_API_TOKEN present'
  else
    env_line='.env copied but VITE_API_TOKEN is empty — the lane runs on the MSW mock'
  fi
else
  env_line='.env MISSING — the lane runs on the MSW mock'
fi

printf '\n'
printf '================ lane ready ================\n'
printf 'path      %s\n' "$TARGET"
printf 'branch    %s (from origin/%s)\n' "$BRANCH" "$BASE_BRANCH"
printf 'skills    %s present / %s declared in .corvusrc\n' "$skills_present" "$skills_expected"
printf 'mcp       %s\n' "$mcp_line"
printf 'settings  %s\n' "$([ -f "$TARGET/.claude/settings.local.json" ] && echo 'settings.local.json copied' || echo 'settings.local.json MISSING')"
printf 'env       %s\n' "$env_line"
printf 'gate      exit %s%s\n' "$gate_status" "$([ "$gate_status" -eq 0 ] && echo '' || echo '   <-- RED BEFORE YOU TOUCHED ANYTHING')"
printf '===========================================\n'

# What copying `.env` does NOT buy, stated where it will be read. The file is
# what the APP reads; `.mcp.json` is not the app, and it expands
# `${VITE_API_TOKEN}` from the environment of the shell that launched `claude`.
# A server with no token still starts and still reports "connected", so nothing
# about the lane looks wrong until a query comes back Unauthorized — which reads
# as a broken endpoint rather than a missing export. Printed rather than left to
# be rediscovered.
#
# A heredoc rather than printf: the text contains `$(...)` and single quotes
# verbatim, and every way of spelling that inside a printf format string is
# either wrong or unreadable. `\$` escapes the expansions that must not happen;
# `$TARGET` is the one that must.
cat <<EOF

The .env copy is what the APP needs. The graphql MCP server needs something no
file copy can supply: .mcp.json expands \${VITE_API_TOKEN} from the environment
of the shell that launches claude. Start the session with

    cd $TARGET && export \$(grep -v '^#' .env | xargs) && claude

and then read the mcp line above. If it says SHADOWED, the exported token is
being handed to an entry that never runs, and nothing changes until that is
cleared in the main checkout.
EOF

if [ "$skills_present" != "$skills_expected" ]; then
  printf '\nWARNING: skills %s != %s declared. Run "corvus sync" in the worktree.\n' \
    "$skills_present" "$skills_expected" >&2
fi

if [ "$gate_status" -ne 0 ]; then
  printf '\nThe gate is red on a clean checkout of origin/%s. That failure is not yours —\n' "$BASE_BRANCH"
  printf 'find out who broke it before attributing it to your first change.\n' >&2
fi

exit "$gate_status"
