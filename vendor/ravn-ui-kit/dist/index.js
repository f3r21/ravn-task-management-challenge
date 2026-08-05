import { jsx as t, jsxs as c, Fragment as Ke } from "react/jsx-runtime";
import B, { useRef as P, useState as He, useMemo as ut } from "react";
import { useButton as Z, useTextField as Pe, useTabList as mt, useTab as ft, useTabPanel as pt, useOverlay as bt, FocusScope as Se, DismissButton as pe, usePopover as ht, Overlay as gt, useListBox as xt, useOption as vt, useSelect as yt, HiddenSelect as wt, useMenuTrigger as kt, useMenu as Nt, useMenuItem as Ct, useModalOverlay as Pt, useDialog as St, useCalendar as Mt, useCalendarGrid as Lt, useCalendarCell as zt, useCheckbox as It } from "react-aria";
import { useTabListState as Tt, Item as jt, useSelectState as Rt, useOverlayTriggerState as Me, useListState as At, useMenuTriggerState as Dt, useTreeState as Ot, useCalendarState as Wt, useToggleState as Bt } from "react-stately";
import { createCalendar as Gt, getLocalTimeZone as Ne, CalendarDate as Et, today as Ft, isSameMonth as Vt } from "@internationalized/date";
function Ye(e) {
  var r, n, s = "";
  if (typeof e == "string" || typeof e == "number") s += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (r = 0; r < o; r++) e[r] && (n = Ye(e[r])) && (s && (s += " "), s += n);
  } else for (n in e) e[n] && (s && (s += " "), s += n);
  return s;
}
function _t() {
  for (var e, r, n = 0, s = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (r = Ye(e)) && (s && (s += " "), s += r);
  return s;
}
const Ut = (e, r) => {
  const n = new Array(e.length + r.length);
  for (let s = 0; s < e.length; s++)
    n[s] = e[s];
  for (let s = 0; s < r.length; s++)
    n[e.length + s] = r[s];
  return n;
}, $t = (e, r) => ({
  classGroupId: e,
  validator: r
}), Xe = (e = /* @__PURE__ */ new Map(), r = null, n) => ({
  nextPart: e,
  validators: r,
  classGroupId: n
}), be = "-", Oe = [], Kt = "arbitrary..", Ht = (e) => {
  const r = Xt(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: s
  } = e;
  return {
    getClassGroupId: (a) => {
      if (a.startsWith("[") && a.endsWith("]"))
        return Yt(a);
      const i = a.split(be), u = i[0] === "" && i.length > 1 ? 1 : 0;
      return qe(i, u, r);
    },
    getConflictingClassGroupIds: (a, i) => {
      if (i) {
        const u = s[a], d = n[a];
        return u ? d ? Ut(d, u) : u : d || Oe;
      }
      return n[a] || Oe;
    }
  };
}, qe = (e, r, n) => {
  if (e.length - r === 0)
    return n.classGroupId;
  const o = e[r], l = n.nextPart.get(o);
  if (l) {
    const d = qe(e, r + 1, l);
    if (d) return d;
  }
  const a = n.validators;
  if (a === null)
    return;
  const i = r === 0 ? e.join(be) : e.slice(r).join(be), u = a.length;
  for (let d = 0; d < u; d++) {
    const g = a[d];
    if (g.validator(i))
      return g.classGroupId;
  }
}, Yt = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const r = e.slice(1, -1), n = r.indexOf(":"), s = r.slice(0, n);
  return s ? Kt + s : void 0;
})(), Xt = (e) => {
  const {
    theme: r,
    classGroups: n
  } = e;
  return qt(n, r);
}, qt = (e, r) => {
  const n = Xe();
  for (const s in e) {
    const o = e[s];
    Le(o, n, s, r);
  }
  return n;
}, Le = (e, r, n, s) => {
  const o = e.length;
  for (let l = 0; l < o; l++) {
    const a = e[l];
    Jt(a, r, n, s);
  }
}, Jt = (e, r, n, s) => {
  if (typeof e == "string") {
    Qt(e, r, n);
    return;
  }
  if (typeof e == "function") {
    Zt(e, r, n, s);
    return;
  }
  er(e, r, n, s);
}, Qt = (e, r, n) => {
  const s = e === "" ? r : Je(r, e);
  s.classGroupId = n;
}, Zt = (e, r, n, s) => {
  if (tr(e)) {
    Le(e(s), r, n, s);
    return;
  }
  r.validators === null && (r.validators = []), r.validators.push($t(n, e));
}, er = (e, r, n, s) => {
  const o = Object.entries(e), l = o.length;
  for (let a = 0; a < l; a++) {
    const [i, u] = o[a];
    Le(u, Je(r, i), n, s);
  }
}, Je = (e, r) => {
  let n = e;
  const s = r.split(be), o = s.length;
  for (let l = 0; l < o; l++) {
    const a = s[l];
    let i = n.nextPart.get(a);
    i || (i = Xe(), n.nextPart.set(a, i)), n = i;
  }
  return n;
}, tr = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, rr = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, n = /* @__PURE__ */ Object.create(null), s = /* @__PURE__ */ Object.create(null);
  const o = (l, a) => {
    n[l] = a, r++, r > e && (r = 0, s = n, n = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(l) {
      let a = n[l];
      if (a !== void 0)
        return a;
      if ((a = s[l]) !== void 0)
        return o(l, a), a;
    },
    set(l, a) {
      l in n ? n[l] = a : o(l, a);
    }
  };
}, Ce = "!", We = ":", nr = [], Be = (e, r, n, s, o) => ({
  modifiers: e,
  hasImportantModifier: r,
  baseClassName: n,
  maybePostfixModifierPosition: s,
  isExternal: o
}), sr = (e) => {
  const {
    prefix: r,
    experimentalParseClassName: n
  } = e;
  let s = (o) => {
    const l = [];
    let a = 0, i = 0, u = 0, d;
    const g = o.length;
    for (let w = 0; w < g; w++) {
      const S = o[w];
      if (a === 0 && i === 0) {
        if (S === We) {
          l.push(o.slice(u, w)), u = w + 1;
          continue;
        }
        if (S === "/") {
          d = w;
          continue;
        }
      }
      S === "[" ? a++ : S === "]" ? a-- : S === "(" ? i++ : S === ")" && i--;
    }
    const h = l.length === 0 ? o : o.slice(u);
    let k = h, y = !1;
    h.endsWith(Ce) ? (k = h.slice(0, -1), y = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      h.startsWith(Ce) && (k = h.slice(1), y = !0)
    );
    const C = d && d > u ? d - u : void 0;
    return Be(l, y, k, C);
  };
  if (r) {
    const o = r + We, l = s;
    s = (a) => a.startsWith(o) ? l(a.slice(o.length)) : Be(nr, !1, a, void 0, !0);
  }
  if (n) {
    const o = s;
    s = (l) => n({
      className: l,
      parseClassName: o
    });
  }
  return s;
}, or = (e) => {
  const r = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((n, s) => {
    r.set(n, 1e6 + s);
  }), (n) => {
    const s = [];
    let o = [];
    for (let l = 0; l < n.length; l++) {
      const a = n[l], i = a[0] === "[", u = r.has(a);
      i || u ? (o.length > 0 && (o.sort(), s.push(...o), o = []), s.push(a)) : o.push(a);
    }
    return o.length > 0 && (o.sort(), s.push(...o)), s;
  };
}, lr = (e) => ({
  cache: rr(e.cacheSize),
  parseClassName: sr(e),
  sortModifiers: or(e),
  postfixLookupClassGroupIds: ar(e),
  ...Ht(e)
}), ar = (e) => {
  const r = /* @__PURE__ */ Object.create(null), n = e.postfixLookupClassGroups;
  if (n)
    for (let s = 0; s < n.length; s++)
      r[n[s]] = !0;
  return r;
}, ir = /\s+/, cr = (e, r) => {
  const {
    parseClassName: n,
    getClassGroupId: s,
    getConflictingClassGroupIds: o,
    sortModifiers: l,
    postfixLookupClassGroupIds: a
  } = r, i = [], u = e.trim().split(ir);
  let d = "";
  for (let g = u.length - 1; g >= 0; g -= 1) {
    const h = u[g], {
      isExternal: k,
      modifiers: y,
      hasImportantModifier: C,
      baseClassName: w,
      maybePostfixModifierPosition: S
    } = n(h);
    if (k) {
      d = h + (d.length > 0 ? " " + d : d);
      continue;
    }
    let R = !!S, L;
    if (R) {
      const T = w.substring(0, S);
      L = s(T);
      const b = L && a[L] ? s(w) : void 0;
      b && b !== L && (L = b, R = !1);
    } else
      L = s(w);
    if (!L) {
      if (!R) {
        d = h + (d.length > 0 ? " " + d : d);
        continue;
      }
      if (L = s(w), !L) {
        d = h + (d.length > 0 ? " " + d : d);
        continue;
      }
      R = !1;
    }
    const F = y.length === 0 ? "" : y.length === 1 ? y[0] : l(y).join(":"), U = C ? F + Ce : F, z = U + L;
    if (i.indexOf(z) > -1)
      continue;
    i.push(z);
    const O = o(L, R);
    for (let T = 0; T < O.length; ++T) {
      const b = O[T];
      i.push(U + b);
    }
    d = h + (d.length > 0 ? " " + d : d);
  }
  return d;
}, dr = (...e) => {
  let r = 0, n, s, o = "";
  for (; r < e.length; )
    (n = e[r++]) && (s = Qe(n)) && (o && (o += " "), o += s);
  return o;
}, Qe = (e) => {
  if (typeof e == "string")
    return e;
  let r, n = "";
  for (let s = 0; s < e.length; s++)
    e[s] && (r = Qe(e[s])) && (n && (n += " "), n += r);
  return n;
}, ur = (e, ...r) => {
  let n, s, o, l;
  const a = (u) => {
    const d = r.reduce((g, h) => h(g), e());
    return n = lr(d), s = n.cache.get, o = n.cache.set, l = i, i(u);
  }, i = (u) => {
    const d = s(u);
    if (d)
      return d;
    const g = cr(u, n);
    return o(u, g), g;
  };
  return l = a, (...u) => l(dr(...u));
}, mr = [], M = (e) => {
  const r = (n) => n[e] || mr;
  return r.isThemeGetter = !0, r;
}, Ze = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, et = /^\((?:(\w[\w-]*):)?(.+)\)$/i, fr = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, pr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, br = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, hr = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, gr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, xr = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Y = (e) => fr.test(e), v = (e) => !!e && !Number.isNaN(Number(e)), V = (e) => !!e && Number.isInteger(Number(e)), we = (e) => e.endsWith("%") && v(e.slice(0, -1)), K = (e) => pr.test(e), tt = () => !0, vr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  br.test(e) && !hr.test(e)
), ze = () => !1, yr = (e) => gr.test(e), wr = (e) => xr.test(e), kr = (e) => !f(e) && !p(e), Nr = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Cr = (e) => q(e, st, ze), f = (e) => Ze.test(e), Q = (e) => q(e, ot, vr), Ge = (e) => q(e, jr, v), Pr = (e) => q(e, at, tt), Sr = (e) => q(e, lt, ze), Ee = (e) => q(e, rt, ze), Mr = (e) => q(e, nt, wr), me = (e) => q(e, it, yr), p = (e) => et.test(e), oe = (e) => ee(e, ot), Lr = (e) => ee(e, lt), Fe = (e) => ee(e, rt), zr = (e) => ee(e, st), Ir = (e) => ee(e, nt), fe = (e) => ee(e, it, !0), Tr = (e) => ee(e, at, !0), q = (e, r, n) => {
  const s = Ze.exec(e);
  return s ? s[1] ? r(s[1]) : n(s[2]) : !1;
}, ee = (e, r, n = !1) => {
  const s = et.exec(e);
  return s ? s[1] ? r(s[1]) : n : !1;
}, rt = (e) => e === "position" || e === "percentage", nt = (e) => e === "image" || e === "url", st = (e) => e === "length" || e === "size" || e === "bg-size", ot = (e) => e === "length", jr = (e) => e === "number", lt = (e) => e === "family-name", at = (e) => e === "number" || e === "weight", it = (e) => e === "shadow", Rr = () => {
  const e = M("color"), r = M("font"), n = M("text"), s = M("font-weight"), o = M("tracking"), l = M("leading"), a = M("breakpoint"), i = M("container"), u = M("spacing"), d = M("radius"), g = M("shadow"), h = M("inset-shadow"), k = M("text-shadow"), y = M("drop-shadow"), C = M("blur"), w = M("perspective"), S = M("aspect"), R = M("ease"), L = M("animate"), F = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], U = () => [
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
  ], z = () => [...U(), p, f], O = () => ["auto", "hidden", "clip", "visible", "scroll"], T = () => ["auto", "contain", "none"], b = () => [p, f, u], j = () => [Y, "full", "auto", ...b()], te = () => [V, "none", "subgrid", p, f], re = () => ["auto", {
    span: ["full", V, p, f]
  }, V, p, f], J = () => [V, "auto", p, f], ne = () => ["auto", "min", "max", "fr", p, f], se = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], H = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], N = () => ["auto", ...b()], $ = () => [Y, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...b()], ge = () => [Y, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...b()], xe = () => [Y, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...b()], x = () => [e, p, f], Te = () => [...U(), Fe, Ee, {
    position: [p, f]
  }], je = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], Re = () => ["auto", "cover", "contain", zr, Cr, {
    size: [p, f]
  }], ve = () => [we, oe, Q], A = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    d,
    p,
    f
  ], D = () => ["", v, oe, Q], ie = () => ["solid", "dashed", "dotted", "double"], Ae = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], I = () => [v, we, Fe, Ee], De = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    C,
    p,
    f
  ], ce = () => ["none", v, p, f], de = () => ["none", v, p, f], ye = () => [v, p, f], ue = () => [Y, "full", ...b()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [K],
      breakpoint: [K],
      color: [tt],
      container: [K],
      "drop-shadow": [K],
      ease: ["in", "out", "in-out"],
      font: [kr],
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
        aspect: ["auto", "square", Y, f, p, S]
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
        "@container": ["", "normal", "size", p, f]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [Nr],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [v, f, p, i]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": F()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": F()
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
        object: z()
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
        overscroll: T()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": T()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": T()
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
        inset: j()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": j()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": j()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": j(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: j()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": j(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: j()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": j()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": j()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: j()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: j()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: j()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: j()
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
        z: [V, "auto", p, f]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Y, "full", "auto", i, ...b()]
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
        flex: [v, Y, "auto", "initial", "none", f]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", v, p, f]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", v, p, f]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [V, "first", "last", "none", p, f]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": te()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: re()
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
        "grid-rows": te()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: re()
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
        justify: [...se(), "normal"]
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
        content: ["normal", ...se()]
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
        "place-content": se()
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
        w: [i, "screen", ...$()]
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
          ...$()
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
        font: [s, Tr, Pr]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", we, f]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Lr, Sr, r]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [f]
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
        tracking: [o, p, f]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [v, "none", p, Ge]
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
        "list-image": ["none", p, f]
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
        list: ["disc", "decimal", "none", p, f]
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
        decoration: [...ie(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [v, "from-font", "auto", p, Q]
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
        "underline-offset": [v, "auto", p, f]
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
        tab: [V, p, f]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", p, f]
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
        content: ["none", p, f]
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
        bg: Te()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: je()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: Re()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, V, p, f],
          radial: ["", p, f],
          conic: [V, p, f]
        }, Ir, Mr]
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
        border: [...ie(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...ie(), "hidden", "none"]
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
        outline: [...ie(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [v, p, f]
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
        opacity: [v, p, f]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Ae(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Ae()
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
        "mask-radial": [p, f]
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
        mask: Te()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: je()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: Re()
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
        mask: ["none", p, f]
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
          p,
          f
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: De()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [v, p, f]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [v, p, f]
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
        grayscale: ["", v, p, f]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [v, p, f]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", v, p, f]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [v, p, f]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", v, p, f]
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
          p,
          f
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": De()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [v, p, f]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [v, p, f]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", v, p, f]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [v, p, f]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", v, p, f]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [v, p, f]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [v, p, f]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", v, p, f]
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", p, f]
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
        duration: [v, "initial", p, f]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", R, p, f]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [v, p, f]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", L, p, f]
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
        perspective: [w, p, f]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": z()
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
        transform: [p, f, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: z()
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
        zoom: [V, p, f]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", p, f]
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
        "will-change": ["auto", "scroll", "contents", "transform", p, f]
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
        stroke: [v, oe, Q, Ge]
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
}, Ar = /* @__PURE__ */ ur(Rr);
function m(...e) {
  return Ar(_t(e));
}
function Ve({
  variant: e = "secondary",
  isSelected: r = !1,
  children: n,
  className: s,
  isDisabled: o,
  ...l
}) {
  const a = P(null), { buttonProps: i } = Z({ ...l, isDisabled: o }, a);
  return /* @__PURE__ */ t(
    "button",
    {
      ...i,
      ref: a,
      className: m(
        "inline-flex items-center justify-center w-10 h-10 rounded-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          primary: "bg-primary-4 text-main border border-transparent",
          secondary: r ? "bg-transparent text-interactive border border-primary-4" : "bg-transparent text-main border border-transparent"
        }[e],
        s
      ),
      children: /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0 [&>svg]:w-full [&>svg]:h-full", children: n })
    }
  );
}
function _e({
  variant: e = "primary",
  isSelected: r = !1,
  className: n,
  isDisabled: s,
  ...o
}) {
  const l = P(null), { buttonProps: a } = Z({ ...o, isDisabled: s }, l), i = {
    primary: m(
      "text-main",
      s ? "bg-primary-2" : r ? "bg-primary-3" : "bg-primary-4 hover:bg-primary-2"
    ),
    secondary: s ? "bg-transparent text-muted" : r ? "bg-neutral-3 text-main" : "bg-transparent text-main hover:bg-neutral-2"
  };
  return /* @__PURE__ */ t(
    "button",
    {
      ...a,
      ref: l,
      className: m(
        "inline-flex items-center justify-center p-2 text-body-m font-normal rounded-sm transition-colors cursor-pointer font-sans select-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:pointer-events-none",
        i[e],
        n
      ),
      children: o.children
    }
  );
}
function Tn({ label: e, error: r, className: n, ...s }) {
  const o = P(null), { labelProps: l, inputProps: a, errorMessageProps: i } = Pe(
    { ...s, label: e, isInvalid: !!r, errorMessage: r },
    o
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
        ref: o,
        className: m(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md placeholder:text-muted transition-colors focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral",
          r && "border-danger-5 focus-visible:outline-danger-5",
          n
        )
      }
    ),
    r ? /* @__PURE__ */ t("span", { ...i, className: "text-xs text-danger font-sans", children: r }) : null
  ] });
}
function Dr({
  placeholder: e = "Search...",
  value: r,
  onChange: n,
  onSubmit: s,
  className: o
}) {
  const [l, a] = He(""), i = r !== void 0, u = i ? r : l, d = P(null), { inputProps: g } = Pe(
    {
      value: u,
      onChange: (h) => {
        i || a(h), n == null || n(h);
      },
      onKeyDown: (h) => {
        h.key === "Enter" && (s == null || s(u));
      },
      "aria-label": "Search",
      placeholder: e
    },
    d
  );
  return /* @__PURE__ */ c("div", { className: m("inline-flex items-center gap-6 min-w-0", o), children: [
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
function ae({ src: e, name: r, size: n = "md", className: s }) {
  const o = {
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
      className: m(
        // text-primary-4 kept raw, not aliased to `text-interactive` — this is a decorative
        // accent-tint/accent-text color pairing (bg-primary-1 + text-primary-4), not an
        // interactive affordance; avatars aren't inherently clickable.
        "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-1 text-primary-4 select-none shrink-0",
        o[n],
        s
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
function Or() {
  return /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: [
    /* @__PURE__ */ t("path", { d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" }),
    /* @__PURE__ */ t("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
  ] });
}
function Wr() {
  return /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M18 6 6 18M6 6l12 12" }) });
}
function Br({
  searchValue: e,
  searchPlaceholder: r,
  onSearchChange: n,
  onSearchSubmit: s,
  icon: o,
  userName: l,
  userAvatar: a,
  className: i
}) {
  const [u, d] = He(""), g = e !== void 0, h = g ? e : u, k = (C) => {
    g || d(C), n == null || n(C);
  }, y = () => {
    g || d(""), n == null || n("");
  };
  return /* @__PURE__ */ c(
    "header",
    {
      className: m(
        "flex items-center justify-between gap-6 px-6 py-3 bg-surface-panel rounded-md",
        i
      ),
      children: [
        /* @__PURE__ */ t(
          Dr,
          {
            placeholder: r,
            value: h,
            onChange: k,
            onSubmit: s,
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
              className: "w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-xs [&>svg]:w-full [&>svg]:h-full",
              children: /* @__PURE__ */ t(Wr, {})
            }
          ) : null,
          /* @__PURE__ */ t("span", { className: "w-6 h-6 text-muted shrink-0 [&>svg]:w-full [&>svg]:h-full", children: o ?? /* @__PURE__ */ t(Or, {}) }),
          l || a ? /* @__PURE__ */ t(ae, { src: a, name: l, size: "md" }) : null
        ] })
      ]
    }
  );
}
function jn({
  items: e,
  panels: r,
  defaultSelectedKey: n,
  selectedKey: s,
  onSelectionChange: o,
  className: l
}) {
  var g;
  const a = ut(() => new Map(e.map((h) => [h.id, h])), [e]), i = Tt({
    items: e,
    selectedKey: s,
    defaultSelectedKey: n ?? ((g = e[0]) == null ? void 0 : g.id),
    onSelectionChange: (h) => o == null ? void 0 : o(String(h)),
    children: (h) => /* @__PURE__ */ t(jt, { textValue: h.label, children: h.label }, h.id)
  }), u = P(null), { tabListProps: d } = mt(
    { "aria-label": "Tab navigation" },
    i,
    u
  );
  return /* @__PURE__ */ c("div", { className: m("flex flex-col", l), children: [
    /* @__PURE__ */ t("div", { ...d, ref: u, className: "flex items-end", children: [...i.collection].map((h) => {
      var k;
      return /* @__PURE__ */ t(Gr, { item: h, state: i, icon: (k = a.get(String(h.key))) == null ? void 0 : k.icon }, h.key);
    }) }),
    r ? /* @__PURE__ */ t(Er, { state: i, panels: r }) : null
  ] });
}
function Gr({ item: e, state: r, icon: n }) {
  const s = P(null), { tabProps: o, isSelected: l } = ft({ key: e.key }, r, s);
  return /* @__PURE__ */ c(
    "button",
    {
      ...o,
      ref: s,
      type: "button",
      className: m(
        // Figma "Tabs" Frame 299: padding 12px 0px 8px (asymmetric
        // vertical padding around the label) -- was symmetric py-3.5.
        // Horizontal padding (px-5) is kept: Figma's own value there
        // is 0px, but that's an artifact of a fixed-width (120px)
        // demo box, not a real horizontal-padding spec for
        // arbitrary-length labels.
        "relative flex items-center justify-center gap-2 px-5 pt-3 pb-2 text-tab-label font-normal text-center font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
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
function Er({ state: e, panels: r }) {
  const n = P(null), { tabPanelProps: s } = pt({}, e, n), o = e.selectedKey != null ? String(e.selectedKey) : "";
  return /* @__PURE__ */ t("div", { ...s, ref: n, className: "flex-1", children: r[o] ?? null });
}
function Rn({
  options: e,
  value: r,
  defaultValue: n,
  onChange: s,
  className: o
}) {
  var k;
  const [l, a] = B.useState(
    n ?? ((k = e[0]) == null ? void 0 : k.id) ?? ""
  ), i = r !== void 0, u = i ? r : l, d = P([]), g = (y) => {
    i || a(y), s == null || s(y);
  }, h = (y) => {
    var R;
    const C = e.findIndex((L) => L.id === u);
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
    const S = e[w];
    g(S.id), (R = d.current[w]) == null || R.focus();
  };
  return /* @__PURE__ */ t(
    "div",
    {
      role: "radiogroup",
      "aria-label": "View",
      className: m(
        "inline-flex items-center gap-0 p-1 bg-surface-panel rounded-10",
        o
      ),
      children: e.map((y, C) => {
        const w = u === y.id;
        return /* @__PURE__ */ c(
          "button",
          {
            ref: (S) => {
              d.current[C] = S;
            },
            type: "button",
            role: "radio",
            "aria-checked": w,
            tabIndex: w ? 0 : -1,
            onClick: () => g(y.id),
            onKeyDown: h,
            className: m(
              "inline-flex items-center justify-center gap-2 h-8 px-6 py-1 text-control-label font-normal rounded-sm transition-all cursor-pointer font-sans select-none text-main focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
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
function An({ children: e, className: r, ...n }) {
  return /* @__PURE__ */ t(
    "div",
    {
      ...n,
      className: m(
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
  children: s,
  onRemove: o,
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
      className: m(
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
        s,
        o ? /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: o,
            "aria-label": "Remove tag",
            className: "hover:opacity-75 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
            children: "×"
          }
        ) : null
      ]
    }
  );
}
function ct({ title: e, icon: r, className: n }) {
  return /* @__PURE__ */ c("div", { className: m("flex items-center gap-2 w-full", n), children: [
    /* @__PURE__ */ t("h3", { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: e }),
    r ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0 text-muted", children: r }) : null
  ] });
}
function Fr({ badges: e, className: r }) {
  return (
    // gap-4 matches Figma's "Frame 653" gap (16px, Cards01.md L614 / Cards00.md L657).
    /* @__PURE__ */ t("div", { className: m("flex flex-wrap items-center gap-4", r), children: e.map((n) => /* @__PURE__ */ c(
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
const Vr = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("circle", { cx: "12", cy: "13", r: "8" }),
  /* @__PURE__ */ t("path", { d: "M12 9v4l3 2" }),
  /* @__PURE__ */ t("path", { d: "M5 3 2 6M22 6l-3-3" })
] }), _r = {
  normal: "neutral",
  warning: "tertiary",
  overdue: "primary"
};
function Ur({
  title: e,
  points: r,
  dueDateText: n,
  dueDateUrgency: s = "normal",
  tags: o = [],
  assigneeName: l,
  assigneeAvatar: a,
  metaBadges: i = [],
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
      className: m(
        // radius-sm (8px) matches Figma's "Task Card" border-radius exactly (Cards01.md L246);
        // rounded-lg here previously resolved to this project's --radius-lg (24px), far too round.
        // No border is ever rendered on the card in the export, so the resting border is transparent
        // (kept as a real border utility, not removed, so the hover reveal below still works).
        "flex flex-col gap-4 p-4 bg-surface-panel text-main rounded-sm border border-transparent shadow-xs hover:border-subtle transition-all cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
        u
      ),
      children: [
        /* @__PURE__ */ t(ct, { title: e }),
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
            /* @__PURE__ */ t(_, { variant: _r[s], icon: /* @__PURE__ */ t(Vr, {}), children: n })
          ) : null
        ] }) : null,
        o.length > 0 ? /* @__PURE__ */ t("div", { className: "flex flex-wrap items-center gap-2", children: o.map((g, h) => /* @__PURE__ */ t(_, { variant: g.variant || "neutral", children: g.label }, h)) }) : null,
        /* @__PURE__ */ c("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ c("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ t(ae, { src: a, name: l, size: "sm" }),
            l ? /* @__PURE__ */ t("span", { className: "font-sans text-xs font-medium text-muted truncate max-w-[120px]", children: l }) : null
          ] }),
          i.length > 0 ? /* @__PURE__ */ t(Fr, { badges: i }) : null
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
      className: m("animate-pulse rounded-sm bg-neutral-3", e)
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
function Dn({ title: e, icon: r, tasks: n, isLoading: s = !1, className: o }) {
  return /* @__PURE__ */ c("div", { className: m("flex flex-col gap-4 w-full", o), children: [
    /* @__PURE__ */ t(ct, { title: e, icon: r }),
    s ? /* @__PURE__ */ c(Ke, { children: [
      /* @__PURE__ */ t(ke, {}),
      /* @__PURE__ */ t(ke, {}),
      /* @__PURE__ */ t(ke, {})
    ] }) : n.length === 0 ? /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-16 text-muted font-sans text-sm", children: "No tasks in this view." }) : n.map((l, a) => /* @__PURE__ */ t(Ur, { ...l, className: "w-full" }, a))
  ] });
}
const W = {
  name: 500,
  tags: 168,
  estimation: 140,
  assignee: 168,
  dueDate: 132
}, $r = ({ className: e }) => /* @__PURE__ */ t("svg", { className: e, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m6 9 6 6 6-6" }) }), Kr = ({ className: e }) => /* @__PURE__ */ t("svg", { className: e, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m9 18 6-6-6-6" }) }), Hr = ({ className: e }) => /* @__PURE__ */ t("svg", { className: e, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": !0, children: /* @__PURE__ */ t("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3" }) }), X = "text-body-m font-normal text-main font-sans", E = "h-14 shrink-0 bg-surface-panel border-y border-r border-neutral-3";
function Yr({ date: e, urgency: r = "normal" }) {
  return /* @__PURE__ */ t("span", { className: m(X, {
    normal: "text-main",
    warning: "text-tertiary-4",
    // text-primary-4 kept as a raw ramp class, not aliased to `text-interactive` — this is a
    // status/urgency signal, not an interactive affordance, so the "interactive" alias would
    // misrepresent its role even though it happens to share the same color value.
    overdue: "text-primary-4"
  }[r]), children: e });
}
function Xr({ name: e, avatarSrc: r }) {
  return /* @__PURE__ */ c("div", { className: "flex items-center gap-2 min-w-0", children: [
    /* @__PURE__ */ t(ae, { src: r, name: e, size: "sm" }),
    /* @__PURE__ */ t("span", { className: m(X, "truncate"), children: e })
  ] });
}
function qr({ points: e }) {
  return /* @__PURE__ */ c("span", { className: m(X, "tabular-nums"), children: [
    e,
    " ",
    e === 1 ? "Point" : "Points"
  ] });
}
function Jr({ labels: e }) {
  return /* @__PURE__ */ t("div", { className: "flex flex-wrap items-center gap-2", children: e.map((r, n) => /* @__PURE__ */ t(_, { variant: r.variant ?? "neutral", children: r.label }, n)) });
}
const Qr = {
  primary: "bg-primary-4",
  secondary: "bg-secondary-4",
  tertiary: "bg-tertiary-4"
};
function Zr({
  index: e,
  title: r,
  indicatorColor: n = "secondary",
  reactions: s = [],
  isSelected: o = !1,
  onSelectedChange: l,
  tags: a = [],
  estimationPoints: i,
  assigneeName: u,
  assigneeAvatar: d,
  dueDate: g,
  dueDateUrgency: h = "normal",
  onClick: k,
  onViewDetails: y
}) {
  return /* @__PURE__ */ c("tr", { onClick: k, className: m("group", k && "cursor-pointer"), children: [
    /* @__PURE__ */ t("td", { className: m(E, "pl-0 pr-4 border-l"), style: { width: W.name }, children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ t("span", { className: m("w-1 h-full shrink-0", Qr[n]) }),
      /* @__PURE__ */ c("label", { className: "w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer rounded-xs has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-4 has-[:focus-visible]:outline-offset-1", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            className: "sr-only",
            checked: o,
            onChange: (C) => l == null ? void 0 : l(C.target.checked),
            "aria-label": `Select ${r}`
          }
        ),
        /* @__PURE__ */ t(
          Hr,
          {
            className: m(
              "w-6 h-6 text-main transition-opacity",
              o ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
            )
          }
        )
      ] }),
      /* @__PURE__ */ t("span", { className: m(X, "shrink-0 tabular-nums"), children: String(e).padStart(2, "0") }),
      /* @__PURE__ */ t("span", { className: m(X, "flex-1 min-w-0 truncate"), children: r }),
      s.map((C) => /* @__PURE__ */ c("span", { className: m(X, "inline-flex items-center gap-1 shrink-0"), children: [
        /* @__PURE__ */ t("span", { className: "tabular-nums", children: C.count }),
        /* @__PURE__ */ t("span", { children: C.emoji })
      ] }, C.emoji)),
      y ? /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          onClick: y,
          className: m(X, "inline-flex items-center gap-1 shrink-0 hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs"),
          children: [
            /* @__PURE__ */ t("span", { children: "Details" }),
            /* @__PURE__ */ t(Kr, { className: "w-4 h-4" })
          ]
        }
      ) : null
    ] }) }),
    /* @__PURE__ */ t("td", { className: m(E, "pl-2 pr-4"), style: { width: W.tags }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: a.length > 0 ? /* @__PURE__ */ t(Jr, { labels: a }) : null }) }),
    /* @__PURE__ */ t("td", { className: m(E, "pl-2 pr-4"), style: { width: W.estimation }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: i !== void 0 ? /* @__PURE__ */ t(qr, { points: i }) : null }) }),
    /* @__PURE__ */ t("td", { className: m(E, "pl-2 pr-4"), style: { width: W.assignee }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: u ? /* @__PURE__ */ t(Xr, { name: u, avatarSrc: d }) : null }) }),
    /* @__PURE__ */ t("td", { className: m(E, "pl-2 pr-4"), style: { width: W.dueDate }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: g ? /* @__PURE__ */ t(Yr, { date: g, urgency: h }) : null }) })
  ] });
}
function en() {
  return /* @__PURE__ */ c("tr", { children: [
    /* @__PURE__ */ t("td", { className: m(E, "pl-4 pr-4 border-l"), style: { width: W.name }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(G, { className: "h-4 w-full" }) }) }),
    /* @__PURE__ */ t("td", { className: m(E, "pl-4 pr-4"), style: { width: W.tags }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(G, { className: "h-6 w-16 rounded" }) }) }),
    /* @__PURE__ */ t("td", { className: m(E, "pl-4 pr-4"), style: { width: W.estimation }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(G, { className: "h-4 w-16" }) }) }),
    /* @__PURE__ */ t("td", { className: m(E, "pl-4 pr-4"), style: { width: W.assignee }, children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ t(G, { className: "w-8 h-8 rounded-full shrink-0" }),
      /* @__PURE__ */ t(G, { className: "h-4 w-20" })
    ] }) }),
    /* @__PURE__ */ t("td", { className: m(E, "pl-4 pr-4"), style: { width: W.dueDate }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(G, { className: "h-4 w-20" }) }) })
  ] });
}
const le = [
  { key: "name", label: "# Task Name" },
  { key: "tags", label: "Task Tags" },
  { key: "estimation", label: "Estimate" },
  { key: "assignee", label: "Task Assign Name" },
  { key: "dueDate", label: "Due Date" }
];
function On({ groups: e, isLoading: r = !1, className: n }) {
  return /* @__PURE__ */ t(
    "div",
    {
      className: m(
        "w-full overflow-x-auto",
        "[scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-3 [&::-webkit-scrollbar-thumb]:rounded-full",
        n
      ),
      children: /* @__PURE__ */ c("div", { className: "flex flex-col gap-4 min-w-[1108px]", children: [
        /* @__PURE__ */ t("div", { className: "flex", children: le.map(({ key: s, label: o }, l) => /* @__PURE__ */ t(
          "div",
          {
            className: m(
              E,
              "px-4",
              l === 0 && "border-l rounded-l-4",
              l === le.length - 1 && "rounded-r-4"
            ),
            style: { width: W[s] },
            children: /* @__PURE__ */ t("span", { className: X, children: o })
          },
          s
        )) }),
        r ? /* @__PURE__ */ c("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ t("colgroup", { children: le.map(({ key: s }) => /* @__PURE__ */ t("col", { style: { width: W[s] } }, s)) }),
          /* @__PURE__ */ t("tbody", { children: Array.from({ length: 5 }).map((s, o) => /* @__PURE__ */ t(en, {}, o)) })
        ] }) : e.length === 0 ? /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-16 text-muted font-sans text-sm", children: "No tasks yet." }) : e.map((s, o) => /* @__PURE__ */ c("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ t("colgroup", { children: le.map(({ key: l }) => /* @__PURE__ */ t("col", { style: { width: W[l] } }, l)) }),
          /* @__PURE__ */ c("tbody", { children: [
            /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ t("td", { colSpan: le.length, className: "p-0 border border-neutral-3", children: /* @__PURE__ */ c("div", { className: "flex items-center gap-2 h-14 px-4 bg-surface-panel rounded-t-4", children: [
              /* @__PURE__ */ t($r, { className: "w-6 h-6 shrink-0 text-muted" }),
              /* @__PURE__ */ t("h3", { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: s.title }),
              s.actions
            ] }) }) }),
            s.rows.map((l, a) => /* @__PURE__ */ t(Zr, { ...l }, a))
          ] })
        ] }, o))
      ] })
    }
  );
}
function he({
  isOpen: e,
  onClose: r,
  triggerRef: n,
  role: s = "dialog",
  children: o,
  className: l,
  ...a
}) {
  const i = P(null), { overlayProps: u } = bt(
    {
      isOpen: e,
      onClose: r,
      isDismissable: !0,
      shouldCloseOnInteractOutside: (d) => {
        var g;
        return !((g = n == null ? void 0 : n.current) != null && g.contains(d));
      }
    },
    i
  );
  return e ? (
    // eslint-disable-next-line jsx-a11y/no-autofocus
    /* @__PURE__ */ t(Se, { restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ c(
      "div",
      {
        ...u,
        ...a,
        ref: i,
        role: s,
        className: l,
        children: [
          /* @__PURE__ */ t(pe, { onDismiss: r }),
          o,
          /* @__PURE__ */ t(pe, { onDismiss: r })
        ]
      }
    ) })
  ) : null;
}
function Ie({ state: e, children: r, popoverRef: n, className: s, ...o }) {
  const l = P(null), a = n ?? l, { popoverProps: i, underlayProps: u } = ht({ ...o, popoverRef: a }, e);
  return /* @__PURE__ */ c(gt, { children: [
    /* @__PURE__ */ t("div", { ...u, className: "fixed inset-0" }),
    /* @__PURE__ */ t(Se, { restoreFocus: !0, children: /* @__PURE__ */ c(
      "div",
      {
        ...i,
        ref: a,
        onKeyDownCapture: (d) => {
          d.key === "Escape" && (d.stopPropagation(), e.close());
        },
        className: m(
          "z-50 bg-surface-overlay rounded-sm border border-subtle shadow-xl",
          s
        ),
        children: [
          /* @__PURE__ */ t(pe, { onDismiss: () => e.close() }),
          r,
          /* @__PURE__ */ t(pe, { onDismiss: () => e.close() })
        ]
      }
    ) })
  ] });
}
function dt({
  state: e,
  listBoxRef: r,
  className: n,
  ...s
}) {
  const o = P(null), l = r ?? o, { listBoxProps: a } = xt(s, e, l);
  return /* @__PURE__ */ t(
    "ul",
    {
      ...a,
      ref: l,
      className: m("max-h-64 min-w-40 overflow-auto py-2 outline-none", n),
      children: [...e.collection].map((i) => /* @__PURE__ */ t(tn, { item: i, state: e }, i.key))
    }
  );
}
function tn({ item: e, state: r }) {
  const n = P(null), { optionProps: s, isSelected: o, isFocused: l, isDisabled: a } = vt(
    { key: e.key },
    r,
    n
  );
  return /* @__PURE__ */ c(
    "li",
    {
      ...s,
      ref: n,
      className: m(
        "flex items-center justify-between gap-4 px-4 py-1.5 text-body-m font-sans cursor-pointer outline-none",
        // Focus and selection are independent states with independent
        // styling — merging them would leave a keyboard user with no way
        // to tell which option their arrow keys are actually on.
        l && "bg-neutral-4",
        o ? "text-interactive font-semibold" : "text-main",
        a && "cursor-not-allowed opacity-50"
      ),
      children: [
        /* @__PURE__ */ t("span", { children: e.rendered }),
        o ? /* @__PURE__ */ t("span", { "aria-hidden": "true", children: "✓" }) : null
      ]
    }
  );
}
function Wn({ placeholder: e, icon: r, className: n, ...s }) {
  const o = Rt(s), l = P(null), { labelProps: a, triggerProps: i, valueProps: u, menuProps: d } = yt(s, o, l), { buttonProps: g } = Z(i, l);
  return /* @__PURE__ */ c("div", { className: m("inline-flex flex-col gap-1.5", n), children: [
    s.label ? /* @__PURE__ */ t(
      "span",
      {
        ...a,
        className: "text-field-label font-semibold text-neutral-3 uppercase font-sans",
        children: s.label
      }
    ) : null,
    /* @__PURE__ */ t(wt, { state: o, triggerRef: l, label: s.label, name: s.name }),
    /* @__PURE__ */ c(
      "button",
      {
        ...g,
        ref: l,
        type: "button",
        className: m(
          // `bg-surface-neutral` is a light (near-white) surface, matching
          // `Input`'s value/placeholder colors (`text-neutral-5`/`text-muted`)
          // rather than `text-main`/`text-muted`, which assume a dark shell
          // background and would render invisible white-on-white here once
          // something is selected.
          "inline-flex items-center gap-2 h-10 px-3 py-2 rounded-md bg-surface-neutral border border-subtle text-body-m font-sans whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          o.selectedItem ? "text-neutral-5" : "text-muted"
        ),
        children: [
          r,
          /* @__PURE__ */ t("span", { ...u, className: "flex-1 text-left truncate", children: o.selectedItem ? o.selectedItem.rendered : e }),
          /* @__PURE__ */ t(rn, {})
        ]
      }
    ),
    o.isOpen ? /* @__PURE__ */ t(Ie, { state: o, triggerRef: l, placement: "bottom start", children: /* @__PURE__ */ t(dt, { ...d, state: o }) }) : null
  ] });
}
const rn = () => /* @__PURE__ */ t(
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
function Bn({
  label: e,
  placeholder: r,
  icon: n,
  isDisabled: s,
  className: o,
  ...l
}) {
  const a = Me({}), i = P(null), u = At({
    ...l,
    selectionMode: "multiple",
    // Explicit, not the default: a plain click on an item should add it to
    // the selection, not replace it — the behavior a set of checkable tags
    // needs, unlike a file browser's click-to-replace/Ctrl-click-to-add.
    selectionBehavior: "toggle"
  }), { buttonProps: d } = Z(
    { onPress: () => a.toggle(), isDisabled: s, "aria-label": e },
    i
  ), g = [...u.collection].filter(
    (h) => u.selectionManager.isSelected(h.key)
  );
  return /* @__PURE__ */ c("div", { className: m("inline-block", o), children: [
    /* @__PURE__ */ c(
      "button",
      {
        ...d,
        ref: i,
        type: "button",
        "aria-haspopup": "listbox",
        "aria-expanded": a.isOpen,
        className: m(
          // See Select's identical note: `bg-surface-neutral` is a light
          // surface, so the placeholder/value text needs `Input`'s
          // light-surface colors (`text-muted`/`text-neutral-5`), not
          // `text-main` (invisible white-on-white once something's picked).
          "inline-flex items-center gap-2 min-h-10 px-3 py-1.5 rounded-md bg-surface-neutral border border-subtle text-body-m font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          g.length > 0 ? "text-neutral-5" : "text-muted"
        ),
        children: [
          n,
          g.length > 0 ? /* @__PURE__ */ t("span", { className: "flex flex-wrap items-center gap-1", children: g.map((h) => /* @__PURE__ */ t(_, { variant: "primary", children: h.rendered }, h.key)) }) : /* @__PURE__ */ t("span", { children: r }),
          /* @__PURE__ */ t(nn, {})
        ]
      }
    ),
    a.isOpen ? /* @__PURE__ */ t(Ie, { state: a, triggerRef: i, placement: "bottom start", children: /* @__PURE__ */ t(dt, { "aria-label": e, state: u, autoFocus: !0 }) }) : null
  ] });
}
const nn = () => /* @__PURE__ */ t(
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
function Gn({
  label: e,
  triggerContent: r,
  isDisabled: n,
  triggerClassName: s,
  ...o
}) {
  const l = Dt({}), a = P(null), { menuTriggerProps: i, menuProps: u } = kt(
    { isDisabled: n },
    l,
    a
  ), { buttonProps: d } = Z(
    { ...i, isDisabled: n, "aria-label": e },
    a
  );
  return /* @__PURE__ */ c(Ke, { children: [
    /* @__PURE__ */ t(
      "button",
      {
        ...d,
        ref: a,
        type: "button",
        className: m(
          "cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          s
        ),
        children: r
      }
    ),
    l.isOpen ? /* @__PURE__ */ t(Ie, { state: l, triggerRef: a, placement: "bottom end", children: /* @__PURE__ */ t(
      sn,
      {
        ...u,
        ...o,
        autoFocus: o.autoFocus ?? l.focusStrategy ?? !0,
        onClose: () => l.close()
      }
    ) }) : null
  ] });
}
function sn({ children: e, onAction: r, onClose: n, ...s }) {
  const o = Ot({ ...s, children: e, selectionMode: "none" }), l = P(null), { menuProps: a } = Nt({ ...s, onAction: r, onClose: n }, o, l);
  return /* @__PURE__ */ t("ul", { ...a, ref: l, className: "max-h-64 min-w-40 overflow-auto py-2 outline-none", children: [...o.collection].map((i) => /* @__PURE__ */ t(on, { item: i, state: o, onClose: n }, i.key)) });
}
function on({ item: e, state: r, onClose: n }) {
  const s = P(null), { menuItemProps: o, isFocused: l, isDisabled: a } = Ct(
    { key: e.key, onClose: n },
    r,
    s
  );
  return /* @__PURE__ */ t(
    "li",
    {
      ...o,
      ref: s,
      className: m(
        "text-body-m font-sans cursor-pointer px-4 py-1.5 outline-none text-main",
        l && "bg-neutral-4",
        a && "cursor-not-allowed opacity-50"
      ),
      children: e.rendered
    }
  );
}
function En({ title: e, isOpen: r, onClose: n, children: s, width: o = "max-w-md", role: l = "dialog" }) {
  const a = P(null), i = P(null), u = Me({
    isOpen: r,
    onOpenChange: (y) => {
      y || n();
    }
  }), { modalProps: d, underlayProps: g } = Pt(
    { isDismissable: !0 },
    u,
    a
  ), { dialogProps: h, titleProps: k } = St({ role: l }, i);
  return r ? /* @__PURE__ */ t(
    "div",
    {
      ...g,
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      children: /* @__PURE__ */ t(Se, { contain: !0, restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ t(
        "div",
        {
          ...d,
          ref: a,
          className: m("w-full", o),
          children: /* @__PURE__ */ c(
            "div",
            {
              ...h,
              ref: i,
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
                      className: "flex items-center justify-center w-8 h-8 rounded-md text-muted hover:bg-neutral-4 hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                      children: /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M18 6 6 18M6 6l12 12" }) })
                    }
                  )
                ] }),
                /* @__PURE__ */ t("div", { className: "px-4 py-4", children: s })
              ]
            }
          )
        }
      ) })
    }
  ) : null;
}
function Fn(e = !1) {
  const r = Me({ defaultOpen: e });
  return {
    isOpen: r.isOpen,
    open: r.open,
    close: r.close,
    toggle: r.toggle
  };
}
const ln = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m15 18-6-6 6-6" }) }), an = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m9 18 6-6-6-6" }) }), cn = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m18 18-6-6 6-6M12 18l-6-6 6-6" }) }), dn = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m6 18 6-6-6-6M12 18l6-6-6-6" }) });
function Ue(e) {
  return new Et(e.getFullYear(), e.getMonth() + 1, e.getDate());
}
function un(e) {
  return e.toDate(Ne());
}
function mn({
  value: e,
  defaultValue: r,
  onChange: n,
  onClose: s,
  triggerRef: o,
  className: l
}) {
  const a = e !== void 0 ? { value: Ue(e) } : { defaultValue: r ? Ue(r) : null }, i = Wt({
    ...a,
    onChange: (S) => n == null ? void 0 : n(un(S)),
    createCalendar: Gt,
    // Hardcoded, matching the prior implementation's hardcoded English
    // MONTHS/DAYS arrays — no `I18nProvider`/locale story exists in this kit
    // yet, so introducing locale-dependent formatting here would be an
    // unverified behavior change, not a fix.
    locale: "en-US",
    firstDayOfWeek: "sun",
    weeksInMonth: 6
  }), { calendarProps: u, prevButtonProps: d, nextButtonProps: g } = Mt(
    { "aria-label": "Date picker" },
    i
  ), h = P(null), k = P(null), { buttonProps: y } = Z(d, h), { buttonProps: C } = Z(g, k), w = () => {
    const S = Ft(Ne());
    i.setFocusedDate(S), i.selectDate(S);
  };
  return /* @__PURE__ */ c(
    he,
    {
      isOpen: !0,
      onClose: s,
      triggerRef: o,
      "aria-label": "Date picker",
      className: m(
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
                  onClick: () => i.focusPreviousSection(!0),
                  "aria-label": "Previous year",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ t(cn, {})
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  ...y,
                  ref: h,
                  "aria-label": "Previous month",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ t(ln, {})
                }
              )
            ] }),
            /* @__PURE__ */ t("span", { className: "font-sans font-semibold text-body-sm text-main", children: i.visibleRange.start.toDate(Ne()).toLocaleDateString("en-US", { month: "long", year: "numeric" }) }),
            /* @__PURE__ */ c("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ t(
                "button",
                {
                  ...C,
                  ref: k,
                  "aria-label": "Next month",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ t(an, {})
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: () => i.focusNextSection(!0),
                  "aria-label": "Next year",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ t(dn, {})
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ t("div", { className: "h-px w-full bg-neutral-2" }),
          /* @__PURE__ */ t(fn, { state: i })
        ] }),
        /* @__PURE__ */ t("div", { className: "h-px w-full bg-neutral-2" }),
        /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-[9px] h-10", children: /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: w,
            className: "text-body-sm font-normal font-sans text-interactive hover:opacity-80 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-xs",
            children: "Today"
          }
        ) })
      ]
    }
  );
}
function fn({ state: e }) {
  const { gridProps: r, headerProps: n, weekDays: s, weeksInMonth: o } = Lt(
    { weekdayStyle: "short" },
    e
  ), l = e.visibleRange.start;
  return /* @__PURE__ */ c("div", { ...r, className: "flex flex-col px-3 py-2", children: [
    /* @__PURE__ */ t("div", { ...n, className: "grid grid-cols-7", children: s.map((a, i) => /* @__PURE__ */ t("span", { className: "text-center text-body-sm font-normal text-main font-sans", children: a }, i)) }),
    Array.from({ length: o }, (a, i) => /* @__PURE__ */ t("div", { role: "row", className: "grid grid-cols-7", children: e.getDatesInWeek(i).map(
      (u, d) => u ? /* @__PURE__ */ t(pn, { state: e, date: u, currentMonth: l }, u.toString()) : /* @__PURE__ */ t("div", { role: "gridcell", "aria-hidden": "true" }, d)
    ) }, i))
  ] });
}
function pn({
  state: e,
  date: r,
  currentMonth: n
}) {
  const s = P(null), o = !Vt(r, n), { cellProps: l, buttonProps: a, isSelected: i, isDisabled: u, formattedDate: d } = zt(
    { date: r, isOutsideMonth: o },
    e,
    s
  );
  return /* @__PURE__ */ t("div", { ...l, className: "flex items-center justify-center my-[3px]", children: /* @__PURE__ */ t(
    "div",
    {
      ...a,
      ref: s,
      className: m(
        "flex items-center justify-center w-6 h-6 rounded-2 text-body-sm font-normal font-sans transition-colors focus-visible:outline-2 focus-visible:outline-primary-4",
        u ? "text-muted cursor-default" : i ? "border border-primary-4 text-main cursor-pointer" : "text-main hover:bg-neutral-3 cursor-pointer"
      ),
      children: d
    }
  ) });
}
const bn = [1, 2, 3, 5, 8], hn = () => /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M6 21V4a1 1 0 0 1 1-1h10.5a1 1 0 0 1 .8 1.6L15 9l3.3 4.4a1 1 0 0 1-.8 1.6H7" }) });
function gn({ value: e, onSelect: r, onClose: n, triggerRef: s, className: o }) {
  return /* @__PURE__ */ c(
    he,
    {
      isOpen: !0,
      onClose: n,
      triggerRef: s,
      "aria-label": "Estimate",
      className: m(
        "flex flex-col w-[122px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        o
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans whitespace-nowrap", children: "Estimate" }) }),
        bn.map((l) => /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: () => r(l),
            "aria-pressed": e === l,
            className: m(
              "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
              e === l ? "bg-neutral-2" : "hover:bg-neutral-2"
            ),
            children: [
              /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ t(hn, {}) }),
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
function xn({
  name: e,
  role: r,
  avatarSrc: n,
  size: s = "md",
  isOnline: o = !1,
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
      className: m(
        // padding: 4px 16px, gap: 8px -- matches Figma "User" component (Avatar frame, 239x56)
        "flex items-center gap-2 px-4 py-1 min-w-0",
        a && "cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-sm",
        l
      ),
      children: [
        /* @__PURE__ */ c("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ t(ae, { src: n, name: e, size: s }),
          o ? /* @__PURE__ */ t("span", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary-4 border-2 border-neutral-5" }) : null
        ] }),
        /* @__PURE__ */ c("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ t("span", { className: "font-sans font-normal text-body-m text-main truncate", children: e }),
          r ? /* @__PURE__ */ t(
            "span",
            {
              className: m(
                "font-sans text-muted truncate leading-tight",
                i[s]
              ),
              children: r
            }
          ) : null
        ] })
      ]
    }
  );
}
function vn({ assignees: e, onSelect: r, onClose: n, triggerRef: s, className: o }) {
  return /* @__PURE__ */ c(
    he,
    {
      isOpen: !0,
      onClose: n,
      triggerRef: s,
      "aria-label": "Assignee",
      className: m(
        "flex flex-col w-[239px] pt-2 bg-surface-overlay border border-subtle rounded-sm",
        o
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans truncate", children: "Assignee" }) }),
        e.map((l) => /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: () => r(l),
            className: "flex items-center w-full h-14 hover:bg-neutral-2/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
            children: /* @__PURE__ */ t(xn, { name: l.name, role: l.role, avatarSrc: l.avatarSrc, size: "sm" })
          },
          l.id
        ))
      ]
    }
  );
}
function yn({ labels: e, onSelect: r, onClose: n, triggerRef: s, className: o }) {
  return /* @__PURE__ */ c(
    he,
    {
      isOpen: !0,
      onClose: n,
      triggerRef: s,
      "aria-label": "Label",
      className: m(
        "flex flex-col w-[160px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        o
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans truncate", children: "Label" }) }),
        e.map((l) => /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: () => r(l),
            className: "flex items-center w-full px-4 py-1.5 hover:bg-neutral-2/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
            children: /* @__PURE__ */ t(_, { variant: l.variant ?? "neutral", children: l.text })
          },
          l.id
        ))
      ]
    }
  );
}
const $e = () => /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M6 21V4a1 1 0 0 1 1-1h10.5a1 1 0 0 1 .8 1.6L15 9l3.3 4.4a1 1 0 0 1-.8 1.6H7" }) }), wn = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("circle", { cx: "12", cy: "8", r: "4" }),
  /* @__PURE__ */ t("path", { d: "M4 20c0-4 3.5-6 8-6s8 2 8 6" })
] }), kn = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
  /* @__PURE__ */ t("path", { d: "M3 10h18M8 3v4M16 3v4" })
] }), Nn = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("path", { d: "M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7.17-7.17a2 2 0 0 0 0-2.82z" }),
  /* @__PURE__ */ t("circle", { cx: "7.5", cy: "7.5", r: "1.5", fill: "currentColor", stroke: "none" })
] });
function Vn({
  isOpen: e,
  onClose: r,
  assignees: n = [],
  labels: s = [],
  onSubmit: o,
  initialTitle: l = "",
  initialDueDate: a,
  initialPoints: i,
  initialAssignee: u,
  initialLabel: d,
  className: g
}) {
  const [h, k] = B.useState(l), [y, C] = B.useState(a), [w, S] = B.useState(i), [R, L] = B.useState(u), [F, U] = B.useState(d), [z, O] = B.useState(null), T = (N) => O(($) => $ === N ? null : N), b = () => O(null), j = B.useRef(null), te = B.useRef(null), re = B.useRef(null), J = B.useRef(null);
  if (!e) return null;
  const ne = () => {
    k(""), C(void 0), S(void 0), L(void 0), U(void 0), O(null);
  }, se = (N) => {
    N.preventDefault(), h.trim() && (o == null || o({ title: h.trim(), dueDate: y, points: w, assignee: R, label: F }), ne(), r());
  }, H = () => {
    ne(), r();
  };
  return /* @__PURE__ */ c(
    "form",
    {
      onSubmit: se,
      className: m(
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
                ref: j,
                type: "button",
                onClick: () => T("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "estimate",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(_, { icon: /* @__PURE__ */ t($e, {}), children: "Estimate" })
              }
            ) : /* @__PURE__ */ c(
              "button",
              {
                ref: j,
                type: "button",
                onClick: () => T("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "estimate",
                className: "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ t($e, {}) }),
                  w,
                  " Point",
                  w !== 1 ? "s" : ""
                ]
              }
            ),
            z === "estimate" ? /* @__PURE__ */ t(
              gn,
              {
                value: w,
                onSelect: (N) => {
                  S(N), O(null);
                },
                onClose: b,
                triggerRef: j,
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] }),
          /* @__PURE__ */ c("div", { className: "relative", children: [
            R ? /* @__PURE__ */ c(
              "button",
              {
                ref: te,
                type: "button",
                onClick: () => T("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "assignee",
                className: "flex items-center gap-2 h-8 px-2 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ t(ae, { src: R.avatarSrc, name: R.name, size: "sm" }),
                  R.name
                ]
              }
            ) : /* @__PURE__ */ t(
              "button",
              {
                ref: te,
                type: "button",
                onClick: () => T("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "assignee",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(_, { icon: /* @__PURE__ */ t(wn, {}), children: "Assignee" })
              }
            ),
            z === "assignee" ? /* @__PURE__ */ t(
              vn,
              {
                assignees: n,
                onSelect: (N) => {
                  L(N), O(null);
                },
                onClose: b,
                triggerRef: te,
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] }),
          /* @__PURE__ */ c("div", { className: "relative", children: [
            F ? /* @__PURE__ */ t(
              "button",
              {
                ref: re,
                type: "button",
                onClick: () => T("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "label",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(_, { variant: F.variant ?? "neutral", children: F.text })
              }
            ) : /* @__PURE__ */ t(
              "button",
              {
                ref: re,
                type: "button",
                onClick: () => T("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "label",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(_, { icon: /* @__PURE__ */ t(Nn, {}), children: "Label" })
              }
            ),
            z === "label" ? /* @__PURE__ */ t(
              yn,
              {
                labels: s,
                onSelect: (N) => {
                  U(N), O(null);
                },
                onClose: b,
                triggerRef: re,
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
                onClick: () => T("date"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "date",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(_, { icon: /* @__PURE__ */ t(kn, {}), children: y ? y.toLocaleDateString("en-US") : "Due date" })
              }
            ),
            z === "date" ? /* @__PURE__ */ t(
              mn,
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
          /* @__PURE__ */ t(_e, { variant: "secondary", onPress: H, children: "Cancel" }),
          /* @__PURE__ */ t(_e, { variant: "primary", type: "submit", isDisabled: !h.trim(), children: "Create Task" })
        ] })
      ]
    }
  );
}
function _n({ variant: e = "neutral", children: r, className: n }) {
  return /* @__PURE__ */ t(
    "span",
    {
      className: m(
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
function Un({
  children: e,
  isSelected: r,
  defaultSelected: n = !1,
  onChange: s,
  isDisabled: o = !1,
  isIndeterminate: l = !1,
  className: a
}) {
  const i = Bt({
    isSelected: r,
    defaultSelected: n,
    onChange: s
  }), u = P(null), { inputProps: d, labelProps: g } = It(
    {
      isSelected: i.isSelected,
      isIndeterminate: l,
      isDisabled: o,
      "aria-label": typeof e == "string" ? e : "Checkbox"
    },
    i,
    u
  );
  return /* @__PURE__ */ c(
    "label",
    {
      ...g,
      className: m(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Label Checkbox" component exactly
        // (Property 1=Default/Selected, Tags01.md / Add Task Modal04/05.md).
        "inline-flex items-center gap-2 px-4 py-1 rounded cursor-pointer select-none group has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-4 has-[:focus-visible]:outline-offset-2",
        o && "opacity-50 cursor-not-allowed",
        a
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
              i.isSelected && !l ? /* @__PURE__ */ t("path", { d: "M8 12.5 11 15.5 16 9.5", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }) : l ? /* @__PURE__ */ t("path", { d: "M8 12h8", strokeWidth: 2, strokeLinecap: "round" }) : null
            ]
          }
        ),
        /* @__PURE__ */ t("span", { className: "text-body-m font-normal font-sans text-main", children: e })
      ]
    }
  );
}
function $n({ label: e, error: r, className: n, ...s }) {
  const o = P(null), { labelProps: l, inputProps: a, errorMessageProps: i } = Pe(
    { ...s, label: e, type: "date", isInvalid: !!r, errorMessage: r },
    o
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
        ref: o,
        type: "date",
        className: m(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral font-sans cursor-pointer",
          r && "border-danger-5 focus-visible:outline-danger-5",
          n
        )
      }
    ),
    r ? /* @__PURE__ */ t("span", { ...i, className: "text-xs text-danger font-sans", children: r }) : null
  ] });
}
function Cn({
  icon: e,
  label: r,
  isActive: n = !1,
  badgeCount: s,
  onClick: o,
  className: l
}) {
  return /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      onClick: o,
      "aria-current": n ? "page" : void 0,
      className: m(
        "relative w-full h-14 flex items-center gap-4 pl-4 font-sans text-body-m font-semibold transition-colors cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
        n ? "text-interactive bg-gradient-to-r from-transparent to-primary-4/10" : "text-muted hover:text-interactive",
        l
      ),
      children: [
        e ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0", children: e }) : null,
        /* @__PURE__ */ t("span", { className: "flex-1 truncate", children: r }),
        s !== void 0 ? /* @__PURE__ */ t(
          "span",
          {
            className: m(
              "px-2 py-0.5 text-xs font-bold rounded-full shrink-0",
              n ? "bg-primary-4 text-main" : "bg-neutral-3 text-main"
            ),
            children: s
          }
        ) : null,
        /* @__PURE__ */ t(
          "span",
          {
            className: m(
              "w-1 h-full shrink-0 bg-primary-4 transition-opacity",
              n ? "opacity-100" : "opacity-0"
            )
          }
        )
      ]
    }
  );
}
function Pn({ logo: e, items: r, className: n }) {
  return /* @__PURE__ */ c(
    "nav",
    {
      "aria-label": "Main navigation",
      className: m(
        // 232px / rounded-lg (24px) matches the real "Sidebar" layer (ApplicationSidebar01.md + Dashboard Mockup.md).
        "flex flex-col w-[232px] h-full bg-surface-panel rounded-lg select-none shrink-0",
        n
      ),
      children: [
        e ? /* @__PURE__ */ t("div", { className: "flex justify-center pt-3 h-24 shrink-0", children: e }) : null,
        /* @__PURE__ */ t("div", { className: "flex flex-col gap-2 flex-1 overflow-y-auto", children: r.map((s, o) => /* @__PURE__ */ t(Cn, { ...s }, o)) })
      ]
    }
  );
}
function Kn({
  value: e,
  onChange: r,
  leftIcon: n,
  rightIcon: s,
  leftLabel: o,
  rightLabel: l,
  className: a
}) {
  return /* @__PURE__ */ c("div", { className: m("flex items-center w-20 h-10 bg-surface-shell rounded-sm", a), children: [
    /* @__PURE__ */ t(
      Ve,
      {
        variant: "secondary",
        isSelected: e === "left",
        "aria-label": o,
        onPress: () => r == null ? void 0 : r("left"),
        children: n
      }
    ),
    /* @__PURE__ */ t(
      Ve,
      {
        variant: "secondary",
        isSelected: e === "right",
        "aria-label": l,
        onPress: () => r == null ? void 0 : r("right"),
        children: s
      }
    )
  ] });
}
function Hn({ logo: e, sidebarItems: r, topNavProps: n, topBar: s, children: o, className: l }) {
  return /* @__PURE__ */ c("div", { className: m("flex items-start gap-8 w-full min-h-screen bg-surface-shell p-8", l), children: [
    /* @__PURE__ */ t(Pn, { logo: e, items: r, className: "self-stretch" }),
    /* @__PURE__ */ c("div", { className: "flex flex-col gap-8 flex-1 min-w-0", children: [
      /* @__PURE__ */ t(Br, { ...n }),
      /* @__PURE__ */ c("div", { className: "flex flex-col gap-4", children: [
        s ? /* @__PURE__ */ t("div", { className: "flex items-start justify-between gap-6", children: s }) : null,
        o
      ] })
    ] })
  ] });
}
export {
  Vn as AddTaskModal,
  Hn as AppShell,
  Pn as ApplicationSidebar,
  vn as AssigneeModal,
  Xr as AssigneeNameCell,
  ae as Avatar,
  _n as Badge,
  Ve as Button,
  An as Card,
  mn as DatePickerMenu,
  $n as Datepicker,
  Yr as DueDateCell,
  gn as EstimateModal,
  qr as EstimationCell,
  Ie as FloatingPopover,
  Tn as Input,
  Un as LabelCheckbox,
  yn as LabelModal,
  dt as ListBox,
  Gn as Menu,
  En as Modal,
  Bn as MultiSelect,
  he as Popover,
  ct as ProjectInfo,
  Dr as SearchBar,
  Rn as SegmentedControl,
  Wn as Select,
  Cn as SidebarItem,
  G as Skeleton,
  jn as Tabs,
  _ as Tag,
  Jr as TagCell,
  Ur as TaskCard,
  Dn as TaskListView,
  Fr as TaskMetaBadges,
  On as TaskTable,
  Zr as TaskTableRow,
  _e as TextButton,
  Br as TopNav,
  xn as UserRow,
  Kn as ViewSwitcher,
  m as cn,
  Fn as useModalState
};
