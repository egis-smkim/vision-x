/*!
 * Name    : Just Another Parallax [Jarallax]
 * Version : 1.12.0
 * Author  : nK <https://nkdev.info>
 * GitHub  : https://github.com/nk-o/jarallax
 */
!function(n) {
    var o = {};
    function i(e) {
        if (o[e])
            return o[e].exports;
        var t = o[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return n[e].call(t.exports, t, t.exports, i),
        t.l = !0,
        t.exports
    }
    i.m = n,
    i.c = o,
    i.d = function(e, t, n) {
        i.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        })
    }
    ,
    i.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    i.t = function(t, e) {
        if (1 & e && (t = i(t)),
        8 & e)
            return t;
        if (4 & e && "object" == typeof t && t && t.__esModule)
            return t;
        var n = Object.create(null);
        if (i.r(n),
        Object.defineProperty(n, "default", {
            enumerable: !0,
            value: t
        }),
        2 & e && "string" != typeof t)
            for (var o in t)
                i.d(n, o, function(e) {
                    return t[e]
                }
                .bind(null, o));
        return n
    }
    ,
    i.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return i.d(t, "a", t),
        t
    }
    ,
    i.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    i.p = "",
    i(i.s = 11)
}([, , function(e, t) {
    e.exports = function(e) {
        "complete" === document.readyState || "interactive" === document.readyState ? e.call() : document.attachEvent ? document.attachEvent("onreadystatechange", function() {
            "interactive" === document.readyState && e.call()
        }) : document.addEventListener && document.addEventListener("DOMContentLoaded", e)
    }
}
, , function(n, e, t) {
    (function(e) {
        var t;
        t = "undefined" != typeof window ? window : void 0 !== e ? e : "undefined" != typeof self ? self : {},
        n.exports = t
    }
    ).call(this, t(5))
}
, function(e, t) {
    function n(e) {
        return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    var o;
    o = function() {
        return this
    }();
    try {
        o = o || new Function("return this")()
    } catch (e) {
        "object" === ("undefined" == typeof window ? "undefined" : n(window)) && (o = window)
    }
    e.exports = o
}
, , , , , , function(e, t, n) {
    e.exports = n(12)
}
, function(e, t, n) {
    "use strict";
    n.r(t);
    var o = n(2)
      , i = n.n(o)
      , a = n(4)
      , r = n(13);
    function l(e) {
        return (l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    var s = a.window.jarallax;
    if (a.window.jarallax = r.default,
    a.window.jarallax.noConflict = function() {
        return a.window.jarallax = s,
        this
    }
    ,
    void 0 !== a.jQuery) {
        var c = function() {
            var e = arguments || [];
            Array.prototype.unshift.call(e, this);
            var t = r.default.apply(a.window, e);
            return "object" !== l(t) ? t : this
        };
        c.constructor = r.default.constructor;
        var u = a.jQuery.fn.jarallax;
        a.jQuery.fn.jarallax = c,
        a.jQuery.fn.jarallax.noConflict = function() {
            return a.jQuery.fn.jarallax = u,
            this
        }
    }
    i()(function() {
        Object(r.default)(document.querySelectorAll("[data-jarallax]"))
    })
}
, function(e, t, n) {
    "use strict";
    n.r(t);
    var o = n(2)
      , i = n.n(o)
      , a = n(14)
      , r = n.n(a)
      , b = n(4);
    function c(e, t) {
        return function(e) {
            if (Array.isArray(e))
                return e
        }(e) || function(e, t) {
            if (!(Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)))
                return;
            var n = []
              , o = !0
              , i = !1
              , a = void 0;
            try {
                for (var r, l = e[Symbol.iterator](); !(o = (r = l.next()).done) && (n.push(r.value),
                !t || n.length !== t); o = !0)
                    ;
            } catch (e) {
                i = !0,
                a = e
            } finally {
                try {
                    o || null == l.return || l.return()
                } finally {
                    if (i)
                        throw a
                }
            }
            return n
        }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }()
    }
    function u(e) {
        return (u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    function l(e, t) {
        for (var n = 0; n < t.length; n++) {
            var o = t[n];
            o.enumerable = o.enumerable || !1,
            o.configurable = !0,
            "value"in o && (o.writable = !0),
            Object.defineProperty(e, o.key, o)
        }
    }
    var s, v, m = -1 < navigator.userAgent.indexOf("MSIE ") || -1 < navigator.userAgent.indexOf("Trident/") || -1 < navigator.userAgent.indexOf("Edge/"), p = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), d = function() {
        for (var e = "transform WebkitTransform MozTransform".split(" "), t = document.createElement("div"), n = 0; n < e.length; n++)
            if (t && void 0 !== t.style[e[n]])
                return e[n];
        return !1
    }();
    function f() {
        v = p ? (!s && document.body && ((s = document.createElement("div")).style.cssText = "position: fixed; top: -9999px; left: 0; height: 100vh; width: 0;",
        document.body.appendChild(s)),
        (s ? s.clientHeight : 0) || b.window.innerHeight || document.documentElement.clientHeight) : b.window.innerHeight || document.documentElement.clientHeight
    }
    f(),
    b.window.addEventListener("resize", f),
    b.window.addEventListener("orientationchange", f),
    b.window.addEventListener("load", f),
    i()(function() {
        f()
    });
    var g = [];
    function y() {
        g.length && (g.forEach(function(e, t) {
            var n = e.instance
              , o = e.oldData
              , i = n.$item.getBoundingClientRect()
              , a = {
                width: i.width,
                height: i.height,
                top: i.top,
                bottom: i.bottom,
                wndW: b.window.innerWidth,
                wndH: v
            }
              , r = !o || o.wndW !== a.wndW || o.wndH !== a.wndH || o.width !== a.width || o.height !== a.height
              , l = r || !o || o.top !== a.top || o.bottom !== a.bottom;
            g[t].oldData = a,
            r && n.onResize(),
            l && n.onScroll()
        }),
        r()(y))
    }
    function h(e, t) {
        ("object" === ("undefined" == typeof HTMLElement ? "undefined" : u(HTMLElement)) ? e instanceof HTMLElement : e && "object" === u(e) && null !== e && 1 === e.nodeType && "string" == typeof e.nodeName) && (e = [e]);
        for (var n, o = t, i = Array.prototype.slice.call(arguments, 2), a = e.length, r = 0; r < a; r++)
            if ("object" === u(o) || void 0 === o ? e[r].jarallax || (e[r].jarallax = new w(e[r],o)) : e[r].jarallax && (n = e[r].jarallax[o].apply(e[r].jarallax, i)),
            void 0 !== n)
                return n;
        return e
    }
    var x = 0
      , w = function() {
        function s(e, t) {
            !function(e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function")
            }(this, s);
            var n = this;
            n.instanceID = x++,
            n.$item = e,
            n.defaults = {
                type: "scroll",
                speed: .5,
                imgSrc: null,
                imgElement: ".jarallax-img",
                imgSize: "cover",
                imgPosition: "50% 50%",
                imgRepeat: "no-repeat",
                keepImg: !1,
                elementInViewport: null,
                zIndex: -100,
                disableParallax: !1,
                disableVideo: !1,
                videoSrc: null,
                videoStartTime: 0,
                videoEndTime: 0,
                videoVolume: 0,
                videoLoop: !0,
                videoPlayOnlyVisible: !0,
                videoLazyLoading: !0,
                onScroll: null,
                onInit: null,
                onDestroy: null,
                onCoverImage: null
            };
            var o = n.$item.dataset || {}
              , i = {};
            if (Object.keys(o).forEach(function(e) {
                var t = e.substr(0, 1).toLowerCase() + e.substr(1);
                t && void 0 !== n.defaults[t] && (i[t] = o[e])
            }),
            n.options = n.extend({}, n.defaults, i, t),
            n.pureOptions = n.extend({}, n.options),
            Object.keys(n.options).forEach(function(e) {
                "true" === n.options[e] ? n.options[e] = !0 : "false" === n.options[e] && (n.options[e] = !1)
            }),
            n.options.speed = Math.min(2, Math.max(-1, parseFloat(n.options.speed))),
            "string" == typeof n.options.disableParallax && (n.options.disableParallax = new RegExp(n.options.disableParallax)),
            n.options.disableParallax instanceof RegExp) {
                var a = n.options.disableParallax;
                n.options.disableParallax = function() {
                    return a.test(navigator.userAgent)
                }
            }
            if ("function" != typeof n.options.disableParallax && (n.options.disableParallax = function() {
                return !1
            }
            ),
            "string" == typeof n.options.disableVideo && (n.options.disableVideo = new RegExp(n.options.disableVideo)),
            n.options.disableVideo instanceof RegExp) {
                var r = n.options.disableVideo;
                n.options.disableVideo = function() {
                    return r.test(navigator.userAgent)
                }
            }
            "function" != typeof n.options.disableVideo && (n.options.disableVideo = function() {
                return !1
            }
            );
            var l = n.options.elementInViewport;
            l && "object" === u(l) && void 0 !== l.length && (l = c(l, 1)[0]);
            l instanceof Element || (l = null),
            n.options.elementInViewport = l,
            n.image = {
                src: n.options.imgSrc || null,
                $container: null,
                useImgTag: !1,
                position: /iPad|iPhone|iPod|Android/.test(navigator.userAgent) ? "absolute" : "fixed"
            },
            n.initImg() && n.canInitParallax() && n.init()
        }
        return function(e, t, n) {
            t && l(e.prototype, t),
            n && l(e, n)
        }(s, [{
            key: "css",
            value: function(t, n) {
                return "string" == typeof n ? b.window.getComputedStyle(t).getPropertyValue(n) : (n.transform && d && (n[d] = n.transform),
                Object.keys(n).forEach(function(e) {
                    t.style[e] = n[e]
                }),
                t)
            }
        }, {
            key: "extend",
            value: function(n) {
                var o = arguments;
                return n = n || {},
                Object.keys(arguments).forEach(function(t) {
                    o[t] && Object.keys(o[t]).forEach(function(e) {
                        n[e] = o[t][e]
                    })
                }),
                n
            }
        }, {
            key: "getWindowData",
            value: function() {
                return {
                    width: b.window.innerWidth || document.documentElement.clientWidth,
                    height: v,
                    y: document.documentElement.scrollTop
                }
            }
        }, {
            key: "initImg",
            value: function() {
                var e = this
                  , t = e.options.imgElement;
                return t && "string" == typeof t && (t = e.$item.querySelector(t)),
                t instanceof Element || (e.options.imgSrc ? (t = new Image).src = e.options.imgSrc : t = null),
                t && (e.options.keepImg ? e.image.$item = t.cloneNode(!0) : (e.image.$item = t,
                e.image.$itemParent = t.parentNode),
                e.image.useImgTag = !0),
                !!e.image.$item || (null === e.image.src && (e.image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                e.image.bgImage = e.css(e.$item, "background-image")),
                !(!e.image.bgImage || "none" === e.image.bgImage))
            }
        }, {
            key: "canInitParallax",
            value: function() {
                return d && !this.options.disableParallax()
            }
        }, {
            key: "init",
            value: function() {
                var e = this
                  , t = {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    pointerEvents: "none"
                }
                  , n = {};
                if (!e.options.keepImg) {
                    var o = e.$item.getAttribute("style");
                    if (o && e.$item.setAttribute("data-jarallax-original-styles", o),
                    e.image.useImgTag) {
                        var i = e.image.$item.getAttribute("style");
                        i && e.image.$item.setAttribute("data-jarallax-original-styles", i)
                    }
                }
                if ("static" === e.css(e.$item, "position") && e.css(e.$item, {
                    position: "relative"
                }),
                "auto" === e.css(e.$item, "z-index") && e.css(e.$item, {
                    zIndex: 0
                }),
                e.image.$container = document.createElement("div"),
                e.css(e.image.$container, t),
                e.css(e.image.$container, {
                    "z-index": e.options.zIndex
                }),
                m && e.css(e.image.$container, {
                    opacity: .9999
                }),
                e.image.$container.setAttribute("id", "jarallax-container-".concat(e.instanceID)),
                e.$item.appendChild(e.image.$container),
                e.image.useImgTag ? n = e.extend({
                    "object-fit": e.options.imgSize,
                    "object-position": e.options.imgPosition,
                    "font-family": "object-fit: ".concat(e.options.imgSize, "; object-position: ").concat(e.options.imgPosition, ";"),
                    "max-width": "none"
                }, t, n) : (e.image.$item = document.createElement("div"),
                e.image.src && (n = e.extend({
                    "background-position": e.options.imgPosition,
                    "background-size": e.options.imgSize,
                    "background-repeat": e.options.imgRepeat,
                    "background-image": e.image.bgImage || 'url("'.concat(e.image.src, '")')
                }, t, n))),
                "opacity" !== e.options.type && "scale" !== e.options.type && "scale-opacity" !== e.options.type && 1 !== e.options.speed || (e.image.position = "absolute"),
                "fixed" === e.image.position) {
                    var a = function(e) {
                        for (var t = []; null !== e.parentElement; )
                            1 === (e = e.parentElement).nodeType && t.push(e);
                        return t
                    }(e.$item).filter(function(e) {
                        var t = b.window.getComputedStyle(e)
                          , n = t["-webkit-transform"] || t["-moz-transform"] || t.transform;
                        return n && "none" !== n || /(auto|scroll)/.test(t.overflow + t["overflow-y"] + t["overflow-x"])
                    });
                    e.image.position = a.length ? "absolute" : "fixed"
                }
                n.position = e.image.position,
                e.css(e.image.$item, n),
                e.image.$container.appendChild(e.image.$item),
                e.onResize(),
                e.onScroll(!0),
                e.options.onInit && e.options.onInit.call(e),
                "none" !== e.css(e.$item, "background-image") && e.css(e.$item, {
                    "background-image": "none"
                }),
                e.addToParallaxList()
            }
        }, {
            key: "addToParallaxList",
            value: function() {
                g.push({
                    instance: this
                }),
                1 === g.length && y()
            }
        }, {
            key: "removeFromParallaxList",
            value: function() {
                var n = this;
                g.forEach(function(e, t) {
                    e.instance.instanceID === n.instanceID && g.splice(t, 1)
                })
            }
        }, {
            key: "destroy",
            value: function() {
                var e = this;
                e.removeFromParallaxList();
                var t = e.$item.getAttribute("data-jarallax-original-styles");
                if (e.$item.removeAttribute("data-jarallax-original-styles"),
                t ? e.$item.setAttribute("style", t) : e.$item.removeAttribute("style"),
                e.image.useImgTag) {
                    var n = e.image.$item.getAttribute("data-jarallax-original-styles");
                    e.image.$item.removeAttribute("data-jarallax-original-styles"),
                    n ? e.image.$item.setAttribute("style", t) : e.image.$item.removeAttribute("style"),
                    e.image.$itemParent && e.image.$itemParent.appendChild(e.image.$item)
                }
                e.$clipStyles && e.$clipStyles.parentNode.removeChild(e.$clipStyles),
                e.image.$container && e.image.$container.parentNode.removeChild(e.image.$container),
                e.options.onDestroy && e.options.onDestroy.call(e),
                delete e.$item.jarallax
            }
        }, {
            key: "clipContainer",
            value: function() {
                if ("fixed" === this.image.position) {
                    var e = this
                      , t = e.image.$container.getBoundingClientRect()
                      , n = t.width
                      , o = t.height;
                    if (!e.$clipStyles)
                        e.$clipStyles = document.createElement("style"),
                        e.$clipStyles.setAttribute("type", "text/css"),
                        e.$clipStyles.setAttribute("id", "jarallax-clip-".concat(e.instanceID)),
                        (document.head || document.getElementsByTagName("head")[0]).appendChild(e.$clipStyles);
                    var i = "#jarallax-container-".concat(e.instanceID, " {\n           clip: rect(0 ").concat(n, "px ").concat(o, "px 0);\n           clip: rect(0, ").concat(n, "px, ").concat(o, "px, 0);\n        }");
                    e.$clipStyles.styleSheet ? e.$clipStyles.styleSheet.cssText = i : e.$clipStyles.innerHTML = i
                }
            }
        }, {
            key: "coverImage",
            value: function() {
                var e = this
                  , t = e.image.$container.getBoundingClientRect()
                  , n = t.height
                  , o = e.options.speed
                  , i = "scroll" === e.options.type || "scroll-opacity" === e.options.type
                  , a = 0
                  , r = n
                  , l = 0;
                return i && (o < 0 ? (a = o * Math.max(n, v),
                v < n && (a -= o * (n - v))) : a = o * (n + v),
                1 < o ? r = Math.abs(a - v) : o < 0 ? r = a / o + Math.abs(a) : r += (v - n) * (1 - o),
                a /= 2),
                e.parallaxScrollDistance = a,
                l = i ? (v - r) / 2 : (n - r) / 2,
                e.css(e.image.$item, {
                    height: "".concat(r, "px"),
                    marginTop: "".concat(l, "px"),
                    left: "fixed" === e.image.position ? "".concat(t.left, "px") : "0",
                    width: "".concat(t.width, "px")
                }),
                e.options.onCoverImage && e.options.onCoverImage.call(e),
                {
                    image: {
                        height: r,
                        marginTop: l
                    },
                    container: t
                }
            }
        }, {
            key: "isVisible",
            value: function() {
                return this.isElementInViewport || !1
            }
        }, {
            key: "onScroll",
            value: function(e) {
                var t = this
                  , n = t.$item.getBoundingClientRect()
                  , o = n.top
                  , i = n.height
                  , a = {}
                  , r = n;
                if (t.options.elementInViewport && (r = t.options.elementInViewport.getBoundingClientRect()),
                t.isElementInViewport = 0 <= r.bottom && 0 <= r.right && r.top <= v && r.left <= b.window.innerWidth,
                e || t.isElementInViewport) {
                    var l = Math.max(0, o)
                      , s = Math.max(0, i + o)
                      , c = Math.max(0, -o)
                      , u = Math.max(0, o + i - v)
                      , m = Math.max(0, i - (o + i - v))
                      , p = Math.max(0, -o + v - i)
                      , d = 1 - 2 * (v - o) / (v + i)
                      , f = 1;
                    if (i < v ? f = 1 - (c || u) / i : s <= v ? f = s / v : m <= v && (f = m / v),
                    "opacity" !== t.options.type && "scale-opacity" !== t.options.type && "scroll-opacity" !== t.options.type || (a.transform = "translate3d(0,0,0)",
                    a.opacity = f),
                    "scale" === t.options.type || "scale-opacity" === t.options.type) {
                        var g = 1;
                        t.options.speed < 0 ? g -= t.options.speed * f : g += t.options.speed * (1 - f),
                        a.transform = "scale(".concat(g, ") translate3d(0,0,0)")
                    }
                    if ("scroll" === t.options.type || "scroll-opacity" === t.options.type) {
                        var y = t.parallaxScrollDistance * d;
                        "absolute" === t.image.position && (y -= o),
                        a.transform = "translate3d(0,".concat(y, "px,0)")
                    }
                    t.css(t.image.$item, a),
                    t.options.onScroll && t.options.onScroll.call(t, {
                        section: n,
                        beforeTop: l,
                        beforeTopEnd: s,
                        afterTop: c,
                        beforeBottom: u,
                        beforeBottomEnd: m,
                        afterBottom: p,
                        visiblePercent: f,
                        fromViewportCenter: d
                    })
                }
            }
        }, {
            key: "onResize",
            value: function() {
                this.coverImage(),
                this.clipContainer()
            }
        }]),
        s
    }();
    h.constructor = w,
    t.default = h
}
, function(e, t, n) {
    var o = n(15)
      , i = o.requestAnimationFrame || o.webkitRequestAnimationFrame || o.mozRequestAnimationFrame || function(e) {
        var t = +new Date
          , n = Math.max(0, 16 - (t - a))
          , o = setTimeout(e, n);
        return a = t,
        o
    }
      , a = +new Date;
    var r = o.cancelAnimationFrame || o.webkitCancelAnimationFrame || o.mozCancelAnimationFrame || clearTimeout;
    Function.prototype.bind && (i = i.bind(o),
    r = r.bind(o)),
    (e.exports = i).cancel = r
}
, function(n, e, t) {
    (function(e) {
        var t;
        t = "undefined" != typeof window ? window : void 0 !== e ? e : "undefined" != typeof self ? self : {},
        n.exports = t
    }
    ).call(this, t(5))
}
]);
//# sourceMappingURL=jarallax.min.js.map

/*!
 * Name    : Elements Extension for Jarallax
 * Version : 1.0.0
 * Author  : nK <https://nkdev.info>
 * GitHub  : https://github.com/nk-o/jarallax
 */
!function(n) {
    var o = {};
    function r(t) {
        if (o[t])
            return o[t].exports;
        var e = o[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return n[t].call(e.exports, e, e.exports, r),
        e.l = !0,
        e.exports
    }
    r.m = n,
    r.c = o,
    r.d = function(t, e, n) {
        r.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: n
        })
    }
    ,
    r.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }
    ,
    r.t = function(e, t) {
        if (1 & t && (e = r(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var n = Object.create(null);
        if (r.r(n),
        Object.defineProperty(n, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var o in e)
                r.d(n, o, function(t) {
                    return e[t]
                }
                .bind(null, o));
        return n
    }
    ,
    r.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default
        }
        : function() {
            return t
        }
        ;
        return r.d(e, "a", e),
        e
    }
    ,
    r.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }
    ,
    r.p = "",
    r(r.s = 0)
}([function(t, e, n) {
    t.exports = n(1)
}
, function(t, e, n) {
    "use strict";
    n.r(e);
    var o = n(2)
      , r = n.n(o)
      , i = n(3);
    Object(i.default)(),
    r()(function() {
        "undefined" != typeof jarallax && jarallax(document.querySelectorAll("[data-jarallax-element]"))
    })
}
, function(t, e) {
    t.exports = function(t) {
        "complete" === document.readyState || "interactive" === document.readyState ? t.call() : document.attachEvent ? document.attachEvent("onreadystatechange", function() {
            "interactive" === document.readyState && t.call()
        }) : document.addEventListener && document.addEventListener("DOMContentLoaded", t)
    }
}
, function(t, e, n) {
    "use strict";
    n.r(e),
    n.d(e, "default", function() {
        return i
    });
    var o = n(4)
      , r = n.n(o);
    function i() {
        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : r.a.jarallax;
        if (void 0 !== t) {
            var e = t.constructor;
            ["initImg", "canInitParallax", "init", "destroy", "clipContainer", "coverImage", "isVisible", "onScroll", "onResize"].forEach(function(f) {
                var m = e.prototype[f];
                e.prototype[f] = function() {
                    var t = this
                      , e = arguments || [];
                    if ("initImg" === f && null !== t.$item.getAttribute("data-jarallax-element") && (t.options.type = "element",
                    t.pureOptions.speed = t.$item.getAttribute("data-jarallax-element") || t.pureOptions.speed),
                    "element" !== t.options.type)
                        return m.apply(t, e);
                    switch (t.pureOptions.threshold = t.$item.getAttribute("data-threshold") || "",
                    f) {
                    case "init":
                        var n = t.pureOptions.speed.split(" ");
                        t.options.speed = t.pureOptions.speed || 0,
                        t.options.speedY = n[0] ? parseFloat(n[0]) : 0,
                        t.options.speedX = n[1] ? parseFloat(n[1]) : 0;
                        var o = t.pureOptions.threshold.split(" ");
                        t.options.thresholdY = o[0] ? parseFloat(o[0]) : null,
                        t.options.thresholdX = o[1] ? parseFloat(o[1]) : null,
                        m.apply(t, e);
                        var r = t.$item.getAttribute("data-jarallax-original-styles");
                        return r && t.$item.setAttribute("style", r),
                        !0;
                    case "onResize":
                        var i = t.css(t.$item, "transform");
                        t.css(t.$item, {
                            transform: ""
                        });
                        var a = t.$item.getBoundingClientRect();
                        t.itemData = {
                            width: a.width,
                            height: a.height,
                            y: a.top + t.getWindowData().y,
                            x: a.left
                        },
                        t.css(t.$item, {
                            transform: i
                        });
                        break;
                    case "onScroll":
                        var l = t.getWindowData()
                          , s = (l.y + l.height / 2 - t.itemData.y - t.itemData.height / 2) / (l.height / 2)
                          , u = s * t.options.speedY
                          , c = s * t.options.speedX
                          , p = u
                          , d = c;
                        null !== t.options.thresholdY && u > t.options.thresholdY && (p = 0),
                        null !== t.options.thresholdX && c > t.options.thresholdX && (d = 0),
                        t.css(t.$item, {
                            transform: "translate3d(".concat(d, "px,").concat(p, "px,0)")
                        });
                        break;
                    case "initImg":
                    case "isVisible":
                    case "clipContainer":
                    case "coverImage":
                        return !0
                    }
                    return m.apply(t, e)
                }
            })
        }
    }
}
, function(n, t, e) {
    (function(t) {
        var e;
        e = "undefined" != typeof window ? window : void 0 !== t ? t : "undefined" != typeof self ? self : {},
        n.exports = e
    }
    ).call(this, e(5))
}
, function(t, e) {
    function n(t) {
        return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
            return typeof t
        }
        : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }
        )(t)
    }
    var o;
    o = function() {
        return this
    }();
    try {
        o = o || new Function("return this")()
    } catch (t) {
        "object" === ("undefined" == typeof window ? "undefined" : n(window)) && (o = window)
    }
    t.exports = o
}
]);
//# sourceMappingURL=jarallax-element.min.js.map

/*!
 * Name    : Video Background Extension for Jarallax
 * Version : 1.0.1
 * Author  : nK <https://nkdev.info>
 * GitHub  : https://github.com/nk-o/jarallax
 */
!function(o) {
    var i = {};
    function n(e) {
        if (i[e])
            return i[e].exports;
        var t = i[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return o[e].call(t.exports, t, t.exports, n),
        t.l = !0,
        t.exports
    }
    n.m = o,
    n.c = i,
    n.d = function(e, t, o) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
        })
    }
    ,
    n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    n.t = function(t, e) {
        if (1 & e && (t = n(t)),
        8 & e)
            return t;
        if (4 & e && "object" == typeof t && t && t.__esModule)
            return t;
        var o = Object.create(null);
        if (n.r(o),
        Object.defineProperty(o, "default", {
            enumerable: !0,
            value: t
        }),
        2 & e && "string" != typeof t)
            for (var i in t)
                n.d(o, i, function(e) {
                    return t[e]
                }
                .bind(null, i));
        return o
    }
    ,
    n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return n.d(t, "a", t),
        t
    }
    ,
    n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    n.p = "",
    n(n.s = 6)
}([, , function(e, t) {
    e.exports = function(e) {
        "complete" === document.readyState || "interactive" === document.readyState ? e.call() : document.attachEvent ? document.attachEvent("onreadystatechange", function() {
            "interactive" === document.readyState && e.call()
        }) : document.addEventListener && document.addEventListener("DOMContentLoaded", e)
    }
}
, , function(o, e, t) {
    (function(e) {
        var t;
        t = "undefined" != typeof window ? window : void 0 !== e ? e : "undefined" != typeof self ? self : {},
        o.exports = t
    }
    ).call(this, t(5))
}
, function(e, t) {
    function o(e) {
        return (o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    var i;
    i = function() {
        return this
    }();
    try {
        i = i || new Function("return this")()
    } catch (e) {
        "object" === ("undefined" == typeof window ? "undefined" : o(window)) && (i = window)
    }
    e.exports = i
}
, function(e, t, o) {
    e.exports = o(7)
}
, function(e, t, o) {
    "use strict";
    o.r(t);
    var i = o(8)
      , n = o.n(i)
      , a = o(4)
      , r = o.n(a)
      , l = o(2)
      , p = o.n(l)
      , u = o(10);
    r.a.VideoWorker = r.a.VideoWorker || n.a,
    Object(u.default)(),
    p()(function() {
        "undefined" != typeof jarallax && jarallax(document.querySelectorAll("[data-jarallax-video]"))
    })
}
, function(e, t, o) {
    e.exports = o(9)
}
, function(e, t, o) {
    "use strict";
    function n(e) {
        return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        )(e)
    }
    function a(e, t) {
        for (var o = 0; o < t.length; o++) {
            var i = t[o];
            i.enumerable = i.enumerable || !1,
            i.configurable = !0,
            "value"in i && (i.writable = !0),
            Object.defineProperty(e, i.key, i)
        }
    }
    function i() {
        this._done = [],
        this._fail = []
    }
    o.r(t),
    o.d(t, "default", function() {
        return c
    }),
    i.prototype = {
        execute: function(e, t) {
            var o = e.length;
            for (t = Array.prototype.slice.call(t); o--; )
                e[o].apply(null, t)
        },
        resolve: function() {
            this.execute(this._done, arguments)
        },
        reject: function() {
            this.execute(this._fail, arguments)
        },
        done: function(e) {
            this._done.push(e)
        },
        fail: function(e) {
            this._fail.push(e)
        }
    };
    var r = 0
      , l = 0
      , p = 0
      , u = 0
      , s = 0
      , d = new i
      , y = new i
      , c = function() {
        function i(e, t) {
            !function(e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function")
            }(this, i);
            var o = this;
            o.url = e,
            o.options_default = {
                autoplay: !1,
                loop: !1,
                mute: !1,
                volume: 100,
                showContols: !0,
                startTime: 0,
                endTime: 0
            },
            o.options = o.extend({}, o.options_default, t),
            o.videoID = o.parseURL(e),
            o.videoID && (o.ID = r++,
            o.loadAPI(),
            o.init())
        }
        return function(e, t, o) {
            t && a(e.prototype, t),
            o && a(e, o)
        }(i, [{
            key: "extend",
            value: function(o) {
                var i = arguments;
                return o = o || {},
                Object.keys(arguments).forEach(function(t) {
                    i[t] && Object.keys(i[t]).forEach(function(e) {
                        o[e] = i[t][e]
                    })
                }),
                o
            }
        }, {
            key: "parseURL",
            value: function(e) {
                var t, o, i, n, a, r = !(!(t = e.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/)) || 11 !== t[1].length) && t[1], l = !(!(o = e.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/)) || !o[3]) && o[3], p = (i = e.split(/,(?=mp4\:|webm\:|ogv\:|ogg\:)/),
                n = {},
                a = 0,
                i.forEach(function(e) {
                    var t = e.match(/^(mp4|webm|ogv|ogg)\:(.*)/);
                    t && t[1] && t[2] && (n["ogv" === t[1] ? "ogg" : t[1]] = t[2],
                    a = 1)
                }),
                !!a && n);
                return r ? (this.type = "youtube",
                r) : l ? (this.type = "vimeo",
                l) : !!p && (this.type = "local",
                p)
            }
        }, {
            key: "isValid",
            value: function() {
                return !!this.videoID
            }
        }, {
            key: "on",
            value: function(e, t) {
                this.userEventsList = this.userEventsList || [],
                (this.userEventsList[e] || (this.userEventsList[e] = [])).push(t)
            }
        }, {
            key: "off",
            value: function(o, i) {
                var n = this;
                this.userEventsList && this.userEventsList[o] && (i ? this.userEventsList[o].forEach(function(e, t) {
                    e === i && (n.userEventsList[o][t] = !1)
                }) : delete this.userEventsList[o])
            }
        }, {
            key: "fire",
            value: function(e) {
                var t = this
                  , o = [].slice.call(arguments, 1);
                this.userEventsList && void 0 !== this.userEventsList[e] && this.userEventsList[e].forEach(function(e) {
                    e && e.apply(t, o)
                })
            }
        }, {
            key: "play",
            value: function(e) {
                var t = this;
                t.player && ("youtube" === t.type && t.player.playVideo && (void 0 !== e && t.player.seekTo(e || 0),
                YT.PlayerState.PLAYING !== t.player.getPlayerState() && t.player.playVideo()),
                "vimeo" === t.type && (void 0 !== e && t.player.setCurrentTime(e),
                t.player.getPaused().then(function(e) {
                    e && t.player.play()
                })),
                "local" === t.type && (void 0 !== e && (t.player.currentTime = e),
                t.player.paused && t.player.play()))
            }
        }, {
            key: "pause",
            value: function() {
                var t = this;
                t.player && ("youtube" === t.type && t.player.pauseVideo && YT.PlayerState.PLAYING === t.player.getPlayerState() && t.player.pauseVideo(),
                "vimeo" === t.type && t.player.getPaused().then(function(e) {
                    e || t.player.pause()
                }),
                "local" === t.type && (t.player.paused || t.player.pause()))
            }
        }, {
            key: "mute",
            value: function() {
                var e = this;
                e.player && ("youtube" === e.type && e.player.mute && e.player.mute(),
                "vimeo" === e.type && e.player.setVolume && e.player.setVolume(0),
                "local" === e.type && (e.$video.muted = !0))
            }
        }, {
            key: "unmute",
            value: function() {
                var e = this;
                e.player && ("youtube" === e.type && e.player.mute && e.player.unMute(),
                "vimeo" === e.type && e.player.setVolume && e.player.setVolume(e.options.volume),
                "local" === e.type && (e.$video.muted = !1))
            }
        }, {
            key: "setVolume",
            value: function(e) {
                var t = 0 < arguments.length && void 0 !== e && e
                  , o = this;
                o.player && t && ("youtube" === o.type && o.player.setVolume && o.player.setVolume(t),
                "vimeo" === o.type && o.player.setVolume && o.player.setVolume(t),
                "local" === o.type && (o.$video.volume = t / 100))
            }
        }, {
            key: "getVolume",
            value: function(t) {
                var e = this;
                e.player ? ("youtube" === e.type && e.player.getVolume && t(e.player.getVolume()),
                "vimeo" === e.type && e.player.getVolume && e.player.getVolume().then(function(e) {
                    t(e)
                }),
                "local" === e.type && t(100 * e.$video.volume)) : t(!1)
            }
        }, {
            key: "getMuted",
            value: function(t) {
                var e = this;
                e.player ? ("youtube" === e.type && e.player.isMuted && t(e.player.isMuted()),
                "vimeo" === e.type && e.player.getVolume && e.player.getVolume().then(function(e) {
                    t(!!e)
                }),
                "local" === e.type && t(e.$video.muted)) : t(null)
            }
        }, {
            key: "getImageURL",
            value: function(t) {
                var o = this;
                if (o.videoImage)
                    t(o.videoImage);
                else {
                    if ("youtube" === o.type) {
                        var e = ["maxresdefault", "sddefault", "hqdefault", "0"]
                          , i = 0
                          , n = new Image;
                        n.onload = function() {
                            120 !== (this.naturalWidth || this.width) || i === e.length - 1 ? (o.videoImage = "https://img.youtube.com/vi/".concat(o.videoID, "/").concat(e[i], ".jpg"),
                            t(o.videoImage)) : (i++,
                            this.src = "https://img.youtube.com/vi/".concat(o.videoID, "/").concat(e[i], ".jpg"))
                        }
                        ,
                        n.src = "https://img.youtube.com/vi/".concat(o.videoID, "/").concat(e[i], ".jpg")
                    }
                    if ("vimeo" === o.type) {
                        var a = new XMLHttpRequest;
                        a.open("GET", "https://vimeo.com/api/v2/video/".concat(o.videoID, ".json"), !0),
                        a.onreadystatechange = function() {
                            if (4 === this.readyState && 200 <= this.status && this.status < 400) {
                                var e = JSON.parse(this.responseText);
                                o.videoImage = e[0].thumbnail_large,
                                t(o.videoImage)
                            }
                        }
                        ,
                        a.send(),
                        a = null
                    }
                }
            }
        }, {
            key: "getIframe",
            value: function(e) {
                this.getVideo(e)
            }
        }, {
            key: "getVideo",
            value: function(p) {
                var u = this;
                u.$video ? p(u.$video) : u.onAPIready(function() {
                    var e, t;
                    if (u.$video || ((e = document.createElement("div")).style.display = "none"),
                    "youtube" === u.type) {
                        var o, i;
                        u.playerOptions = {},
                        u.playerOptions.videoId = u.videoID,
                        u.playerOptions.playerVars = {
                            autohide: 1,
                            rel: 0,
                            autoplay: 0,
                            playsinline: 1
                        },
                        u.options.showContols || (u.playerOptions.playerVars.iv_load_policy = 3,
                        u.playerOptions.playerVars.modestbranding = 1,
                        u.playerOptions.playerVars.controls = 0,
                        u.playerOptions.playerVars.showinfo = 0,
                        u.playerOptions.playerVars.disablekb = 1),
                        u.playerOptions.events = {
                            onReady: function(t) {
                                if (u.options.mute ? t.target.mute() : u.options.volume && t.target.setVolume(u.options.volume),
                                u.options.autoplay && u.play(u.options.startTime),
                                u.fire("ready", t),
                                u.options.loop && !u.options.endTime) {
                                    u.options.endTime = u.player.getDuration() - .1
                                }
                                setInterval(function() {
                                    u.getVolume(function(e) {
                                        u.options.volume !== e && (u.options.volume = e,
                                        u.fire("volumechange", t))
                                    })
                                }, 150)
                            },
                            onStateChange: function(e) {
                                u.options.loop && e.data === YT.PlayerState.ENDED && u.play(u.options.startTime),
                                o || e.data !== YT.PlayerState.PLAYING || (o = 1,
                                u.fire("started", e)),
                                e.data === YT.PlayerState.PLAYING && u.fire("play", e),
                                e.data === YT.PlayerState.PAUSED && u.fire("pause", e),
                                e.data === YT.PlayerState.ENDED && u.fire("ended", e),
                                e.data === YT.PlayerState.PLAYING ? i = setInterval(function() {
                                    u.fire("timeupdate", e),
                                    u.options.endTime && u.player.getCurrentTime() >= u.options.endTime && (u.options.loop ? u.play(u.options.startTime) : u.pause())
                                }, 150) : clearInterval(i)
                            }
                        };
                        var n = !u.$video;
                        if (n) {
                            var a = document.createElement("div");
                            a.setAttribute("id", u.playerID),
                            e.appendChild(a),
                            document.body.appendChild(e)
                        }
                        u.player = u.player || new window.YT.Player(u.playerID,u.playerOptions),
                        n && (u.$video = document.getElementById(u.playerID),
                        u.videoWidth = parseInt(u.$video.getAttribute("width"), 10) || 1280,
                        u.videoHeight = parseInt(u.$video.getAttribute("height"), 10) || 720)
                    }
                    if ("vimeo" === u.type) {
                        if (u.playerOptions = {
                            id: u.videoID,
                            autopause: 0,
                            transparent: 0,
                            autoplay: u.options.autoplay ? 1 : 0,
                            loop: u.options.loop ? 1 : 0,
                            muted: u.options.mute ? 1 : 0
                        },
                        u.options.volume && (u.playerOptions.volume = u.options.volume),
                        u.options.showContols || (u.playerOptions.badge = 0,
                        u.playerOptions.byline = 0,
                        u.playerOptions.portrait = 0,
                        u.playerOptions.title = 0),
                        !u.$video) {
                            var r = "";
                            Object.keys(u.playerOptions).forEach(function(e) {
                                "" !== r && (r += "&"),
                                r += "".concat(e, "=").concat(encodeURIComponent(u.playerOptions[e]))
                            }),
                            u.$video = document.createElement("iframe"),
                            u.$video.setAttribute("id", u.playerID),
                            u.$video.setAttribute("src", "https://player.vimeo.com/video/".concat(u.videoID, "?").concat(r)),
                            u.$video.setAttribute("frameborder", "0"),
                            u.$video.setAttribute("mozallowfullscreen", ""),
                            u.$video.setAttribute("allowfullscreen", ""),
                            e.appendChild(u.$video),
                            document.body.appendChild(e)
                        }
                        var l;
                        u.player = u.player || new Vimeo.Player(u.$video,u.playerOptions),
                        u.options.startTime && u.options.autoplay && u.player.setCurrentTime(u.options.startTime),
                        u.player.getVideoWidth().then(function(e) {
                            u.videoWidth = e || 1280
                        }),
                        u.player.getVideoHeight().then(function(e) {
                            u.videoHeight = e || 720
                        }),
                        u.player.on("timeupdate", function(e) {
                            l || (u.fire("started", e),
                            l = 1),
                            u.fire("timeupdate", e),
                            u.options.endTime && u.options.endTime && e.seconds >= u.options.endTime && (u.options.loop ? u.play(u.options.startTime) : u.pause())
                        }),
                        u.player.on("play", function(e) {
                            u.fire("play", e),
                            u.options.startTime && 0 === e.seconds && u.play(u.options.startTime)
                        }),
                        u.player.on("pause", function(e) {
                            u.fire("pause", e)
                        }),
                        u.player.on("ended", function(e) {
                            u.fire("ended", e)
                        }),
                        u.player.on("loaded", function(e) {
                            u.fire("ready", e)
                        }),
                        u.player.on("volumechange", function(e) {
                            u.fire("volumechange", e)
                        })
                    }
                    "local" === u.type && (u.$video || (u.$video = document.createElement("video"),
                    u.options.showContols && (u.$video.controls = !0),
                    u.options.mute ? u.$video.muted = !0 : u.$video.volume && (u.$video.volume = u.options.volume / 100),
                    u.options.loop && (u.$video.loop = !0),
                    u.$video.setAttribute("playsinline", ""),
                    u.$video.setAttribute("webkit-playsinline", ""),
                    u.$video.setAttribute("id", u.playerID),
                    e.appendChild(u.$video),
                    document.body.appendChild(e),
                    Object.keys(u.videoID).forEach(function(e) {
                        !function(e, t, o) {
                            var i = document.createElement("source");
                            i.src = t,
                            i.type = o,
                            e.appendChild(i)
                        }(u.$video, u.videoID[e], "video/".concat(e))
                    })),
                    u.player = u.player || u.$video,
                    u.player.addEventListener("playing", function(e) {
                        t || u.fire("started", e),
                        t = 1
                    }),
                    u.player.addEventListener("timeupdate", function(e) {
                        u.fire("timeupdate", e),
                        u.options.endTime && u.options.endTime && this.currentTime >= u.options.endTime && (u.options.loop ? u.play(u.options.startTime) : u.pause())
                    }),
                    u.player.addEventListener("play", function(e) {
                        u.fire("play", e)
                    }),
                    u.player.addEventListener("pause", function(e) {
                        u.fire("pause", e)
                    }),
                    u.player.addEventListener("ended", function(e) {
                        u.fire("ended", e)
                    }),
                    u.player.addEventListener("loadedmetadata", function() {
                        u.videoWidth = this.videoWidth || 1280,
                        u.videoHeight = this.videoHeight || 720,
                        u.fire("ready"),
                        u.options.autoplay && u.play(u.options.startTime)
                    }),
                    u.player.addEventListener("volumechange", function(e) {
                        u.getVolume(function(e) {
                            u.options.volume = e
                        }),
                        u.fire("volumechange", e)
                    }));
                    p(u.$video)
                })
            }
        }, {
            key: "init",
            value: function() {
                this.playerID = "VideoWorker-".concat(this.ID)
            }
        }, {
            key: "loadAPI",
            value: function() {
                if (!l || !p) {
                    var e = "";
                    if ("youtube" !== this.type || l || (l = 1,
                    e = "https://www.youtube.com/iframe_api"),
                    "vimeo" !== this.type || p || (p = 1,
                    e = "https://player.vimeo.com/api/player.js"),
                    e) {
                        var t = document.createElement("script")
                          , o = document.getElementsByTagName("head")[0];
                        t.src = e,
                        o.appendChild(t),
                        t = o = null
                    }
                }
            }
        }, {
            key: "onAPIready",
            value: function(e) {
                if ("youtube" === this.type && ("undefined" != typeof YT && 0 !== YT.loaded || u ? "object" === ("undefined" == typeof YT ? "undefined" : n(YT)) && 1 === YT.loaded ? e() : d.done(function() {
                    e()
                }) : (u = 1,
                window.onYouTubeIframeAPIReady = function() {
                    window.onYouTubeIframeAPIReady = null,
                    d.resolve("done"),
                    e()
                }
                )),
                "vimeo" === this.type)
                    if ("undefined" != typeof Vimeo || s)
                        "undefined" != typeof Vimeo ? e() : y.done(function() {
                            e()
                        });
                    else {
                        s = 1;
                        var t = setInterval(function() {
                            "undefined" != typeof Vimeo && (clearInterval(t),
                            y.resolve("done"),
                            e())
                        }, 20)
                    }
                "local" === this.type && e()
            }
        }]),
        i
    }()
}
, function(e, t, o) {
    "use strict";
    o.r(t),
    o.d(t, "default", function() {
        return a
    });
    var i = o(8)
      , r = o.n(i)
      , n = o(4)
      , p = o.n(n);
    function a() {
        var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : p.a.jarallax;
        if (void 0 !== e) {
            var t = e.constructor
              , i = t.prototype.onScroll;
            t.prototype.onScroll = function() {
                var o = this;
                i.apply(o),
                o.isVideoInserted || !o.video || o.options.videoLazyLoading && !o.isElementInViewport || o.options.disableVideo() || (o.isVideoInserted = !0,
                o.video.getVideo(function(e) {
                    var t = e.parentNode;
                    o.css(e, {
                        position: o.image.position,
                        top: "0px",
                        left: "0px",
                        right: "0px",
                        bottom: "0px",
                        width: "100%",
                        height: "100%",
                        maxWidth: "none",
                        maxHeight: "none",
                        margin: 0,
                        zIndex: -1
                    }),
                    o.$video = e,
                    o.image.$container.appendChild(e),
                    t.parentNode.removeChild(t)
                }))
            }
            ;
            var l = t.prototype.coverImage;
            t.prototype.coverImage = function() {
                var e = this
                  , t = l.apply(e)
                  , o = !!e.image.$item && e.image.$item.nodeName;
                if (t && e.video && o && ("IFRAME" === o || "VIDEO" === o)) {
                    var i = t.image.height
                      , n = i * e.image.width / e.image.height
                      , a = (t.container.width - n) / 2
                      , r = t.image.marginTop;
                    t.container.width > n && (i = (n = t.container.width) * e.image.height / e.image.width,
                    a = 0,
                    r += (t.image.height - i) / 2),
                    "IFRAME" === o && (i += 400,
                    r -= 200),
                    e.css(e.$video, {
                        width: "".concat(n, "px"),
                        marginLeft: "".concat(a, "px"),
                        height: "".concat(i, "px"),
                        marginTop: "".concat(r, "px")
                    })
                }
                return t
            }
            ;
            var o = t.prototype.initImg;
            t.prototype.initImg = function() {
                var e = this
                  , t = o.apply(e);
                return e.options.videoSrc || (e.options.videoSrc = e.$item.getAttribute("data-jarallax-video") || null),
                e.options.videoSrc ? (e.defaultInitImgResult = t,
                !0) : t
            }
            ;
            var n = t.prototype.canInitParallax;
            t.prototype.canInitParallax = function() {
                var o = this
                  , e = n.apply(o);
                if (!o.options.videoSrc)
                    return e;
                var t = new r.a(o.options.videoSrc,{
                    autoplay: !0,
                    loop: o.options.videoLoop,
                    showContols: !1,
                    startTime: o.options.videoStartTime || 0,
                    endTime: o.options.videoEndTime || 0,
                    mute: o.options.videoVolume ? 0 : 1,
                    volume: o.options.videoVolume || 0
                });
                if (t.isValid())
                    if (e) {
                        if (t.on("ready", function() {
                            if (o.options.videoPlayOnlyVisible) {
                                var e = o.onScroll;
                                o.onScroll = function() {
                                    e.apply(o),
                                    !o.options.videoLoop && (o.options.videoLoop || o.videoEnded) || (o.isVisible() ? t.play() : t.pause())
                                }
                            } else
                                t.play()
                        }),
                        t.on("started", function() {
                            o.image.$default_item = o.image.$item,
                            o.image.$item = o.$video,
                            o.image.width = o.video.videoWidth || 1280,
                            o.image.height = o.video.videoHeight || 720,
                            o.coverImage(),
                            o.clipContainer(),
                            o.onScroll(),
                            o.image.$default_item && (o.image.$default_item.style.display = "none")
                        }),
                        t.on("ended", function() {
                            o.videoEnded = !0,
                            o.options.videoLoop || o.image.$default_item && (o.image.$item = o.image.$default_item,
                            o.image.$item.style.display = "block",
                            o.coverImage(),
                            o.clipContainer(),
                            o.onScroll())
                        }),
                        o.video = t,
                        !o.defaultInitImgResult)
                            return o.image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                            "local" === t.type || (t.getImageURL(function(e) {
                                o.image.bgImage = 'url("'.concat(e, '")'),
                                o.init()
                            }),
                            !1)
                    } else
                        o.defaultInitImgResult || t.getImageURL(function(e) {
                            var t = o.$item.getAttribute("style");
                            t && o.$item.setAttribute("data-jarallax-original-styles", t),
                            o.css(o.$item, {
                                "background-image": 'url("'.concat(e, '")'),
                                "background-position": "center",
                                "background-size": "cover"
                            })
                        });
                return e
            }
            ;
            var a = t.prototype.destroy;
            t.prototype.destroy = function() {
                var e = this;
                e.image.$default_item && (e.image.$item = e.image.$default_item,
                delete e.image.$default_item),
                a.apply(e)
            }
        }
    }
}
]);
//# sourceMappingURL=jarallax-video.min.js.map
