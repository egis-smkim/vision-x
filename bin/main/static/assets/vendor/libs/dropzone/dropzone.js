!function(e, t) {
    for (var n in t)
        e[n] = t[n]
}(window, function(e) {
    var t = {};
    function n(i) {
        if (t[i])
            return t[i].exports;
        var r = t[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return e[i].call(r.exports, r, r.exports, n),
        r.l = !0,
        r.exports
    }
    return n.m = e,
    n.c = t,
    n.d = function(e, t, i) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: i
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
    n.t = function(e, t) {
        if (1 & t && (e = n(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var i = Object.create(null);
        if (n.r(i),
        Object.defineProperty(i, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var r in e)
                n.d(i, r, function(t) {
                    return e[t]
                }
                .bind(null, r));
        return i
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
    n(n.s = 688)
}({
    37: function(e, t) {
        e.exports = function(e) {
            return e.webpackPolyfill || (e.deprecate = function() {}
            ,
            e.paths = [],
            e.children || (e.children = []),
            Object.defineProperty(e, "loaded", {
                enumerable: !0,
                get: function() {
                    return e.l
                }
            }),
            Object.defineProperty(e, "id", {
                enumerable: !0,
                get: function() {
                    return e.i
                }
            }),
            e.webpackPolyfill = 1),
            e
        }
    },
    688: function(e, t, n) {
        "use strict";
        n.r(t);
        var i = n(86)
          , r = n.n(i);
        n.d(t, "Dropzone", (function() {
            return r.a
        }
        )),
        r.a.autoDiscover = !1,
        r.a.prototype.defaultOptions.previewTemplate = '\n<div class="dz-preview dz-file-preview">\n  <div class="dz-details">\n    <div class="dz-thumbnail">\n      <img data-dz-thumbnail>\n      <span class="dz-nopreview text-white" style="font-size:40px;"><i class="far fa-file-image"></i></span>\n      <div class="dz-success-mark"></div>\n      <div class="dz-error-mark"></div>\n      <div class="dz-error-message"><span data-dz-errormessage></span></div>\n      <div class="progress"><div class="progress-bar progress-bar-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress></div></div>\n    </div>\n    <div class="dz-filename" data-dz-name></div>\n    <div class="dz-size" data-dz-size></div>\n  </div>\n</div>'
    },
    86: function(e, t, n) {
        "use strict";
        (function(e) {
            function t(e) {
                return (t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e
                }
                : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }
                )(e)
            }
            function n(e, n) {
                return !n || "object" !== t(n) && "function" != typeof n ? r(e) : n
            }
            function i(e) {
                return (i = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                }
                )(e)
            }
            function r(e) {
                if (void 0 === e)
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }
            function a(e, t) {
                return (a = Object.setPrototypeOf || function(e, t) {
                    return e.__proto__ = t,
                    e
                }
                )(e, t)
            }
            function o(e, t) {
                if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function")
            }
            function l(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var i = t[n];
                    i.enumerable = i.enumerable || !1,
                    i.configurable = !0,
                    "value"in i && (i.writable = !0),
                    Object.defineProperty(e, i.key, i)
                }
            }
            function s(e, t, n) {
                return t && l(e.prototype, t),
                n && l(e, n),
                e
            }
            var u = function() {
                function e() {
                    o(this, e)
                }
                return s(e, [{
                    key: "on",
                    value: function(e, t) {
                        return this._callbacks = this._callbacks || {},
                        this._callbacks[e] || (this._callbacks[e] = []),
                        this._callbacks[e].push(t),
                        this
                    }
                }, {
                    key: "emit",
                    value: function(e) {
                        this._callbacks = this._callbacks || {};
                        var t = this._callbacks[e];
                        if (t) {
                            for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
                                i[r - 1] = arguments[r];
                            var a = !0
                              , o = !1
                              , l = void 0;
                            try {
                                for (var s, u = t[Symbol.iterator](); !(a = (s = u.next()).done); a = !0) {
                                    var c = s.value;
                                    c.apply(this, i)
                                }
                            } catch (e) {
                                o = !0,
                                l = e
                            } finally {
                                try {
                                    a || null == u.return || u.return()
                                } finally {
                                    if (o)
                                        throw l
                                }
                            }
                        }
                        return this
                    }
                }, {
                    key: "off",
                    value: function(e, t) {
                        if (!this._callbacks || 0 === arguments.length)
                            return this._callbacks = {},
                            this;
                        var n = this._callbacks[e];
                        if (!n)
                            return this;
                        if (1 === arguments.length)
                            return delete this._callbacks[e],
                            this;
                        for (var i = 0; i < n.length; i++) {
                            var r = n[i];
                            if (r === t) {
                                n.splice(i, 1);
                                break
                            }
                        }
                        return this
                    }
                }]),
                e
            }()
              , c = function(e) {
                function t(e, a) {
                    var l, s, u;
                    if (o(this, t),
                    (l = n(this, i(t).call(this))).element = e,
                    l.version = t.version,
                    l.defaultOptions.previewTemplate = l.defaultOptions.previewTemplate.replace(/\n*/g, ""),
                    l.clickableElements = [],
                    l.listeners = [],
                    l.files = [],
                    "string" == typeof l.element && (l.element = document.querySelector(l.element)),
                    !l.element || null == l.element.nodeType)
                        throw new Error("Invalid dropzone element.");
                    if (l.element.dropzone)
                        throw new Error("Dropzone already attached.");
                    t.instances.push(r(l)),
                    l.element.dropzone = r(l);
                    var c = null != (u = t.optionsForElement(l.element)) ? u : {};
                    if (l.options = t.extend({}, l.defaultOptions, c, null != a ? a : {}),
                    l.options.forceFallback || !t.isBrowserSupported())
                        return n(l, l.options.fallback.call(r(l)));
                    if (null == l.options.url && (l.options.url = l.element.getAttribute("action")),
                    !l.options.url)
                        throw new Error("No URL provided.");
                    if (l.options.acceptedFiles && l.options.acceptedMimeTypes)
                        throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
                    if (l.options.uploadMultiple && l.options.chunking)
                        throw new Error("You cannot set both: uploadMultiple and chunking.");
                    return l.options.acceptedMimeTypes && (l.options.acceptedFiles = l.options.acceptedMimeTypes,
                    delete l.options.acceptedMimeTypes),
                    null != l.options.renameFilename && (l.options.renameFile = function(e) {
                        return l.options.renameFilename.call(r(l), e.name, e)
                    }
                    ),
                    l.options.method = l.options.method.toUpperCase(),
                    (s = l.getExistingFallback()) && s.parentNode && s.parentNode.removeChild(s),
                    !1 !== l.options.previewsContainer && (l.options.previewsContainer ? l.previewsContainer = t.getElement(l.options.previewsContainer, "previewsContainer") : l.previewsContainer = l.element),
                    l.options.clickable && (!0 === l.options.clickable ? l.clickableElements = [l.element] : l.clickableElements = t.getElements(l.options.clickable, "clickable")),
                    l.init(),
                    l
                }
                return function(e, t) {
                    if ("function" != typeof t && null !== t)
                        throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            writable: !0,
                            configurable: !0
                        }
                    }),
                    t && a(e, t)
                }(t, e),
                s(t, null, [{
                    key: "initClass",
                    value: function() {
                        this.prototype.Emitter = u,
                        this.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "addedfiles", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"],
                        this.prototype.defaultOptions = {
                            url: null,
                            method: "post",
                            withCredentials: !1,
                            timeout: 3e4,
                            parallelUploads: 2,
                            uploadMultiple: !1,
                            chunking: !1,
                            forceChunking: !1,
                            chunkSize: 2e6,
                            parallelChunkUploads: !1,
                            retryChunks: !1,
                            retryChunksLimit: 3,
                            maxFilesize: 256,
                            paramName: "file",
                            createImageThumbnails: !0,
                            maxThumbnailFilesize: 10,
                            thumbnailWidth: 120,
                            thumbnailHeight: 120,
                            thumbnailMethod: "crop",
                            resizeWidth: null,
                            resizeHeight: null,
                            resizeMimeType: null,
                            resizeQuality: .8,
                            resizeMethod: "contain",
                            filesizeBase: 1e3,
                            maxFiles: null,
                            headers: null,
                            clickable: !0,
                            ignoreHiddenFiles: !0,
                            acceptedFiles: null,
                            acceptedMimeTypes: null,
                            autoProcessQueue: !0,
                            autoQueue: !0,
                            addRemoveLinks: !1,
                            previewsContainer: null,
                            hiddenInputContainer: "body",
                            capture: null,
                            renameFilename: null,
                            renameFile: null,
                            forceFallback: !1,
                            dictDefaultMessage: "Drop files here to upload",
                            dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
                            dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
                            dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
                            dictInvalidFileType: "You can't upload files of this type.",
                            dictResponseError: "Server responded with {{statusCode}} code.",
                            dictCancelUpload: "Cancel upload",
                            dictUploadCanceled: "Upload canceled.",
                            dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
                            dictRemoveFile: "Remove file",
                            dictRemoveFileConfirmation: null,
                            dictMaxFilesExceeded: "You can not upload any more files.",
                            dictFileSizeUnits: {
                                tb: "TB",
                                gb: "GB",
                                mb: "MB",
                                kb: "KB",
                                b: "b"
                            },
                            init: function() {},
                            params: function(e, t, n) {
                                if (n)
                                    return {
                                        dzuuid: n.file.upload.uuid,
                                        dzchunkindex: n.index,
                                        dztotalfilesize: n.file.size,
                                        dzchunksize: this.options.chunkSize,
                                        dztotalchunkcount: n.file.upload.totalChunkCount,
                                        dzchunkbyteoffset: n.index * this.options.chunkSize
                                    }
                            },
                            accept: function(e, t) {
                                return t()
                            },
                            chunksUploaded: function(e, t) {
                                t()
                            },
                            fallback: function() {
                                var e;
                                this.element.className = "".concat(this.element.className, " dz-browser-not-supported");
                                var n = !0
                                  , i = !1
                                  , r = void 0;
                                try {
                                    for (var a, o = this.element.getElementsByTagName("div")[Symbol.iterator](); !(n = (a = o.next()).done); n = !0) {
                                        var l = a.value;
                                        if (/(^| )dz-message($| )/.test(l.className)) {
                                            e = l,
                                            l.className = "dz-message";
                                            break
                                        }
                                    }
                                } catch (e) {
                                    i = !0,
                                    r = e
                                } finally {
                                    try {
                                        n || null == o.return || o.return()
                                    } finally {
                                        if (i)
                                            throw r
                                    }
                                }
                                e || (e = t.createElement('<div class="dz-message"><span></span></div>'),
                                this.element.appendChild(e));
                                var s = e.getElementsByTagName("span")[0];
                                return s && (null != s.textContent ? s.textContent = this.options.dictFallbackMessage : null != s.innerText && (s.innerText = this.options.dictFallbackMessage)),
                                this.element.appendChild(this.getFallbackForm())
                            },
                            resize: function(e, t, n, i) {
                                var r = {
                                    srcX: 0,
                                    srcY: 0,
                                    srcWidth: e.width,
                                    srcHeight: e.height
                                }
                                  , a = e.width / e.height;
                                null == t && null == n ? (t = r.srcWidth,
                                n = r.srcHeight) : null == t ? t = n * a : null == n && (n = t / a);
                                var o = (t = Math.min(t, r.srcWidth)) / (n = Math.min(n, r.srcHeight));
                                if (r.srcWidth > t || r.srcHeight > n)
                                    if ("crop" === i)
                                        a > o ? (r.srcHeight = e.height,
                                        r.srcWidth = r.srcHeight * o) : (r.srcWidth = e.width,
                                        r.srcHeight = r.srcWidth / o);
                                    else {
                                        if ("contain" !== i)
                                            throw new Error("Unknown resizeMethod '".concat(i, "'"));
                                        a > o ? n = t / a : t = n * a
                                    }
                                return r.srcX = (e.width - r.srcWidth) / 2,
                                r.srcY = (e.height - r.srcHeight) / 2,
                                r.trgWidth = t,
                                r.trgHeight = n,
                                r
                            },
                            transformFile: function(e, t) {
                                return (this.options.resizeWidth || this.options.resizeHeight) && e.type.match(/image.*/) ? this.resizeImage(e, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, t) : t(e)
                            },
                            previewTemplate: '<div class="dz-preview dz-file-preview">\n  <div class="dz-image"><img data-dz-thumbnail /></div>\n  <div class="dz-details">\n    <div class="dz-size"><span data-dz-size></span></div>\n    <div class="dz-filename"><span data-dz-name></span></div>\n  </div>\n  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n  <div class="dz-error-message"><span data-dz-errormessage></span></div>\n  <div class="dz-success-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n      <title>Check</title>\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF"></path>\n      </g>\n    </svg>\n  </div>\n  <div class="dz-error-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n      <title>Error</title>\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <g stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">\n          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>',
                            drop: function(e) {
                                return this.element.classList.remove("dz-drag-hover")
                            },
                            dragstart: function(e) {},
                            dragend: function(e) {
                                return this.element.classList.remove("dz-drag-hover")
                            },
                            dragenter: function(e) {
                                return this.element.classList.add("dz-drag-hover")
                            },
                            dragover: function(e) {
                                return this.element.classList.add("dz-drag-hover")
                            },
                            dragleave: function(e) {
                                return this.element.classList.remove("dz-drag-hover")
                            },
                            paste: function(e) {},
                            reset: function() {
                                return this.element.classList.remove("dz-started")
                            },
                            addedfile: function(e) {
                                var n = this;
                                if (this.element === this.previewsContainer && this.element.classList.add("dz-started"),
                                this.previewsContainer) {
                                    e.previewElement = t.createElement(this.options.previewTemplate.trim()),
                                    e.previewTemplate = e.previewElement,
                                    this.previewsContainer.appendChild(e.previewElement);
                                    var i = !0
                                      , r = !1
                                      , a = void 0;
                                    try {
                                        for (var o, l = e.previewElement.querySelectorAll("[data-dz-name]")[Symbol.iterator](); !(i = (o = l.next()).done); i = !0) {
                                            var s = o.value;
                                            s.textContent = e.name
                                        }
                                    } catch (e) {
                                        r = !0,
                                        a = e
                                    } finally {
                                        try {
                                            i || null == l.return || l.return()
                                        } finally {
                                            if (r)
                                                throw a
                                        }
                                    }
                                    var u = !0
                                      , c = !1
                                      , d = void 0;
                                    try {
                                        for (var p, h = e.previewElement.querySelectorAll("[data-dz-size]")[Symbol.iterator](); !(u = (p = h.next()).done); u = !0)
                                            (s = p.value).innerHTML = this.filesize(e.size)
                                    } catch (e) {
                                        c = !0,
                                        d = e
                                    } finally {
                                        try {
                                            u || null == h.return || h.return()
                                        } finally {
                                            if (c)
                                                throw d
                                        }
                                    }
                                    this.options.addRemoveLinks && (e._removeLink = t.createElement('<a class="dz-remove" href="javascript:undefined;" data-dz-remove>'.concat(this.options.dictRemoveFile, "</a>")),
                                    e.previewElement.appendChild(e._removeLink));
                                    var f = function(i) {
                                        return i.preventDefault(),
                                        i.stopPropagation(),
                                        e.status === t.UPLOADING ? t.confirm(n.options.dictCancelUploadConfirmation, (function() {
                                            return n.removeFile(e)
                                        }
                                        )) : n.options.dictRemoveFileConfirmation ? t.confirm(n.options.dictRemoveFileConfirmation, (function() {
                                            return n.removeFile(e)
                                        }
                                        )) : n.removeFile(e)
                                    }
                                      , v = !0
                                      , m = !1
                                      , y = void 0;
                                    try {
                                        for (var g, b = e.previewElement.querySelectorAll("[data-dz-remove]")[Symbol.iterator](); !(v = (g = b.next()).done); v = !0) {
                                            g.value.addEventListener("click", f)
                                        }
                                    } catch (e) {
                                        m = !0,
                                        y = e
                                    } finally {
                                        try {
                                            v || null == b.return || b.return()
                                        } finally {
                                            if (m)
                                                throw y
                                        }
                                    }
                                }
                            },
                            removedfile: function(e) {
                                return null != e.previewElement && null != e.previewElement.parentNode && e.previewElement.parentNode.removeChild(e.previewElement),
                                this._updateMaxFilesReachedClass()
                            },
                            thumbnail: function(e, t) {
                                if (e.previewElement) {
                                    e.previewElement.classList.remove("dz-file-preview");
                                    var n = !0
                                      , i = !1
                                      , r = void 0;
                                    try {
                                        for (var a, o = e.previewElement.querySelectorAll("[data-dz-thumbnail]")[Symbol.iterator](); !(n = (a = o.next()).done); n = !0) {
                                            var l = a.value;
                                            l.alt = e.name,
                                            l.src = t
                                        }
                                    } catch (e) {
                                        i = !0,
                                        r = e
                                    } finally {
                                        try {
                                            n || null == o.return || o.return()
                                        } finally {
                                            if (i)
                                                throw r
                                        }
                                    }
                                    return setTimeout((function() {
                                        return e.previewElement.classList.add("dz-image-preview")
                                    }
                                    ), 1)
                                }
                            },
                            error: function(e, t) {
                                if (e.previewElement) {
                                    e.previewElement.classList.add("dz-error"),
                                    "String" != typeof t && t.error && (t = t.error);
                                    var n = !0
                                      , i = !1
                                      , r = void 0;
                                    try {
                                        for (var a, o = e.previewElement.querySelectorAll("[data-dz-errormessage]")[Symbol.iterator](); !(n = (a = o.next()).done); n = !0) {
                                            a.value.textContent = t
                                        }
                                    } catch (e) {
                                        i = !0,
                                        r = e
                                    } finally {
                                        try {
                                            n || null == o.return || o.return()
                                        } finally {
                                            if (i)
                                                throw r
                                        }
                                    }
                                }
                            },
                            errormultiple: function() {},
                            processing: function(e) {
                                if (e.previewElement && (e.previewElement.classList.add("dz-processing"),
                                e._removeLink))
                                    return e._removeLink.innerHTML = this.options.dictCancelUpload
                            },
                            processingmultiple: function() {},
                            uploadprogress: function(e, t, n) {
                                if (e.previewElement) {
                                    var i = !0
                                      , r = !1
                                      , a = void 0;
                                    try {
                                        for (var o, l = e.previewElement.querySelectorAll("[data-dz-uploadprogress]")[Symbol.iterator](); !(i = (o = l.next()).done); i = !0) {
                                            var s = o.value;
                                            "PROGRESS" === s.nodeName ? s.value = t : s.style.width = "".concat(t, "%")
                                        }
                                    } catch (e) {
                                        r = !0,
                                        a = e
                                    } finally {
                                        try {
                                            i || null == l.return || l.return()
                                        } finally {
                                            if (r)
                                                throw a
                                        }
                                    }
                                }
                            },
                            totaluploadprogress: function() {},
                            sending: function() {},
                            sendingmultiple: function() {},
                            success: function(e) {
                                if (e.previewElement)
                                    return e.previewElement.classList.add("dz-success")
                            },
                            successmultiple: function() {},
                            canceled: function(e) {
                                return this.emit("error", e, this.options.dictUploadCanceled)
                            },
                            canceledmultiple: function() {},
                            complete: function(e) {
                                if (e._removeLink && (e._removeLink.innerHTML = this.options.dictRemoveFile),
                                e.previewElement)
                                    return e.previewElement.classList.add("dz-complete")
                            },
                            completemultiple: function() {},
                            maxfilesexceeded: function() {},
                            maxfilesreached: function() {},
                            queuecomplete: function() {},
                            addedfiles: function() {}
                        },
                        this.prototype._thumbnailQueue = [],
                        this.prototype._processingThumbnail = !1
                    }
                }, {
                    key: "extend",
                    value: function(e) {
                        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
                            n[i - 1] = arguments[i];
                        for (var r = 0, a = n; r < a.length; r++) {
                            var o = a[r];
                            for (var l in o) {
                                var s = o[l];
                                e[l] = s
                            }
                        }
                        return e
                    }
                }]),
                s(t, [{
                    key: "getAcceptedFiles",
                    value: function() {
                        return this.files.filter((function(e) {
                            return e.accepted
                        }
                        )).map((function(e) {
                            return e
                        }
                        ))
                    }
                }, {
                    key: "getRejectedFiles",
                    value: function() {
                        return this.files.filter((function(e) {
                            return !e.accepted
                        }
                        )).map((function(e) {
                            return e
                        }
                        ))
                    }
                }, {
                    key: "getFilesWithStatus",
                    value: function(e) {
                        return this.files.filter((function(t) {
                            return t.status === e
                        }
                        )).map((function(e) {
                            return e
                        }
                        ))
                    }
                }, {
                    key: "getQueuedFiles",
                    value: function() {
                        return this.getFilesWithStatus(t.QUEUED)
                    }
                }, {
                    key: "getUploadingFiles",
                    value: function() {
                        return this.getFilesWithStatus(t.UPLOADING)
                    }
                }, {
                    key: "getAddedFiles",
                    value: function() {
                        return this.getFilesWithStatus(t.ADDED)
                    }
                }, {
                    key: "getActiveFiles",
                    value: function() {
                        return this.files.filter((function(e) {
                            return e.status === t.UPLOADING || e.status === t.QUEUED
                        }
                        )).map((function(e) {
                            return e
                        }
                        ))
                    }
                }, {
                    key: "init",
                    value: function() {
                        var e = this;
                        if ("form" === this.element.tagName && this.element.setAttribute("enctype", "multipart/form-data"),
                        this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message") && this.element.appendChild(t.createElement('<div class="dz-default dz-message"><button class="dz-button" type="button">'.concat(this.options.dictDefaultMessage, "</button></div>"))),
                        this.clickableElements.length) {
                            !function n() {
                                return e.hiddenFileInput && e.hiddenFileInput.parentNode.removeChild(e.hiddenFileInput),
                                e.hiddenFileInput = document.createElement("input"),
                                e.hiddenFileInput.setAttribute("type", "file"),
                                (null === e.options.maxFiles || e.options.maxFiles > 1) && e.hiddenFileInput.setAttribute("multiple", "multiple"),
                                e.hiddenFileInput.className = "dz-hidden-input",
                                null !== e.options.acceptedFiles && e.hiddenFileInput.setAttribute("accept", e.options.acceptedFiles),
                                null !== e.options.capture && e.hiddenFileInput.setAttribute("capture", e.options.capture),
                                e.hiddenFileInput.style.visibility = "hidden",
                                e.hiddenFileInput.style.position = "absolute",
                                e.hiddenFileInput.style.top = "0",
                                e.hiddenFileInput.style.left = "0",
                                e.hiddenFileInput.style.height = "0",
                                e.hiddenFileInput.style.width = "0",
                                t.getElement(e.options.hiddenInputContainer, "hiddenInputContainer").appendChild(e.hiddenFileInput),
                                e.hiddenFileInput.addEventListener("change", (function() {
                                    var t = e.hiddenFileInput.files;
                                    if (t.length) {
                                        var i = !0
                                          , r = !1
                                          , a = void 0;
                                        try {
                                            for (var o, l = t[Symbol.iterator](); !(i = (o = l.next()).done); i = !0) {
                                                var s = o.value;
                                                e.addFile(s)
                                            }
                                        } catch (e) {
                                            r = !0,
                                            a = e
                                        } finally {
                                            try {
                                                i || null == l.return || l.return()
                                            } finally {
                                                if (r)
                                                    throw a
                                            }
                                        }
                                    }
                                    return e.emit("addedfiles", t),
                                    n()
                                }
                                ))
                            }()
                        }
                        this.URL = null !== window.URL ? window.URL : window.webkitURL;
                        var n = !0
                          , i = !1
                          , r = void 0;
                        try {
                            for (var a, o = this.events[Symbol.iterator](); !(n = (a = o.next()).done); n = !0) {
                                var l = a.value;
                                this.on(l, this.options[l])
                            }
                        } catch (e) {
                            i = !0,
                            r = e
                        } finally {
                            try {
                                n || null == o.return || o.return()
                            } finally {
                                if (i)
                                    throw r
                            }
                        }
                        this.on("uploadprogress", (function() {
                            return e.updateTotalUploadProgress()
                        }
                        )),
                        this.on("removedfile", (function() {
                            return e.updateTotalUploadProgress()
                        }
                        )),
                        this.on("canceled", (function(t) {
                            return e.emit("complete", t)
                        }
                        )),
                        this.on("complete", (function(t) {
                            if (0 === e.getAddedFiles().length && 0 === e.getUploadingFiles().length && 0 === e.getQueuedFiles().length)
                                return setTimeout((function() {
                                    return e.emit("queuecomplete")
                                }
                                ), 0)
                        }
                        ));
                        var s = function(e) {
                            if (function(e) {
                                return e.dataTransfer.types && e.dataTransfer.types.some((function(e) {
                                    return "Files" == e
                                }
                                ))
                            }(e))
                                return e.stopPropagation(),
                                e.preventDefault ? e.preventDefault() : e.returnValue = !1
                        };
                        return this.listeners = [{
                            element: this.element,
                            events: {
                                dragstart: function(t) {
                                    return e.emit("dragstart", t)
                                },
                                dragenter: function(t) {
                                    return s(t),
                                    e.emit("dragenter", t)
                                },
                                dragover: function(t) {
                                    var n;
                                    try {
                                        n = t.dataTransfer.effectAllowed
                                    } catch (e) {}
                                    return t.dataTransfer.dropEffect = "move" === n || "linkMove" === n ? "move" : "copy",
                                    s(t),
                                    e.emit("dragover", t)
                                },
                                dragleave: function(t) {
                                    return e.emit("dragleave", t)
                                },
                                drop: function(t) {
                                    return s(t),
                                    e.drop(t)
                                },
                                dragend: function(t) {
                                    return e.emit("dragend", t)
                                }
                            }
                        }],
                        this.clickableElements.forEach((function(n) {
                            return e.listeners.push({
                                element: n,
                                events: {
                                    click: function(i) {
                                        return (n !== e.element || i.target === e.element || t.elementInside(i.target, e.element.querySelector(".dz-message"))) && e.hiddenFileInput.click(),
                                        !0
                                    }
                                }
                            })
                        }
                        )),
                        this.enable(),
                        this.options.init.call(this)
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        return this.disable(),
                        this.removeAllFiles(!0),
                        (null != this.hiddenFileInput ? this.hiddenFileInput.parentNode : void 0) && (this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput),
                        this.hiddenFileInput = null),
                        delete this.element.dropzone,
                        t.instances.splice(t.instances.indexOf(this), 1)
                    }
                }, {
                    key: "updateTotalUploadProgress",
                    value: function() {
                        var e, t = 0, n = 0;
                        if (this.getActiveFiles().length) {
                            var i = !0
                              , r = !1
                              , a = void 0;
                            try {
                                for (var o, l = this.getActiveFiles()[Symbol.iterator](); !(i = (o = l.next()).done); i = !0) {
                                    var s = o.value;
                                    t += s.upload.bytesSent,
                                    n += s.upload.total
                                }
                            } catch (e) {
                                r = !0,
                                a = e
                            } finally {
                                try {
                                    i || null == l.return || l.return()
                                } finally {
                                    if (r)
                                        throw a
                                }
                            }
                            e = 100 * t / n
                        } else
                            e = 100;
                        return this.emit("totaluploadprogress", e, n, t)
                    }
                }, {
                    key: "_getParamName",
                    value: function(e) {
                        return "function" == typeof this.options.paramName ? this.options.paramName(e) : "".concat(this.options.paramName).concat(this.options.uploadMultiple ? "[".concat(e, "]") : "")
                    }
                }, {
                    key: "_renameFile",
                    value: function(e) {
                        return "function" != typeof this.options.renameFile ? e.name : this.options.renameFile(e)
                    }
                }, {
                    key: "getFallbackForm",
                    value: function() {
                        var e, n;
                        if (e = this.getExistingFallback())
                            return e;
                        var i = '<div class="dz-fallback">';
                        this.options.dictFallbackText && (i += "<p>".concat(this.options.dictFallbackText, "</p>")),
                        i += '<input type="file" name="'.concat(this._getParamName(0), '" ').concat(this.options.uploadMultiple ? 'multiple="multiple"' : void 0, ' /><input type="submit" value="Upload!"></div>');
                        var r = t.createElement(i);
                        return "FORM" !== this.element.tagName ? (n = t.createElement('<form action="'.concat(this.options.url, '" enctype="multipart/form-data" method="').concat(this.options.method, '"></form>'))).appendChild(r) : (this.element.setAttribute("enctype", "multipart/form-data"),
                        this.element.setAttribute("method", this.options.method)),
                        null != n ? n : r
                    }
                }, {
                    key: "getExistingFallback",
                    value: function() {
                        for (var e = function(e) {
                            var t = !0
                              , n = !1
                              , i = void 0;
                            try {
                                for (var r, a = e[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                                    var o = r.value;
                                    if (/(^| )fallback($| )/.test(o.className))
                                        return o
                                }
                            } catch (e) {
                                n = !0,
                                i = e
                            } finally {
                                try {
                                    t || null == a.return || a.return()
                                } finally {
                                    if (n)
                                        throw i
                                }
                            }
                        }, t = 0, n = ["div", "form"]; t < n.length; t++) {
                            var i, r = n[t];
                            if (i = e(this.element.getElementsByTagName(r)))
                                return i
                        }
                    }
                }, {
                    key: "setupEventListeners",
                    value: function() {
                        return this.listeners.map((function(e) {
                            return function() {
                                var t = [];
                                for (var n in e.events) {
                                    var i = e.events[n];
                                    t.push(e.element.addEventListener(n, i, !1))
                                }
                                return t
                            }()
                        }
                        ))
                    }
                }, {
                    key: "removeEventListeners",
                    value: function() {
                        return this.listeners.map((function(e) {
                            return function() {
                                var t = [];
                                for (var n in e.events) {
                                    var i = e.events[n];
                                    t.push(e.element.removeEventListener(n, i, !1))
                                }
                                return t
                            }()
                        }
                        ))
                    }
                }, {
                    key: "disable",
                    value: function() {
                        var e = this;
                        return this.clickableElements.forEach((function(e) {
                            return e.classList.remove("dz-clickable")
                        }
                        )),
                        this.removeEventListeners(),
                        this.disabled = !0,
                        this.files.map((function(t) {
                            return e.cancelUpload(t)
                        }
                        ))
                    }
                }, {
                    key: "enable",
                    value: function() {
                        return delete this.disabled,
                        this.clickableElements.forEach((function(e) {
                            return e.classList.add("dz-clickable")
                        }
                        )),
                        this.setupEventListeners()
                    }
                }, {
                    key: "filesize",
                    value: function(e) {
                        var t = 0
                          , n = "b";
                        if (e > 0) {
                            for (var i = ["tb", "gb", "mb", "kb", "b"], r = 0; r < i.length; r++) {
                                var a = i[r];
                                if (e >= Math.pow(this.options.filesizeBase, 4 - r) / 10) {
                                    t = e / Math.pow(this.options.filesizeBase, 4 - r),
                                    n = a;
                                    break
                                }
                            }
                            t = Math.round(10 * t) / 10
                        }
                        return "<strong>".concat(t, "</strong> ").concat(this.options.dictFileSizeUnits[n])
                    }
                }, {
                    key: "_updateMaxFilesReachedClass",
                    value: function() {
                        return null != this.options.maxFiles && this.getAcceptedFiles().length >= this.options.maxFiles ? (this.getAcceptedFiles().length === this.options.maxFiles && this.emit("maxfilesreached", this.files),
                        this.element.classList.add("dz-max-files-reached")) : this.element.classList.remove("dz-max-files-reached")
                    }
                }, {
                    key: "drop",
                    value: function(e) {
                        if (e.dataTransfer) {
                            this.emit("drop", e);
                            for (var t = [], n = 0; n < e.dataTransfer.files.length; n++)
                                t[n] = e.dataTransfer.files[n];
                            if (t.length) {
                                var i = e.dataTransfer.items;
                                i && i.length && null != i[0].webkitGetAsEntry ? this._addFilesFromItems(i) : this.handleFiles(t)
                            }
                            this.emit("addedfiles", t)
                        }
                    }
                }, {
                    key: "paste",
                    value: function(e) {
                        if (null != (t = null != e ? e.clipboardData : void 0,
                        n = function(e) {
                            return e.items
                        }
                        ,
                        null != t ? n(t) : void 0)) {
                            var t, n;
                            this.emit("paste", e);
                            var i = e.clipboardData.items;
                            return i.length ? this._addFilesFromItems(i) : void 0
                        }
                    }
                }, {
                    key: "handleFiles",
                    value: function(e) {
                        var t = !0
                          , n = !1
                          , i = void 0;
                        try {
                            for (var r, a = e[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                                var o = r.value;
                                this.addFile(o)
                            }
                        } catch (e) {
                            n = !0,
                            i = e
                        } finally {
                            try {
                                t || null == a.return || a.return()
                            } finally {
                                if (n)
                                    throw i
                            }
                        }
                    }
                }, {
                    key: "_addFilesFromItems",
                    value: function(e) {
                        var t = this;
                        return function() {
                            var n = []
                              , i = !0
                              , r = !1
                              , a = void 0;
                            try {
                                for (var o, l = e[Symbol.iterator](); !(i = (o = l.next()).done); i = !0) {
                                    var s, u = o.value;
                                    null != u.webkitGetAsEntry && (s = u.webkitGetAsEntry()) ? s.isFile ? n.push(t.addFile(u.getAsFile())) : s.isDirectory ? n.push(t._addFilesFromDirectory(s, s.name)) : n.push(void 0) : null != u.getAsFile && (null == u.kind || "file" === u.kind) ? n.push(t.addFile(u.getAsFile())) : n.push(void 0)
                                }
                            } catch (e) {
                                r = !0,
                                a = e
                            } finally {
                                try {
                                    i || null == l.return || l.return()
                                } finally {
                                    if (r)
                                        throw a
                                }
                            }
                            return n
                        }()
                    }
                }, {
                    key: "_addFilesFromDirectory",
                    value: function(e, t) {
                        var n = this
                          , i = e.createReader()
                          , r = function(e) {
                            return t = console,
                            n = "log",
                            i = function(t) {
                                return t.log(e)
                            }
                            ,
                            null != t && "function" == typeof t[n] ? i(t, n) : void 0;
                            var t, n, i
                        };
                        return function e() {
                            return i.readEntries((function(i) {
                                if (i.length > 0) {
                                    var r = !0
                                      , a = !1
                                      , o = void 0;
                                    try {
                                        for (var l, s = i[Symbol.iterator](); !(r = (l = s.next()).done); r = !0) {
                                            var u = l.value;
                                            u.isFile ? u.file((function(e) {
                                                if (!n.options.ignoreHiddenFiles || "." !== e.name.substring(0, 1))
                                                    return e.fullPath = "".concat(t, "/").concat(e.name),
                                                    n.addFile(e)
                                            }
                                            )) : u.isDirectory && n._addFilesFromDirectory(u, "".concat(t, "/").concat(u.name))
                                        }
                                    } catch (e) {
                                        a = !0,
                                        o = e
                                    } finally {
                                        try {
                                            r || null == s.return || s.return()
                                        } finally {
                                            if (a)
                                                throw o
                                        }
                                    }
                                    e()
                                }
                                return null
                            }
                            ), r)
                        }()
                    }
                }, {
                    key: "accept",
                    value: function(e, n) {
                        this.options.maxFilesize && e.size > 1024 * this.options.maxFilesize * 1024 ? n(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(e.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize)) : t.isValidFile(e, this.options.acceptedFiles) ? null != this.options.maxFiles && this.getAcceptedFiles().length >= this.options.maxFiles ? (n(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles)),
                        this.emit("maxfilesexceeded", e)) : this.options.accept.call(this, e, n) : n(this.options.dictInvalidFileType)
                    }
                }, {
                    key: "addFile",
                    value: function(e) {
                        var n = this;
                        e.upload = {
                            uuid: t.uuidv4(),
                            progress: 0,
                            total: e.size,
                            bytesSent: 0,
                            filename: this._renameFile(e)
                        },
                        this.files.push(e),
                        e.status = t.ADDED,
                        this.emit("addedfile", e),
                        this._enqueueThumbnail(e),
                        this.accept(e, (function(t) {
                            t ? (e.accepted = !1,
                            n._errorProcessing([e], t)) : (e.accepted = !0,
                            n.options.autoQueue && n.enqueueFile(e)),
                            n._updateMaxFilesReachedClass()
                        }
                        ))
                    }
                }, {
                    key: "enqueueFiles",
                    value: function(e) {
                        var t = !0
                          , n = !1
                          , i = void 0;
                        try {
                            for (var r, a = e[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                                var o = r.value;
                                this.enqueueFile(o)
                            }
                        } catch (e) {
                            n = !0,
                            i = e
                        } finally {
                            try {
                                t || null == a.return || a.return()
                            } finally {
                                if (n)
                                    throw i
                            }
                        }
                        return null
                    }
                }, {
                    key: "enqueueFile",
                    value: function(e) {
                        var n = this;
                        if (e.status !== t.ADDED || !0 !== e.accepted)
                            throw new Error("This file can't be queued because it has already been processed or was rejected.");
                        if (e.status = t.QUEUED,
                        this.options.autoProcessQueue)
                            return setTimeout((function() {
                                return n.processQueue()
                            }
                            ), 0)
                    }
                }, {
                    key: "_enqueueThumbnail",
                    value: function(e) {
                        var t = this;
                        if (this.options.createImageThumbnails && e.type.match(/image.*/) && e.size <= 1024 * this.options.maxThumbnailFilesize * 1024)
                            return this._thumbnailQueue.push(e),
                            setTimeout((function() {
                                return t._processThumbnailQueue()
                            }
                            ), 0)
                    }
                }, {
                    key: "_processThumbnailQueue",
                    value: function() {
                        var e = this;
                        if (!this._processingThumbnail && 0 !== this._thumbnailQueue.length) {
                            this._processingThumbnail = !0;
                            var t = this._thumbnailQueue.shift();
                            return this.createThumbnail(t, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.thumbnailMethod, !0, (function(n) {
                                return e.emit("thumbnail", t, n),
                                e._processingThumbnail = !1,
                                e._processThumbnailQueue()
                            }
                            ))
                        }
                    }
                }, {
                    key: "removeFile",
                    value: function(e) {
                        if (e.status === t.UPLOADING && this.cancelUpload(e),
                        this.files = d(this.files, e),
                        this.emit("removedfile", e),
                        0 === this.files.length)
                            return this.emit("reset")
                    }
                }, {
                    key: "removeAllFiles",
                    value: function(e) {
                        null == e && (e = !1);
                        var n = !0
                          , i = !1
                          , r = void 0;
                        try {
                            for (var a, o = this.files.slice()[Symbol.iterator](); !(n = (a = o.next()).done); n = !0) {
                                var l = a.value;
                                (l.status !== t.UPLOADING || e) && this.removeFile(l)
                            }
                        } catch (e) {
                            i = !0,
                            r = e
                        } finally {
                            try {
                                n || null == o.return || o.return()
                            } finally {
                                if (i)
                                    throw r
                            }
                        }
                        return null
                    }
                }, {
                    key: "resizeImage",
                    value: function(e, n, i, r, a) {
                        var o = this;
                        return this.createThumbnail(e, n, i, r, !0, (function(n, i) {
                            if (null == i)
                                return a(e);
                            var r = o.options.resizeMimeType;
                            null == r && (r = e.type);
                            var l = i.toDataURL(r, o.options.resizeQuality);
                            return "image/jpeg" !== r && "image/jpg" !== r || (l = f.restore(e.dataURL, l)),
                            a(t.dataURItoBlob(l))
                        }
                        ))
                    }
                }, {
                    key: "createThumbnail",
                    value: function(e, t, n, i, r, a) {
                        var o = this
                          , l = new FileReader;
                        l.onload = function() {
                            e.dataURL = l.result,
                            "image/svg+xml" !== e.type ? o.createThumbnailFromUrl(e, t, n, i, r, a) : null != a && a(l.result)
                        }
                        ,
                        l.readAsDataURL(e)
                    }
                }, {
                    key: "displayExistingFile",
                    value: function(e, t, n, i) {
                        var r = this
                          , a = !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4];
                        if (this.emit("addedfile", e),
                        this.emit("complete", e),
                        a) {
                            var o = function(t) {
                                r.emit("thumbnail", e, t),
                                n && n()
                            };
                            e.dataURL = t,
                            this.createThumbnailFromUrl(e, this.options.thumbnailWidth, this.options.thumbnailHeight, this.options.resizeMethod, this.options.fixOrientation, o, i)
                        } else
                            this.emit("thumbnail", e, t),
                            n && n()
                    }
                }, {
                    key: "createThumbnailFromUrl",
                    value: function(e, t, n, i, r, a, o) {
                        var l = this
                          , s = document.createElement("img");
                        return o && (s.crossOrigin = o),
                        s.onload = function() {
                            var o = function(e) {
                                return e(1)
                            };
                            return "undefined" != typeof EXIF && null !== EXIF && r && (o = function(e) {
                                return EXIF.getData(s, (function() {
                                    return e(EXIF.getTag(this, "Orientation"))
                                }
                                ))
                            }
                            ),
                            o((function(r) {
                                e.width = s.width,
                                e.height = s.height;
                                var o = l.options.resize.call(l, e, t, n, i)
                                  , u = document.createElement("canvas")
                                  , c = u.getContext("2d");
                                switch (u.width = o.trgWidth,
                                u.height = o.trgHeight,
                                r > 4 && (u.width = o.trgHeight,
                                u.height = o.trgWidth),
                                r) {
                                case 2:
                                    c.translate(u.width, 0),
                                    c.scale(-1, 1);
                                    break;
                                case 3:
                                    c.translate(u.width, u.height),
                                    c.rotate(Math.PI);
                                    break;
                                case 4:
                                    c.translate(0, u.height),
                                    c.scale(1, -1);
                                    break;
                                case 5:
                                    c.rotate(.5 * Math.PI),
                                    c.scale(1, -1);
                                    break;
                                case 6:
                                    c.rotate(.5 * Math.PI),
                                    c.translate(0, -u.width);
                                    break;
                                case 7:
                                    c.rotate(.5 * Math.PI),
                                    c.translate(u.height, -u.width),
                                    c.scale(-1, 1);
                                    break;
                                case 8:
                                    c.rotate(-.5 * Math.PI),
                                    c.translate(-u.height, 0)
                                }
                                h(c, s, null != o.srcX ? o.srcX : 0, null != o.srcY ? o.srcY : 0, o.srcWidth, o.srcHeight, null != o.trgX ? o.trgX : 0, null != o.trgY ? o.trgY : 0, o.trgWidth, o.trgHeight);
                                var d = u.toDataURL("image/png");
                                if (null != a)
                                    return a(d, u)
                            }
                            ))
                        }
                        ,
                        null != a && (s.onerror = a),
                        s.src = e.dataURL
                    }
                }, {
                    key: "processQueue",
                    value: function() {
                        var e = this.options.parallelUploads
                          , t = this.getUploadingFiles().length
                          , n = t;
                        if (!(t >= e)) {
                            var i = this.getQueuedFiles();
                            if (i.length > 0) {
                                if (this.options.uploadMultiple)
                                    return this.processFiles(i.slice(0, e - t));
                                for (; n < e; ) {
                                    if (!i.length)
                                        return;
                                    this.processFile(i.shift()),
                                    n++
                                }
                            }
                        }
                    }
                }, {
                    key: "processFile",
                    value: function(e) {
                        return this.processFiles([e])
                    }
                }, {
                    key: "processFiles",
                    value: function(e) {
                        var n = !0
                          , i = !1
                          , r = void 0;
                        try {
                            for (var a, o = e[Symbol.iterator](); !(n = (a = o.next()).done); n = !0) {
                                var l = a.value;
                                l.processing = !0,
                                l.status = t.UPLOADING,
                                this.emit("processing", l)
                            }
                        } catch (e) {
                            i = !0,
                            r = e
                        } finally {
                            try {
                                n || null == o.return || o.return()
                            } finally {
                                if (i)
                                    throw r
                            }
                        }
                        return this.options.uploadMultiple && this.emit("processingmultiple", e),
                        this.uploadFiles(e)
                    }
                }, {
                    key: "_getFilesWithXhr",
                    value: function(e) {
                        return this.files.filter((function(t) {
                            return t.xhr === e
                        }
                        )).map((function(e) {
                            return e
                        }
                        ))
                    }
                }, {
                    key: "cancelUpload",
                    value: function(e) {
                        if (e.status === t.UPLOADING) {
                            var n = this._getFilesWithXhr(e.xhr)
                              , i = !0
                              , r = !1
                              , a = void 0;
                            try {
                                for (var o, l = n[Symbol.iterator](); !(i = (o = l.next()).done); i = !0) {
                                    o.value.status = t.CANCELED
                                }
                            } catch (e) {
                                r = !0,
                                a = e
                            } finally {
                                try {
                                    i || null == l.return || l.return()
                                } finally {
                                    if (r)
                                        throw a
                                }
                            }
                            void 0 !== e.xhr && e.xhr.abort();
                            var s = !0
                              , u = !1
                              , c = void 0;
                            try {
                                for (var d, p = n[Symbol.iterator](); !(s = (d = p.next()).done); s = !0) {
                                    var h = d.value;
                                    this.emit("canceled", h)
                                }
                            } catch (e) {
                                u = !0,
                                c = e
                            } finally {
                                try {
                                    s || null == p.return || p.return()
                                } finally {
                                    if (u)
                                        throw c
                                }
                            }
                            this.options.uploadMultiple && this.emit("canceledmultiple", n)
                        } else
                            e.status !== t.ADDED && e.status !== t.QUEUED || (e.status = t.CANCELED,
                            this.emit("canceled", e),
                            this.options.uploadMultiple && this.emit("canceledmultiple", [e]));
                        if (this.options.autoProcessQueue)
                            return this.processQueue()
                    }
                }, {
                    key: "resolveOption",
                    value: function(e) {
                        if ("function" == typeof e) {
                            for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
                                n[i - 1] = arguments[i];
                            return e.apply(this, n)
                        }
                        return e
                    }
                }, {
                    key: "uploadFile",
                    value: function(e) {
                        return this.uploadFiles([e])
                    }
                }, {
                    key: "uploadFiles",
                    value: function(e) {
                        var n = this;
                        this._transformFiles(e, (function(i) {
                            if (n.options.chunking) {
                                var r = i[0];
                                e[0].upload.chunked = n.options.chunking && (n.options.forceChunking || r.size > n.options.chunkSize),
                                e[0].upload.totalChunkCount = Math.ceil(r.size / n.options.chunkSize)
                            }
                            if (e[0].upload.chunked) {
                                var a = e[0]
                                  , o = i[0];
                                a.upload.chunks = [];
                                var l = function() {
                                    for (var i = 0; void 0 !== a.upload.chunks[i]; )
                                        i++;
                                    if (!(i >= a.upload.totalChunkCount)) {
                                        0;
                                        var r = i * n.options.chunkSize
                                          , l = Math.min(r + n.options.chunkSize, a.size)
                                          , s = {
                                            name: n._getParamName(0),
                                            data: o.webkitSlice ? o.webkitSlice(r, l) : o.slice(r, l),
                                            filename: a.upload.filename,
                                            chunkIndex: i
                                        };
                                        a.upload.chunks[i] = {
                                            file: a,
                                            index: i,
                                            dataBlock: s,
                                            status: t.UPLOADING,
                                            progress: 0,
                                            retries: 0
                                        },
                                        n._uploadData(e, [s])
                                    }
                                };
                                if (a.upload.finishedChunkUpload = function(i) {
                                    var r = !0;
                                    i.status = t.SUCCESS,
                                    i.dataBlock = null,
                                    i.xhr = null;
                                    for (var o = 0; o < a.upload.totalChunkCount; o++) {
                                        if (void 0 === a.upload.chunks[o])
                                            return l();
                                        a.upload.chunks[o].status !== t.SUCCESS && (r = !1)
                                    }
                                    r && n.options.chunksUploaded(a, (function() {
                                        n._finished(e, "", null)
                                    }
                                    ))
                                }
                                ,
                                n.options.parallelChunkUploads)
                                    for (var s = 0; s < a.upload.totalChunkCount; s++)
                                        l();
                                else
                                    l()
                            } else {
                                for (var u = [], c = 0; c < e.length; c++)
                                    u[c] = {
                                        name: n._getParamName(c),
                                        data: i[c],
                                        filename: e[c].upload.filename
                                    };
                                n._uploadData(e, u)
                            }
                        }
                        ))
                    }
                }, {
                    key: "_getChunk",
                    value: function(e, t) {
                        for (var n = 0; n < e.upload.totalChunkCount; n++)
                            if (void 0 !== e.upload.chunks[n] && e.upload.chunks[n].xhr === t)
                                return e.upload.chunks[n]
                    }
                }, {
                    key: "_uploadData",
                    value: function(e, n) {
                        var i = this
                          , r = new XMLHttpRequest
                          , a = !0
                          , o = !1
                          , l = void 0;
                        try {
                            for (var s, u = e[Symbol.iterator](); !(a = (s = u.next()).done); a = !0) {
                                s.value.xhr = r
                            }
                        } catch (e) {
                            o = !0,
                            l = e
                        } finally {
                            try {
                                a || null == u.return || u.return()
                            } finally {
                                if (o)
                                    throw l
                            }
                        }
                        e[0].upload.chunked && (e[0].upload.chunks[n[0].chunkIndex].xhr = r);
                        var c = this.resolveOption(this.options.method, e)
                          , d = this.resolveOption(this.options.url, e);
                        r.open(c, d, !0),
                        r.timeout = this.resolveOption(this.options.timeout, e),
                        r.withCredentials = !!this.options.withCredentials,
                        r.onload = function(t) {
                            i._finishedUploading(e, r, t)
                        }
                        ,
                        r.ontimeout = function() {
                            i._handleUploadError(e, r, "Request timedout after ".concat(i.options.timeout, " seconds"))
                        }
                        ,
                        r.onerror = function() {
                            i._handleUploadError(e, r)
                        }
                        ,
                        (null != r.upload ? r.upload : r).onprogress = function(t) {
                            return i._updateFilesUploadProgress(e, r, t)
                        }
                        ;
                        var p = {
                            Accept: "application/json",
                            "Cache-Control": "no-cache",
                            "X-Requested-With": "XMLHttpRequest"
                        };
                        for (var h in this.options.headers && t.extend(p, this.options.headers),
                        p) {
                            var f = p[h];
                            f && r.setRequestHeader(h, f)
                        }
                        var v = new FormData;
                        if (this.options.params) {
                            var m = this.options.params;
                            for (var y in "function" == typeof m && (m = m.call(this, e, r, e[0].upload.chunked ? this._getChunk(e[0], r) : null)),
                            m) {
                                var g = m[y];
                                v.append(y, g)
                            }
                        }
                        var b = !0
                          , k = !1
                          , w = void 0;
                        try {
                            for (var F, x = e[Symbol.iterator](); !(b = (F = x.next()).done); b = !0) {
                                var E = F.value;
                                this.emit("sending", E, r, v)
                            }
                        } catch (e) {
                            k = !0,
                            w = e
                        } finally {
                            try {
                                b || null == x.return || x.return()
                            } finally {
                                if (k)
                                    throw w
                            }
                        }
                        this.options.uploadMultiple && this.emit("sendingmultiple", e, r, v),
                        this._addFormElementData(v);
                        for (var z = 0; z < n.length; z++) {
                            var C = n[z];
                            v.append(C.name, C.data, C.filename)
                        }
                        this.submitRequest(r, v, e)
                    }
                }, {
                    key: "_transformFiles",
                    value: function(e, t) {
                        for (var n = this, i = [], r = 0, a = function(a) {
                            n.options.transformFile.call(n, e[a], (function(n) {
                                i[a] = n,
                                ++r === e.length && t(i)
                            }
                            ))
                        }, o = 0; o < e.length; o++)
                            a(o)
                    }
                }, {
                    key: "_addFormElementData",
                    value: function(e) {
                        if ("FORM" === this.element.tagName) {
                            var t = !0
                              , n = !1
                              , i = void 0;
                            try {
                                for (var r, a = this.element.querySelectorAll("input, textarea, select, button")[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                                    var o = r.value
                                      , l = o.getAttribute("name")
                                      , s = o.getAttribute("type");
                                    if (s && (s = s.toLowerCase()),
                                    null != l)
                                        if ("SELECT" === o.tagName && o.hasAttribute("multiple")) {
                                            var u = !0
                                              , c = !1
                                              , d = void 0;
                                            try {
                                                for (var p, h = o.options[Symbol.iterator](); !(u = (p = h.next()).done); u = !0) {
                                                    var f = p.value;
                                                    f.selected && e.append(l, f.value)
                                                }
                                            } catch (e) {
                                                c = !0,
                                                d = e
                                            } finally {
                                                try {
                                                    u || null == h.return || h.return()
                                                } finally {
                                                    if (c)
                                                        throw d
                                                }
                                            }
                                        } else
                                            (!s || "checkbox" !== s && "radio" !== s || o.checked) && e.append(l, o.value)
                                }
                            } catch (e) {
                                n = !0,
                                i = e
                            } finally {
                                try {
                                    t || null == a.return || a.return()
                                } finally {
                                    if (n)
                                        throw i
                                }
                            }
                        }
                    }
                }, {
                    key: "_updateFilesUploadProgress",
                    value: function(e, t, n) {
                        var i;
                        if (void 0 !== n) {
                            if (i = 100 * n.loaded / n.total,
                            e[0].upload.chunked) {
                                var r = e[0]
                                  , a = this._getChunk(r, t);
                                a.progress = i,
                                a.total = n.total,
                                a.bytesSent = n.loaded;
                                r.upload.progress = 0,
                                r.upload.total = 0,
                                r.upload.bytesSent = 0;
                                for (var o = 0; o < r.upload.totalChunkCount; o++)
                                    void 0 !== r.upload.chunks[o] && void 0 !== r.upload.chunks[o].progress && (r.upload.progress += r.upload.chunks[o].progress,
                                    r.upload.total += r.upload.chunks[o].total,
                                    r.upload.bytesSent += r.upload.chunks[o].bytesSent);
                                r.upload.progress = r.upload.progress / r.upload.totalChunkCount
                            } else {
                                var l = !0
                                  , s = !1
                                  , u = void 0;
                                try {
                                    for (var c, d = e[Symbol.iterator](); !(l = (c = d.next()).done); l = !0) {
                                        var p = c.value;
                                        p.upload.progress = i,
                                        p.upload.total = n.total,
                                        p.upload.bytesSent = n.loaded
                                    }
                                } catch (e) {
                                    s = !0,
                                    u = e
                                } finally {
                                    try {
                                        l || null == d.return || d.return()
                                    } finally {
                                        if (s)
                                            throw u
                                    }
                                }
                            }
                            var h = !0
                              , f = !1
                              , v = void 0;
                            try {
                                for (var m, y = e[Symbol.iterator](); !(h = (m = y.next()).done); h = !0) {
                                    var g = m.value;
                                    this.emit("uploadprogress", g, g.upload.progress, g.upload.bytesSent)
                                }
                            } catch (e) {
                                f = !0,
                                v = e
                            } finally {
                                try {
                                    h || null == y.return || y.return()
                                } finally {
                                    if (f)
                                        throw v
                                }
                            }
                        } else {
                            var b = !0;
                            i = 100;
                            var k = !0
                              , w = !1
                              , F = void 0;
                            try {
                                for (var x, E = e[Symbol.iterator](); !(k = (x = E.next()).done); k = !0) {
                                    var z = x.value;
                                    100 === z.upload.progress && z.upload.bytesSent === z.upload.total || (b = !1),
                                    z.upload.progress = i,
                                    z.upload.bytesSent = z.upload.total
                                }
                            } catch (e) {
                                w = !0,
                                F = e
                            } finally {
                                try {
                                    k || null == E.return || E.return()
                                } finally {
                                    if (w)
                                        throw F
                                }
                            }
                            if (b)
                                return;
                            var C = !0
                              , S = !1
                              , _ = void 0;
                            try {
                                for (var T, L = e[Symbol.iterator](); !(C = (T = L.next()).done); C = !0) {
                                    var A = T.value;
                                    this.emit("uploadprogress", A, i, A.upload.bytesSent)
                                }
                            } catch (e) {
                                S = !0,
                                _ = e
                            } finally {
                                try {
                                    C || null == L.return || L.return()
                                } finally {
                                    if (S)
                                        throw _
                                }
                            }
                        }
                    }
                }, {
                    key: "_finishedUploading",
                    value: function(e, n, i) {
                        var r;
                        if (e[0].status !== t.CANCELED && 4 === n.readyState) {
                            if ("arraybuffer" !== n.responseType && "blob" !== n.responseType && (r = n.responseText,
                            n.getResponseHeader("content-type") && ~n.getResponseHeader("content-type").indexOf("application/json")))
                                try {
                                    r = JSON.parse(r)
                                } catch (e) {
                                    i = e,
                                    r = "Invalid JSON response from server."
                                }
                            this._updateFilesUploadProgress(e),
                            200 <= n.status && n.status < 300 ? e[0].upload.chunked ? e[0].upload.finishedChunkUpload(this._getChunk(e[0], n)) : this._finished(e, r, i) : this._handleUploadError(e, n, r)
                        }
                    }
                }, {
                    key: "_handleUploadError",
                    value: function(e, n, i) {
                        if (e[0].status !== t.CANCELED) {
                            if (e[0].upload.chunked && this.options.retryChunks) {
                                var r = this._getChunk(e[0], n);
                                if (r.retries++ < this.options.retryChunksLimit)
                                    return void this._uploadData(e, [r.dataBlock]);
                                console.warn("Retried this chunk too often. Giving up.")
                            }
                            this._errorProcessing(e, i || this.options.dictResponseError.replace("{{statusCode}}", n.status), n)
                        }
                    }
                }, {
                    key: "submitRequest",
                    value: function(e, t, n) {
                        e.send(t)
                    }
                }, {
                    key: "_finished",
                    value: function(e, n, i) {
                        var r = !0
                          , a = !1
                          , o = void 0;
                        try {
                            for (var l, s = e[Symbol.iterator](); !(r = (l = s.next()).done); r = !0) {
                                var u = l.value;
                                u.status = t.SUCCESS,
                                this.emit("success", u, n, i),
                                this.emit("complete", u)
                            }
                        } catch (e) {
                            a = !0,
                            o = e
                        } finally {
                            try {
                                r || null == s.return || s.return()
                            } finally {
                                if (a)
                                    throw o
                            }
                        }
                        if (this.options.uploadMultiple && (this.emit("successmultiple", e, n, i),
                        this.emit("completemultiple", e)),
                        this.options.autoProcessQueue)
                            return this.processQueue()
                    }
                }, {
                    key: "_errorProcessing",
                    value: function(e, n, i) {
                        var r = !0
                          , a = !1
                          , o = void 0;
                        try {
                            for (var l, s = e[Symbol.iterator](); !(r = (l = s.next()).done); r = !0) {
                                var u = l.value;
                                u.status = t.ERROR,
                                this.emit("error", u, n, i),
                                this.emit("complete", u)
                            }
                        } catch (e) {
                            a = !0,
                            o = e
                        } finally {
                            try {
                                r || null == s.return || s.return()
                            } finally {
                                if (a)
                                    throw o
                            }
                        }
                        if (this.options.uploadMultiple && (this.emit("errormultiple", e, n, i),
                        this.emit("completemultiple", e)),
                        this.options.autoProcessQueue)
                            return this.processQueue()
                    }
                }], [{
                    key: "uuidv4",
                    value: function() {
                        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(e) {
                            var t = 16 * Math.random() | 0;
                            return ("x" === e ? t : 3 & t | 8).toString(16)
                        }
                        ))
                    }
                }]),
                t
            }(u);
            c.initClass(),
            c.version = "5.7.0",
            c.options = {},
            c.optionsForElement = function(e) {
                return e.getAttribute("id") ? c.options[p(e.getAttribute("id"))] : void 0
            }
            ,
            c.instances = [],
            c.forElement = function(e) {
                if ("string" == typeof e && (e = document.querySelector(e)),
                null == (null != e ? e.dropzone : void 0))
                    throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
                return e.dropzone
            }
            ,
            c.autoDiscover = !0,
            c.discover = function() {
                var e;
                if (document.querySelectorAll)
                    e = document.querySelectorAll(".dropzone");
                else {
                    e = [];
                    var t = function(t) {
                        return function() {
                            var n = []
                              , i = !0
                              , r = !1
                              , a = void 0;
                            try {
                                for (var o, l = t[Symbol.iterator](); !(i = (o = l.next()).done); i = !0) {
                                    var s = o.value;
                                    /(^| )dropzone($| )/.test(s.className) ? n.push(e.push(s)) : n.push(void 0)
                                }
                            } catch (e) {
                                r = !0,
                                a = e
                            } finally {
                                try {
                                    i || null == l.return || l.return()
                                } finally {
                                    if (r)
                                        throw a
                                }
                            }
                            return n
                        }()
                    };
                    t(document.getElementsByTagName("div")),
                    t(document.getElementsByTagName("form"))
                }
                return function() {
                    var t = []
                      , n = !0
                      , i = !1
                      , r = void 0;
                    try {
                        for (var a, o = e[Symbol.iterator](); !(n = (a = o.next()).done); n = !0) {
                            var l = a.value;
                            !1 !== c.optionsForElement(l) ? t.push(new c(l)) : t.push(void 0)
                        }
                    } catch (e) {
                        i = !0,
                        r = e
                    } finally {
                        try {
                            n || null == o.return || o.return()
                        } finally {
                            if (i)
                                throw r
                        }
                    }
                    return t
                }()
            }
            ,
            c.blacklistedBrowsers = [/opera.*(Macintosh|Windows Phone).*version\/12/i],
            c.isBrowserSupported = function() {
                var e = !0;
                if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector)
                    if ("classList"in document.createElement("a")) {
                        var t = !0
                          , n = !1
                          , i = void 0;
                        try {
                            for (var r, a = c.blacklistedBrowsers[Symbol.iterator](); !(t = (r = a.next()).done); t = !0) {
                                r.value.test(navigator.userAgent) && (e = !1)
                            }
                        } catch (e) {
                            n = !0,
                            i = e
                        } finally {
                            try {
                                t || null == a.return || a.return()
                            } finally {
                                if (n)
                                    throw i
                            }
                        }
                    } else
                        e = !1;
                else
                    e = !1;
                return e
            }
            ,
            c.dataURItoBlob = function(e) {
                for (var t = atob(e.split(",")[1]), n = e.split(",")[0].split(":")[1].split(";")[0], i = new ArrayBuffer(t.length), r = new Uint8Array(i), a = 0, o = t.length, l = 0 <= o; l ? a <= o : a >= o; l ? a++ : a--)
                    r[a] = t.charCodeAt(a);
                return new Blob([i],{
                    type: n
                })
            }
            ;
            var d = function(e, t) {
                return e.filter((function(e) {
                    return e !== t
                }
                )).map((function(e) {
                    return e
                }
                ))
            }
              , p = function(e) {
                return e.replace(/[\-_](\w)/g, (function(e) {
                    return e.charAt(1).toUpperCase()
                }
                ))
            };
            c.createElement = function(e) {
                var t = document.createElement("div");
                return t.innerHTML = e,
                t.childNodes[0]
            }
            ,
            c.elementInside = function(e, t) {
                if (e === t)
                    return !0;
                for (; e = e.parentNode; )
                    if (e === t)
                        return !0;
                return !1
            }
            ,
            c.getElement = function(e, t) {
                var n;
                if ("string" == typeof e ? n = document.querySelector(e) : null != e.nodeType && (n = e),
                null == n)
                    throw new Error("Invalid `".concat(t, "` option provided. Please provide a CSS selector or a plain HTML element."));
                return n
            }
            ,
            c.getElements = function(e, t) {
                var n, i;
                if (e instanceof Array) {
                    i = [];
                    try {
                        var r = !0
                          , a = !1
                          , o = void 0;
                        try {
                            for (var l, s = e[Symbol.iterator](); !(r = (l = s.next()).done); r = !0)
                                n = l.value,
                                i.push(this.getElement(n, t))
                        } catch (e) {
                            a = !0,
                            o = e
                        } finally {
                            try {
                                r || null == s.return || s.return()
                            } finally {
                                if (a)
                                    throw o
                            }
                        }
                    } catch (e) {
                        i = null
                    }
                } else if ("string" == typeof e) {
                    i = [];
                    var u = !0
                      , c = !1
                      , d = void 0;
                    try {
                        for (var p, h = document.querySelectorAll(e)[Symbol.iterator](); !(u = (p = h.next()).done); u = !0)
                            n = p.value,
                            i.push(n)
                    } catch (e) {
                        c = !0,
                        d = e
                    } finally {
                        try {
                            u || null == h.return || h.return()
                        } finally {
                            if (c)
                                throw d
                        }
                    }
                } else
                    null != e.nodeType && (i = [e]);
                if (null == i || !i.length)
                    throw new Error("Invalid `".concat(t, "` option provided. Please provide a CSS selector, a plain HTML element or a list of those."));
                return i
            }
            ,
            c.confirm = function(e, t, n) {
                return window.confirm(e) ? t() : null != n ? n() : void 0
            }
            ,
            c.isValidFile = function(e, t) {
                if (!t)
                    return !0;
                t = t.split(",");
                var n = e.type
                  , i = n.replace(/\/.*$/, "")
                  , r = !0
                  , a = !1
                  , o = void 0;
                try {
                    for (var l, s = t[Symbol.iterator](); !(r = (l = s.next()).done); r = !0) {
                        var u = l.value;
                        if ("." === (u = u.trim()).charAt(0)) {
                            if (-1 !== e.name.toLowerCase().indexOf(u.toLowerCase(), e.name.length - u.length))
                                return !0
                        } else if (/\/\*$/.test(u)) {
                            if (i === u.replace(/\/.*$/, ""))
                                return !0
                        } else if (n === u)
                            return !0
                    }
                } catch (e) {
                    a = !0,
                    o = e
                } finally {
                    try {
                        r || null == s.return || s.return()
                    } finally {
                        if (a)
                            throw o
                    }
                }
                return !1
            }
            ,
            "undefined" != typeof jQuery && null !== jQuery && (jQuery.fn.dropzone = function(e) {
                return this.each((function() {
                    return new c(this,e)
                }
                ))
            }
            ),
            null !== e ? e.exports = c : window.Dropzone = c,
            c.ADDED = "added",
            c.QUEUED = "queued",
            c.ACCEPTED = c.QUEUED,
            c.UPLOADING = "uploading",
            c.PROCESSING = c.UPLOADING,
            c.CANCELED = "canceled",
            c.ERROR = "error",
            c.SUCCESS = "success";
            var h = function(e, t, n, i, r, a, o, l, s, u) {
                var c = function(e) {
                    e.naturalWidth;
                    var t = e.naturalHeight
                      , n = document.createElement("canvas");
                    n.width = 1,
                    n.height = t;
                    var i = n.getContext("2d");
                    i.drawImage(e, 0, 0);
                    for (var r = i.getImageData(1, 0, 1, t).data, a = 0, o = t, l = t; l > a; ) {
                        0 === r[4 * (l - 1) + 3] ? o = l : a = l,
                        l = o + a >> 1
                    }
                    var s = l / t;
                    return 0 === s ? 1 : s
                }(t);
                return e.drawImage(t, n, i, r, a, o, l, s, u / c)
            }
              , f = function() {
                function e() {
                    o(this, e)
                }
                return s(e, null, [{
                    key: "initClass",
                    value: function() {
                        this.KEY_STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
                    }
                }, {
                    key: "encode64",
                    value: function(e) {
                        for (var t = "", n = void 0, i = void 0, r = "", a = void 0, o = void 0, l = void 0, s = "", u = 0; a = (n = e[u++]) >> 2,
                        o = (3 & n) << 4 | (i = e[u++]) >> 4,
                        l = (15 & i) << 2 | (r = e[u++]) >> 6,
                        s = 63 & r,
                        isNaN(i) ? l = s = 64 : isNaN(r) && (s = 64),
                        t = t + this.KEY_STR.charAt(a) + this.KEY_STR.charAt(o) + this.KEY_STR.charAt(l) + this.KEY_STR.charAt(s),
                        n = i = r = "",
                        a = o = l = s = "",
                        u < e.length; )
                            ;
                        return t
                    }
                }, {
                    key: "restore",
                    value: function(e, t) {
                        if (!e.match("data:image/jpeg;base64,"))
                            return t;
                        var n = this.decode64(e.replace("data:image/jpeg;base64,", ""))
                          , i = this.slice2Segments(n)
                          , r = this.exifManipulation(t, i);
                        return "data:image/jpeg;base64,".concat(this.encode64(r))
                    }
                }, {
                    key: "exifManipulation",
                    value: function(e, t) {
                        var n = this.getExifArray(t)
                          , i = this.insertExif(e, n);
                        return new Uint8Array(i)
                    }
                }, {
                    key: "getExifArray",
                    value: function(e) {
                        for (var t = void 0, n = 0; n < e.length; ) {
                            if (255 === (t = e[n])[0] & 225 === t[1])
                                return t;
                            n++
                        }
                        return []
                    }
                }, {
                    key: "insertExif",
                    value: function(e, t) {
                        var n = e.replace("data:image/jpeg;base64,", "")
                          , i = this.decode64(n)
                          , r = i.indexOf(255, 3)
                          , a = i.slice(0, r)
                          , o = i.slice(r)
                          , l = a;
                        return l = (l = l.concat(t)).concat(o)
                    }
                }, {
                    key: "slice2Segments",
                    value: function(e) {
                        for (var t = 0, n = []; ; ) {
                            if (255 === e[t] & 218 === e[t + 1])
                                break;
                            if (255 === e[t] & 216 === e[t + 1])
                                t += 2;
                            else {
                                var i = t + (256 * e[t + 2] + e[t + 3]) + 2
                                  , r = e.slice(t, i);
                                n.push(r),
                                t = i
                            }
                            if (t > e.length)
                                break
                        }
                        return n
                    }
                }, {
                    key: "decode64",
                    value: function(e) {
                        var t = void 0
                          , n = void 0
                          , i = ""
                          , r = void 0
                          , a = void 0
                          , o = ""
                          , l = 0
                          , s = [];
                        for (/[^A-Za-z0-9\+\/\=]/g.exec(e) && console.warn("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding."),
                        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); t = this.KEY_STR.indexOf(e.charAt(l++)) << 2 | (r = this.KEY_STR.indexOf(e.charAt(l++))) >> 4,
                        n = (15 & r) << 4 | (a = this.KEY_STR.indexOf(e.charAt(l++))) >> 2,
                        i = (3 & a) << 6 | (o = this.KEY_STR.indexOf(e.charAt(l++))),
                        s.push(t),
                        64 !== a && s.push(n),
                        64 !== o && s.push(i),
                        t = n = i = "",
                        r = a = o = "",
                        l < e.length; )
                            ;
                        return s
                    }
                }]),
                e
            }();
            f.initClass();
            c._autoDiscoverFunction = function() {
                if (c.autoDiscover)
                    return c.discover()
            }
            ,
            function(e, t) {
                var n = !1
                  , i = !0
                  , r = e.document
                  , a = r.documentElement
                  , o = r.addEventListener ? "addEventListener" : "attachEvent"
                  , l = r.addEventListener ? "removeEventListener" : "detachEvent"
                  , s = r.addEventListener ? "" : "on"
                  , u = function i(a) {
                    if ("readystatechange" !== a.type || "complete" === r.readyState)
                        return ("load" === a.type ? e : r)[l](s + a.type, i, !1),
                        !n && (n = !0) ? t.call(e, a.type || a) : void 0
                };
                if ("complete" !== r.readyState) {
                    if (r.createEventObject && a.doScroll) {
                        try {
                            i = !e.frameElement
                        } catch (e) {}
                        i && function e() {
                            try {
                                a.doScroll("left")
                            } catch (t) {
                                return void setTimeout(e, 50)
                            }
                            return u("poll")
                        }()
                    }
                    r[o](s + "DOMContentLoaded", u, !1),
                    r[o](s + "readystatechange", u, !1),
                    e[o](s + "load", u, !1)
                }
            }(window, c._autoDiscoverFunction)
        }
        ).call(this, n(37)(e))
    }
}));
