---
name: a11y-structures
description: Two component structures that look like tidiness and are load-bearing, plus the live-region rule.
paths:
  - 'src/ui/**'
  - 'src/features/**/*.tsx'
---

# Two structures that look like tidiness and are not

- **`Dialog` is split into `Dialog` + `ModalContents`.** `useModalOverlay` and `useDialog` ask
  for focus containment through a context `<Overlay>` provides to its _children_. Called in the
  component that renders `<Overlay>`, the request is silently dropped: Tab walks out of the modal
  and Escape stops working. Do not flatten it.
- **The toast region is portalled to `document.body` _and_ marked by `useToastRegion`.** React
  Aria's hiding pass walks out from the body and rejects whole subtrees, so an exempt node nested
  inside a hidden ancestor is never reached. Either half alone leaves notifications unreachable
  exactly when a modal is open, which is when the delete dialog's only error report is a toast.

# Live regions announce changes

One that mounts with its text already inside announces nothing. Three components made this
mistake and all three now use a region that outlives the states and swaps its text. If you add a
loading or an empty state, do the same.

# Roles overlap, so name the dialog

**A React Aria toast is itself `role="alertdialog"`.** An unqualified
`getByRole('alertdialog')` matches both a toast and the delete confirmation.

Every colour, spacing and type value comes from the kit's semantic tokens. Verify spacing,
margins and typography against the Figma spec rather than eyeballing a value.
