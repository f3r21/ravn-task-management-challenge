Finish an issue and hand it off. Takes the issue number as an argument.

1. `npm run gate` — green, zero failures.
2. Commit with conventional commits, one concern each, `Closes #<n>` in the final one.

   **That keyword will not close anything by itself here.** GitHub only auto-closes a linked
   issue when the pull request merges into the repository's _default_ branch — which is `main`,
   while every lane PR targets `dev`. The keyword still earns its place: it records the link on
   both the issue and the PR. But **the reviewer closes app issues by hand on merge**, and until
   they do, an open issue is not evidence of unfinished work.

3. Push to the lane's integration branch.
4. Post the handoff comment on the issue. **Use this shape exactly** — the next session reads the "Now true that wasn't" line and little else survives the boundary:

```markdown
### HANDOFF

- **Merged as:** <sha>
- **Touched:** <files, one line>
- **Decided:** <decision → reason, one line each. Omit if none.>
- **Now true that wasn't:** <new export / new script / changed contract. The other lane reads this.>
- **Deliberately not done:** <scope cut → follow-up issue # if opened>
- **Next session should know:** <one sentence, or "nothing beyond the diff">
```

5. If this PR changed **how anyone else builds, tests or merges** — CI, the gate, the `@ravn/ui-kit` dependency contract, branch protection — update `CLAUDE.md` **in the same PR**. Otherwise that knowledge lives only in an issue the other lanes will never read.
6. From the deploy onward, check the **Vercel preview URL**, not just localhost. Several defects in this repo's history were invisible against the mock.

Then stop. Do not merge; the reviewer does that.
