import { jsx as t, jsxs as d, Fragment as Ke } from "react/jsx-runtime";
import O, { useRef as M, useState as Ye, useMemo as bt } from "react";
import { useButton as ee, useTextField as Le, useTabList as ht, useTab as gt, useTabPanel as xt, useOverlay as vt, FocusScope as Pe, DismissButton as be, usePopover as yt, Overlay as wt, useListBox as kt, useOption as Ct, useSelect as Nt, HiddenSelect as Mt, useMenuTrigger as Vt, useMenu as Lt, useMenuItem as Pt, useModalOverlay as St, useDialog as zt, useCalendar as Ht, useCalendarGrid as It, useCalendarCell as Tt, useCheckbox as Rt } from "react-aria";
import { useTabListState as At, Item as jt, useSelectState as Dt, useOverlayTriggerState as Se, useListState as Bt, useMenuTriggerState as Ot, useTreeState as Zt, useCalendarState as Gt, useToggleState as Wt } from "react-stately";
import { createCalendar as Et, getLocalTimeZone as Ne, CalendarDate as Ft, today as _t, isSameMonth as Ut } from "@internationalized/date";
function Xe(e) {
  var r, n, s = "";
  if (typeof e == "string" || typeof e == "number") s += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (r = 0; r < o; r++) e[r] && (n = Xe(e[r])) && (s && (s += " "), s += n);
  } else for (n in e) e[n] && (s && (s += " "), s += n);
  return s;
}
function $t() {
  for (var e, r, n = 0, s = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (r = Xe(e)) && (s && (s += " "), s += r);
  return s;
}
const Kt = (e, r) => {
  const n = new Array(e.length + r.length);
  for (let s = 0; s < e.length; s++)
    n[s] = e[s];
  for (let s = 0; s < r.length; s++)
    n[e.length + s] = r[s];
  return n;
}, Yt = (e, r) => ({
  classGroupId: e,
  validator: r
}), qe = (e = /* @__PURE__ */ new Map(), r = null, n) => ({
  nextPart: e,
  validators: r,
  classGroupId: n
}), he = "-", Oe = [], Xt = "arbitrary..", qt = (e) => {
  const r = Qt(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: s
  } = e;
  return {
    getClassGroupId: (a) => {
      if (a.startsWith("[") && a.endsWith("]"))
        return Jt(a);
      const i = a.split(he), u = i[0] === "" && i.length > 1 ? 1 : 0;
      return Je(i, u, r);
    },
    getConflictingClassGroupIds: (a, i) => {
      if (i) {
        const u = s[a], c = n[a];
        return u ? c ? Kt(c, u) : u : c || Oe;
      }
      return n[a] || Oe;
    }
  };
}, Je = (e, r, n) => {
  if (e.length - r === 0)
    return n.classGroupId;
  const o = e[r], l = n.nextPart.get(o);
  if (l) {
    const c = Je(e, r + 1, l);
    if (c) return c;
  }
  const a = n.validators;
  if (a === null)
    return;
  const i = r === 0 ? e.join(he) : e.slice(r).join(he), u = a.length;
  for (let c = 0; c < u; c++) {
    const g = a[c];
    if (g.validator(i))
      return g.classGroupId;
  }
}, Jt = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const r = e.slice(1, -1), n = r.indexOf(":"), s = r.slice(0, n);
  return s ? Xt + s : void 0;
})(), Qt = (e) => {
  const {
    theme: r,
    classGroups: n
  } = e;
  return er(n, r);
}, er = (e, r) => {
  const n = qe();
  for (const s in e) {
    const o = e[s];
    ze(o, n, s, r);
  }
  return n;
}, ze = (e, r, n, s) => {
  const o = e.length;
  for (let l = 0; l < o; l++) {
    const a = e[l];
    tr(a, r, n, s);
  }
}, tr = (e, r, n, s) => {
  if (typeof e == "string") {
    rr(e, r, n);
    return;
  }
  if (typeof e == "function") {
    nr(e, r, n, s);
    return;
  }
  sr(e, r, n, s);
}, rr = (e, r, n) => {
  const s = e === "" ? r : Qe(r, e);
  s.classGroupId = n;
}, nr = (e, r, n, s) => {
  if (or(e)) {
    ze(e(s), r, n, s);
    return;
  }
  r.validators === null && (r.validators = []), r.validators.push(Yt(n, e));
}, sr = (e, r, n, s) => {
  const o = Object.entries(e), l = o.length;
  for (let a = 0; a < l; a++) {
    const [i, u] = o[a];
    ze(u, Qe(r, i), n, s);
  }
}, Qe = (e, r) => {
  let n = e;
  const s = r.split(he), o = s.length;
  for (let l = 0; l < o; l++) {
    const a = s[l];
    let i = n.nextPart.get(a);
    i || (i = qe(), n.nextPart.set(a, i)), n = i;
  }
  return n;
}, or = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, lr = (e) => {
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
}, Me = "!", Ze = ":", ar = [], Ge = (e, r, n, s, o) => ({
  modifiers: e,
  hasImportantModifier: r,
  baseClassName: n,
  maybePostfixModifierPosition: s,
  isExternal: o
}), ir = (e) => {
  const {
    prefix: r,
    experimentalParseClassName: n
  } = e;
  let s = (o) => {
    const l = [];
    let a = 0, i = 0, u = 0, c;
    const g = o.length;
    for (let w = 0; w < g; w++) {
      const V = o[w];
      if (a === 0 && i === 0) {
        if (V === Ze) {
          l.push(o.slice(u, w)), u = w + 1;
          continue;
        }
        if (V === "/") {
          c = w;
          continue;
        }
      }
      V === "[" ? a++ : V === "]" ? a-- : V === "(" ? i++ : V === ")" && i--;
    }
    const h = l.length === 0 ? o : o.slice(u);
    let k = h, y = !1;
    h.endsWith(Me) ? (k = h.slice(0, -1), y = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      h.startsWith(Me) && (k = h.slice(1), y = !0)
    );
    const N = c && c > u ? c - u : void 0;
    return Ge(l, y, k, N);
  };
  if (r) {
    const o = r + Ze, l = s;
    s = (a) => a.startsWith(o) ? l(a.slice(o.length)) : Ge(ar, !1, a, void 0, !0);
  }
  if (n) {
    const o = s;
    s = (l) => n({
      className: l,
      parseClassName: o
    });
  }
  return s;
}, cr = (e) => {
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
}, dr = (e) => ({
  cache: lr(e.cacheSize),
  parseClassName: ir(e),
  sortModifiers: cr(e),
  postfixLookupClassGroupIds: ur(e),
  ...qt(e)
}), ur = (e) => {
  const r = /* @__PURE__ */ Object.create(null), n = e.postfixLookupClassGroups;
  if (n)
    for (let s = 0; s < n.length; s++)
      r[n[s]] = !0;
  return r;
}, mr = /\s+/, fr = (e, r) => {
  const {
    parseClassName: n,
    getClassGroupId: s,
    getConflictingClassGroupIds: o,
    sortModifiers: l,
    postfixLookupClassGroupIds: a
  } = r, i = [], u = e.trim().split(mr);
  let c = "";
  for (let g = u.length - 1; g >= 0; g -= 1) {
    const h = u[g], {
      isExternal: k,
      modifiers: y,
      hasImportantModifier: N,
      baseClassName: w,
      maybePostfixModifierPosition: V
    } = n(h);
    if (k) {
      c = h + (c.length > 0 ? " " + c : c);
      continue;
    }
    let R = !!V, S;
    if (R) {
      const I = w.substring(0, V);
      S = s(I);
      const b = S && a[S] ? s(w) : void 0;
      b && b !== S && (S = b, R = !1);
    } else
      S = s(w);
    if (!S) {
      if (!R) {
        c = h + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (S = s(w), !S) {
        c = h + (c.length > 0 ? " " + c : c);
        continue;
      }
      R = !1;
    }
    const W = y.length === 0 ? "" : y.length === 1 ? y[0] : l(y).join(":"), _ = N ? W + Me : W, z = _ + S;
    if (i.indexOf(z) > -1)
      continue;
    i.push(z);
    const D = o(S, R);
    for (let I = 0; I < D.length; ++I) {
      const b = D[I];
      i.push(_ + b);
    }
    c = h + (c.length > 0 ? " " + c : c);
  }
  return c;
}, pr = (...e) => {
  let r = 0, n, s, o = "";
  for (; r < e.length; )
    (n = e[r++]) && (s = et(n)) && (o && (o += " "), o += s);
  return o;
}, et = (e) => {
  if (typeof e == "string")
    return e;
  let r, n = "";
  for (let s = 0; s < e.length; s++)
    e[s] && (r = et(e[s])) && (n && (n += " "), n += r);
  return n;
}, br = (e, ...r) => {
  let n, s, o, l;
  const a = (u) => {
    const c = r.reduce((g, h) => h(g), e());
    return n = dr(c), s = n.cache.get, o = n.cache.set, l = i, i(u);
  }, i = (u) => {
    const c = s(u);
    if (c)
      return c;
    const g = fr(u, n);
    return o(u, g), g;
  };
  return l = a, (...u) => l(pr(...u));
}, hr = [], P = (e) => {
  const r = (n) => n[e] || hr;
  return r.isThemeGetter = !0, r;
}, tt = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, rt = /^\((?:(\w[\w-]*):)?(.+)\)$/i, gr = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, xr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, vr = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, yr = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, wr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, kr = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Y = (e) => gr.test(e), v = (e) => !!e && !Number.isNaN(Number(e)), E = (e) => !!e && Number.isInteger(Number(e)), ke = (e) => e.endsWith("%") && v(e.slice(0, -1)), $ = (e) => xr.test(e), nt = () => !0, Cr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  vr.test(e) && !yr.test(e)
), He = () => !1, Nr = (e) => wr.test(e), Mr = (e) => kr.test(e), Vr = (e) => !f(e) && !p(e), Lr = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Pr = (e) => q(e, lt, He), f = (e) => tt.test(e), Q = (e) => q(e, at, Cr), We = (e) => q(e, jr, v), Sr = (e) => q(e, ct, nt), zr = (e) => q(e, it, He), Ee = (e) => q(e, st, He), Hr = (e) => q(e, ot, Mr), fe = (e) => q(e, dt, Nr), p = (e) => rt.test(e), le = (e) => te(e, at), Ir = (e) => te(e, it), Fe = (e) => te(e, st), Tr = (e) => te(e, lt), Rr = (e) => te(e, ot), pe = (e) => te(e, dt, !0), Ar = (e) => te(e, ct, !0), q = (e, r, n) => {
  const s = tt.exec(e);
  return s ? s[1] ? r(s[1]) : n(s[2]) : !1;
}, te = (e, r, n = !1) => {
  const s = rt.exec(e);
  return s ? s[1] ? r(s[1]) : n : !1;
}, st = (e) => e === "position" || e === "percentage", ot = (e) => e === "image" || e === "url", lt = (e) => e === "length" || e === "size" || e === "bg-size", at = (e) => e === "length", jr = (e) => e === "number", it = (e) => e === "family-name", ct = (e) => e === "number" || e === "weight", dt = (e) => e === "shadow", Dr = () => {
  const e = P("color"), r = P("font"), n = P("text"), s = P("font-weight"), o = P("tracking"), l = P("leading"), a = P("breakpoint"), i = P("container"), u = P("spacing"), c = P("radius"), g = P("shadow"), h = P("inset-shadow"), k = P("text-shadow"), y = P("drop-shadow"), N = P("blur"), w = P("perspective"), V = P("aspect"), R = P("ease"), S = P("animate"), W = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], _ = () => [
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
  ], z = () => [..._(), p, f], D = () => ["auto", "hidden", "clip", "visible", "scroll"], I = () => ["auto", "contain", "none"], b = () => [p, f, u], T = () => [Y, "full", "auto", ...b()], re = () => [E, "none", "subgrid", p, f], ne = () => ["auto", {
    span: ["full", E, p, f]
  }, E, p, f], J = () => [E, "auto", p, f], se = () => ["auto", "min", "max", "fr", p, f], oe = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], K = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], C = () => ["auto", ...b()], U = () => [Y, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...b()], xe = () => [Y, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...b()], ve = () => [Y, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...b()], x = () => [e, p, f], Re = () => [..._(), Fe, Ee, {
    position: [p, f]
  }], Ae = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], je = () => ["auto", "cover", "contain", Tr, Pr, {
    size: [p, f]
  }], ye = () => [ke, le, Q], A = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    c,
    p,
    f
  ], j = () => ["", v, le, Q], ce = () => ["solid", "dashed", "dotted", "double"], De = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], H = () => [v, ke, Fe, Ee], Be = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    N,
    p,
    f
  ], de = () => ["none", v, p, f], ue = () => ["none", v, p, f], we = () => [v, p, f], me = () => [Y, "full", ...b()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [$],
      breakpoint: [$],
      color: [nt],
      container: [$],
      "drop-shadow": [$],
      ease: ["in", "out", "in-out"],
      font: [Vr],
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
        aspect: ["auto", "square", Y, f, p, V]
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
      "container-named": [Lr],
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
        "break-after": W()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": W()
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
        overflow: D()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": D()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": D()
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
        z: [E, "auto", p, f]
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
        order: [E, "first", "last", "none", p, f]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": re()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ne()
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
        "grid-rows": re()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ne()
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
        "auto-cols": se()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": se()
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
        "justify-items": [...K(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...K()]
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
        items: [...K(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...K(), {
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
        "place-items": [...K(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...K()]
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
        m: C()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: C()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: C()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: C()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: C()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: C()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: C()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: C()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: C()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: C()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: C()
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
        size: U()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...xe()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...xe()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...xe()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...ve()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...ve()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...ve()]
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
        text: ["base", n, le, Q]
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
        font: [s, Ar, Sr]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", ke, f]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Ir, zr, r]
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
        "line-clamp": [v, "none", p, We]
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
        decoration: [...ce(), "wavy"]
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
        tab: [E, p, f]
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
        bg: Re()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: Ae()
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
          }, E, p, f],
          radial: ["", p, f],
          conic: [E, p, f]
        }, Rr, Hr]
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
        from: ye()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: ye()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: ye()
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
        border: j()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": j()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": j()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": j()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": j()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": j()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": j()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": j()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": j()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": j()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": j()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": j()
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
        "divide-y": j()
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
        border: [...ce(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...ce(), "hidden", "none"]
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
        outline: [...ce(), "none", "hidden"]
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
        outline: ["", v, le, Q]
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
          pe,
          fe
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
        "inset-shadow": ["none", h, pe, fe]
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
        ring: j()
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
        "inset-ring": j()
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
        "text-shadow": ["none", k, pe, fe]
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
        "mix-blend": [...De(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": De()
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
        "mask-linear-from": H()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": H()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": x()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": x()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": H()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": H()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": x()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": x()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": H()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": H()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": x()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": x()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": H()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": H()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": x()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": x()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": H()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": H()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": x()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": x()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": H()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": H()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": x()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": x()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": H()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": H()
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
        "mask-radial-from": H()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": H()
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
        "mask-radial-at": _()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [v]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": H()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": H()
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
        mask: Re()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: Ae()
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
        blur: Be()
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
          pe,
          fe
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
        "backdrop-blur": Be()
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
        animate: ["none", S, p, f]
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
        rotate: de()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": de()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": de()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": de()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: ue()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": ue()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": ue()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": ue()
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
        skew: we()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": we()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": we()
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
        translate: me()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": me()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": me()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": me()
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
        zoom: [E, p, f]
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
        stroke: [v, le, Q, We]
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
}, Br = /* @__PURE__ */ br(Dr);
function m(...e) {
  return Br($t(e));
}
function L({ children: e, ...r }) {
  const n = r["aria-label"] != null || r["aria-labelledby"] != null;
  return /* @__PURE__ */ t(
    "svg",
    {
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...n ? { role: "img" } : { "aria-hidden": !0 },
      ...r,
      children: e
    }
  );
}
function Sn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 18 4", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM16 0C14.9 0 14 0.9 14 2C14 3.1 14.9 4 16 4C17.1 4 18 3.1 18 2C18 0.9 17.1 0 16 0ZM9 0C7.9 0 7 0.9 7 2C7 3.1 7.9 4 9 4C10.1 4 11 3.1 11 2C11 0.9 10.1 0 9 0Z",
      fill: "currentColor"
    }
  ) });
}
function Or(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 20.506 19.253", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M10.253 19.253C9.0711 19.253 7.90078 19.0202 6.80885 18.5679C5.71692 18.1156 4.72477 17.4527 3.88904 16.617C3.05331 15.7812 2.39038 14.7891 1.93808 13.6972C1.48579 12.6052 1.253 11.4349 1.253 10.253C1.253 9.0711 1.48579 7.90078 1.93808 6.80885C2.39038 5.71692 3.05331 4.72477 3.88904 3.88904C4.72477 3.05331 5.71692 2.39038 6.80885 1.93808C7.90078 1.48579 9.0711 1.253 10.253 1.253C12.6399 1.253 14.9291 2.20121 16.617 3.88904C18.3048 5.57687 19.253 7.86605 19.253 10.253C19.253 12.6399 18.3048 14.9291 16.617 16.617C14.9291 18.3048 12.6399 19.253 10.253 19.253V19.253ZM10.253 17.253C11.1723 17.253 12.0825 17.0719 12.9318 16.7202C13.7811 16.3684 14.5527 15.8528 15.2027 15.2027C15.8528 14.5527 16.3684 13.7811 16.7202 12.9318C17.0719 12.0825 17.253 11.1723 17.253 10.253C17.253 9.33375 17.0719 8.42349 16.7202 7.57422C16.3684 6.72494 15.8528 5.95326 15.2027 5.30325C14.5527 4.65324 13.7811 4.13763 12.9318 3.78584C12.0825 3.43406 11.1723 3.253 10.253 3.253C8.39648 3.253 6.61601 3.9905 5.30325 5.30325C3.9905 6.61601 3.253 8.39648 3.253 10.253C3.253 12.1095 3.9905 13.89 5.30325 15.2027C6.61601 16.5155 8.39648 17.253 10.253 17.253V17.253ZM11.253 10.253H14.253V12.253H9.253V5.253H11.253V10.253ZM0 3.535L3.535 0L4.95 1.414L1.413 4.95L0 3.535ZM16.97 0L20.506 3.535L19.092 4.95L15.556 1.414L16.971 0H16.97Z",
      fill: "currentColor"
    }
  ) });
}
function zn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 11.7382 12.6733", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M7.96691 3.76371L4.19624 7.53504C4.13256 7.59654 4.08178 7.6701 4.04684 7.75144C4.0119 7.83277 3.99351 7.92025 3.99274 8.00877C3.99197 8.09729 4.00884 8.18508 4.04236 8.26701C4.07588 8.34894 4.12538 8.42337 4.18798 8.48597C4.25057 8.54856 4.325 8.59807 4.40694 8.63159C4.48887 8.66511 4.57665 8.68198 4.66517 8.68121C4.75369 8.68044 4.84117 8.66205 4.92251 8.62711C5.00384 8.59217 5.07741 8.54138 5.13891 8.47771L8.91024 4.70704C9.28534 4.33194 9.49607 3.82318 9.49607 3.29271C9.49607 2.76223 9.28534 2.25348 8.91024 1.87837C8.53513 1.50327 8.02638 1.29254 7.49591 1.29254C6.96543 1.29254 6.45668 1.50327 6.08157 1.87837L2.31024 5.64971C1.99429 5.95779 1.74266 6.32555 1.56994 6.73164C1.39723 7.13773 1.30687 7.57407 1.3041 8.01536C1.30134 8.45664 1.38622 8.89409 1.55384 9.30231C1.72145 9.71054 1.96845 10.0814 2.28052 10.3934C2.59258 10.7055 2.96349 10.9524 3.37174 11.12C3.77999 11.2875 4.21744 11.3723 4.65873 11.3695C5.10001 11.3667 5.53634 11.2763 5.94241 11.1035C6.34848 10.9307 6.7162 10.679 7.02424 10.363L10.7956 6.59237L11.7382 7.53504L7.96691 11.3064C7.53354 11.7397 7.01907 12.0835 6.45285 12.318C5.88664 12.5526 5.27977 12.6733 4.66691 12.6733C4.05404 12.6733 3.44717 12.5526 2.88096 12.318C2.31474 12.0835 1.80027 11.7397 1.3669 11.3064C0.933543 10.873 0.589781 10.3585 0.355247 9.79232C0.120713 9.22611 -4.56621e-09 8.61924 0 8.00637C4.56621e-09 7.39351 0.120713 6.78664 0.355247 6.22043C0.589781 5.65421 0.933543 5.13973 1.3669 4.70637L5.13891 0.935706C5.76758 0.328513 6.60959 -0.00746872 7.48358 0.000126009C8.35757 0.00772074 9.19361 0.358284 9.81163 0.976311C10.4297 1.59434 10.7802 2.43038 10.7878 3.30437C10.7954 4.17836 10.4594 5.02037 9.85224 5.64904L6.08157 9.42171C5.8958 9.60744 5.67525 9.75476 5.43254 9.85526C5.18983 9.95576 4.9297 10.0075 4.667 10.0074C4.40431 10.0074 4.14419 9.95564 3.9015 9.85508C3.65881 9.75452 3.4383 9.60715 3.25257 9.42137C3.06684 9.2356 2.91952 9.01506 2.81901 8.77234C2.71851 8.52963 2.6668 8.2695 2.66683 8.0068C2.66686 7.74411 2.71864 7.48399 2.81919 7.2413C2.91975 6.99861 3.06713 6.77811 3.2529 6.59237L7.02424 2.82104L7.96691 3.76371Z",
      fill: "currentColor"
    }
  ) });
}
function Hn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 12 13.3333", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M4.66667 0C5.03467 0 5.33333 0.298667 5.33333 0.666667V3.33333C5.33333 3.70133 5.03467 4 4.66667 4H3.33333V5.33333H6.66667V4.66667C6.66667 4.29867 6.96533 4 7.33333 4H11.3333C11.7013 4 12 4.29867 12 4.66667V7.33333C12 7.70133 11.7013 8 11.3333 8H7.33333C6.96533 8 6.66667 7.70133 6.66667 7.33333V6.66667H3.33333V10.6667H6.66667V10C6.66667 9.632 6.96533 9.33333 7.33333 9.33333H11.3333C11.7013 9.33333 12 9.632 12 10V12.6667C12 13.0347 11.7013 13.3333 11.3333 13.3333H7.33333C6.96533 13.3333 6.66667 13.0347 6.66667 12.6667V12H2.66667C2.29867 12 2 11.7013 2 11.3333V4H0.666667C0.298667 4 0 3.70133 0 3.33333V0.666667C0 0.298667 0.298667 0 0.666667 0H4.66667ZM10.6667 10.6667H8V12H10.6667V10.6667ZM10.6667 5.33333H8V6.66667H10.6667V5.33333ZM4 1.33333H1.33333V2.66667H4V1.33333Z",
      fill: "currentColor"
    }
  ) });
}
function In(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 13.3333 13.3333", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M3.52734 12.5493L7.52433e-06 13.3333L0.784008 9.806C0.267695 8.84025 -0.00164123 7.76176 7.52433e-06 6.66667C7.52433e-06 2.98467 2.98467 0 6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333C5.57158 13.335 4.49309 13.0656 3.52734 12.5493V12.5493ZM3.72067 11.1407L4.15601 11.374C4.92837 11.7868 5.79094 12.0018 6.66667 12C7.72151 12 8.75265 11.6872 9.62971 11.1012C10.5068 10.5151 11.1904 9.68218 11.594 8.70764C11.9977 7.73311 12.1033 6.66075 11.8975 5.62618C11.6917 4.59162 11.1838 3.64131 10.4379 2.89543C9.69203 2.14955 8.74172 1.6416 7.70716 1.43581C6.67259 1.23002 5.60024 1.33564 4.6257 1.73931C3.65116 2.14298 2.8182 2.82656 2.23217 3.70363C1.64614 4.58069 1.33334 5.61183 1.33334 6.66667C1.33334 7.556 1.55001 8.412 1.96001 9.17733L2.19267 9.61267L1.75601 11.5773L3.72067 11.1407V11.1407Z",
      fill: "currentColor"
    }
  ) });
}
function Tn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 18 18", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M0 0H8V8H0V0ZM0 10H8V18H0V10ZM10 0H18V8H10V0ZM10 10H18V18H10V10ZM12 2V6H16V2H12ZM12 12V16H16V12H12ZM2 2V6H6V2H2ZM2 12V16H6V12H2Z",
      fill: "currentColor"
    }
  ) });
}
function Rn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 18 16", ...e, children: /* @__PURE__ */ t("path", { d: "M0 0H18V2H0V0ZM0 7H18V9H0V7ZM0 14H18V16H0V14Z", fill: "currentColor" }) });
}
function An(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 14 14", ...e, children: /* @__PURE__ */ t("path", { d: "M6 6V0H8V6H14V8H8V14H6V8H0V6H6Z", fill: "currentColor" }) });
}
function Zr(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 20.314 20.314", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875V13.875Z",
      fill: "currentColor"
    }
  ) });
}
function Gr(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 20 21", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M18 15H20V17H0V15H2V8C2 5.87827 2.84285 3.84344 4.34315 2.34315C5.84344 0.842855 7.87827 0 10 0C12.1217 0 14.1566 0.842855 15.6569 2.34315C17.1571 3.84344 18 5.87827 18 8V15ZM16 15V8C16 6.4087 15.3679 4.88258 14.2426 3.75736C13.1174 2.63214 11.5913 2 10 2C8.4087 2 6.88258 2.63214 5.75736 3.75736C4.63214 4.88258 4 6.4087 4 8V15H16ZM7 19H13V21H7V19Z",
      fill: "currentColor"
    }
  ) });
}
function Ve(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 20 18", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M1 0H19C19.2652 0 19.5196 0.105357 19.7071 0.292893C19.8946 0.48043 20 0.734784 20 1V17C20 17.2652 19.8946 17.5196 19.7071 17.7071C19.5196 17.8946 19.2652 18 19 18H1C0.734784 18 0.48043 17.8946 0.292893 17.7071C0.105357 17.5196 0 17.2652 0 17V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0V0ZM7 8V6H5V8H3V10H5V12H7V10H9V8H7ZM11 8V10H17V8H11Z",
      fill: "currentColor"
    }
  ) });
}
function Wr(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 16 21", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M16 21H0V19C0 17.6739 0.526784 16.4021 1.46447 15.4645C2.40215 14.5268 3.67392 14 5 14H11C12.3261 14 13.5979 14.5268 14.5355 15.4645C15.4732 16.4021 16 17.6739 16 19V21ZM8 12C7.21207 12 6.43185 11.8448 5.7039 11.5433C4.97595 11.2417 4.31451 10.7998 3.75736 10.2426C3.20021 9.68549 2.75825 9.02405 2.45672 8.2961C2.15519 7.56815 2 6.78793 2 6C2 5.21207 2.15519 4.43185 2.45672 3.7039C2.75825 2.97595 3.20021 2.31451 3.75736 1.75736C4.31451 1.20021 4.97595 0.758251 5.7039 0.456723C6.43185 0.155195 7.21207 -1.17411e-08 8 0C9.5913 2.37122e-08 11.1174 0.632141 12.2426 1.75736C13.3679 2.88258 14 4.4087 14 6C14 7.5913 13.3679 9.11742 12.2426 10.2426C11.1174 11.3679 9.5913 12 8 12V12Z",
      fill: "currentColor"
    }
  ) });
}
function Er(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 20.7988 20.7998", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M9.48579 0L19.3848 1.415L20.7988 11.315L11.6068 20.507C11.4193 20.6945 11.165 20.7998 10.8998 20.7998C10.6346 20.7998 10.3803 20.6945 10.1928 20.507L0.292786 10.607C0.105315 10.4195 0 10.1652 0 9.9C0 9.63484 0.105315 9.38053 0.292786 9.193L9.48579 0ZM12.3138 8.486C12.4995 8.67169 12.7201 8.81897 12.9627 8.91944C13.2054 9.01991 13.4655 9.0716 13.7281 9.07155C13.9908 9.07151 14.2509 9.01973 14.4935 8.91917C14.7361 8.81862 14.9566 8.67126 15.1423 8.4855C15.328 8.29975 15.4753 8.07923 15.5757 7.83656C15.6762 7.59388 15.7279 7.3338 15.7278 7.07115C15.7278 6.8085 15.676 6.54843 15.5755 6.30579C15.4749 6.06315 15.3275 5.84269 15.1418 5.657C14.956 5.47131 14.7355 5.32403 14.4928 5.22356C14.2502 5.12309 13.9901 5.0714 13.7274 5.07145C13.197 5.07154 12.6883 5.28235 12.3133 5.6575C11.9383 6.03265 11.7276 6.54141 11.7277 7.07185C11.7278 7.6023 11.9386 8.11098 12.3138 8.486Z",
      fill: "currentColor"
    }
  ) });
}
function Fr(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 20 20", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M7 0V2H13V0H15V2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H1C0.734784 20 0.48043 19.8946 0.292893 19.7071C0.105357 19.5196 0 19.2652 0 19V3C0 2.73478 0.105357 2.48043 0.292893 2.29289C0.48043 2.10536 0.734784 2 1 2H5V0H7ZM18 9H2V18H18V9ZM13.036 10.136L14.45 11.55L9.5 16.5L5.964 12.964L7.38 11.55L9.501 13.672L13.037 10.136H13.036ZM5 4H2V7H18V4H15V5H13V4H7V5H5V4Z",
      fill: "currentColor"
    }
  ) });
}
function jn(e) {
  return /* @__PURE__ */ d(L, { viewBox: "0 0 40 40", ...e, children: [
    /* @__PURE__ */ t("g", { transform: "translate(0 2)", children: /* @__PURE__ */ t(
      "path",
      {
        d: "M30.4218 24.5565C35.7216 23.1082 39.6183 18.2592 39.6183 12.5C39.6183 5.71624 34.214 0.194797 27.477 0.00660328V0H8.06627H0L6.69512 8.33114H8.06627V8.33334H27.181C29.4535 8.36636 31.2857 10.2186 31.2857 12.4989C31.2857 14.8002 29.4204 16.6656 27.1194 16.6656H24.0811H13.3913L28.9285 36H39.6172L30.4218 24.5565Z",
        fill: "currentColor"
      }
    ) }),
    /* @__PURE__ */ t("g", { transform: "translate(3.5 27)", children: /* @__PURE__ */ t(
      "path",
      {
        d: "M5.5 11C8.53757 11 11 8.53757 11 5.5C11 2.46243 8.53757 0 5.5 0C2.46243 0 0 2.46243 0 5.5C0 8.53757 2.46243 11 5.5 11Z",
        fill: "currentColor"
      }
    ) })
  ] });
}
function _r(e) {
  return /* @__PURE__ */ t(
    L,
    {
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...e,
      children: /* @__PURE__ */ t("path", { d: "m15.5 5-7 7 7 7" })
    }
  );
}
function ut(e) {
  return /* @__PURE__ */ t(
    L,
    {
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...e,
      children: /* @__PURE__ */ t("path", { d: "m8.5 5 7 7-7 7" })
    }
  );
}
function Ie(e) {
  return /* @__PURE__ */ t(
    L,
    {
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...e,
      children: /* @__PURE__ */ t("path", { d: "m5 8.5 7 7 7-7" })
    }
  );
}
function Ur(e) {
  return /* @__PURE__ */ t(
    L,
    {
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...e,
      children: /* @__PURE__ */ t("path", { d: "m18 5-7 7 7 7M12 5l-7 7 7 7" })
    }
  );
}
function $r(e) {
  return /* @__PURE__ */ t(
    L,
    {
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...e,
      children: /* @__PURE__ */ t("path", { d: "m6 5 7 7-7 7M12 5l7 7-7 7" })
    }
  );
}
function mt(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 14 14", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M7 5.586 12.293.293l1.414 1.414L8.414 7l5.293 5.293-1.414 1.414L7 8.414l-5.293 5.293-1.414-1.414L5.586 7 .293 1.707 1.707.293 7 5.586Z",
      fill: "currentColor"
    }
  ) });
}
function _e({
  variant: e = "secondary",
  isSelected: r = !1,
  children: n,
  className: s,
  isDisabled: o,
  ...l
}) {
  const a = M(null), { buttonProps: i } = ee({ ...l, isDisabled: o }, a);
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
function Ue({
  variant: e = "primary",
  isSelected: r = !1,
  className: n,
  isDisabled: s,
  ...o
}) {
  const l = M(null), { buttonProps: a } = ee({ ...o, isDisabled: s }, l), i = {
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
function Dn({ label: e, error: r, className: n, ...s }) {
  const o = M(null), { labelProps: l, inputProps: a, errorMessageProps: i } = Le(
    { ...s, label: e, isInvalid: !!r, errorMessage: r },
    o
  );
  return /* @__PURE__ */ d("div", { className: "flex flex-col gap-1.5 w-full", children: [
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
function Kr({
  placeholder: e = "Search...",
  value: r,
  onChange: n,
  onSubmit: s,
  className: o
}) {
  const [l, a] = Ye(""), i = r !== void 0, u = i ? r : l, c = M(null), { inputProps: g } = Le(
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
    c
  );
  return /* @__PURE__ */ d("div", { className: m("inline-flex items-center gap-6 min-w-0", o), children: [
    /* @__PURE__ */ t(Zr, { className: "w-6 h-6 text-muted shrink-0" }),
    /* @__PURE__ */ t(
      "input",
      {
        ...g,
        ref: c,
        className: "flex-1 bg-transparent text-body-m text-main placeholder:text-muted outline-none font-sans min-w-0"
      }
    )
  ] });
}
function ie({ src: e, name: r, size: n = "md", className: s }) {
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
      children: e ? /* @__PURE__ */ t("img", { src: e, alt: r || "User avatar", className: "w-full h-full object-cover" }) : /* @__PURE__ */ t("span", { children: l(r) })
    }
  );
}
function Yr({
  searchValue: e,
  searchPlaceholder: r,
  onSearchChange: n,
  onSearchSubmit: s,
  icon: o,
  userName: l,
  userAvatar: a,
  className: i
}) {
  const [u, c] = Ye(""), g = e !== void 0, h = g ? e : u, k = (N) => {
    g || c(N), n == null || n(N);
  }, y = () => {
    g || c(""), n == null || n("");
  };
  return /* @__PURE__ */ d(
    "header",
    {
      className: m(
        "flex items-center justify-between gap-6 px-6 py-3 bg-surface-panel rounded-md",
        i
      ),
      children: [
        /* @__PURE__ */ t(
          Kr,
          {
            placeholder: r,
            value: h,
            onChange: k,
            onSubmit: s,
            className: "flex-1"
          }
        ),
        /* @__PURE__ */ d("div", { className: "flex items-center gap-6 shrink-0", children: [
          h ? /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              onClick: y,
              "aria-label": "Clear search",
              className: "w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-xs [&>svg]:w-full [&>svg]:h-full",
              children: /* @__PURE__ */ t(mt, {})
            }
          ) : null,
          /* @__PURE__ */ t("span", { className: "w-6 h-6 text-muted shrink-0 [&>svg]:w-full [&>svg]:h-full", children: o ?? /* @__PURE__ */ t(Gr, {}) }),
          l || a ? /* @__PURE__ */ t(ie, { src: a, name: l, size: "md" }) : null
        ] })
      ]
    }
  );
}
function Bn({
  items: e,
  panels: r,
  defaultSelectedKey: n,
  selectedKey: s,
  onSelectionChange: o,
  className: l
}) {
  var g;
  const a = bt(() => new Map(e.map((h) => [h.id, h])), [e]), i = At({
    items: e,
    selectedKey: s,
    defaultSelectedKey: n ?? ((g = e[0]) == null ? void 0 : g.id),
    onSelectionChange: (h) => o == null ? void 0 : o(String(h)),
    children: (h) => /* @__PURE__ */ t(jt, { textValue: h.label, children: h.label }, h.id)
  }), u = M(null), { tabListProps: c } = ht(
    { "aria-label": "Tab navigation" },
    i,
    u
  );
  return /* @__PURE__ */ d("div", { className: m("flex flex-col", l), children: [
    /* @__PURE__ */ t("div", { ...c, ref: u, className: "flex items-end", children: [...i.collection].map((h) => {
      var k;
      return /* @__PURE__ */ t(
        Xr,
        {
          item: h,
          state: i,
          icon: (k = a.get(String(h.key))) == null ? void 0 : k.icon
        },
        h.key
      );
    }) }),
    r ? /* @__PURE__ */ t(qr, { state: i, panels: r }) : null
  ] });
}
function Xr({ item: e, state: r, icon: n }) {
  const s = M(null), { tabProps: o, isSelected: l } = gt({ key: e.key }, r, s);
  return /* @__PURE__ */ d(
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
function qr({ state: e, panels: r }) {
  const n = M(null), { tabPanelProps: s } = xt({}, e, n), o = e.selectedKey != null ? String(e.selectedKey) : "";
  return /* @__PURE__ */ t("div", { ...s, ref: n, className: "flex-1", children: r[o] ?? null });
}
function On({
  options: e,
  value: r,
  defaultValue: n,
  onChange: s,
  className: o
}) {
  var k;
  const [l, a] = O.useState(n ?? ((k = e[0]) == null ? void 0 : k.id) ?? ""), i = r !== void 0, u = i ? r : l, c = M([]), g = (y) => {
    i || a(y), s == null || s(y);
  }, h = (y) => {
    var R;
    const N = e.findIndex((S) => S.id === u);
    if (N === -1) return;
    let w = null;
    switch (y.key) {
      case "ArrowRight":
      case "ArrowDown":
        w = (N + 1) % e.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        w = (N - 1 + e.length) % e.length;
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
    const V = e[w];
    g(V.id), (R = c.current[w]) == null || R.focus();
  };
  return /* @__PURE__ */ t(
    "div",
    {
      role: "radiogroup",
      "aria-label": "View",
      className: m("inline-flex items-center gap-0 p-1 bg-surface-panel rounded-10", o),
      children: e.map((y, N) => {
        const w = u === y.id;
        return /* @__PURE__ */ d(
          "button",
          {
            ref: (V) => {
              c.current[N] = V;
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
function Zn({ children: e, className: r, ...n }) {
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
function F({
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
  return /* @__PURE__ */ d(
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
function ft({ title: e, icon: r, className: n }) {
  return /* @__PURE__ */ d("div", { className: m("flex items-center gap-2 w-full", n), children: [
    /* @__PURE__ */ t("h3", { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: e }),
    r ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0 text-muted", children: r }) : null
  ] });
}
function Jr({ badges: e, className: r }) {
  return (
    // gap-4 matches Figma's "Frame 653" gap (16px, Cards01.md L614 / Cards00.md L657).
    /* @__PURE__ */ t("div", { className: m("flex flex-wrap items-center gap-4", r), children: e.map((n) => /* @__PURE__ */ d(
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
const Qr = {
  normal: "neutral",
  warning: "tertiary",
  overdue: "primary"
};
function en({
  title: e,
  points: r,
  dueDateText: n,
  dueDateUrgency: s = "normal",
  tags: o = [],
  assigneeName: l,
  assigneeAvatar: a,
  metaBadges: i = [],
  className: u,
  onClick: c
}) {
  return /* @__PURE__ */ d(
    "div",
    {
      onClick: c,
      role: c ? "button" : void 0,
      tabIndex: c ? 0 : void 0,
      onKeyDown: c ? (g) => {
        (g.key === "Enter" || g.key === " ") && (g.preventDefault(), c());
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
        /* @__PURE__ */ t(ft, { title: e }),
        r !== void 0 || n ? /* @__PURE__ */ d("div", { className: "flex items-center justify-between gap-2", children: [
          r !== void 0 ? (
            // Desktop/Body/M/bold: SF Pro Display, 15px/24px, weight 600, letter-spacing 0.75px
            // (tracking-wider, exact at this size). Was previously `text-sm font-bold` (14px/700).
            /* @__PURE__ */ d("span", { className: "text-body-m font-semibold text-main font-sans", children: [
              r,
              " Pts"
            ] })
          ) : null,
          n ? (
            // The due-date pill IS a real "Tag" instance per spec (padding 4px 16px, gap 8px,
            // radius 4px, alarm-line icon, Desktop/Body/M/bold) — reusing `Tag` directly instead
            // of a bespoke span gets typography/spacing/color right for free.
            /* @__PURE__ */ t(
              F,
              {
                variant: Qr[s],
                icon: /* @__PURE__ */ t(Or, { className: "size-6" }),
                children: n
              }
            )
          ) : null
        ] }) : null,
        o.length > 0 ? /* @__PURE__ */ t("div", { className: "flex flex-wrap items-center gap-2", children: o.map((g, h) => /* @__PURE__ */ t(F, { variant: g.variant || "neutral", children: g.label }, h)) }) : null,
        /* @__PURE__ */ d("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ t(ie, { src: a, name: l, size: "sm" }),
            l ? /* @__PURE__ */ t("span", { className: "font-sans text-xs font-medium text-muted truncate max-w-[120px]", children: l }) : null
          ] }),
          i.length > 0 ? /* @__PURE__ */ t(Jr, { badges: i }) : null
        ] })
      ]
    }
  );
}
function Z({ className: e }) {
  return /* @__PURE__ */ t("div", { "aria-hidden": !0, className: m("animate-pulse rounded-sm bg-neutral-3", e) });
}
function Ce() {
  return /* @__PURE__ */ d("div", { className: "flex flex-col gap-4 p-4 bg-surface-panel rounded-sm border border-transparent", children: [
    /* @__PURE__ */ t(Z, { className: "h-6 w-3/4" }),
    /* @__PURE__ */ d("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t(Z, { className: "h-6 w-16" }),
      /* @__PURE__ */ t(Z, { className: "h-6 w-20 rounded" })
    ] }),
    /* @__PURE__ */ t("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ t(Z, { className: "w-8 h-8 rounded-full" }),
      /* @__PURE__ */ t(Z, { className: "h-3 w-20" })
    ] }) })
  ] });
}
function Gn({
  title: e,
  icon: r,
  tasks: n,
  isLoading: s = !1,
  className: o
}) {
  return /* @__PURE__ */ d("div", { className: m("flex flex-col gap-4 w-full", o), children: [
    /* @__PURE__ */ t(ft, { title: e, icon: r }),
    s ? /* @__PURE__ */ d(Ke, { children: [
      /* @__PURE__ */ t(Ce, {}),
      /* @__PURE__ */ t(Ce, {}),
      /* @__PURE__ */ t(Ce, {})
    ] }) : n.length === 0 ? /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-16 text-muted font-sans text-sm", children: "No tasks in this view." }) : n.map((l, a) => /* @__PURE__ */ t(en, { ...l, className: "w-full" }, a))
  ] });
}
const B = {
  name: 500,
  tags: 168,
  estimation: 140,
  assignee: 168,
  dueDate: 132
}, tn = ({ className: e }) => /* @__PURE__ */ t(
  "svg",
  {
    className: e,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": !0,
    children: /* @__PURE__ */ t("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3" })
  }
), X = "text-body-m font-normal text-main font-sans", G = "h-14 shrink-0 bg-surface-panel border-y border-r border-neutral-3";
function rn({ date: e, urgency: r = "normal" }) {
  return /* @__PURE__ */ t("span", { className: m(X, {
    normal: "text-main",
    warning: "text-tertiary-4",
    // text-primary-4 kept as a raw ramp class, not aliased to `text-interactive` — this is a
    // status/urgency signal, not an interactive affordance, so the "interactive" alias would
    // misrepresent its role even though it happens to share the same color value.
    overdue: "text-primary-4"
  }[r]), children: e });
}
function nn({ name: e, avatarSrc: r }) {
  return /* @__PURE__ */ d("div", { className: "flex items-center gap-2 min-w-0", children: [
    /* @__PURE__ */ t(ie, { src: r, name: e, size: "sm" }),
    /* @__PURE__ */ t("span", { className: m(X, "truncate"), children: e })
  ] });
}
function sn({ points: e }) {
  return /* @__PURE__ */ d("span", { className: m(X, "tabular-nums"), children: [
    e,
    " ",
    e === 1 ? "Point" : "Points"
  ] });
}
function on({ labels: e }) {
  return /* @__PURE__ */ t("div", { className: "flex flex-wrap items-center gap-2", children: e.map((r, n) => /* @__PURE__ */ t(F, { variant: r.variant ?? "neutral", children: r.label }, n)) });
}
const ln = {
  primary: "bg-primary-4",
  secondary: "bg-secondary-4",
  tertiary: "bg-tertiary-4"
};
function an({
  index: e,
  title: r,
  indicatorColor: n = "secondary",
  reactions: s = [],
  isSelected: o = !1,
  onSelectedChange: l,
  tags: a = [],
  estimationPoints: i,
  assigneeName: u,
  assigneeAvatar: c,
  dueDate: g,
  dueDateUrgency: h = "normal",
  onClick: k,
  onViewDetails: y
}) {
  return /* @__PURE__ */ d("tr", { onClick: k, className: m("group", k && "cursor-pointer"), children: [
    /* @__PURE__ */ t("td", { className: m(G, "pl-0 pr-4 border-l"), style: { width: B.name }, children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ t("span", { className: m("w-1 h-full shrink-0", ln[n]) }),
      /* @__PURE__ */ d("label", { className: "w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer rounded-xs has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-4 has-[:focus-visible]:outline-offset-1", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            className: "sr-only",
            checked: o,
            onChange: (N) => l == null ? void 0 : l(N.target.checked),
            "aria-label": `Select ${r}`
          }
        ),
        /* @__PURE__ */ t(
          tn,
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
      s.map((N) => /* @__PURE__ */ d(
        "span",
        {
          className: m(X, "inline-flex items-center gap-1 shrink-0"),
          children: [
            /* @__PURE__ */ t("span", { className: "tabular-nums", children: N.count }),
            /* @__PURE__ */ t("span", { children: N.emoji })
          ]
        },
        N.emoji
      )),
      y ? /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          onClick: y,
          className: m(
            X,
            "inline-flex items-center gap-1 shrink-0 hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs"
          ),
          children: [
            /* @__PURE__ */ t("span", { children: "Details" }),
            /* @__PURE__ */ t(ut, { className: "w-4 h-4" })
          ]
        }
      ) : null
    ] }) }),
    /* @__PURE__ */ t("td", { className: m(G, "pl-2 pr-4"), style: { width: B.tags }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: a.length > 0 ? /* @__PURE__ */ t(on, { labels: a }) : null }) }),
    /* @__PURE__ */ t("td", { className: m(G, "pl-2 pr-4"), style: { width: B.estimation }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: i !== void 0 ? /* @__PURE__ */ t(sn, { points: i }) : null }) }),
    /* @__PURE__ */ t("td", { className: m(G, "pl-2 pr-4"), style: { width: B.assignee }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: u ? /* @__PURE__ */ t(nn, { name: u, avatarSrc: c }) : null }) }),
    /* @__PURE__ */ t("td", { className: m(G, "pl-2 pr-4"), style: { width: B.dueDate }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: g ? /* @__PURE__ */ t(rn, { date: g, urgency: h }) : null }) })
  ] });
}
function cn() {
  return /* @__PURE__ */ d("tr", { children: [
    /* @__PURE__ */ t("td", { className: m(G, "pl-4 pr-4 border-l"), style: { width: B.name }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(Z, { className: "h-4 w-full" }) }) }),
    /* @__PURE__ */ t("td", { className: m(G, "pl-4 pr-4"), style: { width: B.tags }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(Z, { className: "h-6 w-16 rounded" }) }) }),
    /* @__PURE__ */ t("td", { className: m(G, "pl-4 pr-4"), style: { width: B.estimation }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(Z, { className: "h-4 w-16" }) }) }),
    /* @__PURE__ */ t("td", { className: m(G, "pl-4 pr-4"), style: { width: B.assignee }, children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ t(Z, { className: "w-8 h-8 rounded-full shrink-0" }),
      /* @__PURE__ */ t(Z, { className: "h-4 w-20" })
    ] }) }),
    /* @__PURE__ */ t("td", { className: m(G, "pl-4 pr-4"), style: { width: B.dueDate }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(Z, { className: "h-4 w-20" }) }) })
  ] });
}
const ae = [
  { key: "name", label: "# Task Name" },
  { key: "tags", label: "Task Tags" },
  { key: "estimation", label: "Estimate" },
  { key: "assignee", label: "Task Assign Name" },
  { key: "dueDate", label: "Due Date" }
];
function Wn({ groups: e, isLoading: r = !1, className: n }) {
  return /* @__PURE__ */ t(
    "div",
    {
      className: m(
        "w-full overflow-x-auto",
        "[scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-3 [&::-webkit-scrollbar-thumb]:rounded-full",
        n
      ),
      children: /* @__PURE__ */ d("div", { className: "flex flex-col gap-4 min-w-[1108px]", children: [
        /* @__PURE__ */ t("div", { className: "flex", children: ae.map(({ key: s, label: o }, l) => /* @__PURE__ */ t(
          "div",
          {
            className: m(
              G,
              "px-4",
              l === 0 && "border-l rounded-l-4",
              l === ae.length - 1 && "rounded-r-4"
            ),
            style: { width: B[s] },
            children: /* @__PURE__ */ t("span", { className: X, children: o })
          },
          s
        )) }),
        r ? /* @__PURE__ */ d("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ t("colgroup", { children: ae.map(({ key: s }) => /* @__PURE__ */ t("col", { style: { width: B[s] } }, s)) }),
          /* @__PURE__ */ t("tbody", { children: Array.from({ length: 5 }).map((s, o) => /* @__PURE__ */ t(cn, {}, o)) })
        ] }) : e.length === 0 ? /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-16 text-muted font-sans text-sm", children: "No tasks yet." }) : e.map((s, o) => /* @__PURE__ */ d("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ t("colgroup", { children: ae.map(({ key: l }) => /* @__PURE__ */ t("col", { style: { width: B[l] } }, l)) }),
          /* @__PURE__ */ d("tbody", { children: [
            /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ t("td", { colSpan: ae.length, className: "p-0 border border-neutral-3", children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2 h-14 px-4 bg-surface-panel rounded-t-4", children: [
              /* @__PURE__ */ t(Ie, { className: "w-6 h-6 shrink-0 text-muted" }),
              /* @__PURE__ */ t("h3", { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: s.title }),
              s.actions
            ] }) }) }),
            s.rows.map((l, a) => /* @__PURE__ */ t(an, { ...l }, a))
          ] })
        ] }, o))
      ] })
    }
  );
}
function ge({
  isOpen: e,
  onClose: r,
  triggerRef: n,
  role: s = "dialog",
  children: o,
  className: l,
  ...a
}) {
  const i = M(null), { overlayProps: u } = vt(
    {
      isOpen: e,
      onClose: r,
      isDismissable: !0,
      shouldCloseOnInteractOutside: (c) => {
        var g;
        return !((g = n == null ? void 0 : n.current) != null && g.contains(c));
      }
    },
    i
  );
  return e ? (
    // eslint-disable-next-line jsx-a11y/no-autofocus
    /* @__PURE__ */ t(Pe, { restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ d("div", { ...u, ...a, ref: i, role: s, className: l, children: [
      /* @__PURE__ */ t(be, { onDismiss: r }),
      o,
      /* @__PURE__ */ t(be, { onDismiss: r })
    ] }) })
  ) : null;
}
function Te({
  state: e,
  children: r,
  popoverRef: n,
  className: s,
  ...o
}) {
  const l = M(null), a = n ?? l, { popoverProps: i, underlayProps: u } = yt({ ...o, popoverRef: a }, e);
  return /* @__PURE__ */ d(wt, { children: [
    /* @__PURE__ */ t("div", { ...u, className: "fixed inset-0" }),
    /* @__PURE__ */ t(Pe, { restoreFocus: !0, children: /* @__PURE__ */ d(
      "div",
      {
        ...i,
        ref: a,
        onKeyDownCapture: (c) => {
          c.key === "Escape" && (c.stopPropagation(), e.close());
        },
        className: m(
          "z-50 bg-surface-overlay rounded-sm border border-subtle shadow-xl",
          s
        ),
        children: [
          /* @__PURE__ */ t(be, { onDismiss: () => e.close() }),
          r,
          /* @__PURE__ */ t(be, { onDismiss: () => e.close() })
        ]
      }
    ) })
  ] });
}
function pt({
  state: e,
  listBoxRef: r,
  className: n,
  ...s
}) {
  const o = M(null), l = r ?? o, { listBoxProps: a } = kt(s, e, l);
  return /* @__PURE__ */ t(
    "ul",
    {
      ...a,
      ref: l,
      className: m("max-h-64 min-w-40 overflow-auto py-2 outline-none", n),
      children: [...e.collection].map((i) => /* @__PURE__ */ t(dn, { item: i, state: e }, i.key))
    }
  );
}
function dn({ item: e, state: r }) {
  const n = M(null), { optionProps: s, isSelected: o, isFocused: l, isDisabled: a } = Ct(
    { key: e.key },
    r,
    n
  );
  return /* @__PURE__ */ d(
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
function En({
  placeholder: e,
  icon: r,
  className: n,
  ...s
}) {
  const o = Dt(s), l = M(null), { labelProps: a, triggerProps: i, valueProps: u, menuProps: c } = Nt(s, o, l), { buttonProps: g } = ee(i, l);
  return /* @__PURE__ */ d("div", { className: m("inline-flex flex-col gap-1.5", n), children: [
    s.label ? /* @__PURE__ */ t(
      "span",
      {
        ...a,
        className: "text-field-label font-semibold text-neutral-3 uppercase font-sans",
        children: s.label
      }
    ) : null,
    /* @__PURE__ */ t(Mt, { state: o, triggerRef: l, label: s.label, name: s.name }),
    /* @__PURE__ */ d(
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
          /* @__PURE__ */ t(Ie, { className: "w-3 h-3 shrink-0" })
        ]
      }
    ),
    o.isOpen ? /* @__PURE__ */ t(Te, { state: o, triggerRef: l, placement: "bottom start", children: /* @__PURE__ */ t(pt, { ...c, state: o }) }) : null
  ] });
}
function Fn({
  label: e,
  placeholder: r,
  icon: n,
  isDisabled: s,
  className: o,
  ...l
}) {
  const a = Se({}), i = M(null), u = Bt({
    ...l,
    selectionMode: "multiple",
    // Explicit, not the default: a plain click on an item should add it to
    // the selection, not replace it — the behavior a set of checkable tags
    // needs, unlike a file browser's click-to-replace/Ctrl-click-to-add.
    selectionBehavior: "toggle"
  }), { buttonProps: c } = ee(
    { onPress: () => a.toggle(), isDisabled: s, "aria-label": e },
    i
  ), g = [...u.collection].filter(
    (h) => u.selectionManager.isSelected(h.key)
  );
  return /* @__PURE__ */ d("div", { className: m("inline-block", o), children: [
    /* @__PURE__ */ d(
      "button",
      {
        ...c,
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
          g.length > 0 ? /* @__PURE__ */ t("span", { className: "flex flex-wrap items-center gap-1", children: g.map((h) => /* @__PURE__ */ t(F, { variant: "primary", children: h.rendered }, h.key)) }) : /* @__PURE__ */ t("span", { children: r }),
          /* @__PURE__ */ t(Ie, { className: "w-3 h-3 shrink-0" })
        ]
      }
    ),
    a.isOpen ? /* @__PURE__ */ t(Te, { state: a, triggerRef: i, placement: "bottom start", children: /* @__PURE__ */ t(pt, { "aria-label": e, state: u, autoFocus: !0 }) }) : null
  ] });
}
function _n({
  label: e,
  triggerContent: r,
  isDisabled: n,
  triggerClassName: s,
  ...o
}) {
  const l = Ot({}), a = M(null), { menuTriggerProps: i, menuProps: u } = Vt(
    { isDisabled: n },
    l,
    a
  ), { buttonProps: c } = ee(
    { ...i, isDisabled: n, "aria-label": e },
    a
  );
  return /* @__PURE__ */ d(Ke, { children: [
    /* @__PURE__ */ t(
      "button",
      {
        ...c,
        ref: a,
        type: "button",
        className: m(
          "cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          s
        ),
        children: r
      }
    ),
    l.isOpen ? /* @__PURE__ */ t(Te, { state: l, triggerRef: a, placement: "bottom end", children: /* @__PURE__ */ t(
      un,
      {
        ...u,
        ...o,
        autoFocus: o.autoFocus ?? l.focusStrategy ?? !0,
        onClose: () => l.close()
      }
    ) }) : null
  ] });
}
function un({ children: e, onAction: r, onClose: n, ...s }) {
  const o = Zt({ ...s, children: e, selectionMode: "none" }), l = M(null), { menuProps: a } = Lt({ ...s, onAction: r, onClose: n }, o, l);
  return /* @__PURE__ */ t("ul", { ...a, ref: l, className: "max-h-64 min-w-40 overflow-auto py-2 outline-none", children: [...o.collection].map((i) => /* @__PURE__ */ t(mn, { item: i, state: o, onClose: n }, i.key)) });
}
function mn({ item: e, state: r, onClose: n }) {
  const s = M(null), { menuItemProps: o, isFocused: l, isDisabled: a } = Pt(
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
function Un({
  title: e,
  isOpen: r,
  onClose: n,
  children: s,
  width: o = "max-w-md",
  role: l = "dialog"
}) {
  const a = M(null), i = M(null), u = Se({
    isOpen: r,
    onOpenChange: (y) => {
      y || n();
    }
  }), { modalProps: c, underlayProps: g } = St(
    { isDismissable: !0 },
    u,
    a
  ), { dialogProps: h, titleProps: k } = zt({ role: l }, i);
  return r ? /* @__PURE__ */ t(
    "div",
    {
      ...g,
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      children: /* @__PURE__ */ t(Pe, { contain: !0, restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ t("div", { ...c, ref: a, className: m("w-full", o), children: /* @__PURE__ */ d(
        "div",
        {
          ...h,
          ref: i,
          className: "flex flex-col bg-surface-overlay rounded-sm border border-subtle overflow-hidden",
          children: [
            /* @__PURE__ */ d("div", { className: "flex items-center justify-between px-4 py-4 border-b border-neutral-4", children: [
              /* @__PURE__ */ t("h2", { ...k, className: "font-sans font-bold text-base text-main", children: e }),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: n,
                  "aria-label": "Close modal",
                  className: "flex items-center justify-center w-8 h-8 rounded-md text-muted hover:bg-neutral-4 hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                  children: /* @__PURE__ */ t(mt, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ t("div", { className: "px-4 py-4", children: s })
          ]
        }
      ) }) })
    }
  ) : null;
}
function $n(e = !1) {
  const r = Se({ defaultOpen: e });
  return {
    isOpen: r.isOpen,
    open: r.open,
    close: r.close,
    toggle: r.toggle
  };
}
function $e(e) {
  return new Ft(e.getFullYear(), e.getMonth() + 1, e.getDate());
}
function fn(e) {
  return e.toDate(Ne());
}
function pn({
  value: e,
  defaultValue: r,
  onChange: n,
  onClose: s,
  triggerRef: o,
  className: l
}) {
  const a = e !== void 0 ? { value: $e(e) } : { defaultValue: r ? $e(r) : null }, i = Gt({
    ...a,
    onChange: (V) => n == null ? void 0 : n(fn(V)),
    createCalendar: Et,
    // Hardcoded, matching the prior implementation's hardcoded English
    // MONTHS/DAYS arrays — no `I18nProvider`/locale story exists in this kit
    // yet, so introducing locale-dependent formatting here would be an
    // unverified behavior change, not a fix.
    locale: "en-US",
    firstDayOfWeek: "sun",
    weeksInMonth: 6
  }), { calendarProps: u, prevButtonProps: c, nextButtonProps: g } = Ht(
    { "aria-label": "Date picker" },
    i
  ), h = M(null), k = M(null), { buttonProps: y } = ee(c, h), { buttonProps: N } = ee(g, k), w = () => {
    const V = _t(Ne());
    i.setFocusedDate(V), i.selectDate(V);
  };
  return /* @__PURE__ */ d(
    ge,
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
        /* @__PURE__ */ d("div", { ...u, className: "flex flex-col", children: [
          /* @__PURE__ */ d("div", { className: "flex items-center justify-between px-2 py-[9px] h-10", children: [
            /* @__PURE__ */ d("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: () => i.focusPreviousSection(!0),
                  "aria-label": "Previous year",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ t(Ur, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  ...y,
                  ref: h,
                  "aria-label": "Previous month",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ t(_r, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ t("span", { className: "font-sans font-semibold text-body-sm text-main", children: i.visibleRange.start.toDate(Ne()).toLocaleDateString("en-US", { month: "long", year: "numeric" }) }),
            /* @__PURE__ */ d("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ t(
                "button",
                {
                  ...N,
                  ref: k,
                  "aria-label": "Next month",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ t(ut, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: () => i.focusNextSection(!0),
                  "aria-label": "Next year",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ t($r, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ t("div", { className: "h-px w-full bg-neutral-2" }),
          /* @__PURE__ */ t(bn, { state: i })
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
function bn({ state: e }) {
  const { gridProps: r, headerProps: n, weekDays: s, weeksInMonth: o } = It(
    { weekdayStyle: "short" },
    e
  ), l = e.visibleRange.start;
  return /* @__PURE__ */ d("div", { ...r, className: "flex flex-col px-3 py-2", children: [
    /* @__PURE__ */ t("div", { ...n, className: "grid grid-cols-7", children: s.map((a, i) => /* @__PURE__ */ t("span", { className: "text-center text-body-sm font-normal text-main font-sans", children: a }, i)) }),
    Array.from({ length: o }, (a, i) => /* @__PURE__ */ t("div", { role: "row", className: "grid grid-cols-7", children: e.getDatesInWeek(i).map(
      (u, c) => u ? /* @__PURE__ */ t(
        hn,
        {
          state: e,
          date: u,
          currentMonth: l
        },
        u.toString()
      ) : /* @__PURE__ */ t("div", { role: "gridcell", "aria-hidden": "true" }, c)
    ) }, i))
  ] });
}
function hn({
  state: e,
  date: r,
  currentMonth: n
}) {
  const s = M(null), o = !Ut(r, n), { cellProps: l, buttonProps: a, isSelected: i, isDisabled: u, formattedDate: c } = Tt(
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
      children: c
    }
  ) });
}
const gn = [1, 2, 3, 5, 8];
function xn({
  value: e,
  onSelect: r,
  onClose: n,
  triggerRef: s,
  className: o
}) {
  return /* @__PURE__ */ d(
    ge,
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
        gn.map((l) => /* @__PURE__ */ d(
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
              /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ t(Ve, { className: "size-6" }) }),
              /* @__PURE__ */ d("span", { className: "whitespace-nowrap", children: [
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
function vn({
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
  return /* @__PURE__ */ d(
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
        /* @__PURE__ */ d("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ t(ie, { src: n, name: e, size: s }),
          o ? /* @__PURE__ */ t("span", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary-4 border-2 border-neutral-5" }) : null
        ] }),
        /* @__PURE__ */ d("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ t("span", { className: "font-sans font-normal text-body-m text-main truncate", children: e }),
          r ? /* @__PURE__ */ t("span", { className: m("font-sans text-muted truncate leading-tight", i[s]), children: r }) : null
        ] })
      ]
    }
  );
}
function yn({
  assignees: e,
  onSelect: r,
  onClose: n,
  triggerRef: s,
  className: o
}) {
  return /* @__PURE__ */ d(
    ge,
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
            children: /* @__PURE__ */ t(vn, { name: l.name, role: l.role, avatarSrc: l.avatarSrc, size: "sm" })
          },
          l.id
        ))
      ]
    }
  );
}
function wn({ labels: e, onSelect: r, onClose: n, triggerRef: s, className: o }) {
  return /* @__PURE__ */ d(
    ge,
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
            children: /* @__PURE__ */ t(F, { variant: l.variant ?? "neutral", children: l.text })
          },
          l.id
        ))
      ]
    }
  );
}
function Kn({
  isOpen: e,
  onClose: r,
  assignees: n = [],
  labels: s = [],
  onSubmit: o,
  initialTitle: l = "",
  initialDueDate: a,
  initialPoints: i,
  initialAssignee: u,
  initialLabel: c,
  className: g
}) {
  const [h, k] = O.useState(l), [y, N] = O.useState(a), [w, V] = O.useState(i), [R, S] = O.useState(u), [W, _] = O.useState(c), [z, D] = O.useState(null), I = (C) => D((U) => U === C ? null : C), b = () => D(null), T = O.useRef(null), re = O.useRef(null), ne = O.useRef(null), J = O.useRef(null);
  if (!e) return null;
  const se = () => {
    k(""), N(void 0), V(void 0), S(void 0), _(void 0), D(null);
  }, oe = (C) => {
    C.preventDefault(), h.trim() && (o == null || o({ title: h.trim(), dueDate: y, points: w, assignee: R, label: W }), se(), r());
  }, K = () => {
    se(), r();
  };
  return /* @__PURE__ */ d(
    "form",
    {
      onSubmit: oe,
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
            onChange: (C) => k(C.target.value),
            placeholder: "Task name",
            "aria-label": "Task name",
            className: "w-full bg-transparent text-body-xl font-semibold text-main placeholder:text-muted font-sans outline-none"
          }
        ),
        /* @__PURE__ */ d("div", { className: "flex items-center gap-4 w-full", children: [
          /* @__PURE__ */ d("div", { className: "relative", children: [
            w === void 0 ? /* @__PURE__ */ t(
              "button",
              {
                ref: T,
                type: "button",
                onClick: () => I("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "estimate",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(F, { icon: /* @__PURE__ */ t(Ve, { className: "size-6" }), children: "Estimate" })
              }
            ) : /* @__PURE__ */ d(
              "button",
              {
                ref: T,
                type: "button",
                onClick: () => I("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "estimate",
                className: "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ t(Ve, { className: "size-6" }) }),
                  w,
                  " Point",
                  w !== 1 ? "s" : ""
                ]
              }
            ),
            z === "estimate" ? /* @__PURE__ */ t(
              xn,
              {
                value: w,
                onSelect: (C) => {
                  V(C), D(null);
                },
                onClose: b,
                triggerRef: T,
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] }),
          /* @__PURE__ */ d("div", { className: "relative", children: [
            R ? /* @__PURE__ */ d(
              "button",
              {
                ref: re,
                type: "button",
                onClick: () => I("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "assignee",
                className: "flex items-center gap-2 h-8 px-2 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ t(ie, { src: R.avatarSrc, name: R.name, size: "sm" }),
                  R.name
                ]
              }
            ) : /* @__PURE__ */ t(
              "button",
              {
                ref: re,
                type: "button",
                onClick: () => I("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "assignee",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(F, { icon: /* @__PURE__ */ t(Wr, { className: "size-6" }), children: "Assignee" })
              }
            ),
            z === "assignee" ? /* @__PURE__ */ t(
              yn,
              {
                assignees: n,
                onSelect: (C) => {
                  S(C), D(null);
                },
                onClose: b,
                triggerRef: re,
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] }),
          /* @__PURE__ */ d("div", { className: "relative", children: [
            W ? /* @__PURE__ */ t(
              "button",
              {
                ref: ne,
                type: "button",
                onClick: () => I("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "label",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(F, { variant: W.variant ?? "neutral", children: W.text })
              }
            ) : /* @__PURE__ */ t(
              "button",
              {
                ref: ne,
                type: "button",
                onClick: () => I("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "label",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(F, { icon: /* @__PURE__ */ t(Er, { className: "size-6" }), children: "Label" })
              }
            ),
            z === "label" ? /* @__PURE__ */ t(
              wn,
              {
                labels: s,
                onSelect: (C) => {
                  _(C), D(null);
                },
                onClose: b,
                triggerRef: ne,
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] }),
          /* @__PURE__ */ d("div", { className: "relative", children: [
            /* @__PURE__ */ t(
              "button",
              {
                ref: J,
                type: "button",
                onClick: () => I("date"),
                "aria-haspopup": "dialog",
                "aria-expanded": z === "date",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(F, { icon: /* @__PURE__ */ t(Fr, { className: "size-6" }), children: y ? y.toLocaleDateString("en-US") : "Due date" })
              }
            ),
            z === "date" ? /* @__PURE__ */ t(
              pn,
              {
                value: y,
                onChange: (C) => {
                  N(C), D(null);
                },
                onClose: b,
                triggerRef: J,
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] })
        ] }),
        /* @__PURE__ */ d("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ t(Ue, { variant: "secondary", onPress: K, children: "Cancel" }),
          /* @__PURE__ */ t(Ue, { variant: "primary", type: "submit", isDisabled: !h.trim(), children: "Create Task" })
        ] })
      ]
    }
  );
}
function Yn({ variant: e = "neutral", children: r, className: n }) {
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
function Xn({
  children: e,
  isSelected: r,
  defaultSelected: n = !1,
  onChange: s,
  isDisabled: o = !1,
  isIndeterminate: l = !1,
  className: a
}) {
  const i = Wt({
    isSelected: r,
    defaultSelected: n,
    onChange: s
  }), u = M(null), { inputProps: c, labelProps: g } = Rt(
    {
      isSelected: i.isSelected,
      isIndeterminate: l,
      isDisabled: o,
      "aria-label": typeof e == "string" ? e : "Checkbox"
    },
    i,
    u
  );
  return /* @__PURE__ */ d(
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
        /* @__PURE__ */ t("input", { ...c, ref: u, className: "sr-only" }),
        /* @__PURE__ */ d(
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
              i.isSelected && !l ? /* @__PURE__ */ t(
                "path",
                {
                  d: "M8 12.5 11 15.5 16 9.5",
                  strokeWidth: 2,
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ) : l ? /* @__PURE__ */ t("path", { d: "M8 12h8", strokeWidth: 2, strokeLinecap: "round" }) : null
            ]
          }
        ),
        /* @__PURE__ */ t("span", { className: "text-body-m font-normal font-sans text-main", children: e })
      ]
    }
  );
}
function qn({ label: e, error: r, className: n, ...s }) {
  const o = M(null), { labelProps: l, inputProps: a, errorMessageProps: i } = Le(
    { ...s, label: e, type: "date", isInvalid: !!r, errorMessage: r },
    o
  );
  return /* @__PURE__ */ d("div", { className: "flex flex-col gap-1.5 w-full", children: [
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
function kn({
  icon: e,
  label: r,
  isActive: n = !1,
  badgeCount: s,
  onClick: o,
  className: l
}) {
  return /* @__PURE__ */ d(
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
function Cn({ logo: e, items: r, className: n }) {
  return /* @__PURE__ */ d(
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
        /* @__PURE__ */ t("div", { className: "flex flex-col gap-2 flex-1 overflow-y-auto", children: r.map((s, o) => /* @__PURE__ */ t(kn, { ...s }, o)) })
      ]
    }
  );
}
function Jn({
  value: e,
  onChange: r,
  leftIcon: n,
  rightIcon: s,
  leftLabel: o,
  rightLabel: l,
  className: a
}) {
  return /* @__PURE__ */ d("div", { className: m("flex items-center w-20 h-10 bg-surface-shell rounded-sm", a), children: [
    /* @__PURE__ */ t(
      _e,
      {
        variant: "secondary",
        isSelected: e === "left",
        "aria-label": o,
        onPress: () => r == null ? void 0 : r("left"),
        children: n
      }
    ),
    /* @__PURE__ */ t(
      _e,
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
function Qn({
  logo: e,
  sidebarItems: r,
  topNavProps: n,
  topBar: s,
  children: o,
  className: l
}) {
  return /* @__PURE__ */ d(
    "div",
    {
      className: m("flex items-start gap-8 w-full min-h-screen bg-surface-shell p-8", l),
      children: [
        /* @__PURE__ */ t(Cn, { logo: e, items: r, className: "self-stretch" }),
        /* @__PURE__ */ d("div", { className: "flex flex-col gap-8 flex-1 min-w-0", children: [
          /* @__PURE__ */ t(Yr, { ...n }),
          /* @__PURE__ */ d("div", { className: "flex flex-col gap-4", children: [
            s ? /* @__PURE__ */ t("div", { className: "flex items-start justify-between gap-6", children: s }) : null,
            o
          ] })
        ] })
      ]
    }
  );
}
export {
  Kn as AddTaskModal,
  Or as AlarmIcon,
  Qn as AppShell,
  Cn as ApplicationSidebar,
  Wr as AssigneeIcon,
  yn as AssigneeModal,
  nn as AssigneeNameCell,
  zn as AttachmentIcon,
  ie as Avatar,
  Yn as Badge,
  Gr as BellIcon,
  _e as Button,
  Fr as CalendarIcon,
  Zn as Card,
  Ur as ChevronDoubleLeftIcon,
  $r as ChevronDoubleRightIcon,
  Ie as ChevronDownIcon,
  _r as ChevronLeftIcon,
  ut as ChevronRightIcon,
  mt as CloseIcon,
  In as CommentIcon,
  pn as DatePickerMenu,
  qn as Datepicker,
  rn as DueDateCell,
  xn as EstimateModal,
  sn as EstimationCell,
  Te as FloatingPopover,
  Tn as GridViewIcon,
  Dn as Input,
  Xn as LabelCheckbox,
  Er as LabelIcon,
  wn as LabelModal,
  pt as ListBox,
  Rn as ListViewIcon,
  jn as LogoMark,
  _n as Menu,
  Sn as MenuDotsIcon,
  Un as Modal,
  Fn as MultiSelect,
  An as PlusIcon,
  Ve as PointsIcon,
  ge as Popover,
  ft as ProjectInfo,
  Kr as SearchBar,
  Zr as SearchIcon,
  On as SegmentedControl,
  En as Select,
  kn as SidebarItem,
  Z as Skeleton,
  Hn as SubtaskIcon,
  Bn as Tabs,
  F as Tag,
  on as TagCell,
  en as TaskCard,
  Gn as TaskListView,
  Jr as TaskMetaBadges,
  Wn as TaskTable,
  an as TaskTableRow,
  Ue as TextButton,
  Yr as TopNav,
  vn as UserRow,
  Jn as ViewSwitcher,
  m as cn,
  $n as useModalState
};
