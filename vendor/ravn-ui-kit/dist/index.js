import { jsx as t, jsxs as d, Fragment as rt } from "react/jsx-runtime";
import K, { useRef as X, useState as oe } from "react";
import { useButton as Oe, useTextField as we, useOverlay as nt, useDialog as ot, FocusScope as st, useCheckbox as lt } from "react-aria";
import { useOverlayTriggerState as it, useToggleState as at } from "react-stately";
function Ve(e) {
  var r, o, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var s = e.length;
    for (r = 0; r < s; r++) e[r] && (o = Ve(e[r])) && (n && (n += " "), n += o);
  } else for (o in e) e[o] && (n && (n += " "), n += o);
  return n;
}
function ct() {
  for (var e, r, o = 0, n = "", s = arguments.length; o < s; o++) (e = arguments[o]) && (r = Ve(e)) && (n && (n += " "), n += r);
  return n;
}
const dt = (e, r) => {
  const o = new Array(e.length + r.length);
  for (let n = 0; n < e.length; n++)
    o[n] = e[n];
  for (let n = 0; n < r.length; n++)
    o[e.length + n] = r[n];
  return o;
}, ut = (e, r) => ({
  classGroupId: e,
  validator: r
}), Ee = (e = /* @__PURE__ */ new Map(), r = null, o) => ({
  nextPart: e,
  validators: r,
  classGroupId: o
}), me = "-", je = [], mt = "arbitrary..", ft = (e) => {
  const r = bt(e), {
    conflictingClassGroups: o,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (i) => {
      if (i.startsWith("[") && i.endsWith("]"))
        return pt(i);
      const a = i.split(me), p = a[0] === "" && a.length > 1 ? 1 : 0;
      return Fe(a, p, r);
    },
    getConflictingClassGroupIds: (i, a) => {
      if (a) {
        const p = n[i], c = o[i];
        return p ? c ? dt(c, p) : p : c || je;
      }
      return o[i] || je;
    }
  };
}, Fe = (e, r, o) => {
  if (e.length - r === 0)
    return o.classGroupId;
  const s = e[r], l = o.nextPart.get(s);
  if (l) {
    const c = Fe(e, r + 1, l);
    if (c) return c;
  }
  const i = o.validators;
  if (i === null)
    return;
  const a = r === 0 ? e.join(me) : e.slice(r).join(me), p = i.length;
  for (let c = 0; c < p; c++) {
    const v = i[c];
    if (v.validator(a))
      return v.classGroupId;
  }
}, pt = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const r = e.slice(1, -1), o = r.indexOf(":"), n = r.slice(0, o);
  return n ? mt + n : void 0;
})(), bt = (e) => {
  const {
    theme: r,
    classGroups: o
  } = e;
  return ht(o, r);
}, ht = (e, r) => {
  const o = Ee();
  for (const n in e) {
    const s = e[n];
    ke(s, o, n, r);
  }
  return o;
}, ke = (e, r, o, n) => {
  const s = e.length;
  for (let l = 0; l < s; l++) {
    const i = e[l];
    gt(i, r, o, n);
  }
}, gt = (e, r, o, n) => {
  if (typeof e == "string") {
    xt(e, r, o);
    return;
  }
  if (typeof e == "function") {
    vt(e, r, o, n);
    return;
  }
  yt(e, r, o, n);
}, xt = (e, r, o) => {
  const n = e === "" ? r : _e(r, e);
  n.classGroupId = o;
}, vt = (e, r, o, n) => {
  if (wt(e)) {
    ke(e(n), r, o, n);
    return;
  }
  r.validators === null && (r.validators = []), r.validators.push(ut(o, e));
}, yt = (e, r, o, n) => {
  const s = Object.entries(e), l = s.length;
  for (let i = 0; i < l; i++) {
    const [a, p] = s[i];
    ke(p, _e(r, a), o, n);
  }
}, _e = (e, r) => {
  let o = e;
  const n = r.split(me), s = n.length;
  for (let l = 0; l < s; l++) {
    const i = n[l];
    let a = o.nextPart.get(i);
    a || (a = Ee(), o.nextPart.set(i, a)), o = a;
  }
  return o;
}, wt = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, kt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, o = /* @__PURE__ */ Object.create(null), n = /* @__PURE__ */ Object.create(null);
  const s = (l, i) => {
    o[l] = i, r++, r > e && (r = 0, n = o, o = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(l) {
      let i = o[l];
      if (i !== void 0)
        return i;
      if ((i = n[l]) !== void 0)
        return s(l, i), i;
    },
    set(l, i) {
      l in o ? o[l] = i : s(l, i);
    }
  };
}, ye = "!", Ie = ":", Nt = [], Te = (e, r, o, n, s) => ({
  modifiers: e,
  hasImportantModifier: r,
  baseClassName: o,
  maybePostfixModifierPosition: n,
  isExternal: s
}), Ct = (e) => {
  const {
    prefix: r,
    experimentalParseClassName: o
  } = e;
  let n = (s) => {
    const l = [];
    let i = 0, a = 0, p = 0, c;
    const v = s.length;
    for (let N = 0; N < v; N++) {
      const I = s[N];
      if (i === 0 && a === 0) {
        if (I === Ie) {
          l.push(s.slice(p, N)), p = N + 1;
          continue;
        }
        if (I === "/") {
          c = N;
          continue;
        }
      }
      I === "[" ? i++ : I === "]" ? i-- : I === "(" ? a++ : I === ")" && a--;
    }
    const h = l.length === 0 ? s : s.slice(p);
    let w = h, k = !1;
    h.endsWith(ye) ? (w = h.slice(0, -1), k = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      h.startsWith(ye) && (w = h.slice(1), k = !0)
    );
    const C = c && c > p ? c - p : void 0;
    return Te(l, k, w, C);
  };
  if (r) {
    const s = r + Ie, l = n;
    n = (i) => i.startsWith(s) ? l(i.slice(s.length)) : Te(Nt, !1, i, void 0, !0);
  }
  if (o) {
    const s = n;
    n = (l) => o({
      className: l,
      parseClassName: s
    });
  }
  return n;
}, Mt = (e) => {
  const r = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((o, n) => {
    r.set(o, 1e6 + n);
  }), (o) => {
    const n = [];
    let s = [];
    for (let l = 0; l < o.length; l++) {
      const i = o[l], a = i[0] === "[", p = r.has(i);
      a || p ? (s.length > 0 && (s.sort(), n.push(...s), s = []), n.push(i)) : s.push(i);
    }
    return s.length > 0 && (s.sort(), n.push(...s)), n;
  };
}, zt = (e) => ({
  cache: kt(e.cacheSize),
  parseClassName: Ct(e),
  sortModifiers: Mt(e),
  postfixLookupClassGroupIds: St(e),
  ...ft(e)
}), St = (e) => {
  const r = /* @__PURE__ */ Object.create(null), o = e.postfixLookupClassGroups;
  if (o)
    for (let n = 0; n < o.length; n++)
      r[o[n]] = !0;
  return r;
}, Lt = /\s+/, Pt = (e, r) => {
  const {
    parseClassName: o,
    getClassGroupId: n,
    getConflictingClassGroupIds: s,
    sortModifiers: l,
    postfixLookupClassGroupIds: i
  } = r, a = [], p = e.trim().split(Lt);
  let c = "";
  for (let v = p.length - 1; v >= 0; v -= 1) {
    const h = p[v], {
      isExternal: w,
      modifiers: k,
      hasImportantModifier: C,
      baseClassName: N,
      maybePostfixModifierPosition: I
    } = o(h);
    if (w) {
      c = h + (c.length > 0 ? " " + c : c);
      continue;
    }
    let T = !!I, P;
    if (T) {
      const z = N.substring(0, I);
      P = n(z);
      const f = P && i[P] ? n(N) : void 0;
      f && f !== P && (P = f, T = !1);
    } else
      P = n(N);
    if (!P) {
      if (!T) {
        c = h + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (P = n(N), !P) {
        c = h + (c.length > 0 ? " " + c : c);
        continue;
      }
      T = !1;
    }
    const B = k.length === 0 ? "" : k.length === 1 ? k[0] : l(k).join(":"), G = C ? B + ye : B, W = G + P;
    if (a.indexOf(W) > -1)
      continue;
    a.push(W);
    const M = s(P, T);
    for (let z = 0; z < M.length; ++z) {
      const f = M[z];
      a.push(G + f);
    }
    c = h + (c.length > 0 ? " " + c : c);
  }
  return c;
}, jt = (...e) => {
  let r = 0, o, n, s = "";
  for (; r < e.length; )
    (o = e[r++]) && (n = $e(o)) && (s && (s += " "), s += n);
  return s;
}, $e = (e) => {
  if (typeof e == "string")
    return e;
  let r, o = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (r = $e(e[n])) && (o && (o += " "), o += r);
  return o;
}, It = (e, ...r) => {
  let o, n, s, l;
  const i = (p) => {
    const c = r.reduce((v, h) => h(v), e());
    return o = zt(c), n = o.cache.get, s = o.cache.set, l = a, a(p);
  }, a = (p) => {
    const c = n(p);
    if (c)
      return c;
    const v = Pt(p, o);
    return s(p, v), v;
  };
  return l = i, (...p) => l(jt(...p));
}, Tt = [], L = (e) => {
  const r = (o) => o[e] || Tt;
  return r.isThemeGetter = !0, r;
}, Ue = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Ye = /^\((?:(\w[\w-]*):)?(.+)\)$/i, At = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Rt = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Wt = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Dt = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Bt = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Gt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, H = (e) => At.test(e), y = (e) => !!e && !Number.isNaN(Number(e)), _ = (e) => !!e && Number.isInteger(Number(e)), xe = (e) => e.endsWith("%") && y(e.slice(0, -1)), U = (e) => Rt.test(e), He = () => !0, Ot = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Wt.test(e) && !Dt.test(e)
), Ne = () => !1, Vt = (e) => Bt.test(e), Et = (e) => Gt.test(e), Ft = (e) => !u(e) && !m(e), _t = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), $t = (e) => q(e, Xe, Ne), u = (e) => Ue.test(e), Z = (e) => q(e, qe, Ot), Ae = (e) => q(e, Qt, y), Ut = (e) => q(e, Ze, He), Yt = (e) => q(e, Qe, Ne), Re = (e) => q(e, Ke, Ne), Ht = (e) => q(e, Je, Et), de = (e) => q(e, et, Vt), m = (e) => Ye.test(e), re = (e) => ee(e, qe), Kt = (e) => ee(e, Qe), We = (e) => ee(e, Ke), Jt = (e) => ee(e, Xe), Xt = (e) => ee(e, Je), ue = (e) => ee(e, et, !0), qt = (e) => ee(e, Ze, !0), q = (e, r, o) => {
  const n = Ue.exec(e);
  return n ? n[1] ? r(n[1]) : o(n[2]) : !1;
}, ee = (e, r, o = !1) => {
  const n = Ye.exec(e);
  return n ? n[1] ? r(n[1]) : o : !1;
}, Ke = (e) => e === "position" || e === "percentage", Je = (e) => e === "image" || e === "url", Xe = (e) => e === "length" || e === "size" || e === "bg-size", qe = (e) => e === "length", Qt = (e) => e === "number", Qe = (e) => e === "family-name", Ze = (e) => e === "number" || e === "weight", et = (e) => e === "shadow", Zt = () => {
  const e = L("color"), r = L("font"), o = L("text"), n = L("font-weight"), s = L("tracking"), l = L("leading"), i = L("breakpoint"), a = L("container"), p = L("spacing"), c = L("radius"), v = L("shadow"), h = L("inset-shadow"), w = L("text-shadow"), k = L("drop-shadow"), C = L("blur"), N = L("perspective"), I = L("aspect"), T = L("ease"), P = L("animate"), B = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], G = () => [
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
  ], W = () => [...G(), m, u], M = () => ["auto", "hidden", "clip", "visible", "scroll"], z = () => ["auto", "contain", "none"], f = () => [m, u, p], x = () => [H, "full", "auto", ...f()], F = () => [_, "none", "subgrid", m, u], S = () => ["auto", {
    span: ["full", _, m, u]
  }, _, m, u], $ = () => [_, "auto", m, u], Ce = () => ["auto", "min", "max", "fr", m, u], fe = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], te = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], O = () => ["auto", ...f()], Q = () => [H, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...f()], pe = () => [H, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...f()], be = () => [H, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...f()], g = () => [e, m, u], Me = () => [...G(), We, Re, {
    position: [m, u]
  }], ze = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], Se = () => ["auto", "cover", "contain", Jt, $t, {
    size: [m, u]
  }], he = () => [xe, re, Z], A = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    c,
    m,
    u
  ], R = () => ["", y, re, Z], le = () => ["solid", "dashed", "dotted", "double"], Le = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], j = () => [y, xe, We, Re], Pe = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    C,
    m,
    u
  ], ie = () => ["none", y, m, u], ae = () => ["none", y, m, u], ge = () => [y, m, u], ce = () => [H, "full", ...f()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [U],
      breakpoint: [U],
      color: [He],
      container: [U],
      "drop-shadow": [U],
      ease: ["in", "out", "in-out"],
      font: [Ft],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [U],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [U],
      shadow: [U],
      spacing: ["px", y],
      text: [U],
      "text-shadow": [U],
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
        aspect: ["auto", "square", H, u, m, I]
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
      "container-named": [_t],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [y, u, m, a]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": B()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": B()
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
        object: W()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: M()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": M()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": M()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: z()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": z()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": z()
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
        inset: x()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": x()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": x()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": x(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: x()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": x(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: x()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": x()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": x()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: x()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: x()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: x()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: x()
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
        z: [_, "auto", m, u]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [H, "full", "auto", a, ...f()]
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
        flex: [y, H, "auto", "initial", "none", u]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", y, m, u]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", y, m, u]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [_, "first", "last", "none", m, u]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": F()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: S()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": $()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": $()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": F()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: S()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": $()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": $()
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
        "auto-cols": Ce()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": Ce()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: f()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": f()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": f()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...fe(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...te(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...te()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...fe()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...te(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...te(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": fe()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...te(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...te()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: f()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: f()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: f()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: f()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: f()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: f()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: f()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: f()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: f()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: f()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: f()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: O()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: O()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: O()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: O()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: O()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: O()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: O()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: O()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: O()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: O()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: O()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": f()
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
        "space-y": f()
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
        size: Q()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...pe()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...pe()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...pe()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...be()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...be()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...be()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [a, "screen", ...Q()]
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
          ...Q()
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
          ...Q()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...Q()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...Q()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...Q()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", o, re, Z]
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
        font: [n, qt, Ut]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", xe, u]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Kt, Yt, r]
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
        "line-clamp": [y, "none", m, Ae]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          l,
          ...f()
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
        decoration: [...le(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [y, "from-font", "auto", m, Z]
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
        "underline-offset": [y, "auto", m, u]
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
        indent: f()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [_, m, u]
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
        bg: Me()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ze()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: Se()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, _, m, u],
          radial: ["", m, u],
          conic: [_, m, u]
        }, Xt, Ht]
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
        from: he()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: he()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: he()
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
        border: R()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": R()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": R()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": R()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": R()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": R()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": R()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": R()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": R()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": R()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": R()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": R()
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
        "divide-y": R()
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
        border: [...le(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...le(), "hidden", "none"]
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
        outline: [...le(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [y, m, u]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", y, re, Z]
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
          v,
          ue,
          de
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
        "inset-shadow": ["none", h, ue, de]
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
        ring: R()
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
        "ring-offset": [y, Z]
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
        "inset-ring": R()
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
        "text-shadow": ["none", w, ue, de]
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
        opacity: [y, m, u]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Le(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Le()
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
        "mask-linear-from": j()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": j()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": g()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": g()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": j()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": j()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": g()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": g()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": j()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": j()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": g()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": g()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": j()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": j()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": g()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": g()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": j()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": j()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": g()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": g()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": j()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": j()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": g()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": g()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": j()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": j()
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
        "mask-radial-from": j()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": j()
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
        "mask-radial-at": G()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [y]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": j()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": j()
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
        mask: Me()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: ze()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: Se()
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
        blur: Pe()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [y, m, u]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [y, m, u]
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
          k,
          ue,
          de
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
        grayscale: ["", y, m, u]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [y, m, u]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", y, m, u]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [y, m, u]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", y, m, u]
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
        "backdrop-blur": Pe()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [y, m, u]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [y, m, u]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", y, m, u]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [y, m, u]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", y, m, u]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [y, m, u]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [y, m, u]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", y, m, u]
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
        "border-spacing": f()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": f()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": f()
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
        duration: [y, "initial", m, u]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", T, m, u]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [y, m, u]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", P, m, u]
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
        perspective: [N, m, u]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": W()
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
        scale: ae()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": ae()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": ae()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": ae()
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
        skew: ge()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": ge()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": ge()
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
        origin: W()
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
        translate: ce()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": ce()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": ce()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": ce()
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
        zoom: [_, m, u]
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
        "scroll-m": f()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": f()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": f()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": f()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": f()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": f()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": f()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": f()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": f()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": f()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": f()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": f()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": f()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": f()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": f()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": f()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": f()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": f()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": f()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": f()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": f()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": f()
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
        stroke: [y, re, Z, Ae]
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
}, er = /* @__PURE__ */ It(Zt);
function b(...e) {
  return er(ct(e));
}
function De({
  variant: e = "secondary",
  isSelected: r = !1,
  children: o,
  className: n,
  isDisabled: s,
  ...l
}) {
  const i = X(null), { buttonProps: a } = Oe({ ...l, isDisabled: s }, i);
  return /* @__PURE__ */ t(
    "button",
    {
      ...a,
      ref: i,
      className: b(
        "inline-flex items-center justify-center w-10 h-10 rounded-sm transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          primary: "bg-primary-4 text-main border border-transparent",
          secondary: r ? "bg-transparent text-interactive border border-primary-4" : "bg-transparent text-main border border-transparent"
        }[e],
        n
      ),
      children: /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0 [&>svg]:w-full [&>svg]:h-full", children: o })
    }
  );
}
function Be({
  variant: e = "primary",
  isSelected: r = !1,
  className: o,
  isDisabled: n,
  ...s
}) {
  const l = X(null), { buttonProps: i } = Oe({ ...s, isDisabled: n }, l), a = {
    primary: b(
      "text-main",
      n ? "bg-primary-2" : r ? "bg-primary-3" : "bg-primary-4 hover:bg-primary-2"
    ),
    secondary: n ? "bg-transparent text-muted" : r ? "bg-neutral-3 text-main" : "bg-transparent text-main hover:bg-neutral-2"
  };
  return /* @__PURE__ */ t(
    "button",
    {
      ...i,
      ref: l,
      className: b(
        "inline-flex items-center justify-center p-2 text-body-m font-normal rounded-sm transition-colors cursor-pointer font-sans select-none outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 disabled:pointer-events-none",
        a[e],
        o
      ),
      children: s.children
    }
  );
}
function Er({ label: e, error: r, className: o, ...n }) {
  const s = X(null), { labelProps: l, inputProps: i, errorMessageProps: a } = we(
    { ...n, label: e, isInvalid: !!r, errorMessage: r },
    s
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
        ...i,
        ref: s,
        className: b(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md placeholder:text-muted transition-colors outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral",
          r && "border-danger-5 focus-visible:outline-danger-5",
          o
        )
      }
    ),
    r ? /* @__PURE__ */ t("span", { ...a, className: "text-xs text-danger font-sans", children: r }) : null
  ] });
}
function tr({
  placeholder: e = "Search...",
  value: r,
  onChange: o,
  onSubmit: n,
  className: s
}) {
  const [l, i] = oe(""), a = r !== void 0, p = a ? r : l, c = X(null), { inputProps: v } = we(
    {
      value: p,
      onChange: (h) => {
        a || i(h), o == null || o(h);
      },
      onKeyDown: (h) => {
        h.key === "Enter" && (n == null || n(p));
      },
      "aria-label": "Search",
      placeholder: e
    },
    c
  );
  return /* @__PURE__ */ d("div", { className: b("inline-flex items-center gap-6 min-w-0", s), children: [
    /* @__PURE__ */ d(
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
        ...v,
        ref: c,
        className: "flex-1 bg-transparent text-body-m text-main placeholder:text-muted outline-none font-sans min-w-0"
      }
    )
  ] });
}
function se({ src: e, name: r, size: o = "md", className: n }) {
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
      className: b(
        // text-primary-4 kept raw, not aliased to `text-interactive` — this is a decorative
        // accent-tint/accent-text color pairing (bg-primary-1 + text-primary-4), not an
        // interactive affordance; avatars aren't inherently clickable.
        "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-1 text-primary-4 select-none shrink-0",
        s[o],
        n
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
function rr() {
  return /* @__PURE__ */ d("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: [
    /* @__PURE__ */ t("path", { d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" }),
    /* @__PURE__ */ t("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
  ] });
}
function nr() {
  return /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M18 6 6 18M6 6l12 12" }) });
}
function or({
  searchValue: e,
  searchPlaceholder: r,
  onSearchChange: o,
  onSearchSubmit: n,
  icon: s,
  userName: l,
  userAvatar: i,
  className: a
}) {
  const [p, c] = oe(""), v = e !== void 0, h = v ? e : p, w = (C) => {
    v || c(C), o == null || o(C);
  }, k = () => {
    v || c(""), o == null || o("");
  };
  return /* @__PURE__ */ d(
    "header",
    {
      className: b(
        "flex items-center justify-between gap-6 px-6 py-3 bg-surface-panel rounded-md",
        a
      ),
      children: [
        /* @__PURE__ */ t(
          tr,
          {
            placeholder: r,
            value: h,
            onChange: w,
            onSubmit: n,
            className: "flex-1"
          }
        ),
        /* @__PURE__ */ d("div", { className: "flex items-center gap-6 shrink-0", children: [
          h ? /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              onClick: k,
              "aria-label": "Clear search",
              className: "w-6 h-6 shrink-0 text-muted hover:text-main transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-xs [&>svg]:w-full [&>svg]:h-full",
              children: /* @__PURE__ */ t(nr, {})
            }
          ) : null,
          /* @__PURE__ */ t("span", { className: "w-6 h-6 text-muted shrink-0 [&>svg]:w-full [&>svg]:h-full", children: s ?? /* @__PURE__ */ t(rr, {}) }),
          l || i ? /* @__PURE__ */ t(se, { src: i, name: l, size: "md" }) : null
        ] })
      ]
    }
  );
}
function Fr({
  items: e,
  panels: r,
  defaultSelectedKey: o,
  selectedKey: n,
  onSelectionChange: s,
  className: l
}) {
  var h;
  const [i, a] = K.useState(
    o ?? ((h = e[0]) == null ? void 0 : h.id) ?? ""
  ), p = n !== void 0, c = p ? n : i, v = (w) => {
    p || a(w), s == null || s(w);
  };
  return /* @__PURE__ */ d("div", { className: b("flex flex-col", l), children: [
    /* @__PURE__ */ t(
      "div",
      {
        role: "tablist",
        "aria-label": "Tab navigation",
        className: "flex items-end",
        children: e.map((w) => {
          const k = c === w.id;
          return /* @__PURE__ */ d(
            "button",
            {
              role: "tab",
              "aria-selected": k,
              "aria-controls": `panel-${w.id}`,
              id: `tab-${w.id}`,
              type: "button",
              onClick: () => v(w.id),
              className: b(
                // Figma "Tabs" Frame 299: padding 12px 0px 8px (asymmetric
                // vertical padding around the label) -- was symmetric py-3.5.
                // Horizontal padding (px-5) is kept: Figma's own value there
                // is 0px, but that's an artifact of a fixed-width (120px)
                // demo box, not a real horizontal-padding spec for
                // arbitrary-length labels.
                "relative flex items-center justify-center gap-2 px-5 pt-3 pb-2 text-tab-label font-normal text-center font-sans transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
                k ? "text-interactive" : "text-muted hover:text-main"
              ),
              children: [
                w.icon ? /* @__PURE__ */ t("span", { className: "text-base leading-none", children: w.icon }) : null,
                w.label,
                k ? /* @__PURE__ */ t("span", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary-4" }) : null
              ]
            },
            w.id
          );
        })
      }
    ),
    r ? /* @__PURE__ */ t(
      "div",
      {
        role: "tabpanel",
        id: `panel-${c}`,
        "aria-labelledby": `tab-${c}`,
        className: "flex-1",
        children: r[c] ?? null
      }
    ) : null
  ] });
}
function _r({
  options: e,
  value: r,
  defaultValue: o,
  onChange: n,
  className: s
}) {
  var v;
  const [l, i] = K.useState(
    o ?? ((v = e[0]) == null ? void 0 : v.id) ?? ""
  ), a = r !== void 0, p = a ? r : l, c = (h) => {
    a || i(h), n == null || n(h);
  };
  return /* @__PURE__ */ t(
    "div",
    {
      role: "group",
      "aria-label": "View",
      className: b(
        "inline-flex items-center gap-0 p-1 bg-surface-panel rounded-10",
        s
      ),
      children: e.map((h) => {
        const w = p === h.id;
        return /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            role: "radio",
            "aria-checked": w,
            onClick: () => c(h.id),
            className: b(
              "inline-flex items-center justify-center gap-2 h-8 px-6 py-1 text-control-label font-normal rounded-sm transition-all cursor-pointer font-sans select-none text-main outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
              w ? "bg-neutral-2 shadow-small" : ""
            ),
            children: [
              h.icon ? /* @__PURE__ */ t("span", { className: "text-base leading-none", children: h.icon }) : null,
              h.label
            ]
          },
          h.id
        );
      })
    }
  );
}
function $r({ children: e, className: r, ...o }) {
  return /* @__PURE__ */ t(
    "div",
    {
      ...o,
      className: b(
        "p-5 bg-surface-neutral border border-subtle rounded-lg shadow-xs transition-shadow hover:shadow-sm",
        r
      ),
      children: e
    }
  );
}
function Y({
  variant: e = "neutral",
  outline: r = !1,
  icon: o,
  children: n,
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
  return /* @__PURE__ */ d(
    "span",
    {
      className: b(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Tag" component exactly (Style=Solid/Outline,
        // all Type variants, Tags00/01.md). Typography: Desktop/Body/M/bold - SF Pro
        // Display, 15px/24px, letter-spacing 0.75px (tracking-wider @ 15px), weight 600.
        "inline-flex items-center gap-2 px-4 py-1 text-body-m font-semibold rounded font-sans select-none",
        r ? i[e].outline : i[e].solid,
        l
      ),
      children: [
        o ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0", children: o }) : null,
        n,
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
function tt({ title: e, icon: r, className: o }) {
  return /* @__PURE__ */ d("div", { className: b("flex items-center gap-2 w-full", o), children: [
    /* @__PURE__ */ t("h3", { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: e }),
    r ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0 text-muted", children: r }) : null
  ] });
}
function sr({ badges: e, className: r }) {
  return (
    // gap-4 matches Figma's "Frame 653" gap (16px, Cards01.md L614 / Cards00.md L657).
    /* @__PURE__ */ t("div", { className: b("flex flex-wrap items-center gap-4", r), children: e.map((o) => /* @__PURE__ */ d(
      "span",
      {
        className: "inline-flex items-center gap-1 text-body-m font-normal font-sans text-main",
        "aria-label": o.label,
        children: [
          o.count !== void 0 ? /* @__PURE__ */ t("span", { className: "tabular-nums", "aria-hidden": !0, children: o.count }) : null,
          /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", "aria-hidden": !0, children: o.icon })
        ]
      },
      o.label
    )) })
  );
}
const lr = () => /* @__PURE__ */ d("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("circle", { cx: "12", cy: "13", r: "8" }),
  /* @__PURE__ */ t("path", { d: "M12 9v4l3 2" }),
  /* @__PURE__ */ t("path", { d: "M5 3 2 6M22 6l-3-3" })
] }), ir = {
  normal: "neutral",
  warning: "tertiary",
  overdue: "primary"
};
function ar({
  title: e,
  points: r,
  dueDateText: o,
  dueDateUrgency: n = "normal",
  tags: s = [],
  assigneeName: l,
  assigneeAvatar: i,
  metaBadges: a = [],
  className: p,
  onClick: c
}) {
  return /* @__PURE__ */ d(
    "div",
    {
      onClick: c,
      role: c ? "button" : void 0,
      tabIndex: c ? 0 : void 0,
      onKeyDown: c ? (v) => {
        (v.key === "Enter" || v.key === " ") && (v.preventDefault(), c());
      } : void 0,
      className: b(
        // radius-sm (8px) matches Figma's "Task Card" border-radius exactly (Cards01.md L246);
        // rounded-lg here previously resolved to this project's --radius-lg (24px), far too round.
        // No border is ever rendered on the card in the export, so the resting border is transparent
        // (kept as a real border utility, not removed, so the hover reveal below still works).
        "flex flex-col gap-4 p-4 bg-surface-panel text-main rounded-sm border border-transparent shadow-xs hover:border-subtle transition-all cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
        p
      ),
      children: [
        /* @__PURE__ */ t(tt, { title: e }),
        r !== void 0 || o ? /* @__PURE__ */ d("div", { className: "flex items-center justify-between gap-2", children: [
          r !== void 0 ? (
            // Desktop/Body/M/bold: SF Pro Display, 15px/24px, weight 600, letter-spacing 0.75px
            // (tracking-wider, exact at this size). Was previously `text-sm font-bold` (14px/700).
            /* @__PURE__ */ d("span", { className: "text-body-m font-semibold text-main font-sans", children: [
              r,
              " Pts"
            ] })
          ) : null,
          o ? (
            // The due-date pill IS a real "Tag" instance per spec (padding 4px 16px, gap 8px,
            // radius 4px, alarm-line icon, Desktop/Body/M/bold) — reusing `Tag` directly instead
            // of a bespoke span gets typography/spacing/color right for free.
            /* @__PURE__ */ t(Y, { variant: ir[n], icon: /* @__PURE__ */ t(lr, {}), children: o })
          ) : null
        ] }) : null,
        s.length > 0 ? /* @__PURE__ */ t("div", { className: "flex flex-wrap items-center gap-2", children: s.map((v, h) => /* @__PURE__ */ t(Y, { variant: v.variant || "neutral", children: v.label }, h)) }) : null,
        /* @__PURE__ */ d("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ t(se, { src: i, name: l, size: "sm" }),
            l ? /* @__PURE__ */ t("span", { className: "font-sans text-xs font-medium text-muted truncate max-w-[120px]", children: l }) : null
          ] }),
          a.length > 0 ? /* @__PURE__ */ t(sr, { badges: a }) : null
        ] })
      ]
    }
  );
}
function V({ className: e }) {
  return /* @__PURE__ */ t(
    "div",
    {
      "aria-hidden": !0,
      className: b("animate-pulse rounded-sm bg-neutral-3", e)
    }
  );
}
function ve() {
  return /* @__PURE__ */ d("div", { className: "flex flex-col gap-4 p-4 bg-surface-panel rounded-sm border border-transparent", children: [
    /* @__PURE__ */ t(V, { className: "h-6 w-3/4" }),
    /* @__PURE__ */ d("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t(V, { className: "h-6 w-16" }),
      /* @__PURE__ */ t(V, { className: "h-6 w-20 rounded" })
    ] }),
    /* @__PURE__ */ t("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ t(V, { className: "w-8 h-8 rounded-full" }),
      /* @__PURE__ */ t(V, { className: "h-3 w-20" })
    ] }) })
  ] });
}
function Ur({ title: e, icon: r, tasks: o, isLoading: n = !1, className: s }) {
  return /* @__PURE__ */ d("div", { className: b("flex flex-col gap-4 w-full", s), children: [
    /* @__PURE__ */ t(tt, { title: e, icon: r }),
    n ? /* @__PURE__ */ d(rt, { children: [
      /* @__PURE__ */ t(ve, {}),
      /* @__PURE__ */ t(ve, {}),
      /* @__PURE__ */ t(ve, {})
    ] }) : o.length === 0 ? /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-16 text-muted font-sans text-sm", children: "No tasks in this view." }) : o.map((l, i) => /* @__PURE__ */ t(ar, { ...l, className: "w-full" }, i))
  ] });
}
const D = {
  name: 500,
  tags: 168,
  estimation: 140,
  assignee: 168,
  dueDate: 132
}, cr = ({ className: e }) => /* @__PURE__ */ t("svg", { className: e, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m6 9 6 6 6-6" }) }), dr = ({ className: e }) => /* @__PURE__ */ t("svg", { className: e, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m9 18 6-6-6-6" }) }), ur = ({ className: e }) => /* @__PURE__ */ t("svg", { className: e, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": !0, children: /* @__PURE__ */ t("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3" }) }), J = "text-body-m font-normal text-main font-sans", E = "h-14 shrink-0 bg-surface-panel border-y border-r border-neutral-3";
function mr({ date: e, urgency: r = "normal" }) {
  return /* @__PURE__ */ t("span", { className: b(J, {
    normal: "text-main",
    warning: "text-tertiary-4",
    // text-primary-4 kept as a raw ramp class, not aliased to `text-interactive` — this is a
    // status/urgency signal, not an interactive affordance, so the "interactive" alias would
    // misrepresent its role even though it happens to share the same color value.
    overdue: "text-primary-4"
  }[r]), children: e });
}
function fr({ name: e, avatarSrc: r }) {
  return /* @__PURE__ */ d("div", { className: "flex items-center gap-2 min-w-0", children: [
    /* @__PURE__ */ t(se, { src: r, name: e, size: "sm" }),
    /* @__PURE__ */ t("span", { className: b(J, "truncate"), children: e })
  ] });
}
function pr({ points: e }) {
  return /* @__PURE__ */ d("span", { className: b(J, "tabular-nums"), children: [
    e,
    " ",
    e === 1 ? "Point" : "Points"
  ] });
}
function br({ labels: e }) {
  return /* @__PURE__ */ t("div", { className: "flex flex-wrap items-center gap-2", children: e.map((r, o) => /* @__PURE__ */ t(Y, { variant: r.variant ?? "neutral", children: r.label }, o)) });
}
const hr = {
  primary: "bg-primary-4",
  secondary: "bg-secondary-4",
  tertiary: "bg-tertiary-4"
};
function gr({
  index: e,
  title: r,
  indicatorColor: o = "secondary",
  reactions: n = [],
  isSelected: s = !1,
  onSelectedChange: l,
  tags: i = [],
  estimationPoints: a,
  assigneeName: p,
  assigneeAvatar: c,
  dueDate: v,
  dueDateUrgency: h = "normal",
  onClick: w,
  onViewDetails: k
}) {
  return /* @__PURE__ */ d("tr", { onClick: w, className: b("group", w && "cursor-pointer"), children: [
    /* @__PURE__ */ t("td", { className: b(E, "pl-0 pr-4 border-l"), style: { width: D.name }, children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ t("span", { className: b("w-1 h-full shrink-0", hr[o]) }),
      /* @__PURE__ */ d("label", { className: "w-6 h-6 shrink-0 flex items-center justify-center cursor-pointer rounded-xs has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-4 has-[:focus-visible]:outline-offset-1", children: [
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
          ur,
          {
            className: b(
              "w-6 h-6 text-main transition-opacity",
              s ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
            )
          }
        )
      ] }),
      /* @__PURE__ */ t("span", { className: b(J, "shrink-0 tabular-nums"), children: String(e).padStart(2, "0") }),
      /* @__PURE__ */ t("span", { className: b(J, "flex-1 min-w-0 truncate"), children: r }),
      n.map((C) => /* @__PURE__ */ d("span", { className: b(J, "inline-flex items-center gap-1 shrink-0"), children: [
        /* @__PURE__ */ t("span", { className: "tabular-nums", children: C.count }),
        /* @__PURE__ */ t("span", { children: C.emoji })
      ] }, C.emoji)),
      k ? /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          onClick: k,
          className: b(J, "inline-flex items-center gap-1 shrink-0 hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs"),
          children: [
            /* @__PURE__ */ t("span", { children: "Details" }),
            /* @__PURE__ */ t(dr, { className: "w-4 h-4" })
          ]
        }
      ) : null
    ] }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-2 pr-4"), style: { width: D.tags }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: i.length > 0 ? /* @__PURE__ */ t(br, { labels: i }) : null }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-2 pr-4"), style: { width: D.estimation }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: a !== void 0 ? /* @__PURE__ */ t(pr, { points: a }) : null }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-2 pr-4"), style: { width: D.assignee }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: p ? /* @__PURE__ */ t(fr, { name: p, avatarSrc: c }) : null }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-2 pr-4"), style: { width: D.dueDate }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: v ? /* @__PURE__ */ t(mr, { date: v, urgency: h }) : null }) })
  ] });
}
function xr() {
  return /* @__PURE__ */ d("tr", { children: [
    /* @__PURE__ */ t("td", { className: b(E, "pl-4 pr-4 border-l"), style: { width: D.name }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(V, { className: "h-4 w-full" }) }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-4 pr-4"), style: { width: D.tags }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(V, { className: "h-6 w-16 rounded" }) }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-4 pr-4"), style: { width: D.estimation }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(V, { className: "h-4 w-16" }) }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-4 pr-4"), style: { width: D.assignee }, children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2 h-full", children: [
      /* @__PURE__ */ t(V, { className: "w-8 h-8 rounded-full shrink-0" }),
      /* @__PURE__ */ t(V, { className: "h-4 w-20" })
    ] }) }),
    /* @__PURE__ */ t("td", { className: b(E, "pl-4 pr-4"), style: { width: D.dueDate }, children: /* @__PURE__ */ t("div", { className: "flex items-center gap-2 h-full", children: /* @__PURE__ */ t(V, { className: "h-4 w-20" }) }) })
  ] });
}
const ne = [
  { key: "name", label: "# Task Name" },
  { key: "tags", label: "Task Tags" },
  { key: "estimation", label: "Estimate" },
  { key: "assignee", label: "Task Assign Name" },
  { key: "dueDate", label: "Due Date" }
];
function Yr({ groups: e, isLoading: r = !1, className: o }) {
  return /* @__PURE__ */ t("div", { className: b("w-full overflow-x-auto", o), children: /* @__PURE__ */ d("div", { className: "flex flex-col gap-4 min-w-[1108px]", children: [
    /* @__PURE__ */ t("div", { className: "flex", children: ne.map(({ key: n, label: s }, l) => /* @__PURE__ */ t(
      "div",
      {
        className: b(
          E,
          "px-4",
          l === 0 && "border-l rounded-l-4",
          l === ne.length - 1 && "rounded-r-4"
        ),
        style: { width: D[n] },
        children: /* @__PURE__ */ t("span", { className: J, children: s })
      },
      n
    )) }),
    r ? /* @__PURE__ */ d("table", { className: "border-collapse table-fixed", children: [
      /* @__PURE__ */ t("colgroup", { children: ne.map(({ key: n }) => /* @__PURE__ */ t("col", { style: { width: D[n] } }, n)) }),
      /* @__PURE__ */ t("tbody", { children: Array.from({ length: 5 }).map((n, s) => /* @__PURE__ */ t(xr, {}, s)) })
    ] }) : e.length === 0 ? /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-16 text-muted font-sans text-sm", children: "No tasks yet." }) : e.map((n, s) => /* @__PURE__ */ d("table", { className: "border-collapse table-fixed", children: [
      /* @__PURE__ */ t("colgroup", { children: ne.map(({ key: l }) => /* @__PURE__ */ t("col", { style: { width: D[l] } }, l)) }),
      /* @__PURE__ */ d("tbody", { children: [
        /* @__PURE__ */ t("tr", { children: /* @__PURE__ */ t("td", { colSpan: ne.length, className: "p-0 border border-neutral-3", children: /* @__PURE__ */ d("div", { className: "flex items-center gap-2 h-14 px-4 bg-surface-panel rounded-t-4", children: [
          /* @__PURE__ */ t(cr, { className: "w-6 h-6 shrink-0 text-muted" }),
          /* @__PURE__ */ t("h3", { className: "flex-1 min-w-0 truncate text-body-l font-semibold text-main font-sans", children: n.title }),
          n.actions
        ] }) }) }),
        n.rows.map((l, i) => /* @__PURE__ */ t(gr, { ...l }, i))
      ] })
    ] }, s))
  ] }) });
}
function Hr({ title: e, isOpen: r, onClose: o, children: n, width: s = "max-w-md" }) {
  const l = X(null), i = X(null), { overlayProps: a, underlayProps: p } = nt(
    { isOpen: r, onClose: o, isDismissable: !0 },
    l
  ), { dialogProps: c, titleProps: v } = ot({}, i);
  return r ? /* @__PURE__ */ t(
    "div",
    {
      ...p,
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      children: /* @__PURE__ */ t(st, { contain: !0, restoreFocus: !0, autoFocus: !0, children: /* @__PURE__ */ t(
        "div",
        {
          ...a,
          ref: l,
          className: b("w-full", s),
          children: /* @__PURE__ */ d(
            "div",
            {
              ...c,
              ref: i,
              className: "flex flex-col bg-surface-overlay rounded-sm border border-subtle overflow-hidden",
              children: [
                /* @__PURE__ */ d("div", { className: "flex items-center justify-between px-4 py-4 border-b border-neutral-4", children: [
                  /* @__PURE__ */ t(
                    "h2",
                    {
                      ...v,
                      className: "font-sans font-bold text-base text-main",
                      children: e
                    }
                  ),
                  /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      onClick: o,
                      "aria-label": "Close modal",
                      className: "flex items-center justify-center w-8 h-8 rounded-md text-muted hover:bg-neutral-4 hover:text-main transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                      children: /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M18 6 6 18M6 6l12 12" }) })
                    }
                  )
                ] }),
                /* @__PURE__ */ t("div", { className: "px-4 py-4", children: n })
              ]
            }
          )
        }
      ) })
    }
  ) : null;
}
function Kr(e = !1) {
  const r = it({ defaultOpen: e });
  return {
    isOpen: r.isOpen,
    open: r.open,
    close: r.close,
    toggle: r.toggle
  };
}
const vr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], yr = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
], wr = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m15 18-6-6 6-6" }) }), kr = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m9 18 6-6-6-6" }) }), Nr = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m18 18-6-6 6-6M12 18l-6-6 6-6" }) }), Cr = () => /* @__PURE__ */ t("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "m6 18 6-6-6-6M12 18l6-6-6-6" }) });
function Mr({
  value: e,
  defaultValue: r,
  onChange: o,
  className: n
}) {
  const s = /* @__PURE__ */ new Date(), [l, i] = oe(r), a = e !== void 0, p = a ? e : l, [c, v] = oe(
    (p ?? s).getFullYear()
  ), [h, w] = oe(
    (p ?? s).getMonth()
  ), k = (x) => {
    a || i(x), o == null || o(x);
  }, C = () => {
    h === 0 ? (w(11), v((x) => x - 1)) : w((x) => x - 1);
  }, N = () => {
    h === 11 ? (w(0), v((x) => x + 1)) : w((x) => x + 1);
  }, I = () => v((x) => x - 1), T = () => v((x) => x + 1), P = () => {
    v(s.getFullYear()), w(s.getMonth()), k(s);
  }, B = new Date(c, h, 1).getDay(), G = new Date(c, h + 1, 0).getDate(), W = new Date(c, h, 0).getDate(), M = [];
  for (let x = B - 1; x >= 0; x--)
    M.push({
      date: new Date(c, h - 1, W - x),
      isCurrentMonth: !1
    });
  for (let x = 1; x <= G; x++)
    M.push({ date: new Date(c, h, x), isCurrentMonth: !0 });
  let z = 1;
  for (; M.length < 42; )
    M.push({ date: new Date(c, h + 1, z++), isCurrentMonth: !1 });
  const f = (x, F) => x.getFullYear() === F.getFullYear() && x.getMonth() === F.getMonth() && x.getDate() === F.getDate();
  return /* @__PURE__ */ d(
    "div",
    {
      className: b(
        "flex flex-col w-[280px] bg-surface-shell border border-subtle rounded-4 shadow-elevation select-none",
        n
      ),
      children: [
        /* @__PURE__ */ d("div", { className: "flex items-center justify-between px-2 py-[9px] h-10", children: [
          /* @__PURE__ */ d("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: I,
                "aria-label": "Previous year",
                className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                children: /* @__PURE__ */ t(Nr, {})
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: C,
                "aria-label": "Previous month",
                className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                children: /* @__PURE__ */ t(wr, {})
              }
            )
          ] }),
          /* @__PURE__ */ d("span", { className: "font-sans font-semibold text-body-sm text-main", children: [
            yr[h],
            " ",
            c
          ] }),
          /* @__PURE__ */ d("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: N,
                "aria-label": "Next month",
                className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                children: /* @__PURE__ */ t(kr, {})
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: T,
                "aria-label": "Next year",
                className: "flex items-center justify-center w-4 h-4 text-main hover:text-interactive transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-1 rounded-xs",
                children: /* @__PURE__ */ t(Cr, {})
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ t("div", { className: "h-px w-full bg-neutral-2" }),
        /* @__PURE__ */ d("div", { className: "flex flex-col px-3 py-2", children: [
          /* @__PURE__ */ t("div", { className: "grid grid-cols-7", children: vr.map((x) => /* @__PURE__ */ t("span", { className: "text-center text-body-sm font-normal text-main font-sans", children: x }, x)) }),
          /* @__PURE__ */ t("div", { className: "grid grid-cols-7", children: M.map(({ date: x, isCurrentMonth: F }, S) => {
            const $ = p ? f(x, p) : !1;
            return /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: () => k(x),
                "aria-label": x.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
                "aria-pressed": $,
                className: b(
                  "flex items-center justify-center w-6 h-6 mx-auto my-[3px] rounded-2 text-body-sm font-normal font-sans transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4",
                  $ ? "border border-primary-4 text-main" : F ? "text-main hover:bg-neutral-3" : "text-muted hover:bg-neutral-3/50"
                ),
                children: x.getDate()
              },
              S
            );
          }) })
        ] }),
        /* @__PURE__ */ t("div", { className: "h-px w-full bg-neutral-2" }),
        /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-[9px] h-10", children: /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: P,
            className: "text-body-sm font-normal font-sans text-interactive hover:opacity-80 transition-opacity cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-xs",
            children: "Today"
          }
        ) })
      ]
    }
  );
}
const zr = [1, 2, 3, 5, 8], Sr = () => /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M6 21V4a1 1 0 0 1 1-1h10.5a1 1 0 0 1 .8 1.6L15 9l3.3 4.4a1 1 0 0 1-.8 1.6H7" }) });
function Lr({ value: e, onSelect: r, className: o }) {
  return /* @__PURE__ */ d(
    "div",
    {
      className: b(
        "flex flex-col w-[122px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        o
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans truncate", children: "Estimate" }) }),
        zr.map((n) => /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            onClick: () => r(n),
            "aria-pressed": e === n,
            className: b(
              "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
              e === n ? "bg-neutral-2" : "hover:bg-neutral-2"
            ),
            children: [
              /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ t(Sr, {}) }),
              n,
              " Point",
              n !== 1 ? "s" : ""
            ]
          },
          n
        ))
      ]
    }
  );
}
function Pr({
  name: e,
  role: r,
  avatarSrc: o,
  size: n = "md",
  isOnline: s = !1,
  className: l,
  onClick: i
}) {
  const a = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm"
  };
  return /* @__PURE__ */ d(
    i ? "button" : "div",
    {
      type: i ? "button" : void 0,
      onClick: i,
      className: b(
        // padding: 4px 16px, gap: 8px -- matches Figma "User" component (Avatar frame, 239x56)
        "flex items-center gap-2 px-4 py-1 min-w-0",
        i && "cursor-pointer hover:opacity-80 transition-opacity outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 rounded-sm",
        l
      ),
      children: [
        /* @__PURE__ */ d("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ t(se, { src: o, name: e, size: n }),
          s ? /* @__PURE__ */ t("span", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary-4 border-2 border-neutral-5" }) : null
        ] }),
        /* @__PURE__ */ d("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ t("span", { className: "font-sans font-normal text-body-m text-main truncate", children: e }),
          r ? /* @__PURE__ */ t(
            "span",
            {
              className: b(
                "font-sans text-muted truncate leading-tight",
                a[n]
              ),
              children: r
            }
          ) : null
        ] })
      ]
    }
  );
}
function jr({ assignees: e, onSelect: r, className: o }) {
  return /* @__PURE__ */ d(
    "div",
    {
      className: b(
        "flex flex-col w-[239px] pt-2 bg-surface-overlay border border-subtle rounded-sm",
        o
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans truncate", children: "Assignee" }) }),
        e.map((n) => /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: () => r(n),
            className: "flex items-center w-full h-14 hover:bg-neutral-2/10 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
            children: /* @__PURE__ */ t(Pr, { name: n.name, role: n.role, avatarSrc: n.avatarSrc, size: "sm" })
          },
          n.id
        ))
      ]
    }
  );
}
function Ir({ labels: e, onSelect: r, className: o }) {
  return /* @__PURE__ */ d(
    "div",
    {
      className: b(
        "flex flex-col w-[160px] py-2 bg-surface-overlay border border-subtle rounded-sm",
        o
      ),
      children: [
        /* @__PURE__ */ t("div", { className: "flex items-center h-8 px-4", children: /* @__PURE__ */ t("span", { className: "text-body-xl font-semibold text-muted font-sans truncate", children: "Label" }) }),
        e.map((n) => /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            onClick: () => r(n),
            className: "flex items-center w-full px-4 py-1.5 hover:bg-neutral-2/10 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
            children: /* @__PURE__ */ t(Y, { variant: n.variant ?? "neutral", children: n.text })
          },
          n.id
        ))
      ]
    }
  );
}
const Ge = () => /* @__PURE__ */ t("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: /* @__PURE__ */ t("path", { d: "M6 21V4a1 1 0 0 1 1-1h10.5a1 1 0 0 1 .8 1.6L15 9l3.3 4.4a1 1 0 0 1-.8 1.6H7" }) }), Tr = () => /* @__PURE__ */ d("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("circle", { cx: "12", cy: "8", r: "4" }),
  /* @__PURE__ */ t("path", { d: "M4 20c0-4 3.5-6 8-6s8 2 8 6" })
] }), Ar = () => /* @__PURE__ */ d("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
  /* @__PURE__ */ t("path", { d: "M3 10h18M8 3v4M16 3v4" })
] }), Rr = () => /* @__PURE__ */ d("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className: "w-full h-full", "aria-hidden": !0, children: [
  /* @__PURE__ */ t("path", { d: "M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l7.17-7.17a2 2 0 0 0 0-2.82z" }),
  /* @__PURE__ */ t("circle", { cx: "7.5", cy: "7.5", r: "1.5", fill: "currentColor", stroke: "none" })
] });
function Jr({
  isOpen: e,
  onClose: r,
  assignees: o = [],
  labels: n = [],
  onSubmit: s,
  initialTitle: l = "",
  initialDueDate: i,
  initialPoints: a,
  initialAssignee: p,
  initialLabel: c,
  className: v
}) {
  const [h, w] = K.useState(l), [k, C] = K.useState(i), [N, I] = K.useState(a), [T, P] = K.useState(p), [B, G] = K.useState(c), [W, M] = K.useState(null), z = (S) => M(($) => $ === S ? null : S);
  if (!e) return null;
  const f = () => {
    w(""), C(void 0), I(void 0), P(void 0), G(void 0), M(null);
  }, x = (S) => {
    S.preventDefault(), h.trim() && (s == null || s({ title: h.trim(), dueDate: k, points: N, assignee: T, label: B }), f(), r());
  }, F = () => {
    f(), r();
  };
  return /* @__PURE__ */ d(
    "form",
    {
      onSubmit: x,
      className: b(
        "flex flex-col items-end gap-6 w-[578px] p-4 bg-surface-overlay rounded-sm",
        v
      ),
      children: [
        /* @__PURE__ */ t(
          "input",
          {
            autoFocus: !0,
            value: h,
            onChange: (S) => w(S.target.value),
            placeholder: "Task name",
            "aria-label": "Task name",
            className: "w-full bg-transparent text-body-xl font-semibold text-main placeholder:text-muted font-sans outline-none"
          }
        ),
        /* @__PURE__ */ d("div", { className: "flex items-center gap-4 w-full", children: [
          /* @__PURE__ */ d("div", { className: "relative", children: [
            N === void 0 ? /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: () => z("estimate"),
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(Y, { icon: /* @__PURE__ */ t(Ge, {}), children: "Estimate" })
              }
            ) : /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                onClick: () => z("estimate"),
                className: "flex items-center gap-2 h-8 px-4 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ t("span", { className: "w-6 h-6 shrink-0", children: /* @__PURE__ */ t(Ge, {}) }),
                  N,
                  " Point",
                  N !== 1 ? "s" : ""
                ]
              }
            ),
            W === "estimate" ? /* @__PURE__ */ t(
              Lr,
              {
                value: N,
                onSelect: (S) => {
                  I(S), M(null);
                },
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] }),
          /* @__PURE__ */ d("div", { className: "relative", children: [
            T ? /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                onClick: () => z("assignee"),
                className: "flex items-center gap-2 h-8 px-2 rounded-xs text-body-m font-normal text-main font-sans hover:bg-neutral-2 transition-colors cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: [
                  /* @__PURE__ */ t(se, { src: T.avatarSrc, name: T.name, size: "sm" }),
                  T.name
                ]
              }
            ) : /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: () => z("assignee"),
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(Y, { icon: /* @__PURE__ */ t(Tr, {}), children: "Assignee" })
              }
            ),
            W === "assignee" ? /* @__PURE__ */ t(
              jr,
              {
                assignees: o,
                onSelect: (S) => {
                  P(S), M(null);
                },
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] }),
          /* @__PURE__ */ d("div", { className: "relative", children: [
            B ? /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: () => z("label"),
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(Y, { variant: B.variant ?? "neutral", children: B.text })
              }
            ) : /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: () => z("label"),
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(Y, { icon: /* @__PURE__ */ t(Rr, {}), children: "Label" })
              }
            ),
            W === "label" ? /* @__PURE__ */ t(
              Ir,
              {
                labels: n,
                onSelect: (S) => {
                  G(S), M(null);
                },
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] }),
          /* @__PURE__ */ d("div", { className: "relative", children: [
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: () => z("date"),
                className: "cursor-pointer rounded outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2",
                children: /* @__PURE__ */ t(Y, { icon: /* @__PURE__ */ t(Ar, {}), children: k ? k.toLocaleDateString("en-US") : "Due date" })
              }
            ),
            W === "date" ? /* @__PURE__ */ t(
              Mr,
              {
                value: k,
                onChange: (S) => {
                  C(S), M(null);
                },
                className: "absolute top-full left-0 mt-1 z-10"
              }
            ) : null
          ] })
        ] }),
        /* @__PURE__ */ d("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ t(Be, { variant: "secondary", onPress: F, children: "Cancel" }),
          /* @__PURE__ */ t(Be, { variant: "primary", type: "submit", isDisabled: !h.trim(), children: "Create Task" })
        ] })
      ]
    }
  );
}
function Xr({ variant: e = "neutral", children: r, className: o }) {
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
        o
      ),
      children: r
    }
  );
}
function qr({
  children: e,
  isSelected: r,
  defaultSelected: o = !1,
  onChange: n,
  isDisabled: s = !1,
  isIndeterminate: l = !1,
  className: i
}) {
  const a = at({
    isSelected: r,
    defaultSelected: o,
    onChange: n
  }), p = X(null), { inputProps: c, labelProps: v } = lt(
    {
      isSelected: a.isSelected,
      isIndeterminate: l,
      isDisabled: s,
      "aria-label": typeof e == "string" ? e : "Checkbox"
    },
    a,
    p
  );
  return /* @__PURE__ */ d(
    "label",
    {
      ...v,
      className: b(
        // padding: 4px 16px, gap: 8px, border-radius: 4px (Tailwind's unmodified
        // `rounded` step) -- matches Figma "Label Checkbox" component exactly
        // (Property 1=Default/Selected, Tags01.md / Add Task Modal04/05.md).
        "inline-flex items-center gap-2 px-4 py-1 rounded cursor-pointer select-none group has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-4 has-[:focus-visible]:outline-offset-2",
        s && "opacity-50 cursor-not-allowed",
        i
      ),
      children: [
        /* @__PURE__ */ t("input", { ...c, ref: p, className: "sr-only" }),
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
              a.isSelected && !l ? /* @__PURE__ */ t("path", { d: "M8 12.5 11 15.5 16 9.5", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }) : l ? /* @__PURE__ */ t("path", { d: "M8 12h8", strokeWidth: 2, strokeLinecap: "round" }) : null
            ]
          }
        ),
        /* @__PURE__ */ t("span", { className: "text-body-m font-normal font-sans text-main", children: e })
      ]
    }
  );
}
function Qr({ label: e, error: r, className: o, ...n }) {
  const s = X(null), { labelProps: l, inputProps: i, errorMessageProps: a } = we(
    { ...n, label: e, type: "date", isInvalid: !!r, errorMessage: r },
    s
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
        ...i,
        ref: s,
        type: "date",
        className: b(
          "h-10 px-3 py-2 text-sm bg-surface-neutral text-neutral-5 border border-subtle rounded-md transition-colors outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:outline-offset-2 focus-visible:border-transparent disabled:opacity-50 disabled:bg-surface-neutral font-sans cursor-pointer",
          r && "border-danger-5 focus-visible:outline-danger-5",
          o
        )
      }
    ),
    r ? /* @__PURE__ */ t("span", { ...a, className: "text-xs text-danger font-sans", children: r }) : null
  ] });
}
function Wr({
  icon: e,
  label: r,
  isActive: o = !1,
  badgeCount: n,
  onClick: s,
  className: l
}) {
  return /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      onClick: s,
      "aria-current": o ? "page" : void 0,
      className: b(
        "relative w-full h-14 flex items-center gap-4 pl-4 font-sans text-body-m font-semibold transition-colors cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-primary-4 focus-visible:-outline-offset-2",
        o ? "text-interactive bg-gradient-to-r from-transparent to-primary-4/10" : "text-muted hover:text-interactive",
        l
      ),
      children: [
        e ? /* @__PURE__ */ t("span", { className: "flex items-center justify-center w-6 h-6 shrink-0", children: e }) : null,
        /* @__PURE__ */ t("span", { className: "flex-1 truncate", children: r }),
        n !== void 0 ? /* @__PURE__ */ t(
          "span",
          {
            className: b(
              "px-2 py-0.5 text-xs font-bold rounded-full shrink-0",
              o ? "bg-primary-4 text-main" : "bg-neutral-3 text-main"
            ),
            children: n
          }
        ) : null,
        /* @__PURE__ */ t(
          "span",
          {
            className: b(
              "w-1 h-full shrink-0 bg-primary-4 transition-opacity",
              o ? "opacity-100" : "opacity-0"
            )
          }
        )
      ]
    }
  );
}
function Dr({ logo: e, items: r, className: o }) {
  return /* @__PURE__ */ d(
    "nav",
    {
      "aria-label": "Main navigation",
      className: b(
        // 232px / rounded-lg (24px) matches the real "Sidebar" layer (ApplicationSidebar01.md + Dashboard Mockup.md).
        "flex flex-col w-[232px] h-full bg-surface-panel rounded-lg select-none shrink-0",
        o
      ),
      children: [
        e ? /* @__PURE__ */ t("div", { className: "flex justify-center pt-3 h-24 shrink-0", children: e }) : null,
        /* @__PURE__ */ t("div", { className: "flex flex-col gap-2 flex-1 overflow-y-auto", children: r.map((n, s) => /* @__PURE__ */ t(Wr, { ...n }, s)) })
      ]
    }
  );
}
function Zr({
  value: e,
  onChange: r,
  leftIcon: o,
  rightIcon: n,
  leftLabel: s,
  rightLabel: l,
  className: i
}) {
  return /* @__PURE__ */ d("div", { className: b("flex items-center w-20 h-10 bg-surface-shell rounded-sm", i), children: [
    /* @__PURE__ */ t(
      De,
      {
        variant: "secondary",
        isSelected: e === "left",
        "aria-label": s,
        onPress: () => r == null ? void 0 : r("left"),
        children: o
      }
    ),
    /* @__PURE__ */ t(
      De,
      {
        variant: "secondary",
        isSelected: e === "right",
        "aria-label": l,
        onPress: () => r == null ? void 0 : r("right"),
        children: n
      }
    )
  ] });
}
function en({ logo: e, sidebarItems: r, topNavProps: o, topBar: n, children: s, className: l }) {
  return /* @__PURE__ */ d("div", { className: b("flex items-start gap-8 w-full min-h-screen bg-surface-shell p-8", l), children: [
    /* @__PURE__ */ t(Dr, { logo: e, items: r, className: "self-stretch" }),
    /* @__PURE__ */ d("div", { className: "flex flex-col gap-8 flex-1 min-w-0", children: [
      /* @__PURE__ */ t(or, { ...o }),
      /* @__PURE__ */ d("div", { className: "flex flex-col gap-4", children: [
        n ? /* @__PURE__ */ t("div", { className: "flex items-start justify-between gap-6", children: n }) : null,
        s
      ] })
    ] })
  ] });
}
export {
  Jr as AddTaskModal,
  en as AppShell,
  Dr as ApplicationSidebar,
  jr as AssigneeModal,
  fr as AssigneeNameCell,
  se as Avatar,
  Xr as Badge,
  De as Button,
  $r as Card,
  Mr as DatePickerMenu,
  Qr as Datepicker,
  mr as DueDateCell,
  Lr as EstimateModal,
  pr as EstimationCell,
  Er as Input,
  qr as LabelCheckbox,
  Ir as LabelModal,
  Hr as Modal,
  tt as ProjectInfo,
  tr as SearchBar,
  _r as SegmentedControl,
  Wr as SidebarItem,
  V as Skeleton,
  Fr as Tabs,
  Y as Tag,
  br as TagCell,
  ar as TaskCard,
  Ur as TaskListView,
  sr as TaskMetaBadges,
  Yr as TaskTable,
  gr as TaskTableRow,
  Be as TextButton,
  or as TopNav,
  Pr as UserRow,
  Zr as ViewSwitcher,
  b as cn,
  Kr as useModal
};
