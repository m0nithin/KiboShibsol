! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(require("jquery")) : "function" == typeof define && define.amd ? define(["jquery"], t) : t(e.jQuery)
}(this, function(e) {
    "use strict";
    var t, r = (e = e && "default" in e ? e.default : e)(window);

    function i(e) {
        return "%" == e[e.length - 1]
    }

    function n(e, r, i) {
        function n(e, r) {
            var i = t.createShader(e);
            if (t.shaderSource(i, r), t.compileShader(i), !t.getShaderParameter(i, t.COMPILE_STATUS)) throw Error("compile error: " + t.getShaderInfoLog(i));
            return i
        }
        var o = {};
        if (o.id = t.createProgram(), t.attachShader(o.id, n(t.VERTEX_SHADER, e)), t.attachShader(o.id, n(t.FRAGMENT_SHADER, r)), t.linkProgram(o.id), !t.getProgramParameter(o.id, t.LINK_STATUS)) throw Error("link error: " + t.getProgramInfoLog(o.id));
        o.uniforms = {}, o.locations = {}, t.useProgram(o.id), t.enableVertexAttribArray(0);
        for (var a, s, u = /uniform (\w+) (\w+)/g, h = e + r; null != (a = u.exec(h));) s = a[2], o.locations[s] = t.getUniformLocation(o.id, s);
        return o
    }

    function o(e, r) {
        t.activeTexture(t.TEXTURE0 + (r || 0)), t.bindTexture(t.TEXTURE_2D, e)
    }

    function a(e) {
        var t = /url\(["']?([^"']*)["']?\)/.exec(e);
        return null == t ? null : t[1]
    }
    var s = function e() {
            var r = document.createElement("canvas");
            if (!(t = r.getContext("webgl") || r.getContext("experimental-webgl"))) return null;
            var i = {};
            if (["OES_texture_float", "OES_texture_half_float", "OES_texture_float_linear", "OES_texture_half_float_linear"].forEach(function(e) {
                    var r = t.getExtension(e);
                    r && (i[e] = r)
                }), !i.OES_texture_float) return null;
            var n = [];

            function o(e, t, r) {
                var n = "OES_texture_" + e,
                    o = n + "_linear",
                    a = o in i,
                    s = [n];
                return a && s.push(o), {
                    type: t,
                    arrayType: r,
                    linearSupport: a,
                    extensions: s
                }
            }
            n.push(o("float", t.FLOAT, Float32Array)), i.OES_texture_half_float && n.push(o("half_float", i.OES_texture_half_float.HALF_FLOAT_OES, null));
            var a = t.createTexture(),
                s = t.createFramebuffer();
            t.bindFramebuffer(t.FRAMEBUFFER, s), t.bindTexture(t.TEXTURE_2D, a), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
            for (var u = null, h = 0; h < n.length; h++)
                if (t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, 32, 32, 0, t.RGBA, n[h].type, null), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, a, 0), t.checkFramebufferStatus(t.FRAMEBUFFER) === t.FRAMEBUFFER_COMPLETE) {
                    u = n[h];
                    break
                }
            return u
        }(),
        u = function e(t, r) {
            try {
                return new ImageData(t, r)
            } catch (i) {
                return document.createElement("canvas").getContext("2d").createImageData(t, r)
            }
        }(32, 32);
    e("head").prepend("<style>.jquery-ripples { position: relative; z-index: 0; }</style>");
    var h = function(r, i) {
        var n = this;
        this.$el = e(r), this.interactive = i.interactive, this.resolution = i.resolution, this.textureDelta = new Float32Array([1 / this.resolution, 1 / this.resolution]), this.perturbance = i.perturbance, this.dropRadius = i.dropRadius, this.crossOrigin = i.crossOrigin, this.imageUrl = i.imageUrl;
        var o = document.createElement("canvas");
        o.width = this.$el.innerWidth(), o.height = this.$el.innerHeight(), this.canvas = o, this.$canvas = e(o), this.$canvas.css({
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: -1
        }), this.$el.addClass("jquery-ripples").append(o), this.context = t = o.getContext("webgl") || o.getContext("experimental-webgl"), s.extensions.forEach(function(e) {
            t.getExtension(e)
        }), this.updateSize = this.updateSize.bind(this), e(window).on("resize", this.updateSize), this.textures = [], this.framebuffers = [], this.bufferWriteIndex = 0, this.bufferReadIndex = 1;
        for (var a = s.arrayType, u = a ? new a(this.resolution * this.resolution * 4) : null, h = 0; h < 2; h++) {
            var c = t.createTexture(),
                d = t.createFramebuffer();
            t.bindFramebuffer(t.FRAMEBUFFER, d), t.bindTexture(t.TEXTURE_2D, c), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, s.linearSupport ? t.LINEAR : t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, s.linearSupport ? t.LINEAR : t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, this.resolution, this.resolution, 0, t.RGBA, s.type, u), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, c, 0), this.textures.push(c), this.framebuffers.push(d)
        }

        function f() {
            n.destroyed || (n.step(), requestAnimationFrame(f))
        }
        this.quad = t.createBuffer(), t.bindBuffer(t.ARRAY_BUFFER, this.quad), t.bufferData(t.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), t.STATIC_DRAW), this.initShaders(), this.initTexture(), this.setTransparentTexture(), this.loadImage(), t.clearColor(0, 0, 0, 0), t.blendFunc(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA), this.visible = !0, this.running = !0, this.inited = !0, this.destroyed = !1, this.setupPointerEvents(), requestAnimationFrame(f)
    };
    h.DEFAULTS = {
        imageUrl: null,
        resolution: 256,
        dropRadius: 20,
        perturbance: .03,
        interactive: !0,
        crossOrigin: ""
    }, h.prototype = {
        setupPointerEvents: function() {
            var e = this;

            function t(t, r) {
                e.visible && e.running && e.interactive && e.dropAtPointer(t, e.dropRadius * (r ? 1.5 : 1), r ? .14 : .01)
            }
            this.$el.on("mousemove.ripples", function(e) {
                t(e)
            }).on("touchmove.ripples touchstart.ripples", function(e) {
                for (var r = e.originalEvent.changedTouches, i = 0; i < r.length; i++) t(r[i])
            }).on("mousedown.ripples", function(e) {
                t(e, !0)
            })
        },
        loadImage: function() {
            var e = this;
            t = this.context;
            var r = this.imageUrl || a(this.originalCssBackgroundImage) || a(this.$el.css("backgroundImage"));
            if (r != this.imageSource) {
                if (this.imageSource = r, !this.imageSource) {
                    this.setTransparentTexture();
                    return
                }
                var i, n = new Image;
                n.onload = function() {
                    function r(e) {
                        return (e & e - 1) == 0
                    }
                    t = e.context;
                    var i = r(n.width) && r(n.height) ? t.REPEAT : t.CLAMP_TO_EDGE;
                    t.bindTexture(t.TEXTURE_2D, e.backgroundTexture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, i), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, i), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, n), e.backgroundWidth = n.width, e.backgroundHeight = n.height, e.hideCssBackground()
                }, n.onerror = function() {
                    t = e.context, e.setTransparentTexture()
                }, i = this.imageSource, n.crossOrigin = i.match(/^data:/) ? null : this.crossOrigin, n.src = this.imageSource
            }
        },
        step: function() {
            t = this.context, this.visible && (this.computeTextureBoundaries(), this.running && this.update(), this.render())
        },
        drawQuad: function() {
            t.bindBuffer(t.ARRAY_BUFFER, this.quad), t.vertexAttribPointer(0, 2, t.FLOAT, !1, 0, 0), t.drawArrays(t.TRIANGLE_FAN, 0, 4)
        },
        render: function() {
            t.bindFramebuffer(t.FRAMEBUFFER, null), t.viewport(0, 0, this.canvas.width, this.canvas.height), t.enable(t.BLEND), t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT), t.useProgram(this.renderProgram.id), o(this.backgroundTexture, 0), o(this.textures[0], 1), t.uniform1f(this.renderProgram.locations.perturbance, this.perturbance), t.uniform2fv(this.renderProgram.locations.topLeft, this.renderProgram.uniforms.topLeft), t.uniform2fv(this.renderProgram.locations.bottomRight, this.renderProgram.uniforms.bottomRight), t.uniform2fv(this.renderProgram.locations.containerRatio, this.renderProgram.uniforms.containerRatio), t.uniform1i(this.renderProgram.locations.samplerBackground, 0), t.uniform1i(this.renderProgram.locations.samplerRipples, 1), this.drawQuad(), t.disable(t.BLEND)
        },
        update: function() {
            t.viewport(0, 0, this.resolution, this.resolution), t.bindFramebuffer(t.FRAMEBUFFER, this.framebuffers[this.bufferWriteIndex]), o(this.textures[this.bufferReadIndex]), t.useProgram(this.updateProgram.id), this.drawQuad(), this.swapBufferIndices()
        },
        swapBufferIndices: function() {
            this.bufferWriteIndex = 1 - this.bufferWriteIndex, this.bufferReadIndex = 1 - this.bufferReadIndex
        },
        computeTextureBoundaries: function() {
            var e, t = this.$el.css("background-size"),
                n = this.$el.css("background-attachment"),
                o = function e(t) {
                    var r = t.split(" ");
                    if (1 !== r.length) return r.map(function(e) {
                        switch (t) {
                            case "center":
                                return "50%";
                            case "top":
                            case "left":
                                return "0";
                            case "right":
                            case "bottom":
                                return "100%";
                            default:
                                return e
                        }
                    });
                    switch (t) {
                        case "center":
                            return ["50%", "50%"];
                        case "top":
                            return ["50%", "0"];
                        case "bottom":
                            return ["50%", "100%"];
                        case "left":
                            return ["0", "50%"];
                        case "right":
                            return ["100%", "50%"];
                        default:
                            return [t, "50%"]
                    }
                }(this.$el.css("background-position"));
            if ("fixed" == n ? ((e = {
                    left: window.pageXOffset,
                    top: window.pageYOffset
                }).width = r.width(), e.height = r.height()) : ((e = this.$el.offset()).width = this.$el.innerWidth(), e.height = this.$el.innerHeight()), "cover" == t) var a = Math.max(e.width / this.backgroundWidth, e.height / this.backgroundHeight),
                s = this.backgroundWidth * a,
                u = this.backgroundHeight * a;
            else if ("contain" == t) var a = Math.min(e.width / this.backgroundWidth, e.height / this.backgroundHeight),
                s = this.backgroundWidth * a,
                u = this.backgroundHeight * a;
            else {
                var s = (t = t.split(" "))[0] || "",
                    u = t[1] || s;
                i(s) ? s = e.width * parseFloat(s) / 100 : "auto" != s && (s = parseFloat(s)), i(u) ? u = e.height * parseFloat(u) / 100 : "auto" != u && (u = parseFloat(u)), "auto" == s && "auto" == u ? (s = this.backgroundWidth, u = this.backgroundHeight) : ("auto" == s && (s = this.backgroundWidth * (u / this.backgroundHeight)), "auto" == u && (u = this.backgroundHeight * (s / this.backgroundWidth)))
            }
            var h = o[0],
                c = o[1];
            h = i(h) ? e.left + (e.width - s) * parseFloat(h) / 100 : e.left + parseFloat(h), c = i(c) ? e.top + (e.height - u) * parseFloat(c) / 100 : e.top + parseFloat(c);
            var d = this.$el.offset();
            this.renderProgram.uniforms.topLeft = new Float32Array([(d.left - h) / s, (d.top - c) / u]), this.renderProgram.uniforms.bottomRight = new Float32Array([this.renderProgram.uniforms.topLeft[0] + this.$el.innerWidth() / s, this.renderProgram.uniforms.topLeft[1] + this.$el.innerHeight() / u]);
            var f = Math.max(this.canvas.width, this.canvas.height);
            this.renderProgram.uniforms.containerRatio = new Float32Array([this.canvas.width / f, this.canvas.height / f])
        },
        initShaders: function() {
            var e = "attribute vec2 vertex;\nvarying vec2 coord;\nvoid main() {\ncoord = vertex * 0.5 + 0.5;\ngl_Position = vec4(vertex, 0.0, 1.0);\n}";
            this.dropProgram = n(e, "precision highp float;\nconst float PI = 3.141592653589793;\nuniform sampler2D texture;\nuniform vec2 center;\nuniform float radius;\nuniform float strength;\nvarying vec2 coord;\nvoid main() {\nvec4 info = texture2D(texture, coord);\nfloat drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - coord) / radius);\ndrop = 0.5 - cos(drop * PI) * 0.5;\ninfo.r += drop * strength;\ngl_FragColor = info;\n}"), this.updateProgram = n(e, "precision highp float;\nuniform sampler2D texture;\nuniform vec2 delta;\nvarying vec2 coord;\nvoid main() {\nvec4 info = texture2D(texture, coord);\nvec2 dx = vec2(delta.x, 0.0);\nvec2 dy = vec2(0.0, delta.y);\nfloat average = (\ntexture2D(texture, coord - dx).r +\ntexture2D(texture, coord - dy).r +\ntexture2D(texture, coord + dx).r +\ntexture2D(texture, coord + dy).r\n) * 0.25;\ninfo.g += (average - info.r) * 2.0;\ninfo.g *= 0.995;\ninfo.r += info.g;\ngl_FragColor = info;\n}"), t.uniform2fv(this.updateProgram.locations.delta, this.textureDelta), this.renderProgram = n("precision highp float;\nattribute vec2 vertex;\nuniform vec2 topLeft;\nuniform vec2 bottomRight;\nuniform vec2 containerRatio;\nvarying vec2 ripplesCoord;\nvarying vec2 backgroundCoord;\nvoid main() {\nbackgroundCoord = mix(topLeft, bottomRight, vertex * 0.5 + 0.5);\nbackgroundCoord.y = 1.0 - backgroundCoord.y;\nripplesCoord = vec2(vertex.x, -vertex.y) * containerRatio * 0.5 + 0.5;\ngl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);\n}", "precision highp float;\nuniform sampler2D samplerBackground;\nuniform sampler2D samplerRipples;\nuniform vec2 delta;\nuniform float perturbance;\nvarying vec2 ripplesCoord;\nvarying vec2 backgroundCoord;\nvoid main() {\nfloat height = texture2D(samplerRipples, ripplesCoord).r;\nfloat heightX = texture2D(samplerRipples, vec2(ripplesCoord.x + delta.x, ripplesCoord.y)).r;\nfloat heightY = texture2D(samplerRipples, vec2(ripplesCoord.x, ripplesCoord.y + delta.y)).r;\nvec3 dx = vec3(delta.x, heightX - height, 0.0);\nvec3 dy = vec3(0.0, heightY - height, delta.y);\nvec2 offset = -normalize(cross(dy, dx)).xz;\nfloat specular = pow(max(0.0, dot(offset, normalize(vec2(-0.6, 1.0)))), 4.0);\ngl_FragColor = texture2D(samplerBackground, backgroundCoord + offset * perturbance) + specular;\n}"), t.uniform2fv(this.renderProgram.locations.delta, this.textureDelta)
        },
        initTexture: function() {
            this.backgroundTexture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.backgroundTexture), t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, 1), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR)
        },
        setTransparentTexture: function() {
            t.bindTexture(t.TEXTURE_2D, this.backgroundTexture), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, u)
        },
        hideCssBackground: function() {
            var e = this.$el[0].style.backgroundImage;
            "none" != e && (this.originalInlineCss = e, this.originalCssBackgroundImage = this.$el.css("backgroundImage"), this.$el.css("backgroundImage", "none"))
        },
        restoreCssBackground: function() {
            this.$el.css("backgroundImage", this.originalInlineCss || "")
        },
        dropAtPointer: function(e, t, r) {
            var i = parseInt(this.$el.css("border-left-width")) || 0,
                n = parseInt(this.$el.css("border-top-width")) || 0;
            this.drop(e.pageX - this.$el.offset().left - i, e.pageY - this.$el.offset().top - n, t, r)
        },
        drop: function(e, r, i, n) {
            t = this.context;
            var a = this.$el.innerWidth(),
                s = this.$el.innerHeight(),
                u = Math.max(a, s);
            i /= u;
            var h = new Float32Array([(2 * e - a) / u, (s - 2 * r) / u]);
            t.viewport(0, 0, this.resolution, this.resolution), t.bindFramebuffer(t.FRAMEBUFFER, this.framebuffers[this.bufferWriteIndex]), o(this.textures[this.bufferReadIndex]), t.useProgram(this.dropProgram.id), t.uniform2fv(this.dropProgram.locations.center, h), t.uniform1f(this.dropProgram.locations.radius, i), t.uniform1f(this.dropProgram.locations.strength, n), this.drawQuad(), this.swapBufferIndices()
        },
        updateSize: function() {
            var e = this.$el.innerWidth(),
                t = this.$el.innerHeight();
            (e != this.canvas.width || t != this.canvas.height) && (this.canvas.width = e, this.canvas.height = t)
        },
        destroy: function() {
            this.$el.off(".ripples").removeClass("jquery-ripples").removeData("ripples"), t = null, e(window).off("resize", this.updateSize), this.$canvas.remove(), this.restoreCssBackground(), this.destroyed = !0
        },
        show: function() {
            this.visible = !0, this.$canvas.show(), this.hideCssBackground()
        },
        hide: function() {
            this.visible = !1, this.$canvas.hide(), this.restoreCssBackground()
        },
        pause: function() {
            this.running = !1
        },
        play: function() {
            this.running = !0
        },
        set: function(e, t) {
            switch (e) {
                case "dropRadius":
                case "perturbance":
                case "interactive":
                case "crossOrigin":
                    this[e] = t;
                    break;
                case "imageUrl":
                    this.imageUrl = t, this.loadImage()
            }
        }
    };
    var c = e.fn.ripples;
    e.fn.ripples = function(t) {
        if (!s) throw Error("Your browser does not support WebGL, the OES_texture_float extension or rendering to floating point textures.");
        var r = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : void 0;
        return this.each(function() {
            var i = e(this),
                n = i.data("ripples"),
                o = e.extend({}, h.DEFAULTS, i.data(), "object" == typeof t && t);
            (n || "string" != typeof t) && (n ? "string" == typeof t && h.prototype[t].apply(n, r) : i.data("ripples", n = new h(this, o)))
        })
    }, e.fn.ripples.Constructor = h, e.fn.ripples.noConflict = function() {
        return e.fn.ripples = c, this
    }
});