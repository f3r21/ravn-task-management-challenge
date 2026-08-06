<!--
Written for a reviewer with none of your context: a separate session reads this
before the merge button is available, and this body plus the diff is everything
it gets. Delete the guidance comments as you fill each section in.
-->

## What changed

<!-- The diff in prose. One or two sentences per concern, not a file list — the
     Files tab already has the file list. -->

## Why

<!-- The problem this solves, and what made the chosen approach the right one.
     Alternatives you rejected belong here, because the diff cannot show them. -->

## How it was verified

<!-- What you actually ran, and what you saw. Not "tests pass" — which tests,
     and how you know they would have failed before. `npm run gate` is the
     floor, not the answer. Anything about focus or the accessibility tree gets
     checked in a real browser too; jsdom disagrees with one in both
     directions. From the Vercel deploy onward, check the preview URL, not
     only localhost. -->

- [ ] `npm run gate` is green
- [ ] Behaviour change is covered by a test that fails without the change
- [ ] Comments describing changed behaviour were re-read, not assumed still true

## Second-session review:

<!-- Paste the link to the `gh pr review --comment` from the reviewing session.
     There is one account here and GitHub forbids approving your own pull
     request, so a comment review is what a second opinion looks like — leaving
     this blank means nobody read this but its author. -->

Closes #
