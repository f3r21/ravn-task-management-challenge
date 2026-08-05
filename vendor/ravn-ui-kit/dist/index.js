import { jsx as t, jsxs as c, Fragment as it } from "react/jsx-runtime";
import B, { useRef as A, useState as _e, useMemo as ct } from "react";
import { useButton as fe, useTextField as Ce, useTabList as dt, useTab as ut, useTabPanel as mt, useOverlay as ft, FocusScope as Ue, DismissButton as je, useModalOverlay as pt, useDialog as bt, useCalendar as ht, useCalendarGrid as gt, useCalendarCell as xt, useCheckbox as vt } from "react-aria";
import { useTabListState as yt, Item as wt, useOverlayTriggerState as $e, useCalendarState as kt, useToggleState as Nt } from "react-stately";
import { createCalendar as Ct, getLocalTimeZone as ke, CalendarDate as Pt, today as St, isSameMonth as zt } from "@internationalized/date";
function Ke(e) {
  var r, n, o = "";
  if (typeof e == "string" || typeof e == "number") o += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var s = e.length;
    for (r = 0; r < s; r++) e[r] && (n = Ke(e[r])) && (o && (o += " "), o += n);
  } else for (n in e) e[n] && (o && (o += " "), o += n);
  return o;
}
function Mt() {
  for (var e, r, n = 0, o = "", s = arguments.length; n < s; n++) (e = arguments[n]) && (r = Ke(e)) && (o && (o += " "), o += r);
  return o;
}
const Lt = (e, r) => {
  const n = new Array(e.length + r.length);
  for (let o = 0; o < e.length; o++)
    n[o] = e[o];
  for (let o = 0; o < r.length; o++)
    n[e.length + o] = r[o];
  return n;
}, It = (e, r) => ({
  classGroupId: e,
  validator: r
}), He = (e = /* @__PURE__ */ new Map(), r = null, n) => ({
  nextPart: e,
  validators: r,
  classGroupId: n
}), pe = "-", Ae = [], Tt = "arbitrary..", jt = (e) => {
  const r = Rt(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: o
  } = e;
  return {
    getClassGroupId: (a) => {
      if (a.startsWith("[") && a.endsWith("]"))
        return At(a);
      const i = a.split(pe), f = i[0] === "" && i.length > 1 ? 1 : 0;
      return Ye(i, f, r);
    },
    getConflictingClassGroupIds: (a, i) => {
      if (i) {
        const f = o[a], d = n[a];
        return f ? d ? Lt(d, f) : f : d || Ae;
      }
      return n[a] || Ae;
    }
  };
}, Ye = (e, r, n) => {
  if (e.length - r === 0)
    return n.classGroupId;
  const s = e[r], l = n.nextPart.get(s);
  if (l) {
    const d = Ye(e, r + 1, l);
    if (d) return d;
  }
  const a = n.validators;
  if (a === null)
    return;
  const i = r === 0 ? e.join(pe) : e.slice(r).join(pe), f = a.length;
  for (let d = 0; d < f; d++) {
    const x = a[d];
    if (x.validator(i))
      return x.classGroupId;
  }
}, At = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const r = e.slice(1, -1), n = r.indexOf(":"), o = r.slice(0, n);
  return o ? Tt + o : void 0;
})(), Rt = (e) => {
  const {
    theme: r,
    classGroups: n
  } = e;
  return Dt(n, r);
}, Dt = (e, r) => {
  const n = He();
  for (const o in e) {
    const s = e[o];
    Pe(s, n, o, r);
  }
  return n;
}, Pe = (e, r, n, o) => {
  const s = e.length;
  for (let l = 0; l < s; l++) {
    const a = e[l];
    Wt(a, r, n, o);
  }
}, Wt = (e, r, n, o) => {
  if (typeof e == "string") {
    Ot(e, r, n);
    return;
  }
  if (typeof e == "function") {
    Bt(e, r, n, o);
    return;
  }
  Gt(e, r, n, o);
}, Ot = (e, r, n) => {
  const o = e === "" ? r : Xe(r, e);
  o.classGroupId = n;
}, Bt = (e, r, n, o) => {
  if (Et(e)) {
    Pe(e(o), r, n, o);
    return;
  }
  r.validators === null && (r.validators = []), r.validators.push(It(n, e));
}, Gt = (e, r, n, o) => {
  const s = Object.entries(e), l = s.length;
  for (let a = 0; a < l; a++) {
    const [i, f] = s[a];
    Pe(f, Xe(r, i), n, o);
  }
}, Xe = (e, r) => {
  let n = e;
  const o = r.split(pe), s = o.length;
  for (let l = 0; l < s; l++) {
    const a = o[l];
    let i = n.nextPart.get(a);
    i || (i = He(), n.nextPart.set(a, i)), n = i;
  }
  return n;
}, Et = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, Vt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, n = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ Object.create(null);
  const s = (l, a) => {
    n[l] = a, r++, r > e && (r = 0, o = n, n = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(l) {
      let a = n[l];
      if (a !== void 0)
        return a;
      if ((a = o[l]) !== void 0)
        return s(l, a), a;
    },
    set(l, a) {
      l in n ? n[l] = a : s(l, a);
    }
  };
}, Ne = "!", Re = ":", Ft = [], De = (e, r, n, o, s) => ({
  modifiers: e,
  hasImportantModifier: r,
  baseClassName: n,
  maybePostfixModifierPosition: o,
  isExternal: s
}), _t = (e) => {
  const {
    prefix: r,
    experimentalParseClassName: n
  } = e;
  let o = (s) => {
    const l = [];
    let a = 0, i = 0, f = 0, d;
    const x = s.length;
    for (let w = 0; w < x; w++) {
      const P = s[w];
      if (a === 0 && i === 0) {
        if (P === Re) {
          l.push(s.slice(f, w)), f = w + 1;
          continue;
        }
        if (P === "/") {
          d = w;
          continue;
        }
      }
      P === "[" ? a++ : P === "]" ? a-- : P === "(" ? i++ : P === ")" && i--;
    }
    const h = l.length === 0 ? s : s.slice(f);
    let k = h, y = !1;
    h.endsWith(Ne) ? (k = h.slice(0, -1), y = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      h.startsWith(Ne) && (k = h.slice(1), y = !0)
    );
    const C = d && d > f ? d - f : void 0;
    return De(l, y, k, C);
  };
  if (r) {
    const s = r + Re, l = o;
    o = (a) => a.startsWith(s) ? l(a.slice(s.length)) : De(Ft, !1, a, void 0, !0);
  }
  if (n) {
    const s = o;
    o = (l) => n({
      className: l,
      parseClassName: s
    });
  }
  return o;
}, Ut = (e) => {
  const r = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((n, o) => {
    r.set(n, 1e6 + o);
  }), (n) => {
    const o = [];
    let s = [];
    for (let l = 0; l < n.length; l++) {
      const a = n[l], i = a[0] === "[", f = r.has(a);
      i || f ? (s.length > 0 && (s.sort(), o.push(...s), s = []), o.push(a)) : s.push(a);
    }
    return s.length > 0 && (s.sort(), o.push(...s)), o;
  };
}, $t = (e) => ({
  cache: Vt(e.cacheSize),
  parseClassName: _t(e),
  sortModifiers: Ut(e),
  postfixLookupClassGroupIds: Kt(e),
  ...jt(e)
}), Kt = (e) => {
  const r = /* @__PURE__ */ Object.create(null), n = e.postfixLookupClassGroups;
  if (n)
    for (let o = 0; o < n.length; o++)
      r[n[o]] = !0;
  return r;
}, Ht = /\s+/, Yt = (e, r) => {
  const {
    parseClassName: n,
    getClassGroupId: o,
    getConflictingClassGroupIds: s,
    sortModifiers: l,
    postfixLookupClassGroupIds: a
  } = r, i = [], f = e.trim().split(Ht);
  let d = "";
  for (let x = f.length - 1; x >= 0; x -= 1) {
    const h = f[x], {
      isExternal: k,
      modifiers: y,
      hasImportantModifier: C,
      baseClassName: w,
      maybePostfixModifierPosition: P
    } = n(h);
    if (k) {
      d = h + (d.length > 0 ? " " + d : d);
      continue;
    }
    let j = !!P, z;
    if (j) {
      const I = w.substring(0, P);
      z = o(I);
      const p = z && a[z] ? o(w) : void 0;
      p && p !== z && (z = p, j = !1);
    } else
      z = o(w);
    if (!z) {
      if (!j) {
        d = h + (d.length > 0 ? " " + d : d);
        continue;
      }
      if (z = o(w), !z) {
        d = h + (d.length > 0 ? " " + d : d);
        continue;
      }
      j = !1;
    }
    const V = y.length === 0 ? "" : y.length === 1 ? y[0] : l(y).join(":"), _ = C ? V + Ne : V, M = _ + z;
    if (i.indexOf(M) > -1)
      continue;
    i.push(M);
    const W = s(z, j);
    for (let I = 0; I < W.length; ++I) {
      const p = W[I];
      i.push(_ + p);
    }
    d = h + (d.length > 0 ? " " + d : d);
  }
  return d;
}, Xt = (...e) => {
  let r = 0, n, o, s = "";
  for (; r < e.length; )
    (n = e[r++]) && (o = qe(n)) && (s && (s += " "), s += o);
  return s;
}, qe = (e) => {
  if (typeof e == "string")
    return e;
  let r, n = "";
  for (let o = 0; o < e.length; o++)
    e[o] && (r = qe(e[o])) && (n && (n += " "), n += r);
  return n;
}, qt = (e, ...r) => {
  let n, o, s, l;
  const a = (f) => {
    const d = r.reduce((x, h) => h(x), e());
    return n = $t(d), o = n.cache.get, s = n.cache.set, l = i, i(f);
  }, i = (f) => {
    const d = o(f);
    if (d)
      return d;
    const x = Yt(f, n);
    return s(f, x), x;
  };
  return l = a, (...f) => l(Xt(...f));
}, Jt = [], S = (e) => {
  const r = (n) => n[e] || Jt;
  return r.isThemeGetter = !0, r;
}, Je = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Qe = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Qt = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Zt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, er = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, tr = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, rr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, nr = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Y = (e) => Qt.test(e), v = (e) => !!e && !Number.isNaN(Number(e)), F = (e) => !!e && Number.isInteger(Number(e)), ye = (e) => e.endsWith("%") && v(e.slice(0, -1)), $ = (e) => Zt.test(e), Ze = () => !0, or = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  er.test(e) && !tr.test(e)
), Se = () => !1, sr = (e) => rr.test(e), lr = (e) => nr.test(e), ar = (e) => !u(e) && !m(e), ir = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), cr = (e) => q(e, rt, Se), u = (e) => Je.test(e), Q = (e) => q(e, nt, or), We = (e) => q(e, gr, v), dr = (e) => q(e, st, Ze), ur = (e) => q(e, ot, Se), Oe = (e) => q(e, et, Se), mr = (e) => q(e, tt, lr), ue = (e) => q(e, lt, sr), m = (e) => Qe.test(e), oe = (e) => Z(e, nt), fr = (e) => Z(e, ot), Be = (e) => Z(e, et), pr = (e) => Z(e, rt), br = (e) => Z(e, tt), me = (e) => Z(e, lt, !0), hr = (e) => Z(e, st, !0), q = (e, r, n) => {
  const o = Je.exec(e);
  return o ? o[1] ? r(o[1]) : n(o[2]) : !1;
}, Z = (e, r, n = !1) => {
  const o = Qe.exec(e);
  return o ? o[1] ? r(o[1]) : n : !1;
}, et = (e) => e === "position" || e === "percentage", tt = (e) => e === "image" || e === "url", rt = (e) => e === "length" || e === "size" || e === "bg-size", nt = (e) => e === "length", gr = (e) => e === "number", ot = (e) => e === "family-name", st = (e) => e === "number" || e === "weight", lt = (e) => e === "shadow", xr = () => {
  const e = S("color"), r = S("font"), n = S("text"), o = S("font-weight"), s = S("tracking"), l = S("leading"), a = S("breakpoint"), i = S("container"), f = S("spacing"), d = S("radius"), x = S("shadow"), h = S("inset-shadow"), k = S("text-shadow"), y = S("drop-shadow"), C = S("blur"), w = S("perspective"), P = S("aspect"), j = S("ease"), z = S("animate"), V = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], _ = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], M = () => [..._(), m, u], W = () => ["auto", "hidden", "clip", "visible", "scroll"], I = () => ["auto", "contain", "none"], p = () => [m, u, f], T = () => [Y, "full", "auto", ...p()], ee = () => [F, "none", "subgrid", m, u], te = () => ["auto", {
    span: ["full", F, m, u]
  }, F, m, u], J = () => [F, "auto", m, u], re = () => ["auto", "min", "max", "fr", m, u], ne = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], H = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], N = () => ["auto", ...p()], U = () => [Y, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...p()], he = () => [Y, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...p()], ge = () => [Y, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...p()], g = () => [e, m, u], ze = () => [..._(), Be, Oe, {
    position: [m, u]
  }], Me = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], Le = () => ["auto", "cover", "contain", pr, cr, {
    size: [m, u]
  }], xe = () => [ye, oe, Q], R = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    d,
    m,
    u
  ], D = () => ["", v, oe, Q], ae = () => ["solid", "dashed", "dotted", "double"], Ie = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], L = () => [v, ye, Be, Oe], Te = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    C,
    m,
    u
  ], ie = () => ["none", v, m, u], ce = () => ["none", v, m, u], ve = () => [v, m, u], de = () => [Y, "full", ...p()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [$],
      breakpoint: [$],
      color: [Ze],
      container: [$],
      "drop-shadow": [$],
      ease: ["in", "out", "in-out"],
      font: [ar],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [$],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [$],
      shadow: [$],
      spacing: ["px", v],
      text: [$],
      "text-shadow": [$],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", Y, u, m, P]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Container Type
       * @see https://tailwindcss.com/docs/responsive-design#container-queries
       */
      "container-type": [{
        "@container": ["", "normal", "size", m, u]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [ir],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [v, u, m, i]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": V()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": V()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: M()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: W()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": W()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": W()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: I()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": I()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": I()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: T()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": T()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": T()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": T(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: T()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": T(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: T()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": T()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": T()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: T()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: T()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: T()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: T()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [F, "auto", m, u]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Y, "full", "auto", i, ...p()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [v, Y, "auto", "initial", "none", u]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", v, m, u]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", v, m, u]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [F, "first", "last", "none", m, u]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": ee()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: te()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": J()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": J()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": ee()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: te()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": J()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": J()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": re()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": re()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: p()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": p()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": p()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...ne(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...H(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...H()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...ne()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...H(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...H(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": ne()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...H(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...H()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: p()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: p()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: p()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: p()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: p()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: p()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: p()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: p()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: p()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: p()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: p()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: N()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: N()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: N()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: N()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: N()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: N()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: N()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: N()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: N()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: N()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: N()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": p()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": p()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: U()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...he()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...he()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...he()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...ge()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...ge()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...ge()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [i, "screen", ...U()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          i,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...U()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          i,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [a]
          },
          ...U()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...U()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...U()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...U()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", n, oe, Q]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [o, hr, dr]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", ye, u]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [fr, ur, r]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [u]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [s, m, u]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [v, "none", m, We]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          l,
          ...p()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", m, u]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", m, u]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: g()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: g()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...ae(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [v, "from-font", "auto", m, Q]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: g()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [v, "auto", m, u]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: p()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [F, m, u]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", m, u]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", m, u]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: ze()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: Me()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: Le()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, F, m, u],
          radial: ["", m, u],
          conic: [F, m, u]
        }, br, mr]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: g()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: xe()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: xe()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: xe()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: g()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: g()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: g()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: R()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": R()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": R()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": R()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": R()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": R()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": R()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": R()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": R()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": R()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": R()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": R()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": R()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": R()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": R()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: D()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": D()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": D()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": D()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": D()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": D()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": D()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": D()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": D()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": D()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": D()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": D()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": D()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...ae(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...ae(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: g()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": g()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": g()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": g()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": g()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": g()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": g()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": g()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": g()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": g()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": g()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: g()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...ae(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [v, m, u]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", v, oe, Q]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: g()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          x,
          me,
          ue
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: g()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", h, me, ue]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": g()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: D()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: g()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [v, Q]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": g()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": D()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": g()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", k, me, ue]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": g()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [v, m, u]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Ie(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Ie()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [v]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": L()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": L()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": g()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": g()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": L()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": L()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": g()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": g()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": L()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": L()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": g()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": g()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": L()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": L()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": g()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": g()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": L()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": L()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": g()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": g()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": L()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": L()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": g()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": g()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": L()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": L()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": g()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": g()
      }],
      "mask-image-radial": [{
        "mask-radial": [m, u]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": L()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": L()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": g()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": g()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": _()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [v]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": L()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": L()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": g()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": g()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: ze()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: Me()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: Le()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", m, u]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          m,
          u
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: Te()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [v, m, u]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [v, m, u]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          y,
          me,
          ue
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": g()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", v, m, u]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [v, m, u]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", v, m, u]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [v, m, u]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", v, m, u]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          m,
          u
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": Te()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [v, m, u]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [v, m, u]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", v, m, u]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [v, m, u]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", v, m, u]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [v, m, u]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [v, m, u]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", v, m, u]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": p()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": p()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": p()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", m, u]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [v, "initial", m, u]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", j, m, u]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [v, m, u]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", z, m, u]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [w, m, u]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": M()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: ie()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": ie()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": ie()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": ie()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: ce()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": ce()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": ce()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": ce()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: ve()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": ve()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": ve()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [m, u, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: M()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: de()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": de()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": de()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": de()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      /**
       * Zoom
       * @see https://tailwindcss.com/docs/zoom
       */
      zoom: [{
        zoom: [F, m, u]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: g()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: g()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", m, u]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scrollbar Thumb Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-thumb-color": [{
        "scrollbar-thumb": g()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": g()
      }],
      /**
       * Scrollbar Gutter
       * @see https://tailwindcss.com/docs/scrollbar-gutter
       */
      "scrollbar-gutter": [{
        "scrollbar-gutter": ["auto", "stable", "both"]
      }],
      /**
       * Scrollbar Width
       * @see https://tailwindcss.com/docs/scrollbar-width
       */
      "scrollbar-w": [{
        scrollbar: ["auto", "thin", "none"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": p()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": p()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": p()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": p()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": p()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": p()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": p()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": p()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": p()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": p()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": p()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": p()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": p()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": p()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": p()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": p()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": p()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": p()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": p()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": p()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": p()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": p()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", m, u]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...g()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [v, oe, Q, We]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...g()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      "container-named": ["container-type"],
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    postfixLookupClassGroups: ["container-type"],
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, vr = /* @__PURE__ */ qt(xr);
function b(...e) {
  return vr(Mt(e));
}
function Ge({
  variant: e = "secondary",
  isSelected: r = !1,
  children: n,
  className: o,
  isDisabled: s,
  ...l
}) {
  const a = A(null), { buttonProps: i } = fe({ ...l, isDisabled: s }, a);
  return /* @__PURE__ */ t(
    "button",
    {
      ...i,
      ref: a,
      className: b(
        "inline-flex items-center justify-center w-10 h-10 rounded-sm transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          primary: "bg-primary-4 text-main border border-transparent",
          secondary: r ? "bg-transparent text-interactive border border-primary-4" : "bg-transparent text-main border border-transparent"
        }[e],
        o
      ),
      children: /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0 [&>svg]:w-full [&>svg]:h-full", children: n })
    }
  );
}
function Ee({
  variant: e = "primary",
  isSelected: r = !1,
  className: n,
  isDisabled: o,
  ...s
}) {
  const l = A(null), { buttonProps: a } = fe({ ...s, isDisabled: o }, l), i = {
    primary: b(
      "text-main",
      o ? "bg-primary-2" : r ? "bg-primary-3" : "bg-primary-4 hover:bg-primary-2"
    ),
    secondary: o ? "bg-transparent text-muted" : r ? "bg-neutral-3 text-main" : "bg-transparent text-main hover:bg-neutral-2"
  };
  return /* @__PURE__ */ t(
    "button",
    {
      ...a,
      ref: l,
      className: b(
        "inline-flex items-center justify-center p-2 text-body-m font-normal rounded-sm transition-colors cursor-pointer font-sans select-none outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:pointer-events-none",
        i[e],
        n
      ),
      children: s.children
    }
  );
}
function un({ label: e, error: r, className: n, ...o }) {
  const s = A(null), { labelProps: l, inputProps: a, errorMessageProps: i } = Ce(
    { ...o, label: e, isInvalid: !!r, errorMessage: r },
    s
  );
  return /* @__PURE__ */ c("div", { className: "flex flex-col gap-1.5 w-full", children: [
    e ? /* @__PURE__ */ t(
      "label",
      {
        ...l,
        className: "text-field-label font-semibold text-neutral-3 uppercase font-sans",
        children: e
      }
    ) : null,
    /* @__PURE__ */ t(
      "input",
      {
        ...a,
        ref: s,
        className: b(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md placeholder:text-muted transition-colors outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral",
          r && "border-danger-5 focus-visible:outline-danger-5",
          n
        )
      }
    ),
    r ? /* @__PURE__ */ t("span", { ...i, className: "text-xs text-danger font-sans", children: r }) : null
  ] });
}
function yr({
  placeholder: e = "Search...",
  value: r,
  onChange: n,
  onSubmit: o,
  className: s
}) {
  const [l, a] = _e(""), i = r !== void 0, f = i ? r : l, d = A(null), { inputProps: x } = Ce(
    {
      value: f,
      onChange: (h) => {
        i || a(h), n == null || n(h);
      },
      onKeyDown: (h) => {
        h.key === "Enter" && (o == null || o(f));
      },
      "aria-label": "Search",
      placeholder: e
    },
    d
  );
  return /* @__PURE__ */ c("div", { className: b("inline-flex items-center gap-6 min-w-0", s), children: [
    /* @__PURE__ */ c(
      "svg",
      {
        className: "w-6 h-6 text-muted shrink-0",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        "aria-hidden": !0,
        children: [
          /* @__PURE__ */ t("circle", { cx: "11", cy: "11", r: "8" }),
          /* @__PURE__ */ t("path", { d: "m21 21-4.35-4.35", strokeLinecap: "round" })
        ]
      }
    ),
    /* @__PURE__ */ t(
      "input",
      {
        ...x,
        ref: d,
        className: "flex-1 bg-transparent text-body-m text-main placeholder:text-muted outline-none font-sans min-w-0"
      }
    )
  ] });
}
function le({ src: e, name: r, size: n = "md", className: o }) {
  const s = {
    sm: "w-8 h-8 text-xs font-semibold",
    md: "w-10 h-10 text-sm font-semibold",
    lg: "w-12 h-12 text-base font-bold"
  }, l = (a) => {
    if (!a) return "?";
    const i = a.trim().split(" ");
    return i.length >= 2 ? `${i[0][0]}${i[1][0]}`.toUpperCase() : i[0].substring(0, 2).toUpperCase();
  };
  return /* @__PURE__ */ t(
    "div",
    {
      className: b(
        // text-primary-4 kept raw, not aliased to `text-interactive` — this is a decorative
        // accent-tint/accent-text color pairing (bg-primary-1 + text-primary-4), not an
        // interactive affordance; avatars aren't inherently clickable.
        "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-1 text-primary-4 select-none shrink-0",
        s[n],
        o
      ),
      children: e ? /* @__PURE__ */ t(
        "img",
        {
          src: e,
          alt: r || "User avatar",
          className: "w-full h-full object-cover"
        }
      ) : /* @__PURE__ */ t("span", { children: l(r) })
    }
  );
}
function wr() {
  return /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: [
    /* @__PURE__ */ t("path", { d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" }),
    /* @__PURE__ */ t("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
  ] });
}
function kr() {
  return /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M18 6 6 18M6 6l12 12" }) });
}
function Nr({
  searchValue: e,
  searchPlaceholder: r,
  onSearchChange: n,
  onSearchSubmit: o,
  icon: s,
  userName: l,
  userAvatar: a,
  className: i
}) {
  const [f, d] = _e(""), x = e !== void 0, h = x ? e : f, k = (C) => {
    x || d(C), n == null || n(C);
  }, y = () => {
    x || d(""), n == null || n("");
  };
  return /* @__PURE__ */ c(
    "header",
    {
      className: b(
        "flex items-center justify-between gap-6 px-6 py-3 bg-surface-panel rounded-md",
        i
      ),
      children: [
        /* @__PURE__ */ t(
          yr,
          {
            placeholder: r,
            value: h,
            onChange: k,
            onSubmit: o,
            className: "flex-1"
          }
        ),
        /* @__PURE__ */ c("div", { className: "flex items-center gap-6 shrink-0", children: [
          h ? /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              onClick: y,
              "aria-label": "Clear search",
              className: "w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-xs [&>svg]:w-full [&>svg]:h-full",
              children: /* @__PURE__ */ t(kr, {})
            }
          ) : null,
          /* @__PURE__ */ t("span", { className: "w-6 h-6 text-muted shrink-0 [&>svg]:w-full [&>svg]:h-full", children: s ?? /* @__PURE__ */ t(wr, {}) }),
          l || a ? /* @__PURE__ */ t(le, { src: a, name: l, size: "md" }) : null
        ] })
      ]
    }
  );
}
function mn({
  items: e,
  panels: r,
  defaultSelectedKey: n,
  selectedKey: o,
  onSelectionChange: s,
  className: l
}) {
  var x;
  const a = ct(() => new Map(e.map((h) => [h.id, h])), [e]), i = yt({
    items: e,
    selectedKey: o,
    defaultSelectedKey: n ?? ((x = e[0]) == null ? void 0 : x.id),
    onSelectionChange: (h) => s == null ? void 0 : s(String(h)),
    children: (h) => /* @__PURE__ */ t(wt, { textValue: h.label, children: h.label }, h.id)
  }), f = A(null), { tabListProps: d } = dt(
    { "aria-label": "Tab navigation" },
    i,
    f
  );
  return /* @__PURE__ */ c("div", { className: b("flex flex-col", l), children: [
    /* @__PURE__ */ t("div", { ...d, ref: f, className: "flex items-end", children: [...i.collection].map((h) => {
      var k;
      return /* @__PURE__ */ t(Cr, { item: h, state: i, icon: (k = a.get(String(h.key))) == null ? void 0 : k.icon }, h.key);
    }) }),
    r ? /* @__PURE__ */ t(Pr, { state: i, panels: r }) : null
  ] });
}
function Cr({ item: e, state: r, icon: n }) {
  const o = A(null), { tabProps: s, isSelected: l } = ut({ key: e.key }, r, o);
  return /* @__PURE__ */ c(
    "button",
    {
      ...s,
      ref: o,
      type: "button",
      className: b(
        // Figma "Tabs" Frame 299: padding 12px 0px 8px (asymmetric
        // vertical padding around the label) -- was symmetric py-3.5.
        // Horizontal padding (px-5) is kept: Figma's own value there
        // is 0px, but that's an artifact of a fixed-width (120px)
        // demo box, not a real horizontal-padding spec for
        // arbitrary-length labels.
        "relative flex items-center justify-center gap-2 px-5 pt-3 pb-2 text-tab-label font-normal text-center font-sans transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
        l ? "text-interactive" : "text-muted hover:text-main"
      ),
      children: [
        n ? /* @__PURE__ */ t("span", { className: "text-base leading-none", children: n }) : null,
        e.rendered ?? e.textValue,
        l ? /* @__PURE__ */ t("span", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary-4" }) : null
      ]
    }
  );
}
function Pr({ state: e, panels: r }) {
  const n = A(null), { tabPanelProps: o } = mt({}, e, n), s = e.selectedKey != null ? String(e.selectedKey) : "";
  return /* @__PURE__ */ t("div", { ...o, ref: n, className: "flex-1", children: r[s] ?? null });
}
function fn({
  options: e,
  value: r,
  defaultValue: n,
  onChange: o,
  className: s
}) {
  var k;
  const [l, a] = B.useState(
    n ?? ((k = e[0]) == null ? void 0 : k.id) ?? ""
  ), i = r !== void 0, f = i ? r : l, d = A([]), x = (y) => {
    i || a(y), o == null || o(y);
  }, h = (y) => {
    var j;
    const C = e.findIndex((z) => z.id === f);
    if (C === -1) return;
    let w = null;
    switch (y.key) {
      case "ArrowRight":
      case "ArrowDown":
        w = (C + 1) % e.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        w = (C - 1 + e.length) % e.length;
        break;
      case "Home":
        w = 0;
        break;
      case "End":
        w = e.length - 1;
        break;
      default:
        return;
    }
    y.preventDefault();
    const P = e[w];
    x(P.id), (j = d.current[w]) == null || j.focus();
  };
  return /* @__PURE__ */ t(
    "div",
    {
      role: "radiogroup",
      "aria-label": "View",
      className: b(
        "inline-flex items-center gap-0 p-1 bg-surface-panel rounded-10",
        s
      ),
      children: e.map((y, C) => {
        const w = f === y.id;
        return /* @__PURE__ */ c(
          "button",
          {
            ref: (P) => {
              d.current[C] = P;
            },
            type: "button",
            role: "radio",
            "aria-checked": w,
            tabIndex: w ? 0 : -1,
            onClick: () => x(y.id),
            onKeyDown: h,
            className: b(
              "inline-flex items-center justify-center gap-2 h-8 px-6 py-1 text-control-label font-normal rounded-sm transition-all cursor-pointer font-sans select-none text-main outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
              w ? "bg-neutral-2 shadow-small" : ""
            ),
            children: [
              y.icon ? /* @__PURE__ */ t("span", { className: "text-base leading-none", children: y.icon }) : null,
              y.label
            ]
          },
          y.id
        );
      })
    }
  );
}
function pn({ children: e, className: r, ...n }) {
  return /* @__PURE__ */ t(
    "div",
    {
      ...n,
      className: b(
        "p-5 bg-surface-neutral border border-subtle rounded-lg shadow-xs transition-shadow hover:shadow-sm",
        r
      ),
      children: e
    }
  );
}
function K({
  variant: e = "neutral",
  outline: r = !1,
  icon: n,
  children: o,
  onRemove: s,
  className: l
}) {
  const a = {
    neutral: {
      solid: "bg-neutral-2/10 text-main",
      outline: "border border-neutral-1 text-main"
    },
    // text-primary-4 kept raw here, not aliased to `text-interactive` — this is Tag's own
    // categorical "primary" color variant (parallel to secondary/tertiary/blue), not an
    // interactive affordance; aliasing it would wrongly imply every primary-colored tag is
    // interactive.
    primary: {
      solid: "bg-primary-4/10 text-primary-4",
      outline: "border border-primary-4 text-primary-4"
    },
    secondary: {
      solid: "bg-secondary-4/10 text-secondary-4",
      outline: "border border-secondary-4 text-secondary-4"
    },
    tertiary: {
      solid: "bg-tertiary-4/10 text-tertiary-4",
      outline: "border border-tertiary-4 text-tertiary-4"
    },
    blue: {
      solid: "bg-blue/10 text-blue",
      outline: "border border-blue text-blue"
    }
  };
  return /* @__PURE__ */ c(
    "span",
    {
      className: b(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Tag" component exactly (Style=Solid/Outline,
        // all Type variants, Tags00/01.md). Typography: Desktop/Body/M/bold - SF Pro
        // Display, 15px/24px, letter-spacing 0.75px (tracking-wider @ 15px), weight 600.
        "inline-flex items-center gap-2 px-4 py-1 text-body-m font-semibold rounded font-sans select-none",
        r ? a[e].outline : a[e].solid,
        l
      ),
      children: [
        n ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0", children: n }) : null,
        o,
        s ? /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: s,
            "aria-label": "Remove tag",
            className: "hover:opacity-75 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
            children: "×"
          }
        ) : null
      ]
    }
  );
}
function at({ title: e, icon: r, className: n }) {
  return /* @__PURE__ */ c("div", { className: b("flex items-center gap-2 w-full", n), children: [
    /* @__PURE__ */ t("h3", { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: e }),
    r ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0 text-muted", children: r }) : null
  ] });
}
function Sr({ badges: e, className: r }) {
  return (
    // gap-4 matches Figma's "Frame 653" gap (16px, Cards01.md L614 / Cards00.md L657).
    /* @__PURE__ */ t("div", { className: b("flex flex-wrap items-center gap-4", r), children: e.map((n) => /* @__PURE__ */ c(
      "span",
      {
        className: "inline-flex items-center gap-1 text-body-m font-normal font-sans text-main",
        "aria-label": n.label,
        children: [
          n.count !== void 0 ? /* @__PURE__ */ t("span", { className: "tabular-nums", "aria-hidden": !0, children: n.count }) : null,
          /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", "aria-hidden": !0, children: n.icon })
        ]
      },
      n.label
    )) })
  );
}
const zr = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("circle", { cx: "12", cy: "13", r: "8" }),
  /* @__PURE__ */ t("path", { d: "M12 9v4l3 2" }),
  /* @__PURE__ */ t("path", { d: "M5 3 2 6M22 6l-3-3" })
] }), Mr = {
  normal: "neutral",
  warning: "tertiary",
  overdue: "primary"
};
function Lr({
  title: e,
  points: r,
  dueDateText: n,
  dueDateUrgency: o = "normal",
  tags: s = [],
  assigneeName: l,
  assigneeAvatar: a,
  metaBadges: i = [],
  className: f,
  onClick: d
}) {
  return /* @__PURE__ */ c(
    "div",
    {
      onClick: d,
      role: d ? "button" : void 0,
      tabIndex: d ? 0 : void 0,
      onKeyDown: d ? (x) => {
        (x.key === "Enter" || x.key === " ") && (x.preventDefault(), d());
      } : void 0,
      className: b(
        // radius-sm (8px) matches Figma's "Task Card" border-radius exactly (Cards01.md L246);
        // rounded-lg here previously resolved to this project's --radius-lg (24px), far too round.
        // No border is ever rendered on the card in the export, so the resting border is transparent
        // (kept as a real border utility, not removed, so the hover reveal below still works).
        "flex flex-col gap-4 p-4 bg-surface-panel text-main rounded-sm border border-transparent shadow-xs hover:border-subtle transition-all cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
        f
      ),
      children: [
        /* @__PURE__ */ t(at, { title: e }),
        r !== void 0 || n ? /* @__PURE__ */ c("div", { className: "flex items-center justify-between gap-2", children: [
          r !== void 0 ? (
            // Desktop/Body/M/bold: SF Pro Display, 15px/24px, weight 600, letter-spacing 0.75px
            // (tracking-wider, exact at this size). Was previously `text-sm font-bold` (14px/700).
            /* @__PURE__ */ c("span", { className: "text-body-m font-semibold text-main font-sans", children: [
              r,
              " Pts"
            ] })
          ) : null,
          n ? (
            // The due-date pill IS a real "Tag" instance per spec (padding 4px 16px, gap 8px,
            // radius 4px, alarm-line icon, Desktop/Body/M/bold) — reusing `Tag` directly instead
            // of a bespoke span gets typography/spacing/color right for free.
            /* @__PURE__ */ t(K, { variant: Mr[o], icon: /* @__PURE__ */ t(zr, {}), children: n })
          ) : null
        ] }) : null,
        s.length > 0 ? /* @__PURE__ */ t("div", { className: "flex flex-wrap items-center gap-2", children: s.map((x, h) => /* @__PURE__ */ t(K, { variant: x.variant || "neutral", children: x.label }, h)) }) : null,
        /* @__PURE__ */ c("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ c("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ t(le, { src: a, name: l, size: "sm" }),
            l ? /* @__PURE__ */ t("span", { className: "font-sans text-xs font-medium text-muted truncate max-w-[120px]", children: l }) : null
          ] }),
          i.length > 0 ? /* @__PURE__ */ t(Sr, { badges: i }) : null
        ] })
      ]
    }
  );
}
function G({ className: e }) {
  return /* @__PURE__ */ t(
    "div",
    {
      "aria-hidden": !0,
      className: b("animate-pulse rounded-sm bg-neutral-3", e)
    }
  );
}
function we() {
  return /* @__PURE__ */ c("div", { className: "flex flex-col gap-4 p-4 bg-surface-panel rounded-sm border border-transparent", children: [
    /* @__PURE__ */ t(G, { className: "h-6 w-3/4" }),
    /* @__PURE__ */ c("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t(G, { className: "h-6 w-16" }),
      /* @__PURE__ */ t(G, { className: "h-6 w-20 rounded" })
    ] }),
    /* @__PURE__ */ t("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ t(G, { className: "w-8 h-8 rounded-full" }),
      /* @__PURE__ */ t(G, { className: "h-3 w-20" })
    ] }) })
  ] });
}
function bn({ title: e, icon: r, tasks: n, isLoading: o = !1, className: s }) {
  return /* @__PURE__ */ c("div", { className: b("flex flex-col gap-4 w-full", s), children: [
    /* @__PURE__ */ t(at, { title: e, icon: r }),
    o ? /* @__PURE__ */ c(it, { children: [
      /* @__PURE__ */ t(we, {}),
      /* @__PURE__ */ t(we, {}),
      /* @__PURE__ */ t(we, {})
    ] }) : n.length === 0 ? /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-16 text-muted font-sans text-sm", children: "No tasks in this view." }) : n.map((l, a) => /* @__PURE__ */ t(Lr, { ...l, className: "w-full" }, a))
  ] });
}
const O = {
  name: 500,
  tags: 168,
  estimation: 140,
  assignee: 168,
  dueDate: 132
}, Ir = ({ className: e }) => /* @__PURE__ */ t("svg", { className: e, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m6 9 6 6 6-6" }) }), Tr = ({ className: e }) => /* @__PURE__ */ t("svg", { className: e, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m9 18 6-6-6-6" }) }), jr = ({ className: e }) => /* @__PURE__ */ t("svg", { className: e, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": !0, children: /* @__PURE__ */ t("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3" }) }), X = "text-body-m font-normal text-main font-sans", E = "h-14 shrink-0 bg-surface-panel border-y border-r border-neutral-3";
function Ar({ date: e, urgency: r = "normal" }) {
  return /* @__PURE__ */ t("span", { className: b(X, {
    normal: "text-main",
    warning: "text-tertiary-4",
    // text-primary-4 kept as a raw ramp class, not aliased to `text-interactive` — this is a
    // status/urgency signal, not an interactive affordance, so the "interactive" alias would
    // misrepresent its role even though it happens to share the same color value.
    overdue: "text-primary-4"
  }[r]), children: e });
}
function Rr({ name: e, avatarSrc: r }) {
  return /* @__PURE__ */ c("div", { className: "flex items-center gap-2 min-w-0", children: [
    /* @__PURE__ */ t(le, { src: r, name: e, size: "sm" }),
    /* @__PURE__ */ t("span", { className: b(X, "truncate"), children: e })
  ] });
}
function Dr({ points: e }) {
  return /* @__PURE__ */ c("span", { className: b(X, "tabular-nums"), children: [
    e,
    " ",
    e === 1 ? "Point" : "Points"
  ] });
}
function Wr({ labels: e }) {
  return /* @__PURE__ */ t("div", { className: "flex flex-wrap items-center gap-2", children: e.map((r, n) => /* @__PURE__ */ t(K, { variant: r.variant ?? "neutral", children: r.label }, n)) });
}
const Or = {
  primary: "bg-primary-4",
  secondary: "bg-secondary-4",
  tertiary: "bg-tertiary-4"
};
function Br({
  index: e,
  title: r,
  indicatorColor: n = "secondary",
  reactions: o = [],
  isSelected: s = !1,
  onSelectedChange: l,
  tags: a = [],
  estimationPoints: i,
  assigneeName: f,
  assigneeAvatar: d,
  dueDate: x,
  dueDateUrgency: h = "normal",
  onClick: k,
  onViewDetails: y
}) {
  return /* @__PURE__ */ c("tr", { onClick: k, className: b("group", k && "cursor-pointer"), children: [
    /* @__PURE__ */ t("td", { className: b(E, "pl-0 pr-4 border-l"), style: { width: O.name }, children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ t("span", { className: b("w-1 h-full shrink-0", Or[n]) }),
      /* @__PURE__ */ c("label", { className: "w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer rounded-xs has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-4 has-[:focus-visible]:outline-offset-1", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            className: "sr-only",
            checked: s,
            onChange: (C) => l == null ? void 0 : l(C.target.checked),
            "aria-label": `Select ${r}`
          }
        ),
        /* @__PURE__ */ t(
          jr,
          {
            className: b(
              "w-6 h-6 text-main transition-opacity",
              s ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
            )
          }
        )
      ] }),
      /* @__PURE__ */ t("span", { className: b(X, "shrink-0 tabular-nums"), children: String(e).padStart(2, "0") }),
      /* @__PURE__ */ t("span", { className: b(X, "flex-1 min-w-0 truncate"), children: r }),
      o.map((C) => /* @__PURE__ */ c("span", { className: b(X, "inline-flex items-center gap-1 shrink-0"), children: [
        /* @__PURE__ */ t("span", { className: "tabular-nums", children: C.count }),
        /* @__PURE__ */ t("span", { children: C.emoji })
      ] }, C.emoji)),
      y ? /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          onClick: y,
          className: b(X, "inline-flex items-center gap-1 shrink-0 hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs"),
          children: [
            /* @__PURE__ */ t("span", { children: "Details" }),
            /* @__PURE__ */ t(Tr, { className: "w-4 h-4" })
          ]
        }
      ) : null
    ] }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-2 pr-4"), style: { width: O.tags }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: a.length > 0 ? /* @__PURE__ */ t(Wr, { labels: a }) : null }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-2 pr-4"), style: { width: O.estimation }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: i !== void 0 ? /* @__PURE__ */ t(Dr, { points: i }) : null }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-2 pr-4"), style: { width: O.assignee }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: f ? /* @__PURE__ */ t(Rr, { name: f, avatarSrc: d }) : null }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-2 pr-4"), style: { width: O.dueDate }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: x ? /* @__PURE__ */ t(Ar, { date: x, urgency: h }) : null }) })
  ] });
}
function Gr() {
  return /* @__PURE__ */ c("tr", { children: [
    /* @__PURE__ */ t("td", { className: b(E, "pl-4 pr-4 border-l"), style: { width: O.name }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(G, { className: "h-4 w-full" }) }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-4 pr-4"), style: { width: O.tags }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(G, { className: "h-6 w-16 rounded" }) }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-4 pr-4"), style: { width: O.estimation }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(G, { className: "h-4 w-16" }) }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-4 pr-4"), style: { width: O.assignee }, children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ t(G, { className: "w-8 h-8 rounded-full shrink-0" }),
      /* @__PURE__ */ t(G, { className: "h-4 w-20" })
    ] }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-4 pr-4"), style: { width: O.dueDate }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(G, { className: "h-4 w-20" }) }) })
  ] });
}
const se = [
  { key: "name", label: "# Task Name" },
  { key: "tags", label: "Task Tags" },
  { key: "estimation", label: "Estimate" },
  { key: "assignee", label: "Task Assign Name" },
  { key: "dueDate", label: "Due Date" }
];
function hn({ groups: e, isLoading: r = !1, className: n }) {
  return /* @__PURE__ */ t(
    "div",
    {
      className: b(
        "w-full overflow-x-auto",
        "[scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-3 [&::-webkit-scrollbar-thumb]:rounded-full",
        n
      ),
      children: /* @__PURE__ */ c("div", { className: "flex flex-col gap-4 min-w-[1108px]", children: [
        /* @__PURE__ */ t("div", { className: "flex", children: se.map(({ key: o, label: s }, l) => /* @__PURE__ */ t(
          "div",
          {
            className: b(
              E,
              "px-4",
              l === 0 && "border-l rounded-l-4",
              l === se.length - 1 && "rounded-r-4"
            ),
            style: { width: O[o] },
            children: /* @__PURE__ */ t("span", { className: X, children: s })
          },
          o
        )) }),
        r ? /* @__PURE__ */ c("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ t("colgroup", { children: se.map(({ key: o }) => /* @__PURE__ */ t("col", { style: { width: O[o] } }, o)) }),
          /* @__PURE__ */ t("tbody", { children: Array.from({ length: 5 }).map((o, s) => /* @__PURE__ */ t(Gr, {}, s)) })
        ] }) : e.length === 0 ? /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-16 text-muted font-sans text-sm", children: "No tasks yet." }) : e.map((o, s) => /* @__PURE__ */ c("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ t("colgroup", { children: se.map(({ key: l }) => /* @__PURE__ */ t("col", { style: { width: O[l] } }, l)) }),
          /* @__PURE__ */ c("tbody", { children: [
            /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ t("td", { colSpan: se.length, className: "p-0 border border-neutral-3", children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2 h-14 px-4 bg-surface-panel rounded-t-4", children: [
              /* @__PURE__ */ t(Ir, { className: "w-6 h-6 shrink-0 text-muted" }),
              /* @__PURE__ */ t("h3", { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: o.title }),
              o.actions
            ] }) }) }),
            o.rows.map((l, a) => /* @__PURE__ */ t(Br, { ...l }, a))
          ] })
        ] }, s))
      ] })
    }
  );
}
function be({
  isOpen: e,
  onClose: r,
  triggerRef: n,
  role: o = "dialog",
  children: s,
  className: l,
  ...a
}) {
  const i = A(null), { overlayProps: f } = ft(
    {
      isOpen: e,
      onClose: r,
      isDismissable: !0,
      shouldCloseOnInteractOutside: (d) => {
        var x;
        return !((x = n == null ? void 0 : n.current) != null && x.contains(d));
      }
    },
    i
  );
  return e ? (
    // eslint-disable-next-line jsx-a11y/no-autofocus
    /* @__PURE__ */ t(Ue, { restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ c(
      "div",
      {
        ...f,
        ...a,
        ref: i,
        role: o,
        className: l,
        children: [
          /* @__PURE__ */ t(je, { onDismiss: r }),
          s,
          /* @__PURE__ */ t(je, { onDismiss: r })
        ]
      }
    ) })
  ) : null;
}
function gn({ title: e, isOpen: r, onClose: n, children: o, width: s = "max-w-md" }) {
  const l = A(null), a = A(null), i = $e({
    isOpen: r,
    onOpenChange: (k) => {
      k || n();
    }
  }), { modalProps: f, underlayProps: d } = pt(
    { isDismissable: !0 },
    i,
    l
  ), { dialogProps: x, titleProps: h } = bt({}, a);
  return r ? /* @__PURE__ */ t(
    "div",
    {
      ...d,
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      children: /* @__PURE__ */ t(Ue, { contain: !0, restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ t(
        "div",
        {
          ...f,
          ref: l,
          className: b("w-full", s),
          children: /* @__PURE__ */ c(
            "div",
            {
              ...x,
              ref: a,
              className: "flex flex-col bg-surface-overlay rounded-sm border border-subtle overflow-hidden",
              children: [
                /* @__PURE__ */ c("div", { className: "flex items-center justify-between px-4 py-4 border-b border-neutral-4", children: [
                  /* @__PURE__ */ t(
                    "h2",
                    {
                      ...h,
                      className: "font-sans font-bold text-base text-main",
                      children: e
                    }
                  ),
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      onClick: n,
                      "aria-label": "Close modal",
                      className: "flex items-center justify-center w-8 h-8 rounded-md text-muted hover:bg-neutral-4 hover:text-main transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                      children: /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M18 6 6 18M6 6l12 12" }) })
                    }
                  )
                ] }),
                /* @__PURE__ */ t("div", { className: "px-4 py-4", children: o })
              ]
            }
          )
        }
      ) })
    }
  ) : null;
}
function xn(e = !1) {
  const r = $e({ defaultOpen: e });
  return {
    isOpen: r.isOpen,
    open: r.open,
    close: r.close,
    toggle: r.toggle
  };
}
const Er = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m15 18-6-6 6-6" }) }), Vr = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m9 18 6-6-6-6" }) }), Fr = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m18 18-6-6 6-6M12 18l-6-6 6-6" }) }), _r = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m6 18 6-6-6-6M12 18l6-6-6-6" }) });
function Ve(e) {
  return new Pt(e.getFullYear(), e.getMonth() + 1, e.getDate());
}
function Ur(e) {
  return e.toDate(ke());
}
function $r({
  value: e,
  defaultValue: r,
  onChange: n,
  onClose: o,
  triggerRef: s,
  className: l
}) {
  const a = e !== void 0 ? { value: Ve(e) } : { defaultValue: r ? Ve(r) : null }, i = kt({
    ...a,
    onChange: (P) => n == null ? void 0 : n(Ur(P)),
    createCalendar: Ct,
    // Hardcoded, matching the prior implementation's hardcoded English
    // MONTHS/DAYS arrays — no `I18nProvider`/locale story exists in this kit
    // yet, so introducing locale-dependent formatting here would be an
    // unverified behavior change, not a fix.
    locale: "en-US",
    firstDayOfWeek: "sun",
    weeksInMonth: 6
  }), { calendarProps: f, prevButtonProps: d, nextButtonProps: x } = ht(
    { "aria-label": "Date picker" },
    i
  ), h = A(null), k = A(null), { buttonProps: y } = fe(d, h), { buttonProps: C } = fe(x, k), w = () => {
    const P = St(ke());
    i.setFocusedDate(P), i.selectDate(P);
  };
  return /* @__PURE__ */ c(
    be,
    {
      isOpen: !0,
      onClose: o,
      triggerRef: s,
      "aria-label": "Date picker",
      className: b(
        "flex flex-col w-[280px] bg-surface-shell border border-subtle rounded-4 shadow-elevation select-none",
        l
      ),
      children: [
        /* @__PURE__ */ c("div", { ...f, className: "flex flex-col", children: [
          /* @__PURE__ */ c("div", { className: "flex items-center justify-between px-2 py-[9px] h-10", children: [
            /* @__PURE__ */ c("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: () => i.focusPreviousSection(!0),
                  "aria-label": "Previous year",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ t(Fr, {})
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  ...y,
                  ref: h,
                  "aria-label": "Previous month",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ t(Er, {})
                }
              )
            ] }),
            /* @__PURE__ */ t("span", { className: "font-sans font-semibold text-body-sm text-main", children: i.visibleRange.start.toDate(ke()).toLocaleDateString("en-US", { month: "long", year: "numeric" }) }),
            /* @__PURE__ */ c("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ t(
                "button",
                {
                  ...C,
                  ref: k,
                  "aria-label": "Next month",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ t(Vr, {})
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: () => i.focusNextSection(!0),
                  "aria-label": "Next year",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ t(_r, {})
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ t("div", { className: "h-px w-full bg-neutral-2" }),
          /* @__PURE__ */ t(Kr, { state: i })
        ] }),
        /* @__PURE__ */ t("div", { className: "h-px w-full bg-neutral-2" }),
        /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-[9px] h-10", children: /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: w,
            className: "text-body-sm font-normal font-sans text-interactive hover:opacity-80 transition-opacity cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-xs",
            children: "Today"
          }
        ) })
      ]
    }
  );
}
function Kr({ state: e }) {
  const { gridProps: r, headerProps: n, weekDays: o, weeksInMonth: s } = gt(
    { weekdayStyle: "short" },
    e
  ), l = e.visibleRange.start;
  return /* @__PURE__ */ c("div", { ...r, className: "flex flex-col px-3 py-2", children: [
    /* @__PURE__ */ t("div", { ...n, className: "grid grid-cols-7", children: o.map((a, i) => /* @__PURE__ */ t("span", { className: "text-center text-body-sm font-normal text-main font-sans", children: a }, i)) }),
    Array.from({ length: s }, (a, i) => /* @__PURE__ */ t("div", { role: "row", className: "grid grid-cols-7", children: e.getDatesInWeek(i).map(
      (f, d) => f ? /* @__PURE__ */ t(Hr, { state: e, date: f, currentMonth: l }, f.toString()) : /* @__PURE__ */ t("div", { role: "gridcell", "aria-hidden": "true" }, d)
    ) }, i))
  ] });
}
function Hr({
  state: e,
  date: r,
  currentMonth: n
}) {
  const o = A(null), s = !zt(r, n), { cellProps: l, buttonProps: a, isSelected: i, isDisabled: f, formattedDate: d } = xt(
    { date: r, isOutsideMonth: s },
    e,
    o
  );
  return /* @__PURE__ */ t("div", { ...l, className: "flex items-center justify-center my-[3px]", children: /* @__PURE__ */ t(
    "div",
    {
      ...a,
      ref: o,
      className: b(
        "flex items-center justify-center w-6 h-6 rounded-2 text-body-sm font-normal font-sans transition-colors outline-none focus-visible:outline-2 focus-visible:outline-primary-4",
        f ? "text-muted cursor-default" : i ? "border border-primary-4 text-main cursor-pointer" : "text-main hover:bg-neutral-3 cursor-pointer"
      ),
      children: d
    }
  ) });
}
const Yr = [1, 2, 3, 5, 8], Xr = () => /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M6 21V4a1 1 0 0 1 1-1h10.5a1 1 0 0 1 .8 1.6L15 9l3.3 4.4a1 1 0 0 1-.8 1.6H7" }) });
function qr({ value: e, onSelect: r, onClose: n, triggerRef: o, className: s }) {
  return /* @__PURE__ */ c(
    be,
    {
      isOpen: !0,
      onClose: n,
      triggerRef: o,
      "aria-label": "Estimate",
      className: b(
        "flex flex-col w-[122px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        s
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans whitespace-nowrap", children: "Estimate" }) }),
        Yr.map((l) => /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: () => r(l),
            "aria-pressed": e === l,
            className: b(
              "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
              e === l ? "bg-neutral-2" : "hover:bg-neutral-2"
            ),
            children: [
              /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ t(Xr, {}) }),
              /* @__PURE__ */ c("span", { className: "whitespace-nowrap", children: [
                l,
                " Point",
                l !== 1 ? "s" : ""
              ] })
            ]
          },
          l
        ))
      ]
    }
  );
}
function Jr({
  name: e,
  role: r,
  avatarSrc: n,
  size: o = "md",
  isOnline: s = !1,
  className: l,
  onClick: a
}) {
  const i = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm"
  };
  return /* @__PURE__ */ c(
    a ? "button" : "div",
    {
      type: a ? "button" : void 0,
      onClick: a,
      className: b(
        // padding: 4px 16px, gap: 8px -- matches Figma "User" component (Avatar frame, 239x56)
        "flex items-center gap-2 px-4 py-1 min-w-0",
        a && "cursor-pointer hover:opacity-80 transition-opacity outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-sm",
        l
      ),
      children: [
        /* @__PURE__ */ c("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ t(le, { src: n, name: e, size: o }),
          s ? /* @__PURE__ */ t("span", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary-4 border-2 border-neutral-5" }) : null
        ] }),
        /* @__PURE__ */ c("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ t("span", { className: "font-sans font-normal text-body-m text-main truncate", children: e }),
          r ? /* @__PURE__ */ t(
            "span",
            {
              className: b(
                "font-sans text-muted truncate leading-tight",
                i[o]
              ),
              children: r
            }
          ) : null
        ] })
      ]
    }
  );
}
function Qr({ assignees: e, onSelect: r, onClose: n, triggerRef: o, className: s }) {
  return /* @__PURE__ */ c(
    be,
    {
      isOpen: !0,
      onClose: n,
      triggerRef: o,
      "aria-label": "Assignee",
      className: b(
        "flex flex-col w-[239px] pt-2 bg-surface-overlay border border-subtle rounded-sm",
        s
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans truncate", children: "Assignee" }) }),
        e.map((l) => /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: () => r(l),
            className: "flex items-center w-full h-14 hover:bg-neutral-2/10 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
            children: /* @__PURE__ */ t(Jr, { name: l.name, role: l.role, avatarSrc: l.avatarSrc, size: "sm" })
          },
          l.id
        ))
      ]
    }
  );
}
function Zr({ labels: e, onSelect: r, onClose: n, triggerRef: o, className: s }) {
  return /* @__PURE__ */ c(
    be,
    {
      isOpen: !0,
      onClose: n,
      triggerRef: o,
      "aria-label": "Label",
      className: b(
        "flex flex-col w-[160px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        s
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans truncate", children: "Label" }) }),
        e.map((l) => /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: () => r(l),
            className: "flex items-center w-full px-4 py-1.5 hover:bg-neutral-2/10 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
            children: /* @__PURE__ */ t(K, { variant: l.variant ?? "neutral", children: l.text })
          },
          l.id
        ))
      ]
    }
  );
}
const Fe = () => /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M6 21V4a1 1 0 0 1 1-1h10.5a1 1 0 0 1 .8 1.6L15 9l3.3 4.4a1 1 0 0 1-.8 1.6H7" }) }), en = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("circle", { cx: "12", cy: "8", r: "4" }),
  /* @__PURE__ */ t("path", { d: "M4 20c0-4 3.5-6 8-6s8 2 8 6" })
] }), tn = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
  /* @__PURE__ */ t("path", { d: "M3 10h18M8 3v4M16 3v4" })
] }), rn = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("path", { d: "M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7.17-7.17a2 2 0 0 0 0-2.82z" }),
  /* @__PURE__ */ t("circle", { cx: "7.5", cy: "7.5", r: "1.5", fill: "currentColor", stroke: "none" })
] });
function vn({
  isOpen: e,
  onClose: r,
  assignees: n = [],
  labels: o = [],
  onSubmit: s,
  initialTitle: l = "",
  initialDueDate: a,
  initialPoints: i,
  initialAssignee: f,
  initialLabel: d,
  className: x
}) {
  const [h, k] = B.useState(l), [y, C] = B.useState(a), [w, P] = B.useState(i), [j, z] = B.useState(f), [V, _] = B.useState(d), [M, W] = B.useState(null), I = (N) => W((U) => U === N ? null : N), p = () => W(null), T = B.useRef(null), ee = B.useRef(null), te = B.useRef(null), J = B.useRef(null);
  if (!e) return null;
  const re = () => {
    k(""), C(void 0), P(void 0), z(void 0), _(void 0), W(null);
  }, ne = (N) => {
    N.preventDefault(), h.trim() && (s == null || s({ title: h.trim(), dueDate: y, points: w, assignee: j, label: V }), re(), r());
  }, H = () => {
    re(), r();
  };
  return /* @__PURE__ */ c(
    "form",
    {
      onSubmit: ne,
      className: b(
        "flex flex-col items-end gap-6 w-[578px] p-4 bg-surface-overlay rounded-sm",
        x
      ),
      children: [
        /* @__PURE__ */ t(
          "input",
          {
            autoFocus: !0,
            value: h,
            onChange: (N) => k(N.target.value),
            placeholder: "Task name",
            "aria-label": "Task name",
            className: "w-full bg-transparent text-body-xl font-semibold text-main placeholder:text-muted font-sans outline-none"
          }
        ),
        /* @__PURE__ */ c("div", { className: "flex items-center gap-4 w-full", children: [
          /* @__PURE__ */ c("div", { className: "relative", children: [
            w === void 0 ? /* @__PURE__ */ t(
              "button",
              {
                ref: T,
                type: "button",
                onClick: () => I("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "estimate",
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(K, { icon: /* @__PURE__ */ t(Fe, {}), children: "Estimate" })
              }
            ) : /* @__PURE__ */ c(
              "button",
              {
                ref: T,
                type: "button",
                onClick: () => I("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "estimate",
                className: "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ t(Fe, {}) }),
                  w,
                  " Point",
                  w !== 1 ? "s" : ""
                ]
              }
            ),
            M === "estimate" ? /* @__PURE__ */ t(
              qr,
              {
                value: w,
                onSelect: (N) => {
                  P(N), W(null);
                },
                onClose: p,
                triggerRef: T,
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] }),
          /* @__PURE__ */ c("div", { className: "relative", children: [
            j ? /* @__PURE__ */ c(
              "button",
              {
                ref: ee,
                type: "button",
                onClick: () => I("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "assignee",
                className: "flex items-center gap-2 h-8 px-2 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ t(le, { src: j.avatarSrc, name: j.name, size: "sm" }),
                  j.name
                ]
              }
            ) : /* @__PURE__ */ t(
              "button",
              {
                ref: ee,
                type: "button",
                onClick: () => I("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "assignee",
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(K, { icon: /* @__PURE__ */ t(en, {}), children: "Assignee" })
              }
            ),
            M === "assignee" ? /* @__PURE__ */ t(
              Qr,
              {
                assignees: n,
                onSelect: (N) => {
                  z(N), W(null);
                },
                onClose: p,
                triggerRef: ee,
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] }),
          /* @__PURE__ */ c("div", { className: "relative", children: [
            V ? /* @__PURE__ */ t(
              "button",
              {
                ref: te,
                type: "button",
                onClick: () => I("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "label",
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(K, { variant: V.variant ?? "neutral", children: V.text })
              }
            ) : /* @__PURE__ */ t(
              "button",
              {
                ref: te,
                type: "button",
                onClick: () => I("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "label",
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(K, { icon: /* @__PURE__ */ t(rn, {}), children: "Label" })
              }
            ),
            M === "label" ? /* @__PURE__ */ t(
              Zr,
              {
                labels: o,
                onSelect: (N) => {
                  _(N), W(null);
                },
                onClose: p,
                triggerRef: te,
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] }),
          /* @__PURE__ */ c("div", { className: "relative", children: [
            /* @__PURE__ */ t(
              "button",
              {
                ref: J,
                type: "button",
                onClick: () => I("date"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "date",
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(K, { icon: /* @__PURE__ */ t(tn, {}), children: y ? y.toLocaleDateString("en-US") : "Due date" })
              }
            ),
            M === "date" ? /* @__PURE__ */ t(
              $r,
              {
                value: y,
                onChange: (N) => {
                  C(N), W(null);
                },
                onClose: p,
                triggerRef: J,
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] })
        ] }),
        /* @__PURE__ */ c("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ t(Ee, { variant: "secondary", onPress: H, children: "Cancel" }),
          /* @__PURE__ */ t(Ee, { variant: "primary", type: "submit", isDisabled: !h.trim(), children: "Create Task" })
        ] })
      ]
    }
  );
}
function yn({ variant: e = "neutral", children: r, className: n }) {
  return /* @__PURE__ */ t(
    "span",
    {
      className: b(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border font-sans",
        {
          neutral: "bg-surface-neutral text-neutral-4 border-subtle",
          success: "bg-success-1 text-success-4 border-success-2",
          warning: "bg-warning-1 text-warning-5 border-warning-2",
          danger: "bg-danger-1 text-danger border-danger-2"
        }[e],
        n
      ),
      children: r
    }
  );
}
function wn({
  children: e,
  isSelected: r,
  defaultSelected: n = !1,
  onChange: o,
  isDisabled: s = !1,
  isIndeterminate: l = !1,
  className: a
}) {
  const i = Nt({
    isSelected: r,
    defaultSelected: n,
    onChange: o
  }), f = A(null), { inputProps: d, labelProps: x } = vt(
    {
      isSelected: i.isSelected,
      isIndeterminate: l,
      isDisabled: s,
      "aria-label": typeof e == "string" ? e : "Checkbox"
    },
    i,
    f
  );
  return /* @__PURE__ */ c(
    "label",
    {
      ...x,
      className: b(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Label Checkbox" component exactly
        // (Property 1=Default/Selected, Tags01.md / Add Task Modal04/05.md).
        "inline-flex items-center gap-2 px-4 py-1 rounded cursor-pointer select-none group has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-4 has-[:focus-visible]:outline-offset-2",
        s && "opacity-50 cursor-not-allowed",
        a
      ),
      children: [
        /* @__PURE__ */ t("input", { ...d, ref: f, className: "sr-only" }),
        /* @__PURE__ */ c(
          "svg",
          {
            className: "w-6 h-6 shrink-0 text-main",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.5,
            "aria-hidden": !0,
            children: [
              /* @__PURE__ */ t("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3" }),
              i.isSelected && !l ? /* @__PURE__ */ t("path", { d: "M8 12.5 11 15.5 16 9.5", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }) : l ? /* @__PURE__ */ t("path", { d: "M8 12h8", strokeWidth: 2, strokeLinecap: "round" }) : null
            ]
          }
        ),
        /* @__PURE__ */ t("span", { className: "text-body-m font-normal font-sans text-main", children: e })
      ]
    }
  );
}
function kn({ label: e, error: r, className: n, ...o }) {
  const s = A(null), { labelProps: l, inputProps: a, errorMessageProps: i } = Ce(
    { ...o, label: e, type: "date", isInvalid: !!r, errorMessage: r },
    s
  );
  return /* @__PURE__ */ c("div", { className: "flex flex-col gap-1.5 w-full", children: [
    e ? /* @__PURE__ */ t(
      "label",
      {
        ...l,
        className: "text-field-label font-semibold text-neutral-3 uppercase font-sans",
        children: e
      }
    ) : null,
    /* @__PURE__ */ t(
      "input",
      {
        ...a,
        ref: s,
        type: "date",
        className: b(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md transition-colors outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral font-sans cursor-pointer",
          r && "border-danger-5 focus-visible:outline-danger-5",
          n
        )
      }
    ),
    r ? /* @__PURE__ */ t("span", { ...i, className: "text-xs text-danger font-sans", children: r }) : null
  ] });
}
function nn({
  icon: e,
  label: r,
  isActive: n = !1,
  badgeCount: o,
  onClick: s,
  className: l
}) {
  return /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      onClick: s,
      "aria-current": n ? "page" : void 0,
      className: b(
        "relative w-full h-14 flex items-center gap-4 pl-4 font-sans text-body-m font-semibold transition-colors cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
        n ? "text-interactive bg-gradient-to-r from-transparent to-primary-4/10" : "text-muted hover:text-interactive",
        l
      ),
      children: [
        e ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0", children: e }) : null,
        /* @__PURE__ */ t("span", { className: "flex-1 truncate", children: r }),
        o !== void 0 ? /* @__PURE__ */ t(
          "span",
          {
            className: b(
              "px-2 py-0.5 text-xs font-bold rounded-full shrink-0",
              n ? "bg-primary-4 text-main" : "bg-neutral-3 text-main"
            ),
            children: o
          }
        ) : null,
        /* @__PURE__ */ t(
          "span",
          {
            className: b(
              "w-1 h-full shrink-0 bg-primary-4 transition-opacity",
              n ? "opacity-100" : "opacity-0"
            )
          }
        )
      ]
    }
  );
}
function on({ logo: e, items: r, className: n }) {
  return /* @__PURE__ */ c(
    "nav",
    {
      "aria-label": "Main navigation",
      className: b(
        // 232px / rounded-lg (24px) matches the real "Sidebar" layer (ApplicationSidebar01.md + Dashboard Mockup.md).
        "flex flex-col w-[232px] h-full bg-surface-panel rounded-lg select-none shrink-0",
        n
      ),
      children: [
        e ? /* @__PURE__ */ t("div", { className: "flex justify-center pt-3 h-24 shrink-0", children: e }) : null,
        /* @__PURE__ */ t("div", { className: "flex flex-col gap-2 flex-1 overflow-y-auto", children: r.map((o, s) => /* @__PURE__ */ t(nn, { ...o }, s)) })
      ]
    }
  );
}
function Nn({
  value: e,
  onChange: r,
  leftIcon: n,
  rightIcon: o,
  leftLabel: s,
  rightLabel: l,
  className: a
}) {
  return /* @__PURE__ */ c("div", { className: b("flex items-center w-20 h-10 bg-surface-shell rounded-sm", a), children: [
    /* @__PURE__ */ t(
      Ge,
      {
        variant: "secondary",
        isSelected: e === "left",
        "aria-label": s,
        onPress: () => r == null ? void 0 : r("left"),
        children: n
      }
    ),
    /* @__PURE__ */ t(
      Ge,
      {
        variant: "secondary",
        isSelected: e === "right",
        "aria-label": l,
        onPress: () => r == null ? void 0 : r("right"),
        children: o
      }
    )
  ] });
}
function Cn({ logo: e, sidebarItems: r, topNavProps: n, topBar: o, children: s, className: l }) {
  return /* @__PURE__ */ c("div", { className: b("flex items-start gap-8 w-full min-h-screen bg-surface-shell p-8", l), children: [
    /* @__PURE__ */ t(on, { logo: e, items: r, className: "self-stretch" }),
    /* @__PURE__ */ c("div", { className: "flex flex-col gap-8 flex-1 min-w-0", children: [
      /* @__PURE__ */ t(Nr, { ...n }),
      /* @__PURE__ */ c("div", { className: "flex flex-col gap-4", children: [
        o ? /* @__PURE__ */ t("div", { className: "flex items-start justify-between gap-6", children: o }) : null,
        s
      ] })
    ] })
  ] });
}
export {
  vn as AddTaskModal,
  Cn as AppShell,
  on as ApplicationSidebar,
  Qr as AssigneeModal,
  Rr as AssigneeNameCell,
  le as Avatar,
  yn as Badge,
  Ge as Button,
  pn as Card,
  $r as DatePickerMenu,
  kn as Datepicker,
  Ar as DueDateCell,
  qr as EstimateModal,
  Dr as EstimationCell,
  un as Input,
  wn as LabelCheckbox,
  Zr as LabelModal,
  gn as Modal,
  be as Popover,
  at as ProjectInfo,
  yr as SearchBar,
  fn as SegmentedControl,
  nn as SidebarItem,
  G as Skeleton,
  mn as Tabs,
  K as Tag,
  Wr as TagCell,
  Lr as TaskCard,
  bn as TaskListView,
  Sr as TaskMetaBadges,
  hn as TaskTable,
  Br as TaskTableRow,
  Ee as TextButton,
  Nr as TopNav,
  Jr as UserRow,
  Nn as ViewSwitcher,
  b as cn,
  xn as useModalState
};
