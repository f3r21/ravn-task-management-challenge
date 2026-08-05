# Vendored `@ravn/ui-kit`

`@ravn/ui-kit` normally lives in a sibling repo (`../ravn-ui-kit`, private, no package
registry) and is consumed locally via a `file:../ravn-ui-kit` dependency. CI only checks
out this repo, so that path can never resolve there — `npm ci` fails with `Cannot find
module '@ravn/ui-kit'` the moment anything imports it.

This directory is a built copy, vendored so `package.json`'s dependency
(`file:./vendor/ravn-ui-kit`) resolves the same way locally and in CI. It is **not** a
copy to hand-edit — any change here must come from the sibling repo's own build.

## Re-syncing after a change to `ravn-ui-kit`

```bash
cd ../ravn-ui-kit && npm run build
rm -rf ../ravn-task-management-challenge/vendor/ravn-ui-kit/dist
cp -R dist ../ravn-task-management-challenge/vendor/ravn-ui-kit/dist
```

Then diff `package.json` against the sibling repo's own (`name`, `version`, `main`,
`module`, `types`, `exports`, `files`, `peerDependencies`, `dependencies` only —
`devDependencies`/`scripts` are intentionally dropped here, they're irrelevant to
consumption) and update by hand if anything changed. Run `npm install` at the repo root
afterward so the lockfile picks up the new `dist/` contents, then `npm run gate`.
