#!/usr/bin/env bash
# Block potentially destructive commands in Claude Code execution

COMMAND="$1"

# Check for dangerous patterns
if [[ "$COMMAND" =~ rm[[:space:]]+-rf[[:space:]]+/ ]] || \
   [[ "$COMMAND" =~ git[[:space:]]+push.*--force ]] || \
   [[ "$COMMAND" =~ git[[:space:]]+push.*-f[[:space:]] ]] || \
   [[ "$COMMAND" =~ curl.*\|[[:space:]]*sh ]] || \
   [[ "$COMMAND" =~ wget.*\|[[:space:]]*sh ]]; then
  echo "BLOCKED: Dangerous operation detected in command: $COMMAND" >&2
  exit 1
fi

exit 0
