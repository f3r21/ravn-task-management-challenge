---
name: browser-floor
description: browserslist is the single declaration of the browser floor; two lint rules enforce it and neither is redundant.
paths:
  - 'package.json'
  - 'eslint.config.js'
  - 'vite.config.ts'
---

# The browser floor is declared, not inherited

`package.json`'s `browserslist` is the single declaration. `vite.config.ts` converts it into
`build.target` and `eslint.config.js` converts it into a compat lint. Neither writes the numbers
down a second time, because two hand-written copies of one floor drift, and a lint that passes
against a floor the build does not use is worse than no lint.

Both readers accept only the explicit `<browser> >= <version>` form and **throw** on anything
else. A usage-share query such as `defaults` resolves against `caniuse-lite` data that moves on
every bump, so the floor would silently be a different floor next month.

It used to be Vite's `baseline-widely-available` default, which nobody chose and no tool could
read, because it is computed inside Vite. `URL.canParse` went through `gate`, `build` and CI
untouched and threw on every browser in that floor. Firefox sits above the default because that
is Tailwind v4's documented requirement, and the old number was a claim the stylesheet could not
honour. Declaring the floor changed no shipped bytes, the CSS and every JS chunk being
byte-identical. It only made the floor readable by something.

**Two lint rules enforce it and they are not redundant.** `compat/compat` covers bare globals and
members read off a global object. A generated `no-restricted-properties` list covers **static**
members of Web API interfaces, because the plugin's API inventory (`ast-metadata-inferer`) has no
entry for `URL.canParse`, `URL.parse`, `URL.createObjectURL` or
`Notification.requestPermission`. Verified, not assumed. Adopting the plugin alone would have
been adopting a check that cannot fail on the one call it was added for. The generated list
throws if it comes out empty, because that means MDN changed shape rather than that the code got
safe.

**What it structurally cannot see.** Anything reached through a value rather than a name, since
`u.canParse(x)` needs types, which is why an MDN entry only ever matches source that literally
writes the interface name. Also `window.`-prefixed access, which the plugin misses; CSS and HTML
entirely; and any API MDN has no data for. Test files and `src/test/` are exempt on purpose,
because they run in jsdom on Node and reach no browser, and one test shadows `URL.canParse`
deliberately, which the rule would read as the very call it forbids.
