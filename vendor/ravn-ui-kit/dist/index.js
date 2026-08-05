import { jsx as t, jsxs as c, Fragment as dt } from "react/jsx-runtime";
import B, { useRef as S, useState as Ue, useMemo as ut } from "react";
import { useButton as re, useTextField as Pe, useTabList as mt, useTab as ft, useTabPanel as pt, useOverlay as bt, FocusScope as $e, DismissButton as pe, usePopover as ht, Overlay as gt, useListBox as xt, useOption as vt, useSelect as yt, HiddenSelect as wt, useModalOverlay as kt, useDialog as Nt, useCalendar as Ct, useCalendarGrid as Pt, useCalendarCell as St, useCheckbox as Lt } from "react-aria";
import { useTabListState as zt, Item as Mt, useSelectState as It, useOverlayTriggerState as Se, useListState as jt, useCalendarState as Tt, useToggleState as Rt } from "react-stately";
import { createCalendar as At, getLocalTimeZone as Ne, CalendarDate as Dt, today as Ot, isSameMonth as Wt } from "@internationalized/date";
function Ke(e) {
  var r, n, o = "";
  if (typeof e == "string" || typeof e == "number") o += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var s = e.length;
    for (r = 0; r < s; r++) e[r] && (n = Ke(e[r])) && (o && (o += " "), o += n);
  } else for (n in e) e[n] && (o && (o += " "), o += n);
  return o;
}
function Bt() {
  for (var e, r, n = 0, o = "", s = arguments.length; n < s; n++) (e = arguments[n]) && (r = Ke(e)) && (o && (o += " "), o += r);
  return o;
}
const Gt = (e, r) => {
  const n = new Array(e.length + r.length);
  for (let o = 0; o < e.length; o++)
    n[o] = e[o];
  for (let o = 0; o < r.length; o++)
    n[e.length + o] = r[o];
  return n;
}, Et = (e, r) => ({
  classGroupId: e,
  validator: r
}), He = (e = /* @__PURE__ */ new Map(), r = null, n) => ({
  nextPart: e,
  validators: r,
  classGroupId: n
}), be = "-", Ae = [], Vt = "arbitrary..", Ft = (e) => {
  const r = Ut(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: o
  } = e;
  return {
    getClassGroupId: (i) => {
      if (i.startsWith("[") && i.endsWith("]"))
        return _t(i);
      const a = i.split(be), u = a[0] === "" && a.length > 1 ? 1 : 0;
      return Ye(a, u, r);
    },
    getConflictingClassGroupIds: (i, a) => {
      if (a) {
        const u = o[i], d = n[i];
        return u ? d ? Gt(d, u) : u : d || Ae;
      }
      return n[i] || Ae;
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
  const i = n.validators;
  if (i === null)
    return;
  const a = r === 0 ? e.join(be) : e.slice(r).join(be), u = i.length;
  for (let d = 0; d < u; d++) {
    const g = i[d];
    if (g.validator(a))
      return g.classGroupId;
  }
}, _t = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const r = e.slice(1, -1), n = r.indexOf(":"), o = r.slice(0, n);
  return o ? Vt + o : void 0;
})(), Ut = (e) => {
  const {
    theme: r,
    classGroups: n
  } = e;
  return $t(n, r);
}, $t = (e, r) => {
  const n = He();
  for (const o in e) {
    const s = e[o];
    Le(s, n, o, r);
  }
  return n;
}, Le = (e, r, n, o) => {
  const s = e.length;
  for (let l = 0; l < s; l++) {
    const i = e[l];
    Kt(i, r, n, o);
  }
}, Kt = (e, r, n, o) => {
  if (typeof e == "string") {
    Ht(e, r, n);
    return;
  }
  if (typeof e == "function") {
    Yt(e, r, n, o);
    return;
  }
  Xt(e, r, n, o);
}, Ht = (e, r, n) => {
  const o = e === "" ? r : Xe(r, e);
  o.classGroupId = n;
}, Yt = (e, r, n, o) => {
  if (qt(e)) {
    Le(e(o), r, n, o);
    return;
  }
  r.validators === null && (r.validators = []), r.validators.push(Et(n, e));
}, Xt = (e, r, n, o) => {
  const s = Object.entries(e), l = s.length;
  for (let i = 0; i < l; i++) {
    const [a, u] = s[i];
    Le(u, Xe(r, a), n, o);
  }
}, Xe = (e, r) => {
  let n = e;
  const o = r.split(be), s = o.length;
  for (let l = 0; l < s; l++) {
    const i = o[l];
    let a = n.nextPart.get(i);
    a || (a = He(), n.nextPart.set(i, a)), n = a;
  }
  return n;
}, qt = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, Jt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, n = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ Object.create(null);
  const s = (l, i) => {
    n[l] = i, r++, r > e && (r = 0, o = n, n = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(l) {
      let i = n[l];
      if (i !== void 0)
        return i;
      if ((i = o[l]) !== void 0)
        return s(l, i), i;
    },
    set(l, i) {
      l in n ? n[l] = i : s(l, i);
    }
  };
}, Ce = "!", De = ":", Qt = [], Oe = (e, r, n, o, s) => ({
  modifiers: e,
  hasImportantModifier: r,
  baseClassName: n,
  maybePostfixModifierPosition: o,
  isExternal: s
}), Zt = (e) => {
  const {
    prefix: r,
    experimentalParseClassName: n
  } = e;
  let o = (s) => {
    const l = [];
    let i = 0, a = 0, u = 0, d;
    const g = s.length;
    for (let w = 0; w < g; w++) {
      const P = s[w];
      if (i === 0 && a === 0) {
        if (P === De) {
          l.push(s.slice(u, w)), u = w + 1;
          continue;
        }
        if (P === "/") {
          d = w;
          continue;
        }
      }
      P === "[" ? i++ : P === "]" ? i-- : P === "(" ? a++ : P === ")" && a--;
    }
    const h = l.length === 0 ? s : s.slice(u);
    let k = h, y = !1;
    h.endsWith(Ce) ? (k = h.slice(0, -1), y = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      h.startsWith(Ce) && (k = h.slice(1), y = !0)
    );
    const C = d && d > u ? d - u : void 0;
    return Oe(l, y, k, C);
  };
  if (r) {
    const s = r + De, l = o;
    o = (i) => i.startsWith(s) ? l(i.slice(s.length)) : Oe(Qt, !1, i, void 0, !0);
  }
  if (n) {
    const s = o;
    o = (l) => n({
      className: l,
      parseClassName: s
    });
  }
  return o;
}, er = (e) => {
  const r = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((n, o) => {
    r.set(n, 1e6 + o);
  }), (n) => {
    const o = [];
    let s = [];
    for (let l = 0; l < n.length; l++) {
      const i = n[l], a = i[0] === "[", u = r.has(i);
      a || u ? (s.length > 0 && (s.sort(), o.push(...s), s = []), o.push(i)) : s.push(i);
    }
    return s.length > 0 && (s.sort(), o.push(...s)), o;
  };
}, tr = (e) => ({
  cache: Jt(e.cacheSize),
  parseClassName: Zt(e),
  sortModifiers: er(e),
  postfixLookupClassGroupIds: rr(e),
  ...Ft(e)
}), rr = (e) => {
  const r = /* @__PURE__ */ Object.create(null), n = e.postfixLookupClassGroups;
  if (n)
    for (let o = 0; o < n.length; o++)
      r[n[o]] = !0;
  return r;
}, nr = /\s+/, or = (e, r) => {
  const {
    parseClassName: n,
    getClassGroupId: o,
    getConflictingClassGroupIds: s,
    sortModifiers: l,
    postfixLookupClassGroupIds: i
  } = r, a = [], u = e.trim().split(nr);
  let d = "";
  for (let g = u.length - 1; g >= 0; g -= 1) {
    const h = u[g], {
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
    let R = !!P, z;
    if (R) {
      const j = w.substring(0, P);
      z = o(j);
      const b = z && i[z] ? o(w) : void 0;
      b && b !== z && (z = b, R = !1);
    } else
      z = o(w);
    if (!z) {
      if (!R) {
        d = h + (d.length > 0 ? " " + d : d);
        continue;
      }
      if (z = o(w), !z) {
        d = h + (d.length > 0 ? " " + d : d);
        continue;
      }
      R = !1;
    }
    const V = y.length === 0 ? "" : y.length === 1 ? y[0] : l(y).join(":"), U = C ? V + Ce : V, M = U + z;
    if (a.indexOf(M) > -1)
      continue;
    a.push(M);
    const O = s(z, R);
    for (let j = 0; j < O.length; ++j) {
      const b = O[j];
      a.push(U + b);
    }
    d = h + (d.length > 0 ? " " + d : d);
  }
  return d;
}, sr = (...e) => {
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
}, lr = (e, ...r) => {
  let n, o, s, l;
  const i = (u) => {
    const d = r.reduce((g, h) => h(g), e());
    return n = tr(d), o = n.cache.get, s = n.cache.set, l = a, a(u);
  }, a = (u) => {
    const d = o(u);
    if (d)
      return d;
    const g = or(u, n);
    return s(u, g), g;
  };
  return l = i, (...u) => l(sr(...u));
}, ir = [], L = (e) => {
  const r = (n) => n[e] || ir;
  return r.isThemeGetter = !0, r;
}, Je = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Qe = /^\((?:(\w[\w-]*):)?(.+)\)$/i, ar = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, cr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, dr = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ur = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, mr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, fr = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Y = (e) => ar.test(e), v = (e) => !!e && !Number.isNaN(Number(e)), F = (e) => !!e && Number.isInteger(Number(e)), we = (e) => e.endsWith("%") && v(e.slice(0, -1)), K = (e) => cr.test(e), Ze = () => !0, pr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  dr.test(e) && !ur.test(e)
), ze = () => !1, br = (e) => mr.test(e), hr = (e) => fr.test(e), gr = (e) => !m(e) && !f(e), xr = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), vr = (e) => q(e, rt, ze), m = (e) => Je.test(e), Q = (e) => q(e, nt, pr), We = (e) => q(e, Lr, v), yr = (e) => q(e, st, Ze), wr = (e) => q(e, ot, ze), Be = (e) => q(e, et, ze), kr = (e) => q(e, tt, hr), me = (e) => q(e, lt, br), f = (e) => Qe.test(e), se = (e) => Z(e, nt), Nr = (e) => Z(e, ot), Ge = (e) => Z(e, et), Cr = (e) => Z(e, rt), Pr = (e) => Z(e, tt), fe = (e) => Z(e, lt, !0), Sr = (e) => Z(e, st, !0), q = (e, r, n) => {
  const o = Je.exec(e);
  return o ? o[1] ? r(o[1]) : n(o[2]) : !1;
}, Z = (e, r, n = !1) => {
  const o = Qe.exec(e);
  return o ? o[1] ? r(o[1]) : n : !1;
}, et = (e) => e === "position" || e === "percentage", tt = (e) => e === "image" || e === "url", rt = (e) => e === "length" || e === "size" || e === "bg-size", nt = (e) => e === "length", Lr = (e) => e === "number", ot = (e) => e === "family-name", st = (e) => e === "number" || e === "weight", lt = (e) => e === "shadow", zr = () => {
  const e = L("color"), r = L("font"), n = L("text"), o = L("font-weight"), s = L("tracking"), l = L("leading"), i = L("breakpoint"), a = L("container"), u = L("spacing"), d = L("radius"), g = L("shadow"), h = L("inset-shadow"), k = L("text-shadow"), y = L("drop-shadow"), C = L("blur"), w = L("perspective"), P = L("aspect"), R = L("ease"), z = L("animate"), V = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], U = () => [
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
  ], M = () => [...U(), f, m], O = () => ["auto", "hidden", "clip", "visible", "scroll"], j = () => ["auto", "contain", "none"], b = () => [f, m, u], T = () => [Y, "full", "auto", ...b()], ee = () => [F, "none", "subgrid", f, m], te = () => ["auto", {
    span: ["full", F, f, m]
  }, F, f, m], J = () => [F, "auto", f, m], ne = () => ["auto", "min", "max", "fr", f, m], oe = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], H = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], N = () => ["auto", ...b()], $ = () => [Y, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...b()], ge = () => [Y, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...b()], xe = () => [Y, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...b()], x = () => [e, f, m], Me = () => [...U(), Ge, Be, {
    position: [f, m]
  }], Ie = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], je = () => ["auto", "cover", "contain", Cr, vr, {
    size: [f, m]
  }], ve = () => [we, se, Q], A = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    d,
    f,
    m
  ], D = () => ["", v, se, Q], ae = () => ["solid", "dashed", "dotted", "double"], Te = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], I = () => [v, we, Ge, Be], Re = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    C,
    f,
    m
  ], ce = () => ["none", v, f, m], de = () => ["none", v, f, m], ye = () => [v, f, m], ue = () => [Y, "full", ...b()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [K],
      breakpoint: [K],
      color: [Ze],
      container: [K],
      "drop-shadow": [K],
      ease: ["in", "out", "in-out"],
      font: [gr],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [K],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [K],
      shadow: [K],
      spacing: ["px", v],
      text: [K],
      "text-shadow": [K],
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
        aspect: ["auto", "square", Y, m, f, P]
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
        "@container": ["", "normal", "size", f, m]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [xr],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [v, m, f, a]
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
        overflow: O()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": O()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": O()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: j()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": j()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": j()
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
        z: [F, "auto", f, m]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Y, "full", "auto", a, ...b()]
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
        flex: [v, Y, "auto", "initial", "none", m]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", v, f, m]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", v, f, m]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [F, "first", "last", "none", f, m]
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
        "auto-cols": ne()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ne()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: b()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": b()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": b()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...oe(), "normal"]
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
        content: ["normal", ...oe()]
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
        "place-content": oe()
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
        p: b()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: b()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: b()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: b()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: b()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: b()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: b()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: b()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: b()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: b()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: b()
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
        "space-x": b()
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
        "space-y": b()
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
        size: $()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...ge()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...ge()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...ge()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...xe()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...xe()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...xe()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [a, "screen", ...$()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          a,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...$()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          a,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [i]
          },
          ...$()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...$()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...$()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...$()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", n, se, Q]
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
        font: [o, Sr, yr]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", we, m]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Nr, wr, r]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [m]
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
        tracking: [s, f, m]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [v, "none", f, We]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          l,
          ...b()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", f, m]
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
        list: ["disc", "decimal", "none", f, m]
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
        placeholder: x()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: x()
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
        decoration: [v, "from-font", "auto", f, Q]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: x()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [v, "auto", f, m]
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
        indent: b()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [F, f, m]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", f, m]
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
        content: ["none", f, m]
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
        bg: Me()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: Ie()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: je()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, F, f, m],
          radial: ["", f, m],
          conic: [F, f, m]
        }, Pr, kr]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: x()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: ve()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: ve()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: ve()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: x()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: x()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: x()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: A()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": A()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": A()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": A()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": A()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": A()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": A()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": A()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": A()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": A()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": A()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": A()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": A()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": A()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": A()
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
        border: x()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": x()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": x()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": x()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": x()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": x()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": x()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": x()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": x()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": x()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": x()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: x()
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
        "outline-offset": [v, f, m]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", v, se, Q]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: x()
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
          g,
          fe,
          me
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: x()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", h, fe, me]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": x()
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
        ring: x()
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
        "ring-offset": x()
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
        "inset-ring": x()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", k, fe, me]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": x()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [v, f, m]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Te(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Te()
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
        "mask-linear-from": I()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": I()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": x()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": x()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": I()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": I()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": x()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": x()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": I()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": I()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": x()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": x()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": I()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": I()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": x()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": x()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": I()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": I()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": x()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": x()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": I()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": I()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": x()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": x()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": I()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": I()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": x()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": x()
      }],
      "mask-image-radial": [{
        "mask-radial": [f, m]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": I()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": I()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": x()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": x()
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
        "mask-radial-at": U()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [v]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": I()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": I()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": x()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": x()
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
        mask: Me()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: Ie()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: je()
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
        mask: ["none", f, m]
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
          f,
          m
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: Re()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [v, f, m]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [v, f, m]
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
          fe,
          me
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": x()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", v, f, m]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [v, f, m]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", v, f, m]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [v, f, m]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", v, f, m]
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
          f,
          m
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": Re()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [v, f, m]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [v, f, m]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", v, f, m]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [v, f, m]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", v, f, m]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [v, f, m]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [v, f, m]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", v, f, m]
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
        "border-spacing": b()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": b()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": b()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", f, m]
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
        duration: [v, "initial", f, m]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", R, f, m]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [v, f, m]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", z, f, m]
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
        perspective: [w, f, m]
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
        rotate: ce()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": ce()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": ce()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": ce()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: de()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": de()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": de()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": de()
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
        skew: ye()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": ye()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": ye()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [f, m, "", "none", "gpu", "cpu"]
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
        translate: ue()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": ue()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": ue()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": ue()
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
        zoom: [F, f, m]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: x()
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
        caret: x()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", f, m]
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
        "scrollbar-thumb": x()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": x()
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
        "scroll-m": b()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": b()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": b()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": b()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": b()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": b()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": b()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": b()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": b()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": b()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": b()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": b()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": b()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": b()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": b()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": b()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": b()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": b()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": b()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": b()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": b()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": b()
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
        "will-change": ["auto", "scroll", "contents", "transform", f, m]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...x()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [v, se, Q, We]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...x()]
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
}, Mr = /* @__PURE__ */ lr(zr);
function p(...e) {
  return Mr(Bt(e));
}
function Ee({
  variant: e = "secondary",
  isSelected: r = !1,
  children: n,
  className: o,
  isDisabled: s,
  ...l
}) {
  const i = S(null), { buttonProps: a } = re({ ...l, isDisabled: s }, i);
  return /* @__PURE__ */ t(
    "button",
    {
      ...a,
      ref: i,
      className: p(
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
function Ve({
  variant: e = "primary",
  isSelected: r = !1,
  className: n,
  isDisabled: o,
  ...s
}) {
  const l = S(null), { buttonProps: i } = re({ ...s, isDisabled: o }, l), a = {
    primary: p(
      "text-main",
      o ? "bg-primary-2" : r ? "bg-primary-3" : "bg-primary-4 hover:bg-primary-2"
    ),
    secondary: o ? "bg-transparent text-muted" : r ? "bg-neutral-3 text-main" : "bg-transparent text-main hover:bg-neutral-2"
  };
  return /* @__PURE__ */ t(
    "button",
    {
      ...i,
      ref: l,
      className: p(
        "inline-flex items-center justify-center p-2 text-body-m font-normal rounded-sm transition-colors cursor-pointer font-sans select-none outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:pointer-events-none",
        a[e],
        n
      ),
      children: s.children
    }
  );
}
function Cn({ label: e, error: r, className: n, ...o }) {
  const s = S(null), { labelProps: l, inputProps: i, errorMessageProps: a } = Pe(
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
        ...i,
        ref: s,
        className: p(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md placeholder:text-muted transition-colors outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral",
          r && "border-danger-5 focus-visible:outline-danger-5",
          n
        )
      }
    ),
    r ? /* @__PURE__ */ t("span", { ...a, className: "text-xs text-danger font-sans", children: r }) : null
  ] });
}
function Ir({
  placeholder: e = "Search...",
  value: r,
  onChange: n,
  onSubmit: o,
  className: s
}) {
  const [l, i] = Ue(""), a = r !== void 0, u = a ? r : l, d = S(null), { inputProps: g } = Pe(
    {
      value: u,
      onChange: (h) => {
        a || i(h), n == null || n(h);
      },
      onKeyDown: (h) => {
        h.key === "Enter" && (o == null || o(u));
      },
      "aria-label": "Search",
      placeholder: e
    },
    d
  );
  return /* @__PURE__ */ c("div", { className: p("inline-flex items-center gap-6 min-w-0", s), children: [
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
        ...g,
        ref: d,
        className: "flex-1 bg-transparent text-body-m text-main placeholder:text-muted outline-none font-sans min-w-0"
      }
    )
  ] });
}
function ie({ src: e, name: r, size: n = "md", className: o }) {
  const s = {
    sm: "w-8 h-8 text-xs font-semibold",
    md: "w-10 h-10 text-sm font-semibold",
    lg: "w-12 h-12 text-base font-bold"
  }, l = (i) => {
    if (!i) return "?";
    const a = i.trim().split(" ");
    return a.length >= 2 ? `${a[0][0]}${a[1][0]}`.toUpperCase() : a[0].substring(0, 2).toUpperCase();
  };
  return /* @__PURE__ */ t(
    "div",
    {
      className: p(
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
function jr() {
  return /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: [
    /* @__PURE__ */ t("path", { d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" }),
    /* @__PURE__ */ t("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
  ] });
}
function Tr() {
  return /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M18 6 6 18M6 6l12 12" }) });
}
function Rr({
  searchValue: e,
  searchPlaceholder: r,
  onSearchChange: n,
  onSearchSubmit: o,
  icon: s,
  userName: l,
  userAvatar: i,
  className: a
}) {
  const [u, d] = Ue(""), g = e !== void 0, h = g ? e : u, k = (C) => {
    g || d(C), n == null || n(C);
  }, y = () => {
    g || d(""), n == null || n("");
  };
  return /* @__PURE__ */ c(
    "header",
    {
      className: p(
        "flex items-center justify-between gap-6 px-6 py-3 bg-surface-panel rounded-md",
        a
      ),
      children: [
        /* @__PURE__ */ t(
          Ir,
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
              children: /* @__PURE__ */ t(Tr, {})
            }
          ) : null,
          /* @__PURE__ */ t("span", { className: "w-6 h-6 text-muted shrink-0 [&>svg]:w-full [&>svg]:h-full", children: s ?? /* @__PURE__ */ t(jr, {}) }),
          l || i ? /* @__PURE__ */ t(ie, { src: i, name: l, size: "md" }) : null
        ] })
      ]
    }
  );
}
function Pn({
  items: e,
  panels: r,
  defaultSelectedKey: n,
  selectedKey: o,
  onSelectionChange: s,
  className: l
}) {
  var g;
  const i = ut(() => new Map(e.map((h) => [h.id, h])), [e]), a = zt({
    items: e,
    selectedKey: o,
    defaultSelectedKey: n ?? ((g = e[0]) == null ? void 0 : g.id),
    onSelectionChange: (h) => s == null ? void 0 : s(String(h)),
    children: (h) => /* @__PURE__ */ t(Mt, { textValue: h.label, children: h.label }, h.id)
  }), u = S(null), { tabListProps: d } = mt(
    { "aria-label": "Tab navigation" },
    a,
    u
  );
  return /* @__PURE__ */ c("div", { className: p("flex flex-col", l), children: [
    /* @__PURE__ */ t("div", { ...d, ref: u, className: "flex items-end", children: [...a.collection].map((h) => {
      var k;
      return /* @__PURE__ */ t(Ar, { item: h, state: a, icon: (k = i.get(String(h.key))) == null ? void 0 : k.icon }, h.key);
    }) }),
    r ? /* @__PURE__ */ t(Dr, { state: a, panels: r }) : null
  ] });
}
function Ar({ item: e, state: r, icon: n }) {
  const o = S(null), { tabProps: s, isSelected: l } = ft({ key: e.key }, r, o);
  return /* @__PURE__ */ c(
    "button",
    {
      ...s,
      ref: o,
      type: "button",
      className: p(
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
function Dr({ state: e, panels: r }) {
  const n = S(null), { tabPanelProps: o } = pt({}, e, n), s = e.selectedKey != null ? String(e.selectedKey) : "";
  return /* @__PURE__ */ t("div", { ...o, ref: n, className: "flex-1", children: r[s] ?? null });
}
function Sn({
  options: e,
  value: r,
  defaultValue: n,
  onChange: o,
  className: s
}) {
  var k;
  const [l, i] = B.useState(
    n ?? ((k = e[0]) == null ? void 0 : k.id) ?? ""
  ), a = r !== void 0, u = a ? r : l, d = S([]), g = (y) => {
    a || i(y), o == null || o(y);
  }, h = (y) => {
    var R;
    const C = e.findIndex((z) => z.id === u);
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
    g(P.id), (R = d.current[w]) == null || R.focus();
  };
  return /* @__PURE__ */ t(
    "div",
    {
      role: "radiogroup",
      "aria-label": "View",
      className: p(
        "inline-flex items-center gap-0 p-1 bg-surface-panel rounded-10",
        s
      ),
      children: e.map((y, C) => {
        const w = u === y.id;
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
            onClick: () => g(y.id),
            onKeyDown: h,
            className: p(
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
function Ln({ children: e, className: r, ...n }) {
  return /* @__PURE__ */ t(
    "div",
    {
      ...n,
      className: p(
        "p-5 bg-surface-neutral border border-subtle rounded-lg shadow-xs transition-shadow hover:shadow-sm",
        r
      ),
      children: e
    }
  );
}
function _({
  variant: e = "neutral",
  outline: r = !1,
  icon: n,
  children: o,
  onRemove: s,
  className: l
}) {
  const i = {
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
      className: p(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Tag" component exactly (Style=Solid/Outline,
        // all Type variants, Tags00/01.md). Typography: Desktop/Body/M/bold - SF Pro
        // Display, 15px/24px, letter-spacing 0.75px (tracking-wider @ 15px), weight 600.
        "inline-flex items-center gap-2 px-4 py-1 text-body-m font-semibold rounded font-sans select-none",
        r ? i[e].outline : i[e].solid,
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
function it({ title: e, icon: r, className: n }) {
  return /* @__PURE__ */ c("div", { className: p("flex items-center gap-2 w-full", n), children: [
    /* @__PURE__ */ t("h3", { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: e }),
    r ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0 text-muted", children: r }) : null
  ] });
}
function Or({ badges: e, className: r }) {
  return (
    // gap-4 matches Figma's "Frame 653" gap (16px, Cards01.md L614 / Cards00.md L657).
    /* @__PURE__ */ t("div", { className: p("flex flex-wrap items-center gap-4", r), children: e.map((n) => /* @__PURE__ */ c(
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
const Wr = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("circle", { cx: "12", cy: "13", r: "8" }),
  /* @__PURE__ */ t("path", { d: "M12 9v4l3 2" }),
  /* @__PURE__ */ t("path", { d: "M5 3 2 6M22 6l-3-3" })
] }), Br = {
  normal: "neutral",
  warning: "tertiary",
  overdue: "primary"
};
function Gr({
  title: e,
  points: r,
  dueDateText: n,
  dueDateUrgency: o = "normal",
  tags: s = [],
  assigneeName: l,
  assigneeAvatar: i,
  metaBadges: a = [],
  className: u,
  onClick: d
}) {
  return /* @__PURE__ */ c(
    "div",
    {
      onClick: d,
      role: d ? "button" : void 0,
      tabIndex: d ? 0 : void 0,
      onKeyDown: d ? (g) => {
        (g.key === "Enter" || g.key === " ") && (g.preventDefault(), d());
      } : void 0,
      className: p(
        // radius-sm (8px) matches Figma's "Task Card" border-radius exactly (Cards01.md L246);
        // rounded-lg here previously resolved to this project's --radius-lg (24px), far too round.
        // No border is ever rendered on the card in the export, so the resting border is transparent
        // (kept as a real border utility, not removed, so the hover reveal below still works).
        "flex flex-col gap-4 p-4 bg-surface-panel text-main rounded-sm border border-transparent shadow-xs hover:border-subtle transition-all cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
        u
      ),
      children: [
        /* @__PURE__ */ t(it, { title: e }),
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
            /* @__PURE__ */ t(_, { variant: Br[o], icon: /* @__PURE__ */ t(Wr, {}), children: n })
          ) : null
        ] }) : null,
        s.length > 0 ? /* @__PURE__ */ t("div", { className: "flex flex-wrap items-center gap-2", children: s.map((g, h) => /* @__PURE__ */ t(_, { variant: g.variant || "neutral", children: g.label }, h)) }) : null,
        /* @__PURE__ */ c("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ c("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ t(ie, { src: i, name: l, size: "sm" }),
            l ? /* @__PURE__ */ t("span", { className: "font-sans text-xs font-medium text-muted truncate max-w-[120px]", children: l }) : null
          ] }),
          a.length > 0 ? /* @__PURE__ */ t(Or, { badges: a }) : null
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
      className: p("animate-pulse rounded-sm bg-neutral-3", e)
    }
  );
}
function ke() {
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
function zn({ title: e, icon: r, tasks: n, isLoading: o = !1, className: s }) {
  return /* @__PURE__ */ c("div", { className: p("flex flex-col gap-4 w-full", s), children: [
    /* @__PURE__ */ t(it, { title: e, icon: r }),
    o ? /* @__PURE__ */ c(dt, { children: [
      /* @__PURE__ */ t(ke, {}),
      /* @__PURE__ */ t(ke, {}),
      /* @__PURE__ */ t(ke, {})
    ] }) : n.length === 0 ? /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-16 text-muted font-sans text-sm", children: "No tasks in this view." }) : n.map((l, i) => /* @__PURE__ */ t(Gr, { ...l, className: "w-full" }, i))
  ] });
}
const W = {
  name: 500,
  tags: 168,
  estimation: 140,
  assignee: 168,
  dueDate: 132
}, Er = ({ className: e }) => /* @__PURE__ */ t("svg", { className: e, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m6 9 6 6 6-6" }) }), Vr = ({ className: e }) => /* @__PURE__ */ t("svg", { className: e, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m9 18 6-6-6-6" }) }), Fr = ({ className: e }) => /* @__PURE__ */ t("svg", { className: e, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": !0, children: /* @__PURE__ */ t("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3" }) }), X = "text-body-m font-normal text-main font-sans", E = "h-14 shrink-0 bg-surface-panel border-y border-r border-neutral-3";
function _r({ date: e, urgency: r = "normal" }) {
  return /* @__PURE__ */ t("span", { className: p(X, {
    normal: "text-main",
    warning: "text-tertiary-4",
    // text-primary-4 kept as a raw ramp class, not aliased to `text-interactive` — this is a
    // status/urgency signal, not an interactive affordance, so the "interactive" alias would
    // misrepresent its role even though it happens to share the same color value.
    overdue: "text-primary-4"
  }[r]), children: e });
}
function Ur({ name: e, avatarSrc: r }) {
  return /* @__PURE__ */ c("div", { className: "flex items-center gap-2 min-w-0", children: [
    /* @__PURE__ */ t(ie, { src: r, name: e, size: "sm" }),
    /* @__PURE__ */ t("span", { className: p(X, "truncate"), children: e })
  ] });
}
function $r({ points: e }) {
  return /* @__PURE__ */ c("span", { className: p(X, "tabular-nums"), children: [
    e,
    " ",
    e === 1 ? "Point" : "Points"
  ] });
}
function Kr({ labels: e }) {
  return /* @__PURE__ */ t("div", { className: "flex flex-wrap items-center gap-2", children: e.map((r, n) => /* @__PURE__ */ t(_, { variant: r.variant ?? "neutral", children: r.label }, n)) });
}
const Hr = {
  primary: "bg-primary-4",
  secondary: "bg-secondary-4",
  tertiary: "bg-tertiary-4"
};
function Yr({
  index: e,
  title: r,
  indicatorColor: n = "secondary",
  reactions: o = [],
  isSelected: s = !1,
  onSelectedChange: l,
  tags: i = [],
  estimationPoints: a,
  assigneeName: u,
  assigneeAvatar: d,
  dueDate: g,
  dueDateUrgency: h = "normal",
  onClick: k,
  onViewDetails: y
}) {
  return /* @__PURE__ */ c("tr", { onClick: k, className: p("group", k && "cursor-pointer"), children: [
    /* @__PURE__ */ t("td", { className: p(E, "pl-0 pr-4 border-l"), style: { width: W.name }, children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ t("span", { className: p("w-1 h-full shrink-0", Hr[n]) }),
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
          Fr,
          {
            className: p(
              "w-6 h-6 text-main transition-opacity",
              s ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
            )
          }
        )
      ] }),
      /* @__PURE__ */ t("span", { className: p(X, "shrink-0 tabular-nums"), children: String(e).padStart(2, "0") }),
      /* @__PURE__ */ t("span", { className: p(X, "flex-1 min-w-0 truncate"), children: r }),
      o.map((C) => /* @__PURE__ */ c("span", { className: p(X, "inline-flex items-center gap-1 shrink-0"), children: [
        /* @__PURE__ */ t("span", { className: "tabular-nums", children: C.count }),
        /* @__PURE__ */ t("span", { children: C.emoji })
      ] }, C.emoji)),
      y ? /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          onClick: y,
          className: p(X, "inline-flex items-center gap-1 shrink-0 hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs"),
          children: [
            /* @__PURE__ */ t("span", { children: "Details" }),
            /* @__PURE__ */ t(Vr, { className: "w-4 h-4" })
          ]
        }
      ) : null
    ] }) }),
    /* @__PURE__ */ t("td", { className: p(E, "pl-2 pr-4"), style: { width: W.tags }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: i.length > 0 ? /* @__PURE__ */ t(Kr, { labels: i }) : null }) }),
    /* @__PURE__ */ t("td", { className: p(E, "pl-2 pr-4"), style: { width: W.estimation }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: a !== void 0 ? /* @__PURE__ */ t($r, { points: a }) : null }) }),
    /* @__PURE__ */ t("td", { className: p(E, "pl-2 pr-4"), style: { width: W.assignee }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: u ? /* @__PURE__ */ t(Ur, { name: u, avatarSrc: d }) : null }) }),
    /* @__PURE__ */ t("td", { className: p(E, "pl-2 pr-4"), style: { width: W.dueDate }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: g ? /* @__PURE__ */ t(_r, { date: g, urgency: h }) : null }) })
  ] });
}
function Xr() {
  return /* @__PURE__ */ c("tr", { children: [
    /* @__PURE__ */ t("td", { className: p(E, "pl-4 pr-4 border-l"), style: { width: W.name }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(G, { className: "h-4 w-full" }) }) }),
    /* @__PURE__ */ t("td", { className: p(E, "pl-4 pr-4"), style: { width: W.tags }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(G, { className: "h-6 w-16 rounded" }) }) }),
    /* @__PURE__ */ t("td", { className: p(E, "pl-4 pr-4"), style: { width: W.estimation }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(G, { className: "h-4 w-16" }) }) }),
    /* @__PURE__ */ t("td", { className: p(E, "pl-4 pr-4"), style: { width: W.assignee }, children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ t(G, { className: "w-8 h-8 rounded-full shrink-0" }),
      /* @__PURE__ */ t(G, { className: "h-4 w-20" })
    ] }) }),
    /* @__PURE__ */ t("td", { className: p(E, "pl-4 pr-4"), style: { width: W.dueDate }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(G, { className: "h-4 w-20" }) }) })
  ] });
}
const le = [
  { key: "name", label: "# Task Name" },
  { key: "tags", label: "Task Tags" },
  { key: "estimation", label: "Estimate" },
  { key: "assignee", label: "Task Assign Name" },
  { key: "dueDate", label: "Due Date" }
];
function Mn({ groups: e, isLoading: r = !1, className: n }) {
  return /* @__PURE__ */ t(
    "div",
    {
      className: p(
        "w-full overflow-x-auto",
        "[scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-3 [&::-webkit-scrollbar-thumb]:rounded-full",
        n
      ),
      children: /* @__PURE__ */ c("div", { className: "flex flex-col gap-4 min-w-[1108px]", children: [
        /* @__PURE__ */ t("div", { className: "flex", children: le.map(({ key: o, label: s }, l) => /* @__PURE__ */ t(
          "div",
          {
            className: p(
              E,
              "px-4",
              l === 0 && "border-l rounded-l-4",
              l === le.length - 1 && "rounded-r-4"
            ),
            style: { width: W[o] },
            children: /* @__PURE__ */ t("span", { className: X, children: s })
          },
          o
        )) }),
        r ? /* @__PURE__ */ c("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ t("colgroup", { children: le.map(({ key: o }) => /* @__PURE__ */ t("col", { style: { width: W[o] } }, o)) }),
          /* @__PURE__ */ t("tbody", { children: Array.from({ length: 5 }).map((o, s) => /* @__PURE__ */ t(Xr, {}, s)) })
        ] }) : e.length === 0 ? /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-16 text-muted font-sans text-sm", children: "No tasks yet." }) : e.map((o, s) => /* @__PURE__ */ c("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ t("colgroup", { children: le.map(({ key: l }) => /* @__PURE__ */ t("col", { style: { width: W[l] } }, l)) }),
          /* @__PURE__ */ c("tbody", { children: [
            /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ t("td", { colSpan: le.length, className: "p-0 border border-neutral-3", children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2 h-14 px-4 bg-surface-panel rounded-t-4", children: [
              /* @__PURE__ */ t(Er, { className: "w-6 h-6 shrink-0 text-muted" }),
              /* @__PURE__ */ t("h3", { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: o.title }),
              o.actions
            ] }) }) }),
            o.rows.map((l, i) => /* @__PURE__ */ t(Yr, { ...l }, i))
          ] })
        ] }, s))
      ] })
    }
  );
}
function he({
  isOpen: e,
  onClose: r,
  triggerRef: n,
  role: o = "dialog",
  children: s,
  className: l,
  ...i
}) {
  const a = S(null), { overlayProps: u } = bt(
    {
      isOpen: e,
      onClose: r,
      isDismissable: !0,
      shouldCloseOnInteractOutside: (d) => {
        var g;
        return !((g = n == null ? void 0 : n.current) != null && g.contains(d));
      }
    },
    a
  );
  return e ? (
    // eslint-disable-next-line jsx-a11y/no-autofocus
    /* @__PURE__ */ t($e, { restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ c(
      "div",
      {
        ...u,
        ...i,
        ref: a,
        role: o,
        className: l,
        children: [
          /* @__PURE__ */ t(pe, { onDismiss: r }),
          s,
          /* @__PURE__ */ t(pe, { onDismiss: r })
        ]
      }
    ) })
  ) : null;
}
function at({ state: e, children: r, popoverRef: n, className: o, ...s }) {
  const l = S(null), i = n ?? l, { popoverProps: a, underlayProps: u } = ht({ ...s, popoverRef: i }, e);
  return /* @__PURE__ */ c(gt, { children: [
    /* @__PURE__ */ t("div", { ...u, className: "fixed inset-0" }),
    /* @__PURE__ */ c(
      "div",
      {
        ...a,
        ref: i,
        onKeyDownCapture: (d) => {
          d.key === "Escape" && (d.stopPropagation(), e.close());
        },
        className: p(
          "z-50 bg-surface-overlay rounded-sm border border-subtle shadow-xl",
          o
        ),
        children: [
          /* @__PURE__ */ t(pe, { onDismiss: () => e.close() }),
          r,
          /* @__PURE__ */ t(pe, { onDismiss: () => e.close() })
        ]
      }
    )
  ] });
}
function ct({
  state: e,
  listBoxRef: r,
  className: n,
  ...o
}) {
  const s = S(null), l = r ?? s, { listBoxProps: i } = xt(o, e, l);
  return /* @__PURE__ */ t(
    "ul",
    {
      ...i,
      ref: l,
      className: p("max-h-64 min-w-40 overflow-auto py-2 outline-none", n),
      children: [...e.collection].map((a) => /* @__PURE__ */ t(qr, { item: a, state: e }, a.key))
    }
  );
}
function qr({ item: e, state: r }) {
  const n = S(null), { optionProps: o, isSelected: s, isFocused: l, isDisabled: i } = vt(
    { key: e.key },
    r,
    n
  );
  return /* @__PURE__ */ c(
    "li",
    {
      ...o,
      ref: n,
      className: p(
        "flex items-center justify-between gap-4 px-4 py-1.5 text-body-m font-sans cursor-pointer outline-none",
        // Focus and selection are independent states with independent
        // styling — merging them would leave a keyboard user with no way
        // to tell which option their arrow keys are actually on.
        l && "bg-neutral-4",
        s ? "text-interactive font-semibold" : "text-main",
        i && "cursor-not-allowed opacity-50"
      ),
      children: [
        /* @__PURE__ */ t("span", { children: e.rendered }),
        s ? /* @__PURE__ */ t("span", { "aria-hidden": "true", children: "✓" }) : null
      ]
    }
  );
}
function In({ placeholder: e, icon: r, className: n, ...o }) {
  const s = It(o), l = S(null), { labelProps: i, triggerProps: a, valueProps: u, menuProps: d } = yt(o, s, l), { buttonProps: g } = re(a, l);
  return /* @__PURE__ */ c("div", { className: p("inline-flex flex-col gap-1.5", n), children: [
    o.label ? /* @__PURE__ */ t(
      "span",
      {
        ...i,
        className: "text-field-label font-semibold text-neutral-3 uppercase font-sans",
        children: o.label
      }
    ) : null,
    /* @__PURE__ */ t(wt, { state: s, triggerRef: l, label: o.label, name: o.name }),
    /* @__PURE__ */ c(
      "button",
      {
        ...g,
        ref: l,
        type: "button",
        className: p(
          // `bg-surface-neutral` is a light (near-white) surface, matching
          // `Input`'s value/placeholder colors (`text-neutral-5`/`text-muted`)
          // rather than `text-main`/`text-muted`, which assume a dark shell
          // background and would render invisible white-on-white here once
          // something is selected.
          "inline-flex items-center gap-2 h-10 px-3 py-2 rounded-md bg-surface-neutral border border-subtle text-body-m font-sans whitespace-nowrap transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          s.selectedItem ? "text-neutral-5" : "text-muted"
        ),
        children: [
          r,
          /* @__PURE__ */ t("span", { ...u, className: "flex-1 text-left truncate", children: s.selectedItem ? s.selectedItem.rendered : e }),
          /* @__PURE__ */ t(Jr, {})
        ]
      }
    ),
    s.isOpen ? /* @__PURE__ */ t(at, { state: s, triggerRef: l, placement: "bottom start", children: /* @__PURE__ */ t(ct, { ...d, state: s }) }) : null
  ] });
}
const Jr = () => /* @__PURE__ */ t(
  "svg",
  {
    className: "w-3 h-3 shrink-0",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": !0,
    children: /* @__PURE__ */ t("path", { d: "m6 9 6 6 6-6" })
  }
);
function jn({
  label: e,
  placeholder: r,
  icon: n,
  isDisabled: o,
  className: s,
  ...l
}) {
  const i = Se({}), a = S(null), u = jt({
    ...l,
    selectionMode: "multiple",
    // Explicit, not the default: a plain click on an item should add it to
    // the selection, not replace it — the behavior a set of checkable tags
    // needs, unlike a file browser's click-to-replace/Ctrl-click-to-add.
    selectionBehavior: "toggle"
  }), { buttonProps: d } = re(
    { onPress: () => i.toggle(), isDisabled: o, "aria-label": e },
    a
  ), g = [...u.collection].filter(
    (h) => u.selectionManager.isSelected(h.key)
  );
  return /* @__PURE__ */ c("div", { className: p("inline-block", s), children: [
    /* @__PURE__ */ c(
      "button",
      {
        ...d,
        ref: a,
        type: "button",
        "aria-haspopup": "listbox",
        "aria-expanded": i.isOpen,
        className: p(
          // See Select's identical note: `bg-surface-neutral` is a light
          // surface, so the placeholder/value text needs `Input`'s
          // light-surface colors (`text-muted`/`text-neutral-5`), not
          // `text-main` (invisible white-on-white once something's picked).
          "inline-flex items-center gap-2 min-h-10 px-3 py-1.5 rounded-md bg-surface-neutral border border-subtle text-body-m font-sans transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          g.length > 0 ? "text-neutral-5" : "text-muted"
        ),
        children: [
          n,
          g.length > 0 ? /* @__PURE__ */ t("span", { className: "flex flex-wrap items-center gap-1", children: g.map((h) => /* @__PURE__ */ t(_, { variant: "primary", children: h.rendered }, h.key)) }) : /* @__PURE__ */ t("span", { children: r }),
          /* @__PURE__ */ t(Qr, {})
        ]
      }
    ),
    i.isOpen ? /* @__PURE__ */ t(at, { state: i, triggerRef: a, placement: "bottom start", children: /* @__PURE__ */ t(ct, { "aria-label": e, state: u, autoFocus: !0 }) }) : null
  ] });
}
const Qr = () => /* @__PURE__ */ t(
  "svg",
  {
    className: "w-3 h-3 shrink-0",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": !0,
    children: /* @__PURE__ */ t("path", { d: "m6 9 6 6 6-6" })
  }
);
function Tn({ title: e, isOpen: r, onClose: n, children: o, width: s = "max-w-md", role: l = "dialog" }) {
  const i = S(null), a = S(null), u = Se({
    isOpen: r,
    onOpenChange: (y) => {
      y || n();
    }
  }), { modalProps: d, underlayProps: g } = kt(
    { isDismissable: !0 },
    u,
    i
  ), { dialogProps: h, titleProps: k } = Nt({ role: l }, a);
  return r ? /* @__PURE__ */ t(
    "div",
    {
      ...g,
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      children: /* @__PURE__ */ t($e, { contain: !0, restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ t(
        "div",
        {
          ...d,
          ref: i,
          className: p("w-full", s),
          children: /* @__PURE__ */ c(
            "div",
            {
              ...h,
              ref: a,
              className: "flex flex-col bg-surface-overlay rounded-sm border border-subtle overflow-hidden",
              children: [
                /* @__PURE__ */ c("div", { className: "flex items-center justify-between px-4 py-4 border-b border-neutral-4", children: [
                  /* @__PURE__ */ t(
                    "h2",
                    {
                      ...k,
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
function Rn(e = !1) {
  const r = Se({ defaultOpen: e });
  return {
    isOpen: r.isOpen,
    open: r.open,
    close: r.close,
    toggle: r.toggle
  };
}
const Zr = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m15 18-6-6 6-6" }) }), en = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m9 18 6-6-6-6" }) }), tn = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m18 18-6-6 6-6M12 18l-6-6 6-6" }) }), rn = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m6 18 6-6-6-6M12 18l6-6-6-6" }) });
function Fe(e) {
  return new Dt(e.getFullYear(), e.getMonth() + 1, e.getDate());
}
function nn(e) {
  return e.toDate(Ne());
}
function on({
  value: e,
  defaultValue: r,
  onChange: n,
  onClose: o,
  triggerRef: s,
  className: l
}) {
  const i = e !== void 0 ? { value: Fe(e) } : { defaultValue: r ? Fe(r) : null }, a = Tt({
    ...i,
    onChange: (P) => n == null ? void 0 : n(nn(P)),
    createCalendar: At,
    // Hardcoded, matching the prior implementation's hardcoded English
    // MONTHS/DAYS arrays — no `I18nProvider`/locale story exists in this kit
    // yet, so introducing locale-dependent formatting here would be an
    // unverified behavior change, not a fix.
    locale: "en-US",
    firstDayOfWeek: "sun",
    weeksInMonth: 6
  }), { calendarProps: u, prevButtonProps: d, nextButtonProps: g } = Ct(
    { "aria-label": "Date picker" },
    a
  ), h = S(null), k = S(null), { buttonProps: y } = re(d, h), { buttonProps: C } = re(g, k), w = () => {
    const P = Ot(Ne());
    a.setFocusedDate(P), a.selectDate(P);
  };
  return /* @__PURE__ */ c(
    he,
    {
      isOpen: !0,
      onClose: o,
      triggerRef: s,
      "aria-label": "Date picker",
      className: p(
        "flex flex-col w-[280px] bg-surface-shell border border-subtle rounded-4 shadow-elevation select-none",
        l
      ),
      children: [
        /* @__PURE__ */ c("div", { ...u, className: "flex flex-col", children: [
          /* @__PURE__ */ c("div", { className: "flex items-center justify-between px-2 py-[9px] h-10", children: [
            /* @__PURE__ */ c("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: () => a.focusPreviousSection(!0),
                  "aria-label": "Previous year",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ t(tn, {})
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  ...y,
                  ref: h,
                  "aria-label": "Previous month",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ t(Zr, {})
                }
              )
            ] }),
            /* @__PURE__ */ t("span", { className: "font-sans font-semibold text-body-sm text-main", children: a.visibleRange.start.toDate(Ne()).toLocaleDateString("en-US", { month: "long", year: "numeric" }) }),
            /* @__PURE__ */ c("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ t(
                "button",
                {
                  ...C,
                  ref: k,
                  "aria-label": "Next month",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ t(en, {})
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: () => a.focusNextSection(!0),
                  "aria-label": "Next year",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ t(rn, {})
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ t("div", { className: "h-px w-full bg-neutral-2" }),
          /* @__PURE__ */ t(sn, { state: a })
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
function sn({ state: e }) {
  const { gridProps: r, headerProps: n, weekDays: o, weeksInMonth: s } = Pt(
    { weekdayStyle: "short" },
    e
  ), l = e.visibleRange.start;
  return /* @__PURE__ */ c("div", { ...r, className: "flex flex-col px-3 py-2", children: [
    /* @__PURE__ */ t("div", { ...n, className: "grid grid-cols-7", children: o.map((i, a) => /* @__PURE__ */ t("span", { className: "text-center text-body-sm font-normal text-main font-sans", children: i }, a)) }),
    Array.from({ length: s }, (i, a) => /* @__PURE__ */ t("div", { role: "row", className: "grid grid-cols-7", children: e.getDatesInWeek(a).map(
      (u, d) => u ? /* @__PURE__ */ t(ln, { state: e, date: u, currentMonth: l }, u.toString()) : /* @__PURE__ */ t("div", { role: "gridcell", "aria-hidden": "true" }, d)
    ) }, a))
  ] });
}
function ln({
  state: e,
  date: r,
  currentMonth: n
}) {
  const o = S(null), s = !Wt(r, n), { cellProps: l, buttonProps: i, isSelected: a, isDisabled: u, formattedDate: d } = St(
    { date: r, isOutsideMonth: s },
    e,
    o
  );
  return /* @__PURE__ */ t("div", { ...l, className: "flex items-center justify-center my-[3px]", children: /* @__PURE__ */ t(
    "div",
    {
      ...i,
      ref: o,
      className: p(
        "flex items-center justify-center w-6 h-6 rounded-2 text-body-sm font-normal font-sans transition-colors outline-none focus-visible:outline-2 focus-visible:outline-primary-4",
        u ? "text-muted cursor-default" : a ? "border border-primary-4 text-main cursor-pointer" : "text-main hover:bg-neutral-3 cursor-pointer"
      ),
      children: d
    }
  ) });
}
const an = [1, 2, 3, 5, 8], cn = () => /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M6 21V4a1 1 0 0 1 1-1h10.5a1 1 0 0 1 .8 1.6L15 9l3.3 4.4a1 1 0 0 1-.8 1.6H7" }) });
function dn({ value: e, onSelect: r, onClose: n, triggerRef: o, className: s }) {
  return /* @__PURE__ */ c(
    he,
    {
      isOpen: !0,
      onClose: n,
      triggerRef: o,
      "aria-label": "Estimate",
      className: p(
        "flex flex-col w-[122px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        s
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans whitespace-nowrap", children: "Estimate" }) }),
        an.map((l) => /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: () => r(l),
            "aria-pressed": e === l,
            className: p(
              "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
              e === l ? "bg-neutral-2" : "hover:bg-neutral-2"
            ),
            children: [
              /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ t(cn, {}) }),
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
function un({
  name: e,
  role: r,
  avatarSrc: n,
  size: o = "md",
  isOnline: s = !1,
  className: l,
  onClick: i
}) {
  const a = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm"
  };
  return /* @__PURE__ */ c(
    i ? "button" : "div",
    {
      type: i ? "button" : void 0,
      onClick: i,
      className: p(
        // padding: 4px 16px, gap: 8px -- matches Figma "User" component (Avatar frame, 239x56)
        "flex items-center gap-2 px-4 py-1 min-w-0",
        i && "cursor-pointer hover:opacity-80 transition-opacity outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-sm",
        l
      ),
      children: [
        /* @__PURE__ */ c("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ t(ie, { src: n, name: e, size: o }),
          s ? /* @__PURE__ */ t("span", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary-4 border-2 border-neutral-5" }) : null
        ] }),
        /* @__PURE__ */ c("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ t("span", { className: "font-sans font-normal text-body-m text-main truncate", children: e }),
          r ? /* @__PURE__ */ t(
            "span",
            {
              className: p(
                "font-sans text-muted truncate leading-tight",
                a[o]
              ),
              children: r
            }
          ) : null
        ] })
      ]
    }
  );
}
function mn({ assignees: e, onSelect: r, onClose: n, triggerRef: o, className: s }) {
  return /* @__PURE__ */ c(
    he,
    {
      isOpen: !0,
      onClose: n,
      triggerRef: o,
      "aria-label": "Assignee",
      className: p(
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
            children: /* @__PURE__ */ t(un, { name: l.name, role: l.role, avatarSrc: l.avatarSrc, size: "sm" })
          },
          l.id
        ))
      ]
    }
  );
}
function fn({ labels: e, onSelect: r, onClose: n, triggerRef: o, className: s }) {
  return /* @__PURE__ */ c(
    he,
    {
      isOpen: !0,
      onClose: n,
      triggerRef: o,
      "aria-label": "Label",
      className: p(
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
            children: /* @__PURE__ */ t(_, { variant: l.variant ?? "neutral", children: l.text })
          },
          l.id
        ))
      ]
    }
  );
}
const _e = () => /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M6 21V4a1 1 0 0 1 1-1h10.5a1 1 0 0 1 .8 1.6L15 9l3.3 4.4a1 1 0 0 1-.8 1.6H7" }) }), pn = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("circle", { cx: "12", cy: "8", r: "4" }),
  /* @__PURE__ */ t("path", { d: "M4 20c0-4 3.5-6 8-6s8 2 8 6" })
] }), bn = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
  /* @__PURE__ */ t("path", { d: "M3 10h18M8 3v4M16 3v4" })
] }), hn = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("path", { d: "M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7.17-7.17a2 2 0 0 0 0-2.82z" }),
  /* @__PURE__ */ t("circle", { cx: "7.5", cy: "7.5", r: "1.5", fill: "currentColor", stroke: "none" })
] });
function An({
  isOpen: e,
  onClose: r,
  assignees: n = [],
  labels: o = [],
  onSubmit: s,
  initialTitle: l = "",
  initialDueDate: i,
  initialPoints: a,
  initialAssignee: u,
  initialLabel: d,
  className: g
}) {
  const [h, k] = B.useState(l), [y, C] = B.useState(i), [w, P] = B.useState(a), [R, z] = B.useState(u), [V, U] = B.useState(d), [M, O] = B.useState(null), j = (N) => O(($) => $ === N ? null : N), b = () => O(null), T = B.useRef(null), ee = B.useRef(null), te = B.useRef(null), J = B.useRef(null);
  if (!e) return null;
  const ne = () => {
    k(""), C(void 0), P(void 0), z(void 0), U(void 0), O(null);
  }, oe = (N) => {
    N.preventDefault(), h.trim() && (s == null || s({ title: h.trim(), dueDate: y, points: w, assignee: R, label: V }), ne(), r());
  }, H = () => {
    ne(), r();
  };
  return /* @__PURE__ */ c(
    "form",
    {
      onSubmit: oe,
      className: p(
        "flex flex-col items-end gap-6 w-[578px] p-4 bg-surface-overlay rounded-sm",
        g
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
                onClick: () => j("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "estimate",
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(_, { icon: /* @__PURE__ */ t(_e, {}), children: "Estimate" })
              }
            ) : /* @__PURE__ */ c(
              "button",
              {
                ref: T,
                type: "button",
                onClick: () => j("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "estimate",
                className: "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ t(_e, {}) }),
                  w,
                  " Point",
                  w !== 1 ? "s" : ""
                ]
              }
            ),
            M === "estimate" ? /* @__PURE__ */ t(
              dn,
              {
                value: w,
                onSelect: (N) => {
                  P(N), O(null);
                },
                onClose: b,
                triggerRef: T,
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] }),
          /* @__PURE__ */ c("div", { className: "relative", children: [
            R ? /* @__PURE__ */ c(
              "button",
              {
                ref: ee,
                type: "button",
                onClick: () => j("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "assignee",
                className: "flex items-center gap-2 h-8 px-2 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ t(ie, { src: R.avatarSrc, name: R.name, size: "sm" }),
                  R.name
                ]
              }
            ) : /* @__PURE__ */ t(
              "button",
              {
                ref: ee,
                type: "button",
                onClick: () => j("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "assignee",
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(_, { icon: /* @__PURE__ */ t(pn, {}), children: "Assignee" })
              }
            ),
            M === "assignee" ? /* @__PURE__ */ t(
              mn,
              {
                assignees: n,
                onSelect: (N) => {
                  z(N), O(null);
                },
                onClose: b,
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
                onClick: () => j("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "label",
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(_, { variant: V.variant ?? "neutral", children: V.text })
              }
            ) : /* @__PURE__ */ t(
              "button",
              {
                ref: te,
                type: "button",
                onClick: () => j("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "label",
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(_, { icon: /* @__PURE__ */ t(hn, {}), children: "Label" })
              }
            ),
            M === "label" ? /* @__PURE__ */ t(
              fn,
              {
                labels: o,
                onSelect: (N) => {
                  U(N), O(null);
                },
                onClose: b,
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
                onClick: () => j("date"),
                "aria-haspopup": "dialog",
                "aria-expanded": M === "date",
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(_, { icon: /* @__PURE__ */ t(bn, {}), children: y ? y.toLocaleDateString("en-US") : "Due date" })
              }
            ),
            M === "date" ? /* @__PURE__ */ t(
              on,
              {
                value: y,
                onChange: (N) => {
                  C(N), O(null);
                },
                onClose: b,
                triggerRef: J,
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] })
        ] }),
        /* @__PURE__ */ c("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ t(Ve, { variant: "secondary", onPress: H, children: "Cancel" }),
          /* @__PURE__ */ t(Ve, { variant: "primary", type: "submit", isDisabled: !h.trim(), children: "Create Task" })
        ] })
      ]
    }
  );
}
function Dn({ variant: e = "neutral", children: r, className: n }) {
  return /* @__PURE__ */ t(
    "span",
    {
      className: p(
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
function On({
  children: e,
  isSelected: r,
  defaultSelected: n = !1,
  onChange: o,
  isDisabled: s = !1,
  isIndeterminate: l = !1,
  className: i
}) {
  const a = Rt({
    isSelected: r,
    defaultSelected: n,
    onChange: o
  }), u = S(null), { inputProps: d, labelProps: g } = Lt(
    {
      isSelected: a.isSelected,
      isIndeterminate: l,
      isDisabled: s,
      "aria-label": typeof e == "string" ? e : "Checkbox"
    },
    a,
    u
  );
  return /* @__PURE__ */ c(
    "label",
    {
      ...g,
      className: p(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Label Checkbox" component exactly
        // (Property 1=Default/Selected, Tags01.md / Add Task Modal04/05.md).
        "inline-flex items-center gap-2 px-4 py-1 rounded cursor-pointer select-none group has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-4 has-[:focus-visible]:outline-offset-2",
        s && "opacity-50 cursor-not-allowed",
        i
      ),
      children: [
        /* @__PURE__ */ t("input", { ...d, ref: u, className: "sr-only" }),
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
              a.isSelected && !l ? /* @__PURE__ */ t("path", { d: "M8 12.5 11 15.5 16 9.5", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }) : l ? /* @__PURE__ */ t("path", { d: "M8 12h8", strokeWidth: 2, strokeLinecap: "round" }) : null
            ]
          }
        ),
        /* @__PURE__ */ t("span", { className: "text-body-m font-normal font-sans text-main", children: e })
      ]
    }
  );
}
function Wn({ label: e, error: r, className: n, ...o }) {
  const s = S(null), { labelProps: l, inputProps: i, errorMessageProps: a } = Pe(
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
        ...i,
        ref: s,
        type: "date",
        className: p(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md transition-colors outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral font-sans cursor-pointer",
          r && "border-danger-5 focus-visible:outline-danger-5",
          n
        )
      }
    ),
    r ? /* @__PURE__ */ t("span", { ...a, className: "text-xs text-danger font-sans", children: r }) : null
  ] });
}
function gn({
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
      className: p(
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
            className: p(
              "px-2 py-0.5 text-xs font-bold rounded-full shrink-0",
              n ? "bg-primary-4 text-main" : "bg-neutral-3 text-main"
            ),
            children: o
          }
        ) : null,
        /* @__PURE__ */ t(
          "span",
          {
            className: p(
              "w-1 h-full shrink-0 bg-primary-4 transition-opacity",
              n ? "opacity-100" : "opacity-0"
            )
          }
        )
      ]
    }
  );
}
function xn({ logo: e, items: r, className: n }) {
  return /* @__PURE__ */ c(
    "nav",
    {
      "aria-label": "Main navigation",
      className: p(
        // 232px / rounded-lg (24px) matches the real "Sidebar" layer (ApplicationSidebar01.md + Dashboard Mockup.md).
        "flex flex-col w-[232px] h-full bg-surface-panel rounded-lg select-none shrink-0",
        n
      ),
      children: [
        e ? /* @__PURE__ */ t("div", { className: "flex justify-center pt-3 h-24 shrink-0", children: e }) : null,
        /* @__PURE__ */ t("div", { className: "flex flex-col gap-2 flex-1 overflow-y-auto", children: r.map((o, s) => /* @__PURE__ */ t(gn, { ...o }, s)) })
      ]
    }
  );
}
function Bn({
  value: e,
  onChange: r,
  leftIcon: n,
  rightIcon: o,
  leftLabel: s,
  rightLabel: l,
  className: i
}) {
  return /* @__PURE__ */ c("div", { className: p("flex items-center w-20 h-10 bg-surface-shell rounded-sm", i), children: [
    /* @__PURE__ */ t(
      Ee,
      {
        variant: "secondary",
        isSelected: e === "left",
        "aria-label": s,
        onPress: () => r == null ? void 0 : r("left"),
        children: n
      }
    ),
    /* @__PURE__ */ t(
      Ee,
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
function Gn({ logo: e, sidebarItems: r, topNavProps: n, topBar: o, children: s, className: l }) {
  return /* @__PURE__ */ c("div", { className: p("flex items-start gap-8 w-full min-h-screen bg-surface-shell p-8", l), children: [
    /* @__PURE__ */ t(xn, { logo: e, items: r, className: "self-stretch" }),
    /* @__PURE__ */ c("div", { className: "flex flex-col gap-8 flex-1 min-w-0", children: [
      /* @__PURE__ */ t(Rr, { ...n }),
      /* @__PURE__ */ c("div", { className: "flex flex-col gap-4", children: [
        o ? /* @__PURE__ */ t("div", { className: "flex items-start justify-between gap-6", children: o }) : null,
        s
      ] })
    ] })
  ] });
}
export {
  An as AddTaskModal,
  Gn as AppShell,
  xn as ApplicationSidebar,
  mn as AssigneeModal,
  Ur as AssigneeNameCell,
  ie as Avatar,
  Dn as Badge,
  Ee as Button,
  Ln as Card,
  on as DatePickerMenu,
  Wn as Datepicker,
  _r as DueDateCell,
  dn as EstimateModal,
  $r as EstimationCell,
  at as FloatingPopover,
  Cn as Input,
  On as LabelCheckbox,
  fn as LabelModal,
  ct as ListBox,
  Tn as Modal,
  jn as MultiSelect,
  he as Popover,
  it as ProjectInfo,
  Ir as SearchBar,
  Sn as SegmentedControl,
  In as Select,
  gn as SidebarItem,
  G as Skeleton,
  Pn as Tabs,
  _ as Tag,
  Kr as TagCell,
  Gr as TaskCard,
  zn as TaskListView,
  Or as TaskMetaBadges,
  Mn as TaskTable,
  Yr as TaskTableRow,
  Ve as TextButton,
  Rr as TopNav,
  un as UserRow,
  Bn as ViewSwitcher,
  p as cn,
  Rn as useModalState
};
