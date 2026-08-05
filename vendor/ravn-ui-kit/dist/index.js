import { jsx as t, jsxs as u, Fragment as et } from "react/jsx-runtime";
import B, { useRef as M, useState as tt, useMemo as rt, useEffect as We, useContext as Ct, createContext as Nt } from "react";
import { useButton as X, useField as Ie, useTextField as Te, useTabList as Mt, useTab as Pt, useTabPanel as Lt, useOverlay as St, FocusScope as ze, DismissButton as ge, usePopover as Vt, Overlay as It, useListBox as Tt, useOption as zt, useSelect as Ht, HiddenSelect as Rt, useMenuTrigger as At, useMenu as Dt, useMenuItem as jt, useModalOverlay as Ot, useDialog as Bt, useCalendar as Et, useCalendarGrid as Zt, useCalendarCell as Ft, useToastRegion as Gt, useToast as Wt, useCheckbox as _t } from "react-aria";
import { useTabListState as Ut, Item as $t, useSelectState as Kt, useOverlayTriggerState as He, useListState as Yt, useMenuTriggerState as qt, useTreeState as Xt, useCalendarState as Jt, useToastState as Qt, useToggleState as er } from "react-stately";
import { createCalendar as tr, getLocalTimeZone as Le, CalendarDate as rr, today as nr, isSameMonth as sr } from "@internationalized/date";
import { createPortal as or } from "react-dom";
function nt(e) {
  var n, r, s = "";
  if (typeof e == "string" || typeof e == "number") s += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var l = e.length;
    for (n = 0; n < l; n++) e[n] && (r = nt(e[n])) && (s && (s += " "), s += r);
  } else for (r in e) e[r] && (s && (s += " "), s += r);
  return s;
}
function lr() {
  for (var e, n, r = 0, s = "", l = arguments.length; r < l; r++) (e = arguments[r]) && (n = nt(e)) && (s && (s += " "), s += n);
  return s;
}
const ir = (e, n) => {
  const r = new Array(e.length + n.length);
  for (let s = 0; s < e.length; s++)
    r[s] = e[s];
  for (let s = 0; s < n.length; s++)
    r[e.length + s] = n[s];
  return r;
}, ar = (e, n) => ({
  classGroupId: e,
  validator: n
}), st = (e = /* @__PURE__ */ new Map(), n = null, r) => ({
  nextPart: e,
  validators: n,
  classGroupId: r
}), xe = "-", _e = [], cr = "arbitrary..", dr = (e) => {
  const n = mr(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: s
  } = e;
  return {
    getClassGroupId: (i) => {
      if (i.startsWith("[") && i.endsWith("]"))
        return ur(i);
      const a = i.split(xe), d = a[0] === "" && a.length > 1 ? 1 : 0;
      return ot(a, d, n);
    },
    getConflictingClassGroupIds: (i, a) => {
      if (a) {
        const d = s[i], c = r[i];
        return d ? c ? ir(c, d) : d : c || _e;
      }
      return r[i] || _e;
    }
  };
}, ot = (e, n, r) => {
  if (e.length - n === 0)
    return r.classGroupId;
  const l = e[n], o = r.nextPart.get(l);
  if (o) {
    const c = ot(e, n + 1, o);
    if (c) return c;
  }
  const i = r.validators;
  if (i === null)
    return;
  const a = n === 0 ? e.join(xe) : e.slice(n).join(xe), d = i.length;
  for (let c = 0; c < d; c++) {
    const g = i[c];
    if (g.validator(a))
      return g.classGroupId;
  }
}, ur = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const n = e.slice(1, -1), r = n.indexOf(":"), s = n.slice(0, r);
  return s ? cr + s : void 0;
})(), mr = (e) => {
  const {
    theme: n,
    classGroups: r
  } = e;
  return fr(r, n);
}, fr = (e, n) => {
  const r = st();
  for (const s in e) {
    const l = e[s];
    Re(l, r, s, n);
  }
  return r;
}, Re = (e, n, r, s) => {
  const l = e.length;
  for (let o = 0; o < l; o++) {
    const i = e[o];
    pr(i, n, r, s);
  }
}, pr = (e, n, r, s) => {
  if (typeof e == "string") {
    br(e, n, r);
    return;
  }
  if (typeof e == "function") {
    hr(e, n, r, s);
    return;
  }
  gr(e, n, r, s);
}, br = (e, n, r) => {
  const s = e === "" ? n : lt(n, e);
  s.classGroupId = r;
}, hr = (e, n, r, s) => {
  if (xr(e)) {
    Re(e(s), n, r, s);
    return;
  }
  n.validators === null && (n.validators = []), n.validators.push(ar(r, e));
}, gr = (e, n, r, s) => {
  const l = Object.entries(e), o = l.length;
  for (let i = 0; i < o; i++) {
    const [a, d] = l[i];
    Re(d, lt(n, a), r, s);
  }
}, lt = (e, n) => {
  let r = e;
  const s = n.split(xe), l = s.length;
  for (let o = 0; o < l; o++) {
    const i = s[o];
    let a = r.nextPart.get(i);
    a || (a = st(), r.nextPart.set(i, a)), r = a;
  }
  return r;
}, xr = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, vr = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let n = 0, r = /* @__PURE__ */ Object.create(null), s = /* @__PURE__ */ Object.create(null);
  const l = (o, i) => {
    r[o] = i, n++, n > e && (n = 0, s = r, r = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(o) {
      let i = r[o];
      if (i !== void 0)
        return i;
      if ((i = s[o]) !== void 0)
        return l(o, i), i;
    },
    set(o, i) {
      o in r ? r[o] = i : l(o, i);
    }
  };
}, Se = "!", Ue = ":", yr = [], $e = (e, n, r, s, l) => ({
  modifiers: e,
  hasImportantModifier: n,
  baseClassName: r,
  maybePostfixModifierPosition: s,
  isExternal: l
}), wr = (e) => {
  const {
    prefix: n,
    experimentalParseClassName: r
  } = e;
  let s = (l) => {
    const o = [];
    let i = 0, a = 0, d = 0, c;
    const g = l.length;
    for (let w = 0; w < g; w++) {
      const N = l[w];
      if (i === 0 && a === 0) {
        if (N === Ue) {
          o.push(l.slice(d, w)), d = w + 1;
          continue;
        }
        if (N === "/") {
          c = w;
          continue;
        }
      }
      N === "[" ? i++ : N === "]" ? i-- : N === "(" ? a++ : N === ")" && a--;
    }
    const p = o.length === 0 ? l : l.slice(d);
    let k = p, v = !1;
    p.endsWith(Se) ? (k = p.slice(0, -1), v = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      p.startsWith(Se) && (k = p.slice(1), v = !0)
    );
    const C = c && c > d ? c - d : void 0;
    return $e(o, v, k, C);
  };
  if (n) {
    const l = n + Ue, o = s;
    s = (i) => i.startsWith(l) ? o(i.slice(l.length)) : $e(yr, !1, i, void 0, !0);
  }
  if (r) {
    const l = s;
    s = (o) => r({
      className: o,
      parseClassName: l
    });
  }
  return s;
}, kr = (e) => {
  const n = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((r, s) => {
    n.set(r, 1e6 + s);
  }), (r) => {
    const s = [];
    let l = [];
    for (let o = 0; o < r.length; o++) {
      const i = r[o], a = i[0] === "[", d = n.has(i);
      a || d ? (l.length > 0 && (l.sort(), s.push(...l), l = []), s.push(i)) : l.push(i);
    }
    return l.length > 0 && (l.sort(), s.push(...l)), s;
  };
}, Cr = (e) => ({
  cache: vr(e.cacheSize),
  parseClassName: wr(e),
  sortModifiers: kr(e),
  postfixLookupClassGroupIds: Nr(e),
  ...dr(e)
}), Nr = (e) => {
  const n = /* @__PURE__ */ Object.create(null), r = e.postfixLookupClassGroups;
  if (r)
    for (let s = 0; s < r.length; s++)
      n[r[s]] = !0;
  return n;
}, Mr = /\s+/, Pr = (e, n) => {
  const {
    parseClassName: r,
    getClassGroupId: s,
    getConflictingClassGroupIds: l,
    sortModifiers: o,
    postfixLookupClassGroupIds: i
  } = n, a = [], d = e.trim().split(Mr);
  let c = "";
  for (let g = d.length - 1; g >= 0; g -= 1) {
    const p = d[g], {
      isExternal: k,
      modifiers: v,
      hasImportantModifier: C,
      baseClassName: w,
      maybePostfixModifierPosition: N
    } = r(p);
    if (k) {
      c = p + (c.length > 0 ? " " + c : c);
      continue;
    }
    let S = !!N, I;
    if (S) {
      const H = w.substring(0, N);
      I = s(H);
      const h = I && i[I] ? s(w) : void 0;
      h && h !== I && (I = h, S = !1);
    } else
      I = s(w);
    if (!I) {
      if (!S) {
        c = p + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (I = s(w), !I) {
        c = p + (c.length > 0 ? " " + c : c);
        continue;
      }
      S = !1;
    }
    const F = v.length === 0 ? "" : v.length === 1 ? v[0] : o(v).join(":"), _ = C ? F + Se : F, T = _ + I;
    if (a.indexOf(T) > -1)
      continue;
    a.push(T);
    const j = l(I, S);
    for (let H = 0; H < j.length; ++H) {
      const h = j[H];
      a.push(_ + h);
    }
    c = p + (c.length > 0 ? " " + c : c);
  }
  return c;
}, Lr = (...e) => {
  let n = 0, r, s, l = "";
  for (; n < e.length; )
    (r = e[n++]) && (s = it(r)) && (l && (l += " "), l += s);
  return l;
}, it = (e) => {
  if (typeof e == "string")
    return e;
  let n, r = "";
  for (let s = 0; s < e.length; s++)
    e[s] && (n = it(e[s])) && (r && (r += " "), r += n);
  return r;
}, Sr = (e, ...n) => {
  let r, s, l, o;
  const i = (d) => {
    const c = n.reduce((g, p) => p(g), e());
    return r = Cr(c), s = r.cache.get, l = r.cache.set, o = a, a(d);
  }, a = (d) => {
    const c = s(d);
    if (c)
      return c;
    const g = Pr(d, r);
    return l(d, g), g;
  };
  return o = i, (...d) => o(Lr(...d));
}, Vr = [], V = (e) => {
  const n = (r) => r[e] || Vr;
  return n.isThemeGetter = !0, n;
}, at = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, ct = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Ir = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Tr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, zr = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Hr = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Rr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Ar = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Y = (e) => Ir.test(e), y = (e) => !!e && !Number.isNaN(Number(e)), G = (e) => !!e && Number.isInteger(Number(e)), Me = (e) => e.endsWith("%") && y(e.slice(0, -1)), $ = (e) => Tr.test(e), dt = () => !0, Dr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  zr.test(e) && !Hr.test(e)
), Ae = () => !1, jr = (e) => Rr.test(e), Or = (e) => Ar.test(e), Br = (e) => !f(e) && !b(e), Er = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Zr = (e) => J(e, ft, Ae), f = (e) => at.test(e), ee = (e) => J(e, pt, Dr), Ke = (e) => J(e, Yr, y), Fr = (e) => J(e, ht, dt), Gr = (e) => J(e, bt, Ae), Ye = (e) => J(e, ut, Ae), Wr = (e) => J(e, mt, Or), be = (e) => J(e, gt, jr), b = (e) => ct.test(e), ie = (e) => te(e, pt), _r = (e) => te(e, bt), qe = (e) => te(e, ut), Ur = (e) => te(e, ft), $r = (e) => te(e, mt), he = (e) => te(e, gt, !0), Kr = (e) => te(e, ht, !0), J = (e, n, r) => {
  const s = at.exec(e);
  return s ? s[1] ? n(s[1]) : r(s[2]) : !1;
}, te = (e, n, r = !1) => {
  const s = ct.exec(e);
  return s ? s[1] ? n(s[1]) : r : !1;
}, ut = (e) => e === "position" || e === "percentage", mt = (e) => e === "image" || e === "url", ft = (e) => e === "length" || e === "size" || e === "bg-size", pt = (e) => e === "length", Yr = (e) => e === "number", bt = (e) => e === "family-name", ht = (e) => e === "number" || e === "weight", gt = (e) => e === "shadow", qr = () => {
  const e = V("color"), n = V("font"), r = V("text"), s = V("font-weight"), l = V("tracking"), o = V("leading"), i = V("breakpoint"), a = V("container"), d = V("spacing"), c = V("radius"), g = V("shadow"), p = V("inset-shadow"), k = V("text-shadow"), v = V("drop-shadow"), C = V("blur"), w = V("perspective"), N = V("aspect"), S = V("ease"), I = V("animate"), F = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], _ = () => [
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
  ], T = () => [..._(), b, f], j = () => ["auto", "hidden", "clip", "visible", "scroll"], H = () => ["auto", "contain", "none"], h = () => [b, f, d], R = () => [Y, "full", "auto", ...h()], re = () => [G, "none", "subgrid", b, f], ne = () => ["auto", {
    span: ["full", G, b, f]
  }, G, b, f], Q = () => [G, "auto", b, f], oe = () => ["auto", "min", "max", "fr", b, f], le = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], K = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], P = () => ["auto", ...h()], U = () => [Y, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...h()], we = () => [Y, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...h()], ke = () => [Y, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...h()], x = () => [e, b, f], Be = () => [..._(), qe, Ye, {
    position: [b, f]
  }], Ee = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], Ze = () => ["auto", "cover", "contain", Ur, Zr, {
    size: [b, f]
  }], Ce = () => [Me, ie, ee], A = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    c,
    b,
    f
  ], D = () => ["", y, ie, ee], ue = () => ["solid", "dashed", "dotted", "double"], Fe = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], z = () => [y, Me, qe, Ye], Ge = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    C,
    b,
    f
  ], me = () => ["none", y, b, f], fe = () => ["none", y, b, f], Ne = () => [y, b, f], pe = () => [Y, "full", ...h()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [$],
      breakpoint: [$],
      color: [dt],
      container: [$],
      "drop-shadow": [$],
      ease: ["in", "out", "in-out"],
      font: [Br],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [$],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [$],
      shadow: [$],
      spacing: ["px", y],
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
        aspect: ["auto", "square", Y, f, b, N]
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
        "@container": ["", "normal", "size", b, f]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [Er],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [y, f, b, a]
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
        object: T()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: j()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": j()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": j()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: H()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": H()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": H()
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
        inset: R()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": R()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": R()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": R(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: R()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": R(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: R()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": R()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": R()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: R()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: R()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: R()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: R()
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
        z: [G, "auto", b, f]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Y, "full", "auto", a, ...h()]
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
        flex: [y, Y, "auto", "initial", "none", f]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", y, b, f]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", y, b, f]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [G, "first", "last", "none", b, f]
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
        "col-start": Q()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": Q()
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
        "row-start": Q()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": Q()
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
        "auto-cols": oe()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": oe()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: h()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": h()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": h()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...le(), "normal"]
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
        content: ["normal", ...le()]
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
        "place-content": le()
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
        p: h()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: h()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: h()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: h()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: h()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: h()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: h()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: h()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: h()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: h()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: h()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: P()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: P()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: P()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: P()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: P()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: P()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: P()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: P()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: P()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: P()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: P()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": h()
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
        "space-y": h()
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
        inline: ["auto", ...we()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...we()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...we()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...ke()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...ke()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...ke()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [a, "screen", ...U()]
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
          ...U()
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
        text: ["base", r, ie, ee]
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
        font: [s, Kr, Fr]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Me, f]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [_r, Gr, n]
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
        tracking: [l, b, f]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [y, "none", b, Ke]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          o,
          ...h()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", b, f]
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
        list: ["disc", "decimal", "none", b, f]
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
        decoration: [...ue(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [y, "from-font", "auto", b, ee]
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
        "underline-offset": [y, "auto", b, f]
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
        indent: h()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [G, b, f]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", b, f]
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
        content: ["none", b, f]
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
        bg: Be()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: Ee()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: Ze()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, G, b, f],
          radial: ["", b, f],
          conic: [G, b, f]
        }, $r, Wr]
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
        from: Ce()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: Ce()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: Ce()
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
        border: [...ue(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...ue(), "hidden", "none"]
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
        outline: [...ue(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [y, b, f]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", y, ie, ee]
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
          he,
          be
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
        "inset-shadow": ["none", p, he, be]
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
        "ring-offset": [y, ee]
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
        "text-shadow": ["none", k, he, be]
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
        opacity: [y, b, f]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Fe(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Fe()
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
        "mask-linear": [y]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": z()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": z()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": x()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": x()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": z()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": z()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": x()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": x()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": z()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": z()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": x()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": x()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": z()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": z()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": x()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": x()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": z()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": z()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": x()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": x()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": z()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": z()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": x()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": x()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": z()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": z()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": x()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": x()
      }],
      "mask-image-radial": [{
        "mask-radial": [b, f]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": z()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": z()
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
        "mask-conic": [y]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": z()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": z()
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
        mask: Be()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: Ee()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: Ze()
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
        mask: ["none", b, f]
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
          b,
          f
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: Ge()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [y, b, f]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [y, b, f]
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
          v,
          he,
          be
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
        grayscale: ["", y, b, f]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [y, b, f]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", y, b, f]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [y, b, f]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", y, b, f]
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
          b,
          f
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": Ge()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [y, b, f]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [y, b, f]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", y, b, f]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [y, b, f]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", y, b, f]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [y, b, f]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [y, b, f]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", y, b, f]
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
        "border-spacing": h()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": h()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": h()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", b, f]
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
        duration: [y, "initial", b, f]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", S, b, f]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [y, b, f]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", I, b, f]
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
        perspective: [w, b, f]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": T()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: me()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": me()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": me()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": me()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: fe()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": fe()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": fe()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": fe()
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
        skew: Ne()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Ne()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Ne()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [b, f, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: T()
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
        translate: pe()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": pe()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": pe()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": pe()
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
        zoom: [G, b, f]
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", b, f]
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
        "scroll-m": h()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": h()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": h()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": h()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": h()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": h()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": h()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": h()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": h()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": h()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": h()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": h()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": h()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": h()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": h()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": h()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": h()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": h()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": h()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": h()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": h()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": h()
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
        "will-change": ["auto", "scroll", "contents", "transform", b, f]
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
        stroke: [y, ie, ee, Ke]
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
}, Xr = /* @__PURE__ */ Sr(qr);
function m(...e) {
  return Xr(lr(e));
}
const Jr = {
  normal: "neutral",
  soon: "yellow",
  overdue: "red"
};
function L({ children: e, ...n }) {
  const r = n["aria-label"] != null || n["aria-labelledby"] != null;
  return /* @__PURE__ */ t(
    "svg",
    {
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...r ? { role: "img" } : { "aria-hidden": !0 },
      ...n,
      children: e
    }
  );
}
function Yn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 18 4", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM16 0C14.9 0 14 0.9 14 2C14 3.1 14.9 4 16 4C17.1 4 18 3.1 18 2C18 0.9 17.1 0 16 0ZM9 0C7.9 0 7 0.9 7 2C7 3.1 7.9 4 9 4C10.1 4 11 3.1 11 2C11 0.9 10.1 0 9 0Z",
      fill: "currentColor"
    }
  ) });
}
function Qr(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 20.506 19.253", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M10.253 19.253C9.0711 19.253 7.90078 19.0202 6.80885 18.5679C5.71692 18.1156 4.72477 17.4527 3.88904 16.617C3.05331 15.7812 2.39038 14.7891 1.93808 13.6972C1.48579 12.6052 1.253 11.4349 1.253 10.253C1.253 9.0711 1.48579 7.90078 1.93808 6.80885C2.39038 5.71692 3.05331 4.72477 3.88904 3.88904C4.72477 3.05331 5.71692 2.39038 6.80885 1.93808C7.90078 1.48579 9.0711 1.253 10.253 1.253C12.6399 1.253 14.9291 2.20121 16.617 3.88904C18.3048 5.57687 19.253 7.86605 19.253 10.253C19.253 12.6399 18.3048 14.9291 16.617 16.617C14.9291 18.3048 12.6399 19.253 10.253 19.253V19.253ZM10.253 17.253C11.1723 17.253 12.0825 17.0719 12.9318 16.7202C13.7811 16.3684 14.5527 15.8528 15.2027 15.2027C15.8528 14.5527 16.3684 13.7811 16.7202 12.9318C17.0719 12.0825 17.253 11.1723 17.253 10.253C17.253 9.33375 17.0719 8.42349 16.7202 7.57422C16.3684 6.72494 15.8528 5.95326 15.2027 5.30325C14.5527 4.65324 13.7811 4.13763 12.9318 3.78584C12.0825 3.43406 11.1723 3.253 10.253 3.253C8.39648 3.253 6.61601 3.9905 5.30325 5.30325C3.9905 6.61601 3.253 8.39648 3.253 10.253C3.253 12.1095 3.9905 13.89 5.30325 15.2027C6.61601 16.5155 8.39648 17.253 10.253 17.253V17.253ZM11.253 10.253H14.253V12.253H9.253V5.253H11.253V10.253ZM0 3.535L3.535 0L4.95 1.414L1.413 4.95L0 3.535ZM16.97 0L20.506 3.535L19.092 4.95L15.556 1.414L16.971 0H16.97Z",
      fill: "currentColor"
    }
  ) });
}
function qn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 11.7382 12.6733", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M7.96691 3.76371L4.19624 7.53504C4.13256 7.59654 4.08178 7.6701 4.04684 7.75144C4.0119 7.83277 3.99351 7.92025 3.99274 8.00877C3.99197 8.09729 4.00884 8.18508 4.04236 8.26701C4.07588 8.34894 4.12538 8.42337 4.18798 8.48597C4.25057 8.54856 4.325 8.59807 4.40694 8.63159C4.48887 8.66511 4.57665 8.68198 4.66517 8.68121C4.75369 8.68044 4.84117 8.66205 4.92251 8.62711C5.00384 8.59217 5.07741 8.54138 5.13891 8.47771L8.91024 4.70704C9.28534 4.33194 9.49607 3.82318 9.49607 3.29271C9.49607 2.76223 9.28534 2.25348 8.91024 1.87837C8.53513 1.50327 8.02638 1.29254 7.49591 1.29254C6.96543 1.29254 6.45668 1.50327 6.08157 1.87837L2.31024 5.64971C1.99429 5.95779 1.74266 6.32555 1.56994 6.73164C1.39723 7.13773 1.30687 7.57407 1.3041 8.01536C1.30134 8.45664 1.38622 8.89409 1.55384 9.30231C1.72145 9.71054 1.96845 10.0814 2.28052 10.3934C2.59258 10.7055 2.96349 10.9524 3.37174 11.12C3.77999 11.2875 4.21744 11.3723 4.65873 11.3695C5.10001 11.3667 5.53634 11.2763 5.94241 11.1035C6.34848 10.9307 6.7162 10.679 7.02424 10.363L10.7956 6.59237L11.7382 7.53504L7.96691 11.3064C7.53354 11.7397 7.01907 12.0835 6.45285 12.318C5.88664 12.5526 5.27977 12.6733 4.66691 12.6733C4.05404 12.6733 3.44717 12.5526 2.88096 12.318C2.31474 12.0835 1.80027 11.7397 1.3669 11.3064C0.933543 10.873 0.589781 10.3585 0.355247 9.79232C0.120713 9.22611 -4.56621e-09 8.61924 0 8.00637C4.56621e-09 7.39351 0.120713 6.78664 0.355247 6.22043C0.589781 5.65421 0.933543 5.13973 1.3669 4.70637L5.13891 0.935706C5.76758 0.328513 6.60959 -0.00746872 7.48358 0.000126009C8.35757 0.00772074 9.19361 0.358284 9.81163 0.976311C10.4297 1.59434 10.7802 2.43038 10.7878 3.30437C10.7954 4.17836 10.4594 5.02037 9.85224 5.64904L6.08157 9.42171C5.8958 9.60744 5.67525 9.75476 5.43254 9.85526C5.18983 9.95576 4.9297 10.0075 4.667 10.0074C4.40431 10.0074 4.14419 9.95564 3.9015 9.85508C3.65881 9.75452 3.4383 9.60715 3.25257 9.42137C3.06684 9.2356 2.91952 9.01506 2.81901 8.77234C2.71851 8.52963 2.6668 8.2695 2.66683 8.0068C2.66686 7.74411 2.71864 7.48399 2.81919 7.2413C2.91975 6.99861 3.06713 6.77811 3.2529 6.59237L7.02424 2.82104L7.96691 3.76371Z",
      fill: "currentColor"
    }
  ) });
}
function Xn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 12 13.3333", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M4.66667 0C5.03467 0 5.33333 0.298667 5.33333 0.666667V3.33333C5.33333 3.70133 5.03467 4 4.66667 4H3.33333V5.33333H6.66667V4.66667C6.66667 4.29867 6.96533 4 7.33333 4H11.3333C11.7013 4 12 4.29867 12 4.66667V7.33333C12 7.70133 11.7013 8 11.3333 8H7.33333C6.96533 8 6.66667 7.70133 6.66667 7.33333V6.66667H3.33333V10.6667H6.66667V10C6.66667 9.632 6.96533 9.33333 7.33333 9.33333H11.3333C11.7013 9.33333 12 9.632 12 10V12.6667C12 13.0347 11.7013 13.3333 11.3333 13.3333H7.33333C6.96533 13.3333 6.66667 13.0347 6.66667 12.6667V12H2.66667C2.29867 12 2 11.7013 2 11.3333V4H0.666667C0.298667 4 0 3.70133 0 3.33333V0.666667C0 0.298667 0.298667 0 0.666667 0H4.66667ZM10.6667 10.6667H8V12H10.6667V10.6667ZM10.6667 5.33333H8V6.66667H10.6667V5.33333ZM4 1.33333H1.33333V2.66667H4V1.33333Z",
      fill: "currentColor"
    }
  ) });
}
function Jn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 13.3333 13.3333", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M3.52734 12.5493L7.52433e-06 13.3333L0.784008 9.806C0.267695 8.84025 -0.00164123 7.76176 7.52433e-06 6.66667C7.52433e-06 2.98467 2.98467 0 6.66667 0C10.3487 0 13.3333 2.98467 13.3333 6.66667C13.3333 10.3487 10.3487 13.3333 6.66667 13.3333C5.57158 13.335 4.49309 13.0656 3.52734 12.5493V12.5493ZM3.72067 11.1407L4.15601 11.374C4.92837 11.7868 5.79094 12.0018 6.66667 12C7.72151 12 8.75265 11.6872 9.62971 11.1012C10.5068 10.5151 11.1904 9.68218 11.594 8.70764C11.9977 7.73311 12.1033 6.66075 11.8975 5.62618C11.6917 4.59162 11.1838 3.64131 10.4379 2.89543C9.69203 2.14955 8.74172 1.6416 7.70716 1.43581C6.67259 1.23002 5.60024 1.33564 4.6257 1.73931C3.65116 2.14298 2.8182 2.82656 2.23217 3.70363C1.64614 4.58069 1.33334 5.61183 1.33334 6.66667C1.33334 7.556 1.55001 8.412 1.96001 9.17733L2.19267 9.61267L1.75601 11.5773L3.72067 11.1407V11.1407Z",
      fill: "currentColor"
    }
  ) });
}
function Qn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 18 18", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M0 0H8V8H0V0ZM0 10H8V18H0V10ZM10 0H18V8H10V0ZM10 10H18V18H10V10ZM12 2V6H16V2H12ZM12 12V16H16V12H12ZM2 2V6H6V2H2ZM2 12V16H6V12H2Z",
      fill: "currentColor"
    }
  ) });
}
function es(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 18 16", ...e, children: /* @__PURE__ */ t("path", { d: "M0 0H18V2H0V0ZM0 7H18V9H0V7ZM0 14H18V16H0V14Z", fill: "currentColor" }) });
}
function ts(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 14 14", ...e, children: /* @__PURE__ */ t("path", { d: "M6 6V0H8V6H14V8H8V14H6V8H0V6H6Z", fill: "currentColor" }) });
}
function en(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 20.314 20.314", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M16.031 14.617L20.314 18.899L18.899 20.314L14.617 16.031C13.0237 17.3082 11.042 18.0029 9 18C4.032 18 0 13.968 0 9C0 4.032 4.032 0 9 0C13.968 0 18 4.032 18 9C18.0029 11.042 17.3082 13.0237 16.031 14.617ZM14.025 13.875C15.2941 12.5699 16.0029 10.8204 16 9C16 5.132 12.867 2 9 2C5.132 2 2 5.132 2 9C2 12.867 5.132 16 9 16C10.8204 16.0029 12.5699 15.2941 13.875 14.025L14.025 13.875V13.875Z",
      fill: "currentColor"
    }
  ) });
}
function tn(e) {
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
function rn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 16 21", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M16 21H0V19C0 17.6739 0.526784 16.4021 1.46447 15.4645C2.40215 14.5268 3.67392 14 5 14H11C12.3261 14 13.5979 14.5268 14.5355 15.4645C15.4732 16.4021 16 17.6739 16 19V21ZM8 12C7.21207 12 6.43185 11.8448 5.7039 11.5433C4.97595 11.2417 4.31451 10.7998 3.75736 10.2426C3.20021 9.68549 2.75825 9.02405 2.45672 8.2961C2.15519 7.56815 2 6.78793 2 6C2 5.21207 2.15519 4.43185 2.45672 3.7039C2.75825 2.97595 3.20021 2.31451 3.75736 1.75736C4.31451 1.20021 4.97595 0.758251 5.7039 0.456723C6.43185 0.155195 7.21207 -1.17411e-08 8 0C9.5913 2.37122e-08 11.1174 0.632141 12.2426 1.75736C13.3679 2.88258 14 4.4087 14 6C14 7.5913 13.3679 9.11742 12.2426 10.2426C11.1174 11.3679 9.5913 12 8 12V12Z",
      fill: "currentColor"
    }
  ) });
}
function nn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 20.7988 20.7998", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M9.48579 0L19.3848 1.415L20.7988 11.315L11.6068 20.507C11.4193 20.6945 11.165 20.7998 10.8998 20.7998C10.6346 20.7998 10.3803 20.6945 10.1928 20.507L0.292786 10.607C0.105315 10.4195 0 10.1652 0 9.9C0 9.63484 0.105315 9.38053 0.292786 9.193L9.48579 0ZM12.3138 8.486C12.4995 8.67169 12.7201 8.81897 12.9627 8.91944C13.2054 9.01991 13.4655 9.0716 13.7281 9.07155C13.9908 9.07151 14.2509 9.01973 14.4935 8.91917C14.7361 8.81862 14.9566 8.67126 15.1423 8.4855C15.328 8.29975 15.4753 8.07923 15.5757 7.83656C15.6762 7.59388 15.7279 7.3338 15.7278 7.07115C15.7278 6.8085 15.676 6.54843 15.5755 6.30579C15.4749 6.06315 15.3275 5.84269 15.1418 5.657C14.956 5.47131 14.7355 5.32403 14.4928 5.22356C14.2502 5.12309 13.9901 5.0714 13.7274 5.07145C13.197 5.07154 12.6883 5.28235 12.3133 5.6575C11.9383 6.03265 11.7276 6.54141 11.7277 7.07185C11.7278 7.6023 11.9386 8.11098 12.3138 8.486Z",
      fill: "currentColor"
    }
  ) });
}
function sn(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 20 20", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M7 0V2H13V0H15V2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H1C0.734784 20 0.48043 19.8946 0.292893 19.7071C0.105357 19.5196 0 19.2652 0 19V3C0 2.73478 0.105357 2.48043 0.292893 2.29289C0.48043 2.10536 0.734784 2 1 2H5V0H7ZM18 9H2V18H18V9ZM13.036 10.136L14.45 11.55L9.5 16.5L5.964 12.964L7.38 11.55L9.501 13.672L13.037 10.136H13.036ZM5 4H2V7H18V4H15V5H13V4H7V5H5V4Z",
      fill: "currentColor"
    }
  ) });
}
function rs(e) {
  return /* @__PURE__ */ u(L, { viewBox: "0 0 40 40", ...e, children: [
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
function on(e) {
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
function xt(e) {
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
function De(e) {
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
function ln(e) {
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
function an(e) {
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
function je(e) {
  return /* @__PURE__ */ t(L, { viewBox: "0 0 14 14", ...e, children: /* @__PURE__ */ t(
    "path",
    {
      d: "M7 5.586 12.293.293l1.414 1.414L8.414 7l5.293 5.293-1.414 1.414L7 8.414l-5.293 5.293-1.414-1.414L5.586 7 .293 1.707 1.707.293 7 5.586Z",
      fill: "currentColor"
    }
  ) });
}
function Xe({
  variant: e = "secondary",
  isSelected: n = !1,
  children: r,
  className: s,
  isDisabled: l,
  ...o
}) {
  const i = M(null), { buttonProps: a } = X({ ...o, isDisabled: l }, i);
  return /* @__PURE__ */ t(
    "button",
    {
      ...a,
      ref: i,
      className: m(
        "inline-flex items-center justify-center w-10 h-10 rounded-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          primary: "bg-primary-4 text-main border border-transparent",
          secondary: n ? "bg-transparent text-interactive border border-primary-4" : "bg-transparent text-main border border-transparent"
        }[e],
        s
      ),
      children: /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0 [&>svg]:w-full [&>svg]:h-full", children: r })
    }
  );
}
function Je({
  variant: e = "primary",
  isSelected: n = !1,
  className: r,
  isDisabled: s,
  ...l
}) {
  const o = M(null), { buttonProps: i } = X({ ...l, isDisabled: s }, o), a = {
    primary: m(
      "text-main",
      s ? "bg-primary-2" : n ? "bg-primary-3" : "bg-primary-4 hover:bg-primary-2"
    ),
    secondary: s ? "bg-transparent text-muted" : n ? "bg-neutral-3 text-main" : "bg-transparent text-main hover:bg-neutral-2"
  };
  return /* @__PURE__ */ t(
    "button",
    {
      ...i,
      ref: o,
      className: m(
        "inline-flex items-center justify-center p-2 text-body-m font-normal rounded-sm transition-colors cursor-pointer font-sans select-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:pointer-events-none",
        a[e],
        r
      ),
      children: l.children
    }
  );
}
function ce() {
  return /* @__PURE__ */ t("span", { "aria-hidden": "true", className: "text-danger ml-0.5", children: "*" });
}
const ve = "text-field-label font-semibold text-neutral-3 uppercase font-sans", cn = "text-xs text-muted font-sans", dn = "text-xs text-danger font-sans";
function se({
  description: e,
  error: n,
  descriptionProps: r,
  errorMessageProps: s
}) {
  return n ? /* @__PURE__ */ t("span", { ...s, className: dn, children: n }) : e ? /* @__PURE__ */ t("span", { ...r, className: cn, children: e }) : null;
}
function ns({
  label: e,
  description: n,
  error: r,
  isRequired: s = !1,
  children: l,
  className: o,
  ...i
}) {
  const { labelProps: a, fieldProps: d, descriptionProps: c, errorMessageProps: g } = Ie({
    ...i,
    label: e,
    description: n,
    errorMessage: r,
    isInvalid: !!r
  });
  return /* @__PURE__ */ u("div", { className: m("flex flex-col gap-1.5", o), children: [
    e ? /* @__PURE__ */ u("label", { ...a, className: ve, children: [
      e,
      s ? /* @__PURE__ */ t(ce, {}) : null
    ] }) : null,
    l({
      ...d,
      ...s ? { "aria-required": !0 } : {},
      ...r ? { "aria-invalid": !0 } : {}
    }),
    /* @__PURE__ */ t(
      se,
      {
        description: n,
        error: r,
        descriptionProps: c,
        errorMessageProps: g
      }
    )
  ] });
}
function ss({ label: e, error: n, description: r, className: s, ...l }) {
  const o = M(null), { labelProps: i, inputProps: a, descriptionProps: d, errorMessageProps: c } = Te(
    { ...l, label: e, description: r, isInvalid: !!n, errorMessage: n },
    o
  );
  return /* @__PURE__ */ u("div", { className: "flex flex-col gap-1.5 w-full", children: [
    e ? /* @__PURE__ */ u("label", { ...i, className: ve, children: [
      e,
      l.isRequired ? /* @__PURE__ */ t(ce, {}) : null
    ] }) : null,
    /* @__PURE__ */ t(
      "input",
      {
        ...a,
        ref: o,
        className: m(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md placeholder:text-muted transition-colors focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral",
          n && "border-danger-5 focus-visible:outline-danger-5",
          s
        )
      }
    ),
    /* @__PURE__ */ t(
      se,
      {
        description: r,
        error: n,
        descriptionProps: d,
        errorMessageProps: c
      }
    )
  ] });
}
function un({
  placeholder: e = "Search...",
  value: n,
  onChange: r,
  onSubmit: s,
  className: l
}) {
  const [o, i] = tt(""), a = n !== void 0, d = a ? n : o, c = M(null), { inputProps: g } = Te(
    {
      value: d,
      onChange: (p) => {
        a || i(p), r == null || r(p);
      },
      onKeyDown: (p) => {
        p.key === "Enter" && (s == null || s(d));
      },
      "aria-label": "Search",
      placeholder: e
    },
    c
  );
  return /* @__PURE__ */ u("div", { className: m("inline-flex items-center gap-6 min-w-0", l), children: [
    /* @__PURE__ */ t(en, { className: "w-6 h-6 text-muted shrink-0" }),
    /* @__PURE__ */ t(
      "input",
      {
        ...g,
        ref: c,
        className: "flex-1 bg-transparent text-body-m text-main placeholder:text-muted font-sans min-w-0 rounded-xs focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
      }
    )
  ] });
}
function de({ src: e, name: n, size: r = "md", className: s }) {
  const l = {
    sm: "w-8 h-8 text-xs font-semibold",
    md: "w-10 h-10 text-sm font-semibold",
    lg: "w-12 h-12 text-base font-bold"
  }, o = (i) => {
    if (!i) return "?";
    const a = i.trim().split(" ");
    return a.length >= 2 ? `${a[0][0]}${a[1][0]}`.toUpperCase() : a[0].substring(0, 2).toUpperCase();
  };
  return /* @__PURE__ */ t(
    "div",
    {
      className: m(
        // text-primary-4 kept raw, not aliased to `text-interactive` — this is a decorative
        // accent-tint/accent-text color pairing (bg-primary-1 + text-primary-4), not an
        // interactive affordance; avatars aren't inherently clickable.
        "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-1 text-primary-4 select-none shrink-0",
        l[r],
        s
      ),
      children: e ? /* @__PURE__ */ t("img", { src: e, alt: n || "User avatar", className: "w-full h-full object-cover" }) : /* @__PURE__ */ t("span", { children: o(n) })
    }
  );
}
function mn({
  searchValue: e,
  searchPlaceholder: n,
  onSearchChange: r,
  onSearchSubmit: s,
  icon: l,
  userName: o,
  userAvatar: i,
  className: a
}) {
  const [d, c] = tt(""), g = e !== void 0, p = g ? e : d, k = (C) => {
    g || c(C), r == null || r(C);
  }, v = () => {
    g || c(""), r == null || r("");
  };
  return /* @__PURE__ */ u(
    "header",
    {
      className: m(
        "flex items-center justify-between gap-6 px-6 py-3 bg-surface-panel rounded-md",
        a
      ),
      children: [
        /* @__PURE__ */ t(
          un,
          {
            placeholder: n,
            value: p,
            onChange: k,
            onSubmit: s,
            className: "flex-1"
          }
        ),
        /* @__PURE__ */ u("div", { className: "flex items-center gap-6 shrink-0", children: [
          p ? /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              onClick: v,
              "aria-label": "Clear search",
              className: "w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-xs [&>svg]:w-full [&>svg]:h-full",
              children: /* @__PURE__ */ t(je, {})
            }
          ) : null,
          /* @__PURE__ */ t("span", { className: "w-6 h-6 text-muted shrink-0 [&>svg]:w-full [&>svg]:h-full", children: l ?? /* @__PURE__ */ t(tn, {}) }),
          o || i ? /* @__PURE__ */ t(de, { src: i, name: o, size: "md" }) : null
        ] })
      ]
    }
  );
}
function os({
  items: e,
  panels: n,
  defaultSelectedKey: r,
  selectedKey: s,
  onSelectionChange: l,
  className: o
}) {
  var g;
  const i = rt(() => new Map(e.map((p) => [p.id, p])), [e]), a = Ut({
    items: e,
    selectedKey: s,
    defaultSelectedKey: r ?? ((g = e[0]) == null ? void 0 : g.id),
    onSelectionChange: (p) => l == null ? void 0 : l(String(p)),
    children: (p) => /* @__PURE__ */ t($t, { textValue: p.label, children: p.label }, p.id)
  }), d = M(null), { tabListProps: c } = Mt(
    { "aria-label": "Tab navigation" },
    a,
    d
  );
  return /* @__PURE__ */ u("div", { className: m("flex flex-col", o), children: [
    /* @__PURE__ */ t("div", { ...c, ref: d, className: "flex items-end", children: [...a.collection].map((p) => {
      var k;
      return /* @__PURE__ */ t(
        fn,
        {
          item: p,
          state: a,
          icon: (k = i.get(String(p.key))) == null ? void 0 : k.icon
        },
        p.key
      );
    }) }),
    n ? /* @__PURE__ */ t(pn, { state: a, panels: n }) : null
  ] });
}
function fn({ item: e, state: n, icon: r }) {
  const s = M(null), { tabProps: l, isSelected: o } = Pt({ key: e.key }, n, s);
  return /* @__PURE__ */ u(
    "button",
    {
      ...l,
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
        o ? "text-interactive" : "text-muted hover:text-main"
      ),
      children: [
        r ? /* @__PURE__ */ t("span", { className: "text-base leading-none", children: r }) : null,
        e.rendered ?? e.textValue,
        o ? /* @__PURE__ */ t("span", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary-4" }) : null
      ]
    }
  );
}
function pn({ state: e, panels: n }) {
  const r = M(null), { tabPanelProps: s } = Lt({}, e, r), l = e.selectedKey != null ? String(e.selectedKey) : "";
  return /* @__PURE__ */ t("div", { ...s, ref: r, className: "flex-1", children: n[l] ?? null });
}
function ls({
  options: e,
  value: n,
  defaultValue: r,
  onChange: s,
  className: l
}) {
  var k;
  const [o, i] = B.useState(r ?? ((k = e[0]) == null ? void 0 : k.id) ?? ""), a = n !== void 0, d = a ? n : o, c = M([]), g = (v) => {
    a || i(v), s == null || s(v);
  }, p = (v) => {
    var S;
    const C = e.findIndex((I) => I.id === d);
    if (C === -1) return;
    let w = null;
    switch (v.key) {
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
    v.preventDefault();
    const N = e[w];
    g(N.id), (S = c.current[w]) == null || S.focus();
  };
  return /* @__PURE__ */ t(
    "div",
    {
      role: "radiogroup",
      "aria-label": "View",
      className: m("inline-flex items-center gap-0 p-1 bg-surface-panel rounded-10", l),
      children: e.map((v, C) => {
        const w = d === v.id;
        return /* @__PURE__ */ u(
          "button",
          {
            ref: (N) => {
              c.current[C] = N;
            },
            type: "button",
            role: "radio",
            "aria-checked": w,
            tabIndex: w ? 0 : -1,
            onClick: () => g(v.id),
            onKeyDown: p,
            className: m(
              "inline-flex items-center justify-center gap-2 h-8 px-6 py-1 text-control-label font-normal rounded-sm transition-all cursor-pointer font-sans select-none text-main focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
              w ? "bg-neutral-2 shadow-small" : ""
            ),
            children: [
              v.icon ? /* @__PURE__ */ t("span", { className: "text-base leading-none", children: v.icon }) : null,
              v.label
            ]
          },
          v.id
        );
      })
    }
  );
}
function is({ children: e, className: n, ...r }) {
  return /* @__PURE__ */ t(
    "div",
    {
      ...r,
      className: m(
        "p-5 bg-surface-neutral border border-subtle rounded-lg shadow-xs transition-shadow hover:shadow-sm",
        n
      ),
      children: e
    }
  );
}
function W({
  variant: e = "neutral",
  outline: n = !1,
  icon: r,
  children: s,
  onRemove: l,
  className: o
}) {
  const i = {
    neutral: {
      solid: "bg-neutral-2/10 text-main",
      outline: "border border-neutral-1 text-main"
    },
    // text-primary-4 kept raw here, not aliased to `text-interactive` — this is Tag's own
    // categorical red, not an interactive affordance; aliasing it would wrongly imply
    // every red tag is interactive.
    red: {
      solid: "bg-primary-4/10 text-primary-4",
      outline: "border border-primary-4 text-primary-4"
    },
    green: {
      solid: "bg-secondary-4/10 text-secondary-4",
      outline: "border border-secondary-4 text-secondary-4"
    },
    yellow: {
      solid: "bg-tertiary-4/10 text-tertiary-4",
      outline: "border border-tertiary-4 text-tertiary-4"
    },
    blue: {
      solid: "bg-blue/10 text-blue",
      outline: "border border-blue text-blue"
    }
  };
  return /* @__PURE__ */ u(
    "span",
    {
      className: m(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Tag" component exactly (Style=Solid/Outline,
        // all Type variants, Tags00/01.md). Typography: Desktop/Body/M/bold - SF Pro
        // Display, 15px/24px, letter-spacing 0.75px (tracking-wider @ 15px), weight 600.
        "inline-flex items-center gap-2 px-4 py-1 text-body-m font-semibold rounded font-sans select-none",
        n ? i[e].outline : i[e].solid,
        o
      ),
      children: [
        r ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0", children: r }) : null,
        s,
        l ? /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: l,
            "aria-label": "Remove tag",
            className: "hover:opacity-75 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
            children: "×"
          }
        ) : null
      ]
    }
  );
}
function vt({ title: e, icon: n, className: r }) {
  return /* @__PURE__ */ u("div", { className: m("flex items-center gap-2 w-full", r), children: [
    /* @__PURE__ */ t("h3", { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: e }),
    n ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0 text-muted", children: n }) : null
  ] });
}
function bn({ badges: e, className: n }) {
  return (
    // gap-4 matches Figma's "Frame 653" gap (16px, Cards01.md L614 / Cards00.md L657).
    /* @__PURE__ */ t("div", { className: m("flex flex-wrap items-center gap-4", n), children: e.map((r) => /* @__PURE__ */ u(
      "span",
      {
        className: "inline-flex items-center gap-1 text-body-m font-normal font-sans text-main",
        "aria-label": r.label,
        children: [
          r.count !== void 0 ? /* @__PURE__ */ t("span", { className: "tabular-nums", "aria-hidden": !0, children: r.count }) : null,
          /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", "aria-hidden": !0, children: r.icon })
        ]
      },
      r.label
    )) })
  );
}
function hn({
  title: e,
  points: n,
  dueDateText: r,
  dueDateUrgency: s = "normal",
  tags: l = [],
  assigneeName: o,
  assigneeAvatar: i,
  metaBadges: a = [],
  className: d,
  onClick: c
}) {
  return /* @__PURE__ */ u(
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
        d
      ),
      children: [
        /* @__PURE__ */ t(vt, { title: e }),
        n !== void 0 || r ? /* @__PURE__ */ u("div", { className: "flex items-center justify-between gap-2", children: [
          n !== void 0 ? (
            // Desktop/Body/M/bold: SF Pro Display, 15px/24px, weight 600, letter-spacing 0.75px
            // (tracking-wider, exact at this size). Was previously `text-sm font-bold` (14px/700).
            /* @__PURE__ */ u("span", { className: "text-body-m font-semibold text-main font-sans", children: [
              n,
              " Pts"
            ] })
          ) : null,
          r ? (
            // The due-date pill IS a real "Tag" instance per spec (padding 4px 16px, gap 8px,
            // radius 4px, alarm-line icon, Desktop/Body/M/bold) — reusing `Tag` directly instead
            // of a bespoke span gets typography/spacing/color right for free.
            /* @__PURE__ */ t(
              W,
              {
                variant: Jr[s],
                icon: /* @__PURE__ */ t(Qr, { className: "size-6" }),
                children: r
              }
            )
          ) : null
        ] }) : null,
        l.length > 0 ? /* @__PURE__ */ t("div", { className: "flex flex-wrap items-center gap-2", children: l.map((g, p) => /* @__PURE__ */ t(W, { variant: g.variant || "neutral", children: g.label }, p)) }) : null,
        /* @__PURE__ */ u("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ u("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ t(de, { src: i, name: o, size: "sm" }),
            o ? /* @__PURE__ */ t("span", { className: "font-sans text-xs font-medium text-muted truncate max-w-[120px]", children: o }) : null
          ] }),
          a.length > 0 ? /* @__PURE__ */ t(bn, { badges: a }) : null
        ] })
      ]
    }
  );
}
function E({ className: e }) {
  return /* @__PURE__ */ t("div", { "aria-hidden": !0, className: m("animate-pulse rounded-sm bg-neutral-3", e) });
}
function yt({
  title: e,
  description: n,
  icon: r,
  action: s,
  label: l = "No results",
  className: o
}) {
  return /* @__PURE__ */ u(
    "div",
    {
      role: "group",
      "aria-label": l,
      className: m(
        "flex flex-col items-center gap-2 rounded-sm border border-dashed border-subtle/20",
        "px-6 py-10 text-center font-sans",
        o
      ),
      children: [
        r ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-12 h-12 shrink-0 text-muted [&>svg]:w-full [&>svg]:h-full", children: r }) : null,
        /* @__PURE__ */ t("p", { className: "text-body-m font-semibold text-main", children: e }),
        n ? /* @__PURE__ */ t("p", { className: "text-body-m text-muted", children: n }) : null,
        s
      ]
    }
  );
}
function Pe() {
  return /* @__PURE__ */ u("div", { className: "flex flex-col gap-4 p-4 bg-surface-panel rounded-sm border border-transparent", children: [
    /* @__PURE__ */ t(E, { className: "h-6 w-3/4" }),
    /* @__PURE__ */ u("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t(E, { className: "h-6 w-16" }),
      /* @__PURE__ */ t(E, { className: "h-6 w-20 rounded" })
    ] }),
    /* @__PURE__ */ t("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ u("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ t(E, { className: "w-8 h-8 rounded-full" }),
      /* @__PURE__ */ t(E, { className: "h-3 w-20" })
    ] }) })
  ] });
}
function as({
  title: e,
  icon: n,
  tasks: r,
  isLoading: s = !1,
  emptyTitle: l = "No tasks in this view",
  emptyDescription: o,
  emptyAction: i,
  className: a
}) {
  return /* @__PURE__ */ u("div", { className: m("flex flex-col gap-4 w-full", a), children: [
    /* @__PURE__ */ t(vt, { title: e, icon: n }),
    s ? /* @__PURE__ */ u(et, { children: [
      /* @__PURE__ */ t(Pe, {}),
      /* @__PURE__ */ t(Pe, {}),
      /* @__PURE__ */ t(Pe, {})
    ] }) : r.length === 0 ? /* @__PURE__ */ t(yt, { title: l, description: o, action: i }) : r.map((d, c) => /* @__PURE__ */ t(hn, { ...d, className: "w-full" }, c))
  ] });
}
const O = {
  name: 500,
  tags: 168,
  estimation: 140,
  assignee: 168,
  dueDate: 132
}, gn = ({ className: e }) => /* @__PURE__ */ t(
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
), q = "text-body-m font-normal text-main font-sans", Z = "h-14 shrink-0 bg-surface-panel border-y border-r border-neutral-3";
function xn({ date: e, urgency: n = "normal" }) {
  return /* @__PURE__ */ t("span", { className: m(q, {
    normal: "text-main",
    soon: "text-tertiary-4",
    // text-primary-4 kept as a raw ramp class, not aliased to `text-interactive` — this is a
    // status/urgency signal, not an interactive affordance, so the "interactive" alias would
    // misrepresent its role even though it happens to share the same color value.
    overdue: "text-primary-4"
  }[n]), children: e });
}
function vn({ name: e, avatarSrc: n }) {
  return /* @__PURE__ */ u("div", { className: "flex items-center gap-2 min-w-0", children: [
    /* @__PURE__ */ t(de, { src: n, name: e, size: "sm" }),
    /* @__PURE__ */ t("span", { className: m(q, "truncate"), children: e })
  ] });
}
function yn({ points: e }) {
  return /* @__PURE__ */ u("span", { className: m(q, "tabular-nums"), children: [
    e,
    " ",
    e === 1 ? "Point" : "Points"
  ] });
}
function wn({ labels: e }) {
  return /* @__PURE__ */ t("div", { className: "flex flex-wrap items-center gap-2", children: e.map((n, r) => /* @__PURE__ */ t(W, { variant: n.variant ?? "neutral", children: n.label }, r)) });
}
const kn = {
  neutral: "bg-neutral-2",
  red: "bg-primary-4",
  green: "bg-secondary-4",
  yellow: "bg-tertiary-4",
  blue: "bg-blue"
};
function Cn({
  index: e,
  title: n,
  indicatorColor: r = "green",
  reactions: s = [],
  isSelected: l = !1,
  onSelectedChange: o,
  tags: i = [],
  estimationPoints: a,
  assigneeName: d,
  assigneeAvatar: c,
  dueDate: g,
  dueDateUrgency: p = "normal",
  onClick: k,
  onViewDetails: v
}) {
  return /* @__PURE__ */ u("tr", { onClick: k, className: m("group", k && "cursor-pointer"), children: [
    /* @__PURE__ */ t("td", { className: m(Z, "pl-0 pr-4 border-l"), style: { width: O.name }, children: /* @__PURE__ */ u("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ t("span", { className: m("w-1 h-full shrink-0", kn[r]) }),
      /* @__PURE__ */ u("label", { className: "w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer rounded-xs has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-4 has-[:focus-visible]:outline-offset-1", children: [
        /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            className: "sr-only",
            checked: l,
            onChange: (C) => o == null ? void 0 : o(C.target.checked),
            "aria-label": `Select ${n}`
          }
        ),
        /* @__PURE__ */ t(
          gn,
          {
            className: m(
              "w-6 h-6 text-main transition-opacity",
              l ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
            )
          }
        )
      ] }),
      /* @__PURE__ */ t("span", { className: m(q, "shrink-0 tabular-nums"), children: String(e).padStart(2, "0") }),
      /* @__PURE__ */ t("span", { className: m(q, "flex-1 min-w-0 truncate"), children: n }),
      s.map((C) => /* @__PURE__ */ u(
        "span",
        {
          className: m(q, "inline-flex items-center gap-1 shrink-0"),
          children: [
            /* @__PURE__ */ t("span", { className: "tabular-nums", children: C.count }),
            /* @__PURE__ */ t("span", { children: C.emoji })
          ]
        },
        C.emoji
      )),
      v ? /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          onClick: v,
          className: m(
            q,
            "inline-flex items-center gap-1 shrink-0 hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs"
          ),
          children: [
            /* @__PURE__ */ t("span", { children: "Details" }),
            /* @__PURE__ */ t(xt, { className: "w-4 h-4" })
          ]
        }
      ) : null
    ] }) }),
    /* @__PURE__ */ t("td", { className: m(Z, "pl-2 pr-4"), style: { width: O.tags }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: i.length > 0 ? /* @__PURE__ */ t(wn, { labels: i }) : null }) }),
    /* @__PURE__ */ t("td", { className: m(Z, "pl-2 pr-4"), style: { width: O.estimation }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: a !== void 0 ? /* @__PURE__ */ t(yn, { points: a }) : null }) }),
    /* @__PURE__ */ t("td", { className: m(Z, "pl-2 pr-4"), style: { width: O.assignee }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: d ? /* @__PURE__ */ t(vn, { name: d, avatarSrc: c }) : null }) }),
    /* @__PURE__ */ t("td", { className: m(Z, "pl-2 pr-4"), style: { width: O.dueDate }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: g ? /* @__PURE__ */ t(xn, { date: g, urgency: p }) : null }) })
  ] });
}
function Nn() {
  return /* @__PURE__ */ u("tr", { children: [
    /* @__PURE__ */ t("td", { className: m(Z, "pl-4 pr-4 border-l"), style: { width: O.name }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(E, { className: "h-4 w-full" }) }) }),
    /* @__PURE__ */ t("td", { className: m(Z, "pl-4 pr-4"), style: { width: O.tags }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(E, { className: "h-6 w-16 rounded" }) }) }),
    /* @__PURE__ */ t("td", { className: m(Z, "pl-4 pr-4"), style: { width: O.estimation }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(E, { className: "h-4 w-16" }) }) }),
    /* @__PURE__ */ t("td", { className: m(Z, "pl-4 pr-4"), style: { width: O.assignee }, children: /* @__PURE__ */ u("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ t(E, { className: "w-8 h-8 rounded-full shrink-0" }),
      /* @__PURE__ */ t(E, { className: "h-4 w-20" })
    ] }) }),
    /* @__PURE__ */ t("td", { className: m(Z, "pl-4 pr-4"), style: { width: O.dueDate }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(E, { className: "h-4 w-20" }) }) })
  ] });
}
const ae = [
  { key: "name", label: "# Task Name" },
  { key: "tags", label: "Task Tags" },
  { key: "estimation", label: "Estimate" },
  { key: "assignee", label: "Task Assign Name" },
  { key: "dueDate", label: "Due Date" }
];
function cs({
  groups: e,
  isLoading: n = !1,
  emptyTitle: r = "No tasks yet",
  emptyDescription: s,
  emptyAction: l,
  className: o
}) {
  return /* @__PURE__ */ t(
    "div",
    {
      className: m(
        "w-full overflow-x-auto",
        "[scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-3 [&::-webkit-scrollbar-thumb]:rounded-full",
        o
      ),
      children: /* @__PURE__ */ u("div", { className: "flex flex-col gap-4 min-w-[1108px]", children: [
        /* @__PURE__ */ t("div", { className: "flex", children: ae.map(({ key: i, label: a }, d) => /* @__PURE__ */ t(
          "div",
          {
            className: m(
              Z,
              "px-4",
              d === 0 && "border-l rounded-l-4",
              d === ae.length - 1 && "rounded-r-4"
            ),
            style: { width: O[i] },
            children: /* @__PURE__ */ t("span", { className: q, children: a })
          },
          i
        )) }),
        n ? /* @__PURE__ */ u("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ t("colgroup", { children: ae.map(({ key: i }) => /* @__PURE__ */ t("col", { style: { width: O[i] } }, i)) }),
          /* @__PURE__ */ t("tbody", { children: Array.from({ length: 5 }).map((i, a) => /* @__PURE__ */ t(Nn, {}, a)) })
        ] }) : e.length === 0 ? /* @__PURE__ */ t(yt, { title: r, description: s, action: l }) : e.map((i, a) => /* @__PURE__ */ u("table", { className: "border-collapse table-fixed", children: [
          /* @__PURE__ */ t("colgroup", { children: ae.map(({ key: d }) => /* @__PURE__ */ t("col", { style: { width: O[d] } }, d)) }),
          /* @__PURE__ */ u("tbody", { children: [
            /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ t("td", { colSpan: ae.length, className: "p-0 border border-neutral-3", children: /* @__PURE__ */ u("div", { className: "flex items-center gap-2 h-14 px-4 bg-surface-panel rounded-t-4", children: [
              /* @__PURE__ */ t(De, { className: "w-6 h-6 shrink-0 text-muted" }),
              /* @__PURE__ */ t("h3", { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: i.title }),
              i.actions
            ] }) }) }),
            i.rows.map((d, c) => /* @__PURE__ */ t(Cn, { ...d }, c))
          ] })
        ] }, a))
      ] })
    }
  );
}
function ye({
  isOpen: e,
  onClose: n,
  triggerRef: r,
  role: s = "dialog",
  children: l,
  className: o,
  ...i
}) {
  const a = M(null), { overlayProps: d } = St(
    {
      isOpen: e,
      onClose: n,
      isDismissable: !0,
      shouldCloseOnInteractOutside: (c) => {
        var g;
        return !((g = r == null ? void 0 : r.current) != null && g.contains(c));
      }
    },
    a
  );
  return e ? (
    // eslint-disable-next-line jsx-a11y/no-autofocus
    /* @__PURE__ */ t(ze, { restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ u("div", { ...d, ...i, ref: a, role: s, className: o, children: [
      /* @__PURE__ */ t(ge, { onDismiss: n }),
      l,
      /* @__PURE__ */ t(ge, { onDismiss: n })
    ] }) })
  ) : null;
}
function Oe({
  state: e,
  children: n,
  popoverRef: r,
  className: s,
  ...l
}) {
  const o = M(null), i = r ?? o, { popoverProps: a, underlayProps: d } = Vt({ ...l, popoverRef: i }, e);
  return /* @__PURE__ */ u(It, { children: [
    /* @__PURE__ */ t("div", { ...d, className: "fixed inset-0" }),
    /* @__PURE__ */ t(ze, { restoreFocus: !0, children: /* @__PURE__ */ u(
      "div",
      {
        ...a,
        ref: i,
        onKeyDownCapture: (c) => {
          c.key === "Escape" && (c.stopPropagation(), e.close());
        },
        className: m(
          "z-popover bg-surface-overlay rounded-sm border border-subtle shadow-xl",
          s
        ),
        children: [
          /* @__PURE__ */ t(ge, { onDismiss: () => e.close() }),
          n,
          /* @__PURE__ */ t(ge, { onDismiss: () => e.close() })
        ]
      }
    ) })
  ] });
}
function wt({
  state: e,
  listBoxRef: n,
  className: r,
  ...s
}) {
  const l = M(null), o = n ?? l, { listBoxProps: i } = Tt(s, e, o);
  return /* @__PURE__ */ t(
    "ul",
    {
      ...i,
      ref: o,
      className: m("max-h-64 min-w-40 overflow-auto py-2 outline-none", r),
      children: [...e.collection].map((a) => /* @__PURE__ */ t(Mn, { item: a, state: e }, a.key))
    }
  );
}
function Mn({ item: e, state: n }) {
  const r = M(null), { optionProps: s, isSelected: l, isFocused: o, isDisabled: i } = zt(
    { key: e.key },
    n,
    r
  );
  return /* @__PURE__ */ u(
    "li",
    {
      ...s,
      ref: r,
      className: m(
        "flex items-center justify-between gap-4 px-4 py-1.5 text-body-m font-sans cursor-pointer outline-none",
        // Focus and selection are independent states with independent
        // styling — merging them would leave a keyboard user with no way
        // to tell which option their arrow keys are actually on.
        o && "bg-neutral-4",
        l ? "text-interactive font-semibold" : "text-main",
        i && "cursor-not-allowed opacity-50"
      ),
      children: [
        /* @__PURE__ */ t("span", { children: e.rendered }),
        l ? /* @__PURE__ */ t("span", { "aria-hidden": "true", children: "✓" }) : null
      ]
    }
  );
}
function ds({
  placeholder: e,
  icon: n,
  error: r,
  description: s,
  className: l,
  ...o
}) {
  const i = Kt(o), a = M(null), { labelProps: d, triggerProps: c, valueProps: g, menuProps: p, descriptionProps: k, errorMessageProps: v } = Ht(
    { ...o, description: s, errorMessage: r, isInvalid: !!r },
    i,
    a
  ), { buttonProps: C } = X(c, a);
  return /* @__PURE__ */ u("div", { className: m("inline-flex flex-col gap-1.5", l), children: [
    o.label ? /* @__PURE__ */ u("span", { ...d, className: ve, children: [
      o.label,
      o.isRequired ? /* @__PURE__ */ t(ce, {}) : null
    ] }) : null,
    /* @__PURE__ */ t(Rt, { state: i, triggerRef: a, label: o.label, name: o.name }),
    /* @__PURE__ */ u(
      "button",
      {
        ...C,
        ref: a,
        type: "button",
        className: m(
          // `bg-surface-neutral` is a light (near-white) surface, matching
          // `Input`'s value/placeholder colors (`text-neutral-5`/`text-muted`)
          // rather than `text-main`/`text-muted`, which assume a dark shell
          // background and would render invisible white-on-white here once
          // something is selected.
          "inline-flex items-center gap-2 h-10 px-3 py-2 rounded-md bg-surface-neutral border border-subtle text-body-m font-sans whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          i.selectedItem ? "text-neutral-5" : "text-muted",
          r && "border-danger-5 focus-visible:outline-danger-5"
        ),
        children: [
          n,
          /* @__PURE__ */ t("span", { ...g, className: "flex-1 text-left truncate", children: i.selectedItem ? i.selectedItem.rendered : e }),
          /* @__PURE__ */ t(De, { className: "w-3 h-3 shrink-0" })
        ]
      }
    ),
    /* @__PURE__ */ t(
      se,
      {
        description: s,
        error: r,
        descriptionProps: k,
        errorMessageProps: v
      }
    ),
    i.isOpen ? /* @__PURE__ */ t(Oe, { state: i, triggerRef: a, placement: "bottom start", children: /* @__PURE__ */ t(wt, { ...p, state: i }) }) : null
  ] });
}
function us({
  label: e,
  placeholder: n,
  icon: r,
  isDisabled: s,
  error: l,
  description: o,
  className: i,
  ...a
}) {
  const d = He({}), c = M(null), g = Yt({
    ...a,
    selectionMode: "multiple",
    // Explicit, not the default: a plain click on an item should add it to
    // the selection, not replace it — the behavior a set of checkable tags
    // needs, unlike a file browser's click-to-replace/Ctrl-click-to-add.
    selectionBehavior: "toggle"
  }), { fieldProps: p, descriptionProps: k, errorMessageProps: v } = Ie({
    label: e,
    description: o,
    errorMessage: l,
    isInvalid: !!l
  }), { buttonProps: C } = X(
    { onPress: () => d.toggle(), isDisabled: s, "aria-label": e },
    c
  ), w = [...g.collection].filter(
    (N) => g.selectionManager.isSelected(N.key)
  );
  return /* @__PURE__ */ u("div", { className: m("inline-flex flex-col gap-1.5", i), children: [
    /* @__PURE__ */ u(
      "button",
      {
        ...C,
        ref: c,
        type: "button",
        "aria-haspopup": "listbox",
        "aria-expanded": d.isOpen,
        "aria-describedby": p["aria-describedby"],
        className: m(
          // See Select's identical note: `bg-surface-neutral` is a light
          // surface, so the placeholder/value text needs `Input`'s
          // light-surface colors (`text-muted`/`text-neutral-5`), not
          // `text-main` (invisible white-on-white once something's picked).
          "inline-flex items-center gap-2 min-h-10 px-3 py-1.5 rounded-md bg-surface-neutral border border-subtle text-body-m font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          w.length > 0 ? "text-neutral-5" : "text-muted",
          l && "border-danger-5 focus-visible:outline-danger-5"
        ),
        children: [
          r,
          w.length > 0 ? /* @__PURE__ */ t("span", { className: "flex flex-wrap items-center gap-1", children: w.map((N) => /* @__PURE__ */ t(W, { variant: "red", children: N.rendered }, N.key)) }) : /* @__PURE__ */ t("span", { children: n }),
          /* @__PURE__ */ t(De, { className: "w-3 h-3 shrink-0" })
        ]
      }
    ),
    /* @__PURE__ */ t(
      se,
      {
        description: o,
        error: l,
        descriptionProps: k,
        errorMessageProps: v
      }
    ),
    d.isOpen ? /* @__PURE__ */ t(Oe, { state: d, triggerRef: c, placement: "bottom start", children: /* @__PURE__ */ t(wt, { "aria-label": e, state: g, autoFocus: !0 }) }) : null
  ] });
}
function ms({
  label: e,
  triggerContent: n,
  isDisabled: r,
  triggerClassName: s,
  ...l
}) {
  const o = qt({}), i = M(null), { menuTriggerProps: a, menuProps: d } = At(
    { isDisabled: r },
    o,
    i
  ), { buttonProps: c } = X(
    { ...a, isDisabled: r, "aria-label": e },
    i
  );
  return /* @__PURE__ */ u(et, { children: [
    /* @__PURE__ */ t(
      "button",
      {
        ...c,
        ref: i,
        type: "button",
        className: m(
          "cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          s
        ),
        children: n
      }
    ),
    o.isOpen ? /* @__PURE__ */ t(Oe, { state: o, triggerRef: i, placement: "bottom end", children: /* @__PURE__ */ t(
      Pn,
      {
        ...d,
        ...l,
        autoFocus: l.autoFocus ?? o.focusStrategy ?? !0,
        onClose: () => o.close()
      }
    ) }) : null
  ] });
}
function Pn({ children: e, onAction: n, onClose: r, ...s }) {
  const l = Xt({ ...s, children: e, selectionMode: "none" }), o = M(null), { menuProps: i } = Dt({ ...s, onAction: n, onClose: r }, l, o);
  return /* @__PURE__ */ t("ul", { ...i, ref: o, className: "max-h-64 min-w-40 overflow-auto py-2 outline-none", children: [...l.collection].map((a) => /* @__PURE__ */ t(Ln, { item: a, state: l, onClose: r }, a.key)) });
}
function Ln({ item: e, state: n, onClose: r }) {
  const s = M(null), { menuItemProps: l, isFocused: o, isDisabled: i } = jt(
    { key: e.key, onClose: r },
    n,
    s
  );
  return /* @__PURE__ */ t(
    "li",
    {
      ...l,
      ref: s,
      className: m(
        "text-body-m font-sans cursor-pointer px-4 py-1.5 outline-none text-main",
        o && "bg-neutral-4",
        i && "cursor-not-allowed opacity-50"
      ),
      children: e.rendered
    }
  );
}
function fs({
  title: e,
  isOpen: n,
  onClose: r,
  children: s,
  width: l = "max-w-md",
  role: o = "dialog"
}) {
  const i = M(null), a = M(null), d = He({
    isOpen: n,
    onOpenChange: (v) => {
      v || r();
    }
  }), { modalProps: c, underlayProps: g } = Ot(
    { isDismissable: !0 },
    d,
    i
  ), { dialogProps: p, titleProps: k } = Bt({ role: o }, a);
  return n ? /* @__PURE__ */ t(
    "div",
    {
      ...g,
      className: "fixed inset-0 z-overlay flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      children: /* @__PURE__ */ t(ze, { contain: !0, restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ t("div", { ...c, ref: i, className: m("w-full", l), children: /* @__PURE__ */ u(
        "div",
        {
          ...p,
          ref: a,
          className: "flex flex-col bg-surface-overlay rounded-sm border border-subtle overflow-hidden",
          children: [
            /* @__PURE__ */ u("div", { className: "flex items-center justify-between px-4 py-4 border-b border-neutral-4", children: [
              /* @__PURE__ */ t("h2", { ...k, className: "font-sans font-bold text-base text-main", children: e }),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: r,
                  "aria-label": "Close modal",
                  className: "flex items-center justify-center w-8 h-8 rounded-md text-muted hover:bg-neutral-4 hover:text-main transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                  children: /* @__PURE__ */ t(je, { className: "w-4 h-4" })
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
function ps(e = !1) {
  const n = He({ defaultOpen: e });
  return {
    isOpen: n.isOpen,
    open: n.open,
    close: n.close,
    toggle: n.toggle
  };
}
function Qe(e) {
  return new rr(e.getFullYear(), e.getMonth() + 1, e.getDate());
}
function Sn(e) {
  return e.toDate(Le());
}
function Vn({
  value: e,
  defaultValue: n,
  onChange: r,
  onClose: s,
  triggerRef: l,
  className: o
}) {
  const i = e !== void 0 ? { value: Qe(e) } : { defaultValue: n ? Qe(n) : null }, a = Jt({
    ...i,
    onChange: (N) => r == null ? void 0 : r(Sn(N)),
    createCalendar: tr,
    // Hardcoded, matching the prior implementation's hardcoded English
    // MONTHS/DAYS arrays — no `I18nProvider`/locale story exists in this kit
    // yet, so introducing locale-dependent formatting here would be an
    // unverified behavior change, not a fix.
    locale: "en-US",
    firstDayOfWeek: "sun",
    weeksInMonth: 6
  }), { calendarProps: d, prevButtonProps: c, nextButtonProps: g } = Et(
    { "aria-label": "Date picker" },
    a
  ), p = M(null), k = M(null), { buttonProps: v } = X(c, p), { buttonProps: C } = X(g, k), w = () => {
    const N = nr(Le());
    a.setFocusedDate(N), a.selectDate(N);
  };
  return /* @__PURE__ */ u(
    ye,
    {
      isOpen: !0,
      onClose: s,
      triggerRef: l,
      "aria-label": "Date picker",
      className: m(
        "flex flex-col w-[280px] bg-surface-shell border border-subtle rounded-4 shadow-elevation select-none",
        o
      ),
      children: [
        /* @__PURE__ */ u("div", { ...d, className: "flex flex-col", children: [
          /* @__PURE__ */ u("div", { className: "flex items-center justify-between px-2 py-[9px] h-10", children: [
            /* @__PURE__ */ u("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: () => a.focusPreviousSection(!0),
                  "aria-label": "Previous year",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ t(ln, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  ...v,
                  ref: p,
                  "aria-label": "Previous month",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ t(on, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ t("span", { className: "font-sans font-semibold text-body-sm text-main", children: a.visibleRange.start.toDate(Le()).toLocaleDateString("en-US", { month: "long", year: "numeric" }) }),
            /* @__PURE__ */ u("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ t(
                "button",
                {
                  ...C,
                  ref: k,
                  "aria-label": "Next month",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs disabled:pointer-events-none disabled:opacity-50",
                  children: /* @__PURE__ */ t(xt, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ t(
                "button",
                {
                  type: "button",
                  onClick: () => a.focusNextSection(!0),
                  "aria-label": "Next year",
                  className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                  children: /* @__PURE__ */ t(an, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ t("div", { className: "h-px w-full bg-neutral-2" }),
          /* @__PURE__ */ t(In, { state: a })
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
function In({ state: e }) {
  const { gridProps: n, headerProps: r, weekDays: s, weeksInMonth: l } = Zt(
    { weekdayStyle: "short" },
    e
  ), o = e.visibleRange.start;
  return /* @__PURE__ */ u("div", { ...n, className: "flex flex-col px-3 py-2", children: [
    /* @__PURE__ */ t("div", { ...r, className: "grid grid-cols-7", children: s.map((i, a) => /* @__PURE__ */ t("span", { className: "text-center text-body-sm font-normal text-main font-sans", children: i }, a)) }),
    Array.from({ length: l }, (i, a) => /* @__PURE__ */ t("div", { role: "row", className: "grid grid-cols-7", children: e.getDatesInWeek(a).map(
      (d, c) => d ? /* @__PURE__ */ t(
        Tn,
        {
          state: e,
          date: d,
          currentMonth: o
        },
        d.toString()
      ) : /* @__PURE__ */ t("div", { role: "gridcell", "aria-hidden": "true" }, c)
    ) }, a))
  ] });
}
function Tn({
  state: e,
  date: n,
  currentMonth: r
}) {
  const s = M(null), l = !sr(n, r), { cellProps: o, buttonProps: i, isSelected: a, isDisabled: d, formattedDate: c } = Ft(
    { date: n, isOutsideMonth: l },
    e,
    s
  );
  return /* @__PURE__ */ t("div", { ...o, className: "flex items-center justify-center my-[3px]", children: /* @__PURE__ */ t(
    "div",
    {
      ...i,
      ref: s,
      className: m(
        "flex items-center justify-center w-6 h-6 rounded-2 text-body-sm font-normal font-sans transition-colors focus-visible:outline-2 focus-visible:outline-primary-4",
        d ? "text-muted cursor-default" : a ? "border border-primary-4 text-main cursor-pointer" : "text-main hover:bg-neutral-3 cursor-pointer"
      ),
      children: c
    }
  ) });
}
const zn = [1, 2, 3, 5, 8];
function Hn({
  value: e,
  onSelect: n,
  onClose: r,
  triggerRef: s,
  className: l
}) {
  return /* @__PURE__ */ u(
    ye,
    {
      isOpen: !0,
      onClose: r,
      triggerRef: s,
      "aria-label": "Estimate",
      className: m(
        "flex flex-col w-[122px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        l
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans whitespace-nowrap", children: "Estimate" }) }),
        zn.map((o) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            onClick: () => n(o),
            "aria-pressed": e === o,
            className: m(
              "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
              e === o ? "bg-neutral-2" : "hover:bg-neutral-2"
            ),
            children: [
              /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ t(Ve, { className: "size-6" }) }),
              /* @__PURE__ */ u("span", { className: "whitespace-nowrap", children: [
                o,
                " Point",
                o !== 1 ? "s" : ""
              ] })
            ]
          },
          o
        ))
      ]
    }
  );
}
function Rn({
  name: e,
  role: n,
  avatarSrc: r,
  size: s = "md",
  isOnline: l = !1,
  className: o,
  onClick: i
}) {
  const a = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm"
  };
  return /* @__PURE__ */ u(
    i ? "button" : "div",
    {
      type: i ? "button" : void 0,
      onClick: i,
      className: m(
        // padding: 4px 16px, gap: 8px -- matches Figma "User" component (Avatar frame, 239x56)
        "flex items-center gap-2 px-4 py-1 min-w-0",
        i && "cursor-pointer hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-sm",
        o
      ),
      children: [
        /* @__PURE__ */ u("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ t(de, { src: r, name: e, size: s }),
          l ? /* @__PURE__ */ t("span", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary-4 border-2 border-neutral-5" }) : null
        ] }),
        /* @__PURE__ */ u("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ t("span", { className: "font-sans font-normal text-body-m text-main truncate", children: e }),
          n ? /* @__PURE__ */ t("span", { className: m("font-sans text-muted truncate leading-tight", a[s]), children: n }) : null
        ] })
      ]
    }
  );
}
function An({
  assignees: e,
  onSelect: n,
  onClose: r,
  triggerRef: s,
  className: l
}) {
  return /* @__PURE__ */ u(
    ye,
    {
      isOpen: !0,
      onClose: r,
      triggerRef: s,
      "aria-label": "Assignee",
      className: m(
        "flex flex-col w-[239px] pt-2 bg-surface-overlay border border-subtle rounded-sm",
        l
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans truncate", children: "Assignee" }) }),
        e.map((o) => /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: () => n(o),
            className: "flex items-center w-full h-14 hover:bg-neutral-2/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
            children: /* @__PURE__ */ t(Rn, { name: o.name, role: o.role, avatarSrc: o.avatarSrc, size: "sm" })
          },
          o.id
        ))
      ]
    }
  );
}
function Dn({ labels: e, onSelect: n, onClose: r, triggerRef: s, className: l }) {
  return /* @__PURE__ */ u(
    ye,
    {
      isOpen: !0,
      onClose: r,
      triggerRef: s,
      "aria-label": "Label",
      className: m(
        "flex flex-col w-[160px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        l
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans truncate", children: "Label" }) }),
        e.map((o) => /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: () => n(o),
            className: "flex items-center w-full px-4 py-1.5 hover:bg-neutral-2/10 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
            children: /* @__PURE__ */ t(W, { variant: o.variant ?? "neutral", children: o.text })
          },
          o.id
        ))
      ]
    }
  );
}
function bs({
  isOpen: e,
  onClose: n,
  assignees: r = [],
  labels: s = [],
  onSubmit: l,
  initialTitle: o = "",
  initialDueDate: i,
  initialPoints: a,
  initialAssignee: d,
  initialLabel: c,
  className: g
}) {
  const [p, k] = B.useState(o), [v, C] = B.useState(i), [w, N] = B.useState(a), [S, I] = B.useState(d), [F, _] = B.useState(c), [T, j] = B.useState(null), H = (P) => j((U) => U === P ? null : P), h = () => j(null), R = B.useRef(null), re = B.useRef(null), ne = B.useRef(null), Q = B.useRef(null);
  if (!e) return null;
  const oe = () => {
    k(""), C(void 0), N(void 0), I(void 0), _(void 0), j(null);
  }, le = (P) => {
    P.preventDefault(), p.trim() && (l == null || l({ title: p.trim(), dueDate: v, points: w, assignee: S, label: F }), oe(), n());
  }, K = () => {
    oe(), n();
  };
  return /* @__PURE__ */ u(
    "form",
    {
      onSubmit: le,
      className: m(
        "flex flex-col items-end gap-6 w-[578px] p-4 bg-surface-overlay rounded-sm",
        g
      ),
      children: [
        /* @__PURE__ */ t(
          "input",
          {
            autoFocus: !0,
            value: p,
            onChange: (P) => k(P.target.value),
            placeholder: "Task name",
            "aria-label": "Task name",
            className: "w-full bg-transparent text-body-xl font-semibold text-main placeholder:text-muted font-sans rounded-xs focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2"
          }
        ),
        /* @__PURE__ */ u("div", { className: "flex items-center gap-4 w-full", children: [
          /* @__PURE__ */ u("div", { className: "relative", children: [
            w === void 0 ? /* @__PURE__ */ t(
              "button",
              {
                ref: R,
                type: "button",
                onClick: () => H("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": T === "estimate",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(W, { icon: /* @__PURE__ */ t(Ve, { className: "size-6" }), children: "Estimate" })
              }
            ) : /* @__PURE__ */ u(
              "button",
              {
                ref: R,
                type: "button",
                onClick: () => H("estimate"),
                "aria-haspopup": "dialog",
                "aria-expanded": T === "estimate",
                className: "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ t(Ve, { className: "size-6" }) }),
                  w,
                  " Point",
                  w !== 1 ? "s" : ""
                ]
              }
            ),
            T === "estimate" ? /* @__PURE__ */ t(
              Hn,
              {
                value: w,
                onSelect: (P) => {
                  N(P), j(null);
                },
                onClose: h,
                triggerRef: R,
                className: "absolute top-full left-0 mt-1 z-nested"
              }
            ) : null
          ] }),
          /* @__PURE__ */ u("div", { className: "relative", children: [
            S ? /* @__PURE__ */ u(
              "button",
              {
                ref: re,
                type: "button",
                onClick: () => H("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": T === "assignee",
                className: "flex items-center gap-2 h-8 px-2 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ t(de, { src: S.avatarSrc, name: S.name, size: "sm" }),
                  S.name
                ]
              }
            ) : /* @__PURE__ */ t(
              "button",
              {
                ref: re,
                type: "button",
                onClick: () => H("assignee"),
                "aria-haspopup": "dialog",
                "aria-expanded": T === "assignee",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(W, { icon: /* @__PURE__ */ t(rn, { className: "size-6" }), children: "Assignee" })
              }
            ),
            T === "assignee" ? /* @__PURE__ */ t(
              An,
              {
                assignees: r,
                onSelect: (P) => {
                  I(P), j(null);
                },
                onClose: h,
                triggerRef: re,
                className: "absolute top-full left-0 mt-1 z-nested"
              }
            ) : null
          ] }),
          /* @__PURE__ */ u("div", { className: "relative", children: [
            F ? /* @__PURE__ */ t(
              "button",
              {
                ref: ne,
                type: "button",
                onClick: () => H("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": T === "label",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(W, { variant: F.variant ?? "neutral", children: F.text })
              }
            ) : /* @__PURE__ */ t(
              "button",
              {
                ref: ne,
                type: "button",
                onClick: () => H("label"),
                "aria-haspopup": "dialog",
                "aria-expanded": T === "label",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(W, { icon: /* @__PURE__ */ t(nn, { className: "size-6" }), children: "Label" })
              }
            ),
            T === "label" ? /* @__PURE__ */ t(
              Dn,
              {
                labels: s,
                onSelect: (P) => {
                  _(P), j(null);
                },
                onClose: h,
                triggerRef: ne,
                className: "absolute top-full left-0 mt-1 z-nested"
              }
            ) : null
          ] }),
          /* @__PURE__ */ u("div", { className: "relative", children: [
            /* @__PURE__ */ t(
              "button",
              {
                ref: Q,
                type: "button",
                onClick: () => H("date"),
                "aria-haspopup": "dialog",
                "aria-expanded": T === "date",
                className: "cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(W, { icon: /* @__PURE__ */ t(sn, { className: "size-6" }), children: v ? v.toLocaleDateString("en-US") : "Due date" })
              }
            ),
            T === "date" ? /* @__PURE__ */ t(
              Vn,
              {
                value: v,
                onChange: (P) => {
                  C(P), j(null);
                },
                onClose: h,
                triggerRef: Q,
                className: "absolute top-full left-0 mt-1 z-nested"
              }
            ) : null
          ] })
        ] }),
        /* @__PURE__ */ u("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ t(Je, { variant: "secondary", onPress: K, children: "Cancel" }),
          /* @__PURE__ */ t(Je, { variant: "primary", type: "submit", isDisabled: !p.trim(), children: "Create Task" })
        ] })
      ]
    }
  );
}
function hs({ variant: e = "neutral", children: n, className: r }) {
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
        r
      ),
      children: n
    }
  );
}
const kt = Nt(null);
function gs() {
  const e = Ct(kt);
  if (!e)
    throw new Error("useToast must be used within a ToastProvider");
  return e;
}
const jn = 5e3, On = {
  neutral: "bg-surface-overlay text-main border border-subtle/10",
  success: "bg-success-4 text-neutral-5",
  warning: "bg-warning-5 text-neutral-5",
  danger: "bg-danger text-main"
};
function Bn({
  toast: e,
  state: n,
  closeLabel: r
}) {
  const s = M(null), l = M(null), { toastProps: o, contentProps: i, titleProps: a, closeButtonProps: d } = Wt(
    { toast: e },
    n,
    s
  ), { buttonProps: c } = X(d, l);
  return /* @__PURE__ */ u(
    "div",
    {
      ...o,
      ref: s,
      className: m(
        "pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-sm shadow-elevation",
        "text-body-m font-semibold font-sans",
        On[e.content.tone]
      ),
      children: [
        /* @__PURE__ */ t("div", { ...i, children: /* @__PURE__ */ t("span", { ...a, children: e.content.message }) }),
        /* @__PURE__ */ t(
          "button",
          {
            ...c,
            ref: l,
            "aria-label": r,
            className: "shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer rounded-xs focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2",
            children: /* @__PURE__ */ t(je, { className: "size-4" })
          }
        )
      ]
    }
  );
}
function En({
  state: e,
  label: n,
  closeLabel: r
}) {
  const s = M(null), { regionProps: l } = Gt({ "aria-label": n }, e, s);
  return or(
    /* @__PURE__ */ t(
      "div",
      {
        ...l,
        ref: s,
        className: "pointer-events-none fixed right-4 bottom-4 z-toast flex flex-col gap-2",
        children: e.visibleToasts.map((o) => /* @__PURE__ */ t(Bn, { toast: o, state: e, closeLabel: r }, o.key))
      }
    ),
    document.body
  );
}
function xs({
  children: e,
  duration: n = jn,
  maxVisibleToasts: r = 4,
  label: s = "Notifications",
  closeLabel: l = "Dismiss"
}) {
  const o = Qt({ maxVisibleToasts: r }), i = M(o);
  We(() => {
    i.current = o;
  }, [o]);
  const a = M(n);
  We(() => {
    a.current = n;
  }, [n]);
  const d = rt(
    () => ({
      show: (c, g, p) => i.current.add(
        { tone: c, message: g },
        // `undefined` in `options.timeout` means "not specified, use the default";
        // an explicit `null` means "stay until dismissed", which react-stately
        // expresses as a timeout of 0.
        {
          timeout: (p == null ? void 0 : p.timeout) === null ? 0 : (p == null ? void 0 : p.timeout) ?? a.current
        }
      )
    }),
    []
  );
  return /* @__PURE__ */ u(kt.Provider, { value: d, children: [
    e,
    o.visibleToasts.length > 0 ? /* @__PURE__ */ t(En, { state: o, label: s, closeLabel: l }) : null
  ] });
}
function vs({
  children: e,
  isSelected: n,
  defaultSelected: r = !1,
  onChange: s,
  isDisabled: l = !1,
  isIndeterminate: o = !1,
  error: i,
  description: a,
  isRequired: d = !1,
  className: c
}) {
  const g = er({
    isSelected: n,
    defaultSelected: r,
    onChange: s
  }), p = M(null), { fieldProps: k, descriptionProps: v, errorMessageProps: C } = Ie({
    description: a,
    errorMessage: i,
    isInvalid: !!i
  }), { inputProps: w, labelProps: N } = _t(
    {
      isSelected: g.isSelected,
      isIndeterminate: o,
      isDisabled: l,
      isRequired: d,
      isInvalid: !!i,
      "aria-label": typeof e == "string" ? e : "Checkbox"
    },
    g,
    p
  ), S = /* @__PURE__ */ u(
    "label",
    {
      ...N,
      className: m(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Label Checkbox" component exactly
        // (Property 1=Default/Selected, Tags01.md / Add Task Modal04/05.md).
        "inline-flex items-center gap-2 px-4 py-1 rounded cursor-pointer select-none group has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-4 has-[:focus-visible]:outline-offset-2",
        l && "opacity-50 cursor-not-allowed",
        c
      ),
      children: [
        /* @__PURE__ */ t(
          "input",
          {
            ...w,
            ref: p,
            "aria-describedby": k["aria-describedby"],
            className: "sr-only"
          }
        ),
        /* @__PURE__ */ u(
          "svg",
          {
            className: m("w-6 h-6 shrink-0", i ? "text-danger" : "text-main"),
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.5,
            "aria-hidden": !0,
            children: [
              /* @__PURE__ */ t("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3" }),
              g.isSelected && !o ? /* @__PURE__ */ t(
                "path",
                {
                  d: "M8 12.5 11 15.5 16 9.5",
                  strokeWidth: 2,
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }
              ) : o ? /* @__PURE__ */ t("path", { d: "M8 12h8", strokeWidth: 2, strokeLinecap: "round" }) : null
            ]
          }
        ),
        /* @__PURE__ */ u("span", { className: "text-body-m font-normal font-sans text-main", children: [
          e,
          d ? /* @__PURE__ */ t(ce, {}) : null
        ] })
      ]
    }
  );
  return !i && !a ? S : /* @__PURE__ */ u("div", { className: "inline-flex flex-col gap-1", children: [
    S,
    /* @__PURE__ */ t("span", { className: "px-4", children: /* @__PURE__ */ t(
      se,
      {
        description: a,
        error: i,
        descriptionProps: v,
        errorMessageProps: C
      }
    ) })
  ] });
}
function ys({ label: e, error: n, description: r, className: s, ...l }) {
  const o = M(null), { labelProps: i, inputProps: a, descriptionProps: d, errorMessageProps: c } = Te(
    { ...l, label: e, description: r, type: "date", isInvalid: !!n, errorMessage: n },
    o
  );
  return /* @__PURE__ */ u("div", { className: "flex flex-col gap-1.5 w-full", children: [
    e ? /* @__PURE__ */ u("label", { ...i, className: ve, children: [
      e,
      l.isRequired ? /* @__PURE__ */ t(ce, {}) : null
    ] }) : null,
    /* @__PURE__ */ t(
      "input",
      {
        ...a,
        ref: o,
        type: "date",
        className: m(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral font-sans cursor-pointer",
          n && "border-danger-5 focus-visible:outline-danger-5",
          s
        )
      }
    ),
    /* @__PURE__ */ t(
      se,
      {
        description: r,
        error: n,
        descriptionProps: d,
        errorMessageProps: c
      }
    )
  ] });
}
function Zn({
  icon: e,
  label: n,
  isActive: r = !1,
  badgeCount: s,
  onClick: l,
  className: o
}) {
  return /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      onClick: l,
      "aria-current": r ? "page" : void 0,
      className: m(
        "relative w-full h-14 flex items-center gap-4 pl-4 font-sans text-body-m font-semibold transition-colors cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
        r ? "text-interactive bg-gradient-to-r from-transparent to-primary-4/10" : "text-muted hover:text-interactive",
        o
      ),
      children: [
        e ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0", children: e }) : null,
        /* @__PURE__ */ t("span", { className: "flex-1 truncate", children: n }),
        s !== void 0 ? /* @__PURE__ */ t(
          "span",
          {
            className: m(
              "px-2 py-0.5 text-xs font-bold rounded-full shrink-0",
              r ? "bg-primary-4 text-main" : "bg-neutral-3 text-main"
            ),
            children: s
          }
        ) : null,
        /* @__PURE__ */ t(
          "span",
          {
            className: m(
              "w-1 h-full shrink-0 bg-primary-4 transition-opacity",
              r ? "opacity-100" : "opacity-0"
            )
          }
        )
      ]
    }
  );
}
function Fn({ logo: e, items: n, className: r }) {
  return /* @__PURE__ */ u(
    "nav",
    {
      "aria-label": "Main navigation",
      className: m(
        // 232px / rounded-lg (24px) matches the real "Sidebar" layer (ApplicationSidebar01.md + Dashboard Mockup.md).
        "flex flex-col w-[232px] h-full bg-surface-panel rounded-lg select-none shrink-0",
        r
      ),
      children: [
        e ? /* @__PURE__ */ t("div", { className: "flex justify-center pt-3 h-24 shrink-0", children: e }) : null,
        /* @__PURE__ */ t("div", { className: "flex flex-col gap-2 flex-1 overflow-y-auto", children: n.map((s, l) => /* @__PURE__ */ t(Zn, { ...s }, l)) })
      ]
    }
  );
}
function ws({
  value: e,
  onChange: n,
  leftIcon: r,
  rightIcon: s,
  leftLabel: l,
  rightLabel: o,
  className: i
}) {
  return /* @__PURE__ */ u("div", { className: m("flex items-center w-20 h-10 bg-surface-shell rounded-sm", i), children: [
    /* @__PURE__ */ t(
      Xe,
      {
        variant: "secondary",
        isSelected: e === "left",
        "aria-label": l,
        onPress: () => n == null ? void 0 : n("left"),
        children: r
      }
    ),
    /* @__PURE__ */ t(
      Xe,
      {
        variant: "secondary",
        isSelected: e === "right",
        "aria-label": o,
        onPress: () => n == null ? void 0 : n("right"),
        children: s
      }
    )
  ] });
}
function ks({
  logo: e,
  sidebarItems: n,
  topNavProps: r,
  topBar: s,
  children: l,
  className: o
}) {
  return /* @__PURE__ */ u(
    "div",
    {
      className: m("flex items-start gap-8 w-full min-h-screen bg-surface-shell p-8", o),
      children: [
        /* @__PURE__ */ t(Fn, { logo: e, items: n, className: "self-stretch" }),
        /* @__PURE__ */ u("div", { className: "flex flex-col gap-8 flex-1 min-w-0", children: [
          /* @__PURE__ */ t(mn, { ...r }),
          /* @__PURE__ */ u("div", { className: "flex flex-col gap-4", children: [
            s ? /* @__PURE__ */ t("div", { className: "flex items-start justify-between gap-6", children: s }) : null,
            l
          ] })
        ] })
      ]
    }
  );
}
export {
  bs as AddTaskModal,
  Qr as AlarmIcon,
  ks as AppShell,
  Fn as ApplicationSidebar,
  rn as AssigneeIcon,
  An as AssigneeModal,
  vn as AssigneeNameCell,
  qn as AttachmentIcon,
  de as Avatar,
  hs as Badge,
  tn as BellIcon,
  Xe as Button,
  sn as CalendarIcon,
  is as Card,
  ln as ChevronDoubleLeftIcon,
  an as ChevronDoubleRightIcon,
  De as ChevronDownIcon,
  on as ChevronLeftIcon,
  xt as ChevronRightIcon,
  je as CloseIcon,
  Jn as CommentIcon,
  Jr as DUE_DATE_URGENCY_COLOR,
  Vn as DatePickerMenu,
  ys as Datepicker,
  xn as DueDateCell,
  yt as EmptyState,
  Hn as EstimateModal,
  yn as EstimationCell,
  cn as FIELD_DESCRIPTION_CLASS,
  dn as FIELD_ERROR_CLASS,
  ve as FIELD_LABEL_CLASS,
  se as FieldMessages,
  Oe as FloatingPopover,
  ns as FormField,
  Qn as GridViewIcon,
  ss as Input,
  vs as LabelCheckbox,
  nn as LabelIcon,
  Dn as LabelModal,
  wt as ListBox,
  es as ListViewIcon,
  rs as LogoMark,
  ms as Menu,
  Yn as MenuDotsIcon,
  fs as Modal,
  us as MultiSelect,
  ts as PlusIcon,
  Ve as PointsIcon,
  ye as Popover,
  vt as ProjectInfo,
  ce as RequiredIndicator,
  un as SearchBar,
  en as SearchIcon,
  ls as SegmentedControl,
  ds as Select,
  Zn as SidebarItem,
  E as Skeleton,
  Xn as SubtaskIcon,
  os as Tabs,
  W as Tag,
  wn as TagCell,
  hn as TaskCard,
  as as TaskListView,
  bn as TaskMetaBadges,
  cs as TaskTable,
  Cn as TaskTableRow,
  Je as TextButton,
  xs as ToastProvider,
  mn as TopNav,
  Rn as UserRow,
  ws as ViewSwitcher,
  m as cn,
  ps as useModalState,
  gs as useToast
};
