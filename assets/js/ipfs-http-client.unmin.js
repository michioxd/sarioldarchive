(function(root, factory) {
    (typeof module === 'object' && module.exports) ? module.exports = factory(): root.IPFSHTTPClient = factory()
}(typeof self !== 'undefined' ? self : this, function() {
    var IpfsHttpClient = (() => {
        var h = (r, e) => () => (e || r((e = {
            exports: {}
        }).exports, e), e.exports);
        var Ao = h((zI, _o) => {
            "use strict";

            function Sm(r) {
                if (r.length >= 255) throw new TypeError("Alphabet too long");
                for (var e = new Uint8Array(256), t = 0; t < e.length; t++) e[t] = 255;
                for (var n = 0; n < r.length; n++) {
                    var i = r.charAt(n),
                        s = i.charCodeAt(0);
                    if (e[s] !== 255) throw new TypeError(i + " is ambiguous");
                    e[s] = n
                }
                var a = r.length,
                    f = r.charAt(0),
                    u = Math.log(a) / Math.log(256),
                    b = Math.log(256) / Math.log(a);

                function y(d) {
                    if (d instanceof Uint8Array || (ArrayBuffer.isView(d) ? d = new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : Array.isArray(d) && (d = Uint8Array.from(d))), !(d instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
                    if (d.length === 0) return "";
                    for (var I = 0, U = 0, se = 0, F = d.length; se !== F && d[se] === 0;) se++, I++;
                    for (var H = (F - se) * b + 1 >>> 0, V = new Uint8Array(H); se !== F;) {
                        for (var $ = d[se], D = 0, M = H - 1;
                            ($ !== 0 || D < U) && M !== -1; M--, D++) $ += 256 * V[M] >>> 0, V[M] = $ % a >>> 0, $ = $ / a >>> 0;
                        if ($ !== 0) throw new Error("Non-zero carry");
                        U = D, se++
                    }
                    for (var R = H - U; R !== H && V[R] === 0;) R++;
                    for (var X = f.repeat(I); R < H; ++R) X += r.charAt(V[R]);
                    return X
                }

                function E(d) {
                    if (typeof d != "string") throw new TypeError("Expected String");
                    if (d.length === 0) return new Uint8Array;
                    var I = 0;
                    if (d[I] !== " ") {
                        for (var U = 0, se = 0; d[I] === f;) U++, I++;
                        for (var F = (d.length - I) * u + 1 >>> 0, H = new Uint8Array(F); d[I];) {
                            var V = e[d.charCodeAt(I)];
                            if (V === 255) return;
                            for (var $ = 0, D = F - 1;
                                (V !== 0 || $ < se) && D !== -1; D--, $++) V += a * H[D] >>> 0, H[D] = V % 256 >>> 0, V = V / 256 >>> 0;
                            if (V !== 0) throw new Error("Non-zero carry");
                            se = $, I++
                        }
                        if (d[I] !== " ") {
                            for (var M = F - se; M !== F && H[M] === 0;) M++;
                            for (var R = new Uint8Array(U + (F - M)), X = U; M !== F;) R[X++] = H[M++];
                            return R
                        }
                    }
                }

                function z(d) {
                    var I = E(d);
                    if (I) return I;
                    throw new Error("Non-base" + a + " character")
                }
                return {
                    encode: y,
                    decodeUnsafe: E,
                    decode: z
                }
            }
            _o.exports = Sm
        });
        var Wn = h((HI, Io) => {
            "use strict";
            var km = new TextDecoder,
                Em = r => km.decode(r),
                _m = new TextEncoder,
                Am = r => _m.encode(r);

            function Im(r, e) {
                let t = new Uint8Array(e),
                    n = 0;
                for (let i of r) t.set(i, n), n += i.length;
                return t
            }
            Io.exports = {
                decodeText: Em,
                encodeText: Am,
                concat: Im
            }
        });
        var qo = h((jI, To) => {
            "use strict";
            var {
                encodeText: Tm
            } = Wn(), No = class {
                constructor(e, t, n, i) {
                    this.name = e, this.code = t, this.codeBuf = Tm(this.code), this.alphabet = i, this.codec = n(i)
                }
                encode(e) {
                    return this.codec.encode(e)
                }
                decode(e) {
                    for (let t of e)
                        if (this.alphabet && this.alphabet.indexOf(t) < 0) throw new Error(`invalid character '${t}' in '${e}'`);
                    return this.codec.decode(e)
                }
            };
            To.exports = No
        });
        var Oo = h((GI, Bo) => {
            "use strict";
            var Nm = (r, e, t) => {
                    let n = {};
                    for (let b = 0; b < e.length; ++b) n[e[b]] = b;
                    let i = r.length;
                    for (; r[i - 1] === "=";) --i;
                    let s = new Uint8Array(i * t / 8 | 0),
                        a = 0,
                        f = 0,
                        u = 0;
                    for (let b = 0; b < i; ++b) {
                        let y = n[r[b]];
                        if (y === void 0) throw new SyntaxError("Invalid character " + r[b]);
                        f = f << t | y, a += t, a >= 8 && (a -= 8, s[u++] = 255 & f >> a)
                    }
                    if (a >= t || 255 & f << 8 - a) throw new SyntaxError("Unexpected end of data");
                    return s
                },
                qm = (r, e, t) => {
                    let n = e[e.length - 1] === "=",
                        i = (1 << t) - 1,
                        s = "",
                        a = 0,
                        f = 0;
                    for (let u = 0; u < r.length; ++u)
                        for (f = f << 8 | r[u], a += 8; a > t;) a -= t, s += e[i & f >> a];
                    if (a && (s += e[i & f << t - a]), n)
                        for (; s.length * t & 7;) s += "=";
                    return s
                },
                Bm = r => e => ({
                    encode(t) {
                        return qm(t, e, r)
                    },
                    decode(t) {
                        return Nm(t, e, r)
                    }
                });
            Bo.exports = {
                rfc4648: Bm
            }
        });
        var Uo = h(($I, Po) => {
            "use strict";
            var xn = Ao(),
                Om = qo(),
                {
                    rfc4648: He
                } = Oo(),
                {
                    decodeText: Pm,
                    encodeText: vm
                } = Wn(),
                Cm = () => ({
                    encode: Pm,
                    decode: vm
                }),
                vo = [
                    ["identity", "\0", Cm, ""],
                    ["base2", "0", He(1), "01"],
                    ["base8", "7", He(3), "01234567"],
                    ["base10", "9", xn, "0123456789"],
                    ["base16", "f", He(4), "0123456789abcdef"],
                    ["base16upper", "F", He(4), "0123456789ABCDEF"],
                    ["base32hex", "v", He(5), "0123456789abcdefghijklmnopqrstuv"],
                    ["base32hexupper", "V", He(5), "0123456789ABCDEFGHIJKLMNOPQRSTUV"],
                    ["base32hexpad", "t", He(5), "0123456789abcdefghijklmnopqrstuv="],
                    ["base32hexpadupper", "T", He(5), "0123456789ABCDEFGHIJKLMNOPQRSTUV="],
                    ["base32", "b", He(5), "abcdefghijklmnopqrstuvwxyz234567"],
                    ["base32upper", "B", He(5), "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"],
                    ["base32pad", "c", He(5), "abcdefghijklmnopqrstuvwxyz234567="],
                    ["base32padupper", "C", He(5), "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567="],
                    ["base32z", "h", He(5), "ybndrfg8ejkmcpqxot1uwisza345h769"],
                    ["base36", "k", xn, "0123456789abcdefghijklmnopqrstuvwxyz"],
                    ["base36upper", "K", xn, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"],
                    ["base58btc", "z", xn, "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"],
                    ["base58flickr", "Z", xn, "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"],
                    ["base64", "m", He(6), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"],
                    ["base64pad", "M", He(6), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="],
                    ["base64url", "u", He(6), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"],
                    ["base64urlpad", "U", He(6), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_="]
                ],
                Co = vo.reduce((r, e) => (r[e[0]] = new Om(e[0], e[1], e[2], e[3]), r), {}),
                Um = vo.reduce((r, e) => (r[e[1]] = Co[e[0]], r), {});
            Po.exports = {
                names: Co,
                codes: Um
            }
        });
        var rr = h((Ft, Fo) => {
            "use strict";
            var Ur = Uo(),
                {
                    encodeText: Fm,
                    decodeText: Yn,
                    concat: Lo
                } = Wn();

            function Rm(r, e) {
                if (!e) throw new Error("requires an encoded Uint8Array");
                let {
                    name: t,
                    codeBuf: n
                } = tr(r);
                return Lm(t, e), Lo([n, e], n.length + e.length)
            }

            function Dm(r, e) {
                let t = tr(r),
                    n = Fm(t.encode(e));
                return Lo([t.codeBuf, n], t.codeBuf.length + n.length)
            }

            function Mm(r) {
                r instanceof Uint8Array && (r = Yn(r));
                let e = r[0];
                return ["f", "F", "v", "V", "t", "T", "b", "B", "c", "C", "h", "k", "K"].includes(e) && (r = r.toLowerCase()), tr(r[0]).decode(r.substring(1))
            }

            function zm(r) {
                if (r instanceof Uint8Array && (r = Yn(r)), Object.prototype.toString.call(r) !== "[object String]") return !1;
                try {
                    return tr(r[0]).name
                } catch (e) {
                    return !1
                }
            }

            function Lm(r, e) {
                tr(r).decode(Yn(e))
            }

            function tr(r) {
                if (Object.prototype.hasOwnProperty.call(Ur.names, r)) return Ur.names[r];
                if (Object.prototype.hasOwnProperty.call(Ur.codes, r)) return Ur.codes[r];
                throw new Error(`Unsupported encoding: ${r}`)
            }

            function Hm(r) {
                return r instanceof Uint8Array && (r = Yn(r)), tr(r[0])
            }
            Ft = Fo.exports = Rm;
            Ft.encode = Dm;
            Ft.decode = Mm;
            Ft.isEncoded = zm;
            Ft.encoding = tr;
            Ft.encodingFromData = Hm;
            var jm = Object.freeze(Ur.names),
                Gm = Object.freeze(Ur.codes);
            Ft.names = jm;
            Ft.codes = Gm
        });
        var zo = h((VI, Ro) => {
            Ro.exports = Do;
            var Mo = 128,
                $m = 127,
                Vm = ~$m,
                Wm = Math.pow(2, 31);

            function Do(r, e, t) {
                e = e || [], t = t || 0;
                for (var n = t; r >= Wm;) e[t++] = r & 255 | Mo, r /= 128;
                for (; r & Vm;) e[t++] = r & 255 | Mo, r >>>= 7;
                return e[t] = r | 0, Do.bytes = t - n + 1, e
            }
        });
        var Go = h((WI, Ho) => {
            Ho.exports = es;
            var Ym = 128,
                jo = 127;

            function es(r, e) {
                var t = 0,
                    e = e || 0,
                    n = 0,
                    i = e,
                    s, a = r.length;
                do {
                    if (i >= a) throw es.bytes = 0, new RangeError("Could not decode varint");
                    s = r[i++], t += n < 28 ? (s & jo) << n : (s & jo) * Math.pow(2, n), n += 7
                } while (s >= Ym);
                return es.bytes = i - e, t
            }
        });
        var Vo = h((YI, $o) => {
            var Km = Math.pow(2, 7),
                Xm = Math.pow(2, 14),
                Jm = Math.pow(2, 21),
                Zm = Math.pow(2, 28),
                Qm = Math.pow(2, 35),
                ey = Math.pow(2, 42),
                ty = Math.pow(2, 49),
                ry = Math.pow(2, 56),
                ny = Math.pow(2, 63);
            $o.exports = function(r) {
                return r < Km ? 1 : r < Xm ? 2 : r < Jm ? 3 : r < Zm ? 4 : r < Qm ? 5 : r < ey ? 6 : r < ty ? 7 : r < ry ? 8 : r < ny ? 9 : 10
            }
        });
        var Yo = h((KI, Wo) => {
            Wo.exports = {
                encode: zo(),
                decode: Go(),
                encodingLength: Vo()
            }
        });
        var Xo = h((XI, Ko) => {
            "use strict";
            var iy = Object.freeze({
                identity: 0,
                sha1: 17,
                "sha2-256": 18,
                "sha2-512": 19,
                "sha3-512": 20,
                "sha3-384": 21,
                "sha3-256": 22,
                "sha3-224": 23,
                "shake-128": 24,
                "shake-256": 25,
                "keccak-224": 26,
                "keccak-256": 27,
                "keccak-384": 28,
                "keccak-512": 29,
                blake3: 30,
                "murmur3-128": 34,
                "murmur3-32": 35,
                "dbl-sha2-256": 86,
                md4: 212,
                md5: 213,
                bmt: 214,
                "sha2-256-trunc254-padded": 4114,
                "ripemd-128": 4178,
                "ripemd-160": 4179,
                "ripemd-256": 4180,
                "ripemd-320": 4181,
                x11: 4352,
                kangarootwelve: 7425,
                "sm3-256": 21325,
                "blake2b-8": 45569,
                "blake2b-16": 45570,
                "blake2b-24": 45571,
                "blake2b-32": 45572,
                "blake2b-40": 45573,
                "blake2b-48": 45574,
                "blake2b-56": 45575,
                "blake2b-64": 45576,
                "blake2b-72": 45577,
                "blake2b-80": 45578,
                "blake2b-88": 45579,
                "blake2b-96": 45580,
                "blake2b-104": 45581,
                "blake2b-112": 45582,
                "blake2b-120": 45583,
                "blake2b-128": 45584,
                "blake2b-136": 45585,
                "blake2b-144": 45586,
                "blake2b-152": 45587,
                "blake2b-160": 45588,
                "blake2b-168": 45589,
                "blake2b-176": 45590,
                "blake2b-184": 45591,
                "blake2b-192": 45592,
                "blake2b-200": 45593,
                "blake2b-208": 45594,
                "blake2b-216": 45595,
                "blake2b-224": 45596,
                "blake2b-232": 45597,
                "blake2b-240": 45598,
                "blake2b-248": 45599,
                "blake2b-256": 45600,
                "blake2b-264": 45601,
                "blake2b-272": 45602,
                "blake2b-280": 45603,
                "blake2b-288": 45604,
                "blake2b-296": 45605,
                "blake2b-304": 45606,
                "blake2b-312": 45607,
                "blake2b-320": 45608,
                "blake2b-328": 45609,
                "blake2b-336": 45610,
                "blake2b-344": 45611,
                "blake2b-352": 45612,
                "blake2b-360": 45613,
                "blake2b-368": 45614,
                "blake2b-376": 45615,
                "blake2b-384": 45616,
                "blake2b-392": 45617,
                "blake2b-400": 45618,
                "blake2b-408": 45619,
                "blake2b-416": 45620,
                "blake2b-424": 45621,
                "blake2b-432": 45622,
                "blake2b-440": 45623,
                "blake2b-448": 45624,
                "blake2b-456": 45625,
                "blake2b-464": 45626,
                "blake2b-472": 45627,
                "blake2b-480": 45628,
                "blake2b-488": 45629,
                "blake2b-496": 45630,
                "blake2b-504": 45631,
                "blake2b-512": 45632,
                "blake2s-8": 45633,
                "blake2s-16": 45634,
                "blake2s-24": 45635,
                "blake2s-32": 45636,
                "blake2s-40": 45637,
                "blake2s-48": 45638,
                "blake2s-56": 45639,
                "blake2s-64": 45640,
                "blake2s-72": 45641,
                "blake2s-80": 45642,
                "blake2s-88": 45643,
                "blake2s-96": 45644,
                "blake2s-104": 45645,
                "blake2s-112": 45646,
                "blake2s-120": 45647,
                "blake2s-128": 45648,
                "blake2s-136": 45649,
                "blake2s-144": 45650,
                "blake2s-152": 45651,
                "blake2s-160": 45652,
                "blake2s-168": 45653,
                "blake2s-176": 45654,
                "blake2s-184": 45655,
                "blake2s-192": 45656,
                "blake2s-200": 45657,
                "blake2s-208": 45658,
                "blake2s-216": 45659,
                "blake2s-224": 45660,
                "blake2s-232": 45661,
                "blake2s-240": 45662,
                "blake2s-248": 45663,
                "blake2s-256": 45664,
                "skein256-8": 45825,
                "skein256-16": 45826,
                "skein256-24": 45827,
                "skein256-32": 45828,
                "skein256-40": 45829,
                "skein256-48": 45830,
                "skein256-56": 45831,
                "skein256-64": 45832,
                "skein256-72": 45833,
                "skein256-80": 45834,
                "skein256-88": 45835,
                "skein256-96": 45836,
                "skein256-104": 45837,
                "skein256-112": 45838,
                "skein256-120": 45839,
                "skein256-128": 45840,
                "skein256-136": 45841,
                "skein256-144": 45842,
                "skein256-152": 45843,
                "skein256-160": 45844,
                "skein256-168": 45845,
                "skein256-176": 45846,
                "skein256-184": 45847,
                "skein256-192": 45848,
                "skein256-200": 45849,
                "skein256-208": 45850,
                "skein256-216": 45851,
                "skein256-224": 45852,
                "skein256-232": 45853,
                "skein256-240": 45854,
                "skein256-248": 45855,
                "skein256-256": 45856,
                "skein512-8": 45857,
                "skein512-16": 45858,
                "skein512-24": 45859,
                "skein512-32": 45860,
                "skein512-40": 45861,
                "skein512-48": 45862,
                "skein512-56": 45863,
                "skein512-64": 45864,
                "skein512-72": 45865,
                "skein512-80": 45866,
                "skein512-88": 45867,
                "skein512-96": 45868,
                "skein512-104": 45869,
                "skein512-112": 45870,
                "skein512-120": 45871,
                "skein512-128": 45872,
                "skein512-136": 45873,
                "skein512-144": 45874,
                "skein512-152": 45875,
                "skein512-160": 45876,
                "skein512-168": 45877,
                "skein512-176": 45878,
                "skein512-184": 45879,
                "skein512-192": 45880,
                "skein512-200": 45881,
                "skein512-208": 45882,
                "skein512-216": 45883,
                "skein512-224": 45884,
                "skein512-232": 45885,
                "skein512-240": 45886,
                "skein512-248": 45887,
                "skein512-256": 45888,
                "skein512-264": 45889,
                "skein512-272": 45890,
                "skein512-280": 45891,
                "skein512-288": 45892,
                "skein512-296": 45893,
                "skein512-304": 45894,
                "skein512-312": 45895,
                "skein512-320": 45896,
                "skein512-328": 45897,
                "skein512-336": 45898,
                "skein512-344": 45899,
                "skein512-352": 45900,
                "skein512-360": 45901,
                "skein512-368": 45902,
                "skein512-376": 45903,
                "skein512-384": 45904,
                "skein512-392": 45905,
                "skein512-400": 45906,
                "skein512-408": 45907,
                "skein512-416": 45908,
                "skein512-424": 45909,
                "skein512-432": 45910,
                "skein512-440": 45911,
                "skein512-448": 45912,
                "skein512-456": 45913,
                "skein512-464": 45914,
                "skein512-472": 45915,
                "skein512-480": 45916,
                "skein512-488": 45917,
                "skein512-496": 45918,
                "skein512-504": 45919,
                "skein512-512": 45920,
                "skein1024-8": 45921,
                "skein1024-16": 45922,
                "skein1024-24": 45923,
                "skein1024-32": 45924,
                "skein1024-40": 45925,
                "skein1024-48": 45926,
                "skein1024-56": 45927,
                "skein1024-64": 45928,
                "skein1024-72": 45929,
                "skein1024-80": 45930,
                "skein1024-88": 45931,
                "skein1024-96": 45932,
                "skein1024-104": 45933,
                "skein1024-112": 45934,
                "skein1024-120": 45935,
                "skein1024-128": 45936,
                "skein1024-136": 45937,
                "skein1024-144": 45938,
                "skein1024-152": 45939,
                "skein1024-160": 45940,
                "skein1024-168": 45941,
                "skein1024-176": 45942,
                "skein1024-184": 45943,
                "skein1024-192": 45944,
                "skein1024-200": 45945,
                "skein1024-208": 45946,
                "skein1024-216": 45947,
                "skein1024-224": 45948,
                "skein1024-232": 45949,
                "skein1024-240": 45950,
                "skein1024-248": 45951,
                "skein1024-256": 45952,
                "skein1024-264": 45953,
                "skein1024-272": 45954,
                "skein1024-280": 45955,
                "skein1024-288": 45956,
                "skein1024-296": 45957,
                "skein1024-304": 45958,
                "skein1024-312": 45959,
                "skein1024-320": 45960,
                "skein1024-328": 45961,
                "skein1024-336": 45962,
                "skein1024-344": 45963,
                "skein1024-352": 45964,
                "skein1024-360": 45965,
                "skein1024-368": 45966,
                "skein1024-376": 45967,
                "skein1024-384": 45968,
                "skein1024-392": 45969,
                "skein1024-400": 45970,
                "skein1024-408": 45971,
                "skein1024-416": 45972,
                "skein1024-424": 45973,
                "skein1024-432": 45974,
                "skein1024-440": 45975,
                "skein1024-448": 45976,
                "skein1024-456": 45977,
                "skein1024-464": 45978,
                "skein1024-472": 45979,
                "skein1024-480": 45980,
                "skein1024-488": 45981,
                "skein1024-496": 45982,
                "skein1024-504": 45983,
                "skein1024-512": 45984,
                "skein1024-520": 45985,
                "skein1024-528": 45986,
                "skein1024-536": 45987,
                "skein1024-544": 45988,
                "skein1024-552": 45989,
                "skein1024-560": 45990,
                "skein1024-568": 45991,
                "skein1024-576": 45992,
                "skein1024-584": 45993,
                "skein1024-592": 45994,
                "skein1024-600": 45995,
                "skein1024-608": 45996,
                "skein1024-616": 45997,
                "skein1024-624": 45998,
                "skein1024-632": 45999,
                "skein1024-640": 46e3,
                "skein1024-648": 46001,
                "skein1024-656": 46002,
                "skein1024-664": 46003,
                "skein1024-672": 46004,
                "skein1024-680": 46005,
                "skein1024-688": 46006,
                "skein1024-696": 46007,
                "skein1024-704": 46008,
                "skein1024-712": 46009,
                "skein1024-720": 46010,
                "skein1024-728": 46011,
                "skein1024-736": 46012,
                "skein1024-744": 46013,
                "skein1024-752": 46014,
                "skein1024-760": 46015,
                "skein1024-768": 46016,
                "skein1024-776": 46017,
                "skein1024-784": 46018,
                "skein1024-792": 46019,
                "skein1024-800": 46020,
                "skein1024-808": 46021,
                "skein1024-816": 46022,
                "skein1024-824": 46023,
                "skein1024-832": 46024,
                "skein1024-840": 46025,
                "skein1024-848": 46026,
                "skein1024-856": 46027,
                "skein1024-864": 46028,
                "skein1024-872": 46029,
                "skein1024-880": 46030,
                "skein1024-888": 46031,
                "skein1024-896": 46032,
                "skein1024-904": 46033,
                "skein1024-912": 46034,
                "skein1024-920": 46035,
                "skein1024-928": 46036,
                "skein1024-936": 46037,
                "skein1024-944": 46038,
                "skein1024-952": 46039,
                "skein1024-960": 46040,
                "skein1024-968": 46041,
                "skein1024-976": 46042,
                "skein1024-984": 46043,
                "skein1024-992": 46044,
                "skein1024-1000": 46045,
                "skein1024-1008": 46046,
                "skein1024-1016": 46047,
                "skein1024-1024": 46048,
                "poseidon-bls12_381-a2-fc1": 46081,
                "poseidon-bls12_381-a2-fc1-sc": 46082
            });
            Ko.exports = {
                names: iy
            }
        });
        var st = h((JI, Jo) => {
            "use strict";
            var {
                encoding: sy
            } = rr(), ay = new TextDecoder("utf8");

            function oy(r) {
                let e = "";
                for (let t = 0; t < r.length; t++) e += String.fromCharCode(r[t]);
                return e
            }

            function uy(r, e = "utf8") {
                return e === "utf8" || e === "utf-8" ? ay.decode(r) : e === "ascii" ? oy(r) : sy(e).encode(r)
            }
            Jo.exports = uy
        });
        var et = h((ZI, Zo) => {
            "use strict";
            var {
                encoding: cy
            } = rr(), ly = new TextEncoder;

            function fy(r) {
                let e = new Uint8Array(r.length);
                for (let t = 0; t < r.length; t++) e[t] = r.charCodeAt(t);
                return e
            }

            function hy(r, e = "utf8") {
                return e === "utf8" || e === "utf-8" ? ly.encode(r) : e === "ascii" ? fy(r) : cy(e).decode(r)
            }
            Zo.exports = hy
        });
        var nr = h((QI, Qo) => {
            "use strict";

            function dy(r, e) {
                e || (e = r.reduce((i, s) => i + s.length, 0));
                let t = new Uint8Array(e),
                    n = 0;
                for (let i of r) t.set(i, n), n += i.length;
                return t
            }
            Qo.exports = dy
        });
        var Gt = h((eT, eu) => {
            "use strict";
            var tu = rr(),
                Fr = Yo(),
                {
                    names: wn
                } = Xo(),
                Kn = st(),
                py = et(),
                by = nr(),
                Lr = {};
            for (let r in wn) {
                let e = r;
                Lr[wn[e]] = e
            }
            Object.freeze(Lr);

            function gy(r) {
                if (!(r instanceof Uint8Array)) throw new Error("must be passed a Uint8Array");
                return Kn(r, "base16")
            }

            function my(r) {
                return py(r, "base16")
            }

            function yy(r) {
                if (!(r instanceof Uint8Array)) throw new Error("must be passed a Uint8Array");
                return Kn(tu.encode("base58btc", r)).slice(1)
            }

            function xy(r) {
                let e = r instanceof Uint8Array ? Kn(r) : r;
                return tu.decode("z" + e)
            }

            function nu(r) {
                if (!(r instanceof Uint8Array)) throw new Error("multihash must be a Uint8Array");
                if (r.length < 2) throw new Error("multihash too short. must be > 2 bytes.");
                let e = Fr.decode(r);
                if (!ru(e)) throw new Error(`multihash unknown function code: 0x${e.toString(16)}`);
                r = r.slice(Fr.decode.bytes);
                let t = Fr.decode(r);
                if (t < 0) throw new Error(`multihash invalid length: ${t}`);
                if (r = r.slice(Fr.decode.bytes), r.length !== t) throw new Error(`multihash length inconsistent: 0x${Kn(r,"base16")}`);
                return {
                    code: e,
                    name: Lr[e],
                    length: t,
                    digest: r
                }
            }

            function wy(r, e, t) {
                if (!r || e === void 0) throw new Error("multihash encode requires at least two args: digest, code");
                let n = iu(e);
                if (!(r instanceof Uint8Array)) throw new Error("digest should be a Uint8Array");
                if (t == null && (t = r.length), t && r.length !== t) throw new Error("digest length should be equal to specified length.");
                let i = Fr.encode(n),
                    s = Fr.encode(t);
                return by([i, s, r], i.length + s.length + r.length)
            }

            function iu(r) {
                let e = r;
                if (typeof r == "string") {
                    if (wn[r] === void 0) throw new Error(`Unrecognized hash function named: ${r}`);
                    e = wn[r]
                }
                if (typeof e != "number") throw new Error(`Hash function code should be a number. Got: ${e}`);
                if (Lr[e] === void 0 && !ts(e)) throw new Error(`Unrecognized function code: ${e}`);
                return e
            }

            function ts(r) {
                return r > 0 && r < 16
            }

            function ru(r) {
                return !!(ts(r) || Lr[r])
            }

            function su(r) {
                nu(r)
            }

            function Sy(r) {
                return su(r), r.subarray(0, 2)
            }
            eu.exports = {
                names: wn,
                codes: Lr,
                toHexString: gy,
                fromHexString: my,
                toB58String: yy,
                fromB58String: xy,
                decode: nu,
                encode: wy,
                coerceCode: iu,
                isAppCode: ts,
                validate: su,
                prefix: Sy,
                isValidCode: ru
            }
        });
        var cu = h((tT, au) => {
            au.exports = ou;
            var uu = 128,
                ky = 127,
                Ey = ~ky,
                _y = Math.pow(2, 31);

            function ou(r, e, t) {
                e = e || [], t = t || 0;
                for (var n = t; r >= _y;) e[t++] = r & 255 | uu, r /= 128;
                for (; r & Ey;) e[t++] = r & 255 | uu, r >>>= 7;
                return e[t] = r | 0, ou.bytes = t - n + 1, e
            }
        });
        var hu = h((rT, lu) => {
            lu.exports = rs;
            var Ay = 128,
                fu = 127;

            function rs(r, e) {
                var t = 0,
                    e = e || 0,
                    n = 0,
                    i = e,
                    s, a = r.length;
                do {
                    if (i >= a) throw rs.bytes = 0, new RangeError("Could not decode varint");
                    s = r[i++], t += n < 28 ? (s & fu) << n : (s & fu) * Math.pow(2, n), n += 7
                } while (s >= Ay);
                return rs.bytes = i - e, t
            }
        });
        var pu = h((nT, du) => {
            var Iy = Math.pow(2, 7),
                Ty = Math.pow(2, 14),
                Ny = Math.pow(2, 21),
                qy = Math.pow(2, 28),
                By = Math.pow(2, 35),
                Oy = Math.pow(2, 42),
                Py = Math.pow(2, 49),
                vy = Math.pow(2, 56),
                Cy = Math.pow(2, 63);
            du.exports = function(r) {
                return r < Iy ? 1 : r < Ty ? 2 : r < Ny ? 3 : r < qy ? 4 : r < By ? 5 : r < Oy ? 6 : r < Py ? 7 : r < vy ? 8 : r < Cy ? 9 : 10
            }
        });
        var ns = h((iT, bu) => {
            bu.exports = {
                encode: cu(),
                decode: hu(),
                encodingLength: pu()
            }
        });
        var is = h((sT, gu) => {
            "use strict";
            var mu = ns(),
                Uy = st(),
                Fy = et();
            gu.exports = {
                numberToUint8Array: Ly,
                uint8ArrayToNumber: yu,
                varintUint8ArrayEncode: Ry,
                varintEncode: Dy
            };

            function yu(r) {
                return parseInt(Uy(r, "base16"), 16)
            }

            function Ly(r) {
                let e = r.toString(16);
                return e.length % 2 == 1 && (e = "0" + e), Fy(e, "base16")
            }

            function Ry(r) {
                return Uint8Array.from(mu.encode(yu(r)))
            }

            function Dy(r) {
                return Uint8Array.from(mu.encode(r))
            }
        });
        var wu = h((aT, xu) => {
            "use strict";
            var My = Object.freeze({
                identity: 0,
                cidv1: 1,
                cidv2: 2,
                cidv3: 3,
                ip4: 4,
                tcp: 6,
                sha1: 17,
                "sha2-256": 18,
                "sha2-512": 19,
                "sha3-512": 20,
                "sha3-384": 21,
                "sha3-256": 22,
                "sha3-224": 23,
                "shake-128": 24,
                "shake-256": 25,
                "keccak-224": 26,
                "keccak-256": 27,
                "keccak-384": 28,
                "keccak-512": 29,
                blake3: 30,
                dccp: 33,
                "murmur3-128": 34,
                "murmur3-32": 35,
                ip6: 41,
                ip6zone: 42,
                path: 47,
                multicodec: 48,
                multihash: 49,
                multiaddr: 50,
                multibase: 51,
                dns: 53,
                dns4: 54,
                dns6: 55,
                dnsaddr: 56,
                protobuf: 80,
                cbor: 81,
                raw: 85,
                "dbl-sha2-256": 86,
                rlp: 96,
                bencode: 99,
                "dag-pb": 112,
                "dag-cbor": 113,
                "libp2p-key": 114,
                "git-raw": 120,
                "torrent-info": 123,
                "torrent-file": 124,
                "leofcoin-block": 129,
                "leofcoin-tx": 130,
                "leofcoin-pr": 131,
                sctp: 132,
                "dag-jose": 133,
                "dag-cose": 134,
                "eth-block": 144,
                "eth-block-list": 145,
                "eth-tx-trie": 146,
                "eth-tx": 147,
                "eth-tx-receipt-trie": 148,
                "eth-tx-receipt": 149,
                "eth-state-trie": 150,
                "eth-account-snapshot": 151,
                "eth-storage-trie": 152,
                "bitcoin-block": 176,
                "bitcoin-tx": 177,
                "bitcoin-witness-commitment": 178,
                "zcash-block": 192,
                "zcash-tx": 193,
                docid: 206,
                "stellar-block": 208,
                "stellar-tx": 209,
                md4: 212,
                md5: 213,
                bmt: 214,
                "decred-block": 224,
                "decred-tx": 225,
                "ipld-ns": 226,
                "ipfs-ns": 227,
                "swarm-ns": 228,
                "ipns-ns": 229,
                zeronet: 230,
                "secp256k1-pub": 231,
                "bls12_381-g1-pub": 234,
                "bls12_381-g2-pub": 235,
                "x25519-pub": 236,
                "ed25519-pub": 237,
                "bls12_381-g1g2-pub": 238,
                "dash-block": 240,
                "dash-tx": 241,
                "swarm-manifest": 250,
                "swarm-feed": 251,
                udp: 273,
                "p2p-webrtc-star": 275,
                "p2p-webrtc-direct": 276,
                "p2p-stardust": 277,
                "p2p-circuit": 290,
                "dag-json": 297,
                udt: 301,
                utp: 302,
                unix: 400,
                thread: 406,
                p2p: 421,
                ipfs: 421,
                https: 443,
                onion: 444,
                onion3: 445,
                garlic64: 446,
                garlic32: 447,
                tls: 448,
                quic: 460,
                ws: 477,
                wss: 478,
                "p2p-websocket-star": 479,
                http: 480,
                json: 512,
                messagepack: 513,
                "libp2p-peer-record": 769,
                "sha2-256-trunc254-padded": 4114,
                "ripemd-128": 4178,
                "ripemd-160": 4179,
                "ripemd-256": 4180,
                "ripemd-320": 4181,
                x11: 4352,
                "p256-pub": 4608,
                "p384-pub": 4609,
                "p521-pub": 4610,
                "ed448-pub": 4611,
                "x448-pub": 4612,
                "ed25519-priv": 4864,
                kangarootwelve: 7425,
                "sm3-256": 21325,
                "blake2b-8": 45569,
                "blake2b-16": 45570,
                "blake2b-24": 45571,
                "blake2b-32": 45572,
                "blake2b-40": 45573,
                "blake2b-48": 45574,
                "blake2b-56": 45575,
                "blake2b-64": 45576,
                "blake2b-72": 45577,
                "blake2b-80": 45578,
                "blake2b-88": 45579,
                "blake2b-96": 45580,
                "blake2b-104": 45581,
                "blake2b-112": 45582,
                "blake2b-120": 45583,
                "blake2b-128": 45584,
                "blake2b-136": 45585,
                "blake2b-144": 45586,
                "blake2b-152": 45587,
                "blake2b-160": 45588,
                "blake2b-168": 45589,
                "blake2b-176": 45590,
                "blake2b-184": 45591,
                "blake2b-192": 45592,
                "blake2b-200": 45593,
                "blake2b-208": 45594,
                "blake2b-216": 45595,
                "blake2b-224": 45596,
                "blake2b-232": 45597,
                "blake2b-240": 45598,
                "blake2b-248": 45599,
                "blake2b-256": 45600,
                "blake2b-264": 45601,
                "blake2b-272": 45602,
                "blake2b-280": 45603,
                "blake2b-288": 45604,
                "blake2b-296": 45605,
                "blake2b-304": 45606,
                "blake2b-312": 45607,
                "blake2b-320": 45608,
                "blake2b-328": 45609,
                "blake2b-336": 45610,
                "blake2b-344": 45611,
                "blake2b-352": 45612,
                "blake2b-360": 45613,
                "blake2b-368": 45614,
                "blake2b-376": 45615,
                "blake2b-384": 45616,
                "blake2b-392": 45617,
                "blake2b-400": 45618,
                "blake2b-408": 45619,
                "blake2b-416": 45620,
                "blake2b-424": 45621,
                "blake2b-432": 45622,
                "blake2b-440": 45623,
                "blake2b-448": 45624,
                "blake2b-456": 45625,
                "blake2b-464": 45626,
                "blake2b-472": 45627,
                "blake2b-480": 45628,
                "blake2b-488": 45629,
                "blake2b-496": 45630,
                "blake2b-504": 45631,
                "blake2b-512": 45632,
                "blake2s-8": 45633,
                "blake2s-16": 45634,
                "blake2s-24": 45635,
                "blake2s-32": 45636,
                "blake2s-40": 45637,
                "blake2s-48": 45638,
                "blake2s-56": 45639,
                "blake2s-64": 45640,
                "blake2s-72": 45641,
                "blake2s-80": 45642,
                "blake2s-88": 45643,
                "blake2s-96": 45644,
                "blake2s-104": 45645,
                "blake2s-112": 45646,
                "blake2s-120": 45647,
                "blake2s-128": 45648,
                "blake2s-136": 45649,
                "blake2s-144": 45650,
                "blake2s-152": 45651,
                "blake2s-160": 45652,
                "blake2s-168": 45653,
                "blake2s-176": 45654,
                "blake2s-184": 45655,
                "blake2s-192": 45656,
                "blake2s-200": 45657,
                "blake2s-208": 45658,
                "blake2s-216": 45659,
                "blake2s-224": 45660,
                "blake2s-232": 45661,
                "blake2s-240": 45662,
                "blake2s-248": 45663,
                "blake2s-256": 45664,
                "skein256-8": 45825,
                "skein256-16": 45826,
                "skein256-24": 45827,
                "skein256-32": 45828,
                "skein256-40": 45829,
                "skein256-48": 45830,
                "skein256-56": 45831,
                "skein256-64": 45832,
                "skein256-72": 45833,
                "skein256-80": 45834,
                "skein256-88": 45835,
                "skein256-96": 45836,
                "skein256-104": 45837,
                "skein256-112": 45838,
                "skein256-120": 45839,
                "skein256-128": 45840,
                "skein256-136": 45841,
                "skein256-144": 45842,
                "skein256-152": 45843,
                "skein256-160": 45844,
                "skein256-168": 45845,
                "skein256-176": 45846,
                "skein256-184": 45847,
                "skein256-192": 45848,
                "skein256-200": 45849,
                "skein256-208": 45850,
                "skein256-216": 45851,
                "skein256-224": 45852,
                "skein256-232": 45853,
                "skein256-240": 45854,
                "skein256-248": 45855,
                "skein256-256": 45856,
                "skein512-8": 45857,
                "skein512-16": 45858,
                "skein512-24": 45859,
                "skein512-32": 45860,
                "skein512-40": 45861,
                "skein512-48": 45862,
                "skein512-56": 45863,
                "skein512-64": 45864,
                "skein512-72": 45865,
                "skein512-80": 45866,
                "skein512-88": 45867,
                "skein512-96": 45868,
                "skein512-104": 45869,
                "skein512-112": 45870,
                "skein512-120": 45871,
                "skein512-128": 45872,
                "skein512-136": 45873,
                "skein512-144": 45874,
                "skein512-152": 45875,
                "skein512-160": 45876,
                "skein512-168": 45877,
                "skein512-176": 45878,
                "skein512-184": 45879,
                "skein512-192": 45880,
                "skein512-200": 45881,
                "skein512-208": 45882,
                "skein512-216": 45883,
                "skein512-224": 45884,
                "skein512-232": 45885,
                "skein512-240": 45886,
                "skein512-248": 45887,
                "skein512-256": 45888,
                "skein512-264": 45889,
                "skein512-272": 45890,
                "skein512-280": 45891,
                "skein512-288": 45892,
                "skein512-296": 45893,
                "skein512-304": 45894,
                "skein512-312": 45895,
                "skein512-320": 45896,
                "skein512-328": 45897,
                "skein512-336": 45898,
                "skein512-344": 45899,
                "skein512-352": 45900,
                "skein512-360": 45901,
                "skein512-368": 45902,
                "skein512-376": 45903,
                "skein512-384": 45904,
                "skein512-392": 45905,
                "skein512-400": 45906,
                "skein512-408": 45907,
                "skein512-416": 45908,
                "skein512-424": 45909,
                "skein512-432": 45910,
                "skein512-440": 45911,
                "skein512-448": 45912,
                "skein512-456": 45913,
                "skein512-464": 45914,
                "skein512-472": 45915,
                "skein512-480": 45916,
                "skein512-488": 45917,
                "skein512-496": 45918,
                "skein512-504": 45919,
                "skein512-512": 45920,
                "skein1024-8": 45921,
                "skein1024-16": 45922,
                "skein1024-24": 45923,
                "skein1024-32": 45924,
                "skein1024-40": 45925,
                "skein1024-48": 45926,
                "skein1024-56": 45927,
                "skein1024-64": 45928,
                "skein1024-72": 45929,
                "skein1024-80": 45930,
                "skein1024-88": 45931,
                "skein1024-96": 45932,
                "skein1024-104": 45933,
                "skein1024-112": 45934,
                "skein1024-120": 45935,
                "skein1024-128": 45936,
                "skein1024-136": 45937,
                "skein1024-144": 45938,
                "skein1024-152": 45939,
                "skein1024-160": 45940,
                "skein1024-168": 45941,
                "skein1024-176": 45942,
                "skein1024-184": 45943,
                "skein1024-192": 45944,
                "skein1024-200": 45945,
                "skein1024-208": 45946,
                "skein1024-216": 45947,
                "skein1024-224": 45948,
                "skein1024-232": 45949,
                "skein1024-240": 45950,
                "skein1024-248": 45951,
                "skein1024-256": 45952,
                "skein1024-264": 45953,
                "skein1024-272": 45954,
                "skein1024-280": 45955,
                "skein1024-288": 45956,
                "skein1024-296": 45957,
                "skein1024-304": 45958,
                "skein1024-312": 45959,
                "skein1024-320": 45960,
                "skein1024-328": 45961,
                "skein1024-336": 45962,
                "skein1024-344": 45963,
                "skein1024-352": 45964,
                "skein1024-360": 45965,
                "skein1024-368": 45966,
                "skein1024-376": 45967,
                "skein1024-384": 45968,
                "skein1024-392": 45969,
                "skein1024-400": 45970,
                "skein1024-408": 45971,
                "skein1024-416": 45972,
                "skein1024-424": 45973,
                "skein1024-432": 45974,
                "skein1024-440": 45975,
                "skein1024-448": 45976,
                "skein1024-456": 45977,
                "skein1024-464": 45978,
                "skein1024-472": 45979,
                "skein1024-480": 45980,
                "skein1024-488": 45981,
                "skein1024-496": 45982,
                "skein1024-504": 45983,
                "skein1024-512": 45984,
                "skein1024-520": 45985,
                "skein1024-528": 45986,
                "skein1024-536": 45987,
                "skein1024-544": 45988,
                "skein1024-552": 45989,
                "skein1024-560": 45990,
                "skein1024-568": 45991,
                "skein1024-576": 45992,
                "skein1024-584": 45993,
                "skein1024-592": 45994,
                "skein1024-600": 45995,
                "skein1024-608": 45996,
                "skein1024-616": 45997,
                "skein1024-624": 45998,
                "skein1024-632": 45999,
                "skein1024-640": 46e3,
                "skein1024-648": 46001,
                "skein1024-656": 46002,
                "skein1024-664": 46003,
                "skein1024-672": 46004,
                "skein1024-680": 46005,
                "skein1024-688": 46006,
                "skein1024-696": 46007,
                "skein1024-704": 46008,
                "skein1024-712": 46009,
                "skein1024-720": 46010,
                "skein1024-728": 46011,
                "skein1024-736": 46012,
                "skein1024-744": 46013,
                "skein1024-752": 46014,
                "skein1024-760": 46015,
                "skein1024-768": 46016,
                "skein1024-776": 46017,
                "skein1024-784": 46018,
                "skein1024-792": 46019,
                "skein1024-800": 46020,
                "skein1024-808": 46021,
                "skein1024-816": 46022,
                "skein1024-824": 46023,
                "skein1024-832": 46024,
                "skein1024-840": 46025,
                "skein1024-848": 46026,
                "skein1024-856": 46027,
                "skein1024-864": 46028,
                "skein1024-872": 46029,
                "skein1024-880": 46030,
                "skein1024-888": 46031,
                "skein1024-896": 46032,
                "skein1024-904": 46033,
                "skein1024-912": 46034,
                "skein1024-920": 46035,
                "skein1024-928": 46036,
                "skein1024-936": 46037,
                "skein1024-944": 46038,
                "skein1024-952": 46039,
                "skein1024-960": 46040,
                "skein1024-968": 46041,
                "skein1024-976": 46042,
                "skein1024-984": 46043,
                "skein1024-992": 46044,
                "skein1024-1000": 46045,
                "skein1024-1008": 46046,
                "skein1024-1016": 46047,
                "skein1024-1024": 46048,
                "poseidon-bls12_381-a2-fc1": 46081,
                "poseidon-bls12_381-a2-fc1-sc": 46082,
                "zeroxcert-imprint-256": 52753,
                "fil-commitment-unsealed": 61697,
                "fil-commitment-sealed": 61698,
                "holochain-adr-v0": 8417572,
                "holochain-adr-v1": 8483108,
                "holochain-key-v0": 9728292,
                "holochain-key-v1": 9793828,
                "holochain-sig-v0": 10645796,
                "holochain-sig-v1": 10711332,
                "skynet-ns": 11639056
            });
            xu.exports = {
                baseTable: My
            }
        });
        var ku = h((oT, Su) => {
            "use strict";
            var {
                baseTable: ss
            } = wu(), zy = is().varintEncode, as = {}, os = {}, Xn = {};
            for (let r in ss) {
                let e = r,
                    t = ss[e];
                as[e] = zy(t);
                let n = e.toUpperCase().replace(/-/g, "_");
                os[n] = t, Xn[t] || (Xn[t] = e)
            }
            Object.freeze(as);
            Object.freeze(os);
            Object.freeze(Xn);
            var Hy = Object.freeze(ss);
            Su.exports = {
                nameToVarint: as,
                constantToCode: os,
                nameToCode: Hy,
                codeToName: Xn
            }
        });
        var Lt = h((uT, Eu) => {
            "use strict";
            var Jn = ns(),
                jy = nr(),
                _u = is(),
                {
                    nameToVarint: Zn,
                    constantToCode: Gy,
                    nameToCode: Au,
                    codeToName: us
                } = ku();

            function $y(r, e) {
                let t;
                if (r instanceof Uint8Array) t = _u.varintUint8ArrayEncode(r);
                else if (Zn[r]) t = Zn[r];
                else throw new Error("multicodec not recognized");
                return jy([t, e], t.length + e.length)
            }

            function Vy(r) {
                return Jn.decode(r), r.slice(Jn.decode.bytes)
            }

            function Iu(r) {
                let e = Jn.decode(r),
                    t = us[e];
                if (t === void 0) throw new Error(`Code "${e}" not found`);
                return t
            }

            function Tu(r) {
                return us[r]
            }

            function Nu(r) {
                let e = Au[r];
                if (e === void 0) throw new Error(`Codec "${r}" not found`);
                return e
            }

            function qu(r) {
                return Jn.decode(r)
            }

            function Bu(r) {
                let e = Zn[r];
                if (e === void 0) throw new Error(`Codec "${r}" not found`);
                return e
            }

            function Ou(r) {
                return _u.varintEncode(r)
            }

            function Wy(r) {
                return Iu(r)
            }

            function Yy(r) {
                return Tu(r)
            }

            function Ky(r) {
                return Nu(r)
            }

            function Xy(r) {
                return qu(r)
            }

            function Jy(r) {
                return Bu(r)
            }

            function Zy(r) {
                return Array.from(Ou(r))
            }
            Eu.exports = {
                addPrefix: $y,
                rmPrefix: Vy,
                getNameFromData: Iu,
                getNameFromCode: Tu,
                getCodeFromName: Nu,
                getCodeFromData: qu,
                getVarintFromName: Bu,
                getVarintFromCode: Ou,
                getCodec: Wy,
                getName: Yy,
                getNumber: Ky,
                getCode: Xy,
                getCodeVarint: Jy,
                getVarint: Zy,
                ...Gy,
                nameToVarint: Zn,
                nameToCode: Au,
                codeToName: us
            }
        });
        var vu = h((cT, Pu) => {
            "use strict";
            var Qy = Gt(),
                e3 = {
                    checkCIDComponents: function(r) {
                        if (r == null) return "null values are not valid CIDs";
                        if (!(r.version === 0 || r.version === 1)) return "Invalid version, must be a number equal to 1 or 0";
                        if (typeof r.codec != "string") return "codec must be string";
                        if (r.version === 0) {
                            if (r.codec !== "dag-pb") return "codec must be 'dag-pb' for CIDv0";
                            if (r.multibaseName !== "base58btc") return "multibaseName must be 'base58btc' for CIDv0"
                        }
                        if (!(r.multihash instanceof Uint8Array)) return "multihash must be a Uint8Array";
                        try {
                            Qy.validate(r.multihash)
                        } catch (e) {
                            let t = e.message;
                            return t || (t = "Multihash validation failed"), t
                        }
                    }
                };
            Pu.exports = e3
        });
        var Sn = h((lT, Cu) => {
            "use strict";

            function t3(r, e) {
                if (r === e) return !0;
                if (r.byteLength !== e.byteLength) return !1;
                for (let t = 0; t < r.byteLength; t++)
                    if (r[t] !== e[t]) return !1;
                return !0
            }
            Cu.exports = t3
        });
        var J = h((fT, Uu) => {
            "use strict";
            var Qn = Gt(),
                cs = rr(),
                ir = Lt(),
                r3 = vu(),
                Fu = nr(),
                n3 = st(),
                i3 = Sn(),
                ei = ir.nameToCode,
                s3 = Object.keys(ei).reduce((r, e) => (r[ei[e]] = e, r), {}),
                Lu = Symbol.for("@ipld/js-cid/CID"),
                bt = class {
                    constructor(e, t, n, i) {
                        if (this.version, this.codec, this.multihash, Object.defineProperty(this, Lu, {
                                value: !0
                            }), bt.isCID(e)) {
                            let s = e;
                            this.version = s.version, this.codec = s.codec, this.multihash = s.multihash, this.multibaseName = s.multibaseName || (s.version === 0 ? "base58btc" : "base32");
                            return
                        }
                        if (typeof e == "string") {
                            let s = cs.isEncoded(e);
                            if (s) {
                                let a = cs.decode(e);
                                this.version = parseInt(a[0].toString(), 16), this.codec = ir.getCodec(a.slice(1)), this.multihash = ir.rmPrefix(a.slice(1)), this.multibaseName = s
                            } else this.version = 0, this.codec = "dag-pb", this.multihash = Qn.fromB58String(e), this.multibaseName = "base58btc";
                            bt.validateCID(this), Object.defineProperty(this, "string", {
                                value: e
                            });
                            return
                        }
                        if (e instanceof Uint8Array) {
                            let s = parseInt(e[0].toString(), 16);
                            if (s === 1) {
                                let a = e;
                                this.version = s, this.codec = ir.getCodec(a.slice(1)), this.multihash = ir.rmPrefix(a.slice(1)), this.multibaseName = "base32"
                            } else this.version = 0, this.codec = "dag-pb", this.multihash = e, this.multibaseName = "base58btc";
                            bt.validateCID(this);
                            return
                        }
                        this.version = e, typeof t == "number" && (t = s3[t]), this.codec = t, this.multihash = n, this.multibaseName = i || (e === 0 ? "base58btc" : "base32"), bt.validateCID(this)
                    }
                    get bytes() {
                        let e = this._bytes;
                        if (!e) {
                            if (this.version === 0) e = this.multihash;
                            else if (this.version === 1) {
                                let t = ir.getCodeVarint(this.codec);
                                e = Fu([
                                    [1], t, this.multihash
                                ], 1 + t.byteLength + this.multihash.byteLength)
                            } else throw new Error("unsupported version");
                            Object.defineProperty(this, "_bytes", {
                                value: e
                            })
                        }
                        return e
                    }
                    get prefix() {
                        let e = ir.getCodeVarint(this.codec),
                            t = Qn.prefix(this.multihash);
                        return Fu([
                            [this.version], e, t
                        ], 1 + e.byteLength + t.byteLength)
                    }
                    get code() {
                        return ei[this.codec]
                    }
                    toV0() {
                        if (this.codec !== "dag-pb") throw new Error("Cannot convert a non dag-pb CID to CIDv0");
                        let {
                            name: e,
                            length: t
                        } = Qn.decode(this.multihash);
                        if (e !== "sha2-256") throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
                        if (t !== 32) throw new Error("Cannot convert non 32 byte multihash CID to CIDv0");
                        return new bt(0, this.codec, this.multihash)
                    }
                    toV1() {
                        return new bt(1, this.codec, this.multihash)
                    }
                    toBaseEncodedString(e = this.multibaseName) {
                        if (this.string && this.string.length !== 0 && e === this.multibaseName) return this.string;
                        let t;
                        if (this.version === 0) {
                            if (e !== "base58btc") throw new Error("not supported with CIDv0, to support different bases, please migrate the instance do CIDv1, you can do that through cid.toV1()");
                            t = Qn.toB58String(this.multihash)
                        } else if (this.version === 1) t = n3(cs.encode(e, this.bytes));
                        else throw new Error("unsupported version");
                        return e === this.multibaseName && Object.defineProperty(this, "string", {
                            value: t
                        }), t
                    } [Symbol.for("nodejs.util.inspect.custom")]() {
                        return "CID(" + this.toString() + ")"
                    }
                    toString(e) {
                        return this.toBaseEncodedString(e)
                    }
                    toJSON() {
                        return {
                            codec: this.codec,
                            version: this.version,
                            hash: this.multihash
                        }
                    }
                    equals(e) {
                        return this.codec === e.codec && this.version === e.version && i3(this.multihash, e.multihash)
                    }
                    static validateCID(e) {
                        let t = r3.checkCIDComponents(e);
                        if (t) throw new Error(t)
                    }
                    static isCID(e) {
                        return e instanceof bt || Boolean(e && e[Lu])
                    }
                };
            bt.codecs = ei;
            Uu.exports = bt
        });
        var Mu = h((hT, Ru) => {
            "use strict";
            var Du = "[a-fA-F\\d:]",
                $t = r => r && r.includeBoundaries ? `(?:(?<=\\s|^)(?=${Du})|(?<=${Du})(?=\\s|$))` : "",
                gt = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}",
                Oe = "[a-fA-F\\d]{1,4}",
                ti = `
(?:
(?:${Oe}:){7}(?:${Oe}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${Oe}:){6}(?:${gt}|:${Oe}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${Oe}:){5}(?::${gt}|(?::${Oe}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${Oe}:){4}(?:(?::${Oe}){0,1}:${gt}|(?::${Oe}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${Oe}:){3}(?:(?::${Oe}){0,2}:${gt}|(?::${Oe}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${Oe}:){2}(?:(?::${Oe}){0,3}:${gt}|(?::${Oe}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${Oe}:){1}(?:(?::${Oe}){0,4}:${gt}|(?::${Oe}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${Oe}){0,5}:${gt}|(?::${Oe}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim(),
                a3 = new RegExp(`(?:^${gt}$)|(?:^${ti}$)`),
                o3 = new RegExp(`^${gt}$`),
                u3 = new RegExp(`^${ti}$`),
                ls = r => r && r.exact ? a3 : new RegExp(`(?:${$t(r)}${gt}${$t(r)})|(?:${$t(r)}${ti}${$t(r)})`, "g");
            ls.v4 = r => r && r.exact ? o3 : new RegExp(`${$t(r)}${gt}${$t(r)}`, "g");
            ls.v6 = r => r && r.exact ? u3 : new RegExp(`${$t(r)}${ti}${$t(r)}`, "g");
            Ru.exports = ls
        });
        var Hu = h((dT, zu) => {
            "use strict";
            var fs = Mu(),
                Rr = r => fs({
                    exact: !0
                }).test(r);
            Rr.v4 = r => fs.v4({
                exact: !0
            }).test(r);
            Rr.v6 = r => fs.v6({
                exact: !0
            }).test(r);
            Rr.version = r => Rr(r) ? Rr.v4(r) ? 4 : 6 : void 0;
            zu.exports = Rr
        });
        var Wu = h((pT, ju) => {
            "use strict";
            var hs = Hu(),
                Gu = st(),
                c3 = hs,
                ds = hs.v4,
                $u = hs.v6,
                Vu = function(r, e, t) {
                    t = ~~t;
                    let n;
                    if (ds(r)) n = e || new Uint8Array(t + 4), r.split(/\./g).map(function(s) {
                        n[t++] = parseInt(s, 10) & 255
                    });
                    else if ($u(r)) {
                        let s = r.split(":", 8),
                            a;
                        for (a = 0; a < s.length; a++) {
                            let f = ds(s[a]);
                            var i;
                            f && (i = Vu(s[a]), s[a] = Gu(i.slice(0, 2), "base16")), i && ++a < 8 && s.splice(a, 0, Gu(i.slice(2, 4), "base16"))
                        }
                        if (s[0] === "")
                            for (; s.length < 8;) s.unshift("0");
                        else if (s[s.length - 1] === "")
                            for (; s.length < 8;) s.push("0");
                        else if (s.length < 8) {
                            for (a = 0; a < s.length && s[a] !== ""; a++);
                            let f = [a, "1"];
                            for (a = 9 - s.length; a > 0; a--) f.push("0");
                            s.splice.apply(s, f)
                        }
                        for (n = e || new Uint8Array(t + 16), a = 0; a < s.length; a++) {
                            let f = parseInt(s[a], 16);
                            n[t++] = f >> 8 & 255, n[t++] = f & 255
                        }
                    }
                    if (!n) throw Error("Invalid ip address: " + r);
                    return n
                },
                l3 = function(r, e, t) {
                    e = ~~e, t = t || r.length - e;
                    let n = [],
                        i, s = new DataView(r.buffer);
                    if (t === 4) {
                        for (let a = 0; a < t; a++) n.push(r[e + a]);
                        i = n.join(".")
                    } else if (t === 16) {
                        for (let a = 0; a < t; a += 2) n.push(s.getUint16(e + a).toString(16));
                        i = n.join(":"), i = i.replace(/(^|:)0(:0)*:0(:|$)/, "$1::$3"), i = i.replace(/:{3,4}/, "::")
                    }
                    return i
                };
            ju.exports = {
                isIP: c3,
                isV4: ds,
                isV6: $u,
                toBytes: Vu,
                toString: l3
            }
        });
        var ri = h((bT, Yu) => {
            "use strict";

            function Xe(r) {
                if (typeof r == "number") {
                    if (Xe.codes[r]) return Xe.codes[r];
                    throw new Error("no protocol with code: " + r)
                } else if (typeof r == "string") {
                    if (Xe.names[r]) return Xe.names[r];
                    throw new Error("no protocol with name: " + r)
                }
                throw new Error("invalid protocol id type: " + r)
            }
            var at = -1;
            Xe.lengthPrefixedVarSize = at;
            Xe.V = at;
            Xe.table = [
                [4, 32, "ip4"],
                [6, 16, "tcp"],
                [33, 16, "dccp"],
                [41, 128, "ip6"],
                [42, at, "ip6zone"],
                [53, at, "dns", "resolvable"],
                [54, at, "dns4", "resolvable"],
                [55, at, "dns6", "resolvable"],
                [56, at, "dnsaddr", "resolvable"],
                [132, 16, "sctp"],
                [273, 16, "udp"],
                [275, 0, "p2p-webrtc-star"],
                [276, 0, "p2p-webrtc-direct"],
                [277, 0, "p2p-stardust"],
                [290, 0, "p2p-circuit"],
                [301, 0, "udt"],
                [302, 0, "utp"],
                [400, at, "unix", !1, "path"],
                [421, at, "ipfs"],
                [421, at, "p2p"],
                [443, 0, "https"],
                [444, 96, "onion"],
                [445, 296, "onion3"],
                [446, at, "garlic64"],
                [460, 0, "quic"],
                [477, 0, "ws"],
                [478, 0, "wss"],
                [479, 0, "p2p-websocket-star"],
                [480, 0, "http"],
                [777, at, "memory"]
            ];
            Xe.names = {};
            Xe.codes = {};
            Xe.table.map(r => {
                let e = Ku.apply(null, r);
                return Xe.codes[e.code] = e, Xe.names[e.name] = e, null
            });
            Xe.object = Ku;

            function Ku(r, e, t, n, i) {
                return {
                    code: r,
                    size: e,
                    name: t,
                    resolvable: Boolean(n),
                    path: Boolean(i)
                }
            }
            Yu.exports = Xe
        });
        var Zu = h((gT, Xu) => {
            Xu.exports = ps;
            var Ju = 128,
                f3 = 127,
                h3 = ~f3,
                d3 = Math.pow(2, 31);

            function ps(r, e, t) {
                if (Number.MAX_SAFE_INTEGER && r > Number.MAX_SAFE_INTEGER) throw ps.bytes = 0, new RangeError("Could not encode varint");
                e = e || [], t = t || 0;
                for (var n = t; r >= d3;) e[t++] = r & 255 | Ju, r /= 128;
                for (; r & h3;) e[t++] = r & 255 | Ju, r >>>= 7;
                return e[t] = r | 0, ps.bytes = t - n + 1, e
            }
        });
        var tc = h((mT, Qu) => {
            Qu.exports = bs;
            var p3 = 128,
                ec = 127;

            function bs(r, e) {
                var t = 0,
                    e = e || 0,
                    n = 0,
                    i = e,
                    s, a = r.length;
                do {
                    if (i >= a || n > 49) throw bs.bytes = 0, new RangeError("Could not decode varint");
                    s = r[i++], t += n < 28 ? (s & ec) << n : (s & ec) * Math.pow(2, n), n += 7
                } while (s >= p3);
                return bs.bytes = i - e, t
            }
        });
        var nc = h((yT, rc) => {
            var b3 = Math.pow(2, 7),
                g3 = Math.pow(2, 14),
                m3 = Math.pow(2, 21),
                y3 = Math.pow(2, 28),
                x3 = Math.pow(2, 35),
                w3 = Math.pow(2, 42),
                S3 = Math.pow(2, 49),
                k3 = Math.pow(2, 56),
                E3 = Math.pow(2, 63);
            rc.exports = function(r) {
                return r < b3 ? 1 : r < g3 ? 2 : r < m3 ? 3 : r < y3 ? 4 : r < x3 ? 5 : r < w3 ? 6 : r < S3 ? 7 : r < k3 ? 8 : r < E3 ? 9 : 10
            }
        });
        var ni = h((xT, ic) => {
            ic.exports = {
                encode: Zu(),
                decode: tc(),
                encodingLength: nc()
            }
        });
        var hc = h((wT, sc) => {
            "use strict";
            var ii = Wu(),
                ac = ri(),
                _3 = J(),
                oc = rr(),
                Dr = ni(),
                si = st(),
                uc = et(),
                ai = nr();
            sc.exports = kn;

            function kn(r, e) {
                return e instanceof Uint8Array ? kn.toString(r, e) : kn.toBytes(r, e)
            }
            kn.toString = function(e, t) {
                switch (ac(e).code) {
                    case 4:
                    case 41:
                        return A3(t);
                    case 6:
                    case 273:
                    case 33:
                    case 132:
                        return cc(t).toString();
                    case 53:
                    case 54:
                    case 55:
                    case 56:
                    case 400:
                    case 777:
                        return I3(t);
                    case 421:
                        return T3(t);
                    case 444:
                        return lc(t);
                    case 445:
                        return lc(t);
                    default:
                        return si(t, "base16")
                }
            };
            kn.toBytes = function(e, t) {
                switch (ac(e).code) {
                    case 4:
                        return fc(t);
                    case 41:
                        return fc(t);
                    case 6:
                    case 273:
                    case 33:
                    case 132:
                        return gs(parseInt(t, 10));
                    case 53:
                    case 54:
                    case 55:
                    case 56:
                    case 400:
                    case 777:
                        return N3(t);
                    case 421:
                        return q3(t);
                    case 444:
                        return B3(t);
                    case 445:
                        return O3(t);
                    default:
                        return uc(t, "base16")
                }
            };

            function fc(r) {
                if (!ii.isIP(r)) throw new Error("invalid ip address");
                return ii.toBytes(r)
            }

            function A3(r) {
                let e = ii.toString(r);
                if (!e || !ii.isIP(e)) throw new Error("invalid ip address");
                return e
            }

            function gs(r) {
                let e = new ArrayBuffer(2);
                return new DataView(e).setUint16(0, r), new Uint8Array(e)
            }

            function cc(r) {
                return new DataView(r.buffer).getUint16(0)
            }

            function N3(r) {
                let e = uc(r),
                    t = Uint8Array.from(Dr.encode(e.length));
                return ai([t, e], t.length + e.length)
            }

            function I3(r) {
                let e = Dr.decode(r);
                if (r = r.slice(Dr.decode.bytes), r.length !== e) throw new Error("inconsistent lengths");
                return si(r)
            }

            function q3(r) {
                let e = new _3(r).multihash,
                    t = Uint8Array.from(Dr.encode(e.length));
                return ai([t, e], t.length + e.length)
            }

            function T3(r) {
                let e = Dr.decode(r),
                    t = r.slice(Dr.decode.bytes);
                if (t.length !== e) throw new Error("inconsistent lengths");
                return si(t, "base58btc")
            }

            function B3(r) {
                let e = r.split(":");
                if (e.length !== 2) throw new Error("failed to parse onion addr: " + e + " does not contain a port number");
                if (e[0].length !== 16) throw new Error("failed to parse onion addr: " + e[0] + " not a Tor onion address.");
                let t = oc.decode("b" + e[0]),
                    n = parseInt(e[1], 10);
                if (n < 1 || n > 65536) throw new Error("Port number is not in range(1, 65536)");
                let i = gs(n);
                return ai([t, i], t.length + i.length)
            }

            function O3(r) {
                let e = r.split(":");
                if (e.length !== 2) throw new Error("failed to parse onion addr: " + e + " does not contain a port number");
                if (e[0].length !== 56) throw new Error("failed to parse onion addr: " + e[0] + " not a Tor onion3 address.");
                let t = oc.decode("b" + e[0]),
                    n = parseInt(e[1], 10);
                if (n < 1 || n > 65536) throw new Error("Port number is not in range(1, 65536)");
                let i = gs(n);
                return ai([t, i], t.length + i.length)
            }

            function lc(r) {
                let e = r.slice(0, r.length - 2),
                    t = r.slice(r.length - 2),
                    n = si(e, "base32"),
                    i = cc(t);
                return n + ":" + i
            }
        });
        var _c = h((ST, dc) => {
            "use strict";
            var pc = hc(),
                ms = ri(),
                En = ni(),
                bc = nr(),
                P3 = st();
            dc.exports = {
                stringToStringTuples: gc,
                stringTuplesToString: mc,
                tuplesToStringTuples: xc,
                stringTuplesToTuples: yc,
                bytesToTuples: ys,
                tuplesToBytes: wc,
                bytesToString: v3,
                stringToBytes: kc,
                fromString: C3,
                fromBytes: Ec,
                validateBytes: xs,
                isValidBytes: U3,
                cleanPath: oi,
                ParseError: ws,
                protoFromTuple: _n,
                sizeForAddr: Sc
            };

            function gc(r) {
                let e = [],
                    t = r.split("/").slice(1);
                if (t.length === 1 && t[0] === "") return [];
                for (let n = 0; n < t.length; n++) {
                    let i = t[n],
                        s = ms(i);
                    if (s.size === 0) {
                        e.push([i]);
                        continue
                    }
                    if (n++, n >= t.length) throw ws("invalid address: " + r);
                    if (s.path) {
                        e.push([i, oi(t.slice(n).join("/"))]);
                        break
                    }
                    e.push([i, t[n]])
                }
                return e
            }

            function mc(r) {
                let e = [];
                return r.map(t => {
                    let n = _n(t);
                    return e.push(n.name), t.length > 1 && e.push(t[1]), null
                }), oi(e.join("/"))
            }

            function yc(r) {
                return r.map(e => {
                    Array.isArray(e) || (e = [e]);
                    let t = _n(e);
                    return e.length > 1 ? [t.code, pc.toBytes(t.code, e[1])] : [t.code]
                })
            }

            function xc(r) {
                return r.map(e => {
                    let t = _n(e);
                    return e[1] ? [t.code, pc.toString(t.code, e[1])] : [t.code]
                })
            }

            function wc(r) {
                return Ec(bc(r.map(e => {
                    let t = _n(e),
                        n = Uint8Array.from(En.encode(t.code));
                    return e.length > 1 && (n = bc([n, e[1]])), n
                })))
            }

            function Sc(r, e) {
                return r.size > 0 ? r.size / 8 : r.size === 0 ? 0 : En.decode(e) + En.decode.bytes
            }

            function ys(r) {
                let e = [],
                    t = 0;
                for (; t < r.length;) {
                    let n = En.decode(r, t),
                        i = En.decode.bytes,
                        s = ms(n),
                        a = Sc(s, r.slice(t + i));
                    if (a === 0) {
                        e.push([n]), t += i;
                        continue
                    }
                    let f = r.slice(t + i, t + i + a);
                    if (t += a + i, t > r.length) throw ws("Invalid address Uint8Array: " + P3(r, "base16"));
                    e.push([n, f])
                }
                return e
            }

            function v3(r) {
                let e = ys(r),
                    t = xc(e);
                return mc(t)
            }

            function kc(r) {
                r = oi(r);
                let e = gc(r),
                    t = yc(e);
                return wc(t)
            }

            function C3(r) {
                return kc(r)
            }

            function Ec(r) {
                let e = xs(r);
                if (e) throw e;
                return Uint8Array.from(r)
            }

            function xs(r) {
                try {
                    ys(r)
                } catch (e) {
                    return e
                }
            }

            function U3(r) {
                return xs(r) === void 0
            }

            function oi(r) {
                return "/" + r.trim().split("/").filter(e => e).join("/")
            }

            function ws(r) {
                return new Error("Error parsing address: " + r)
            }

            function _n(r) {
                return ms(r[0])
            }
        });
        var sr = h((kT, Ac) => {
            "use strict";

            function Ic(r, e) {
                for (let t in e) Object.defineProperty(r, t, {
                    value: e[t],
                    enumerable: !0,
                    configurable: !0
                });
                return r
            }

            function F3(r, e, t) {
                if (!r || typeof r == "string") throw new TypeError("Please pass an Error to err-code");
                t || (t = {}), typeof e == "object" && (t = e, e = ""), e && (t.code = e);
                try {
                    return Ic(r, t)
                } catch (n) {
                    t.message = r.message, t.stack = r.stack;
                    let i = function() {};
                    return i.prototype = Object.create(Object.getPrototypeOf(r)), Ic(new i, t)
                }
            }
            Ac.exports = F3
        });
        var Pe = h((ET, Tc) => {
            "use strict";
            var mt = _c(),
                Mr = ri(),
                Nc = ni(),
                L3 = J(),
                R3 = sr(),
                D3 = Symbol.for("nodejs.util.inspect.custom"),
                Ss = st(),
                M3 = Sn(),
                ks = new Map,
                qc = Symbol.for("@multiformats/js-multiaddr/multiaddr"),
                We = class {
                    constructor(e) {
                        if (e == null && (e = ""), Object.defineProperty(this, qc, {
                                value: !0
                            }), e instanceof Uint8Array) this.bytes = mt.fromBytes(e);
                        else if (typeof e == "string") {
                            if (e.length > 0 && e.charAt(0) !== "/") throw new Error(`multiaddr "${e}" must start with a "/"`);
                            this.bytes = mt.fromString(e)
                        } else if (We.isMultiaddr(e)) this.bytes = mt.fromBytes(e.bytes);
                        else throw new Error("addr must be a string, Buffer, or another Multiaddr")
                    }
                    toString() {
                        return mt.bytesToString(this.bytes)
                    }
                    toJSON() {
                        return this.toString()
                    }
                    toOptions() {
                        let e = {},
                            t = this.toString().split("/");
                        return e.family = t[1] === "ip4" ? 4 : 6, e.host = t[2], e.transport = t[3], e.port = parseInt(t[4]), e
                    }
                    protos() {
                        return this.protoCodes().map(e => Object.assign({}, Mr(e)))
                    }
                    protoCodes() {
                        let e = [],
                            t = this.bytes,
                            n = 0;
                        for (; n < t.length;) {
                            let i = Nc.decode(t, n),
                                s = Nc.decode.bytes,
                                a = Mr(i);
                            n += mt.sizeForAddr(a, t.slice(n + s)) + s, e.push(i)
                        }
                        return e
                    }
                    protoNames() {
                        return this.protos().map(e => e.name)
                    }
                    tuples() {
                        return mt.bytesToTuples(this.bytes)
                    }
                    stringTuples() {
                        let e = mt.bytesToTuples(this.bytes);
                        return mt.tuplesToStringTuples(e)
                    }
                    encapsulate(e) {
                        return e = new We(e), new We(this.toString() + e.toString())
                    }
                    decapsulate(e) {
                        let t = e.toString(),
                            n = this.toString(),
                            i = n.lastIndexOf(t);
                        if (i < 0) throw new Error("Address " + this + " does not contain subaddress: " + e);
                        return new We(n.slice(0, i))
                    }
                    decapsulateCode(e) {
                        let t = this.tuples();
                        for (let n = t.length - 1; n >= 0; n--)
                            if (t[n][0] === e) return new We(mt.tuplesToBytes(t.slice(0, n)));
                        return this
                    }
                    getPeerId() {
                        try {
                            let t = this.stringTuples().filter(n => n[0] === Mr.names.ipfs.code).pop();
                            return t && t[1] ? Ss(new L3(t[1]).multihash, "base58btc") : null
                        } catch (e) {
                            return null
                        }
                    }
                    getPath() {
                        let e = null;
                        try {
                            e = this.stringTuples().filter(t => !!Mr(t[0]).path)[0][1], e || (e = null)
                        } catch (t) {
                            e = null
                        }
                        return e
                    }
                    equals(e) {
                        return M3(this.bytes, e.bytes)
                    }
                    async resolve() {
                        let e = this.protos().find(i => i.resolvable);
                        if (!e) return [this];
                        let t = ks.get(e.name);
                        if (!t) throw R3(new Error(`no available resolver for ${e.name}`), "ERR_NO_AVAILABLE_RESOLVER");
                        return (await t(this)).map(i => new We(i))
                    }
                    nodeAddress() {
                        let e = this.protoCodes(),
                            t = this.protoNames(),
                            n = this.toString().split("/").slice(1);
                        if (n.length < 4) throw new Error('multiaddr must have a valid format: "/{ip4, ip6, dns4, dns6}/{address}/{tcp, udp}/{port}".');
                        if (e[0] !== 4 && e[0] !== 41 && e[0] !== 54 && e[0] !== 55) throw new Error(`no protocol with name: "'${t[0]}'". Must have a valid family name: "{ip4, ip6, dns4, dns6}".`);
                        if (n[2] !== "tcp" && n[2] !== "udp") throw new Error(`no protocol with name: "'${t[1]}'". Must have a valid transport protocol: "{tcp, udp}".`);
                        return {
                            family: e[0] === 41 || e[0] === 55 ? 6 : 4,
                            address: n[1],
                            port: parseInt(n[3])
                        }
                    }
                    isThinWaistAddress(e) {
                        let t = (e || this).protos();
                        return !(t.length !== 2 || t[0].code !== 4 && t[0].code !== 41 || t[1].code !== 6 && t[1].code !== 273)
                    }
                    static fromNodeAddress(e, t) {
                        if (!e) throw new Error("requires node address object");
                        if (!t) throw new Error("requires transport protocol");
                        let n;
                        switch (e.family) {
                            case 4:
                                n = "ip4";
                                break;
                            case 6:
                                n = "ip6";
                                break;
                            default:
                                throw Error(`Invalid addr family. Got '${e.family}' instead of 4 or 6`)
                        }
                        return new We("/" + [n, e.address, t, e.port].join("/"))
                    }
                    static isName(e) {
                        return We.isMultiaddr(e) ? e.protos().some(t => t.resolvable) : !1
                    }
                    static isMultiaddr(e) {
                        return e instanceof We || Boolean(e && e[qc])
                    } [D3]() {
                        return "<Multiaddr " + Ss(this.bytes, "base16") + " - " + mt.bytesToString(this.bytes) + ">"
                    }
                    inspect() {
                        return "<Multiaddr " + Ss(this.bytes, "base16") + " - " + mt.bytesToString(this.bytes) + ">"
                    }
                };
            We.protocols = Mr;
            We.resolvers = ks;

            function z3(r) {
                return new We(r)
            }
            Tc.exports = {
                Multiaddr: We,
                multiaddr: z3,
                protocols: Mr,
                resolvers: ks
            }
        });
        var Bc = h(() => {});
        var Es = h(ui => {
            "use strict";
            var Oc = class extends Error {
                constructor(e = "Request timed out") {
                    super(e);
                    this.name = "TimeoutError"
                }
            };
            ui.TimeoutError = Oc;
            var Pc = class extends Error {
                constructor(e = "The operation was aborted.") {
                    super(e);
                    this.name = "AbortError"
                }
            };
            ui.AbortError = Pc;
            var vc = class extends Error {
                constructor(e) {
                    super(e.statusText);
                    this.name = "HTTPError", this.response = e
                }
            };
            ui.HTTPError = vc
        });
        var Uc = h((TT, Cc) => {
            function H3() {
                return typeof window != "undefined" && typeof window.process == "object" && window.process.type === "renderer" || typeof process != "undefined" && typeof process.versions == "object" && !!process.versions.electron || typeof navigator == "object" && typeof navigator.userAgent == "string" && navigator.userAgent.indexOf("Electron") >= 0
            }
            Cc.exports = H3
        });
        var _s = h((NT, Fc) => {
            "use strict";
            var j3 = Uc(),
                ci = typeof window == "object" && typeof document == "object" && document.nodeType === 9,
                An = j3(),
                G3 = ci && !An,
                $3 = An && !ci,
                V3 = An && ci,
                W3 = typeof process != "undefined" && typeof process.release != "undefined" && process.release.name === "node" && !An,
                Y3 = typeof importScripts == "function" && typeof self != "undefined" && typeof WorkerGlobalScope != "undefined" && self instanceof WorkerGlobalScope,
                K3 = typeof process != "undefined" && typeof process.env != "undefined" && !1,
                X3 = typeof navigator != "undefined" && navigator.product === "ReactNative";
            Fc.exports = {
                isTest: K3,
                isElectron: An,
                isElectronMain: $3,
                isElectronRenderer: V3,
                isNode: W3,
                isBrowser: G3,
                isWebWorker: Y3,
                isEnvWithDom: ci,
                isReactNative: X3
            }
        });
        var Lc = h(() => {});
        var In = h((zr, Rc) => {
            "use strict";
            var J3 = function() {
                    if (typeof self != "undefined") return self;
                    if (typeof window != "undefined") return window;
                    if (typeof Rt != "undefined") return Rt;
                    throw new Error("unable to locate global object")
                },
                Rt = J3();
            Rc.exports = zr = Rt.fetch;
            Rt.fetch && (zr.default = Rt.fetch.bind(Rt));
            zr.Headers = Rt.Headers;
            zr.Request = Rt.Request;
            zr.Response = Rt.Response
        });
        var Dc = h((OT, As) => {
            "use strict";
            globalThis.fetch && globalThis.Headers && globalThis.Request && globalThis.Response ? As.exports = {
                default: globalThis.fetch,
                Headers: globalThis.Headers,
                Request: globalThis.Request,
                Response: globalThis.Response
            } : As.exports = {
                default: In().default,
                Headers: In().Headers,
                Request: In().Request,
                Response: In().Response
            }
        });
        var Mc = h((PT, Is) => {
            "use strict";
            var {
                isElectronMain: Z3
            } = _s();
            Z3 ? Is.exports = Lc() : Is.exports = Dc()
        });
        var Gc = h((vT, zc) => {
            "use strict";
            var {
                TimeoutError: Q3,
                AbortError: ex
            } = Es(), {
                Response: Hc,
                Request: tx,
                Headers: Ts,
                default: rx
            } = Mc(), ix = (r, e = {}) => {
                let t = new XMLHttpRequest;
                t.open(e.method || "GET", r.toString(), !0);
                let {
                    timeout: n,
                    headers: i
                } = e;
                if (n && n > 0 && n < Infinity && (t.timeout = n), e.overrideMimeType != null && t.overrideMimeType(e.overrideMimeType), i)
                    for (let [s, a] of new Ts(i)) t.setRequestHeader(s, a);
                return e.signal && (e.signal.onabort = () => t.abort()), e.onUploadProgress && (t.upload.onprogress = e.onUploadProgress), t.responseType = "arraybuffer", new Promise((s, a) => {
                    let f = u => {
                        switch (u.type) {
                            case "error": {
                                s(Hc.error());
                                break
                            }
                            case "load": {
                                s(new jc(t.responseURL, t.response, {
                                    status: t.status,
                                    statusText: t.statusText,
                                    headers: nx(t.getAllResponseHeaders())
                                }));
                                break
                            }
                            case "timeout": {
                                a(new Q3);
                                break
                            }
                            case "abort": {
                                a(new ex);
                                break
                            }
                            default:
                                break
                        }
                    };
                    t.onerror = f, t.onload = f, t.ontimeout = f, t.onabort = f, t.send(e.body)
                })
            }, sx = rx, ax = (r, e = {}) => e.onUploadProgress != null ? ix(r, e) : sx(r, e), nx = r => {
                let e = new Ts;
                for (let t of r.trim().split(/[\r\n]+/)) {
                    let n = t.indexOf(": ");
                    n > 0 && e.set(t.slice(0, n), t.slice(n + 1))
                }
                return e
            }, jc = class extends Hc {
                constructor(e, t, n) {
                    super(t, n);
                    Object.defineProperty(this, "url", {
                        value: e
                    })
                }
            };
            zc.exports = {
                fetch: ax,
                Request: tx,
                Headers: Ts
            }
        });
        var Vc = h((CT, $c) => {
            "use strict";
            $c.exports = r => {
                if (Object.prototype.toString.call(r) !== "[object Object]") return !1;
                let e = Object.getPrototypeOf(r);
                return e === null || e === Object.prototype
            }
        });
        var qs = h((Wc, Yc) => {
            "use strict";
            var li = Vc(),
                {
                    hasOwnProperty: Kc
                } = Object.prototype,
                {
                    propertyIsEnumerable: ox
                } = Object,
                Hr = (r, e, t) => Object.defineProperty(r, e, {
                    value: t,
                    writable: !0,
                    enumerable: !0,
                    configurable: !0
                }),
                ux = Wc,
                Xc = {
                    concatArrays: !1,
                    ignoreUndefined: !1
                },
                fi = r => {
                    let e = [];
                    for (let t in r) Kc.call(r, t) && e.push(t);
                    if (Object.getOwnPropertySymbols) {
                        let t = Object.getOwnPropertySymbols(r);
                        for (let n of t) ox.call(r, n) && e.push(n)
                    }
                    return e
                };

            function jr(r) {
                return Array.isArray(r) ? cx(r) : li(r) ? lx(r) : r
            }

            function cx(r) {
                let e = r.slice(0, 0);
                return fi(r).forEach(t => {
                    Hr(e, t, jr(r[t]))
                }), e
            }

            function lx(r) {
                let e = Object.getPrototypeOf(r) === null ? Object.create(null) : {};
                return fi(r).forEach(t => {
                    Hr(e, t, jr(r[t]))
                }), e
            }
            var Jc = (r, e, t, n) => (t.forEach(i => {
                    typeof e[i] == "undefined" && n.ignoreUndefined || (i in r && r[i] !== Object.getPrototypeOf(r) ? Hr(r, i, Ns(r[i], e[i], n)) : Hr(r, i, jr(e[i])))
                }), r),
                fx = (r, e, t) => {
                    let n = r.slice(0, 0),
                        i = 0;
                    return [r, e].forEach(s => {
                        let a = [];
                        for (let f = 0; f < s.length; f++) !Kc.call(s, f) || (a.push(String(f)), s === r ? Hr(n, i++, s[f]) : Hr(n, i++, jr(s[f])));
                        n = Jc(n, s, fi(s).filter(f => !a.includes(f)), t)
                    }), n
                };

            function Ns(r, e, t) {
                return t.concatArrays && Array.isArray(r) && Array.isArray(e) ? fx(r, e, t) : !li(e) || !li(r) ? jr(e) : Jc(r, e, fi(e), t)
            }
            Yc.exports = function(...r) {
                let e = Ns(jr(Xc), this !== ux && this || {}, Xc),
                    t = {
                        _: {}
                    };
                for (let n of r)
                    if (n !== void 0) {
                        if (!li(n)) throw new TypeError("`" + n + "` is not an Option Object");
                        t = Ns(t, {
                            _: n
                        }, e)
                    } return t._
            }
        });
        var Bs = h((UT, Zc) => {
            "use strict";
            var hx = typeof navigator != "undefined" && navigator.product === "ReactNative";

            function dx() {
                return hx ? "http://localhost" : self.location.protocol + "//" + self.location.host
            }
            var Tn = self.URL,
                Qc = dx(),
                el = class {
                    constructor(e = "", t = Qc) {
                        this.super = new Tn(e, t), this.path = this.pathname + this.search, this.auth = this.username && this.password ? this.username + ":" + this.password : null, this.query = this.search && this.search.startsWith("?") ? this.search.slice(1) : null
                    }
                    get hash() {
                        return this.super.hash
                    }
                    get host() {
                        return this.super.host
                    }
                    get hostname() {
                        return this.super.hostname
                    }
                    get href() {
                        return this.super.href
                    }
                    get origin() {
                        return this.super.origin
                    }
                    get password() {
                        return this.super.password
                    }
                    get pathname() {
                        return this.super.pathname
                    }
                    get port() {
                        return this.super.port
                    }
                    get protocol() {
                        return this.super.protocol
                    }
                    get search() {
                        return this.super.search
                    }
                    get searchParams() {
                        return this.super.searchParams
                    }
                    get username() {
                        return this.super.username
                    }
                    set hash(e) {
                        this.super.hash = e
                    }
                    set host(e) {
                        this.super.host = e
                    }
                    set hostname(e) {
                        this.super.hostname = e
                    }
                    set href(e) {
                        this.super.href = e
                    }
                    set password(e) {
                        this.super.password = e
                    }
                    set pathname(e) {
                        this.super.pathname = e
                    }
                    set port(e) {
                        this.super.port = e
                    }
                    set protocol(e) {
                        this.super.protocol = e
                    }
                    set search(e) {
                        this.super.search = e
                    }
                    set username(e) {
                        this.super.username = e
                    }
                    static createObjectURL(e) {
                        return Tn.createObjectURL(e)
                    }
                    static revokeObjectURL(e) {
                        Tn.revokeObjectURL(e)
                    }
                    toJSON() {
                        return this.super.toJSON()
                    }
                    toString() {
                        return this.super.toString()
                    }
                    format() {
                        return this.toString()
                    }
                };

            function px(r) {
                if (typeof r == "string") return new Tn(r).toString();
                if (!(r instanceof Tn)) {
                    let e = r.username && r.password ? `${r.username}:${r.password}@` : "",
                        t = r.auth ? r.auth + "@" : "",
                        n = r.port ? ":" + r.port : "",
                        i = r.protocol ? r.protocol + "//" : "",
                        s = r.host || "",
                        a = r.hostname || "",
                        f = r.search || (r.query ? "?" + r.query : ""),
                        u = r.hash || "",
                        b = r.pathname || "",
                        y = r.path || b + f;
                    return `${i}${e||t}${s||a+n}${y}${u}`
                }
            }
            Zc.exports = {
                URLWithLegacySupport: el,
                URLSearchParams: self.URLSearchParams,
                defaultBase: Qc,
                format: px
            }
        });
        var nl = h((FT, tl) => {
            "use strict";
            var {
                URLWithLegacySupport: rl,
                format: bx
            } = Bs();
            tl.exports = (r, e = {}, t = {}, n) => {
                let i = e.protocol ? e.protocol.replace(":", "") : "http";
                i = (t[i] || n || i) + ":";
                let s;
                try {
                    s = new rl(r)
                } catch (f) {
                    s = {}
                }
                let a = Object.assign({}, e, {
                    protocol: i || s.protocol,
                    host: e.host || s.host
                });
                return new rl(r, bx(a)).toString()
            }
        });
        var hi = h((LT, il) => {
            "use strict";
            var {
                URLWithLegacySupport: gx,
                format: mx,
                URLSearchParams: yx,
                defaultBase: xx
            } = Bs(), wx = nl();
            il.exports = {
                URL: gx,
                URLSearchParams: yx,
                format: mx,
                relative: wx,
                defaultBase: xx
            }
        });
        var al = h((RT, di) => {
            "use strict";
            var {
                AbortController: sl,
                AbortSignal: Sx
            } = typeof self != "undefined" ? self : typeof window != "undefined" ? window : void 0;
            di.exports = sl;
            di.exports.AbortSignal = Sx;
            di.exports.default = sl
        });
        var Je = h((DT, ol) => {
            "use strict";
            var pi;
            globalThis.AbortController && globalThis.AbortSignal ? pi = globalThis : pi = al();
            ol.exports = {
                AbortController: pi.AbortController,
                AbortSignal: pi.AbortSignal
            }
        });
        var Ps = h((MT, Os) => {
            var {
                AbortController: kx
            } = Je();

            function ul(r) {
                let e = new kx;

                function t() {
                    e.abort();
                    for (let n of r) !n || !n.removeEventListener || n.removeEventListener("abort", t)
                }
                for (let n of r)
                    if (!(!n || !n.addEventListener)) {
                        if (n.aborted) {
                            t();
                            break
                        }
                        n.addEventListener("abort", t)
                    } return e.signal
            }
            Os.exports = ul;
            Os.exports.anySignal = ul
        });
        var Cs = h((zT, cl) => {
            "use strict";
            var {
                fetch: Ex,
                Request: _x,
                Headers: Ax
            } = Gc(), {
                TimeoutError: vs,
                HTTPError: ll
            } = Es(), fl = qs().bind({
                ignoreUndefined: !0
            }), {
                URL: hl,
                URLSearchParams: dl
            } = hi(), {
                AbortController: Ix
            } = Je(), Tx = Ps(), Nx = (r, e, t) => {
                if (e === void 0) return r;
                let n = Date.now(),
                    i = () => Date.now() - n >= e;
                return new Promise((s, a) => {
                    let f = setTimeout(() => {
                            i() && (a(new vs), t.abort())
                        }, e),
                        u = b => E => {
                            if (clearTimeout(f), i()) {
                                a(new vs);
                                return
                            }
                            b(E)
                        };
                    r.then(u(s), u(a))
                })
            }, qx = {
                throwHttpErrors: !0,
                credentials: "same-origin"
            }, Ye = class {
                constructor(e = {}) {
                    this.opts = fl(qx, e)
                }
                async fetch(e, t = {}) {
                    let n = fl(this.opts, t),
                        i = new Ax(n.headers);
                    if (typeof e != "string" && !(e instanceof hl || e instanceof _x)) throw new TypeError("`resource` must be a string, URL, or Request");
                    let s = new hl(e.toString(), n.base),
                        {
                            searchParams: a,
                            transformSearchParams: f,
                            json: u
                        } = n;
                    a && (typeof f == "function" ? s.search = f(new dl(n.searchParams)) : s.search = new dl(n.searchParams)), u && (n.body = JSON.stringify(n.json), i.set("content-type", "application/json"));
                    let b = new Ix,
                        y = Tx([b.signal, n.signal]),
                        E = await Nx(Ex(s.toString(), {
                            ...n,
                            signal: y,
                            timeout: void 0,
                            headers: i
                        }), n.timeout, b);
                    if (!E.ok && n.throwHttpErrors) throw n.handleError && await n.handleError(E), new ll(E);
                    return E.iterator = function() {
                        return pl(E.body)
                    }, E.ndjson = async function*() {
                        for await (let z of Bx(E.iterator())) t.transform ? yield t.transform(z): yield z
                    }, E
                }
                post(e, t = {}) {
                    return this.fetch(e, {
                        ...t,
                        method: "POST"
                    })
                }
                get(e, t = {}) {
                    return this.fetch(e, {
                        ...t,
                        method: "GET"
                    })
                }
                put(e, t = {}) {
                    return this.fetch(e, {
                        ...t,
                        method: "PUT"
                    })
                }
                delete(e, t = {}) {
                    return this.fetch(e, {
                        ...t,
                        method: "DELETE"
                    })
                }
                options(e, t = {}) {
                    return this.fetch(e, {
                        ...t,
                        method: "OPTIONS"
                    })
                }
            }, Bx = async function*(r) {
                let e = new TextDecoder,
                    t = "";
                for await (let n of r) {
                    t += e.decode(n, {
                        stream: !0
                    });
                    let i = t.split(/\r?\n/);
                    for (let s = 0; s < i.length - 1; s++) {
                        let a = i[s].trim();
                        a.length > 0 && (yield JSON.parse(a))
                    }
                    t = i[i.length - 1]
                }
                t += e.decode(), t = t.trim(), t.length !== 0 && (yield JSON.parse(t))
            }, pl = r => {
                if (vx(r)) {
                    let e = r[Symbol.asyncIterator]();
                    return {
                        [Symbol.asyncIterator]() {
                            return {
                                next: e.next.bind(e),
                                return (t) {
                                    return r.destroy(), typeof e.return == "function" ? e.return() : Promise.resolve({
                                        done: !0,
                                        value: t
                                    })
                                }
                            }
                        }
                    }
                }
                if (Px(r)) {
                    let e = r.getReader();
                    return async function*() {
                        try {
                            for (;;) {
                                let {
                                    done: t,
                                    value: n
                                } = await e.read();
                                if (t) return;
                                n && (yield n)
                            }
                        } finally {
                            e.releaseLock()
                        }
                    }()
                }
                if (Ox(r)) return r;
                throw new TypeError("Body can't be converted to AsyncIterable")
            }, Ox = r => typeof r == "object" && r !== null && typeof r[Symbol.asyncIterator] == "function", Px = r => r && typeof r.getReader == "function", vx = r => Object.prototype.hasOwnProperty.call(r, "readable") && Object.prototype.hasOwnProperty.call(r, "writable");
            Ye.HTTPError = ll;
            Ye.TimeoutError = vs;
            Ye.streamToAsyncIterator = pl;
            Ye.post = (r, e) => new Ye(e).post(r, e);
            Ye.get = (r, e) => new Ye(e).get(r, e);
            Ye.put = (r, e) => new Ye(e).put(r, e);
            Ye.delete = (r, e) => new Ye(e).delete(r, e);
            Ye.options = (r, e) => new Ye(e).options(r, e);
            cl.exports = Ye
        });
        var gl = h((HT, bl) => {
            "use strict";
            var Cx = Cs(),
                Fx = (r, e) => ({
                    path: decodeURIComponent(new URL(r).pathname.split("/").pop() || ""),
                    content: Ux(r, e)
                });
            async function* Ux(r, e) {
                yield*(await new Cx().get(r, e)).iterator()
            }
            bl.exports = Fx
        });
        var Ne = h((jT, ml) => {
            "use strict";
            ml.exports = r => {
                if (r == null) return r;
                let e = /^[A-Z]+$/,
                    t = {};
                return Object.keys(r).reduce((n, i) => (e.test(i) ? n[i.toLowerCase()] = r[i] : e.test(i[0]) ? n[i[0].toLowerCase() + i.slice(1)] = r[i] : n[i] = r[i], n), t)
            }
        });
        var xl = h((GT, Us) => {
            "use strict";
            var Lx = /(-?(?:\d+\.?\d*|\d*\.?\d+)(?:e[-+]?\d+)?)\s*([\p{L}]*)/uig;
            Us.exports = ie;
            Us.exports.default = ie;
            ie.nanosecond = ie.ns = 1 / 1e6;
            ie.\u00B5s = ie.\u03BCs = ie.us = ie.microsecond = 1 / 1e3;
            ie.millisecond = ie.ms = ie[""] = 1;
            ie.second = ie.sec = ie.s = ie.ms * 1e3;
            ie.minute = ie.min = ie.m = ie.s * 60;
            ie.hour = ie.hr = ie.h = ie.m * 60;
            ie.day = ie.d = ie.h * 24;
            ie.week = ie.wk = ie.w = ie.d * 7;
            ie.month = ie.b = ie.d * (365.25 / 12);
            ie.year = ie.yr = ie.y = ie.d * 365.25;

            function ie(r = "", e = "ms") {
                var t = null;
                return r = (r + "").replace(/(\d)[,_](\d)/g, "$1$2"), r.replace(Lx, function(n, i, s) {
                    s = yl(s), s && (t = (t || 0) + parseFloat(i, 10) * s)
                }), t && t / (yl(e) || 1)
            }

            function yl(r) {
                return ie[r] || ie[r.toLowerCase().replace(/s$/, "")]
            }
        });
        var Sl = h(($T, wl) => {
            var Gr = 1e3,
                $r = Gr * 60,
                Vr = $r * 60,
                ar = Vr * 24,
                Rx = ar * 7,
                Dx = ar * 365.25;
            wl.exports = function(r, e) {
                e = e || {};
                var t = typeof r;
                if (t === "string" && r.length > 0) return Mx(r);
                if (t === "number" && isFinite(r)) return e.long ? Hx(r) : zx(r);
                throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(r))
            };

            function Mx(r) {
                if (r = String(r), !(r.length > 100)) {
                    var e = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(r);
                    if (!!e) {
                        var t = parseFloat(e[1]),
                            n = (e[2] || "ms").toLowerCase();
                        switch (n) {
                            case "years":
                            case "year":
                            case "yrs":
                            case "yr":
                            case "y":
                                return t * Dx;
                            case "weeks":
                            case "week":
                            case "w":
                                return t * Rx;
                            case "days":
                            case "day":
                            case "d":
                                return t * ar;
                            case "hours":
                            case "hour":
                            case "hrs":
                            case "hr":
                            case "h":
                                return t * Vr;
                            case "minutes":
                            case "minute":
                            case "mins":
                            case "min":
                            case "m":
                                return t * $r;
                            case "seconds":
                            case "second":
                            case "secs":
                            case "sec":
                            case "s":
                                return t * Gr;
                            case "milliseconds":
                            case "millisecond":
                            case "msecs":
                            case "msec":
                            case "ms":
                                return t;
                            default:
                                return
                        }
                    }
                }
            }

            function zx(r) {
                var e = Math.abs(r);
                return e >= ar ? Math.round(r / ar) + "d" : e >= Vr ? Math.round(r / Vr) + "h" : e >= $r ? Math.round(r / $r) + "m" : e >= Gr ? Math.round(r / Gr) + "s" : r + "ms"
            }

            function Hx(r) {
                var e = Math.abs(r);
                return e >= ar ? bi(r, e, ar, "day") : e >= Vr ? bi(r, e, Vr, "hour") : e >= $r ? bi(r, e, $r, "minute") : e >= Gr ? bi(r, e, Gr, "second") : r + " ms"
            }

            function bi(r, e, t, n) {
                var i = e >= t * 1.5;
                return Math.round(r / t) + " " + n + (i ? "s" : "")
            }
        });
        var El = h((VT, kl) => {
            function jx(r) {
                t.debug = t, t.default = t, t.coerce = u, t.disable = s, t.enable = i, t.enabled = a, t.humanize = Sl(), t.destroy = b, Object.keys(r).forEach(y => {
                    t[y] = r[y]
                }), t.names = [], t.skips = [], t.formatters = {};

                function e(y) {
                    let E = 0;
                    for (let z = 0; z < y.length; z++) E = (E << 5) - E + y.charCodeAt(z), E |= 0;
                    return t.colors[Math.abs(E) % t.colors.length]
                }
                t.selectColor = e;

                function t(y) {
                    let E, z = null;

                    function d(...I) {
                        if (!d.enabled) return;
                        let U = d,
                            se = Number(new Date),
                            F = se - (E || se);
                        U.diff = F, U.prev = E, U.curr = se, E = se, I[0] = t.coerce(I[0]), typeof I[0] != "string" && I.unshift("%O");
                        let H = 0;
                        I[0] = I[0].replace(/%([a-zA-Z%])/g, ($, D) => {
                            if ($ === "%%") return "%";
                            H++;
                            let M = t.formatters[D];
                            if (typeof M == "function") {
                                let R = I[H];
                                $ = M.call(U, R), I.splice(H, 1), H--
                            }
                            return $
                        }), t.formatArgs.call(U, I), (U.log || t.log).apply(U, I)
                    }
                    return d.namespace = y, d.useColors = t.useColors(), d.color = t.selectColor(y), d.extend = n, d.destroy = t.destroy, Object.defineProperty(d, "enabled", {
                        enumerable: !0,
                        configurable: !1,
                        get: () => z === null ? t.enabled(y) : z,
                        set: I => {
                            z = I
                        }
                    }), typeof t.init == "function" && t.init(d), d
                }

                function n(y, E) {
                    let z = t(this.namespace + (typeof E == "undefined" ? ":" : E) + y);
                    return z.log = this.log, z
                }

                function i(y) {
                    t.save(y), t.names = [], t.skips = [];
                    let E, z = (typeof y == "string" ? y : "").split(/[\s,]+/),
                        d = z.length;
                    for (E = 0; E < d; E++) !z[E] || (y = z[E].replace(/\*/g, ".*?"), y[0] === "-" ? t.skips.push(new RegExp("^" + y.substr(1) + "$")) : t.names.push(new RegExp("^" + y + "$")))
                }

                function s() {
                    let y = [...t.names.map(f), ...t.skips.map(f).map(E => "-" + E)].join(",");
                    return t.enable(""), y
                }

                function a(y) {
                    if (y[y.length - 1] === "*") return !0;
                    let E, z;
                    for (E = 0, z = t.skips.length; E < z; E++)
                        if (t.skips[E].test(y)) return !1;
                    for (E = 0, z = t.names.length; E < z; E++)
                        if (t.names[E].test(y)) return !0;
                    return !1
                }

                function f(y) {
                    return y.toString().substring(2, y.toString().length - 2).replace(/\.\*\?$/, "*")
                }

                function u(y) {
                    return y instanceof Error ? y.stack || y.message : y
                }

                function b() {
                    console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")
                }
                return t.enable(t.load()), t
            }
            kl.exports = jx
        });
        var Fs = h((tt, gi) => {
            tt.formatArgs = Gx;
            tt.save = $x;
            tt.load = Vx;
            tt.useColors = Wx;
            tt.storage = Yx();
            tt.destroy = (() => {
                let r = !1;
                return () => {
                    r || (r = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))
                }
            })();
            tt.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"];

            function Wx() {
                return typeof window != "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs) ? !0 : typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/) ? !1 : typeof document != "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window != "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)
            }

            function Gx(r) {
                if (r[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + r[0] + (this.useColors ? "%c " : " ") + "+" + gi.exports.humanize(this.diff), !this.useColors) return;
                let e = "color: " + this.color;
                r.splice(1, 0, e, "color: inherit");
                let t = 0,
                    n = 0;
                r[0].replace(/%[a-zA-Z%]/g, i => {
                    i !== "%%" && (t++, i === "%c" && (n = t))
                }), r.splice(n, 0, e)
            }
            tt.log = console.debug || console.log || (() => {});

            function $x(r) {
                try {
                    r ? tt.storage.setItem("debug", r) : tt.storage.removeItem("debug")
                } catch (e) {}
            }

            function Vx() {
                let r;
                try {
                    r = tt.storage.getItem("debug")
                } catch (e) {}
                return !r && typeof process != "undefined" && "env" in process && (r = process.env.DEBUG), r
            }

            function Yx() {
                try {
                    return localStorage
                } catch (r) {}
            }
            gi.exports = El()(tt);
            var {
                formatters: Kx
            } = gi.exports;
            Kx.j = function(r) {
                try {
                    return JSON.stringify(r)
                } catch (e) {
                    return "[UnexpectedJSONParseError]: " + e.message
                }
            }
        });
        var Al = h((WT, _l) => {
            var {
                Multiaddr: Xx
            } = Pe(), mi = (r, e) => e, Jx = (r, e, t, n) => {
                if (n && n.assumeHttp === !1) return `tcp://${r}:${e}`;
                let i = "tcp",
                    s = `:${e}`;
                return t[t.length - 1].protocol === "tcp" && (i = e === "443" ? "https" : "http", s = e === "443" || e === "80" ? "" : s), `${i}://${r}${s}`
            }, Zx = {
                ip4: mi,
                ip6: (r, e, t, n) => n.length === 1 && n[0].protocol === "ip6" ? e : `[${e}]`,
                tcp: (r, e, t, n, i) => n.some(s => ["http", "https", "ws", "wss"].includes(s.protocol)) ? `${r}:${e}` : Jx(r, e, n, i),
                udp: (r, e) => `udp://${r}:${e}`,
                dnsaddr: mi,
                dns4: mi,
                dns6: mi,
                ipfs: (r, e) => `${r}/ipfs/${e}`,
                p2p: (r, e) => `${r}/p2p/${e}`,
                http: r => `http://${r}`,
                https: r => `https://${r}`,
                ws: r => `ws://${r}`,
                wss: r => `wss://${r}`,
                "p2p-websocket-star": r => `${r}/p2p-websocket-star`,
                "p2p-webrtc-star": r => `${r}/p2p-webrtc-star`,
                "p2p-webrtc-direct": r => `${r}/p2p-webrtc-direct`
            };
            _l.exports = (r, e) => {
                let t = new Xx(r),
                    n = r.toString().split("/").slice(1);
                return t.tuples().map(i => ({
                    protocol: n.shift(),
                    content: i[1] ? n.shift() : null
                })).reduce((i, s, a, f) => {
                    let u = Zx[s.protocol];
                    if (!u) throw new Error(`Unsupported protocol ${s.protocol}`);
                    return u(i, s.content, a, f, e)
                }, "")
            }
        });
        var Tl = h((YT, Il) => {
            "use strict";
            var {
                Multiaddr: Qx
            } = Pe(), ew = Al();
            Il.exports = r => {
                try {
                    r = ew(new Qx(r))
                } catch (e) {}
                return r = r.toString(), r
            }
        });
        var Nl = h(() => {});
        var ql = h(() => {});
        var xi = h((QT, Bl) => {
            "use strict";
            var {
                Multiaddr: Ol
            } = Pe(), {
                isBrowser: Ls,
                isWebWorker: Rs,
                isNode: tw
            } = _s(), {
                default: rw
            } = xl(), Pl = Fs()("ipfs-http-client:lib:error-handler"), yi = Cs(), nw = qs(), vl = Tl(), iw = Nl(), sw = ql(), aw = Ls || Rs ? location.protocol : "http", ow = Ls || Rs ? location.hostname : "localhost", uw = Ls || Rs ? location.port : "5001", cw = (r = {}) => {
                let e, t = {},
                    n;
                if (typeof r == "string" || Ol.isMultiaddr(r)) e = new URL(vl(r));
                else if (r instanceof URL) e = r;
                else if (typeof r.url == "string" || Ol.isMultiaddr(r.url)) e = new URL(vl(r.url)), t = r;
                else if (r.url instanceof URL) e = r.url, t = r;
                else {
                    t = r || {};
                    let i = (t.protocol || aw).replace(":", ""),
                        s = (t.host || ow).split(":")[0],
                        a = t.port || uw;
                    e = new URL(`${i}://${s}:${a}`)
                }
                if (t.apiPath ? e.pathname = t.apiPath : (e.pathname === "/" || e.pathname === void 0) && (e.pathname = "api/v0"), tw) {
                    let i = e.protocol.startsWith("https") ? sw.Agent : iw.Agent;
                    n = t.agent || new i({
                        keepAlive: !0,
                        maxSockets: 6
                    })
                }
                return {
                    ...t,
                    host: e.host,
                    protocol: e.protocol.replace(":", ""),
                    port: Number(e.port),
                    apiPath: e.pathname,
                    url: e,
                    agent: n
                }
            }, Cl = async r => {
                let e;
                try {
                    if ((r.headers.get("Content-Type") || "").startsWith("application/json")) {
                        let n = await r.json();
                        Pl(n), e = n.Message || n.message
                    } else e = await r.text()
                } catch (n) {
                    Pl("Failed to parse error response", n), e = n.message
                }
                let t = new yi.HTTPError(r);
                throw e && e.includes("context deadline exceeded") && (t = new yi.TimeoutError("Request timed out")), e && e.includes("request timed out") && (t = new yi.TimeoutError("Request timed out")), e && (t.message = e), t
            }, lw = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, Ul = r => r.replace(lw, function(e) {
                return "-" + e.toLowerCase()
            }), fw = r => typeof r == "string" ? rw(r) : r, Ds = class extends yi {
                constructor(e = {}) {
                    let t = cw(e);
                    super({
                        timeout: fw(t.timeout || 0) || 6e4 * 20,
                        headers: t.headers,
                        base: `${t.url}`,
                        handleError: Cl,
                        transformSearchParams: i => {
                            let s = new URLSearchParams;
                            for (let [a, f] of i) f !== "undefined" && f !== "null" && a !== "signal" && s.append(Ul(a), f), a === "timeout" && !isNaN(f) && s.append(Ul(a), f);
                            return s
                        },
                        agent: t.agent
                    });
                    delete this.get, delete this.put, delete this.delete, delete this.options;
                    let n = this.fetch;
                    this.fetch = (i, s = {}) => (typeof i == "string" && !i.startsWith("/") && (i = `${t.url}/${i}`), n.call(this, i, nw(s, {
                        method: "POST"
                    })))
                }
            };
            Ds.errorHandler = Cl;
            Bl.exports = Ds
        });
        var v = h((eN, Fl) => {
            "use strict";
            var hw = xi(),
                dw = r => e => r(new hw(e), e);
            Fl.exports = dw
        });
        var Ms = h((tN, Ll) => {
            "use strict";

            function pw(r) {
                let [e, t] = r[Symbol.asyncIterator] ? [r[Symbol.asyncIterator](), Symbol.asyncIterator] : [r[Symbol.iterator](), Symbol.iterator], n = [];
                return {
                    peek: () => e.next(),
                    push: i => {
                        n.push(i)
                    },
                    next: () => n.length ? {
                        done: !1,
                        value: n.shift()
                    } : e.next(),
                    [t]() {
                        return this
                    }
                }
            }
            Ll.exports = pw
        });
        var zs = h((rN, Rl) => {
            "use strict";
            async function* bw(r, e = {}) {
                let t = r.getReader();
                try {
                    for (;;) {
                        let n = await t.read();
                        if (n.done) return;
                        yield n.value
                    }
                } finally {
                    e.preventCancel !== !0 && t.cancel(), t.releaseLock()
                }
            }
            Rl.exports = bw
        });
        var Ml = h((nN, Dl) => {
            "use strict";
            var gw = async r => {
                let e = [];
                for await (let t of r) e.push(t);
                return e
            };
            Dl.exports = gw
        });
        var Hs = h((iN, zl) => {
            "use strict";
            var {
                Blob: Hl
            } = globalThis;

            function mw(r) {
                return ArrayBuffer.isView(r) || r instanceof ArrayBuffer
            }

            function yw(r) {
                return typeof Hl != "undefined" && r instanceof Hl
            }

            function xw(r) {
                return typeof r == "object" && (r.path || r.content)
            }
            var ww = r => r && typeof r.getReader == "function";
            zl.exports = {
                isBytes: mw,
                isBlob: yw,
                isFileObject: xw,
                isReadableStream: ww
            }
        });
        var Vl = h((sN, jl) => {
            "use strict";
            var Sw = sr(),
                kw = Ms(),
                Ew = zs(),
                _w = Ml(),
                {
                    isBytes: Gl,
                    isBlob: Aw,
                    isReadableStream: Iw
                } = Hs();
            async function Tw(r) {
                if (Gl(r)) return new Blob([r]);
                if (typeof r == "string" || r instanceof String) return new Blob([r.toString()]);
                if (Aw(r)) return r;
                if (Iw(r) && (r = Ew(r)), Symbol.iterator in r || Symbol.asyncIterator in r) {
                    let e = kw(r),
                        {
                            value: t,
                            done: n
                        } = await e.peek();
                    if (n) return $l(e);
                    if (e.push(t), Number.isInteger(t)) return new Blob([Uint8Array.from(await _w(e))]);
                    if (Gl(t) || typeof t == "string" || t instanceof String) return $l(e)
                }
                throw Sw(new Error(`Unexpected input: ${r}`), "ERR_UNEXPECTED_INPUT")
            }
            async function $l(r) {
                let e = [];
                for await (let t of r) e.push(t);
                return new Blob(e)
            }
            jl.exports = Tw
        });
        var js = h((aN, Wl) => {
            "use strict";
            var Nw = async function*(r, e) {
                for await (let t of r) yield e(t)
            };
            Wl.exports = Nw
        });
        var Kl = h((oN, Yl) => {
            "use strict";
            Yl.exports = qw;

            function qw(r, e) {
                for (var t = new Array(arguments.length - 1), n = 0, i = 2, s = !0; i < arguments.length;) t[n++] = arguments[i++];
                return new Promise(function(f, u) {
                    t[n] = function(y) {
                        if (s)
                            if (s = !1, y) u(y);
                            else {
                                for (var E = new Array(arguments.length - 1), z = 0; z < E.length;) E[z++] = arguments[z];
                                f.apply(null, E)
                            }
                    };
                    try {
                        r.apply(e || null, t)
                    } catch (b) {
                        s && (s = !1, u(b))
                    }
                })
            }
        });
        var Ql = h(Xl => {
            "use strict";
            var wi = Xl;
            wi.length = function(e) {
                var t = e.length;
                if (!t) return 0;
                for (var n = 0; --t % 4 > 1 && e.charAt(t) === "=";) ++n;
                return Math.ceil(e.length * 3) / 4 - n
            };
            var Wr = new Array(64),
                Jl = new Array(123);
            for (var It = 0; It < 64;) Jl[Wr[It] = It < 26 ? It + 65 : It < 52 ? It + 71 : It < 62 ? It - 4 : It - 59 | 43] = It++;
            wi.encode = function(e, t, n) {
                for (var i = null, s = [], a = 0, f = 0, u; t < n;) {
                    var b = e[t++];
                    switch (f) {
                        case 0:
                            s[a++] = Wr[b >> 2], u = (b & 3) << 4, f = 1;
                            break;
                        case 1:
                            s[a++] = Wr[u | b >> 4], u = (b & 15) << 2, f = 2;
                            break;
                        case 2:
                            s[a++] = Wr[u | b >> 6], s[a++] = Wr[b & 63], f = 0;
                            break
                    }
                    a > 8191 && ((i || (i = [])).push(String.fromCharCode.apply(String, s)), a = 0)
                }
                return f && (s[a++] = Wr[u], s[a++] = 61, f === 1 && (s[a++] = 61)), i ? (a && i.push(String.fromCharCode.apply(String, s.slice(0, a))), i.join("")) : String.fromCharCode.apply(String, s.slice(0, a))
            };
            var Zl = "invalid encoding";
            wi.decode = function(e, t, n) {
                for (var i = n, s = 0, a, f = 0; f < e.length;) {
                    var u = e.charCodeAt(f++);
                    if (u === 61 && s > 1) break;
                    if ((u = Jl[u]) === void 0) throw Error(Zl);
                    switch (s) {
                        case 0:
                            a = u, s = 1;
                            break;
                        case 1:
                            t[n++] = a << 2 | (u & 48) >> 4, a = u, s = 2;
                            break;
                        case 2:
                            t[n++] = (a & 15) << 4 | (u & 60) >> 2, a = u, s = 3;
                            break;
                        case 3:
                            t[n++] = (a & 3) << 6 | u, s = 0;
                            break
                    }
                }
                if (s === 1) throw Error(Zl);
                return n - i
            };
            wi.test = function(e) {
                return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)
            }
        });
        var t0 = h((cN, e0) => {
            "use strict";
            e0.exports = Si;

            function Si() {
                this._listeners = {}
            }
            Si.prototype.on = function(e, t, n) {
                return (this._listeners[e] || (this._listeners[e] = [])).push({
                    fn: t,
                    ctx: n || this
                }), this
            };
            Si.prototype.off = function(e, t) {
                if (e === void 0) this._listeners = {};
                else if (t === void 0) this._listeners[e] = [];
                else
                    for (var n = this._listeners[e], i = 0; i < n.length;) n[i].fn === t ? n.splice(i, 1) : ++i;
                return this
            };
            Si.prototype.emit = function(e) {
                var t = this._listeners[e];
                if (t) {
                    for (var n = [], i = 1; i < arguments.length;) n.push(arguments[i++]);
                    for (i = 0; i < t.length;) t[i].fn.apply(t[i++].ctx, n)
                }
                return this
            }
        });
        var u0 = h((lN, r0) => {
            "use strict";
            r0.exports = n0(n0);

            function n0(r) {
                return typeof Float32Array != "undefined" ? function() {
                    var e = new Float32Array([-0]),
                        t = new Uint8Array(e.buffer),
                        n = t[3] === 128;

                    function i(u, b, y) {
                        e[0] = u, b[y] = t[0], b[y + 1] = t[1], b[y + 2] = t[2], b[y + 3] = t[3]
                    }

                    function s(u, b, y) {
                        e[0] = u, b[y] = t[3], b[y + 1] = t[2], b[y + 2] = t[1], b[y + 3] = t[0]
                    }
                    r.writeFloatLE = n ? i : s, r.writeFloatBE = n ? s : i;

                    function a(u, b) {
                        return t[0] = u[b], t[1] = u[b + 1], t[2] = u[b + 2], t[3] = u[b + 3], e[0]
                    }

                    function f(u, b) {
                        return t[3] = u[b], t[2] = u[b + 1], t[1] = u[b + 2], t[0] = u[b + 3], e[0]
                    }
                    r.readFloatLE = n ? a : f, r.readFloatBE = n ? f : a
                }() : function() {
                    function e(n, i, s, a) {
                        var f = i < 0 ? 1 : 0;
                        if (f && (i = -i), i === 0) n(1 / i > 0 ? 0 : 2147483648, s, a);
                        else if (isNaN(i)) n(2143289344, s, a);
                        else if (i > 34028234663852886e22) n((f << 31 | 2139095040) >>> 0, s, a);
                        else if (i < 11754943508222875e-54) n((f << 31 | Math.round(i / 1401298464324817e-60)) >>> 0, s, a);
                        else {
                            var u = Math.floor(Math.log(i) / Math.LN2),
                                b = Math.round(i * Math.pow(2, -u) * 8388608) & 8388607;
                            n((f << 31 | u + 127 << 23 | b) >>> 0, s, a)
                        }
                    }
                    r.writeFloatLE = e.bind(null, i0), r.writeFloatBE = e.bind(null, s0);

                    function t(n, i, s) {
                        var a = n(i, s),
                            f = (a >> 31) * 2 + 1,
                            u = a >>> 23 & 255,
                            b = a & 8388607;
                        return u === 255 ? b ? NaN : f * Infinity : u === 0 ? f * 1401298464324817e-60 * b : f * Math.pow(2, u - 150) * (b + 8388608)
                    }
                    r.readFloatLE = t.bind(null, a0), r.readFloatBE = t.bind(null, o0)
                }(), typeof Float64Array != "undefined" ? function() {
                    var e = new Float64Array([-0]),
                        t = new Uint8Array(e.buffer),
                        n = t[7] === 128;

                    function i(u, b, y) {
                        e[0] = u, b[y] = t[0], b[y + 1] = t[1], b[y + 2] = t[2], b[y + 3] = t[3], b[y + 4] = t[4], b[y + 5] = t[5], b[y + 6] = t[6], b[y + 7] = t[7]
                    }

                    function s(u, b, y) {
                        e[0] = u, b[y] = t[7], b[y + 1] = t[6], b[y + 2] = t[5], b[y + 3] = t[4], b[y + 4] = t[3], b[y + 5] = t[2], b[y + 6] = t[1], b[y + 7] = t[0]
                    }
                    r.writeDoubleLE = n ? i : s, r.writeDoubleBE = n ? s : i;

                    function a(u, b) {
                        return t[0] = u[b], t[1] = u[b + 1], t[2] = u[b + 2], t[3] = u[b + 3], t[4] = u[b + 4], t[5] = u[b + 5], t[6] = u[b + 6], t[7] = u[b + 7], e[0]
                    }

                    function f(u, b) {
                        return t[7] = u[b], t[6] = u[b + 1], t[5] = u[b + 2], t[4] = u[b + 3], t[3] = u[b + 4], t[2] = u[b + 5], t[1] = u[b + 6], t[0] = u[b + 7], e[0]
                    }
                    r.readDoubleLE = n ? a : f, r.readDoubleBE = n ? f : a
                }() : function() {
                    function e(n, i, s, a, f, u) {
                        var b = a < 0 ? 1 : 0;
                        if (b && (a = -a), a === 0) n(0, f, u + i), n(1 / a > 0 ? 0 : 2147483648, f, u + s);
                        else if (isNaN(a)) n(0, f, u + i), n(2146959360, f, u + s);
                        else if (a > 17976931348623157e292) n(0, f, u + i), n((b << 31 | 2146435072) >>> 0, f, u + s);
                        else {
                            var y;
                            if (a < 22250738585072014e-324) y = a / 5e-324, n(y >>> 0, f, u + i), n((b << 31 | y / 4294967296) >>> 0, f, u + s);
                            else {
                                var E = Math.floor(Math.log(a) / Math.LN2);
                                E === 1024 && (E = 1023), y = a * Math.pow(2, -E), n(y * 4503599627370496 >>> 0, f, u + i), n((b << 31 | E + 1023 << 20 | y * 1048576 & 1048575) >>> 0, f, u + s)
                            }
                        }
                    }
                    r.writeDoubleLE = e.bind(null, i0, 0, 4), r.writeDoubleBE = e.bind(null, s0, 4, 0);

                    function t(n, i, s, a, f) {
                        var u = n(a, f + i),
                            b = n(a, f + s),
                            y = (b >> 31) * 2 + 1,
                            E = b >>> 20 & 2047,
                            z = 4294967296 * (b & 1048575) + u;
                        return E === 2047 ? z ? NaN : y * Infinity : E === 0 ? y * 5e-324 * z : y * Math.pow(2, E - 1075) * (z + 4503599627370496)
                    }
                    r.readDoubleLE = t.bind(null, a0, 0, 4), r.readDoubleBE = t.bind(null, o0, 4, 0)
                }(), r
            }

            function i0(r, e, t) {
                e[t] = r & 255, e[t + 1] = r >>> 8 & 255, e[t + 2] = r >>> 16 & 255, e[t + 3] = r >>> 24
            }

            function s0(r, e, t) {
                e[t] = r >>> 24, e[t + 1] = r >>> 16 & 255, e[t + 2] = r >>> 8 & 255, e[t + 3] = r & 255
            }

            function a0(r, e) {
                return (r[e] | r[e + 1] << 8 | r[e + 2] << 16 | r[e + 3] << 24) >>> 0
            }

            function o0(r, e) {
                return (r[e] << 24 | r[e + 1] << 16 | r[e + 2] << 8 | r[e + 3]) >>> 0
            }
        });
        var c0 = h((exports, module) => {
            "use strict";
            module.exports = inquire;

            function inquire(moduleName) {
                try {
                    var mod = eval("quire".replace(/^/, "re"))(moduleName);
                    if (mod && (mod.length || Object.keys(mod).length)) return mod
                } catch (r) {}
                return null
            }
        });
        var f0 = h(l0 => {
            "use strict";
            var Gs = l0;
            Gs.length = function(e) {
                for (var t = 0, n = 0, i = 0; i < e.length; ++i) n = e.charCodeAt(i), n < 128 ? t += 1 : n < 2048 ? t += 2 : (n & 64512) == 55296 && (e.charCodeAt(i + 1) & 64512) == 56320 ? (++i, t += 4) : t += 3;
                return t
            };
            Gs.read = function(e, t, n) {
                var i = n - t;
                if (i < 1) return "";
                for (var s = null, a = [], f = 0, u; t < n;) u = e[t++], u < 128 ? a[f++] = u : u > 191 && u < 224 ? a[f++] = (u & 31) << 6 | e[t++] & 63 : u > 239 && u < 365 ? (u = ((u & 7) << 18 | (e[t++] & 63) << 12 | (e[t++] & 63) << 6 | e[t++] & 63) - 65536, a[f++] = 55296 + (u >> 10), a[f++] = 56320 + (u & 1023)) : a[f++] = (u & 15) << 12 | (e[t++] & 63) << 6 | e[t++] & 63, f > 8191 && ((s || (s = [])).push(String.fromCharCode.apply(String, a)), f = 0);
                return s ? (f && s.push(String.fromCharCode.apply(String, a.slice(0, f))), s.join("")) : String.fromCharCode.apply(String, a.slice(0, f))
            };
            Gs.write = function(e, t, n) {
                for (var i = n, s, a, f = 0; f < e.length; ++f) s = e.charCodeAt(f), s < 128 ? t[n++] = s : s < 2048 ? (t[n++] = s >> 6 | 192, t[n++] = s & 63 | 128) : (s & 64512) == 55296 && ((a = e.charCodeAt(f + 1)) & 64512) == 56320 ? (s = 65536 + ((s & 1023) << 10) + (a & 1023), ++f, t[n++] = s >> 18 | 240, t[n++] = s >> 12 & 63 | 128, t[n++] = s >> 6 & 63 | 128, t[n++] = s & 63 | 128) : (t[n++] = s >> 12 | 224, t[n++] = s >> 6 & 63 | 128, t[n++] = s & 63 | 128);
                return n - i
            }
        });
        var d0 = h((hN, h0) => {
            "use strict";
            h0.exports = Bw;

            function Bw(r, e, t) {
                var n = t || 8192,
                    i = n >>> 1,
                    s = null,
                    a = n;
                return function(u) {
                    if (u < 1 || u > i) return r(u);
                    a + u > n && (s = r(n), a = 0);
                    var b = e.call(s, a, a += u);
                    return a & 7 && (a = (a | 7) + 1), b
                }
            }
        });
        var b0 = h((dN, p0) => {
            "use strict";
            p0.exports = Fe;
            var Nn = Vt();

            function Fe(r, e) {
                this.lo = r >>> 0, this.hi = e >>> 0
            }
            var or = Fe.zero = new Fe(0, 0);
            or.toNumber = function() {
                return 0
            };
            or.zzEncode = or.zzDecode = function() {
                return this
            };
            or.length = function() {
                return 1
            };
            var Ow = Fe.zeroHash = "\0\0\0\0\0\0\0\0";
            Fe.fromNumber = function(e) {
                if (e === 0) return or;
                var t = e < 0;
                t && (e = -e);
                var n = e >>> 0,
                    i = (e - n) / 4294967296 >>> 0;
                return t && (i = ~i >>> 0, n = ~n >>> 0, ++n > 4294967295 && (n = 0, ++i > 4294967295 && (i = 0))), new Fe(n, i)
            };
            Fe.from = function(e) {
                if (typeof e == "number") return Fe.fromNumber(e);
                if (Nn.isString(e))
                    if (Nn.Long) e = Nn.Long.fromString(e);
                    else return Fe.fromNumber(parseInt(e, 10));
                return e.low || e.high ? new Fe(e.low >>> 0, e.high >>> 0) : or
            };
            Fe.prototype.toNumber = function(e) {
                if (!e && this.hi >>> 31) {
                    var t = ~this.lo + 1 >>> 0,
                        n = ~this.hi >>> 0;
                    return t || (n = n + 1 >>> 0), -(t + n * 4294967296)
                }
                return this.lo + this.hi * 4294967296
            };
            Fe.prototype.toLong = function(e) {
                return Nn.Long ? new Nn.Long(this.lo | 0, this.hi | 0, Boolean(e)) : {
                    low: this.lo | 0,
                    high: this.hi | 0,
                    unsigned: Boolean(e)
                }
            };
            var Wt = String.prototype.charCodeAt;
            Fe.fromHash = function(e) {
                return e === Ow ? or : new Fe((Wt.call(e, 0) | Wt.call(e, 1) << 8 | Wt.call(e, 2) << 16 | Wt.call(e, 3) << 24) >>> 0, (Wt.call(e, 4) | Wt.call(e, 5) << 8 | Wt.call(e, 6) << 16 | Wt.call(e, 7) << 24) >>> 0)
            };
            Fe.prototype.toHash = function() {
                return String.fromCharCode(this.lo & 255, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, this.hi & 255, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24)
            };
            Fe.prototype.zzEncode = function() {
                var e = this.hi >> 31;
                return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ e) >>> 0, this.lo = (this.lo << 1 ^ e) >>> 0, this
            };
            Fe.prototype.zzDecode = function() {
                var e = -(this.lo & 1);
                return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ e) >>> 0, this.hi = (this.hi >>> 1 ^ e) >>> 0, this
            };
            Fe.prototype.length = function() {
                var e = this.lo,
                    t = (this.lo >>> 28 | this.hi << 4) >>> 0,
                    n = this.hi >>> 24;
                return n === 0 ? t === 0 ? e < 16384 ? e < 128 ? 1 : 2 : e < 2097152 ? 3 : 4 : t < 16384 ? t < 128 ? 5 : 6 : t < 2097152 ? 7 : 8 : n < 128 ? 9 : 10
            }
        });
        var Vt = h($s => {
            "use strict";
            var K = $s;
            K.asPromise = Kl();
            K.base64 = Ql();
            K.EventEmitter = t0();
            K.float = u0();
            K.inquire = c0();
            K.utf8 = f0();
            K.pool = d0();
            K.LongBits = b0();
            K.isNode = Boolean(typeof globalThis != "undefined" && globalThis && globalThis.process && globalThis.process.versions && globalThis.process.versions.node);
            K.global = K.isNode && globalThis || typeof window != "undefined" && window || typeof self != "undefined" && self || $s;
            K.emptyArray = Object.freeze ? Object.freeze([]) : [];
            K.emptyObject = Object.freeze ? Object.freeze({}) : {};
            K.isInteger = Number.isInteger || function(e) {
                return typeof e == "number" && isFinite(e) && Math.floor(e) === e
            };
            K.isString = function(e) {
                return typeof e == "string" || e instanceof String
            };
            K.isObject = function(e) {
                return e && typeof e == "object"
            };
            K.isset = K.isSet = function(e, t) {
                var n = e[t];
                return n != null && e.hasOwnProperty(t) ? typeof n != "object" || (Array.isArray(n) ? n.length : Object.keys(n).length) > 0 : !1
            };
            K.Buffer = function() {
                try {
                    var r = K.inquire("buffer").Buffer;
                    return r.prototype.utf8Write ? r : null
                } catch (e) {
                    return null
                }
            }();
            K._Buffer_from = null;
            K._Buffer_allocUnsafe = null;
            K.newBuffer = function(e) {
                return typeof e == "number" ? K.Buffer ? K._Buffer_allocUnsafe(e) : new K.Array(e) : K.Buffer ? K._Buffer_from(e) : typeof Uint8Array == "undefined" ? e : new Uint8Array(e)
            };
            K.Array = typeof Uint8Array != "undefined" ? Uint8Array : Array;
            K.Long = K.global.dcodeIO && K.global.dcodeIO.Long || K.global.Long || K.inquire("long");
            K.key2Re = /^true|false|0|1$/;
            K.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
            K.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
            K.longToHash = function(e) {
                return e ? K.LongBits.from(e).toHash() : K.LongBits.zeroHash
            };
            K.longFromHash = function(e, t) {
                var n = K.LongBits.fromHash(e);
                return K.Long ? K.Long.fromBits(n.lo, n.hi, t) : n.toNumber(Boolean(t))
            };

            function g0(r, e, t) {
                for (var n = Object.keys(e), i = 0; i < n.length; ++i)(r[n[i]] === void 0 || !t) && (r[n[i]] = e[n[i]]);
                return r
            }
            K.merge = g0;
            K.lcFirst = function(e) {
                return e.charAt(0).toLowerCase() + e.substring(1)
            };

            function m0(r) {
                function e(t, n) {
                    if (!(this instanceof e)) return new e(t, n);
                    Object.defineProperty(this, "message", {
                        get: function() {
                            return t
                        }
                    }), Error.captureStackTrace ? Error.captureStackTrace(this, e) : Object.defineProperty(this, "stack", {
                        value: new Error().stack || ""
                    }), n && g0(this, n)
                }
                return (e.prototype = Object.create(Error.prototype)).constructor = e, Object.defineProperty(e.prototype, "name", {
                    get: function() {
                        return r
                    }
                }), e.prototype.toString = function() {
                    return this.name + ": " + this.message
                }, e
            }
            K.newError = m0;
            K.ProtocolError = m0("ProtocolError");
            K.oneOfGetter = function(e) {
                for (var t = {}, n = 0; n < e.length; ++n) t[e[n]] = 1;
                return function() {
                    for (var i = Object.keys(this), s = i.length - 1; s > -1; --s)
                        if (t[i[s]] === 1 && this[i[s]] !== void 0 && this[i[s]] !== null) return i[s]
                }
            };
            K.oneOfSetter = function(e) {
                return function(t) {
                    for (var n = 0; n < e.length; ++n) e[n] !== t && delete this[e[n]]
                }
            };
            K.toJSONOptions = {
                longs: String,
                enums: String,
                bytes: String,
                json: !0
            };
            K._configure = function() {
                var r = K.Buffer;
                if (!r) {
                    K._Buffer_from = K._Buffer_allocUnsafe = null;
                    return
                }
                K._Buffer_from = r.from !== Uint8Array.from && r.from || function(t, n) {
                    return new r(t, n)
                }, K._Buffer_allocUnsafe = r.allocUnsafe || function(t) {
                    return new r(t)
                }
            }
        });
        var Zs = h((bN, y0) => {
            "use strict";
            y0.exports = fe;
            var ot = Vt(),
                Vs, ki = ot.LongBits,
                x0 = ot.base64,
                w0 = ot.utf8;

            function qn(r, e, t) {
                this.fn = r, this.len = e, this.next = void 0, this.val = t
            }

            function Ws() {}

            function Pw(r) {
                this.head = r.head, this.tail = r.tail, this.len = r.len, this.next = r.states
            }

            function fe() {
                this.len = 0, this.head = new qn(Ws, 0, 0), this.tail = this.head, this.states = null
            }
            var S0 = function() {
                return ot.Buffer ? function() {
                    return (fe.create = function() {
                        return new Vs
                    })()
                } : function() {
                    return new fe
                }
            };
            fe.create = S0();
            fe.alloc = function(e) {
                return new ot.Array(e)
            };
            ot.Array !== Array && (fe.alloc = ot.pool(fe.alloc, ot.Array.prototype.subarray));
            fe.prototype._push = function(e, t, n) {
                return this.tail = this.tail.next = new qn(e, t, n), this.len += t, this
            };

            function Ys(r, e, t) {
                e[t] = r & 255
            }

            function vw(r, e, t) {
                for (; r > 127;) e[t++] = r & 127 | 128, r >>>= 7;
                e[t] = r
            }

            function Ks(r, e) {
                this.len = r, this.next = void 0, this.val = e
            }
            Ks.prototype = Object.create(qn.prototype);
            Ks.prototype.fn = vw;
            fe.prototype.uint32 = function(e) {
                return this.len += (this.tail = this.tail.next = new Ks((e = e >>> 0) < 128 ? 1 : e < 16384 ? 2 : e < 2097152 ? 3 : e < 268435456 ? 4 : 5, e)).len, this
            };
            fe.prototype.int32 = function(e) {
                return e < 0 ? this._push(Xs, 10, ki.fromNumber(e)) : this.uint32(e)
            };
            fe.prototype.sint32 = function(e) {
                return this.uint32((e << 1 ^ e >> 31) >>> 0)
            };

            function Xs(r, e, t) {
                for (; r.hi;) e[t++] = r.lo & 127 | 128, r.lo = (r.lo >>> 7 | r.hi << 25) >>> 0, r.hi >>>= 7;
                for (; r.lo > 127;) e[t++] = r.lo & 127 | 128, r.lo = r.lo >>> 7;
                e[t++] = r.lo
            }
            fe.prototype.uint64 = function(e) {
                var t = ki.from(e);
                return this._push(Xs, t.length(), t)
            };
            fe.prototype.int64 = fe.prototype.uint64;
            fe.prototype.sint64 = function(e) {
                var t = ki.from(e).zzEncode();
                return this._push(Xs, t.length(), t)
            };
            fe.prototype.bool = function(e) {
                return this._push(Ys, 1, e ? 1 : 0)
            };

            function Js(r, e, t) {
                e[t] = r & 255, e[t + 1] = r >>> 8 & 255, e[t + 2] = r >>> 16 & 255, e[t + 3] = r >>> 24
            }
            fe.prototype.fixed32 = function(e) {
                return this._push(Js, 4, e >>> 0)
            };
            fe.prototype.sfixed32 = fe.prototype.fixed32;
            fe.prototype.fixed64 = function(e) {
                var t = ki.from(e);
                return this._push(Js, 4, t.lo)._push(Js, 4, t.hi)
            };
            fe.prototype.sfixed64 = fe.prototype.fixed64;
            fe.prototype.float = function(e) {
                return this._push(ot.float.writeFloatLE, 4, e)
            };
            fe.prototype.double = function(e) {
                return this._push(ot.float.writeDoubleLE, 8, e)
            };
            var Cw = ot.Array.prototype.set ? function(e, t, n) {
                t.set(e, n)
            } : function(e, t, n) {
                for (var i = 0; i < e.length; ++i) t[n + i] = e[i]
            };
            fe.prototype.bytes = function(e) {
                var t = e.length >>> 0;
                if (!t) return this._push(Ys, 1, 0);
                if (ot.isString(e)) {
                    var n = fe.alloc(t = x0.length(e));
                    x0.decode(e, n, 0), e = n
                }
                return this.uint32(t)._push(Cw, t, e)
            };
            fe.prototype.string = function(e) {
                var t = w0.length(e);
                return t ? this.uint32(t)._push(w0.write, t, e) : this._push(Ys, 1, 0)
            };
            fe.prototype.fork = function() {
                return this.states = new Pw(this), this.head = this.tail = new qn(Ws, 0, 0), this.len = 0, this
            };
            fe.prototype.reset = function() {
                return this.states ? (this.head = this.states.head, this.tail = this.states.tail, this.len = this.states.len, this.states = this.states.next) : (this.head = this.tail = new qn(Ws, 0, 0), this.len = 0), this
            };
            fe.prototype.ldelim = function() {
                var e = this.head,
                    t = this.tail,
                    n = this.len;
                return this.reset().uint32(n), n && (this.tail.next = e.next, this.tail = t, this.len += n), this
            };
            fe.prototype.finish = function() {
                for (var e = this.head.next, t = this.constructor.alloc(this.len), n = 0; e;) e.fn(e.val, t, n), n += e.len, e = e.next;
                return t
            };
            fe._configure = function(r) {
                Vs = r, fe.create = S0(), Vs._configure()
            }
        });
        var _0 = h((gN, k0) => {
            "use strict";
            k0.exports = Tt;
            var E0 = Zs();
            (Tt.prototype = Object.create(E0.prototype)).constructor = Tt;
            var Yt = Vt();

            function Tt() {
                E0.call(this)
            }
            Tt._configure = function() {
                Tt.alloc = Yt._Buffer_allocUnsafe, Tt.writeBytesBuffer = Yt.Buffer && Yt.Buffer.prototype instanceof Uint8Array && Yt.Buffer.prototype.set.name === "set" ? function(e, t, n) {
                    t.set(e, n)
                } : function(e, t, n) {
                    if (e.copy) e.copy(t, n, 0, e.length);
                    else
                        for (var i = 0; i < e.length;) t[n++] = e[i++]
                }
            };
            Tt.prototype.bytes = function(e) {
                Yt.isString(e) && (e = Yt._Buffer_from(e, "base64"));
                var t = e.length >>> 0;
                return this.uint32(t), t && this._push(Tt.writeBytesBuffer, t, e), this
            };

            function Uw(r, e, t) {
                r.length < 40 ? Yt.utf8.write(r, e, t) : e.utf8Write ? e.utf8Write(r, t) : e.write(r, t)
            }
            Tt.prototype.string = function(e) {
                var t = Yt.Buffer.byteLength(e);
                return this.uint32(t), t && this._push(Uw, t, e), this
            };
            Tt._configure()
        });
        var ta = h((mN, A0) => {
            "use strict";
            A0.exports = Be;
            var Nt = Vt(),
                Qs, I0 = Nt.LongBits,
                Fw = Nt.utf8;

            function yt(r, e) {
                return RangeError("index out of range: " + r.pos + " + " + (e || 1) + " > " + r.len)
            }

            function Be(r) {
                this.buf = r, this.pos = 0, this.len = r.length
            }
            var T0 = typeof Uint8Array != "undefined" ? function(e) {
                    if (e instanceof Uint8Array || Array.isArray(e)) return new Be(e);
                    throw Error("illegal buffer")
                } : function(e) {
                    if (Array.isArray(e)) return new Be(e);
                    throw Error("illegal buffer")
                },
                N0 = function() {
                    return Nt.Buffer ? function(t) {
                        return (Be.create = function(i) {
                            return Nt.Buffer.isBuffer(i) ? new Qs(i) : T0(i)
                        })(t)
                    } : T0
                };
            Be.create = N0();
            Be.prototype._slice = Nt.Array.prototype.subarray || Nt.Array.prototype.slice;
            Be.prototype.uint32 = function() {
                var e = 4294967295;
                return function() {
                    if (e = (this.buf[this.pos] & 127) >>> 0, this.buf[this.pos++] < 128 || (e = (e | (this.buf[this.pos] & 127) << 7) >>> 0, this.buf[this.pos++] < 128) || (e = (e | (this.buf[this.pos] & 127) << 14) >>> 0, this.buf[this.pos++] < 128) || (e = (e | (this.buf[this.pos] & 127) << 21) >>> 0, this.buf[this.pos++] < 128) || (e = (e | (this.buf[this.pos] & 15) << 28) >>> 0, this.buf[this.pos++] < 128)) return e;
                    if ((this.pos += 5) > this.len) throw this.pos = this.len, yt(this, 10);
                    return e
                }
            }();
            Be.prototype.int32 = function() {
                return this.uint32() | 0
            };
            Be.prototype.sint32 = function() {
                var e = this.uint32();
                return e >>> 1 ^ -(e & 1) | 0
            };

            function ea() {
                var r = new I0(0, 0),
                    e = 0;
                if (this.len - this.pos > 4) {
                    for (; e < 4; ++e)
                        if (r.lo = (r.lo | (this.buf[this.pos] & 127) << e * 7) >>> 0, this.buf[this.pos++] < 128) return r;
                    if (r.lo = (r.lo | (this.buf[this.pos] & 127) << 28) >>> 0, r.hi = (r.hi | (this.buf[this.pos] & 127) >> 4) >>> 0, this.buf[this.pos++] < 128) return r;
                    e = 0
                } else {
                    for (; e < 3; ++e) {
                        if (this.pos >= this.len) throw yt(this);
                        if (r.lo = (r.lo | (this.buf[this.pos] & 127) << e * 7) >>> 0, this.buf[this.pos++] < 128) return r
                    }
                    return r.lo = (r.lo | (this.buf[this.pos++] & 127) << e * 7) >>> 0, r
                }
                if (this.len - this.pos > 4) {
                    for (; e < 5; ++e)
                        if (r.hi = (r.hi | (this.buf[this.pos] & 127) << e * 7 + 3) >>> 0, this.buf[this.pos++] < 128) return r
                } else
                    for (; e < 5; ++e) {
                        if (this.pos >= this.len) throw yt(this);
                        if (r.hi = (r.hi | (this.buf[this.pos] & 127) << e * 7 + 3) >>> 0, this.buf[this.pos++] < 128) return r
                    }
                throw Error("invalid varint encoding")
            }
            Be.prototype.bool = function() {
                return this.uint32() !== 0
            };

            function Ei(r, e) {
                return (r[e - 4] | r[e - 3] << 8 | r[e - 2] << 16 | r[e - 1] << 24) >>> 0
            }
            Be.prototype.fixed32 = function() {
                if (this.pos + 4 > this.len) throw yt(this, 4);
                return Ei(this.buf, this.pos += 4)
            };
            Be.prototype.sfixed32 = function() {
                if (this.pos + 4 > this.len) throw yt(this, 4);
                return Ei(this.buf, this.pos += 4) | 0
            };

            function q0() {
                if (this.pos + 8 > this.len) throw yt(this, 8);
                return new I0(Ei(this.buf, this.pos += 4), Ei(this.buf, this.pos += 4))
            }
            Be.prototype.float = function() {
                if (this.pos + 4 > this.len) throw yt(this, 4);
                var e = Nt.float.readFloatLE(this.buf, this.pos);
                return this.pos += 4, e
            };
            Be.prototype.double = function() {
                if (this.pos + 8 > this.len) throw yt(this, 4);
                var e = Nt.float.readDoubleLE(this.buf, this.pos);
                return this.pos += 8, e
            };
            Be.prototype.bytes = function() {
                var e = this.uint32(),
                    t = this.pos,
                    n = this.pos + e;
                if (n > this.len) throw yt(this, e);
                return this.pos += e, Array.isArray(this.buf) ? this.buf.slice(t, n) : t === n ? new this.buf.constructor(0) : this._slice.call(this.buf, t, n)
            };
            Be.prototype.string = function() {
                var e = this.bytes();
                return Fw.read(e, 0, e.length)
            };
            Be.prototype.skip = function(e) {
                if (typeof e == "number") {
                    if (this.pos + e > this.len) throw yt(this, e);
                    this.pos += e
                } else
                    do
                        if (this.pos >= this.len) throw yt(this); while (this.buf[this.pos++] & 128);
                return this
            };
            Be.prototype.skipType = function(r) {
                switch (r) {
                    case 0:
                        this.skip();
                        break;
                    case 1:
                        this.skip(8);
                        break;
                    case 2:
                        this.skip(this.uint32());
                        break;
                    case 3:
                        for (;
                            (r = this.uint32() & 7) != 4;) this.skipType(r);
                        break;
                    case 5:
                        this.skip(4);
                        break;
                    default:
                        throw Error("invalid wire type " + r + " at offset " + this.pos)
                }
                return this
            };
            Be._configure = function(r) {
                Qs = r, Be.create = N0(), Qs._configure();
                var e = Nt.Long ? "toLong" : "toNumber";
                Nt.merge(Be.prototype, {
                    int64: function() {
                        return ea.call(this)[e](!1)
                    },
                    uint64: function() {
                        return ea.call(this)[e](!0)
                    },
                    sint64: function() {
                        return ea.call(this).zzDecode()[e](!1)
                    },
                    fixed64: function() {
                        return q0.call(this)[e](!0)
                    },
                    sfixed64: function() {
                        return q0.call(this)[e](!1)
                    }
                })
            }
        });
        var v0 = h((yN, B0) => {
            "use strict";
            B0.exports = ur;
            var O0 = ta();
            (ur.prototype = Object.create(O0.prototype)).constructor = ur;
            var P0 = Vt();

            function ur(r) {
                O0.call(this, r)
            }
            ur._configure = function() {
                P0.Buffer && (ur.prototype._slice = P0.Buffer.prototype.slice)
            };
            ur.prototype.string = function() {
                var e = this.uint32();
                return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + e, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + e, this.len))
            };
            ur._configure()
        });
        var U0 = h((xN, C0) => {
            "use strict";
            C0.exports = Bn;
            var ra = Vt();
            (Bn.prototype = Object.create(ra.EventEmitter.prototype)).constructor = Bn;

            function Bn(r, e, t) {
                if (typeof r != "function") throw TypeError("rpcImpl must be a function");
                ra.EventEmitter.call(this), this.rpcImpl = r, this.requestDelimited = Boolean(e), this.responseDelimited = Boolean(t)
            }
            Bn.prototype.rpcCall = function r(e, t, n, i, s) {
                if (!i) throw TypeError("request must be specified");
                var a = this;
                if (!s) return ra.asPromise(r, a, e, t, n, i);
                if (!a.rpcImpl) {
                    setTimeout(function() {
                        s(Error("already ended"))
                    }, 0);
                    return
                }
                try {
                    return a.rpcImpl(e, t[a.requestDelimited ? "encodeDelimited" : "encode"](i).finish(), function(u, b) {
                        if (u) return a.emit("error", u, e), s(u);
                        if (b === null) {
                            a.end(!0);
                            return
                        }
                        if (!(b instanceof n)) try {
                            b = n[a.responseDelimited ? "decodeDelimited" : "decode"](b)
                        } catch (y) {
                            return a.emit("error", y, e), s(y)
                        }
                        return a.emit("data", b, e), s(null, b)
                    })
                } catch (f) {
                    a.emit("error", f, e), setTimeout(function() {
                        s(f)
                    }, 0);
                    return
                }
            };
            Bn.prototype.end = function(e) {
                return this.rpcImpl && (e || this.rpcImpl(null, null, null), this.rpcImpl = null, this.emit("end").off()), this
            }
        });
        var L0 = h(F0 => {
            "use strict";
            var Lw = F0;
            Lw.Service = U0()
        });
        var D0 = h((SN, R0) => {
            "use strict";
            R0.exports = {}
        });
        var H0 = h(M0 => {
            "use strict";
            var Ze = M0;
            Ze.build = "minimal";
            Ze.Writer = Zs();
            Ze.BufferWriter = _0();
            Ze.Reader = ta();
            Ze.BufferReader = v0();
            Ze.util = Vt();
            Ze.rpc = L0();
            Ze.roots = D0();
            Ze.configure = z0;

            function z0() {
                Ze.util._configure(), Ze.Writer._configure(Ze.BufferWriter), Ze.Reader._configure(Ze.BufferReader)
            }
            z0()
        });
        var _i = h((EN, j0) => {
            "use strict";
            j0.exports = H0()
        });
        var $0 = h((_N, G0) => {
            "use strict";
            var Kt = _i(),
                Yr = Kt.Reader,
                na = Kt.Writer,
                Z = Kt.util,
                Le = Kt.roots["ipfs-unixfs"] || (Kt.roots["ipfs-unixfs"] = {});
            Le.Data = function() {
                function r(e) {
                    if (this.blocksizes = [], e)
                        for (var t = Object.keys(e), n = 0; n < t.length; ++n) e[t[n]] != null && (this[t[n]] = e[t[n]])
                }
                return r.prototype.Type = 0, r.prototype.Data = Z.newBuffer([]), r.prototype.filesize = Z.Long ? Z.Long.fromBits(0, 0, !0) : 0, r.prototype.blocksizes = Z.emptyArray, r.prototype.hashType = Z.Long ? Z.Long.fromBits(0, 0, !0) : 0, r.prototype.fanout = Z.Long ? Z.Long.fromBits(0, 0, !0) : 0, r.prototype.mode = 0, r.prototype.mtime = null, r.encode = function(t, n) {
                    if (n || (n = na.create()), n.uint32(8).int32(t.Type), t.Data != null && Object.hasOwnProperty.call(t, "Data") && n.uint32(18).bytes(t.Data), t.filesize != null && Object.hasOwnProperty.call(t, "filesize") && n.uint32(24).uint64(t.filesize), t.blocksizes != null && t.blocksizes.length)
                        for (var i = 0; i < t.blocksizes.length; ++i) n.uint32(32).uint64(t.blocksizes[i]);
                    return t.hashType != null && Object.hasOwnProperty.call(t, "hashType") && n.uint32(40).uint64(t.hashType), t.fanout != null && Object.hasOwnProperty.call(t, "fanout") && n.uint32(48).uint64(t.fanout), t.mode != null && Object.hasOwnProperty.call(t, "mode") && n.uint32(56).uint32(t.mode), t.mtime != null && Object.hasOwnProperty.call(t, "mtime") && Le.UnixTime.encode(t.mtime, n.uint32(66).fork()).ldelim(), n
                }, r.decode = function(t, n) {
                    t instanceof Yr || (t = Yr.create(t));
                    for (var i = n === void 0 ? t.len : t.pos + n, s = new Le.Data; t.pos < i;) {
                        var a = t.uint32();
                        switch (a >>> 3) {
                            case 1:
                                s.Type = t.int32();
                                break;
                            case 2:
                                s.Data = t.bytes();
                                break;
                            case 3:
                                s.filesize = t.uint64();
                                break;
                            case 4:
                                if (s.blocksizes && s.blocksizes.length || (s.blocksizes = []), (a & 7) == 2)
                                    for (var f = t.uint32() + t.pos; t.pos < f;) s.blocksizes.push(t.uint64());
                                else s.blocksizes.push(t.uint64());
                                break;
                            case 5:
                                s.hashType = t.uint64();
                                break;
                            case 6:
                                s.fanout = t.uint64();
                                break;
                            case 7:
                                s.mode = t.uint32();
                                break;
                            case 8:
                                s.mtime = Le.UnixTime.decode(t, t.uint32());
                                break;
                            default:
                                t.skipType(a & 7);
                                break
                        }
                    }
                    if (!s.hasOwnProperty("Type")) throw Z.ProtocolError("missing required 'Type'", {
                        instance: s
                    });
                    return s
                }, r.fromObject = function(t) {
                    if (t instanceof Le.Data) return t;
                    var n = new Le.Data;
                    switch (t.Type) {
                        case "Raw":
                        case 0:
                            n.Type = 0;
                            break;
                        case "Directory":
                        case 1:
                            n.Type = 1;
                            break;
                        case "File":
                        case 2:
                            n.Type = 2;
                            break;
                        case "Metadata":
                        case 3:
                            n.Type = 3;
                            break;
                        case "Symlink":
                        case 4:
                            n.Type = 4;
                            break;
                        case "HAMTShard":
                        case 5:
                            n.Type = 5;
                            break
                    }
                    if (t.Data != null && (typeof t.Data == "string" ? Z.base64.decode(t.Data, n.Data = Z.newBuffer(Z.base64.length(t.Data)), 0) : t.Data.length && (n.Data = t.Data)), t.filesize != null && (Z.Long ? (n.filesize = Z.Long.fromValue(t.filesize)).unsigned = !0 : typeof t.filesize == "string" ? n.filesize = parseInt(t.filesize, 10) : typeof t.filesize == "number" ? n.filesize = t.filesize : typeof t.filesize == "object" && (n.filesize = new Z.LongBits(t.filesize.low >>> 0, t.filesize.high >>> 0).toNumber(!0))), t.blocksizes) {
                        if (!Array.isArray(t.blocksizes)) throw TypeError(".Data.blocksizes: array expected");
                        n.blocksizes = [];
                        for (var i = 0; i < t.blocksizes.length; ++i) Z.Long ? (n.blocksizes[i] = Z.Long.fromValue(t.blocksizes[i])).unsigned = !0 : typeof t.blocksizes[i] == "string" ? n.blocksizes[i] = parseInt(t.blocksizes[i], 10) : typeof t.blocksizes[i] == "number" ? n.blocksizes[i] = t.blocksizes[i] : typeof t.blocksizes[i] == "object" && (n.blocksizes[i] = new Z.LongBits(t.blocksizes[i].low >>> 0, t.blocksizes[i].high >>> 0).toNumber(!0))
                    }
                    if (t.hashType != null && (Z.Long ? (n.hashType = Z.Long.fromValue(t.hashType)).unsigned = !0 : typeof t.hashType == "string" ? n.hashType = parseInt(t.hashType, 10) : typeof t.hashType == "number" ? n.hashType = t.hashType : typeof t.hashType == "object" && (n.hashType = new Z.LongBits(t.hashType.low >>> 0, t.hashType.high >>> 0).toNumber(!0))), t.fanout != null && (Z.Long ? (n.fanout = Z.Long.fromValue(t.fanout)).unsigned = !0 : typeof t.fanout == "string" ? n.fanout = parseInt(t.fanout, 10) : typeof t.fanout == "number" ? n.fanout = t.fanout : typeof t.fanout == "object" && (n.fanout = new Z.LongBits(t.fanout.low >>> 0, t.fanout.high >>> 0).toNumber(!0))), t.mode != null && (n.mode = t.mode >>> 0), t.mtime != null) {
                        if (typeof t.mtime != "object") throw TypeError(".Data.mtime: object expected");
                        n.mtime = Le.UnixTime.fromObject(t.mtime)
                    }
                    return n
                }, r.toObject = function(t, n) {
                    n || (n = {});
                    var i = {};
                    if ((n.arrays || n.defaults) && (i.blocksizes = []), n.defaults) {
                        if (i.Type = n.enums === String ? "Raw" : 0, n.bytes === String ? i.Data = "" : (i.Data = [], n.bytes !== Array && (i.Data = Z.newBuffer(i.Data))), Z.Long) {
                            var s = new Z.Long(0, 0, !0);
                            i.filesize = n.longs === String ? s.toString() : n.longs === Number ? s.toNumber() : s
                        } else i.filesize = n.longs === String ? "0" : 0;
                        if (Z.Long) {
                            var s = new Z.Long(0, 0, !0);
                            i.hashType = n.longs === String ? s.toString() : n.longs === Number ? s.toNumber() : s
                        } else i.hashType = n.longs === String ? "0" : 0;
                        if (Z.Long) {
                            var s = new Z.Long(0, 0, !0);
                            i.fanout = n.longs === String ? s.toString() : n.longs === Number ? s.toNumber() : s
                        } else i.fanout = n.longs === String ? "0" : 0;
                        i.mode = 0, i.mtime = null
                    }
                    if (t.Type != null && t.hasOwnProperty("Type") && (i.Type = n.enums === String ? Le.Data.DataType[t.Type] : t.Type), t.Data != null && t.hasOwnProperty("Data") && (i.Data = n.bytes === String ? Z.base64.encode(t.Data, 0, t.Data.length) : n.bytes === Array ? Array.prototype.slice.call(t.Data) : t.Data), t.filesize != null && t.hasOwnProperty("filesize") && (typeof t.filesize == "number" ? i.filesize = n.longs === String ? String(t.filesize) : t.filesize : i.filesize = n.longs === String ? Z.Long.prototype.toString.call(t.filesize) : n.longs === Number ? new Z.LongBits(t.filesize.low >>> 0, t.filesize.high >>> 0).toNumber(!0) : t.filesize), t.blocksizes && t.blocksizes.length) {
                        i.blocksizes = [];
                        for (var a = 0; a < t.blocksizes.length; ++a) typeof t.blocksizes[a] == "number" ? i.blocksizes[a] = n.longs === String ? String(t.blocksizes[a]) : t.blocksizes[a] : i.blocksizes[a] = n.longs === String ? Z.Long.prototype.toString.call(t.blocksizes[a]) : n.longs === Number ? new Z.LongBits(t.blocksizes[a].low >>> 0, t.blocksizes[a].high >>> 0).toNumber(!0) : t.blocksizes[a]
                    }
                    return t.hashType != null && t.hasOwnProperty("hashType") && (typeof t.hashType == "number" ? i.hashType = n.longs === String ? String(t.hashType) : t.hashType : i.hashType = n.longs === String ? Z.Long.prototype.toString.call(t.hashType) : n.longs === Number ? new Z.LongBits(t.hashType.low >>> 0, t.hashType.high >>> 0).toNumber(!0) : t.hashType), t.fanout != null && t.hasOwnProperty("fanout") && (typeof t.fanout == "number" ? i.fanout = n.longs === String ? String(t.fanout) : t.fanout : i.fanout = n.longs === String ? Z.Long.prototype.toString.call(t.fanout) : n.longs === Number ? new Z.LongBits(t.fanout.low >>> 0, t.fanout.high >>> 0).toNumber(!0) : t.fanout), t.mode != null && t.hasOwnProperty("mode") && (i.mode = t.mode), t.mtime != null && t.hasOwnProperty("mtime") && (i.mtime = Le.UnixTime.toObject(t.mtime, n)), i
                }, r.prototype.toJSON = function() {
                    return this.constructor.toObject(this, Kt.util.toJSONOptions)
                }, r.DataType = function() {
                    var e = {},
                        t = Object.create(e);
                    return t[e[0] = "Raw"] = 0, t[e[1] = "Directory"] = 1, t[e[2] = "File"] = 2, t[e[3] = "Metadata"] = 3, t[e[4] = "Symlink"] = 4, t[e[5] = "HAMTShard"] = 5, t
                }(), r
            }();
            Le.UnixTime = function() {
                function r(e) {
                    if (e)
                        for (var t = Object.keys(e), n = 0; n < t.length; ++n) e[t[n]] != null && (this[t[n]] = e[t[n]])
                }
                return r.prototype.Seconds = Z.Long ? Z.Long.fromBits(0, 0, !1) : 0, r.prototype.FractionalNanoseconds = 0, r.encode = function(t, n) {
                    return n || (n = na.create()), n.uint32(8).int64(t.Seconds), t.FractionalNanoseconds != null && Object.hasOwnProperty.call(t, "FractionalNanoseconds") && n.uint32(21).fixed32(t.FractionalNanoseconds), n
                }, r.decode = function(t, n) {
                    t instanceof Yr || (t = Yr.create(t));
                    for (var i = n === void 0 ? t.len : t.pos + n, s = new Le.UnixTime; t.pos < i;) {
                        var a = t.uint32();
                        switch (a >>> 3) {
                            case 1:
                                s.Seconds = t.int64();
                                break;
                            case 2:
                                s.FractionalNanoseconds = t.fixed32();
                                break;
                            default:
                                t.skipType(a & 7);
                                break
                        }
                    }
                    if (!s.hasOwnProperty("Seconds")) throw Z.ProtocolError("missing required 'Seconds'", {
                        instance: s
                    });
                    return s
                }, r.fromObject = function(t) {
                    if (t instanceof Le.UnixTime) return t;
                    var n = new Le.UnixTime;
                    return t.Seconds != null && (Z.Long ? (n.Seconds = Z.Long.fromValue(t.Seconds)).unsigned = !1 : typeof t.Seconds == "string" ? n.Seconds = parseInt(t.Seconds, 10) : typeof t.Seconds == "number" ? n.Seconds = t.Seconds : typeof t.Seconds == "object" && (n.Seconds = new Z.LongBits(t.Seconds.low >>> 0, t.Seconds.high >>> 0).toNumber())), t.FractionalNanoseconds != null && (n.FractionalNanoseconds = t.FractionalNanoseconds >>> 0), n
                }, r.toObject = function(t, n) {
                    n || (n = {});
                    var i = {};
                    if (n.defaults) {
                        if (Z.Long) {
                            var s = new Z.Long(0, 0, !1);
                            i.Seconds = n.longs === String ? s.toString() : n.longs === Number ? s.toNumber() : s
                        } else i.Seconds = n.longs === String ? "0" : 0;
                        i.FractionalNanoseconds = 0
                    }
                    return t.Seconds != null && t.hasOwnProperty("Seconds") && (typeof t.Seconds == "number" ? i.Seconds = n.longs === String ? String(t.Seconds) : t.Seconds : i.Seconds = n.longs === String ? Z.Long.prototype.toString.call(t.Seconds) : n.longs === Number ? new Z.LongBits(t.Seconds.low >>> 0, t.Seconds.high >>> 0).toNumber() : t.Seconds), t.FractionalNanoseconds != null && t.hasOwnProperty("FractionalNanoseconds") && (i.FractionalNanoseconds = t.FractionalNanoseconds), i
                }, r.prototype.toJSON = function() {
                    return this.constructor.toObject(this, Kt.util.toJSONOptions)
                }, r
            }();
            Le.Metadata = function() {
                function r(e) {
                    if (e)
                        for (var t = Object.keys(e), n = 0; n < t.length; ++n) e[t[n]] != null && (this[t[n]] = e[t[n]])
                }
                return r.prototype.MimeType = "", r.encode = function(t, n) {
                    return n || (n = na.create()), t.MimeType != null && Object.hasOwnProperty.call(t, "MimeType") && n.uint32(10).string(t.MimeType), n
                }, r.decode = function(t, n) {
                    t instanceof Yr || (t = Yr.create(t));
                    for (var i = n === void 0 ? t.len : t.pos + n, s = new Le.Metadata; t.pos < i;) {
                        var a = t.uint32();
                        switch (a >>> 3) {
                            case 1:
                                s.MimeType = t.string();
                                break;
                            default:
                                t.skipType(a & 7);
                                break
                        }
                    }
                    return s
                }, r.fromObject = function(t) {
                    if (t instanceof Le.Metadata) return t;
                    var n = new Le.Metadata;
                    return t.MimeType != null && (n.MimeType = String(t.MimeType)), n
                }, r.toObject = function(t, n) {
                    n || (n = {});
                    var i = {};
                    return n.defaults && (i.MimeType = ""), t.MimeType != null && t.hasOwnProperty("MimeType") && (i.MimeType = t.MimeType), i
                }, r.prototype.toJSON = function() {
                    return this.constructor.toObject(this, Kt.util.toJSONOptions)
                }, r
            }();
            G0.exports = Le
        });
        var Ti = h((AN, V0) => {
            "use strict";
            var {
                Data: Dt
            } = $0(), ia = sr(), W0 = ["raw", "directory", "file", "metadata", "symlink", "hamt-sharded-directory"], Rw = ["directory", "hamt-sharded-directory"], Y0 = parseInt("0644", 8), K0 = parseInt("0755", 8);

            function Ai(r) {
                if (r != null) return typeof r == "number" ? r & 4095 : (r = r.toString(), r.substring(0, 1) === "0" ? parseInt(r, 8) & 4095 : parseInt(r, 10) & 4095)
            }

            function sa(r) {
                if (r == null) return;
                let e;
                if (r.secs != null && (e = {
                        secs: r.secs,
                        nsecs: r.nsecs
                    }), r.Seconds != null && (e = {
                        secs: r.Seconds,
                        nsecs: r.FractionalNanoseconds
                    }), Array.isArray(r) && (e = {
                        secs: r[0],
                        nsecs: r[1]
                    }), r instanceof Date) {
                    let t = r.getTime(),
                        n = Math.floor(t / 1e3);
                    e = {
                        secs: n,
                        nsecs: (t - n * 1e3) * 1e3
                    }
                }
                if (!!Object.prototype.hasOwnProperty.call(e, "secs")) {
                    if (e != null && e.nsecs != null && (e.nsecs < 0 || e.nsecs > 999999999)) throw ia(new Error("mtime-nsecs must be within the range [0,999999999]"), "ERR_INVALID_MTIME_NSECS");
                    return e
                }
            }
            var Ii = class {
                static unmarshal(e) {
                    let t = Dt.decode(e),
                        n = Dt.toObject(t, {
                            defaults: !1,
                            arrays: !0,
                            longs: Number,
                            objects: !1
                        }),
                        i = new Ii({
                            type: W0[n.Type],
                            data: n.Data,
                            blockSizes: n.blocksizes,
                            mode: n.mode,
                            mtime: n.mtime ? {
                                secs: n.mtime.Seconds,
                                nsecs: n.mtime.FractionalNanoseconds
                            } : void 0
                        });
                    return i._originalMode = n.mode || 0, i
                }
                constructor(e = {
                    type: "file"
                }) {
                    let {
                        type: t,
                        data: n,
                        blockSizes: i,
                        hashType: s,
                        fanout: a,
                        mtime: f,
                        mode: u
                    } = e;
                    if (t && !W0.includes(t)) throw ia(new Error("Type: " + t + " is not valid"), "ERR_INVALID_TYPE");
                    this.type = t || "file", this.data = n, this.hashType = s, this.fanout = a, this.blockSizes = i || [], this._originalMode = 0, this.mode = Ai(u), f && (this.mtime = sa(f), this.mtime && !this.mtime.nsecs && (this.mtime.nsecs = 0))
                }
                set mode(e) {
                    this._mode = this.isDirectory() ? K0 : Y0;
                    let t = Ai(e);
                    t !== void 0 && (this._mode = t)
                }
                get mode() {
                    return this._mode
                }
                isDirectory() {
                    return Boolean(this.type && Rw.includes(this.type))
                }
                addBlockSize(e) {
                    this.blockSizes.push(e)
                }
                removeBlockSize(e) {
                    this.blockSizes.splice(e, 1)
                }
                fileSize() {
                    if (this.isDirectory()) return 0;
                    let e = 0;
                    return this.blockSizes.forEach(t => {
                        e += t
                    }), this.data && (e += this.data.length), e
                }
                marshal() {
                    let e;
                    switch (this.type) {
                        case "raw":
                            e = Dt.DataType.Raw;
                            break;
                        case "directory":
                            e = Dt.DataType.Directory;
                            break;
                        case "file":
                            e = Dt.DataType.File;
                            break;
                        case "metadata":
                            e = Dt.DataType.Metadata;
                            break;
                        case "symlink":
                            e = Dt.DataType.Symlink;
                            break;
                        case "hamt-sharded-directory":
                            e = Dt.DataType.HAMTShard;
                            break;
                        default:
                            throw ia(new Error("Type: " + e + " is not valid"), "ERR_INVALID_TYPE")
                    }
                    let t = this.data;
                    (!this.data || !this.data.length) && (t = void 0);
                    let n;
                    this.mode != null && (n = this._originalMode & 4294963200 | (Ai(this.mode) || 0), n === Y0 && !this.isDirectory() && (n = void 0), n === K0 && this.isDirectory() && (n = void 0));
                    let i;
                    if (this.mtime != null) {
                        let a = sa(this.mtime);
                        a && (i = {
                            Seconds: a.secs,
                            FractionalNanoseconds: a.nsecs
                        }, i.FractionalNanoseconds === 0 && delete i.FractionalNanoseconds)
                    }
                    let s = {
                        Type: e,
                        Data: t,
                        filesize: this.isDirectory() ? void 0 : this.fileSize(),
                        blocksizes: this.blockSizes,
                        hashType: this.hashType,
                        fanout: this.fanout,
                        mode: n,
                        mtime: i
                    };
                    return Dt.encode(s).finish()
                }
            };
            V0.exports = {
                UnixFS: Ii,
                parseMode: Ai,
                parseMtime: sa
            }
        });
        var rf = h((IN, X0) => {
            "use strict";
            var Dw = sr(),
                Mw = zs(),
                zw = Ms(),
                J0 = js(),
                {
                    isBytes: Z0,
                    isBlob: Q0,
                    isReadableStream: ef,
                    isFileObject: tf
                } = Hs(),
                {
                    parseMtime: Hw,
                    parseMode: jw
                } = Ti();
            X0.exports = async function*(e, t) {
                if (e != null) {
                    if (typeof e == "string" || e instanceof String) {
                        yield Kr(e.toString(), t);
                        return
                    }
                    if (Z0(e) || Q0(e)) {
                        yield Kr(e, t);
                        return
                    }
                    if (ef(e) && (e = Mw(e)), Symbol.iterator in e || Symbol.asyncIterator in e) {
                        let n = zw(e),
                            {
                                value: i,
                                done: s
                            } = await n.peek();
                        if (s) {
                            yield*[];
                            return
                        }
                        if (n.push(i), Number.isInteger(i) || Z0(i)) {
                            yield Kr(n, t);
                            return
                        }
                        if (tf(i) || Q0(i) || typeof i == "string" || i instanceof String) {
                            yield* J0(n, a => Kr(a, t));
                            return
                        }
                        if (i[Symbol.iterator] || i[Symbol.asyncIterator] || ef(i)) {
                            yield* J0(n, a => Kr(a, t));
                            return
                        }
                    }
                    if (tf(e)) {
                        yield Kr(e, t);
                        return
                    }
                    throw Dw(new Error("Unexpected input: " + typeof e), "ERR_UNEXPECTED_INPUT")
                }
            };
            async function Kr(r, e) {
                let {
                    path: t,
                    mode: n,
                    mtime: i,
                    content: s
                } = r, a = {
                    path: t || "",
                    mode: jw(n),
                    mtime: Hw(i)
                };
                return s ? a.content = await e(s) : t || (a.content = await e(r)), a
            }
        });
        var sf = h((TN, nf) => {
            "use strict";
            var Gw = Vl(),
                $w = rf();
            nf.exports = r => $w(r, Gw)
        });
        var Ni = h((NN, af) => {
            "use strict";
            af.exports = r => {
                if (r != null) return typeof r == "string" ? r : r.toString(8).padStart(4, "0")
            }
        });
        var xt = h((qN, of ) => {
            "use strict";
            var Vw = sf(),
                Ww = Ni();
            async function Yw(r, e, t = {}) {
                let n = [],
                    i = new FormData,
                    s = 0,
                    a = 0;
                for await (let {
                    content: f,
                    path: u,
                    mode: b,
                    mtime: y
                } of Vw(r)) {
                    let E = "",
                        z = f ? "file" : "dir";
                    s > 0 && (E = `-${s}`);
                    let d = z + E,
                        I = [];
                    if (b != null && I.push(`mode=${Ww(b)}`), y != null) {
                        let {
                            secs: U,
                            nsecs: se
                        } = y;
                        I.push(`mtime=${U}`), se != null && I.push(`mtime-nsecs=${se}`)
                    }
                    if (I.length && (d = `${d}?${I.join("&")}`), f) {
                        i.set(d, f, u != null ? encodeURIComponent(u) : void 0);
                        let U = a + f.size;
                        n.push({
                            name: u,
                            start: a,
                            end: U
                        }), a = U
                    } else if (u != null) i.set(d, new File([""], encodeURIComponent(u), {
                        type: "application/x-directory"
                    }));
                    else throw new Error("path or content or both must be set");
                    s++
                }
                return {
                    total: a,
                    parts: n,
                    headers: t,
                    body: i
                }
            } of .exports = Yw
        });
        var L = h((BN, uf) => {
            "use strict";
            var Kw = Ni(),
                {
                    parseMtime: Xw
                } = Ti();
            uf.exports = ({
                arg: r,
                searchParams: e,
                hashAlg: t,
                mtime: n,
                mode: i,
                ...s
            } = {}) => {
                e && (s = {
                    ...s,
                    ...e
                }), t && (s.hash = t), n != null && (n = Xw(n), s.mtime = n.secs, s.mtimeNsecs = n.nsecs), i != null && (s.mode = Kw(i)), s.timeout && !isNaN(s.timeout) && (s.timeout = `${s.timeout}ms`), r == null ? r = [] : Array.isArray(r) || (r = [r]);
                let a = new URLSearchParams(s);
                return r.forEach(f => a.append("arg", f)), a
            }
        });
        var wt = h((ON, cf) => {
            "use strict";
            var {
                anySignal: Jw
            } = Ps();

            function Zw(r) {
                return r.filter(Boolean)
            }
            cf.exports = (...r) => Jw(Zw(r))
        });
        var aa = h((PN, lf) => {
            "use strict";
            var Qw = J(),
                e4 = Ne(),
                t4 = v(),
                r4 = xt(),
                n4 = L(),
                i4 = wt(),
                {
                    AbortController: s4
                } = Je();
            lf.exports = t4(r => {
                async function* e(t, n = {}) {
                    let i = new s4,
                        s = i4(i.signal, n.signal),
                        {
                            headers: a,
                            body: f,
                            total: u,
                            parts: b
                        } = await r4(t, i, n.headers),
                        [y, E] = typeof n.progress == "function" ? a4(u, b, n.progress) : [void 0, void 0],
                        z = await r.post("add", {
                            searchParams: n4({
                                "stream-channels": !0,
                                ...n,
                                progress: Boolean(y)
                            }),
                            timeout: n.timeout,
                            onUploadProgress: E,
                            signal: s,
                            headers: a,
                            body: f
                        });
                    for await (let d of z.ndjson()) d = e4(d), d.hash !== void 0 ? yield o4(d): y && y(d.bytes || 0, d.name)
                }
                return e
            });
            var a4 = (r, e, t) => e ? [void 0, u4(r, e, t)] : [t, void 0],
                u4 = (r, e, t) => {
                    let n = 0,
                        i = e.length;
                    return ({
                        loaded: s,
                        total: a
                    }) => {
                        let f = Math.floor(s / a * r);
                        for (; n < i;) {
                            let {
                                start: u,
                                end: b,
                                name: y
                            } = e[n];
                            if (f < b) {
                                t(f - u, y);
                                break
                            } else t(b - u, y), n += 1
                        }
                    }
                };

            function o4({
                name: r,
                hash: e,
                size: t,
                mode: n,
                mtime: i,
                mtimeNsecs: s
            }) {
                let a = {
                    path: r,
                    cid: new Qw(e),
                    size: parseInt(t)
                };
                return n != null && (a.mode = parseInt(n, 8)), i != null && (a.mtime = {
                    secs: i,
                    nsecs: s || 0
                }), a
            }
        });
        var qi = h((vN, ff) => {
            "use strict";
            var c4 = async r => {
                let e;
                for await (let t of r) e = t;
                return e
            };
            ff.exports = c4
        });
        var df = h((CN, hf) => {
            "use strict";
            var l4 = aa(),
                f4 = qi(),
                h4 = v();
            hf.exports = r => {
                let e = l4(r);
                return h4(() => {
                    async function t(n, i = {}) {
                        return await f4(e(n, i))
                    }
                    return t
                })(r)
            }
        });
        var bf = h((UN, pf) => {
            "use strict";
            var d4 = J(),
                p4 = v(),
                b4 = L();
            pf.exports = p4(r => {
                async function e(t = {}) {
                    return ((await (await r.post("bitswap/wantlist", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: b4(t),
                        headers: t.headers
                    })).json()).Keys || []).map(i => new d4(i["/"]))
                }
                return e
            })
        });
        var yf = h((FN, gf) => {
            "use strict";
            var mf = J(),
                g4 = v(),
                m4 = L();
            gf.exports = g4(r => {
                async function e(t, n = {}) {
                    return t = typeof t == "string" ? t : new mf(t).toString(), ((await (await r.post("bitswap/wantlist", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: m4({
                            ...n,
                            peer: t
                        }),
                        headers: n.headers
                    })).json()).Keys || []).map(s => new mf(s["/"]))
                }
                return e
            })
        });
        var oa = h((LN, xf) => {
            "use strict";
            var y4 = J(),
                x4 = v(),
                w4 = L();
            xf.exports = x4(r => {
                async function e(t = {}) {
                    let n = await r.post("bitswap/stat", {
                        searchParams: w4(t),
                        timeout: t.timeout,
                        signal: t.signal,
                        headers: t.headers
                    });
                    return S4(await n.json())
                }
                return e
            });

            function S4(r) {
                return {
                    provideBufLen: r.ProvideBufLen,
                    wantlist: (r.Wantlist || []).map(e => new y4(e["/"])),
                    peers: r.Peers || [],
                    blocksReceived: BigInt(r.BlocksReceived),
                    dataReceived: BigInt(r.DataReceived),
                    blocksSent: BigInt(r.BlocksSent),
                    dataSent: BigInt(r.DataSent),
                    dupBlksReceived: BigInt(r.DupBlksReceived),
                    dupDataReceived: BigInt(r.DupDataReceived)
                }
            }
        });
        var Sf = h((RN, wf) => {
            "use strict";
            var k4 = J(),
                E4 = v(),
                _4 = L();
            wf.exports = E4(r => {
                async function e(t, n = {}) {
                    return (await r.post("bitswap/unwant", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: _4({
                            arg: typeof t == "string" ? t : new k4(t).toString(),
                            ...n
                        }),
                        headers: n.headers
                    })).json()
                }
                return e
            })
        });
        var Ef = h((DN, kf) => {
            "use strict";
            kf.exports = r => ({
                wantlist: bf()(r),
                wantlistForPeer: yf()(r),
                stat: oa()(r),
                unwant: Sf()(r)
            })
        });
        var Af = h((MN, _f) => {
            _f.exports = {
                _args: [
                    ["ipld-block@0.11.1", "/Users/alex/Documents/Workspaces/ipfs/js-ipfs"]
                ],
                _from: "ipld-block@0.11.1",
                _id: "ipld-block@0.11.1",
                _inBundle: !1,
                _integrity: "sha512-sDqqLqD5qh4QzGq6ssxLHUCnH4emCf/8F8IwjQM2cjEEIEHMUj57XhNYgmGbemdYPznUhffxFGEHsruh5+HQRw==",
                _location: "/ipld-block",
                _phantomChildren: {},
                _requested: {
                    type: "version",
                    registry: !0,
                    raw: "ipld-block@0.11.1",
                    name: "ipld-block",
                    escapedName: "ipld-block",
                    rawSpec: "0.11.1",
                    saveSpec: null,
                    fetchSpec: "0.11.1"
                },
                _requiredBy: ["/", "/ipfs-bitswap", "/ipfs-repo", "/ipld"],
                _resolved: "https://registry.npmjs.org/ipld-block/-/ipld-block-0.11.1.tgz",
                _spec: "0.11.1",
                _where: "/Users/alex/Documents/Workspaces/ipfs/js-ipfs",
                bugs: {
                    url: "https://github.com/ipld/js-ipld-block/issues"
                },
                contributors: [{
                    name: "David Dias",
                    email: "daviddias.p@gmail.com"
                }, {
                    name: "Volker Mische",
                    email: "volker.mische@gmail.com"
                }, {
                    name: "Friedel Ziegelmayer",
                    email: "dignifiedquire@gmail.com"
                }, {
                    name: "Irakli Gozalishvili",
                    email: "contact@gozala.io"
                }, {
                    name: "achingbrain",
                    email: "alex@achingbrain.net"
                }, {
                    name: "\u1D20\u026A\u1D04\u1D1B\u1D0F\u0280 \u0299\u1D0A\u1D07\u029F\u1D0B\u029C\u1D0F\u029F\u1D0D",
                    email: "victorbjelkholm@gmail.com"
                }, {
                    name: "Alan Shaw",
                    email: "alan.shaw@protocol.ai"
                }, {
                    name: "Charlie",
                    email: "the_charlie_daly@hotmail.co.uk"
                }, {
                    name: "Diogo Silva",
                    email: "fsdiogo@gmail.com"
                }, {
                    name: "Hugo Dias",
                    email: "hugomrdias@gmail.com"
                }, {
                    name: "Mikeal Rogers",
                    email: "mikeal.rogers@gmail.com"
                }, {
                    name: "Richard Littauer",
                    email: "richard.littauer@gmail.com"
                }, {
                    name: "Richard Schneider",
                    email: "makaretu@gmail.com"
                }, {
                    name: "Xmader",
                    email: "xmader@outlook.com"
                }],
                dependencies: {
                    cids: "^1.0.0"
                },
                description: "JavaScript Implementation of IPLD Block",
                devDependencies: {
                    aegir: "^31.0.4",
                    uint8arrays: "^2.1.3"
                },
                engines: {
                    node: ">=6.0.0",
                    npm: ">=3.0.0"
                },
                homepage: "https://github.com/ipld/js-ipld-block#readme",
                keywords: ["IPLD"],
                leadMaintainer: "Volker Mische <volker.mische@gmail.com>",
                license: "MIT",
                main: "src/index.js",
                name: "ipld-block",
                "pre-push": ["lint", "test"],
                repository: {
                    type: "git",
                    url: "git+https://github.com/ipld/js-ipld-block.git"
                },
                scripts: {
                    check: "tsc --noEmit --noErrorTruncation",
                    coverage: "aegir coverage",
                    "coverage-publish": "aegir coverage --provider coveralls",
                    docs: "aegir docs",
                    lint: "aegir lint",
                    prepare: "aegir build --no-bundle",
                    prepublishOnly: "aegir build",
                    release: "aegir release --docs",
                    "release-major": "aegir release --type major --docs",
                    "release-minor": "aegir release --type minor --docs",
                    test: "aegir test",
                    "test:browser": "aegir test --target browser",
                    "test:node": "aegir test --target node"
                },
                types: "dist/src/index.d.ts",
                version: "0.11.1"
            }
        });
        var ua = h((zN, If) => {
            "use strict";
            var A4 = J(),
                {
                    version: I4
                } = Af(),
                Tf = Symbol.for("@ipld/js-ipld-block/block"),
                Nf = {
                    writable: !1,
                    configurable: !1,
                    enumerable: !0
                },
                qf = class {
                    constructor(e, t) {
                        if (!e || !(e instanceof Uint8Array)) throw new Error("first argument  must be a Uint8Array");
                        if (!t || !A4.isCID(t)) throw new Error("second argument must be a CID");
                        this.data = e, this.cid = t, Object.defineProperties(this, {
                            data: Nf,
                            cid: Nf
                        })
                    }
                    get _data() {
                        return N4(), this.data
                    }
                    get _cid() {
                        return T4(), this.cid
                    }
                    get[Symbol.toStringTag]() {
                        return "Block"
                    }
                    get[Tf]() {
                        return !0
                    }
                    static isBlock(e) {
                        return Boolean(e && e[Tf])
                    }
                },
                Bf = (r, e) => {
                    let t = !1;
                    return () => {
                        if (r.test(I4)) t || (t = !0, console.warn(e));
                        else throw new Error(e)
                    }
                },
                T4 = Bf(/^0\.10|^0\.11/, "block._cid is deprecated and will be removed in 0.12 release. Please use block.cid instead"),
                N4 = Bf(/^0\.10|^0.11/, "block._data is deprecated and will be removed in 0.12 release. Please use block.data instead");
            If.exports = qf
        });
        var ca = h((HN, Of) => {
            "use strict";
            var q4 = ua(),
                B4 = J(),
                O4 = v(),
                P4 = L();
            Of.exports = O4(r => {
                async function e(t, n = {}) {
                    t = new B4(t);
                    let i = await r.post("block/get", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: P4({
                            arg: t.toString(),
                            ...n
                        }),
                        headers: n.headers
                    });
                    return new q4(new Uint8Array(await i.arrayBuffer()), t)
                }
                return e
            })
        });
        var Cf = h((jN, Pf) => {
            "use strict";
            var vf = J(),
                v4 = v(),
                C4 = L();
            Pf.exports = v4(r => {
                async function e(t, n = {}) {
                    let s = await (await r.post("block/stat", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: C4({
                            arg: new vf(t).toString(),
                            ...n
                        }),
                        headers: n.headers
                    })).json();
                    return {
                        cid: new vf(s.Key),
                        size: s.Size
                    }
                }
                return e
            })
        });
        var Df = h((GN, Uf) => {
            "use strict";
            var Ff = ua(),
                Lf = J(),
                Rf = Gt(),
                U4 = xt(),
                F4 = v(),
                L4 = L(),
                R4 = wt(),
                {
                    AbortController: D4
                } = Je();
            Uf.exports = F4(r => {
                async function e(t, n = {}) {
                    if (Ff.isBlock(t)) {
                        let {
                            name: f,
                            length: u
                        } = Rf.decode(t.cid.multihash);
                        n = {
                            ...n,
                            format: t.cid.codec,
                            mhtype: f,
                            mhlen: u,
                            version: t.cid.version
                        }, t = t.data
                    } else if (n.cid) {
                        let f = new Lf(n.cid),
                            {
                                name: u,
                                length: b
                            } = Rf.decode(f.multihash);
                        n = {
                            ...n,
                            format: f.codec,
                            mhtype: u,
                            mhlen: b,
                            version: f.version
                        }, delete n.cid
                    }
                    let i = new D4,
                        s = R4(i.signal, n.signal),
                        a;
                    try {
                        a = await (await r.post("block/put", {
                            timeout: n.timeout,
                            signal: s,
                            searchParams: L4(n),
                            ...await U4(t, i, n.headers)
                        })).json()
                    } catch (f) {
                        if (n.format === "dag-pb") return e(t, {
                            ...n,
                            format: "protobuf"
                        });
                        if (n.format === "dag-cbor") return e(t, {
                            ...n,
                            format: "cbor"
                        });
                        throw f
                    }
                    return new Ff(t, new Lf(a.Key))
                }
                return e
            })
        });
        var Hf = h(($N, Mf) => {
            "use strict";
            var zf = J(),
                M4 = v(),
                z4 = L();
            Mf.exports = M4(r => {
                async function* e(t, n = {}) {
                    Array.isArray(t) || (t = [t]);
                    let i = await r.post("block/rm", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: z4({
                            arg: t.map(s => new zf(s).toString()),
                            "stream-channels": !0,
                            ...n
                        }),
                        headers: n.headers
                    });
                    for await (let s of i.ndjson()) yield H4(s)
                }
                return e
            });

            function H4(r) {
                let e = {
                    cid: new zf(r.Hash)
                };
                return r.Error && (e.error = new Error(r.Error)), e
            }
        });
        var Gf = h((VN, jf) => {
            "use strict";
            jf.exports = r => ({
                get: ca()(r),
                stat: Cf()(r),
                put: Df()(r),
                rm: Hf()(r)
            })
        });
        var Vf = h((WN, $f) => {
            "use strict";
            var j4 = v(),
                G4 = L(),
                {
                    Multiaddr: $4
                } = Pe();
            $f.exports = j4(r => {
                async function e(t, n = {}) {
                    let i = await r.post("bootstrap/add", {
                            timeout: n.timeout,
                            signal: n.signal,
                            searchParams: G4({
                                arg: t,
                                ...n
                            }),
                            headers: n.headers
                        }),
                        {
                            Peers: s
                        } = await i.json();
                    return {
                        Peers: s.map(a => new $4(a))
                    }
                }
                return e
            })
        });
        var Yf = h((YN, Wf) => {
            "use strict";
            var V4 = v(),
                W4 = L(),
                {
                    Multiaddr: Y4
                } = Pe();
            Wf.exports = V4(r => {
                async function e(t = {}) {
                    let n = await r.post("bootstrap/rm", {
                            timeout: t.timeout,
                            signal: t.signal,
                            searchParams: W4({
                                ...t,
                                all: !0
                            }),
                            headers: t.headers
                        }),
                        {
                            Peers: i
                        } = await n.json();
                    return {
                        Peers: i.map(s => new Y4(s))
                    }
                }
                return e
            })
        });
        var Xf = h((KN, Kf) => {
            "use strict";
            var K4 = v(),
                X4 = L(),
                {
                    Multiaddr: J4
                } = Pe();
            Kf.exports = K4(r => {
                async function e(t, n = {}) {
                    let i = await r.post("bootstrap/rm", {
                            timeout: n.timeout,
                            signal: n.signal,
                            searchParams: X4({
                                arg: t,
                                ...n
                            }),
                            headers: n.headers
                        }),
                        {
                            Peers: s
                        } = await i.json();
                    return {
                        Peers: s.map(a => new J4(a))
                    }
                }
                return e
            })
        });
        var Zf = h((XN, Jf) => {
            "use strict";
            var Z4 = v(),
                Q4 = L(),
                {
                    Multiaddr: e6
                } = Pe();
            Jf.exports = Z4(r => {
                async function e(t = {}) {
                    let n = await r.post("bootstrap/add", {
                            timeout: t.timeout,
                            signal: t.signal,
                            searchParams: Q4({
                                ...t,
                                default: !0
                            }),
                            headers: t.headers
                        }),
                        {
                            Peers: i
                        } = await n.json();
                    return {
                        Peers: i.map(s => new e6(s))
                    }
                }
                return e
            })
        });
        var eh = h((JN, Qf) => {
            "use strict";
            var t6 = v(),
                r6 = L(),
                {
                    Multiaddr: n6
                } = Pe();
            Qf.exports = t6(r => {
                async function e(t = {}) {
                    let n = await r.post("bootstrap/list", {
                            timeout: t.timeout,
                            signal: t.signal,
                            searchParams: r6(t),
                            headers: t.headers
                        }),
                        {
                            Peers: i
                        } = await n.json();
                    return {
                        Peers: i.map(s => new n6(s))
                    }
                }
                return e
            })
        });
        var rh = h((ZN, th) => {
            "use strict";
            th.exports = r => ({
                add: Vf()(r),
                clear: Yf()(r),
                rm: Xf()(r),
                reset: Zf()(r),
                list: eh()(r)
            })
        });
        var ih = h((QN, nh) => {
            "use strict";
            var i6 = J(),
                s6 = v(),
                a6 = L();
            nh.exports = s6(r => {
                async function* e(t, n = {}) {
                    yield*(await r.post("cat", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: a6({
                            arg: typeof t == "string" ? t : new i6(t).toString(),
                            ...n
                        }),
                        headers: n.headers
                    })).iterator()
                }
                return e
            })
        });
        var ah = h((eq, sh) => {
            "use strict";
            var o6 = v(),
                u6 = L();
            sh.exports = o6(r => async (t = {}) => (await r.post("commands", {
                timeout: t.timeout,
                signal: t.signal,
                searchParams: u6(t),
                headers: t.headers
            })).json())
        });
        var uh = h((tq, oh) => {
            "use strict";
            var c6 = v(),
                l6 = L();
            oh.exports = c6(r => async (t = {}) => await (await r.post("config/show", {
                timeout: t.timeout,
                signal: t.signal,
                searchParams: l6({
                    ...t
                }),
                headers: t.headers
            })).json())
        });
        var lh = h((rq, ch) => {
            "use strict";
            var f6 = v(),
                h6 = L();
            ch.exports = f6(r => async (t, n = {}) => {
                if (!t) throw new Error("key argument is required");
                return (await (await r.post("config", {
                    timeout: n.timeout,
                    signal: n.signal,
                    searchParams: h6({
                        arg: t,
                        ...n
                    }),
                    headers: n.headers
                })).json()).Value
            })
        });
        var hh = h((nq, fh) => {
            "use strict";
            var d6 = v(),
                p6 = L();
            fh.exports = d6(r => async (t, n, i = {}) => {
                if (typeof t != "string") throw new Error("Invalid key type");
                let s = {
                    ...i,
                    ...b6(t, n)
                };
                await (await r.post("config", {
                    timeout: i.timeout,
                    signal: i.signal,
                    searchParams: p6(s),
                    headers: i.headers
                })).text()
            });
            var b6 = (r, e) => {
                switch (typeof e) {
                    case "boolean":
                        return {
                            arg: [r, e.toString()], bool: !0
                        };
                    case "string":
                        return {
                            arg: [r, e]
                        };
                    default:
                        return {
                            arg: [r, JSON.stringify(e)], json: !0
                        }
                }
            }
        });
        var ph = h((iq, dh) => {
            "use strict";
            var g6 = et(),
                m6 = xt(),
                y6 = v(),
                x6 = L(),
                w6 = wt(),
                {
                    AbortController: S6
                } = Je();
            dh.exports = y6(r => async (t, n = {}) => {
                let i = new S6,
                    s = w6(i.signal, n.signal);
                await (await r.post("config/replace", {
                    timeout: n.timeout,
                    signal: s,
                    searchParams: x6(n),
                    ...await m6(g6(JSON.stringify(t)), i, n.headers)
                })).text()
            })
        });
        var gh = h((sq, bh) => {
            "use strict";
            var k6 = v(),
                E6 = L();
            bh.exports = k6(r => {
                async function e(t, n = {}) {
                    let s = await (await r.post("config/profile/apply", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: E6({
                            arg: t,
                            ...n
                        }),
                        headers: n.headers
                    })).json();
                    return {
                        original: s.OldCfg,
                        updated: s.NewCfg
                    }
                }
                return e
            })
        });
        var yh = h((aq, mh) => {
            "use strict";
            var _6 = Ne(),
                A6 = v(),
                I6 = L();
            mh.exports = A6(r => {
                async function e(t = {}) {
                    return (await (await r.post("config/profile/list", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: I6(t),
                        headers: t.headers
                    })).json()).map(s => _6(s))
                }
                return e
            })
        });
        var wh = h((oq, xh) => {
            "use strict";
            xh.exports = r => ({
                apply: gh()(r),
                list: yh()(r)
            })
        });
        var kh = h((uq, Sh) => {
            "use strict";
            Sh.exports = r => ({
                getAll: uh()(r),
                get: lh()(r),
                set: hh()(r),
                replace: ph()(r),
                profiles: wh()(r)
            })
        });
        var la = h((cq, Eh) => {
            "use strict";
            var cr = _i(),
                Bi = cr.Reader,
                _h = cr.Writer,
                qe = cr.util,
                rt = cr.roots.default || (cr.roots.default = {});
            rt.PBLink = function() {
                function r(e) {
                    if (e)
                        for (var t = Object.keys(e), n = 0; n < t.length; ++n) e[t[n]] != null && (this[t[n]] = e[t[n]])
                }
                return r.prototype.Hash = qe.newBuffer([]), r.prototype.Name = "", r.prototype.Tsize = qe.Long ? qe.Long.fromBits(0, 0, !0) : 0, r.encode = function(t, n) {
                    return n || (n = _h.create()), t.Hash != null && Object.hasOwnProperty.call(t, "Hash") && n.uint32(10).bytes(t.Hash), t.Name != null && Object.hasOwnProperty.call(t, "Name") && n.uint32(18).string(t.Name), t.Tsize != null && Object.hasOwnProperty.call(t, "Tsize") && n.uint32(24).uint64(t.Tsize), n
                }, r.decode = function(t, n) {
                    t instanceof Bi || (t = Bi.create(t));
                    for (var i = n === void 0 ? t.len : t.pos + n, s = new rt.PBLink; t.pos < i;) {
                        var a = t.uint32();
                        switch (a >>> 3) {
                            case 1:
                                s.Hash = t.bytes();
                                break;
                            case 2:
                                s.Name = t.string();
                                break;
                            case 3:
                                s.Tsize = t.uint64();
                                break;
                            default:
                                t.skipType(a & 7);
                                break
                        }
                    }
                    return s
                }, r.fromObject = function(t) {
                    if (t instanceof rt.PBLink) return t;
                    var n = new rt.PBLink;
                    return t.Hash != null && (typeof t.Hash == "string" ? qe.base64.decode(t.Hash, n.Hash = qe.newBuffer(qe.base64.length(t.Hash)), 0) : t.Hash.length && (n.Hash = t.Hash)), t.Name != null && (n.Name = String(t.Name)), t.Tsize != null && (qe.Long ? (n.Tsize = qe.Long.fromValue(t.Tsize)).unsigned = !0 : typeof t.Tsize == "string" ? n.Tsize = parseInt(t.Tsize, 10) : typeof t.Tsize == "number" ? n.Tsize = t.Tsize : typeof t.Tsize == "object" && (n.Tsize = new qe.LongBits(t.Tsize.low >>> 0, t.Tsize.high >>> 0).toNumber(!0))), n
                }, r.toObject = function(t, n) {
                    n || (n = {});
                    var i = {};
                    if (n.defaults)
                        if (n.bytes === String ? i.Hash = "" : (i.Hash = [], n.bytes !== Array && (i.Hash = qe.newBuffer(i.Hash))), i.Name = "", qe.Long) {
                            var s = new qe.Long(0, 0, !0);
                            i.Tsize = n.longs === String ? s.toString() : n.longs === Number ? s.toNumber() : s
                        } else i.Tsize = n.longs === String ? "0" : 0;
                    return t.Hash != null && t.hasOwnProperty("Hash") && (i.Hash = n.bytes === String ? qe.base64.encode(t.Hash, 0, t.Hash.length) : n.bytes === Array ? Array.prototype.slice.call(t.Hash) : t.Hash), t.Name != null && t.hasOwnProperty("Name") && (i.Name = t.Name), t.Tsize != null && t.hasOwnProperty("Tsize") && (typeof t.Tsize == "number" ? i.Tsize = n.longs === String ? String(t.Tsize) : t.Tsize : i.Tsize = n.longs === String ? qe.Long.prototype.toString.call(t.Tsize) : n.longs === Number ? new qe.LongBits(t.Tsize.low >>> 0, t.Tsize.high >>> 0).toNumber(!0) : t.Tsize), i
                }, r.prototype.toJSON = function() {
                    return this.constructor.toObject(this, cr.util.toJSONOptions)
                }, r
            }();
            rt.PBNode = function() {
                function r(e) {
                    if (this.Links = [], e)
                        for (var t = Object.keys(e), n = 0; n < t.length; ++n) e[t[n]] != null && (this[t[n]] = e[t[n]])
                }
                return r.prototype.Links = qe.emptyArray, r.prototype.Data = qe.newBuffer([]), r.encode = function(t, n) {
                    if (n || (n = _h.create()), t.Data != null && Object.hasOwnProperty.call(t, "Data") && n.uint32(10).bytes(t.Data), t.Links != null && t.Links.length)
                        for (var i = 0; i < t.Links.length; ++i) rt.PBLink.encode(t.Links[i], n.uint32(18).fork()).ldelim();
                    return n
                }, r.decode = function(t, n) {
                    t instanceof Bi || (t = Bi.create(t));
                    for (var i = n === void 0 ? t.len : t.pos + n, s = new rt.PBNode; t.pos < i;) {
                        var a = t.uint32();
                        switch (a >>> 3) {
                            case 2:
                                s.Links && s.Links.length || (s.Links = []), s.Links.push(rt.PBLink.decode(t, t.uint32()));
                                break;
                            case 1:
                                s.Data = t.bytes();
                                break;
                            default:
                                t.skipType(a & 7);
                                break
                        }
                    }
                    return s
                }, r.fromObject = function(t) {
                    if (t instanceof rt.PBNode) return t;
                    var n = new rt.PBNode;
                    if (t.Links) {
                        if (!Array.isArray(t.Links)) throw TypeError(".PBNode.Links: array expected");
                        n.Links = [];
                        for (var i = 0; i < t.Links.length; ++i) {
                            if (typeof t.Links[i] != "object") throw TypeError(".PBNode.Links: object expected");
                            n.Links[i] = rt.PBLink.fromObject(t.Links[i])
                        }
                    }
                    return t.Data != null && (typeof t.Data == "string" ? qe.base64.decode(t.Data, n.Data = qe.newBuffer(qe.base64.length(t.Data)), 0) : t.Data.length && (n.Data = t.Data)), n
                }, r.toObject = function(t, n) {
                    n || (n = {});
                    var i = {};
                    if ((n.arrays || n.defaults) && (i.Links = []), n.defaults && (n.bytes === String ? i.Data = "" : (i.Data = [], n.bytes !== Array && (i.Data = qe.newBuffer(i.Data)))), t.Data != null && t.hasOwnProperty("Data") && (i.Data = n.bytes === String ? qe.base64.encode(t.Data, 0, t.Data.length) : n.bytes === Array ? Array.prototype.slice.call(t.Data) : t.Data), t.Links && t.Links.length) {
                        i.Links = [];
                        for (var s = 0; s < t.Links.length; ++s) i.Links[s] = rt.PBLink.toObject(t.Links[s], n)
                    }
                    return i
                }, r.prototype.toJSON = function() {
                    return this.constructor.toObject(this, cr.util.toJSONOptions)
                }, r
            }();
            Eh.exports = rt
        });
        var lr = h((lq, Ah) => {
            "use strict";
            var T6 = J(),
                N6 = et(),
                Ih = class {
                    constructor(e, t, n) {
                        if (!n) throw new Error("A link requires a cid to point to");
                        this.Name = e || "", this.Tsize = t, this.Hash = new T6(n), Object.defineProperties(this, {
                            _nameBuf: {
                                value: null,
                                writable: !0,
                                enumerable: !1
                            }
                        })
                    }
                    toString() {
                        return `DAGLink <${this.Hash.toBaseEncodedString()} - name: "${this.Name}", size: ${this.Tsize}>`
                    }
                    toJSON() {
                        return this._json || (this._json = Object.freeze({
                            name: this.Name,
                            size: this.Tsize,
                            cid: this.Hash.toBaseEncodedString()
                        })), Object.assign({}, this._json)
                    }
                    get nameAsBuffer() {
                        return this._nameBuf != null ? this._nameBuf : (this._nameBuf = N6(this.Name), this._nameBuf)
                    }
                };
            Ah.exports = Ih
        });
        var Th = h((fa, ha) => {
            (function(r, e) {
                typeof fa == "object" && typeof ha != "undefined" ? ha.exports = e() : typeof define == "function" && define.amd ? define(e) : r.stable = e()
            })(fa, function() {
                "use strict";
                var r = function(n, i) {
                    return e(n.slice(), i)
                };
                r.inplace = function(n, i) {
                    var s = e(n, i);
                    return s !== n && t(s, null, n.length, n), n
                };

                function e(n, i) {
                    typeof i != "function" && (i = function(b, y) {
                        return String(b).localeCompare(y)
                    });
                    var s = n.length;
                    if (s <= 1) return n;
                    for (var a = new Array(s), f = 1; f < s; f *= 2) {
                        t(n, i, f, a);
                        var u = n;
                        n = a, a = u
                    }
                    return n
                }
                var t = function(n, i, s, a) {
                    var f = n.length,
                        u = 0,
                        b = s * 2,
                        y, E, z, d, I;
                    for (y = 0; y < f; y += b)
                        for (E = y + s, z = E + s, E > f && (E = f), z > f && (z = f), d = y, I = E;;)
                            if (d < E && I < z) i(n[d], n[I]) <= 0 ? a[u++] = n[d++] : a[u++] = n[I++];
                            else if (d < E) a[u++] = n[d++];
                    else if (I < z) a[u++] = n[I++];
                    else break
                };
                return r
            })
        });
        var qh = h((fq, Nh) => {
            "use strict";

            function q6(r, e) {
                for (let t = 0; t < r.byteLength; t++) {
                    if (r[t] < e[t]) return -1;
                    if (r[t] > e[t]) return 1
                }
                return r.byteLength > e.byteLength ? 1 : r.byteLength < e.byteLength ? -1 : 0
            }
            Nh.exports = q6
        });
        var da = h((hq, Bh) => {
            "use strict";
            var B6 = Th(),
                O6 = qh(),
                P6 = (r, e) => {
                    let t = r.nameAsBuffer,
                        n = e.nameAsBuffer;
                    return O6(t, n)
                },
                v6 = r => {
                    B6.inplace(r, P6)
                };
            Bh.exports = v6
        });
        var pa = h((dq, Oh) => {
            "use strict";
            var C6 = lr();

            function U6(r) {
                return new C6(r.Name || r.name || "", r.Tsize || r.Size || r.size || 0, r.Hash || r.hash || r.multihash || r.cid)
            }
            Oh.exports = {
                createDagLinkFromB58EncodedHash: U6
            }
        });
        var ba = h((pq, Ph) => {
            "use strict";
            var F6 = _i(),
                {
                    PBLink: L6
                } = la(),
                {
                    createDagLinkFromB58EncodedHash: R6
                } = pa(),
                vh = r => {
                    let e = {};
                    return r.Data && r.Data.byteLength > 0 ? e.Data = r.Data : e.Data = null, r.Links && r.Links.length > 0 ? e.Links = r.Links.map(t => ({
                        Hash: t.Hash.bytes,
                        Name: t.Name,
                        Tsize: t.Tsize
                    })) : e.Links = null, e
                },
                D6 = r => Ch(vh(r)),
                M6 = (r, e = []) => {
                    let t = {
                        Data: r,
                        Links: e.map(n => R6(n))
                    };
                    return Ch(vh(t))
                };
            Ph.exports = {
                serializeDAGNode: D6,
                serializeDAGNodeLike: M6
            };

            function Ch(r) {
                let e = F6.Writer.create();
                if (r.Links != null)
                    for (let t = 0; t < r.Links.length; t++) L6.encode(r.Links[t], e.uint32(18).fork()).ldelim();
                return r.Data != null && e.uint32(10).bytes(r.Data), e.finish()
            }
        });
        var Uh = h((bq, Oi) => {
            (function() {
                "use strict";
                var r = "input is invalid type",
                    e = "finalize already called",
                    t = typeof window == "object",
                    n = t ? window : {};
                n.JS_SHA3_NO_WINDOW && (t = !1);
                var i = !t && typeof self == "object",
                    s = !n.JS_SHA3_NO_NODE_JS && typeof process == "object" && process.versions && process.versions.node;
                s ? n = globalThis : i && (n = self);
                var a = !n.JS_SHA3_NO_COMMON_JS && typeof Oi == "object" && Oi.exports,
                    f = typeof define == "function" && define.amd,
                    u = !n.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer != "undefined",
                    b = "0123456789abcdef".split(""),
                    y = [31, 7936, 2031616, 520093696],
                    E = [4, 1024, 262144, 67108864],
                    z = [1, 256, 65536, 16777216],
                    d = [6, 1536, 393216, 100663296],
                    I = [0, 8, 16, 24],
                    U = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649, 0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0, 2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771, 2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648, 2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648],
                    se = [224, 256, 384, 512],
                    F = [128, 256],
                    H = ["hex", "buffer", "arrayBuffer", "array", "digest"],
                    V = {
                        "128": 168,
                        "256": 136
                    };
                (n.JS_SHA3_NO_NODE_JS || !Array.isArray) && (Array.isArray = function(c) {
                    return Object.prototype.toString.call(c) === "[object Array]"
                }), u && (n.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView) && (ArrayBuffer.isView = function(c) {
                    return typeof c == "object" && c.buffer && c.buffer.constructor === ArrayBuffer
                });
                for (var $ = function(c, B, C) {
                        return function(o) {
                            return new P(c, B, c).update(o)[C]()
                        }
                    }, D = function(c, B, C) {
                        return function(o, l) {
                            return new P(c, B, l).update(o)[C]()
                        }
                    }, M = function(c, B, C) {
                        return function(o, l, p, m) {
                            return ke["cshake" + c].update(o, l, p, m)[C]()
                        }
                    }, R = function(c, B, C) {
                        return function(o, l, p, m) {
                            return ke["kmac" + c].update(o, l, p, m)[C]()
                        }
                    }, X = function(c, B, C, o) {
                        for (var l = 0; l < H.length; ++l) {
                            var p = H[l];
                            c[p] = B(C, o, p)
                        }
                        return c
                    }, G = function(c, B) {
                        var C = $(c, B, "hex");
                        return C.create = function() {
                            return new P(c, B, c)
                        }, C.update = function(o) {
                            return C.create().update(o)
                        }, X(C, $, c, B)
                    }, be = function(c, B) {
                        var C = D(c, B, "hex");
                        return C.create = function(o) {
                            return new P(c, B, o)
                        }, C.update = function(o, l) {
                            return C.create(l).update(o)
                        }, X(C, D, c, B)
                    }, le = function(c, B) {
                        var C = V[c],
                            o = M(c, B, "hex");
                        return o.create = function(l, p, m) {
                            return !p && !m ? ke["shake" + c].create(l) : new P(c, B, l).bytepad([p, m], C)
                        }, o.update = function(l, p, m, g) {
                            return o.create(p, m, g).update(l)
                        }, X(o, M, c, B)
                    }, pe = function(c, B) {
                        var C = V[c],
                            o = R(c, B, "hex");
                        return o.create = function(l, p, m) {
                            return new Ut(c, B, p).bytepad(["KMAC", m], C).bytepad([l], C)
                        }, o.update = function(l, p, m, g) {
                            return o.create(l, m, g).update(p)
                        }, X(o, R, c, B)
                    }, Y = [{
                        name: "keccak",
                        padding: z,
                        bits: se,
                        createMethod: G
                    }, {
                        name: "sha3",
                        padding: d,
                        bits: se,
                        createMethod: G
                    }, {
                        name: "shake",
                        padding: y,
                        bits: F,
                        createMethod: be
                    }, {
                        name: "cshake",
                        padding: E,
                        bits: F,
                        createMethod: le
                    }, {
                        name: "kmac",
                        padding: E,
                        bits: F,
                        createMethod: pe
                    }], ke = {}, Ue = [], Ae = 0; Ae < Y.length; ++Ae)
                    for (var Me = Y[Ae], Ie = Me.bits, Ge = 0; Ge < Ie.length; ++Ge) {
                        var Ct = Me.name + "_" + Ie[Ge];
                        if (Ue.push(Ct), ke[Ct] = Me.createMethod(Ie[Ge], Me.padding), Me.name !== "sha3") {
                            var ht = Me.name + Ie[Ge];
                            Ue.push(ht), ke[ht] = ke[Ct]
                        }
                    }

                function P(c, B, C) {
                    this.blocks = [], this.s = [], this.padding = B, this.outputBits = C, this.reset = !0, this.finalized = !1, this.block = 0, this.start = 0, this.blockCount = 1600 - (c << 1) >> 5, this.byteCount = this.blockCount << 2, this.outputBlocks = C >> 5, this.extraBytes = (C & 31) >> 3;
                    for (var o = 0; o < 50; ++o) this.s[o] = 0
                }
                P.prototype.update = function(c) {
                    if (this.finalized) throw new Error(e);
                    var B, C = typeof c;
                    if (C !== "string") {
                        if (C === "object") {
                            if (c === null) throw new Error(r);
                            if (u && c.constructor === ArrayBuffer) c = new Uint8Array(c);
                            else if (!Array.isArray(c) && (!u || !ArrayBuffer.isView(c))) throw new Error(r)
                        } else throw new Error(r);
                        B = !0
                    }
                    for (var o = this.blocks, l = this.byteCount, p = c.length, m = this.blockCount, g = 0, A = this.s, _, w; g < p;) {
                        if (this.reset)
                            for (this.reset = !1, o[0] = this.block, _ = 1; _ < m + 1; ++_) o[_] = 0;
                        if (B)
                            for (_ = this.start; g < p && _ < l; ++g) o[_ >> 2] |= c[g] << I[_++ & 3];
                        else
                            for (_ = this.start; g < p && _ < l; ++g) w = c.charCodeAt(g), w < 128 ? o[_ >> 2] |= w << I[_++ & 3] : w < 2048 ? (o[_ >> 2] |= (192 | w >> 6) << I[_++ & 3], o[_ >> 2] |= (128 | w & 63) << I[_++ & 3]) : w < 55296 || w >= 57344 ? (o[_ >> 2] |= (224 | w >> 12) << I[_++ & 3], o[_ >> 2] |= (128 | w >> 6 & 63) << I[_++ & 3], o[_ >> 2] |= (128 | w & 63) << I[_++ & 3]) : (w = 65536 + ((w & 1023) << 10 | c.charCodeAt(++g) & 1023), o[_ >> 2] |= (240 | w >> 18) << I[_++ & 3], o[_ >> 2] |= (128 | w >> 12 & 63) << I[_++ & 3], o[_ >> 2] |= (128 | w >> 6 & 63) << I[_++ & 3], o[_ >> 2] |= (128 | w & 63) << I[_++ & 3]);
                        if (this.lastByteIndex = _, _ >= l) {
                            for (this.start = _ - l, this.block = o[m], _ = 0; _ < m; ++_) A[_] ^= o[_];
                            k(A), this.reset = !0
                        } else this.start = _
                    }
                    return this
                }, P.prototype.encode = function(c, B) {
                    var C = c & 255,
                        o = 1,
                        l = [C];
                    for (c = c >> 8, C = c & 255; C > 0;) l.unshift(C), c = c >> 8, C = c & 255, ++o;
                    return B ? l.push(o) : l.unshift(o), this.update(l), l.length
                }, P.prototype.encodeString = function(c) {
                    var B, C = typeof c;
                    if (C !== "string") {
                        if (C === "object") {
                            if (c === null) throw new Error(r);
                            if (u && c.constructor === ArrayBuffer) c = new Uint8Array(c);
                            else if (!Array.isArray(c) && (!u || !ArrayBuffer.isView(c))) throw new Error(r)
                        } else throw new Error(r);
                        B = !0
                    }
                    var o = 0,
                        l = c.length;
                    if (B) o = l;
                    else
                        for (var p = 0; p < c.length; ++p) {
                            var m = c.charCodeAt(p);
                            m < 128 ? o += 1 : m < 2048 ? o += 2 : m < 55296 || m >= 57344 ? o += 3 : (m = 65536 + ((m & 1023) << 10 | c.charCodeAt(++p) & 1023), o += 4)
                        }
                    return o += this.encode(o * 8), this.update(c), o
                }, P.prototype.bytepad = function(c, B) {
                    for (var C = this.encode(B), o = 0; o < c.length; ++o) C += this.encodeString(c[o]);
                    var l = B - C % B,
                        p = [];
                    return p.length = l, this.update(p), this
                }, P.prototype.finalize = function() {
                    if (!this.finalized) {
                        this.finalized = !0;
                        var c = this.blocks,
                            B = this.lastByteIndex,
                            C = this.blockCount,
                            o = this.s;
                        if (c[B >> 2] |= this.padding[B & 3], this.lastByteIndex === this.byteCount)
                            for (c[0] = c[C], B = 1; B < C + 1; ++B) c[B] = 0;
                        for (c[C - 1] |= 2147483648, B = 0; B < C; ++B) o[B] ^= c[B];
                        k(o)
                    }
                }, P.prototype.toString = P.prototype.hex = function() {
                    this.finalize();
                    for (var c = this.blockCount, B = this.s, C = this.outputBlocks, o = this.extraBytes, l = 0, p = 0, m = "", g; p < C;) {
                        for (l = 0; l < c && p < C; ++l, ++p) g = B[l], m += b[g >> 4 & 15] + b[g & 15] + b[g >> 12 & 15] + b[g >> 8 & 15] + b[g >> 20 & 15] + b[g >> 16 & 15] + b[g >> 28 & 15] + b[g >> 24 & 15];
                        p % c == 0 && (k(B), l = 0)
                    }
                    return o && (g = B[l], m += b[g >> 4 & 15] + b[g & 15], o > 1 && (m += b[g >> 12 & 15] + b[g >> 8 & 15]), o > 2 && (m += b[g >> 20 & 15] + b[g >> 16 & 15])), m
                }, P.prototype.arrayBuffer = function() {
                    this.finalize();
                    var c = this.blockCount,
                        B = this.s,
                        C = this.outputBlocks,
                        o = this.extraBytes,
                        l = 0,
                        p = 0,
                        m = this.outputBits >> 3,
                        g;
                    o ? g = new ArrayBuffer(C + 1 << 2) : g = new ArrayBuffer(m);
                    for (var A = new Uint32Array(g); p < C;) {
                        for (l = 0; l < c && p < C; ++l, ++p) A[p] = B[l];
                        p % c == 0 && k(B)
                    }
                    return o && (A[l] = B[l], g = g.slice(0, m)), g
                }, P.prototype.buffer = P.prototype.arrayBuffer, P.prototype.digest = P.prototype.array = function() {
                    this.finalize();
                    for (var c = this.blockCount, B = this.s, C = this.outputBlocks, o = this.extraBytes, l = 0, p = 0, m = [], g, A; p < C;) {
                        for (l = 0; l < c && p < C; ++l, ++p) g = p << 2, A = B[l], m[g] = A & 255, m[g + 1] = A >> 8 & 255, m[g + 2] = A >> 16 & 255, m[g + 3] = A >> 24 & 255;
                        p % c == 0 && k(B)
                    }
                    return o && (g = p << 2, A = B[l], m[g] = A & 255, o > 1 && (m[g + 1] = A >> 8 & 255), o > 2 && (m[g + 2] = A >> 16 & 255)), m
                };

                function Ut(c, B, C) {
                    P.call(this, c, B, C)
                }
                Ut.prototype = new P, Ut.prototype.finalize = function() {
                    return this.encode(this.outputBits, !0), P.prototype.finalize.call(this)
                };
                var k = function(c) {
                    var B, C, o, l, p, m, g, A, _, w, S, N, T, O, W, j, ne, ge, we, re, oe, Q, dt, _t, At, ze, it, ee, Te, me, pr, br, gr, ye, mr, yr, xr, wr, Sr, pt, fn, hn, dn, pn, _e, bn, gn, mn, kr, Er, _r, Ar, Ee, Ir, Tr, Nr, qr, Br, Or, Pr, vr, he, Cr;
                    for (o = 0; o < 48; o += 2) l = c[0] ^ c[10] ^ c[20] ^ c[30] ^ c[40], p = c[1] ^ c[11] ^ c[21] ^ c[31] ^ c[41], m = c[2] ^ c[12] ^ c[22] ^ c[32] ^ c[42], g = c[3] ^ c[13] ^ c[23] ^ c[33] ^ c[43], A = c[4] ^ c[14] ^ c[24] ^ c[34] ^ c[44], _ = c[5] ^ c[15] ^ c[25] ^ c[35] ^ c[45], w = c[6] ^ c[16] ^ c[26] ^ c[36] ^ c[46], S = c[7] ^ c[17] ^ c[27] ^ c[37] ^ c[47], N = c[8] ^ c[18] ^ c[28] ^ c[38] ^ c[48], T = c[9] ^ c[19] ^ c[29] ^ c[39] ^ c[49], B = N ^ (m << 1 | g >>> 31), C = T ^ (g << 1 | m >>> 31), c[0] ^= B, c[1] ^= C, c[10] ^= B, c[11] ^= C, c[20] ^= B, c[21] ^= C, c[30] ^= B, c[31] ^= C, c[40] ^= B, c[41] ^= C, B = l ^ (A << 1 | _ >>> 31), C = p ^ (_ << 1 | A >>> 31), c[2] ^= B, c[3] ^= C, c[12] ^= B, c[13] ^= C, c[22] ^= B, c[23] ^= C, c[32] ^= B, c[33] ^= C, c[42] ^= B, c[43] ^= C, B = m ^ (w << 1 | S >>> 31), C = g ^ (S << 1 | w >>> 31), c[4] ^= B, c[5] ^= C, c[14] ^= B, c[15] ^= C, c[24] ^= B, c[25] ^= C, c[34] ^= B, c[35] ^= C, c[44] ^= B, c[45] ^= C, B = A ^ (N << 1 | T >>> 31), C = _ ^ (T << 1 | N >>> 31), c[6] ^= B, c[7] ^= C, c[16] ^= B, c[17] ^= C, c[26] ^= B, c[27] ^= C, c[36] ^= B, c[37] ^= C, c[46] ^= B, c[47] ^= C, B = w ^ (l << 1 | p >>> 31), C = S ^ (p << 1 | l >>> 31), c[8] ^= B, c[9] ^= C, c[18] ^= B, c[19] ^= C, c[28] ^= B, c[29] ^= C, c[38] ^= B, c[39] ^= C, c[48] ^= B, c[49] ^= C, O = c[0], W = c[1], bn = c[11] << 4 | c[10] >>> 28, gn = c[10] << 4 | c[11] >>> 28, ee = c[20] << 3 | c[21] >>> 29, Te = c[21] << 3 | c[20] >>> 29, Pr = c[31] << 9 | c[30] >>> 23, vr = c[30] << 9 | c[31] >>> 23, hn = c[40] << 18 | c[41] >>> 14, dn = c[41] << 18 | c[40] >>> 14, ye = c[2] << 1 | c[3] >>> 31, mr = c[3] << 1 | c[2] >>> 31, j = c[13] << 12 | c[12] >>> 20, ne = c[12] << 12 | c[13] >>> 20, mn = c[22] << 10 | c[23] >>> 22, kr = c[23] << 10 | c[22] >>> 22, me = c[33] << 13 | c[32] >>> 19, pr = c[32] << 13 | c[33] >>> 19, he = c[42] << 2 | c[43] >>> 30, Cr = c[43] << 2 | c[42] >>> 30, Ir = c[5] << 30 | c[4] >>> 2, Tr = c[4] << 30 | c[5] >>> 2, yr = c[14] << 6 | c[15] >>> 26, xr = c[15] << 6 | c[14] >>> 26, ge = c[25] << 11 | c[24] >>> 21, we = c[24] << 11 | c[25] >>> 21, Er = c[34] << 15 | c[35] >>> 17, _r = c[35] << 15 | c[34] >>> 17, br = c[45] << 29 | c[44] >>> 3, gr = c[44] << 29 | c[45] >>> 3, _t = c[6] << 28 | c[7] >>> 4, At = c[7] << 28 | c[6] >>> 4, Nr = c[17] << 23 | c[16] >>> 9, qr = c[16] << 23 | c[17] >>> 9, wr = c[26] << 25 | c[27] >>> 7, Sr = c[27] << 25 | c[26] >>> 7, re = c[36] << 21 | c[37] >>> 11, oe = c[37] << 21 | c[36] >>> 11, Ar = c[47] << 24 | c[46] >>> 8, Ee = c[46] << 24 | c[47] >>> 8, pn = c[8] << 27 | c[9] >>> 5, _e = c[9] << 27 | c[8] >>> 5, ze = c[18] << 20 | c[19] >>> 12, it = c[19] << 20 | c[18] >>> 12, Br = c[29] << 7 | c[28] >>> 25, Or = c[28] << 7 | c[29] >>> 25, pt = c[38] << 8 | c[39] >>> 24, fn = c[39] << 8 | c[38] >>> 24, Q = c[48] << 14 | c[49] >>> 18, dt = c[49] << 14 | c[48] >>> 18, c[0] = O ^ ~j & ge, c[1] = W ^ ~ne & we, c[10] = _t ^ ~ze & ee, c[11] = At ^ ~it & Te, c[20] = ye ^ ~yr & wr, c[21] = mr ^ ~xr & Sr, c[30] = pn ^ ~bn & mn, c[31] = _e ^ ~gn & kr, c[40] = Ir ^ ~Nr & Br, c[41] = Tr ^ ~qr & Or, c[2] = j ^ ~ge & re, c[3] = ne ^ ~we & oe, c[12] = ze ^ ~ee & me, c[13] = it ^ ~Te & pr, c[22] = yr ^ ~wr & pt, c[23] = xr ^ ~Sr & fn, c[32] = bn ^ ~mn & Er, c[33] = gn ^ ~kr & _r, c[42] = Nr ^ ~Br & Pr, c[43] = qr ^ ~Or & vr, c[4] = ge ^ ~re & Q, c[5] = we ^ ~oe & dt, c[14] = ee ^ ~me & br, c[15] = Te ^ ~pr & gr, c[24] = wr ^ ~pt & hn, c[25] = Sr ^ ~fn & dn, c[34] = mn ^ ~Er & Ar, c[35] = kr ^ ~_r & Ee, c[44] = Br ^ ~Pr & he, c[45] = Or ^ ~vr & Cr, c[6] = re ^ ~Q & O, c[7] = oe ^ ~dt & W, c[16] = me ^ ~br & _t, c[17] = pr ^ ~gr & At, c[26] = pt ^ ~hn & ye, c[27] = fn ^ ~dn & mr, c[36] = Er ^ ~Ar & pn, c[37] = _r ^ ~Ee & _e, c[46] = Pr ^ ~he & Ir, c[47] = vr ^ ~Cr & Tr, c[8] = Q ^ ~O & j, c[9] = dt ^ ~W & ne, c[18] = br ^ ~_t & ze, c[19] = gr ^ ~At & it, c[28] = hn ^ ~ye & yr, c[29] = dn ^ ~mr & xr, c[38] = Ar ^ ~pn & bn, c[39] = Ee ^ ~_e & gn, c[48] = he ^ ~Ir & Nr, c[49] = Cr ^ ~Tr & qr, c[0] ^= U[o], c[1] ^= U[o + 1]
                };
                if (a) Oi.exports = ke;
                else {
                    for (Ae = 0; Ae < Ue.length; ++Ae) n[Ue[Ae]] = ke[Ue[Ae]];
                    f && define(function() {
                        return ke
                    })
                }
            })()
        });
        var Fh = h((On, Pi) => {
            (function(r, e) {
                "use strict";
                var t = {
                    version: "3.0.0",
                    x86: {},
                    x64: {},
                    inputValidation: !0
                };

                function n(d) {
                    if (!Array.isArray(d) && !ArrayBuffer.isView(d)) return !1;
                    for (var I = 0; I < d.length; I++)
                        if (!Number.isInteger(d[I]) || d[I] < 0 || d[I] > 255) return !1;
                    return !0
                }

                function i(d, I) {
                    return (d & 65535) * I + (((d >>> 16) * I & 65535) << 16)
                }

                function s(d, I) {
                    return d << I | d >>> 32 - I
                }

                function a(d) {
                    return d ^= d >>> 16, d = i(d, 2246822507), d ^= d >>> 13, d = i(d, 3266489909), d ^= d >>> 16, d
                }

                function f(d, I) {
                    d = [d[0] >>> 16, d[0] & 65535, d[1] >>> 16, d[1] & 65535], I = [I[0] >>> 16, I[0] & 65535, I[1] >>> 16, I[1] & 65535];
                    var U = [0, 0, 0, 0];
                    return U[3] += d[3] + I[3], U[2] += U[3] >>> 16, U[3] &= 65535, U[2] += d[2] + I[2], U[1] += U[2] >>> 16, U[2] &= 65535, U[1] += d[1] + I[1], U[0] += U[1] >>> 16, U[1] &= 65535, U[0] += d[0] + I[0], U[0] &= 65535, [U[0] << 16 | U[1], U[2] << 16 | U[3]]
                }

                function u(d, I) {
                    d = [d[0] >>> 16, d[0] & 65535, d[1] >>> 16, d[1] & 65535], I = [I[0] >>> 16, I[0] & 65535, I[1] >>> 16, I[1] & 65535];
                    var U = [0, 0, 0, 0];
                    return U[3] += d[3] * I[3], U[2] += U[3] >>> 16, U[3] &= 65535, U[2] += d[2] * I[3], U[1] += U[2] >>> 16, U[2] &= 65535, U[2] += d[3] * I[2], U[1] += U[2] >>> 16, U[2] &= 65535, U[1] += d[1] * I[3], U[0] += U[1] >>> 16, U[1] &= 65535, U[1] += d[2] * I[2], U[0] += U[1] >>> 16, U[1] &= 65535, U[1] += d[3] * I[1], U[0] += U[1] >>> 16, U[1] &= 65535, U[0] += d[0] * I[3] + d[1] * I[2] + d[2] * I[1] + d[3] * I[0], U[0] &= 65535, [U[0] << 16 | U[1], U[2] << 16 | U[3]]
                }

                function b(d, I) {
                    return I %= 64, I === 32 ? [d[1], d[0]] : I < 32 ? [d[0] << I | d[1] >>> 32 - I, d[1] << I | d[0] >>> 32 - I] : (I -= 32, [d[1] << I | d[0] >>> 32 - I, d[0] << I | d[1] >>> 32 - I])
                }

                function y(d, I) {
                    return I %= 64, I === 0 ? d : I < 32 ? [d[0] << I | d[1] >>> 32 - I, d[1] << I] : [d[1] << I - 32, 0]
                }

                function E(d, I) {
                    return [d[0] ^ I[0], d[1] ^ I[1]]
                }

                function z(d) {
                    return d = E(d, [0, d[0] >>> 1]), d = u(d, [4283543511, 3981806797]), d = E(d, [0, d[0] >>> 1]), d = u(d, [3301882366, 444984403]), d = E(d, [0, d[0] >>> 1]), d
                }
                t.x86.hash32 = function(d, I) {
                    if (t.inputValidation && !n(d)) return e;
                    I = I || 0;
                    for (var U = d.length % 4, se = d.length - U, F = I, H = 0, V = 3432918353, $ = 461845907, D = 0; D < se; D = D + 4) H = d[D] | d[D + 1] << 8 | d[D + 2] << 16 | d[D + 3] << 24, H = i(H, V), H = s(H, 15), H = i(H, $), F ^= H, F = s(F, 13), F = i(F, 5) + 3864292196;
                    switch (H = 0, U) {
                        case 3:
                            H ^= d[D + 2] << 16;
                        case 2:
                            H ^= d[D + 1] << 8;
                        case 1:
                            H ^= d[D], H = i(H, V), H = s(H, 15), H = i(H, $), F ^= H
                    }
                    return F ^= d.length, F = a(F), F >>> 0
                }, t.x86.hash128 = function(d, I) {
                    if (t.inputValidation && !n(d)) return e;
                    I = I || 0;
                    for (var U = d.length % 16, se = d.length - U, F = I, H = I, V = I, $ = I, D = 0, M = 0, R = 0, X = 0, G = 597399067, be = 2869860233, le = 951274213, pe = 2716044179, Y = 0; Y < se; Y = Y + 16) D = d[Y] | d[Y + 1] << 8 | d[Y + 2] << 16 | d[Y + 3] << 24, M = d[Y + 4] | d[Y + 5] << 8 | d[Y + 6] << 16 | d[Y + 7] << 24, R = d[Y + 8] | d[Y + 9] << 8 | d[Y + 10] << 16 | d[Y + 11] << 24, X = d[Y + 12] | d[Y + 13] << 8 | d[Y + 14] << 16 | d[Y + 15] << 24, D = i(D, G), D = s(D, 15), D = i(D, be), F ^= D, F = s(F, 19), F += H, F = i(F, 5) + 1444728091, M = i(M, be), M = s(M, 16), M = i(M, le), H ^= M, H = s(H, 17), H += V, H = i(H, 5) + 197830471, R = i(R, le), R = s(R, 17), R = i(R, pe), V ^= R, V = s(V, 15), V += $, V = i(V, 5) + 2530024501, X = i(X, pe), X = s(X, 18), X = i(X, G), $ ^= X, $ = s($, 13), $ += F, $ = i($, 5) + 850148119;
                    switch (D = 0, M = 0, R = 0, X = 0, U) {
                        case 15:
                            X ^= d[Y + 14] << 16;
                        case 14:
                            X ^= d[Y + 13] << 8;
                        case 13:
                            X ^= d[Y + 12], X = i(X, pe), X = s(X, 18), X = i(X, G), $ ^= X;
                        case 12:
                            R ^= d[Y + 11] << 24;
                        case 11:
                            R ^= d[Y + 10] << 16;
                        case 10:
                            R ^= d[Y + 9] << 8;
                        case 9:
                            R ^= d[Y + 8], R = i(R, le), R = s(R, 17), R = i(R, pe), V ^= R;
                        case 8:
                            M ^= d[Y + 7] << 24;
                        case 7:
                            M ^= d[Y + 6] << 16;
                        case 6:
                            M ^= d[Y + 5] << 8;
                        case 5:
                            M ^= d[Y + 4], M = i(M, be), M = s(M, 16), M = i(M, le), H ^= M;
                        case 4:
                            D ^= d[Y + 3] << 24;
                        case 3:
                            D ^= d[Y + 2] << 16;
                        case 2:
                            D ^= d[Y + 1] << 8;
                        case 1:
                            D ^= d[Y], D = i(D, G), D = s(D, 15), D = i(D, be), F ^= D
                    }
                    return F ^= d.length, H ^= d.length, V ^= d.length, $ ^= d.length, F += H, F += V, F += $, H += F, V += F, $ += F, F = a(F), H = a(H), V = a(V), $ = a($), F += H, F += V, F += $, H += F, V += F, $ += F, ("00000000" + (F >>> 0).toString(16)).slice(-8) + ("00000000" + (H >>> 0).toString(16)).slice(-8) + ("00000000" + (V >>> 0).toString(16)).slice(-8) + ("00000000" + ($ >>> 0).toString(16)).slice(-8)
                }, t.x64.hash128 = function(d, I) {
                    if (t.inputValidation && !n(d)) return e;
                    I = I || 0;
                    for (var U = d.length % 16, se = d.length - U, F = [0, I], H = [0, I], V = [0, 0], $ = [0, 0], D = [2277735313, 289559509], M = [1291169091, 658871167], R = 0; R < se; R = R + 16) V = [d[R + 4] | d[R + 5] << 8 | d[R + 6] << 16 | d[R + 7] << 24, d[R] | d[R + 1] << 8 | d[R + 2] << 16 | d[R + 3] << 24], $ = [d[R + 12] | d[R + 13] << 8 | d[R + 14] << 16 | d[R + 15] << 24, d[R + 8] | d[R + 9] << 8 | d[R + 10] << 16 | d[R + 11] << 24], V = u(V, D), V = b(V, 31), V = u(V, M), F = E(F, V), F = b(F, 27), F = f(F, H), F = f(u(F, [0, 5]), [0, 1390208809]), $ = u($, M), $ = b($, 33), $ = u($, D), H = E(H, $), H = b(H, 31), H = f(H, F), H = f(u(H, [0, 5]), [0, 944331445]);
                    switch (V = [0, 0], $ = [0, 0], U) {
                        case 15:
                            $ = E($, y([0, d[R + 14]], 48));
                        case 14:
                            $ = E($, y([0, d[R + 13]], 40));
                        case 13:
                            $ = E($, y([0, d[R + 12]], 32));
                        case 12:
                            $ = E($, y([0, d[R + 11]], 24));
                        case 11:
                            $ = E($, y([0, d[R + 10]], 16));
                        case 10:
                            $ = E($, y([0, d[R + 9]], 8));
                        case 9:
                            $ = E($, [0, d[R + 8]]), $ = u($, M), $ = b($, 33), $ = u($, D), H = E(H, $);
                        case 8:
                            V = E(V, y([0, d[R + 7]], 56));
                        case 7:
                            V = E(V, y([0, d[R + 6]], 48));
                        case 6:
                            V = E(V, y([0, d[R + 5]], 40));
                        case 5:
                            V = E(V, y([0, d[R + 4]], 32));
                        case 4:
                            V = E(V, y([0, d[R + 3]], 24));
                        case 3:
                            V = E(V, y([0, d[R + 2]], 16));
                        case 2:
                            V = E(V, y([0, d[R + 1]], 8));
                        case 1:
                            V = E(V, [0, d[R]]), V = u(V, D), V = b(V, 31), V = u(V, M), F = E(F, V)
                    }
                    return F = E(F, [0, d.length]), H = E(H, [0, d.length]), F = f(F, H), H = f(H, F), F = z(F), H = z(H), F = f(F, H), H = f(H, F), ("00000000" + (F[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (F[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (H[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (H[1] >>> 0).toString(16)).slice(-8)
                }, typeof On != "undefined" ? (typeof Pi != "undefined" && Pi.exports && (On = Pi.exports = t), On.murmurHash3 = t) : typeof define == "function" && define.amd ? define([], function() {
                    return t
                }) : (t._murmurHash3 = r.murmurHash3, t.noConflict = function() {
                    return r.murmurHash3 = t._murmurHash3, t._murmurHash3 = e, t.noConflict = e, t
                }, r.murmurHash3 = t)
            })(On)
        });
        var Rh = h((gq, Lh) => {
            Lh.exports = Fh()
        });
        var Mh = h((mq, Dh) => {
            "use strict";
            var z6 = Gt(),
                Xr = self.crypto || self.msCrypto,
                ga = async (r, e) => {
                    if (typeof self == "undefined" || !Xr) throw new Error("Please use a browser with webcrypto support and ensure the code has been delivered securely via HTTPS/TLS and run within a Secure Context");
                    switch (e) {
                        case "sha1":
                            return new Uint8Array(await Xr.subtle.digest({
                                name: "SHA-1"
                            }, r));
                        case "sha2-256":
                            return new Uint8Array(await Xr.subtle.digest({
                                name: "SHA-256"
                            }, r));
                        case "sha2-512":
                            return new Uint8Array(await Xr.subtle.digest({
                                name: "SHA-512"
                            }, r));
                        case "dbl-sha2-256": {
                            let t = await Xr.subtle.digest({
                                name: "SHA-256"
                            }, r);
                            return new Uint8Array(await Xr.subtle.digest({
                                name: "SHA-256"
                            }, t))
                        }
                        default:
                            throw new Error(`${e} is not a supported algorithm`)
                    }
                };
            Dh.exports = {
                factory: r => async e => ga(e, r),
                digest: ga,
                multihashing: async (r, e, t) => {
                    let n = await ga(r, e);
                    return z6.encode(n, e, t)
                }
            }
        });
        var Hh = h((yq, zh) => {
            "use strict";
            var H6 = r => {
                let e = new Uint8Array(4);
                for (let t = 0; t < 4; t++) e[t] = r & 255, r = r >> 8;
                return e
            };
            zh.exports = {
                fromNumberTo32BitBuf: H6
            }
        });
        var ma = h((xq, jh) => {
            var j6 = "Input must be an string, Buffer or Uint8Array";

            function G6(r) {
                var e;
                if (r instanceof Uint8Array) e = r;
                else if (r instanceof Buffer) e = new Uint8Array(r);
                else if (typeof r == "string") e = new Uint8Array(Buffer.from(r, "utf8"));
                else throw new Error(j6);
                return e
            }

            function $6(r) {
                return Array.prototype.map.call(r, function(e) {
                    return (e < 16 ? "0" : "") + e.toString(16)
                }).join("")
            }

            function vi(r) {
                return (4294967296 + r).toString(16).substring(1)
            }

            function V6(r, e, t) {
                for (var n = `
` + r + " = ", i = 0; i < e.length; i += 2) {
                    if (t === 32) n += vi(e[i]).toUpperCase(), n += " ", n += vi(e[i + 1]).toUpperCase();
                    else if (t === 64) n += vi(e[i + 1]).toUpperCase(), n += vi(e[i]).toUpperCase();
                    else throw new Error("Invalid size " + t);
                    i % 6 == 4 ? n += `
` + new Array(r.length + 4).join(" ") : i < e.length - 2 && (n += " ")
                }
                console.log(n)
            }

            function W6(r, e, t) {
                for (var n = new Date().getTime(), i = new Uint8Array(e), s = 0; s < e; s++) i[s] = s % 256;
                var a = new Date().getTime();
                for (console.log("Generated random input in " + (a - n) + "ms"), n = a, s = 0; s < t; s++) {
                    var f = r(i),
                        u = new Date().getTime(),
                        b = u - n;
                    n = u, console.log("Hashed in " + b + "ms: " + f.substring(0, 20) + "..."), console.log(Math.round(e / (1 << 20) / (b / 1e3) * 100) / 100 + " MB PER SECOND")
                }
            }
            jh.exports = {
                normalizeInput: G6,
                toHex: $6,
                debugPrint: V6,
                testSpeed: W6
            }
        });
        var Zh = h((wq, Gh) => {
            var $h = ma();

            function Ci(r, e, t) {
                var n = r[e] + r[t],
                    i = r[e + 1] + r[t + 1];
                n >= 4294967296 && i++, r[e] = n, r[e + 1] = i
            }

            function Vh(r, e, t, n) {
                var i = r[e] + t;
                t < 0 && (i += 4294967296);
                var s = r[e + 1] + n;
                i >= 4294967296 && s++, r[e] = i, r[e + 1] = s
            }

            function Y6(r, e) {
                return r[e] ^ r[e + 1] << 8 ^ r[e + 2] << 16 ^ r[e + 3] << 24
            }

            function Xt(r, e, t, n, i, s) {
                var a = Pn[i],
                    f = Pn[i + 1],
                    u = Pn[s],
                    b = Pn[s + 1];
                Ci(te, r, e), Vh(te, r, a, f);
                var y = te[n] ^ te[r],
                    E = te[n + 1] ^ te[r + 1];
                te[n] = E, te[n + 1] = y, Ci(te, t, n), y = te[e] ^ te[t], E = te[e + 1] ^ te[t + 1], te[e] = y >>> 24 ^ E << 8, te[e + 1] = E >>> 24 ^ y << 8, Ci(te, r, e), Vh(te, r, u, b), y = te[n] ^ te[r], E = te[n + 1] ^ te[r + 1], te[n] = y >>> 16 ^ E << 16, te[n + 1] = E >>> 16 ^ y << 16, Ci(te, t, n), y = te[e] ^ te[t], E = te[e + 1] ^ te[t + 1], te[e] = E >>> 31 ^ y << 1, te[e + 1] = y >>> 31 ^ E << 1
            }
            var Wh = new Uint32Array([4089235720, 1779033703, 2227873595, 3144134277, 4271175723, 1013904242, 1595750129, 2773480762, 2917565137, 1359893119, 725511199, 2600822924, 4215389547, 528734635, 327033209, 1541459225]),
                K6 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3, 11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4, 7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8, 9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13, 2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9, 12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11, 13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10, 6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5, 10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
                $e = new Uint8Array(K6.map(function(r) {
                    return r * 2
                })),
                te = new Uint32Array(32),
                Pn = new Uint32Array(32);

            function Yh(r, e) {
                var t = 0;
                for (t = 0; t < 16; t++) te[t] = r.h[t], te[t + 16] = Wh[t];
                for (te[24] = te[24] ^ r.t, te[25] = te[25] ^ r.t / 4294967296, e && (te[28] = ~te[28], te[29] = ~te[29]), t = 0; t < 32; t++) Pn[t] = Y6(r.b, 4 * t);
                for (t = 0; t < 12; t++) Xt(0, 8, 16, 24, $e[t * 16 + 0], $e[t * 16 + 1]), Xt(2, 10, 18, 26, $e[t * 16 + 2], $e[t * 16 + 3]), Xt(4, 12, 20, 28, $e[t * 16 + 4], $e[t * 16 + 5]), Xt(6, 14, 22, 30, $e[t * 16 + 6], $e[t * 16 + 7]), Xt(0, 10, 20, 30, $e[t * 16 + 8], $e[t * 16 + 9]), Xt(2, 12, 22, 24, $e[t * 16 + 10], $e[t * 16 + 11]), Xt(4, 14, 16, 26, $e[t * 16 + 12], $e[t * 16 + 13]), Xt(6, 8, 18, 28, $e[t * 16 + 14], $e[t * 16 + 15]);
                for (t = 0; t < 16; t++) r.h[t] = r.h[t] ^ te[t] ^ te[t + 16]
            }

            function Kh(r, e) {
                if (r === 0 || r > 64) throw new Error("Illegal output length, expected 0 < length <= 64");
                if (e && e.length > 64) throw new Error("Illegal key, expected Uint8Array with 0 < length <= 64");
                for (var t = {
                        b: new Uint8Array(128),
                        h: new Uint32Array(16),
                        t: 0,
                        c: 0,
                        outlen: r
                    }, n = 0; n < 16; n++) t.h[n] = Wh[n];
                var i = e ? e.length : 0;
                return t.h[0] ^= 16842752 ^ i << 8 ^ r, e && (ya(t, e), t.c = 128), t
            }

            function ya(r, e) {
                for (var t = 0; t < e.length; t++) r.c === 128 && (r.t += r.c, Yh(r, !1), r.c = 0), r.b[r.c++] = e[t]
            }

            function Xh(r) {
                for (r.t += r.c; r.c < 128;) r.b[r.c++] = 0;
                Yh(r, !0);
                for (var e = new Uint8Array(r.outlen), t = 0; t < r.outlen; t++) e[t] = r.h[t >> 2] >> 8 * (t & 3);
                return e
            }

            function Jh(r, e, t) {
                t = t || 64, r = $h.normalizeInput(r);
                var n = Kh(t, e);
                return ya(n, r), Xh(n)
            }

            function X6(r, e, t) {
                var n = Jh(r, e, t);
                return $h.toHex(n)
            }
            Gh.exports = {
                blake2b: Jh,
                blake2bHex: X6,
                blake2bInit: Kh,
                blake2bUpdate: ya,
                blake2bFinal: Xh
            }
        });
        var ad = h((Sq, Qh) => {
            var ed = ma();

            function J6(r, e) {
                return r[e] ^ r[e + 1] << 8 ^ r[e + 2] << 16 ^ r[e + 3] << 24
            }

            function Jt(r, e, t, n, i, s) {
                de[r] = de[r] + de[e] + i, de[n] = Ui(de[n] ^ de[r], 16), de[t] = de[t] + de[n], de[e] = Ui(de[e] ^ de[t], 12), de[r] = de[r] + de[e] + s, de[n] = Ui(de[n] ^ de[r], 8), de[t] = de[t] + de[n], de[e] = Ui(de[e] ^ de[t], 7)
            }

            function Ui(r, e) {
                return r >>> e ^ r << 32 - e
            }
            var td = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]),
                Ve = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3, 11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4, 7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8, 9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13, 2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9, 12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11, 13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10, 6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5, 10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0]),
                de = new Uint32Array(16),
                je = new Uint32Array(16);

            function rd(r, e) {
                var t = 0;
                for (t = 0; t < 8; t++) de[t] = r.h[t], de[t + 8] = td[t];
                for (de[12] ^= r.t, de[13] ^= r.t / 4294967296, e && (de[14] = ~de[14]), t = 0; t < 16; t++) je[t] = J6(r.b, 4 * t);
                for (t = 0; t < 10; t++) Jt(0, 4, 8, 12, je[Ve[t * 16 + 0]], je[Ve[t * 16 + 1]]), Jt(1, 5, 9, 13, je[Ve[t * 16 + 2]], je[Ve[t * 16 + 3]]), Jt(2, 6, 10, 14, je[Ve[t * 16 + 4]], je[Ve[t * 16 + 5]]), Jt(3, 7, 11, 15, je[Ve[t * 16 + 6]], je[Ve[t * 16 + 7]]), Jt(0, 5, 10, 15, je[Ve[t * 16 + 8]], je[Ve[t * 16 + 9]]), Jt(1, 6, 11, 12, je[Ve[t * 16 + 10]], je[Ve[t * 16 + 11]]), Jt(2, 7, 8, 13, je[Ve[t * 16 + 12]], je[Ve[t * 16 + 13]]), Jt(3, 4, 9, 14, je[Ve[t * 16 + 14]], je[Ve[t * 16 + 15]]);
                for (t = 0; t < 8; t++) r.h[t] ^= de[t] ^ de[t + 8]
            }

            function nd(r, e) {
                if (!(r > 0 && r <= 32)) throw new Error("Incorrect output length, should be in [1, 32]");
                var t = e ? e.length : 0;
                if (e && !(t > 0 && t <= 32)) throw new Error("Incorrect key length, should be in [1, 32]");
                var n = {
                    h: new Uint32Array(td),
                    b: new Uint32Array(64),
                    c: 0,
                    t: 0,
                    outlen: r
                };
                return n.h[0] ^= 16842752 ^ t << 8 ^ r, t > 0 && (xa(n, e), n.c = 64), n
            }

            function xa(r, e) {
                for (var t = 0; t < e.length; t++) r.c === 64 && (r.t += r.c, rd(r, !1), r.c = 0), r.b[r.c++] = e[t]
            }

            function id(r) {
                for (r.t += r.c; r.c < 64;) r.b[r.c++] = 0;
                rd(r, !0);
                for (var e = new Uint8Array(r.outlen), t = 0; t < r.outlen; t++) e[t] = r.h[t >> 2] >> 8 * (t & 3) & 255;
                return e
            }

            function sd(r, e, t) {
                t = t || 32, r = ed.normalizeInput(r);
                var n = nd(t, e);
                return xa(n, r), id(n)
            }

            function Z6(r, e, t) {
                var n = sd(r, e, t);
                return ed.toHex(n)
            }
            Qh.exports = {
                blake2s: sd,
                blake2sHex: Z6,
                blake2sInit: nd,
                blake2sUpdate: xa,
                blake2sFinal: id
            }
        });
        var ud = h((kq, od) => {
            var vn = Zh(),
                Cn = ad();
            od.exports = {
                blake2b: vn.blake2b,
                blake2bHex: vn.blake2bHex,
                blake2bInit: vn.blake2bInit,
                blake2bUpdate: vn.blake2bUpdate,
                blake2bFinal: vn.blake2bFinal,
                blake2s: Cn.blake2s,
                blake2sHex: Cn.blake2sHex,
                blake2sInit: Cn.blake2sInit,
                blake2sUpdate: Cn.blake2sUpdate,
                blake2sFinal: Cn.blake2sFinal
            }
        });
        var fd = h((Eq, cd) => {
            "use strict";
            var Jr = ud(),
                Q6 = 45569,
                e8 = 45633,
                t8 = {
                    init: Jr.blake2bInit,
                    update: Jr.blake2bUpdate,
                    digest: Jr.blake2bFinal
                },
                r8 = {
                    init: Jr.blake2sInit,
                    update: Jr.blake2sUpdate,
                    digest: Jr.blake2sFinal
                },
                ld = (r, e) => async t => {
                    let n = e.init(r, null);
                    return e.update(n, t), e.digest(n)
                };
            cd.exports = r => {
                for (let e = 0; e < 64; e++) r[Q6 + e] = ld(e + 1, t8);
                for (let e = 0; e < 32; e++) r[e8 + e] = ld(e + 1, r8)
            }
        });
        var pd = h((_q, hd) => {
            "use strict";
            var qt = Uh(),
                dd = Rh(),
                {
                    factory: Fi
                } = Mh(),
                {
                    fromNumberTo32BitBuf: n8
                } = Hh(),
                i8 = et(),
                ut = r => async e => {
                    switch (r) {
                        case "sha3-224":
                            return new Uint8Array(qt.sha3_224.arrayBuffer(e));
                        case "sha3-256":
                            return new Uint8Array(qt.sha3_256.arrayBuffer(e));
                        case "sha3-384":
                            return new Uint8Array(qt.sha3_384.arrayBuffer(e));
                        case "sha3-512":
                            return new Uint8Array(qt.sha3_512.arrayBuffer(e));
                        case "shake-128":
                            return new Uint8Array(qt.shake128.create(128).update(e).arrayBuffer());
                        case "shake-256":
                            return new Uint8Array(qt.shake256.create(256).update(e).arrayBuffer());
                        case "keccak-224":
                            return new Uint8Array(qt.keccak224.arrayBuffer(e));
                        case "keccak-256":
                            return new Uint8Array(qt.keccak256.arrayBuffer(e));
                        case "keccak-384":
                            return new Uint8Array(qt.keccak384.arrayBuffer(e));
                        case "keccak-512":
                            return new Uint8Array(qt.keccak512.arrayBuffer(e));
                        case "murmur3-128":
                            return i8(dd.x64.hash128(e), "base16");
                        case "murmur3-32":
                            return n8(dd.x86.hash32(e));
                        default:
                            throw new TypeError(`${r} is not a supported algorithm`)
                    }
                }, s8 = r => r;
            hd.exports = {
                identity: s8,
                sha1: Fi("sha1"),
                sha2256: Fi("sha2-256"),
                sha2512: Fi("sha2-512"),
                dblSha2256: Fi("dbl-sha2-256"),
                sha3224: ut("sha3-224"),
                sha3256: ut("sha3-256"),
                sha3384: ut("sha3-384"),
                sha3512: ut("sha3-512"),
                shake128: ut("shake-128"),
                shake256: ut("shake-256"),
                keccak224: ut("keccak-224"),
                keccak256: ut("keccak-256"),
                keccak384: ut("keccak-384"),
                keccak512: ut("keccak-512"),
                murmur3128: ut("murmur3-128"),
                murmur332: ut("murmur3-32"),
                addBlake: fd()
            }
        });
        var Ri = h((Aq, bd) => {
            "use strict";
            var gd = sr(),
                Li = Gt(),
                Re = pd(),
                a8 = Sn();
            async function ct(r, e, t) {
                let n = await ct.digest(r, e, t);
                return Li.encode(n, e, t)
            }
            ct.multihash = Li;
            ct.digest = async (r, e, t) => {
                let i = await ct.createHash(e)(r);
                return t ? i.slice(0, t) : i
            };
            ct.createHash = function(r) {
                if (!r) throw gd(new Error("hash algorithm must be specified"), "ERR_HASH_ALGORITHM_NOT_SPECIFIED");
                let e = Li.coerceCode(r);
                if (!ct.functions[e]) throw gd(new Error(`multihash function '${r}' not yet supported`), "ERR_HASH_ALGORITHM_NOT_SUPPORTED");
                return ct.functions[e]
            };
            ct.functions = {
                0: Re.identity,
                17: Re.sha1,
                18: Re.sha2256,
                19: Re.sha2512,
                20: Re.sha3512,
                21: Re.sha3384,
                22: Re.sha3256,
                23: Re.sha3224,
                24: Re.shake128,
                25: Re.shake256,
                26: Re.keccak224,
                27: Re.keccak256,
                28: Re.keccak384,
                29: Re.keccak512,
                34: Re.murmur3128,
                35: Re.murmur332,
                86: Re.dblSha2256
            };
            Re.addBlake(ct.functions);
            ct.validate = async (r, e) => {
                let t = await ct(r, Li.decode(e).name);
                return a8(e, t)
            };
            bd.exports = ct
        });
        var wa = h((Iq, md) => {
            "use strict";
            var o8 = J(),
                yd = Lt(),
                xd = Ri(),
                {
                    multihash: wd
                } = xd,
                Sd = yd.DAG_PB,
                kd = wd.names["sha2-256"],
                u8 = async (r, e = {}) => {
                    let t = {
                            cidVersion: e.cidVersion == null ? 1 : e.cidVersion,
                            hashAlg: e.hashAlg == null ? kd : e.hashAlg
                        },
                        n = wd.codes[t.hashAlg],
                        i = await xd(r, n),
                        s = yd.getNameFromCode(Sd);
                    return new o8(t.cidVersion, s, i)
                };
            md.exports = {
                codec: Sd,
                defaultHashAlg: kd,
                cid: u8
            }
        });
        var _d = h((Tq, Ed) => {
            "use strict";
            var c8 = lr(),
                l8 = wa(),
                f8 = async (r, e = {}) => {
                    let t = r.serialize(),
                        n = await l8.cid(t, e);
                    return new c8(e.name || "", r.size, n)
                };
            Ed.exports = f8
        });
        var Td = h((Nq, Ad) => {
            "use strict";
            var h8 = da(),
                Id = lr(),
                d8 = r => {
                    if (r instanceof Id) return r;
                    if (!("cid" in r || "hash" in r || "Hash" in r || "multihash" in r)) throw new Error("Link must be a DAGLink or DAGLink-like. Convert the DAGNode into a DAGLink via `node.toDAGLink()`.");
                    return new Id(r.Name || r.name, r.Tsize || r.size, r.Hash || r.multihash || r.hash || r.cid)
                },
                p8 = (r, e) => {
                    let t = d8(e);
                    r.Links.push(t), h8(r.Links)
                };
            Ad.exports = p8
        });
        var Bd = h((qq, Nd) => {
            "use strict";
            var b8 = J(),
                qd = Sn(),
                g8 = (r, e) => {
                    let t = null;
                    if (typeof e == "string" ? t = n => n.Name === e : e instanceof Uint8Array ? t = n => qd(n.Hash.bytes, e) : b8.isCID(e) && (t = n => qd(n.Hash.bytes, e.bytes)), t) {
                        let n = r.Links,
                            i = 0;
                        for (; i < n.length;) {
                            let s = n[i];
                            t(s) ? n.splice(i, 1) : i++
                        }
                    } else throw new Error("second arg needs to be a name or CID")
                };
            Nd.exports = g8
        });
        var Sa = h((Bq, Od) => {
            "use strict";
            var m8 = da(),
                y8 = lr(),
                {
                    createDagLinkFromB58EncodedHash: x8
                } = pa(),
                {
                    serializeDAGNode: w8
                } = ba(),
                S8 = _d(),
                k8 = Td(),
                E8 = Bd(),
                _8 = et(),
                A8 = st(),
                Pd = class {
                    constructor(e, t = [], n = null) {
                        if (e || (e = new Uint8Array(0)), typeof e == "string" && (e = _8(e)), !(e instanceof Uint8Array)) throw new Error("Passed 'data' is not a Uint8Array or a String!");
                        if (n !== null && typeof n != "number") throw new Error("Passed 'serializedSize' must be a number!");
                        let i = t.map(s => s instanceof y8 ? s : x8(s));
                        m8(i), this.Data = e, this.Links = i, Object.defineProperties(this, {
                            _serializedSize: {
                                value: n,
                                writable: !0,
                                enumerable: !1
                            },
                            _size: {
                                value: null,
                                writable: !0,
                                enumerable: !1
                            }
                        })
                    }
                    toJSON() {
                        return this._json || (this._json = Object.freeze({
                            data: this.Data,
                            links: this.Links.map(e => e.toJSON()),
                            size: this.size
                        })), Object.assign({}, this._json)
                    }
                    toString() {
                        return `DAGNode <data: "${A8(this.Data,"base64urlpad")}", links: ${this.Links.length}, size: ${this.size}>`
                    }
                    _invalidateCached() {
                        this._serializedSize = null, this._size = null
                    }
                    addLink(e) {
                        return this._invalidateCached(), k8(this, e)
                    }
                    rmLink(e) {
                        return this._invalidateCached(), E8(this, e)
                    }
                    toDAGLink(e) {
                        return S8(this, e)
                    }
                    serialize() {
                        let e = w8(this);
                        return this._serializedSize = e.length, e
                    }
                    get size() {
                        if (this._size == null) {
                            let e;
                            e == null && (this._serializedSize = this.serialize().length, e = this._serializedSize), this._size = this.Links.reduce((t, n) => t + n.Tsize, e)
                        }
                        return this._size
                    }
                    set size(e) {
                        throw new Error("Can't set property: 'size' is immutable")
                    }
                };
            Od.exports = Pd
        });
        var Ea = h((Oq, vd) => {
            "use strict";
            var {
                PBNode: Cd
            } = la(), I8 = lr(), Ud = Sa(), {
                serializeDAGNode: T8,
                serializeDAGNodeLike: N8
            } = ba(), ka = wa(), q8 = (r, e) => ka.cid(r, e), B8 = r => r instanceof Ud ? T8(r) : N8(r.Data, r.Links), O8 = r => {
                let e = Cd.decode(r),
                    t = Cd.toObject(e, {
                        defaults: !1,
                        arrays: !0,
                        longs: Number,
                        objects: !1
                    }),
                    n = t.Links.map(s => new I8(s.Name, s.Tsize, s.Hash)),
                    i = t.Data == null ? new Uint8Array(0) : t.Data;
                return new Ud(i, n, r.byteLength)
            };
            vd.exports = {
                codec: ka.codec,
                defaultHashAlg: ka.defaultHashAlg,
                serialize: B8,
                deserialize: O8,
                cid: q8
            }
        });
        var Ld = h(_a => {
            "use strict";
            var P8 = J(),
                Fd = Ea();
            _a.resolve = (r, e = "/") => {
                let t = Fd.deserialize(r),
                    n = e.split("/").filter(Boolean);
                for (; n.length;) {
                    let i = n.shift();
                    if (t[i] === void 0) {
                        for (let s of t.Links)
                            if (s.Name === i) return {
                                value: s.Hash,
                                remainderPath: n.join("/")
                            };
                        throw new Error(`Object has no property '${i}'`)
                    }
                    if (t = t[i], P8.isCID(t)) return {
                        value: t,
                        remainderPath: n.join("/")
                    }
                }
                return {
                    value: t,
                    remainderPath: ""
                }
            };
            _a.tree = function*(r) {
                let e = Fd.deserialize(r);
                yield "Data", yield "Links";
                for (let t = 0; t < e.Links.length; t++) yield `Links/${t}`, yield `Links/${t}/Name`, yield `Links/${t}/Tsize`, yield `Links/${t}/Hash`
            }
        });
        var Un = h((vq, Rd) => {
            "use strict";
            var v8 = Ld(),
                Aa = Ea(),
                C8 = Sa(),
                U8 = lr(),
                F8 = {
                    DAGNode: C8,
                    DAGLink: U8,
                    resolver: v8,
                    util: Aa,
                    codec: Aa.codec,
                    defaultHashAlg: Aa.defaultHashAlg
                };
            Rd.exports = F8
        });
        var Md = h(Di => {
            "use strict";
            Di.byteLength = L8;
            Di.toByteArray = R8;
            Di.fromByteArray = D8;
            var Bt = [],
                lt = [],
                M8 = typeof Uint8Array != "undefined" ? Uint8Array : Array,
                Ia = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for (var Zr = 0, z8 = Ia.length; Zr < z8; ++Zr) Bt[Zr] = Ia[Zr], lt[Ia.charCodeAt(Zr)] = Zr;
            lt["-".charCodeAt(0)] = 62;
            lt["_".charCodeAt(0)] = 63;

            function Dd(r) {
                var e = r.length;
                if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                var t = r.indexOf("=");
                t === -1 && (t = e);
                var n = t === e ? 0 : 4 - t % 4;
                return [t, n]
            }

            function L8(r) {
                var e = Dd(r),
                    t = e[0],
                    n = e[1];
                return (t + n) * 3 / 4 - n
            }

            function H8(r, e, t) {
                return (e + t) * 3 / 4 - t
            }

            function R8(r) {
                var e, t = Dd(r),
                    n = t[0],
                    i = t[1],
                    s = new M8(H8(r, n, i)),
                    a = 0,
                    f = i > 0 ? n - 4 : n,
                    u;
                for (u = 0; u < f; u += 4) e = lt[r.charCodeAt(u)] << 18 | lt[r.charCodeAt(u + 1)] << 12 | lt[r.charCodeAt(u + 2)] << 6 | lt[r.charCodeAt(u + 3)], s[a++] = e >> 16 & 255, s[a++] = e >> 8 & 255, s[a++] = e & 255;
                return i === 2 && (e = lt[r.charCodeAt(u)] << 2 | lt[r.charCodeAt(u + 1)] >> 4, s[a++] = e & 255), i === 1 && (e = lt[r.charCodeAt(u)] << 10 | lt[r.charCodeAt(u + 1)] << 4 | lt[r.charCodeAt(u + 2)] >> 2, s[a++] = e >> 8 & 255, s[a++] = e & 255), s
            }

            function j8(r) {
                return Bt[r >> 18 & 63] + Bt[r >> 12 & 63] + Bt[r >> 6 & 63] + Bt[r & 63]
            }

            function G8(r, e, t) {
                for (var n, i = [], s = e; s < t; s += 3) n = (r[s] << 16 & 16711680) + (r[s + 1] << 8 & 65280) + (r[s + 2] & 255), i.push(j8(n));
                return i.join("")
            }

            function D8(r) {
                for (var e, t = r.length, n = t % 3, i = [], s = 16383, a = 0, f = t - n; a < f; a += s) i.push(G8(r, a, a + s > f ? f : a + s));
                return n === 1 ? (e = r[t - 1], i.push(Bt[e >> 2] + Bt[e << 4 & 63] + "==")) : n === 2 && (e = (r[t - 2] << 8) + r[t - 1], i.push(Bt[e >> 10] + Bt[e >> 4 & 63] + Bt[e << 2 & 63] + "=")), i.join("")
            }
        });
        var Na = h(Ta => {
            Ta.read = function(r, e, t, n, i) {
                var s, a, f = i * 8 - n - 1,
                    u = (1 << f) - 1,
                    b = u >> 1,
                    y = -7,
                    E = t ? i - 1 : 0,
                    z = t ? -1 : 1,
                    d = r[e + E];
                for (E += z, s = d & (1 << -y) - 1, d >>= -y, y += f; y > 0; s = s * 256 + r[e + E], E += z, y -= 8);
                for (a = s & (1 << -y) - 1, s >>= -y, y += n; y > 0; a = a * 256 + r[e + E], E += z, y -= 8);
                if (s === 0) s = 1 - b;
                else {
                    if (s === u) return a ? NaN : (d ? -1 : 1) * Infinity;
                    a = a + Math.pow(2, n), s = s - b
                }
                return (d ? -1 : 1) * a * Math.pow(2, s - n)
            };
            Ta.write = function(r, e, t, n, i, s) {
                var a, f, u, b = s * 8 - i - 1,
                    y = (1 << b) - 1,
                    E = y >> 1,
                    z = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                    d = n ? 0 : s - 1,
                    I = n ? 1 : -1,
                    U = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
                for (e = Math.abs(e), isNaN(e) || e === Infinity ? (f = isNaN(e) ? 1 : 0, a = y) : (a = Math.floor(Math.log(e) / Math.LN2), e * (u = Math.pow(2, -a)) < 1 && (a--, u *= 2), a + E >= 1 ? e += z / u : e += z * Math.pow(2, 1 - E), e * u >= 2 && (a++, u /= 2), a + E >= y ? (f = 0, a = y) : a + E >= 1 ? (f = (e * u - 1) * Math.pow(2, i), a = a + E) : (f = e * Math.pow(2, E - 1) * Math.pow(2, i), a = 0)); i >= 8; r[t + d] = f & 255, d += I, f /= 256, i -= 8);
                for (a = a << i | f, b += i; b > 0; r[t + d] = a & 255, d += I, a /= 256, b -= 8);
                r[t + d - I] |= U * 128
            }
        });
        var zt = h(Qr => {
            "use strict";
            var qa = Md(),
                en = Na(),
                zd = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
            Qr.Buffer = q;
            Qr.SlowBuffer = $8;
            Qr.INSPECT_MAX_BYTES = 50;
            var Mi = 2147483647;
            Qr.kMaxLength = Mi;
            q.TYPED_ARRAY_SUPPORT = V8();
            !q.TYPED_ARRAY_SUPPORT && typeof console != "undefined" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");

            function V8() {
                try {
                    let r = new Uint8Array(1),
                        e = {
                            foo: function() {
                                return 42
                            }
                        };
                    return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(r, e), r.foo() === 42
                } catch (r) {
                    return !1
                }
            }
            Object.defineProperty(q.prototype, "parent", {
                enumerable: !0,
                get: function() {
                    if (!!q.isBuffer(this)) return this.buffer
                }
            });
            Object.defineProperty(q.prototype, "offset", {
                enumerable: !0,
                get: function() {
                    if (!!q.isBuffer(this)) return this.byteOffset
                }
            });

            function Mt(r) {
                if (r > Mi) throw new RangeError('The value "' + r + '" is invalid for option "size"');
                let e = new Uint8Array(r);
                return Object.setPrototypeOf(e, q.prototype), e
            }

            function q(r, e, t) {
                if (typeof r == "number") {
                    if (typeof e == "string") throw new TypeError('The "string" argument must be of type string. Received type number');
                    return Ba(r)
                }
                return Hd(r, e, t)
            }
            q.poolSize = 8192;

            function Hd(r, e, t) {
                if (typeof r == "string") return W8(r, e);
                if (ArrayBuffer.isView(r)) return Y8(r);
                if (r == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
                if (Ot(r, ArrayBuffer) || r && Ot(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer != "undefined" && (Ot(r, SharedArrayBuffer) || r && Ot(r.buffer, SharedArrayBuffer))) return Oa(r, e, t);
                if (typeof r == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
                let n = r.valueOf && r.valueOf();
                if (n != null && n !== r) return q.from(n, e, t);
                let i = K8(r);
                if (i) return i;
                if (typeof Symbol != "undefined" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function") return q.from(r[Symbol.toPrimitive]("string"), e, t);
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r)
            }
            q.from = function(r, e, t) {
                return Hd(r, e, t)
            };
            Object.setPrototypeOf(q.prototype, Uint8Array.prototype);
            Object.setPrototypeOf(q, Uint8Array);

            function jd(r) {
                if (typeof r != "number") throw new TypeError('"size" argument must be of type number');
                if (r < 0) throw new RangeError('The value "' + r + '" is invalid for option "size"')
            }

            function X8(r, e, t) {
                return jd(r), r <= 0 ? Mt(r) : e !== void 0 ? typeof t == "string" ? Mt(r).fill(e, t) : Mt(r).fill(e) : Mt(r)
            }
            q.alloc = function(r, e, t) {
                return X8(r, e, t)
            };

            function Ba(r) {
                return jd(r), Mt(r < 0 ? 0 : Pa(r) | 0)
            }
            q.allocUnsafe = function(r) {
                return Ba(r)
            };
            q.allocUnsafeSlow = function(r) {
                return Ba(r)
            };

            function W8(r, e) {
                if ((typeof e != "string" || e === "") && (e = "utf8"), !q.isEncoding(e)) throw new TypeError("Unknown encoding: " + e);
                let t = Gd(r, e) | 0,
                    n = Mt(t),
                    i = n.write(r, e);
                return i !== t && (n = n.slice(0, i)), n
            }

            function va(r) {
                let e = r.length < 0 ? 0 : Pa(r.length) | 0,
                    t = Mt(e);
                for (let n = 0; n < e; n += 1) t[n] = r[n] & 255;
                return t
            }

            function Y8(r) {
                if (Ot(r, Uint8Array)) {
                    let e = new Uint8Array(r);
                    return Oa(e.buffer, e.byteOffset, e.byteLength)
                }
                return va(r)
            }

            function Oa(r, e, t) {
                if (e < 0 || r.byteLength < e) throw new RangeError('"offset" is outside of buffer bounds');
                if (r.byteLength < e + (t || 0)) throw new RangeError('"length" is outside of buffer bounds');
                let n;
                return e === void 0 && t === void 0 ? n = new Uint8Array(r) : t === void 0 ? n = new Uint8Array(r, e) : n = new Uint8Array(r, e, t), Object.setPrototypeOf(n, q.prototype), n
            }

            function K8(r) {
                if (q.isBuffer(r)) {
                    let e = Pa(r.length) | 0,
                        t = Mt(e);
                    return t.length === 0 || r.copy(t, 0, 0, e), t
                }
                if (r.length !== void 0) return typeof r.length != "number" || Ca(r.length) ? Mt(0) : va(r);
                if (r.type === "Buffer" && Array.isArray(r.data)) return va(r.data)
            }

            function Pa(r) {
                if (r >= Mi) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + Mi.toString(16) + " bytes");
                return r | 0
            }

            function $8(r) {
                return +r != r && (r = 0), q.alloc(+r)
            }
            q.isBuffer = function(e) {
                return e != null && e._isBuffer === !0 && e !== q.prototype
            };
            q.compare = function(e, t) {
                if (Ot(e, Uint8Array) && (e = q.from(e, e.offset, e.byteLength)), Ot(t, Uint8Array) && (t = q.from(t, t.offset, t.byteLength)), !q.isBuffer(e) || !q.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                if (e === t) return 0;
                let n = e.length,
                    i = t.length;
                for (let s = 0, a = Math.min(n, i); s < a; ++s)
                    if (e[s] !== t[s]) {
                        n = e[s], i = t[s];
                        break
                    } return n < i ? -1 : i < n ? 1 : 0
            };
            q.isEncoding = function(e) {
                switch (String(e).toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return !0;
                    default:
                        return !1
                }
            };
            q.concat = function(e, t) {
                if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                if (e.length === 0) return q.alloc(0);
                let n;
                if (t === void 0)
                    for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
                let i = q.allocUnsafe(t),
                    s = 0;
                for (n = 0; n < e.length; ++n) {
                    let a = e[n];
                    if (Ot(a, Uint8Array)) s + a.length > i.length ? (q.isBuffer(a) || (a = q.from(a)), a.copy(i, s)) : Uint8Array.prototype.set.call(i, a, s);
                    else if (q.isBuffer(a)) a.copy(i, s);
                    else throw new TypeError('"list" argument must be an Array of Buffers');
                    s += a.length
                }
                return i
            };

            function Gd(r, e) {
                if (q.isBuffer(r)) return r.length;
                if (ArrayBuffer.isView(r) || Ot(r, ArrayBuffer)) return r.byteLength;
                if (typeof r != "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r);
                let t = r.length,
                    n = arguments.length > 2 && arguments[2] === !0;
                if (!n && t === 0) return 0;
                let i = !1;
                for (;;) switch (e) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return t;
                    case "utf8":
                    case "utf-8":
                        return Ua(r).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return t * 2;
                    case "hex":
                        return t >>> 1;
                    case "base64":
                        return $d(r).length;
                    default:
                        if (i) return n ? -1 : Ua(r).length;
                        e = ("" + e).toLowerCase(), i = !0
                }
            }
            q.byteLength = Gd;

            function rS(r, e, t) {
                let n = !1;
                if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((t === void 0 || t > this.length) && (t = this.length), t <= 0) || (t >>>= 0, e >>>= 0, t <= e)) return "";
                for (r || (r = "utf8");;) switch (r) {
                    case "hex":
                        return eS(this, e, t);
                    case "utf8":
                    case "utf-8":
                        return Vd(this, e, t);
                    case "ascii":
                        return Z8(this, e, t);
                    case "latin1":
                    case "binary":
                        return Q8(this, e, t);
                    case "base64":
                        return J8(this, e, t);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return tS(this, e, t);
                    default:
                        if (n) throw new TypeError("Unknown encoding: " + r);
                        r = (r + "").toLowerCase(), n = !0
                }
            }
            q.prototype._isBuffer = !0;

            function fr(r, e, t) {
                let n = r[e];
                r[e] = r[t], r[t] = n
            }
            q.prototype.swap16 = function() {
                let e = this.length;
                if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (let t = 0; t < e; t += 2) fr(this, t, t + 1);
                return this
            };
            q.prototype.swap32 = function() {
                let e = this.length;
                if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (let t = 0; t < e; t += 4) fr(this, t, t + 3), fr(this, t + 1, t + 2);
                return this
            };
            q.prototype.swap64 = function() {
                let e = this.length;
                if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (let t = 0; t < e; t += 8) fr(this, t, t + 7), fr(this, t + 1, t + 6), fr(this, t + 2, t + 5), fr(this, t + 3, t + 4);
                return this
            };
            q.prototype.toString = function() {
                let e = this.length;
                return e === 0 ? "" : arguments.length === 0 ? Vd(this, 0, e) : rS.apply(this, arguments)
            };
            q.prototype.toLocaleString = q.prototype.toString;
            q.prototype.equals = function(e) {
                if (!q.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                return this === e ? !0 : q.compare(this, e) === 0
            };
            q.prototype.inspect = function() {
                let e = "",
                    t = Qr.INSPECT_MAX_BYTES;
                return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">"
            };
            zd && (q.prototype[zd] = q.prototype.inspect);
            q.prototype.compare = function(e, t, n, i, s) {
                if (Ot(e, Uint8Array) && (e = q.from(e, e.offset, e.byteLength)), !q.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
                if (t === void 0 && (t = 0), n === void 0 && (n = e ? e.length : 0), i === void 0 && (i = 0), s === void 0 && (s = this.length), t < 0 || n > e.length || i < 0 || s > this.length) throw new RangeError("out of range index");
                if (i >= s && t >= n) return 0;
                if (i >= s) return -1;
                if (t >= n) return 1;
                if (t >>>= 0, n >>>= 0, i >>>= 0, s >>>= 0, this === e) return 0;
                let a = s - i,
                    f = n - t,
                    u = Math.min(a, f),
                    b = this.slice(i, s),
                    y = e.slice(t, n);
                for (let E = 0; E < u; ++E)
                    if (b[E] !== y[E]) {
                        a = b[E], f = y[E];
                        break
                    } return a < f ? -1 : f < a ? 1 : 0
            };

            function Yd(r, e, t, n, i) {
                if (r.length === 0) return -1;
                if (typeof t == "string" ? (n = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t = +t, Ca(t) && (t = i ? 0 : r.length - 1), t < 0 && (t = r.length + t), t >= r.length) {
                    if (i) return -1;
                    t = r.length - 1
                } else if (t < 0)
                    if (i) t = 0;
                    else return -1;
                if (typeof e == "string" && (e = q.from(e, n)), q.isBuffer(e)) return e.length === 0 ? -1 : Wd(r, e, t, n, i);
                if (typeof e == "number") return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(r, e, t) : Uint8Array.prototype.lastIndexOf.call(r, e, t) : Wd(r, [e], t, n, i);
                throw new TypeError("val must be string, number or Buffer")
            }

            function Wd(r, e, t, n, i) {
                let s = 1,
                    a = r.length,
                    f = e.length;
                if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
                    if (r.length < 2 || e.length < 2) return -1;
                    s = 2, a /= 2, f /= 2, t /= 2
                }

                function u(y, E) {
                    return s === 1 ? y[E] : y.readUInt16BE(E * s)
                }
                let b;
                if (i) {
                    let y = -1;
                    for (b = t; b < a; b++)
                        if (u(r, b) === u(e, y === -1 ? 0 : b - y)) {
                            if (y === -1 && (y = b), b - y + 1 === f) return y * s
                        } else y !== -1 && (b -= b - y), y = -1
                } else
                    for (t + f > a && (t = a - f), b = t; b >= 0; b--) {
                        let y = !0;
                        for (let E = 0; E < f; E++)
                            if (u(r, b + E) !== u(e, E)) {
                                y = !1;
                                break
                            } if (y) return b
                    }
                return -1
            }
            q.prototype.includes = function(e, t, n) {
                return this.indexOf(e, t, n) !== -1
            };
            q.prototype.indexOf = function(e, t, n) {
                return Yd(this, e, t, n, !0)
            };
            q.prototype.lastIndexOf = function(e, t, n) {
                return Yd(this, e, t, n, !1)
            };

            function nS(r, e, t, n) {
                t = Number(t) || 0;
                let i = r.length - t;
                n ? (n = Number(n), n > i && (n = i)) : n = i;
                let s = e.length;
                n > s / 2 && (n = s / 2);
                let a;
                for (a = 0; a < n; ++a) {
                    let f = parseInt(e.substr(a * 2, 2), 16);
                    if (Ca(f)) return a;
                    r[t + a] = f
                }
                return a
            }

            function iS(r, e, t, n) {
                return zi(Ua(e, r.length - t), r, t, n)
            }

            function aS(r, e, t, n) {
                return zi(sS(e), r, t, n)
            }

            function oS(r, e, t, n) {
                return zi($d(e), r, t, n)
            }

            function cS(r, e, t, n) {
                return zi(uS(e, r.length - t), r, t, n)
            }
            q.prototype.write = function(e, t, n, i) {
                if (t === void 0) i = "utf8", n = this.length, t = 0;
                else if (n === void 0 && typeof t == "string") i = t, n = this.length, t = 0;
                else if (isFinite(t)) t = t >>> 0, isFinite(n) ? (n = n >>> 0, i === void 0 && (i = "utf8")) : (i = n, n = void 0);
                else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                let s = this.length - t;
                if ((n === void 0 || n > s) && (n = s), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                i || (i = "utf8");
                let a = !1;
                for (;;) switch (i) {
                    case "hex":
                        return nS(this, e, t, n);
                    case "utf8":
                    case "utf-8":
                        return iS(this, e, t, n);
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return aS(this, e, t, n);
                    case "base64":
                        return oS(this, e, t, n);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return cS(this, e, t, n);
                    default:
                        if (a) throw new TypeError("Unknown encoding: " + i);
                        i = ("" + i).toLowerCase(), a = !0
                }
            };
            q.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            };

            function J8(r, e, t) {
                return e === 0 && t === r.length ? qa.fromByteArray(r) : qa.fromByteArray(r.slice(e, t))
            }

            function Vd(r, e, t) {
                t = Math.min(r.length, t);
                let n = [],
                    i = e;
                for (; i < t;) {
                    let s = r[i],
                        a = null,
                        f = s > 239 ? 4 : s > 223 ? 3 : s > 191 ? 2 : 1;
                    if (i + f <= t) {
                        let u, b, y, E;
                        switch (f) {
                            case 1:
                                s < 128 && (a = s);
                                break;
                            case 2:
                                u = r[i + 1], (u & 192) == 128 && (E = (s & 31) << 6 | u & 63, E > 127 && (a = E));
                                break;
                            case 3:
                                u = r[i + 1], b = r[i + 2], (u & 192) == 128 && (b & 192) == 128 && (E = (s & 15) << 12 | (u & 63) << 6 | b & 63, E > 2047 && (E < 55296 || E > 57343) && (a = E));
                                break;
                            case 4:
                                u = r[i + 1], b = r[i + 2], y = r[i + 3], (u & 192) == 128 && (b & 192) == 128 && (y & 192) == 128 && (E = (s & 15) << 18 | (u & 63) << 12 | (b & 63) << 6 | y & 63, E > 65535 && E < 1114112 && (a = E))
                        }
                    }
                    a === null ? (a = 65533, f = 1) : a > 65535 && (a -= 65536, n.push(a >>> 10 & 1023 | 55296), a = 56320 | a & 1023), n.push(a), i += f
                }
                return lS(n)
            }
            var Kd = 4096;

            function lS(r) {
                let e = r.length;
                if (e <= Kd) return String.fromCharCode.apply(String, r);
                let t = "",
                    n = 0;
                for (; n < e;) t += String.fromCharCode.apply(String, r.slice(n, n += Kd));
                return t
            }

            function Z8(r, e, t) {
                let n = "";
                t = Math.min(r.length, t);
                for (let i = e; i < t; ++i) n += String.fromCharCode(r[i] & 127);
                return n
            }

            function Q8(r, e, t) {
                let n = "";
                t = Math.min(r.length, t);
                for (let i = e; i < t; ++i) n += String.fromCharCode(r[i]);
                return n
            }

            function eS(r, e, t) {
                let n = r.length;
                (!e || e < 0) && (e = 0), (!t || t < 0 || t > n) && (t = n);
                let i = "";
                for (let s = e; s < t; ++s) i += fS[r[s]];
                return i
            }

            function tS(r, e, t) {
                let n = r.slice(e, t),
                    i = "";
                for (let s = 0; s < n.length - 1; s += 2) i += String.fromCharCode(n[s] + n[s + 1] * 256);
                return i
            }
            q.prototype.slice = function(e, t) {
                let n = this.length;
                e = ~~e, t = t === void 0 ? n : ~~t, e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), t < e && (t = e);
                let i = this.subarray(e, t);
                return Object.setPrototypeOf(i, q.prototype), i
            };

            function De(r, e, t) {
                if (r % 1 != 0 || r < 0) throw new RangeError("offset is not uint");
                if (r + e > t) throw new RangeError("Trying to access beyond buffer length")
            }
            q.prototype.readUintLE = q.prototype.readUIntLE = function(e, t, n) {
                e = e >>> 0, t = t >>> 0, n || De(e, t, this.length);
                let i = this[e],
                    s = 1,
                    a = 0;
                for (; ++a < t && (s *= 256);) i += this[e + a] * s;
                return i
            };
            q.prototype.readUintBE = q.prototype.readUIntBE = function(e, t, n) {
                e = e >>> 0, t = t >>> 0, n || De(e, t, this.length);
                let i = this[e + --t],
                    s = 1;
                for (; t > 0 && (s *= 256);) i += this[e + --t] * s;
                return i
            };
            q.prototype.readUint8 = q.prototype.readUInt8 = function(e, t) {
                return e = e >>> 0, t || De(e, 1, this.length), this[e]
            };
            q.prototype.readUint16LE = q.prototype.readUInt16LE = function(e, t) {
                return e = e >>> 0, t || De(e, 2, this.length), this[e] | this[e + 1] << 8
            };
            q.prototype.readUint16BE = q.prototype.readUInt16BE = function(e, t) {
                return e = e >>> 0, t || De(e, 2, this.length), this[e] << 8 | this[e + 1]
            };
            q.prototype.readUint32LE = q.prototype.readUInt32LE = function(e, t) {
                return e = e >>> 0, t || De(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216
            };
            q.prototype.readUint32BE = q.prototype.readUInt32BE = function(e, t) {
                return e = e >>> 0, t || De(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
            };
            q.prototype.readBigUInt64LE = Zt(function(e) {
                e = e >>> 0, tn(e, "offset");
                let t = this[e],
                    n = this[e + 7];
                (t === void 0 || n === void 0) && Fn(e, this.length - 8);
                let i = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24,
                    s = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + n * 2 ** 24;
                return BigInt(i) + (BigInt(s) << BigInt(32))
            });
            q.prototype.readBigUInt64BE = Zt(function(e) {
                e = e >>> 0, tn(e, "offset");
                let t = this[e],
                    n = this[e + 7];
                (t === void 0 || n === void 0) && Fn(e, this.length - 8);
                let i = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e],
                    s = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n;
                return (BigInt(i) << BigInt(32)) + BigInt(s)
            });
            q.prototype.readIntLE = function(e, t, n) {
                e = e >>> 0, t = t >>> 0, n || De(e, t, this.length);
                let i = this[e],
                    s = 1,
                    a = 0;
                for (; ++a < t && (s *= 256);) i += this[e + a] * s;
                return s *= 128, i >= s && (i -= Math.pow(2, 8 * t)), i
            };
            q.prototype.readIntBE = function(e, t, n) {
                e = e >>> 0, t = t >>> 0, n || De(e, t, this.length);
                let i = t,
                    s = 1,
                    a = this[e + --i];
                for (; i > 0 && (s *= 256);) a += this[e + --i] * s;
                return s *= 128, a >= s && (a -= Math.pow(2, 8 * t)), a
            };
            q.prototype.readInt8 = function(e, t) {
                return e = e >>> 0, t || De(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e]
            };
            q.prototype.readInt16LE = function(e, t) {
                e = e >>> 0, t || De(e, 2, this.length);
                let n = this[e] | this[e + 1] << 8;
                return n & 32768 ? n | 4294901760 : n
            };
            q.prototype.readInt16BE = function(e, t) {
                e = e >>> 0, t || De(e, 2, this.length);
                let n = this[e + 1] | this[e] << 8;
                return n & 32768 ? n | 4294901760 : n
            };
            q.prototype.readInt32LE = function(e, t) {
                return e = e >>> 0, t || De(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
            };
            q.prototype.readInt32BE = function(e, t) {
                return e = e >>> 0, t || De(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
            };
            q.prototype.readBigInt64LE = Zt(function(e) {
                e = e >>> 0, tn(e, "offset");
                let t = this[e],
                    n = this[e + 7];
                (t === void 0 || n === void 0) && Fn(e, this.length - 8);
                let i = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (n << 24);
                return (BigInt(i) << BigInt(32)) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24)
            });
            q.prototype.readBigInt64BE = Zt(function(e) {
                e = e >>> 0, tn(e, "offset");
                let t = this[e],
                    n = this[e + 7];
                (t === void 0 || n === void 0) && Fn(e, this.length - 8);
                let i = (t << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
                return (BigInt(i) << BigInt(32)) + BigInt(this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n)
            });
            q.prototype.readFloatLE = function(e, t) {
                return e = e >>> 0, t || De(e, 4, this.length), en.read(this, e, !0, 23, 4)
            };
            q.prototype.readFloatBE = function(e, t) {
                return e = e >>> 0, t || De(e, 4, this.length), en.read(this, e, !1, 23, 4)
            };
            q.prototype.readDoubleLE = function(e, t) {
                return e = e >>> 0, t || De(e, 8, this.length), en.read(this, e, !0, 52, 8)
            };
            q.prototype.readDoubleBE = function(e, t) {
                return e = e >>> 0, t || De(e, 8, this.length), en.read(this, e, !1, 52, 8)
            };

            function Qe(r, e, t, n, i, s) {
                if (!q.isBuffer(r)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (e > i || e < s) throw new RangeError('"value" argument is out of bounds');
                if (t + n > r.length) throw new RangeError("Index out of range")
            }
            q.prototype.writeUintLE = q.prototype.writeUIntLE = function(e, t, n, i) {
                if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
                    let f = Math.pow(2, 8 * n) - 1;
                    Qe(this, e, t, n, f, 0)
                }
                let s = 1,
                    a = 0;
                for (this[t] = e & 255; ++a < n && (s *= 256);) this[t + a] = e / s & 255;
                return t + n
            };
            q.prototype.writeUintBE = q.prototype.writeUIntBE = function(e, t, n, i) {
                if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
                    let f = Math.pow(2, 8 * n) - 1;
                    Qe(this, e, t, n, f, 0)
                }
                let s = n - 1,
                    a = 1;
                for (this[t + s] = e & 255; --s >= 0 && (a *= 256);) this[t + s] = e / a & 255;
                return t + n
            };
            q.prototype.writeUint8 = q.prototype.writeUInt8 = function(e, t, n) {
                return e = +e, t = t >>> 0, n || Qe(this, e, t, 1, 255, 0), this[t] = e & 255, t + 1
            };
            q.prototype.writeUint16LE = q.prototype.writeUInt16LE = function(e, t, n) {
                return e = +e, t = t >>> 0, n || Qe(this, e, t, 2, 65535, 0), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2
            };
            q.prototype.writeUint16BE = q.prototype.writeUInt16BE = function(e, t, n) {
                return e = +e, t = t >>> 0, n || Qe(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2
            };
            q.prototype.writeUint32LE = q.prototype.writeUInt32LE = function(e, t, n) {
                return e = +e, t = t >>> 0, n || Qe(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e & 255, t + 4
            };
            q.prototype.writeUint32BE = q.prototype.writeUInt32BE = function(e, t, n) {
                return e = +e, t = t >>> 0, n || Qe(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4
            };

            function Jd(r, e, t, n, i) {
                Xd(e, n, i, r, t, 7);
                let s = Number(e & BigInt(4294967295));
                r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s;
                let a = Number(e >> BigInt(32) & BigInt(4294967295));
                return r[t++] = a, a = a >> 8, r[t++] = a, a = a >> 8, r[t++] = a, a = a >> 8, r[t++] = a, t
            }

            function Zd(r, e, t, n, i) {
                Xd(e, n, i, r, t, 7);
                let s = Number(e & BigInt(4294967295));
                r[t + 7] = s, s = s >> 8, r[t + 6] = s, s = s >> 8, r[t + 5] = s, s = s >> 8, r[t + 4] = s;
                let a = Number(e >> BigInt(32) & BigInt(4294967295));
                return r[t + 3] = a, a = a >> 8, r[t + 2] = a, a = a >> 8, r[t + 1] = a, a = a >> 8, r[t] = a, t + 8
            }
            q.prototype.writeBigUInt64LE = Zt(function(e, t = 0) {
                return Jd(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"))
            });
            q.prototype.writeBigUInt64BE = Zt(function(e, t = 0) {
                return Zd(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"))
            });
            q.prototype.writeIntLE = function(e, t, n, i) {
                if (e = +e, t = t >>> 0, !i) {
                    let u = Math.pow(2, 8 * n - 1);
                    Qe(this, e, t, n, u - 1, -u)
                }
                let s = 0,
                    a = 1,
                    f = 0;
                for (this[t] = e & 255; ++s < n && (a *= 256);) e < 0 && f === 0 && this[t + s - 1] !== 0 && (f = 1), this[t + s] = (e / a >> 0) - f & 255;
                return t + n
            };
            q.prototype.writeIntBE = function(e, t, n, i) {
                if (e = +e, t = t >>> 0, !i) {
                    let u = Math.pow(2, 8 * n - 1);
                    Qe(this, e, t, n, u - 1, -u)
                }
                let s = n - 1,
                    a = 1,
                    f = 0;
                for (this[t + s] = e & 255; --s >= 0 && (a *= 256);) e < 0 && f === 0 && this[t + s + 1] !== 0 && (f = 1), this[t + s] = (e / a >> 0) - f & 255;
                return t + n
            };
            q.prototype.writeInt8 = function(e, t, n) {
                return e = +e, t = t >>> 0, n || Qe(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = e & 255, t + 1
            };
            q.prototype.writeInt16LE = function(e, t, n) {
                return e = +e, t = t >>> 0, n || Qe(this, e, t, 2, 32767, -32768), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2
            };
            q.prototype.writeInt16BE = function(e, t, n) {
                return e = +e, t = t >>> 0, n || Qe(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2
            };
            q.prototype.writeInt32LE = function(e, t, n) {
                return e = +e, t = t >>> 0, n || Qe(this, e, t, 4, 2147483647, -2147483648), this[t] = e & 255, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4
            };
            q.prototype.writeInt32BE = function(e, t, n) {
                return e = +e, t = t >>> 0, n || Qe(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4
            };
            q.prototype.writeBigInt64LE = Zt(function(e, t = 0) {
                return Jd(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
            });
            q.prototype.writeBigInt64BE = Zt(function(e, t = 0) {
                return Zd(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
            });

            function Qd(r, e, t, n, i, s) {
                if (t + n > r.length) throw new RangeError("Index out of range");
                if (t < 0) throw new RangeError("Index out of range")
            }

            function e1(r, e, t, n, i) {
                return e = +e, t = t >>> 0, i || Qd(r, e, t, 4, 34028234663852886e22, -34028234663852886e22), en.write(r, e, t, n, 23, 4), t + 4
            }
            q.prototype.writeFloatLE = function(e, t, n) {
                return e1(this, e, t, !0, n)
            };
            q.prototype.writeFloatBE = function(e, t, n) {
                return e1(this, e, t, !1, n)
            };

            function t1(r, e, t, n, i) {
                return e = +e, t = t >>> 0, i || Qd(r, e, t, 8, 17976931348623157e292, -17976931348623157e292), en.write(r, e, t, n, 52, 8), t + 8
            }
            q.prototype.writeDoubleLE = function(e, t, n) {
                return t1(this, e, t, !0, n)
            };
            q.prototype.writeDoubleBE = function(e, t, n) {
                return t1(this, e, t, !1, n)
            };
            q.prototype.copy = function(e, t, n, i) {
                if (!q.isBuffer(e)) throw new TypeError("argument should be a Buffer");
                if (n || (n = 0), !i && i !== 0 && (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < n && (i = n), i === n || e.length === 0 || this.length === 0) return 0;
                if (t < 0) throw new RangeError("targetStart out of bounds");
                if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
                if (i < 0) throw new RangeError("sourceEnd out of bounds");
                i > this.length && (i = this.length), e.length - t < i - n && (i = e.length - t + n);
                let s = i - n;
                return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, n, i) : Uint8Array.prototype.set.call(e, this.subarray(n, i), t), s
            };
            q.prototype.fill = function(e, t, n, i) {
                if (typeof e == "string") {
                    if (typeof t == "string" ? (i = t, t = 0, n = this.length) : typeof n == "string" && (i = n, n = this.length), i !== void 0 && typeof i != "string") throw new TypeError("encoding must be a string");
                    if (typeof i == "string" && !q.isEncoding(i)) throw new TypeError("Unknown encoding: " + i);
                    if (e.length === 1) {
                        let a = e.charCodeAt(0);
                        (i === "utf8" && a < 128 || i === "latin1") && (e = a)
                    }
                } else typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
                if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
                if (n <= t) return this;
                t = t >>> 0, n = n === void 0 ? this.length : n >>> 0, e || (e = 0);
                let s;
                if (typeof e == "number")
                    for (s = t; s < n; ++s) this[s] = e;
                else {
                    let a = q.isBuffer(e) ? e : q.from(e, i),
                        f = a.length;
                    if (f === 0) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                    for (s = 0; s < n - t; ++s) this[s + t] = a[s % f]
                }
                return this
            };
            var rn = {};

            function Fa(r, e, t) {
                rn[r] = class extends t {
                    constructor() {
                        super();
                        Object.defineProperty(this, "message", {
                            value: e.apply(this, arguments),
                            writable: !0,
                            configurable: !0
                        }), this.name = `${this.name} [${r}]`, this.stack, delete this.name
                    }
                    get code() {
                        return r
                    }
                    set code(i) {
                        Object.defineProperty(this, "code", {
                            configurable: !0,
                            enumerable: !0,
                            value: i,
                            writable: !0
                        })
                    }
                    toString() {
                        return `${this.name} [${r}]: ${this.message}`
                    }
                }
            }
            Fa("ERR_BUFFER_OUT_OF_BOUNDS", function(r) {
                return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds"
            }, RangeError);
            Fa("ERR_INVALID_ARG_TYPE", function(r, e) {
                return `The "${r}" argument must be of type number. Received type ${typeof e}`
            }, TypeError);
            Fa("ERR_OUT_OF_RANGE", function(r, e, t) {
                let n = `The value of "${r}" is out of range.`,
                    i = t;
                return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? i = r1(String(t)) : typeof t == "bigint" && (i = String(t), (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (i = r1(i)), i += "n"), n += ` It must be ${e}. Received ${i}`, n
            }, RangeError);

            function r1(r) {
                let e = "",
                    t = r.length,
                    n = r[0] === "-" ? 1 : 0;
                for (; t >= n + 4; t -= 3) e = `_${r.slice(t-3,t)}${e}`;
                return `${r.slice(0,t)}${e}`
            }

            function hS(r, e, t) {
                tn(e, "offset"), (r[e] === void 0 || r[e + t] === void 0) && Fn(e, r.length - (t + 1))
            }

            function Xd(r, e, t, n, i, s) {
                if (r > t || r < e) {
                    let a = typeof e == "bigint" ? "n" : "",
                        f;
                    throw s > 3 ? e === 0 || e === BigInt(0) ? f = `>= 0${a} and < 2${a} ** ${(s+1)*8}${a}` : f = `>= -(2${a} ** ${(s+1)*8-1}${a}) and < 2 ** ${(s+1)*8-1}${a}` : f = `>= ${e}${a} and <= ${t}${a}`, new rn.ERR_OUT_OF_RANGE("value", f, r)
                }
                hS(n, i, s)
            }

            function tn(r, e) {
                if (typeof r != "number") throw new rn.ERR_INVALID_ARG_TYPE(e, "number", r)
            }

            function Fn(r, e, t) {
                throw Math.floor(r) !== r ? (tn(r, t), new rn.ERR_OUT_OF_RANGE(t || "offset", "an integer", r)) : e < 0 ? new rn.ERR_BUFFER_OUT_OF_BOUNDS : new rn.ERR_OUT_OF_RANGE(t || "offset", `>= ${t?1:0} and <= ${e}`, r)
            }
            var dS = /[^+/0-9A-Za-z-_]/g;

            function pS(r) {
                if (r = r.split("=")[0], r = r.trim().replace(dS, ""), r.length < 2) return "";
                for (; r.length % 4 != 0;) r = r + "=";
                return r
            }

            function Ua(r, e) {
                e = e || Infinity;
                let t, n = r.length,
                    i = null,
                    s = [];
                for (let a = 0; a < n; ++a) {
                    if (t = r.charCodeAt(a), t > 55295 && t < 57344) {
                        if (!i) {
                            if (t > 56319) {
                                (e -= 3) > -1 && s.push(239, 191, 189);
                                continue
                            } else if (a + 1 === n) {
                                (e -= 3) > -1 && s.push(239, 191, 189);
                                continue
                            }
                            i = t;
                            continue
                        }
                        if (t < 56320) {
                            (e -= 3) > -1 && s.push(239, 191, 189), i = t;
                            continue
                        }
                        t = (i - 55296 << 10 | t - 56320) + 65536
                    } else i && (e -= 3) > -1 && s.push(239, 191, 189);
                    if (i = null, t < 128) {
                        if ((e -= 1) < 0) break;
                        s.push(t)
                    } else if (t < 2048) {
                        if ((e -= 2) < 0) break;
                        s.push(t >> 6 | 192, t & 63 | 128)
                    } else if (t < 65536) {
                        if ((e -= 3) < 0) break;
                        s.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128)
                    } else if (t < 1114112) {
                        if ((e -= 4) < 0) break;
                        s.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128)
                    } else throw new Error("Invalid code point")
                }
                return s
            }

            function sS(r) {
                let e = [];
                for (let t = 0; t < r.length; ++t) e.push(r.charCodeAt(t) & 255);
                return e
            }

            function uS(r, e) {
                let t, n, i, s = [];
                for (let a = 0; a < r.length && !((e -= 2) < 0); ++a) t = r.charCodeAt(a), n = t >> 8, i = t % 256, s.push(i), s.push(n);
                return s
            }

            function $d(r) {
                return qa.toByteArray(pS(r))
            }

            function zi(r, e, t, n) {
                let i;
                for (i = 0; i < n && !(i + t >= e.length || i >= r.length); ++i) e[i + t] = r[i];
                return i
            }

            function Ot(r, e) {
                return r instanceof e || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === e.name
            }

            function Ca(r) {
                return r !== r
            }
            var fS = function() {
                let r = "0123456789abcdef",
                    e = new Array(256);
                for (let t = 0; t < 16; ++t) {
                    let n = t * 16;
                    for (let i = 0; i < 16; ++i) e[n + i] = r[t] + r[i]
                }
                return e
            }();

            function Zt(r) {
                return typeof BigInt == "undefined" ? bS : r
            }

            function bS() {
                throw new Error("BigInt not supported")
            }
        });
        var Ln = h((n1, Hi) => {
            (function(r) {
                "use strict";
                var e, t = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
                    n = Math.ceil,
                    i = Math.floor,
                    s = "[BigNumber Error] ",
                    a = s + "Number primitive has more than 15 significant digits: ",
                    f = 1e14,
                    u = 14,
                    b = 9007199254740991,
                    y = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
                    E = 1e7,
                    z = 1e9;

                function d(D) {
                    var M, R, X, G = P.prototype = {
                            constructor: P,
                            toString: null,
                            valueOf: null
                        },
                        be = new P(1),
                        le = 20,
                        pe = 4,
                        Y = -7,
                        ke = 21,
                        Ue = -1e7,
                        Ae = 1e7,
                        Me = !1,
                        Ie = 1,
                        Ge = 0,
                        Ct = {
                            prefix: "",
                            groupSize: 3,
                            secondaryGroupSize: 0,
                            groupSeparator: ",",
                            decimalSeparator: ".",
                            fractionGroupSize: 0,
                            fractionGroupSeparator: "\xA0",
                            suffix: ""
                        },
                        ht = "0123456789abcdefghijklmnopqrstuvwxyz";

                    function P(o, l) {
                        var p, m, g, A, _, w, S, N, T = this;
                        if (!(T instanceof P)) return new P(o, l);
                        if (l == null) {
                            if (o && o._isBigNumber === !0) {
                                T.s = o.s, !o.c || o.e > Ae ? T.c = T.e = null : o.e < Ue ? T.c = [T.e = 0] : (T.e = o.e, T.c = o.c.slice());
                                return
                            }
                            if ((w = typeof o == "number") && o * 0 == 0) {
                                if (T.s = 1 / o < 0 ? (o = -o, -1) : 1, o === ~~o) {
                                    for (A = 0, _ = o; _ >= 10; _ /= 10, A++);
                                    A > Ae ? T.c = T.e = null : (T.e = A, T.c = [o]);
                                    return
                                }
                                N = String(o)
                            } else {
                                if (!t.test(N = String(o))) return X(T, N, w);
                                T.s = N.charCodeAt(0) == 45 ? (N = N.slice(1), -1) : 1
                            }(A = N.indexOf(".")) > -1 && (N = N.replace(".", "")), (_ = N.search(/e/i)) > 0 ? (A < 0 && (A = _), A += +N.slice(_ + 1), N = N.substring(0, _)) : A < 0 && (A = N.length)
                        } else {
                            if (F(l, 2, ht.length, "Base"), l == 10) return T = new P(o), B(T, le + T.e + 1, pe);
                            if (N = String(o), w = typeof o == "number") {
                                if (o * 0 != 0) return X(T, N, w, l);
                                if (T.s = 1 / o < 0 ? (N = N.slice(1), -1) : 1, P.DEBUG && N.replace(/^0\.0*|\./, "").length > 15) throw Error(a + o)
                            } else T.s = N.charCodeAt(0) === 45 ? (N = N.slice(1), -1) : 1;
                            for (p = ht.slice(0, l), A = _ = 0, S = N.length; _ < S; _++)
                                if (p.indexOf(m = N.charAt(_)) < 0) {
                                    if (m == ".") {
                                        if (_ > A) {
                                            A = S;
                                            continue
                                        }
                                    } else if (!g && (N == N.toUpperCase() && (N = N.toLowerCase()) || N == N.toLowerCase() && (N = N.toUpperCase()))) {
                                        g = !0, _ = -1, A = 0;
                                        continue
                                    }
                                    return X(T, String(o), w, l)
                                } w = !1, N = R(N, l, 10, T.s), (A = N.indexOf(".")) > -1 ? N = N.replace(".", "") : A = N.length
                        }
                        for (_ = 0; N.charCodeAt(_) === 48; _++);
                        for (S = N.length; N.charCodeAt(--S) === 48;);
                        if (N = N.slice(_, ++S)) {
                            if (S -= _, w && P.DEBUG && S > 15 && (o > b || o !== i(o))) throw Error(a + T.s * o);
                            if ((A = A - _ - 1) > Ae) T.c = T.e = null;
                            else if (A < Ue) T.c = [T.e = 0];
                            else {
                                if (T.e = A, T.c = [], _ = (A + 1) % u, A < 0 && (_ += u), _ < S) {
                                    for (_ && T.c.push(+N.slice(0, _)), S -= u; _ < S;) T.c.push(+N.slice(_, _ += u));
                                    _ = u - (N = N.slice(_)).length
                                } else _ -= S;
                                for (; _--; N += "0");
                                T.c.push(+N)
                            }
                        } else T.c = [T.e = 0]
                    }
                    P.clone = d, P.ROUND_UP = 0, P.ROUND_DOWN = 1, P.ROUND_CEIL = 2, P.ROUND_FLOOR = 3, P.ROUND_HALF_UP = 4, P.ROUND_HALF_DOWN = 5, P.ROUND_HALF_EVEN = 6, P.ROUND_HALF_CEIL = 7, P.ROUND_HALF_FLOOR = 8, P.EUCLID = 9, P.config = P.set = function(o) {
                        var l, p;
                        if (o != null)
                            if (typeof o == "object") {
                                if (o.hasOwnProperty(l = "DECIMAL_PLACES") && (p = o[l], F(p, 0, z, l), le = p), o.hasOwnProperty(l = "ROUNDING_MODE") && (p = o[l], F(p, 0, 8, l), pe = p), o.hasOwnProperty(l = "EXPONENTIAL_AT") && (p = o[l], p && p.pop ? (F(p[0], -z, 0, l), F(p[1], 0, z, l), Y = p[0], ke = p[1]) : (F(p, -z, z, l), Y = -(ke = p < 0 ? -p : p))), o.hasOwnProperty(l = "RANGE"))
                                    if (p = o[l], p && p.pop) F(p[0], -z, -1, l), F(p[1], 1, z, l), Ue = p[0], Ae = p[1];
                                    else if (F(p, -z, z, l), p) Ue = -(Ae = p < 0 ? -p : p);
                                else throw Error(s + l + " cannot be zero: " + p);
                                if (o.hasOwnProperty(l = "CRYPTO"))
                                    if (p = o[l], p === !!p)
                                        if (p)
                                            if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) Me = p;
                                            else throw Me = !p, Error(s + "crypto unavailable");
                                else Me = p;
                                else throw Error(s + l + " not true or false: " + p);
                                if (o.hasOwnProperty(l = "MODULO_MODE") && (p = o[l], F(p, 0, 9, l), Ie = p), o.hasOwnProperty(l = "POW_PRECISION") && (p = o[l], F(p, 0, z, l), Ge = p), o.hasOwnProperty(l = "FORMAT"))
                                    if (p = o[l], typeof p == "object") Ct = p;
                                    else throw Error(s + l + " not an object: " + p);
                                if (o.hasOwnProperty(l = "ALPHABET"))
                                    if (p = o[l], typeof p == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(p)) ht = p;
                                    else throw Error(s + l + " invalid: " + p)
                            } else throw Error(s + "Object expected: " + o);
                        return {
                            DECIMAL_PLACES: le,
                            ROUNDING_MODE: pe,
                            EXPONENTIAL_AT: [Y, ke],
                            RANGE: [Ue, Ae],
                            CRYPTO: Me,
                            MODULO_MODE: Ie,
                            POW_PRECISION: Ge,
                            FORMAT: Ct,
                            ALPHABET: ht
                        }
                    }, P.isBigNumber = function(o) {
                        if (!o || o._isBigNumber !== !0) return !1;
                        if (!P.DEBUG) return !0;
                        var l, p, m = o.c,
                            g = o.e,
                            A = o.s;
                        e: if ({}.toString.call(m) == "[object Array]") {
                            if ((A === 1 || A === -1) && g >= -z && g <= z && g === i(g)) {
                                if (m[0] === 0) {
                                    if (g === 0 && m.length === 1) return !0;
                                    break e
                                }
                                if (l = (g + 1) % u, l < 1 && (l += u), String(m[0]).length == l) {
                                    for (l = 0; l < m.length; l++)
                                        if (p = m[l], p < 0 || p >= f || p !== i(p)) break e;
                                    if (p !== 0) return !0
                                }
                            }
                        } else if (m === null && g === null && (A === null || A === 1 || A === -1)) return !0;
                        throw Error(s + "Invalid BigNumber: " + o)
                    }, P.maximum = P.max = function() {
                        return k(arguments, G.lt)
                    }, P.minimum = P.min = function() {
                        return k(arguments, G.gt)
                    }, P.random = function() {
                        var o = 9007199254740992,
                            l = Math.random() * o & 2097151 ? function() {
                                return i(Math.random() * o)
                            } : function() {
                                return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0)
                            };
                        return function(p) {
                            var m, g, A, _, w, S = 0,
                                N = [],
                                T = new P(be);
                            if (p == null ? p = le : F(p, 0, z), _ = n(p / u), Me)
                                if (crypto.getRandomValues) {
                                    for (m = crypto.getRandomValues(new Uint32Array(_ *= 2)); S < _;) w = m[S] * 131072 + (m[S + 1] >>> 11), w >= 9e15 ? (g = crypto.getRandomValues(new Uint32Array(2)), m[S] = g[0], m[S + 1] = g[1]) : (N.push(w % 1e14), S += 2);
                                    S = _ / 2
                                } else if (crypto.randomBytes) {
                                for (m = crypto.randomBytes(_ *= 7); S < _;) w = (m[S] & 31) * 281474976710656 + m[S + 1] * 1099511627776 + m[S + 2] * 4294967296 + m[S + 3] * 16777216 + (m[S + 4] << 16) + (m[S + 5] << 8) + m[S + 6], w >= 9e15 ? crypto.randomBytes(7).copy(m, S) : (N.push(w % 1e14), S += 7);
                                S = _ / 7
                            } else throw Me = !1, Error(s + "crypto unavailable");
                            if (!Me)
                                for (; S < _;) w = l(), w < 9e15 && (N[S++] = w % 1e14);
                            for (_ = N[--S], p %= u, _ && p && (w = y[u - p], N[S] = i(_ / w) * w); N[S] === 0; N.pop(), S--);
                            if (S < 0) N = [A = 0];
                            else {
                                for (A = -1; N[0] === 0; N.splice(0, 1), A -= u);
                                for (S = 1, w = N[0]; w >= 10; w /= 10, S++);
                                S < u && (A -= u - S)
                            }
                            return T.e = A, T.c = N, T
                        }
                    }(), P.sum = function() {
                        for (var o = 1, l = arguments, p = new P(l[0]); o < l.length;) p = p.plus(l[o++]);
                        return p
                    }, R = function() {
                        var o = "0123456789";

                        function l(p, m, g, A) {
                            for (var _, w = [0], S, N = 0, T = p.length; N < T;) {
                                for (S = w.length; S--; w[S] *= m);
                                for (w[0] += A.indexOf(p.charAt(N++)), _ = 0; _ < w.length; _++) w[_] > g - 1 && (w[_ + 1] == null && (w[_ + 1] = 0), w[_ + 1] += w[_] / g | 0, w[_] %= g)
                            }
                            return w.reverse()
                        }
                        return function(p, m, g, A, _) {
                            var w, S, N, T, O, W, j, ne, ge = p.indexOf("."),
                                we = le,
                                re = pe;
                            for (ge >= 0 && (T = Ge, Ge = 0, p = p.replace(".", ""), ne = new P(m), W = ne.pow(p.length - ge), Ge = T, ne.c = l($(U(W.c), W.e, "0"), 10, g, o), ne.e = ne.c.length), j = l(p, m, g, _ ? (w = ht, o) : (w = o, ht)), N = T = j.length; j[--T] == 0; j.pop());
                            if (!j[0]) return w.charAt(0);
                            if (ge < 0 ? --N : (W.c = j, W.e = N, W.s = A, W = M(W, ne, we, re, g), j = W.c, O = W.r, N = W.e), S = N + we + 1, ge = j[S], T = g / 2, O = O || S < 0 || j[S + 1] != null, O = re < 4 ? (ge != null || O) && (re == 0 || re == (W.s < 0 ? 3 : 2)) : ge > T || ge == T && (re == 4 || O || re == 6 && j[S - 1] & 1 || re == (W.s < 0 ? 8 : 7)), S < 1 || !j[0]) p = O ? $(w.charAt(1), -we, w.charAt(0)) : w.charAt(0);
                            else {
                                if (j.length = S, O)
                                    for (--g; ++j[--S] > g;) j[S] = 0, S || (++N, j = [1].concat(j));
                                for (T = j.length; !j[--T];);
                                for (ge = 0, p = ""; ge <= T; p += w.charAt(j[ge++]));
                                p = $(p, N, w.charAt(0))
                            }
                            return p
                        }
                    }(), M = function() {
                        function o(m, g, A) {
                            var _, w, S, N, T = 0,
                                O = m.length,
                                W = g % E,
                                j = g / E | 0;
                            for (m = m.slice(); O--;) S = m[O] % E, N = m[O] / E | 0, _ = j * S + N * W, w = W * S + _ % E * E + T, T = (w / A | 0) + (_ / E | 0) + j * N, m[O] = w % A;
                            return T && (m = [T].concat(m)), m
                        }

                        function l(m, g, A, _) {
                            var w, S;
                            if (A != _) S = A > _ ? 1 : -1;
                            else
                                for (w = S = 0; w < A; w++)
                                    if (m[w] != g[w]) {
                                        S = m[w] > g[w] ? 1 : -1;
                                        break
                                    } return S
                        }

                        function p(m, g, A, _) {
                            for (var w = 0; A--;) m[A] -= w, w = m[A] < g[A] ? 1 : 0, m[A] = w * _ + m[A] - g[A];
                            for (; !m[0] && m.length > 1; m.splice(0, 1));
                        }
                        return function(m, g, A, _, w) {
                            var S, N, T, O, W, j, ne, ge, we, re, oe, Q, dt, _t, At, ze, it, ee = m.s == g.s ? 1 : -1,
                                Te = m.c,
                                me = g.c;
                            if (!Te || !Te[0] || !me || !me[0]) return new P(!m.s || !g.s || (Te ? me && Te[0] == me[0] : !me) ? NaN : Te && Te[0] == 0 || !me ? ee * 0 : ee / 0);
                            for (ge = new P(ee), we = ge.c = [], N = m.e - g.e, ee = A + N + 1, w || (w = f, N = I(m.e / u) - I(g.e / u), ee = ee / u | 0), T = 0; me[T] == (Te[T] || 0); T++);
                            if (me[T] > (Te[T] || 0) && N--, ee < 0) we.push(1), O = !0;
                            else {
                                for (_t = Te.length, ze = me.length, T = 0, ee += 2, W = i(w / (me[0] + 1)), W > 1 && (me = o(me, W, w), Te = o(Te, W, w), ze = me.length, _t = Te.length), dt = ze, re = Te.slice(0, ze), oe = re.length; oe < ze; re[oe++] = 0);
                                it = me.slice(), it = [0].concat(it), At = me[0], me[1] >= w / 2 && At++;
                                do {
                                    if (W = 0, S = l(me, re, ze, oe), S < 0) {
                                        if (Q = re[0], ze != oe && (Q = Q * w + (re[1] || 0)), W = i(Q / At), W > 1)
                                            for (W >= w && (W = w - 1), j = o(me, W, w), ne = j.length, oe = re.length; l(j, re, ne, oe) == 1;) W--, p(j, ze < ne ? it : me, ne, w), ne = j.length, S = 1;
                                        else W == 0 && (S = W = 1), j = me.slice(), ne = j.length;
                                        if (ne < oe && (j = [0].concat(j)), p(re, j, oe, w), oe = re.length, S == -1)
                                            for (; l(me, re, ze, oe) < 1;) W++, p(re, ze < oe ? it : me, oe, w), oe = re.length
                                    } else S === 0 && (W++, re = [0]);
                                    we[T++] = W, re[0] ? re[oe++] = Te[dt] || 0 : (re = [Te[dt]], oe = 1)
                                } while ((dt++ < _t || re[0] != null) && ee--);
                                O = re[0] != null, we[0] || we.splice(0, 1)
                            }
                            if (w == f) {
                                for (T = 1, ee = we[0]; ee >= 10; ee /= 10, T++);
                                B(ge, A + (ge.e = T + N * u - 1) + 1, _, O)
                            } else ge.e = N, ge.r = +O;
                            return ge
                        }
                    }();

                    function Ut(o, l, p, m) {
                        var g, A, _, w, S;
                        if (p == null ? p = pe : F(p, 0, 8), !o.c) return o.toString();
                        if (g = o.c[0], _ = o.e, l == null) S = U(o.c), S = m == 1 || m == 2 && (_ <= Y || _ >= ke) ? V(S, _) : $(S, _, "0");
                        else if (o = B(new P(o), l, p), A = o.e, S = U(o.c), w = S.length, m == 1 || m == 2 && (l <= A || A <= Y)) {
                            for (; w < l; S += "0", w++);
                            S = V(S, A)
                        } else if (l -= _, S = $(S, A, "0"), A + 1 > w) {
                            if (--l > 0)
                                for (S += "."; l--; S += "0");
                        } else if (l += A - w, l > 0)
                            for (A + 1 == w && (S += "."); l--; S += "0");
                        return o.s < 0 && g ? "-" + S : S
                    }

                    function k(o, l) {
                        for (var p, m = 1, g = new P(o[0]); m < o.length; m++)
                            if (p = new P(o[m]), p.s) l.call(g, p) && (g = p);
                            else {
                                g = p;
                                break
                            } return g
                    }

                    function c(o, l, p) {
                        for (var m = 1, g = l.length; !l[--g]; l.pop());
                        for (g = l[0]; g >= 10; g /= 10, m++);
                        return (p = m + p * u - 1) > Ae ? o.c = o.e = null : p < Ue ? o.c = [o.e = 0] : (o.e = p, o.c = l), o
                    }
                    X = function() {
                        var o = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
                            l = /^([^.]+)\.$/,
                            p = /^\.([^.]+)$/,
                            m = /^-?(Infinity|NaN)$/,
                            g = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
                        return function(A, _, w, S) {
                            var N, T = w ? _ : _.replace(g, "");
                            if (m.test(T)) A.s = isNaN(T) ? null : T < 0 ? -1 : 1;
                            else {
                                if (!w && (T = T.replace(o, function(O, W, j) {
                                        return N = (j = j.toLowerCase()) == "x" ? 16 : j == "b" ? 2 : 8, !S || S == N ? W : O
                                    }), S && (N = S, T = T.replace(l, "$1").replace(p, "0.$1")), _ != T)) return new P(T, N);
                                if (P.DEBUG) throw Error(s + "Not a" + (S ? " base " + S : "") + " number: " + _);
                                A.s = null
                            }
                            A.c = A.e = null
                        }
                    }();

                    function B(o, l, p, m) {
                        var g, A, _, w, S, N, T, O = o.c,
                            W = y;
                        if (O) {
                            e: {
                                for (g = 1, w = O[0]; w >= 10; w /= 10, g++);
                                if (A = l - g, A < 0) A += u,
                                _ = l,
                                S = O[N = 0],
                                T = S / W[g - _ - 1] % 10 | 0;
                                else if (N = n((A + 1) / u), N >= O.length)
                                    if (m) {
                                        for (; O.length <= N; O.push(0));
                                        S = T = 0, g = 1, A %= u, _ = A - u + 1
                                    } else break e;
                                else {
                                    for (S = w = O[N], g = 1; w >= 10; w /= 10, g++);
                                    A %= u, _ = A - u + g, T = _ < 0 ? 0 : S / W[g - _ - 1] % 10 | 0
                                }
                                if (m = m || l < 0 || O[N + 1] != null || (_ < 0 ? S : S % W[g - _ - 1]), m = p < 4 ? (T || m) && (p == 0 || p == (o.s < 0 ? 3 : 2)) : T > 5 || T == 5 && (p == 4 || m || p == 6 && (A > 0 ? _ > 0 ? S / W[g - _] : 0 : O[N - 1]) % 10 & 1 || p == (o.s < 0 ? 8 : 7)), l < 1 || !O[0]) return O.length = 0,
                                m ? (l -= o.e + 1, O[0] = W[(u - l % u) % u], o.e = -l || 0) : O[0] = o.e = 0,
                                o;
                                if (A == 0 ? (O.length = N, w = 1, N--) : (O.length = N + 1, w = W[u - A], O[N] = _ > 0 ? i(S / W[g - _] % W[_]) * w : 0), m)
                                    for (;;)
                                        if (N == 0) {
                                            for (A = 1, _ = O[0]; _ >= 10; _ /= 10, A++);
                                            for (_ = O[0] += w, w = 1; _ >= 10; _ /= 10, w++);
                                            A != w && (o.e++, O[0] == f && (O[0] = 1));
                                            break
                                        } else {
                                            if (O[N] += w, O[N] != f) break;
                                            O[N--] = 0, w = 1
                                        } for (A = O.length; O[--A] === 0; O.pop());
                            }
                            o.e > Ae ? o.c = o.e = null : o.e < Ue && (o.c = [o.e = 0])
                        }
                        return o
                    }

                    function C(o) {
                        var l, p = o.e;
                        return p === null ? o.toString() : (l = U(o.c), l = p <= Y || p >= ke ? V(l, p) : $(l, p, "0"), o.s < 0 ? "-" + l : l)
                    }
                    return G.absoluteValue = G.abs = function() {
                        var o = new P(this);
                        return o.s < 0 && (o.s = 1), o
                    }, G.comparedTo = function(o, l) {
                        return se(this, new P(o, l))
                    }, G.decimalPlaces = G.dp = function(o, l) {
                        var p, m, g, A = this;
                        if (o != null) return F(o, 0, z), l == null ? l = pe : F(l, 0, 8), B(new P(A), o + A.e + 1, l);
                        if (!(p = A.c)) return null;
                        if (m = ((g = p.length - 1) - I(this.e / u)) * u, g = p[g])
                            for (; g % 10 == 0; g /= 10, m--);
                        return m < 0 && (m = 0), m
                    }, G.dividedBy = G.div = function(o, l) {
                        return M(this, new P(o, l), le, pe)
                    }, G.dividedToIntegerBy = G.idiv = function(o, l) {
                        return M(this, new P(o, l), 0, 1)
                    }, G.exponentiatedBy = G.pow = function(o, l) {
                        var p, m, g, A, _, w, S, N, T, O = this;
                        if (o = new P(o), o.c && !o.isInteger()) throw Error(s + "Exponent not an integer: " + C(o));
                        if (l != null && (l = new P(l)), w = o.e > 14, !O.c || !O.c[0] || O.c[0] == 1 && !O.e && O.c.length == 1 || !o.c || !o.c[0]) return T = new P(Math.pow(+C(O), w ? 2 - H(o) : +C(o))), l ? T.mod(l) : T;
                        if (S = o.s < 0, l) {
                            if (l.c ? !l.c[0] : !l.s) return new P(NaN);
                            m = !S && O.isInteger() && l.isInteger(), m && (O = O.mod(l))
                        } else {
                            if (o.e > 9 && (O.e > 0 || O.e < -1 || (O.e == 0 ? O.c[0] > 1 || w && O.c[1] >= 24e7 : O.c[0] < 8e13 || w && O.c[0] <= 9999975e7))) return A = (O.s < 0 && H(o), -0), O.e > -1 && (A = 1 / A), new P(S ? 1 / A : A);
                            Ge && (A = n(Ge / u + 2))
                        }
                        for (w ? (p = new P(.5), S && (o.s = 1), N = H(o)) : (g = Math.abs(+C(o)), N = g % 2), T = new P(be);;) {
                            if (N) {
                                if (T = T.times(O), !T.c) break;
                                A ? T.c.length > A && (T.c.length = A) : m && (T = T.mod(l))
                            }
                            if (g) {
                                if (g = i(g / 2), g === 0) break;
                                N = g % 2
                            } else if (o = o.times(p), B(o, o.e + 1, 1), o.e > 14) N = H(o);
                            else {
                                if (g = +C(o), g === 0) break;
                                N = g % 2
                            }
                            O = O.times(O), A ? O.c && O.c.length > A && (O.c.length = A) : m && (O = O.mod(l))
                        }
                        return m ? T : (S && (T = be.div(T)), l ? T.mod(l) : A ? B(T, Ge, pe, _) : T)
                    }, G.integerValue = function(o) {
                        var l = new P(this);
                        return o == null ? o = pe : F(o, 0, 8), B(l, l.e + 1, o)
                    }, G.isEqualTo = G.eq = function(o, l) {
                        return se(this, new P(o, l)) === 0
                    }, G.isFinite = function() {
                        return !!this.c
                    }, G.isGreaterThan = G.gt = function(o, l) {
                        return se(this, new P(o, l)) > 0
                    }, G.isGreaterThanOrEqualTo = G.gte = function(o, l) {
                        return (l = se(this, new P(o, l))) === 1 || l === 0
                    }, G.isInteger = function() {
                        return !!this.c && I(this.e / u) > this.c.length - 2
                    }, G.isLessThan = G.lt = function(o, l) {
                        return se(this, new P(o, l)) < 0
                    }, G.isLessThanOrEqualTo = G.lte = function(o, l) {
                        return (l = se(this, new P(o, l))) === -1 || l === 0
                    }, G.isNaN = function() {
                        return !this.s
                    }, G.isNegative = function() {
                        return this.s < 0
                    }, G.isPositive = function() {
                        return this.s > 0
                    }, G.isZero = function() {
                        return !!this.c && this.c[0] == 0
                    }, G.minus = function(o, l) {
                        var p, m, g, A, _ = this,
                            w = _.s;
                        if (o = new P(o, l), l = o.s, !w || !l) return new P(NaN);
                        if (w != l) return o.s = -l, _.plus(o);
                        var S = _.e / u,
                            N = o.e / u,
                            T = _.c,
                            O = o.c;
                        if (!S || !N) {
                            if (!T || !O) return T ? (o.s = -l, o) : new P(O ? _ : NaN);
                            if (!T[0] || !O[0]) return O[0] ? (o.s = -l, o) : new P(T[0] ? _ : (pe == 3, -0))
                        }
                        if (S = I(S), N = I(N), T = T.slice(), w = S - N) {
                            for ((A = w < 0) ? (w = -w, g = T) : (N = S, g = O), g.reverse(), l = w; l--; g.push(0));
                            g.reverse()
                        } else
                            for (m = (A = (w = T.length) < (l = O.length)) ? w : l, w = l = 0; l < m; l++)
                                if (T[l] != O[l]) {
                                    A = T[l] < O[l];
                                    break
                                } if (A && (g = T, T = O, O = g, o.s = -o.s), l = (m = O.length) - (p = T.length), l > 0)
                            for (; l--; T[p++] = 0);
                        for (l = f - 1; m > w;) {
                            if (T[--m] < O[m]) {
                                for (p = m; p && !T[--p]; T[p] = l);
                                --T[p], T[m] += f
                            }
                            T[m] -= O[m]
                        }
                        for (; T[0] == 0; T.splice(0, 1), --N);
                        return T[0] ? c(o, T, N) : (o.s = pe == 3 ? -1 : 1, o.c = [o.e = 0], o)
                    }, G.modulo = G.mod = function(o, l) {
                        var p, m, g = this;
                        return o = new P(o, l), !g.c || !o.s || o.c && !o.c[0] ? new P(NaN) : !o.c || g.c && !g.c[0] ? new P(g) : (Ie == 9 ? (m = o.s, o.s = 1, p = M(g, o, 0, 3), o.s = m, p.s *= m) : p = M(g, o, 0, Ie), o = g.minus(p.times(o)), !o.c[0] && Ie == 1 && (o.s = g.s), o)
                    }, G.multipliedBy = G.times = function(o, l) {
                        var p, m, g, A, _, w, S, N, T, O, W, j, ne, ge, we, re = this,
                            oe = re.c,
                            Q = (o = new P(o, l)).c;
                        if (!oe || !Q || !oe[0] || !Q[0]) return !re.s || !o.s || oe && !oe[0] && !Q || Q && !Q[0] && !oe ? o.c = o.e = o.s = null : (o.s *= re.s, !oe || !Q ? o.c = o.e = null : (o.c = [0], o.e = 0)), o;
                        for (m = I(re.e / u) + I(o.e / u), o.s *= re.s, S = oe.length, O = Q.length, S < O && (ne = oe, oe = Q, Q = ne, g = S, S = O, O = g), g = S + O, ne = []; g--; ne.push(0));
                        for (ge = f, we = E, g = O; --g >= 0;) {
                            for (p = 0, W = Q[g] % we, j = Q[g] / we | 0, _ = S, A = g + _; A > g;) N = oe[--_] % we, T = oe[_] / we | 0, w = j * N + T * W, N = W * N + w % we * we + ne[A] + p, p = (N / ge | 0) + (w / we | 0) + j * T, ne[A--] = N % ge;
                            ne[A] = p
                        }
                        return p ? ++m : ne.splice(0, 1), c(o, ne, m)
                    }, G.negated = function() {
                        var o = new P(this);
                        return o.s = -o.s || null, o
                    }, G.plus = function(o, l) {
                        var p, m = this,
                            g = m.s;
                        if (o = new P(o, l), l = o.s, !g || !l) return new P(NaN);
                        if (g != l) return o.s = -l, m.minus(o);
                        var A = m.e / u,
                            _ = o.e / u,
                            w = m.c,
                            S = o.c;
                        if (!A || !_) {
                            if (!w || !S) return new P(g / 0);
                            if (!w[0] || !S[0]) return S[0] ? o : new P(w[0] ? m : g * 0)
                        }
                        if (A = I(A), _ = I(_), w = w.slice(), g = A - _) {
                            for (g > 0 ? (_ = A, p = S) : (g = -g, p = w), p.reverse(); g--; p.push(0));
                            p.reverse()
                        }
                        for (g = w.length, l = S.length, g - l < 0 && (p = S, S = w, w = p, l = g), g = 0; l;) g = (w[--l] = w[l] + S[l] + g) / f | 0, w[l] = f === w[l] ? 0 : w[l] % f;
                        return g && (w = [g].concat(w), ++_), c(o, w, _)
                    }, G.precision = G.sd = function(o, l) {
                        var p, m, g, A = this;
                        if (o != null && o !== !!o) return F(o, 1, z), l == null ? l = pe : F(l, 0, 8), B(new P(A), o, l);
                        if (!(p = A.c)) return null;
                        if (g = p.length - 1, m = g * u + 1, g = p[g]) {
                            for (; g % 10 == 0; g /= 10, m--);
                            for (g = p[0]; g >= 10; g /= 10, m++);
                        }
                        return o && A.e + 1 > m && (m = A.e + 1), m
                    }, G.shiftedBy = function(o) {
                        return F(o, -b, b), this.times("1e" + o)
                    }, G.squareRoot = G.sqrt = function() {
                        var o, l, p, m, g, A = this,
                            _ = A.c,
                            w = A.s,
                            S = A.e,
                            N = le + 4,
                            T = new P("0.5");
                        if (w !== 1 || !_ || !_[0]) return new P(!w || w < 0 && (!_ || _[0]) ? NaN : _ ? A : 1 / 0);
                        if (w = Math.sqrt(+C(A)), w == 0 || w == 1 / 0 ? (l = U(_), (l.length + S) % 2 == 0 && (l += "0"), w = Math.sqrt(+l), S = I((S + 1) / 2) - (S < 0 || S % 2), w == 1 / 0 ? l = "5e" + S : (l = w.toExponential(), l = l.slice(0, l.indexOf("e") + 1) + S), p = new P(l)) : p = new P(w + ""), p.c[0]) {
                            for (S = p.e, w = S + N, w < 3 && (w = 0);;)
                                if (g = p, p = T.times(g.plus(M(A, g, N, 1))), U(g.c).slice(0, w) === (l = U(p.c)).slice(0, w))
                                    if (p.e < S && --w, l = l.slice(w - 3, w + 1), l == "9999" || !m && l == "4999") {
                                        if (!m && (B(g, g.e + le + 2, 0), g.times(g).eq(A))) {
                                            p = g;
                                            break
                                        }
                                        N += 4, w += 4, m = 1
                                    } else {
                                        (!+l || !+l.slice(1) && l.charAt(0) == "5") && (B(p, p.e + le + 2, 1), o = !p.times(p).eq(A));
                                        break
                                    }
                        }
                        return B(p, p.e + le + 1, pe, o)
                    }, G.toExponential = function(o, l) {
                        return o != null && (F(o, 0, z), o++), Ut(this, o, l, 1)
                    }, G.toFixed = function(o, l) {
                        return o != null && (F(o, 0, z), o = o + this.e + 1), Ut(this, o, l)
                    }, G.toFormat = function(o, l, p) {
                        var m, g = this;
                        if (p == null) o != null && l && typeof l == "object" ? (p = l, l = null) : o && typeof o == "object" ? (p = o, o = l = null) : p = Ct;
                        else if (typeof p != "object") throw Error(s + "Argument not an object: " + p);
                        if (m = g.toFixed(o, l), g.c) {
                            var A, _ = m.split("."),
                                w = +p.groupSize,
                                S = +p.secondaryGroupSize,
                                N = p.groupSeparator || "",
                                T = _[0],
                                O = _[1],
                                W = g.s < 0,
                                j = W ? T.slice(1) : T,
                                ne = j.length;
                            if (S && (A = w, w = S, S = A, ne -= A), w > 0 && ne > 0) {
                                for (A = ne % w || w, T = j.substr(0, A); A < ne; A += w) T += N + j.substr(A, w);
                                S > 0 && (T += N + j.slice(A)), W && (T = "-" + T)
                            }
                            m = O ? T + (p.decimalSeparator || "") + ((S = +p.fractionGroupSize) ? O.replace(new RegExp("\\d{" + S + "}\\B", "g"), "$&" + (p.fractionGroupSeparator || "")) : O) : T
                        }
                        return (p.prefix || "") + m + (p.suffix || "")
                    }, G.toFraction = function(o) {
                        var l, p, m, g, A, _, w, S, N, T, O, W, j = this,
                            ne = j.c;
                        if (o != null && (w = new P(o), !w.isInteger() && (w.c || w.s !== 1) || w.lt(be))) throw Error(s + "Argument " + (w.isInteger() ? "out of range: " : "not an integer: ") + C(w));
                        if (!ne) return new P(j);
                        for (l = new P(be), N = p = new P(be), m = S = new P(be), W = U(ne), A = l.e = W.length - j.e - 1, l.c[0] = y[(_ = A % u) < 0 ? u + _ : _], o = !o || w.comparedTo(l) > 0 ? A > 0 ? l : N : w, _ = Ae, Ae = 1 / 0, w = new P(W), S.c[0] = 0; T = M(w, l, 0, 1), g = p.plus(T.times(m)), g.comparedTo(o) != 1;) p = m, m = g, N = S.plus(T.times(g = N)), S = g, l = w.minus(T.times(g = l)), w = g;
                        return g = M(o.minus(p), m, 0, 1), S = S.plus(g.times(N)), p = p.plus(g.times(m)), S.s = N.s = j.s, A = A * 2, O = M(N, m, A, pe).minus(j).abs().comparedTo(M(S, p, A, pe).minus(j).abs()) < 1 ? [N, m] : [S, p], Ae = _, O
                    }, G.toNumber = function() {
                        return +C(this)
                    }, G.toPrecision = function(o, l) {
                        return o != null && F(o, 1, z), Ut(this, o, l, 2)
                    }, G.toString = function(o) {
                        var l, p = this,
                            m = p.s,
                            g = p.e;
                        return g === null ? m ? (l = "Infinity", m < 0 && (l = "-" + l)) : l = "NaN" : (o == null ? l = g <= Y || g >= ke ? V(U(p.c), g) : $(U(p.c), g, "0") : o === 10 ? (p = B(new P(p), le + g + 1, pe), l = $(U(p.c), p.e, "0")) : (F(o, 2, ht.length, "Base"), l = R($(U(p.c), g, "0"), 10, o, m, !0)), m < 0 && p.c[0] && (l = "-" + l)), l
                    }, G.valueOf = G.toJSON = function() {
                        return C(this)
                    }, G._isBigNumber = !0, D != null && P.set(D), P
                }

                function I(D) {
                    var M = D | 0;
                    return D > 0 || D === M ? M : M - 1
                }

                function U(D) {
                    for (var M, R, X = 1, G = D.length, be = D[0] + ""; X < G;) {
                        for (M = D[X++] + "", R = u - M.length; R--; M = "0" + M);
                        be += M
                    }
                    for (G = be.length; be.charCodeAt(--G) === 48;);
                    return be.slice(0, G + 1 || 1)
                }

                function se(D, M) {
                    var R, X, G = D.c,
                        be = M.c,
                        le = D.s,
                        pe = M.s,
                        Y = D.e,
                        ke = M.e;
                    if (!le || !pe) return null;
                    if (R = G && !G[0], X = be && !be[0], R || X) return R ? X ? 0 : -pe : le;
                    if (le != pe) return le;
                    if (R = le < 0, X = Y == ke, !G || !be) return X ? 0 : !G ^ R ? 1 : -1;
                    if (!X) return Y > ke ^ R ? 1 : -1;
                    for (pe = (Y = G.length) < (ke = be.length) ? Y : ke, le = 0; le < pe; le++)
                        if (G[le] != be[le]) return G[le] > be[le] ^ R ? 1 : -1;
                    return Y == ke ? 0 : Y > ke ^ R ? 1 : -1
                }

                function F(D, M, R, X) {
                    if (D < M || D > R || D !== i(D)) throw Error(s + (X || "Argument") + (typeof D == "number" ? D < M || D > R ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(D))
                }

                function H(D) {
                    var M = D.c.length - 1;
                    return I(D.e / u) == M && D.c[M] % 2 != 0
                }

                function V(D, M) {
                    return (D.length > 1 ? D.charAt(0) + "." + D.slice(1) : D) + (M < 0 ? "e" : "e+") + M
                }

                function $(D, M, R) {
                    var X, G;
                    if (M < 0) {
                        for (G = R + "."; ++M; G += R);
                        D = G + D
                    } else if (X = D.length, ++M > X) {
                        for (G = R, M -= X; --M; G += R);
                        D += G
                    } else M < X && (D = D.slice(0, M) + "." + D.slice(M));
                    return D
                }
                e = d(), e.default = e.BigNumber = e, typeof define == "function" && define.amd ? define(function() {
                    return e
                }) : typeof Hi != "undefined" && Hi.exports ? Hi.exports = e : (r || (r = typeof self != "undefined" && self ? self : window), r.BigNumber = e)
            })(n1)
        });
        var s1 = h((Rq, i1) => {
            i1.exports = function(e, t, n) {
                var i = new e.Uint8Array(n),
                    s = t.pushInt,
                    a = t.pushInt32,
                    f = t.pushInt32Neg,
                    u = t.pushInt64,
                    b = t.pushInt64Neg,
                    y = t.pushFloat,
                    E = t.pushFloatSingle,
                    z = t.pushFloatDouble,
                    d = t.pushTrue,
                    I = t.pushFalse,
                    U = t.pushUndefined,
                    se = t.pushNull,
                    F = t.pushInfinity,
                    H = t.pushInfinityNeg,
                    V = t.pushNaN,
                    $ = t.pushNaNNeg,
                    D = t.pushArrayStart,
                    M = t.pushArrayStartFixed,
                    R = t.pushArrayStartFixed32,
                    X = t.pushArrayStartFixed64,
                    G = t.pushObjectStart,
                    be = t.pushObjectStartFixed,
                    le = t.pushObjectStartFixed32,
                    pe = t.pushObjectStartFixed64,
                    Y = t.pushByteString,
                    ke = t.pushByteStringStart,
                    Ue = t.pushUtf8String,
                    Ae = t.pushUtf8StringStart,
                    Me = t.pushSimpleUnassigned,
                    Ie = t.pushTagStart,
                    Ge = t.pushTagStart4,
                    Ct = t.pushTagStart8,
                    ht = t.pushTagUnassigned,
                    P = t.pushBreak,
                    Ut = e.Math.pow,
                    k = 0,
                    c = 0,
                    B = 0;

                function C(x) {
                    for (x = x | 0, k = 0, c = x;
                        (k | 0) < (c | 0) && (B = wm[i[k] & 255](i[k] | 0) | 0, !((B | 0) > 0)););
                    return B | 0
                }

                function o(x) {
                    return x = x | 0, ((k | 0) + (x | 0) | 0) < (c | 0) ? 0 : 1
                }

                function l(x) {
                    return x = x | 0, i[x | 0] << 8 | i[x + 1 | 0] | 0
                }

                function p(x) {
                    return x = x | 0, i[x | 0] << 24 | i[x + 1 | 0] << 16 | i[x + 2 | 0] << 8 | i[x + 3 | 0] | 0
                }

                function m(x) {
                    return x = x | 0, s(x | 0), k = k + 1 | 0, 0
                }

                function g(x) {
                    return x = x | 0, o(1) | 0 ? 1 : (s(i[k + 1 | 0] | 0), k = k + 2 | 0, 0)
                }

                function A(x) {
                    return x = x | 0, o(2) | 0 ? 1 : (s(l(k + 1 | 0) | 0), k = k + 3 | 0, 0)
                }

                function _(x) {
                    return x = x | 0, o(4) | 0 ? 1 : (a(l(k + 1 | 0) | 0, l(k + 3 | 0) | 0), k = k + 5 | 0, 0)
                }

                function w(x) {
                    return x = x | 0, o(8) | 0 ? 1 : (u(l(k + 1 | 0) | 0, l(k + 3 | 0) | 0, l(k + 5 | 0) | 0, l(k + 7 | 0) | 0), k = k + 9 | 0, 0)
                }

                function S(x) {
                    return x = x | 0, s(-1 - (x - 32 | 0) | 0), k = k + 1 | 0, 0
                }

                function N(x) {
                    return x = x | 0, o(1) | 0 ? 1 : (s(-1 - (i[k + 1 | 0] | 0) | 0), k = k + 2 | 0, 0)
                }

                function T(x) {
                    x = x | 0;
                    var ue = 0;
                    return o(2) | 0 ? 1 : (ue = l(k + 1 | 0) | 0, s(-1 - (ue | 0) | 0), k = k + 3 | 0, 0)
                }

                function O(x) {
                    return x = x | 0, o(4) | 0 ? 1 : (f(l(k + 1 | 0) | 0, l(k + 3 | 0) | 0), k = k + 5 | 0, 0)
                }

                function W(x) {
                    return x = x | 0, o(8) | 0 ? 1 : (b(l(k + 1 | 0) | 0, l(k + 3 | 0) | 0, l(k + 5 | 0) | 0, l(k + 7 | 0) | 0), k = k + 9 | 0, 0)
                }

                function j(x) {
                    x = x | 0;
                    var ue = 0,
                        ce = 0,
                        ae = 0;
                    return ae = x - 64 | 0, o(ae | 0) | 0 ? 1 : (ue = k + 1 | 0, ce = (k + 1 | 0) + (ae | 0) | 0, Y(ue | 0, ce | 0), k = ce | 0, 0)
                }

                function ne(x) {
                    x = x | 0;
                    var ue = 0,
                        ce = 0,
                        ae = 0;
                    return o(1) | 0 || (ae = i[k + 1 | 0] | 0, ue = k + 2 | 0, ce = (k + 2 | 0) + (ae | 0) | 0, o(ae + 1 | 0) | 0) ? 1 : (Y(ue | 0, ce | 0), k = ce | 0, 0)
                }

                function ge(x) {
                    x = x | 0;
                    var ue = 0,
                        ce = 0,
                        ae = 0;
                    return o(2) | 0 || (ae = l(k + 1 | 0) | 0, ue = k + 3 | 0, ce = (k + 3 | 0) + (ae | 0) | 0, o(ae + 2 | 0) | 0) ? 1 : (Y(ue | 0, ce | 0), k = ce | 0, 0)
                }

                function we(x) {
                    x = x | 0;
                    var ue = 0,
                        ce = 0,
                        ae = 0;
                    return o(4) | 0 || (ae = p(k + 1 | 0) | 0, ue = k + 5 | 0, ce = (k + 5 | 0) + (ae | 0) | 0, o(ae + 4 | 0) | 0) ? 1 : (Y(ue | 0, ce | 0), k = ce | 0, 0)
                }

                function re(x) {
                    return x = x | 0, 1
                }

                function oe(x) {
                    return x = x | 0, ke(), k = k + 1 | 0, 0
                }

                function Q(x) {
                    x = x | 0;
                    var ue = 0,
                        ce = 0,
                        ae = 0;
                    return ae = x - 96 | 0, o(ae | 0) | 0 ? 1 : (ue = k + 1 | 0, ce = (k + 1 | 0) + (ae | 0) | 0, Ue(ue | 0, ce | 0), k = ce | 0, 0)
                }

                function dt(x) {
                    x = x | 0;
                    var ue = 0,
                        ce = 0,
                        ae = 0;
                    return o(1) | 0 || (ae = i[k + 1 | 0] | 0, ue = k + 2 | 0, ce = (k + 2 | 0) + (ae | 0) | 0, o(ae + 1 | 0) | 0) ? 1 : (Ue(ue | 0, ce | 0), k = ce | 0, 0)
                }

                function _t(x) {
                    x = x | 0;
                    var ue = 0,
                        ce = 0,
                        ae = 0;
                    return o(2) | 0 || (ae = l(k + 1 | 0) | 0, ue = k + 3 | 0, ce = (k + 3 | 0) + (ae | 0) | 0, o(ae + 2 | 0) | 0) ? 1 : (Ue(ue | 0, ce | 0), k = ce | 0, 0)
                }

                function At(x) {
                    x = x | 0;
                    var ue = 0,
                        ce = 0,
                        ae = 0;
                    return o(4) | 0 || (ae = p(k + 1 | 0) | 0, ue = k + 5 | 0, ce = (k + 5 | 0) + (ae | 0) | 0, o(ae + 4 | 0) | 0) ? 1 : (Ue(ue | 0, ce | 0), k = ce | 0, 0)
                }

                function ze(x) {
                    return x = x | 0, 1
                }

                function it(x) {
                    return x = x | 0, Ae(), k = k + 1 | 0, 0
                }

                function ee(x) {
                    return x = x | 0, M(x - 128 | 0), k = k + 1 | 0, 0
                }

                function Te(x) {
                    return x = x | 0, o(1) | 0 ? 1 : (M(i[k + 1 | 0] | 0), k = k + 2 | 0, 0)
                }

                function me(x) {
                    return x = x | 0, o(2) | 0 ? 1 : (M(l(k + 1 | 0) | 0), k = k + 3 | 0, 0)
                }

                function pr(x) {
                    return x = x | 0, o(4) | 0 ? 1 : (R(l(k + 1 | 0) | 0, l(k + 3 | 0) | 0), k = k + 5 | 0, 0)
                }

                function br(x) {
                    return x = x | 0, o(8) | 0 ? 1 : (X(l(k + 1 | 0) | 0, l(k + 3 | 0) | 0, l(k + 5 | 0) | 0, l(k + 7 | 0) | 0), k = k + 9 | 0, 0)
                }

                function gr(x) {
                    return x = x | 0, D(), k = k + 1 | 0, 0
                }

                function ye(x) {
                    x = x | 0;
                    var ue = 0;
                    return ue = x - 160 | 0, o(ue | 0) | 0 ? 1 : (be(ue | 0), k = k + 1 | 0, 0)
                }

                function mr(x) {
                    return x = x | 0, o(1) | 0 ? 1 : (be(i[k + 1 | 0] | 0), k = k + 2 | 0, 0)
                }

                function yr(x) {
                    return x = x | 0, o(2) | 0 ? 1 : (be(l(k + 1 | 0) | 0), k = k + 3 | 0, 0)
                }

                function xr(x) {
                    return x = x | 0, o(4) | 0 ? 1 : (le(l(k + 1 | 0) | 0, l(k + 3 | 0) | 0), k = k + 5 | 0, 0)
                }

                function wr(x) {
                    return x = x | 0, o(8) | 0 ? 1 : (pe(l(k + 1 | 0) | 0, l(k + 3 | 0) | 0, l(k + 5 | 0) | 0, l(k + 7 | 0) | 0), k = k + 9 | 0, 0)
                }

                function Sr(x) {
                    return x = x | 0, G(), k = k + 1 | 0, 0
                }

                function pt(x) {
                    return x = x | 0, Ie(x - 192 | 0 | 0), k = k + 1 | 0, 0
                }

                function fn(x) {
                    return x = x | 0, Ie(x | 0), k = k + 1 | 0, 0
                }

                function hn(x) {
                    return x = x | 0, Ie(x | 0), k = k + 1 | 0, 0
                }

                function dn(x) {
                    return x = x | 0, Ie(x | 0), k = k + 1 | 0, 0
                }

                function pn(x) {
                    return x = x | 0, Ie(x | 0), k = k + 1 | 0, 0
                }

                function _e(x) {
                    return x = x | 0, Ie(x - 192 | 0 | 0), k = k + 1 | 0, 0
                }

                function bn(x) {
                    return x = x | 0, Ie(x | 0), k = k + 1 | 0, 0
                }

                function gn(x) {
                    return x = x | 0, Ie(x | 0), k = k + 1 | 0, 0
                }

                function mn(x) {
                    return x = x | 0, Ie(x | 0), k = k + 1 | 0, 0
                }

                function kr(x) {
                    return x = x | 0, o(1) | 0 ? 1 : (Ie(i[k + 1 | 0] | 0), k = k + 2 | 0, 0)
                }

                function Er(x) {
                    return x = x | 0, o(2) | 0 ? 1 : (Ie(l(k + 1 | 0) | 0), k = k + 3 | 0, 0)
                }

                function _r(x) {
                    return x = x | 0, o(4) | 0 ? 1 : (Ge(l(k + 1 | 0) | 0, l(k + 3 | 0) | 0), k = k + 5 | 0, 0)
                }

                function Ar(x) {
                    return x = x | 0, o(8) | 0 ? 1 : (Ct(l(k + 1 | 0) | 0, l(k + 3 | 0) | 0, l(k + 5 | 0) | 0, l(k + 7 | 0) | 0), k = k + 9 | 0, 0)
                }

                function Ee(x) {
                    return x = x | 0, Me((x | 0) - 224 | 0), k = k + 1 | 0, 0
                }

                function Ir(x) {
                    return x = x | 0, I(), k = k + 1 | 0, 0
                }

                function Tr(x) {
                    return x = x | 0, d(), k = k + 1 | 0, 0
                }

                function Nr(x) {
                    return x = x | 0, se(), k = k + 1 | 0, 0
                }

                function qr(x) {
                    return x = x | 0, U(), k = k + 1 | 0, 0
                }

                function Br(x) {
                    return x = x | 0, o(1) | 0 ? 1 : (Me(i[k + 1 | 0] | 0), k = k + 2 | 0, 0)
                }

                function Or(x) {
                    x = x | 0;
                    var ue = 0,
                        ce = 0,
                        ae = 1,
                        Vn = 0,
                        yn = 0,
                        DI = 0;
                    return o(2) | 0 ? 1 : (ue = i[k + 1 | 0] | 0, ce = i[k + 2 | 0] | 0, (ue | 0) & 128 && (ae = -1), Vn = +(((ue | 0) & 124) >> 2), yn = +(((ue | 0) & 3) << 8 | ce), +Vn == 0 ? y(+(+ae * 5960464477539063e-23 * +yn)) : +Vn == 31 ? +ae == 1 ? +yn > 0 ? V() : F() : +yn > 0 ? $() : H() : y(+(+ae * Ut(2, +(+Vn - 25)) * +(1024 + yn))), k = k + 3 | 0, 0)
                }

                function Pr(x) {
                    return x = x | 0, o(4) | 0 ? 1 : (E(i[k + 1 | 0] | 0, i[k + 2 | 0] | 0, i[k + 3 | 0] | 0, i[k + 4 | 0] | 0), k = k + 5 | 0, 0)
                }

                function vr(x) {
                    return x = x | 0, o(8) | 0 ? 1 : (z(i[k + 1 | 0] | 0, i[k + 2 | 0] | 0, i[k + 3 | 0] | 0, i[k + 4 | 0] | 0, i[k + 5 | 0] | 0, i[k + 6 | 0] | 0, i[k + 7 | 0] | 0, i[k + 8 | 0] | 0), k = k + 9 | 0, 0)
                }

                function he(x) {
                    return x = x | 0, 1
                }

                function Cr(x) {
                    return x = x | 0, P(), k = k + 1 | 0, 0
                }
                var wm = [m, m, m, m, m, m, m, m, m, m, m, m, m, m, m, m, m, m, m, m, m, m, m, m, g, A, _, w, he, he, he, he, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, S, N, T, O, W, he, he, he, he, j, j, j, j, j, j, j, j, j, j, j, j, j, j, j, j, j, j, j, j, j, j, j, j, ne, ge, we, re, he, he, he, oe, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, Q, dt, _t, At, ze, he, he, he, it, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, ee, Te, me, pr, br, he, he, he, gr, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, ye, mr, yr, xr, wr, he, he, he, Sr, pt, pt, pt, pt, pt, pt, _e, _e, _e, _e, _e, _e, _e, _e, _e, _e, _e, _e, _e, _e, _e, _e, _e, _e, kr, Er, _r, Ar, he, he, he, he, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ee, Ir, Tr, Nr, qr, Br, Or, Pr, vr, he, he, he, Cr];
                return {
                    parse: C
                }
            }
        });
        var Rn = h(nt => {
            "use strict";
            var La = Ln().BigNumber;
            nt.MT = {
                POS_INT: 0,
                NEG_INT: 1,
                BYTE_STRING: 2,
                UTF8_STRING: 3,
                ARRAY: 4,
                MAP: 5,
                TAG: 6,
                SIMPLE_FLOAT: 7
            };
            nt.TAG = {
                DATE_STRING: 0,
                DATE_EPOCH: 1,
                POS_BIGINT: 2,
                NEG_BIGINT: 3,
                DECIMAL_FRAC: 4,
                BIGFLOAT: 5,
                BASE64URL_EXPECTED: 21,
                BASE64_EXPECTED: 22,
                BASE16_EXPECTED: 23,
                CBOR: 24,
                URI: 32,
                BASE64URL: 33,
                BASE64: 34,
                REGEXP: 35,
                MIME: 36
            };
            nt.NUMBYTES = {
                ZERO: 0,
                ONE: 24,
                TWO: 25,
                FOUR: 26,
                EIGHT: 27,
                INDEFINITE: 31
            };
            nt.SIMPLE = {
                FALSE: 20,
                TRUE: 21,
                NULL: 22,
                UNDEFINED: 23
            };
            nt.SYMS = {
                NULL: Symbol("null"),
                UNDEFINED: Symbol("undef"),
                PARENT: Symbol("parent"),
                BREAK: Symbol("break"),
                STREAM: Symbol("stream")
            };
            nt.SHIFT32 = Math.pow(2, 32);
            nt.SHIFT16 = Math.pow(2, 16);
            nt.MAX_SAFE_HIGH = 2097151;
            nt.NEG_ONE = new La(-1);
            nt.TEN = new La(10);
            nt.TWO = new La(2);
            nt.PARENT = {
                ARRAY: 0,
                OBJECT: 1,
                MAP: 2,
                TAG: 3,
                BYTE_STRING: 4,
                UTF8_STRING: 5
            }
        });
        var ji = h(ft => {
            "use strict";
            var {
                Buffer: gS
            } = zt(), a1 = Ln().BigNumber, o1 = Rn(), u1 = o1.SHIFT32, mS = o1.SHIFT16, yS = 2097151;
            ft.parseHalf = function(e) {
                let t = e[0] & 128 ? -1 : 1,
                    n = (e[0] & 124) >> 2,
                    i = (e[0] & 3) << 8 | e[1];
                return n ? n === 31 ? t * (i ? 0 / 0 : Infinity) : t * Math.pow(2, n - 25) * (1024 + i) : t * 5960464477539063e-23 * i
            };

            function xS(r) {
                return r < 16 ? "0" + r.toString(16) : r.toString(16)
            }
            ft.arrayBufferToBignumber = function(r) {
                let e = r.byteLength,
                    t = "";
                for (let n = 0; n < e; n++) t += xS(r[n]);
                return new a1(t, 16)
            };
            ft.buildMap = r => {
                let e = new Map,
                    t = Object.keys(r),
                    n = t.length;
                for (let i = 0; i < n; i++) e.set(t[i], r[t[i]]);
                return e
            };
            ft.buildInt32 = (r, e) => r * mS + e;
            ft.buildInt64 = (r, e, t, n) => {
                let i = ft.buildInt32(r, e),
                    s = ft.buildInt32(t, n);
                return i > yS ? new a1(i).times(u1).plus(s) : i * u1 + s
            };
            ft.writeHalf = function(e, t) {
                let n = gS.allocUnsafe(4);
                n.writeFloatBE(t, 0);
                let i = n.readUInt32BE(0);
                if ((i & 8191) != 0) return !1;
                let s = i >> 16 & 32768,
                    a = i >> 23 & 255,
                    f = i & 8388607;
                if (a >= 113 && a <= 142) s += (a - 112 << 10) + (f >> 13);
                else if (a >= 103 && a < 113) {
                    if (f & (1 << 126 - a) - 1) return !1;
                    s += f + 8388608 >> 126 - a
                } else return !1;
                return e.writeUInt16BE(s, 0), !0
            };
            ft.keySorter = function(r, e) {
                let t = r[0].byteLength,
                    n = e[0].byteLength;
                return t > n ? 1 : n > t ? -1 : r[0].compare(e[0])
            };
            ft.isNegativeZero = r => r === 0 && 1 / r < 0;
            ft.nextPowerOf2 = r => {
                let e = 0;
                if (r && !(r & r - 1)) return r;
                for (; r !== 0;) r >>= 1, e += 1;
                return 1 << e
            }
        });
        var Ma = h((zq, c1) => {
            "use strict";
            var Ra = Rn(),
                wS = Ra.MT,
                Gi = Ra.SIMPLE,
                Da = Ra.SYMS,
                Dn = class {
                    constructor(e) {
                        if (typeof e != "number") throw new Error("Invalid Simple type: " + typeof e);
                        if (e < 0 || e > 255 || (e | 0) !== e) throw new Error("value must be a small positive integer: " + e);
                        this.value = e
                    }
                    toString() {
                        return "simple(" + this.value + ")"
                    }
                    inspect() {
                        return "simple(" + this.value + ")"
                    }
                    encodeCBOR(e) {
                        return e._pushInt(this.value, wS.SIMPLE_FLOAT)
                    }
                    static isSimple(e) {
                        return e instanceof Dn
                    }
                    static decode(e, t) {
                        switch (t == null && (t = !0), e) {
                            case Gi.FALSE:
                                return !1;
                            case Gi.TRUE:
                                return !0;
                            case Gi.NULL:
                                return t ? null : Da.NULL;
                            case Gi.UNDEFINED:
                                return t ? void 0 : Da.UNDEFINED;
                            case -1:
                                if (!t) throw new Error("Invalid BREAK");
                                return Da.BREAK;
                            default:
                                return new Dn(e)
                        }
                    }
                };
            c1.exports = Dn
        });
        var za = h((Hq, l1) => {
            "use strict";
            var Mn = class {
                constructor(e, t, n) {
                    if (this.tag = e, this.value = t, this.err = n, typeof this.tag != "number") throw new Error("Invalid tag type (" + typeof this.tag + ")");
                    if (this.tag < 0 || (this.tag | 0) !== this.tag) throw new Error("Tag must be a positive integer: " + this.tag)
                }
                toString() {
                    return `${this.tag}(${JSON.stringify(this.value)})`
                }
                encodeCBOR(e) {
                    return e._pushTag(this.tag), e.pushAny(this.value)
                }
                convert(e) {
                    let t, n;
                    if (n = e != null ? e[this.tag] : void 0, typeof n != "function" && (n = Mn["_tag" + this.tag], typeof n != "function")) return this;
                    try {
                        return n.call(Mn, this.value)
                    } catch (i) {
                        return t = i, this.err = t, this
                    }
                }
            };
            l1.exports = Mn
        });
        var Ha = h((jq, f1) => {
            "use strict";
            var {
                Buffer: nn
            } = zt(), h1 = Na(), SS = Ln().BigNumber, kS = s1(), Ke = ji(), xe = Rn(), ES = Ma(), _S = za(), {
                URL: AS
            } = hi(), hr = class {
                constructor(e) {
                    e = e || {}, !e.size || e.size < 65536 ? e.size = 65536 : e.size = Ke.nextPowerOf2(e.size), this._heap = new ArrayBuffer(e.size), this._heap8 = new Uint8Array(this._heap), this._buffer = nn.from(this._heap), this._reset(), this._knownTags = Object.assign({
                        0: t => new Date(t),
                        1: t => new Date(t * 1e3),
                        2: t => Ke.arrayBufferToBignumber(t),
                        3: t => xe.NEG_ONE.minus(Ke.arrayBufferToBignumber(t)),
                        4: t => xe.TEN.pow(t[0]).times(t[1]),
                        5: t => xe.TWO.pow(t[0]).times(t[1]),
                        32: t => new AS(t),
                        35: t => new RegExp(t)
                    }, e.tags), this.parser = kS(globalThis, {
                        log: console.log.bind(console),
                        pushInt: this.pushInt.bind(this),
                        pushInt32: this.pushInt32.bind(this),
                        pushInt32Neg: this.pushInt32Neg.bind(this),
                        pushInt64: this.pushInt64.bind(this),
                        pushInt64Neg: this.pushInt64Neg.bind(this),
                        pushFloat: this.pushFloat.bind(this),
                        pushFloatSingle: this.pushFloatSingle.bind(this),
                        pushFloatDouble: this.pushFloatDouble.bind(this),
                        pushTrue: this.pushTrue.bind(this),
                        pushFalse: this.pushFalse.bind(this),
                        pushUndefined: this.pushUndefined.bind(this),
                        pushNull: this.pushNull.bind(this),
                        pushInfinity: this.pushInfinity.bind(this),
                        pushInfinityNeg: this.pushInfinityNeg.bind(this),
                        pushNaN: this.pushNaN.bind(this),
                        pushNaNNeg: this.pushNaNNeg.bind(this),
                        pushArrayStart: this.pushArrayStart.bind(this),
                        pushArrayStartFixed: this.pushArrayStartFixed.bind(this),
                        pushArrayStartFixed32: this.pushArrayStartFixed32.bind(this),
                        pushArrayStartFixed64: this.pushArrayStartFixed64.bind(this),
                        pushObjectStart: this.pushObjectStart.bind(this),
                        pushObjectStartFixed: this.pushObjectStartFixed.bind(this),
                        pushObjectStartFixed32: this.pushObjectStartFixed32.bind(this),
                        pushObjectStartFixed64: this.pushObjectStartFixed64.bind(this),
                        pushByteString: this.pushByteString.bind(this),
                        pushByteStringStart: this.pushByteStringStart.bind(this),
                        pushUtf8String: this.pushUtf8String.bind(this),
                        pushUtf8StringStart: this.pushUtf8StringStart.bind(this),
                        pushSimpleUnassigned: this.pushSimpleUnassigned.bind(this),
                        pushTagUnassigned: this.pushTagUnassigned.bind(this),
                        pushTagStart: this.pushTagStart.bind(this),
                        pushTagStart4: this.pushTagStart4.bind(this),
                        pushTagStart8: this.pushTagStart8.bind(this),
                        pushBreak: this.pushBreak.bind(this)
                    }, this._heap)
                }
                get _depth() {
                    return this._parents.length
                }
                get _currentParent() {
                    return this._parents[this._depth - 1]
                }
                get _ref() {
                    return this._currentParent.ref
                }
                _closeParent() {
                    let e = this._parents.pop();
                    if (e.length > 0) throw new Error(`Missing ${e.length} elements`);
                    switch (e.type) {
                        case xe.PARENT.TAG:
                            this._push(this.createTag(e.ref[0], e.ref[1]));
                            break;
                        case xe.PARENT.BYTE_STRING:
                            this._push(this.createByteString(e.ref, e.length));
                            break;
                        case xe.PARENT.UTF8_STRING:
                            this._push(this.createUtf8String(e.ref, e.length));
                            break;
                        case xe.PARENT.MAP:
                            if (e.values % 2 > 0) throw new Error("Odd number of elements in the map");
                            this._push(this.createMap(e.ref, e.length));
                            break;
                        case xe.PARENT.OBJECT:
                            if (e.values % 2 > 0) throw new Error("Odd number of elements in the map");
                            this._push(this.createObject(e.ref, e.length));
                            break;
                        case xe.PARENT.ARRAY:
                            this._push(this.createArray(e.ref, e.length));
                            break;
                        default:
                            break
                    }
                    this._currentParent && this._currentParent.type === xe.PARENT.TAG && this._dec()
                }
                _dec() {
                    let e = this._currentParent;
                    e.length < 0 || (e.length--, e.length === 0 && this._closeParent())
                }
                _push(e, t) {
                    let n = this._currentParent;
                    switch (n.values++, n.type) {
                        case xe.PARENT.ARRAY:
                        case xe.PARENT.BYTE_STRING:
                        case xe.PARENT.UTF8_STRING:
                            n.length > -1 ? this._ref[this._ref.length - n.length] = e : this._ref.push(e), this._dec();
                            break;
                        case xe.PARENT.OBJECT:
                            n.tmpKey != null ? (this._ref[n.tmpKey] = e, n.tmpKey = null, this._dec()) : (n.tmpKey = e, typeof n.tmpKey != "string" && (n.type = xe.PARENT.MAP, n.ref = Ke.buildMap(n.ref)));
                            break;
                        case xe.PARENT.MAP:
                            n.tmpKey != null ? (this._ref.set(n.tmpKey, e), n.tmpKey = null, this._dec()) : n.tmpKey = e;
                            break;
                        case xe.PARENT.TAG:
                            this._ref.push(e), t || this._dec();
                            break;
                        default:
                            throw new Error("Unknown parent type")
                    }
                }
                _createParent(e, t, n) {
                    this._parents[this._depth] = {
                        type: t,
                        length: n,
                        ref: e,
                        values: 0,
                        tmpKey: null
                    }
                }
                _reset() {
                    this._res = [], this._parents = [{
                        type: xe.PARENT.ARRAY,
                        length: -1,
                        ref: this._res,
                        values: 0,
                        tmpKey: null
                    }]
                }
                createTag(e, t) {
                    let n = this._knownTags[e];
                    return n ? n(t) : new _S(e, t)
                }
                createMap(e, t) {
                    return e
                }
                createObject(e, t) {
                    return e
                }
                createArray(e, t) {
                    return e
                }
                createByteString(e, t) {
                    return nn.concat(e)
                }
                createByteStringFromHeap(e, t) {
                    return e === t ? nn.alloc(0) : nn.from(this._heap.slice(e, t))
                }
                createInt(e) {
                    return e
                }
                createInt32(e, t) {
                    return Ke.buildInt32(e, t)
                }
                createInt64(e, t, n, i) {
                    return Ke.buildInt64(e, t, n, i)
                }
                createFloat(e) {
                    return e
                }
                createFloatSingle(e, t, n, i) {
                    return h1.read([e, t, n, i], 0, !1, 23, 4)
                }
                createFloatDouble(e, t, n, i, s, a, f, u) {
                    return h1.read([e, t, n, i, s, a, f, u], 0, !1, 52, 8)
                }
                createInt32Neg(e, t) {
                    return -1 - Ke.buildInt32(e, t)
                }
                createInt64Neg(e, t, n, i) {
                    let s = Ke.buildInt32(e, t),
                        a = Ke.buildInt32(n, i);
                    return s > xe.MAX_SAFE_HIGH ? xe.NEG_ONE.minus(new SS(s).times(xe.SHIFT32).plus(a)) : -1 - (s * xe.SHIFT32 + a)
                }
                createTrue() {
                    return !0
                }
                createFalse() {
                    return !1
                }
                createNull() {
                    return null
                }
                createUndefined() {}
                createInfinity() {
                    return Infinity
                }
                createInfinityNeg() {
                    return -Infinity
                }
                createNaN() {
                    return NaN
                }
                createNaNNeg() {
                    return NaN
                }
                createUtf8String(e, t) {
                    return e.join("")
                }
                createUtf8StringFromHeap(e, t) {
                    return e === t ? "" : this._buffer.toString("utf8", e, t)
                }
                createSimpleUnassigned(e) {
                    return new ES(e)
                }
                pushInt(e) {
                    this._push(this.createInt(e))
                }
                pushInt32(e, t) {
                    this._push(this.createInt32(e, t))
                }
                pushInt64(e, t, n, i) {
                    this._push(this.createInt64(e, t, n, i))
                }
                pushFloat(e) {
                    this._push(this.createFloat(e))
                }
                pushFloatSingle(e, t, n, i) {
                    this._push(this.createFloatSingle(e, t, n, i))
                }
                pushFloatDouble(e, t, n, i, s, a, f, u) {
                    this._push(this.createFloatDouble(e, t, n, i, s, a, f, u))
                }
                pushInt32Neg(e, t) {
                    this._push(this.createInt32Neg(e, t))
                }
                pushInt64Neg(e, t, n, i) {
                    this._push(this.createInt64Neg(e, t, n, i))
                }
                pushTrue() {
                    this._push(this.createTrue())
                }
                pushFalse() {
                    this._push(this.createFalse())
                }
                pushNull() {
                    this._push(this.createNull())
                }
                pushUndefined() {
                    this._push(this.createUndefined())
                }
                pushInfinity() {
                    this._push(this.createInfinity())
                }
                pushInfinityNeg() {
                    this._push(this.createInfinityNeg())
                }
                pushNaN() {
                    this._push(this.createNaN())
                }
                pushNaNNeg() {
                    this._push(this.createNaNNeg())
                }
                pushArrayStart() {
                    this._createParent([], xe.PARENT.ARRAY, -1)
                }
                pushArrayStartFixed(e) {
                    this._createArrayStartFixed(e)
                }
                pushArrayStartFixed32(e, t) {
                    let n = Ke.buildInt32(e, t);
                    this._createArrayStartFixed(n)
                }
                pushArrayStartFixed64(e, t, n, i) {
                    let s = Ke.buildInt64(e, t, n, i);
                    this._createArrayStartFixed(s)
                }
                pushObjectStart() {
                    this._createObjectStartFixed(-1)
                }
                pushObjectStartFixed(e) {
                    this._createObjectStartFixed(e)
                }
                pushObjectStartFixed32(e, t) {
                    let n = Ke.buildInt32(e, t);
                    this._createObjectStartFixed(n)
                }
                pushObjectStartFixed64(e, t, n, i) {
                    let s = Ke.buildInt64(e, t, n, i);
                    this._createObjectStartFixed(s)
                }
                pushByteStringStart() {
                    this._parents[this._depth] = {
                        type: xe.PARENT.BYTE_STRING,
                        length: -1,
                        ref: [],
                        values: 0,
                        tmpKey: null
                    }
                }
                pushByteString(e, t) {
                    this._push(this.createByteStringFromHeap(e, t))
                }
                pushUtf8StringStart() {
                    this._parents[this._depth] = {
                        type: xe.PARENT.UTF8_STRING,
                        length: -1,
                        ref: [],
                        values: 0,
                        tmpKey: null
                    }
                }
                pushUtf8String(e, t) {
                    this._push(this.createUtf8StringFromHeap(e, t))
                }
                pushSimpleUnassigned(e) {
                    this._push(this.createSimpleUnassigned(e))
                }
                pushTagStart(e) {
                    this._parents[this._depth] = {
                        type: xe.PARENT.TAG,
                        length: 1,
                        ref: [e]
                    }
                }
                pushTagStart4(e, t) {
                    this.pushTagStart(Ke.buildInt32(e, t))
                }
                pushTagStart8(e, t, n, i) {
                    this.pushTagStart(Ke.buildInt64(e, t, n, i))
                }
                pushTagUnassigned(e) {
                    this._push(this.createTag(e))
                }
                pushBreak() {
                    if (this._currentParent.length > -1) throw new Error("Unexpected break");
                    this._closeParent()
                }
                _createObjectStartFixed(e) {
                    if (e === 0) {
                        this._push(this.createObject({}));
                        return
                    }
                    this._createParent({}, xe.PARENT.OBJECT, e)
                }
                _createArrayStartFixed(e) {
                    if (e === 0) {
                        this._push(this.createArray([]));
                        return
                    }
                    this._createParent(new Array(e), xe.PARENT.ARRAY, e)
                }
                _decode(e) {
                    if (e.byteLength === 0) throw new Error("Input too short");
                    this._reset(), this._heap8.set(e);
                    let t = this.parser.parse(e.byteLength);
                    if (this._depth > 1) {
                        for (; this._currentParent.length === 0;) this._closeParent();
                        if (this._depth > 1) throw new Error("Undeterminated nesting")
                    }
                    if (t > 0) throw new Error("Failed to parse");
                    if (this._res.length === 0) throw new Error("No valid result")
                }
                decodeFirst(e) {
                    return this._decode(e), this._res[0]
                }
                decodeAll(e) {
                    return this._decode(e), this._res
                }
                static decode(e, t) {
                    return typeof e == "string" && (e = nn.from(e, t || "hex")), new hr({
                        size: e.length
                    }).decodeFirst(e)
                }
                static decodeAll(e, t) {
                    return typeof e == "string" && (e = nn.from(e, t || "hex")), new hr({
                        size: e.length
                    }).decodeAll(e)
                }
            };
            hr.decodeFirst = hr.decode;
            f1.exports = hr
        });
        var b1 = h((Gq, d1) => {
            "use strict";
            var {
                Buffer: ja
            } = zt(), IS = Ha(), TS = ji(), $i = class extends IS {
                createTag(e, t) {
                    return `${e}(${t})`
                }
                createInt(e) {
                    return super.createInt(e).toString()
                }
                createInt32(e, t) {
                    return super.createInt32(e, t).toString()
                }
                createInt64(e, t, n, i) {
                    return super.createInt64(e, t, n, i).toString()
                }
                createInt32Neg(e, t) {
                    return super.createInt32Neg(e, t).toString()
                }
                createInt64Neg(e, t, n, i) {
                    return super.createInt64Neg(e, t, n, i).toString()
                }
                createTrue() {
                    return "true"
                }
                createFalse() {
                    return "false"
                }
                createFloat(e) {
                    let t = super.createFloat(e);
                    return TS.isNegativeZero(e) ? "-0_1" : `${t}_1`
                }
                createFloatSingle(e, t, n, i) {
                    return `${super.createFloatSingle(e,t,n,i)}_2`
                }
                createFloatDouble(e, t, n, i, s, a, f, u) {
                    return `${super.createFloatDouble(e,t,n,i,s,a,f,u)}_3`
                }
                createByteString(e, t) {
                    let n = e.join(", ");
                    return t === -1 ? `(_ ${n})` : `h'${n}`
                }
                createByteStringFromHeap(e, t) {
                    return `h'${ja.from(super.createByteStringFromHeap(e,t)).toString("hex")}'`
                }
                createInfinity() {
                    return "Infinity_1"
                }
                createInfinityNeg() {
                    return "-Infinity_1"
                }
                createNaN() {
                    return "NaN_1"
                }
                createNaNNeg() {
                    return "-NaN_1"
                }
                createNull() {
                    return "null"
                }
                createUndefined() {
                    return "undefined"
                }
                createSimpleUnassigned(e) {
                    return `simple(${e})`
                }
                createArray(e, t) {
                    let n = super.createArray(e, t);
                    return t === -1 ? `[_ ${n.join(", ")}]` : `[${n.join(", ")}]`
                }
                createMap(e, t) {
                    let n = super.createMap(e),
                        i = Array.from(n.keys()).reduce(p1(n), "");
                    return t === -1 ? `{_ ${i}}` : `{${i}}`
                }
                createObject(e, t) {
                    let n = super.createObject(e),
                        i = Object.keys(n).reduce(p1(n), "");
                    return t === -1 ? `{_ ${i}}` : `{${i}}`
                }
                createUtf8String(e, t) {
                    let n = e.join(", ");
                    return t === -1 ? `(_ ${n})` : `"${n}"`
                }
                createUtf8StringFromHeap(e, t) {
                    return `"${ja.from(super.createUtf8StringFromHeap(e,t)).toString("utf8")}"`
                }
                static diagnose(e, t) {
                    return typeof e == "string" && (e = ja.from(e, t || "hex")), new $i().decodeFirst(e)
                }
            };
            d1.exports = $i;

            function p1(r) {
                return (e, t) => e ? `${e}, ${t}: ${r[t]}` : `${t}: ${r[t]}`
            }
        });
        var w1 = h(($q, g1) => {
            "use strict";
            var {
                Buffer: Pt
            } = zt(), {
                URL: NS
            } = hi(), Ga = Ln().BigNumber, $a = ji(), ve = Rn(), St = ve.MT, Vi = ve.NUMBYTES, m1 = ve.SHIFT32, y1 = ve.SYMS, sn = ve.TAG, qS = ve.MT.SIMPLE_FLOAT << 5 | ve.NUMBYTES.TWO, BS = ve.MT.SIMPLE_FLOAT << 5 | ve.NUMBYTES.FOUR, OS = ve.MT.SIMPLE_FLOAT << 5 | ve.NUMBYTES.EIGHT, PS = ve.MT.SIMPLE_FLOAT << 5 | ve.SIMPLE.TRUE, vS = ve.MT.SIMPLE_FLOAT << 5 | ve.SIMPLE.FALSE, CS = ve.MT.SIMPLE_FLOAT << 5 | ve.SIMPLE.UNDEFINED, x1 = ve.MT.SIMPLE_FLOAT << 5 | ve.SIMPLE.NULL, US = new Ga("0x20000000000000"), FS = Pt.from("f97e00", "hex"), LS = Pt.from("f9fc00", "hex"), RS = Pt.from("f97c00", "hex");

            function DS(r) {
                return {}.toString.call(r).slice(8, -1)
            }
            var zn = class {
                constructor(e) {
                    e = e || {}, this.streaming = typeof e.stream == "function", this.onData = e.stream, this.semanticTypes = [
                        [NS, this._pushUrl],
                        [Ga, this._pushBigNumber]
                    ];
                    let t = e.genTypes || [],
                        n = t.length;
                    for (let i = 0; i < n; i++) this.addSemanticType(t[i][0], t[i][1]);
                    this._reset()
                }
                addSemanticType(e, t) {
                    let n = this.semanticTypes.length;
                    for (let i = 0; i < n; i++)
                        if (this.semanticTypes[i][0] === e) {
                            let a = this.semanticTypes[i][1];
                            return this.semanticTypes[i][1] = t, a
                        } return this.semanticTypes.push([e, t]), null
                }
                push(e) {
                    return e && (this.result[this.offset] = e, this.resultMethod[this.offset] = 0, this.resultLength[this.offset] = e.length, this.offset++, this.streaming && this.onData(this.finalize())), !0
                }
                pushWrite(e, t, n) {
                    return this.result[this.offset] = e, this.resultMethod[this.offset] = t, this.resultLength[this.offset] = n, this.offset++, this.streaming && this.onData(this.finalize()), !0
                }
                _pushUInt8(e) {
                    return this.pushWrite(e, 1, 1)
                }
                _pushUInt16BE(e) {
                    return this.pushWrite(e, 2, 2)
                }
                _pushUInt32BE(e) {
                    return this.pushWrite(e, 3, 4)
                }
                _pushDoubleBE(e) {
                    return this.pushWrite(e, 4, 8)
                }
                _pushNaN() {
                    return this.push(FS)
                }
                _pushInfinity(e) {
                    let t = e < 0 ? LS : RS;
                    return this.push(t)
                }
                _pushFloat(e) {
                    let t = Pt.allocUnsafe(2);
                    if ($a.writeHalf(t, e) && $a.parseHalf(t) === e) return this._pushUInt8(qS) && this.push(t);
                    let n = Pt.allocUnsafe(4);
                    return n.writeFloatBE(e, 0), n.readFloatBE(0) === e ? this._pushUInt8(BS) && this.push(n) : this._pushUInt8(OS) && this._pushDoubleBE(e)
                }
                _pushInt(e, t, n) {
                    let i = t << 5;
                    return e < 24 ? this._pushUInt8(i | e) : e <= 255 ? this._pushUInt8(i | Vi.ONE) && this._pushUInt8(e) : e <= 65535 ? this._pushUInt8(i | Vi.TWO) && this._pushUInt16BE(e) : e <= 4294967295 ? this._pushUInt8(i | Vi.FOUR) && this._pushUInt32BE(e) : e <= Number.MAX_SAFE_INTEGER ? this._pushUInt8(i | Vi.EIGHT) && this._pushUInt32BE(Math.floor(e / m1)) && this._pushUInt32BE(e % m1) : t === St.NEG_INT ? this._pushFloat(n) : this._pushFloat(e)
                }
                _pushIntNum(e) {
                    return e < 0 ? this._pushInt(-e - 1, St.NEG_INT, e) : this._pushInt(e, St.POS_INT)
                }
                _pushNumber(e) {
                    switch (!1) {
                        case e === e:
                            return this._pushNaN(e);
                        case isFinite(e):
                            return this._pushInfinity(e);
                        case e % 1 != 0:
                            return this._pushIntNum(e);
                        default:
                            return this._pushFloat(e)
                    }
                }
                _pushString(e) {
                    let t = Pt.byteLength(e, "utf8");
                    return this._pushInt(t, St.UTF8_STRING) && this.pushWrite(e, 5, t)
                }
                _pushBoolean(e) {
                    return this._pushUInt8(e ? PS : vS)
                }
                _pushUndefined(e) {
                    return this._pushUInt8(CS)
                }
                _pushArray(e, t) {
                    let n = t.length;
                    if (!e._pushInt(n, St.ARRAY)) return !1;
                    for (let i = 0; i < n; i++)
                        if (!e.pushAny(t[i])) return !1;
                    return !0
                }
                _pushTag(e) {
                    return this._pushInt(e, St.TAG)
                }
                _pushDate(e, t) {
                    return e._pushTag(sn.DATE_EPOCH) && e.pushAny(Math.round(t / 1e3))
                }
                _pushBuffer(e, t) {
                    return e._pushInt(t.length, St.BYTE_STRING) && e.push(t)
                }
                _pushNoFilter(e, t) {
                    return e._pushBuffer(e, t.slice())
                }
                _pushRegexp(e, t) {
                    return e._pushTag(sn.REGEXP) && e.pushAny(t.source)
                }
                _pushSet(e, t) {
                    if (!e._pushInt(t.size, St.ARRAY)) return !1;
                    for (let n of t)
                        if (!e.pushAny(n)) return !1;
                    return !0
                }
                _pushUrl(e, t) {
                    return e._pushTag(sn.URI) && e.pushAny(t.format())
                }
                _pushBigint(e) {
                    let t = sn.POS_BIGINT;
                    e.isNegative() && (e = e.negated().minus(1), t = sn.NEG_BIGINT);
                    let n = e.toString(16);
                    n.length % 2 && (n = "0" + n);
                    let i = Pt.from(n, "hex");
                    return this._pushTag(t) && this._pushBuffer(this, i)
                }
                _pushBigNumber(e, t) {
                    if (t.isNaN()) return e._pushNaN();
                    if (!t.isFinite()) return e._pushInfinity(t.isNegative() ? -Infinity : Infinity);
                    if (t.isInteger()) return e._pushBigint(t);
                    if (!(e._pushTag(sn.DECIMAL_FRAC) && e._pushInt(2, St.ARRAY))) return !1;
                    let n = t.decimalPlaces(),
                        i = t.multipliedBy(new Ga(10).pow(n));
                    return e._pushIntNum(-n) ? i.abs().isLessThan(US) ? e._pushIntNum(i.toNumber()) : e._pushBigint(i) : !1
                }
                _pushMap(e, t) {
                    return e._pushInt(t.size, St.MAP) ? this._pushRawMap(t.size, Array.from(t)) : !1
                }
                _pushObject(e) {
                    if (!e) return this._pushUInt8(x1);
                    let t = this.semanticTypes.length;
                    for (let a = 0; a < t; a++)
                        if (e instanceof this.semanticTypes[a][0]) return this.semanticTypes[a][1].call(e, this, e);
                    let n = e.encodeCBOR;
                    if (typeof n == "function") return n.call(e, this);
                    let i = Object.keys(e),
                        s = i.length;
                    return this._pushInt(s, St.MAP) ? this._pushRawMap(s, i.map(a => [a, e[a]])) : !1
                }
                _pushRawMap(e, t) {
                    t = t.map(function(n) {
                        return n[0] = zn.encode(n[0]), n
                    }).sort($a.keySorter);
                    for (let n = 0; n < e; n++)
                        if (!this.push(t[n][0]) || !this.pushAny(t[n][1])) return !1;
                    return !0
                }
                write(e) {
                    return this.pushAny(e)
                }
                pushAny(e) {
                    switch (DS(e)) {
                        case "Number":
                            return this._pushNumber(e);
                        case "String":
                            return this._pushString(e);
                        case "Boolean":
                            return this._pushBoolean(e);
                        case "Object":
                            return this._pushObject(e);
                        case "Array":
                            return this._pushArray(this, e);
                        case "Uint8Array":
                            return this._pushBuffer(this, Pt.isBuffer(e) ? e : Pt.from(e));
                        case "Null":
                            return this._pushUInt8(x1);
                        case "Undefined":
                            return this._pushUndefined(e);
                        case "Map":
                            return this._pushMap(this, e);
                        case "Set":
                            return this._pushSet(this, e);
                        case "URL":
                            return this._pushUrl(this, e);
                        case "BigNumber":
                            return this._pushBigNumber(this, e);
                        case "Date":
                            return this._pushDate(this, e);
                        case "RegExp":
                            return this._pushRegexp(this, e);
                        case "Symbol":
                            switch (e) {
                                case y1.NULL:
                                    return this._pushObject(null);
                                case y1.UNDEFINED:
                                    return this._pushUndefined(void 0);
                                default:
                                    throw new Error("Unknown symbol: " + e.toString())
                            }
                            default:
                                throw new Error("Unknown type: " + typeof e + ", " + (e ? e.toString() : ""))
                    }
                }
                finalize() {
                    if (this.offset === 0) return null;
                    let e = this.result,
                        t = this.resultLength,
                        n = this.resultMethod,
                        i = this.offset,
                        s = 0,
                        a = 0;
                    for (; a < i; a++) s += t[a];
                    let f = Pt.allocUnsafe(s),
                        u = 0,
                        b = 0;
                    for (a = 0; a < i; a++) {
                        switch (b = t[a], n[a]) {
                            case 0:
                                e[a].copy(f, u);
                                break;
                            case 1:
                                f.writeUInt8(e[a], u, !0);
                                break;
                            case 2:
                                f.writeUInt16BE(e[a], u, !0);
                                break;
                            case 3:
                                f.writeUInt32BE(e[a], u, !0);
                                break;
                            case 4:
                                f.writeDoubleBE(e[a], u, !0);
                                break;
                            case 5:
                                f.write(e[a], u, b, "utf8");
                                break;
                            default:
                                throw new Error("unkown method")
                        }
                        u += b
                    }
                    let y = f;
                    return this._reset(), y
                }
                _reset() {
                    this.result = [], this.resultMethod = [], this.resultLength = [], this.offset = 0
                }
                static encode(e) {
                    let t = new zn;
                    if (!t.pushAny(e)) throw new Error("Failed to encode input");
                    return t.finalize()
                }
            };
            g1.exports = zn
        });
        var S1 = h(Ce => {
            "use strict";
            Ce.Diagnose = b1();
            Ce.Decoder = Ha();
            Ce.Encoder = w1();
            Ce.Simple = Ma();
            Ce.Tagged = za();
            Ce.decodeAll = Ce.Decoder.decodeAll;
            Ce.decodeFirst = Ce.Decoder.decodeFirst;
            Ce.diagnose = Ce.Diagnose.diagnose;
            Ce.encode = Ce.Encoder.encode;
            Ce.decode = Ce.Decoder.decode;
            Ce.leveldb = {
                decode: Ce.Decoder.decodeAll,
                encode: Ce.Encoder.encode,
                buffer: !0,
                name: "cbor"
            }
        });
        var _1 = h((Wq, k1) => {
            k1.exports = E1;

            function E1(r, e) {
                this.value = r, this.next = e
            }
            E1.prototype.contains = function(r) {
                for (var e = this; e;) {
                    if (e.value === r) return !0;
                    e = e.next
                }
                return !1
            }
        });
        var T1 = h((Yq, A1) => {
            var MS = _1();
            A1.exports = zS;

            function zS(r) {
                if (!(r instanceof Object)) throw new TypeError('"obj" must be an object (or inherit from it)');
                return I1(r)
            }

            function I1(r, e) {
                e = new MS(r, e);
                for (var t in r) {
                    var n = r[t];
                    if (n instanceof Object && (e.contains(n) || I1(n, e))) return !0
                }
                return !1
            }
        });
        var Ka = h((Kq, Wi) => {
            "use strict";
            var Va = S1(),
                N1 = Lt(),
                q1 = Ri(),
                {
                    multihash: B1
                } = q1,
                Hn = J(),
                HS = T1(),
                jS = nr(),
                GS = et(),
                O1 = 42;

            function $S(r) {
                let e;
                if (typeof r == "string") e = new Hn(r).bytes;
                else if (Hn.isCID(r)) e = r.bytes;
                else throw new Error("Could not tag CID - was not string or CID");
                return new Va.Tagged(O1, jS([GS("00", "base16"), e], 1 + e.length))
            }

            function VS(r) {
                let e;
                try {
                    e = HS(r)
                } catch (n) {
                    e = !1
                }
                if (e) throw new Error("The object passed has circular references");

                function t(n) {
                    if (!n || n instanceof Uint8Array || typeof n == "string") return n;
                    if (Array.isArray(n)) return n.map(t);
                    if (Hn.isCID(n)) return $S(n);
                    let i = Object.keys(n);
                    if (i.length > 0) {
                        let s = {};
                        return i.forEach(a => {
                            typeof n[a] == "object" ? s[a] = t(n[a]) : s[a] = n[a]
                        }), s
                    } else return n
                }
                return t(r)
            }
            var WS = N1.DAG_CBOR,
                YS = B1.names["sha2-256"],
                P1 = {
                    [O1]: r => (r = r.slice(1), new Hn(r))
                },
                v1 = 64 * 1024,
                an = v1,
                C1 = 64 * 1024 * 1024,
                Wa = C1,
                U1;

            function Ya(r) {
                let e = P1;
                r ? (typeof r.size == "number" && (an = r.size), typeof r.maxSize == "number" && (Wa = r.maxSize), r.tags && (e = Object.assign({}, P1, r && r.tags))) : (an = v1, Wa = C1);
                let t = {
                    tags: e,
                    size: an
                };
                U1 = new Va.Decoder(t), an = t.size
            }
            Ya();

            function KS(r) {
                let e = VS(r);
                return Va.encode(e)
            }

            function XS(r) {
                if (r.length > an && r.length <= Wa && Ya({
                        size: r.length
                    }), r.length > an) throw new Error("Data is too large to deserialize with current decoder");
                let e = U1.decodeAll(r);
                if (e.length !== 1) throw new Error("Extraneous CBOR data found beyond initial top-level object");
                return e[0]
            }
            async function JS(r, e = {}) {
                let t = {
                        cidVersion: e.cidVersion == null ? 1 : e.cidVersion,
                        hashAlg: e.hashAlg == null ? Wi.exports.defaultHashAlg : e.hashAlg
                    },
                    n = B1.codes[t.hashAlg],
                    i = await q1(r, n),
                    s = N1.getNameFromCode(Wi.exports.codec);
                return new Hn(t.cidVersion, s, i)
            }
            Wi.exports = {
                codec: WS,
                defaultHashAlg: YS,
                configureDecoder: Ya,
                serialize: KS,
                deserialize: XS,
                cid: JS
            }
        });
        var D1 = h(Xa => {
            "use strict";
            var F1 = J(),
                L1 = Ka();
            Xa.resolve = (r, e = "") => {
                let t = L1.deserialize(r),
                    n = e.split("/").filter(Boolean);
                for (; n.length;) {
                    let i = n.shift();
                    if (!i || !(i in t)) throw new Error(`Object has no property '${i}'`);
                    if (t = t[i], F1.isCID(t)) return {
                        value: t,
                        remainderPath: n.join("/")
                    }
                }
                return {
                    value: t,
                    remainderPath: ""
                }
            };
            var R1 = function*(r, e) {
                if (!(r instanceof Uint8Array || F1.isCID(r) || typeof r == "string" || r === null))
                    for (let t of Object.keys(r)) {
                        let n = e === void 0 ? t : e + "/" + t;
                        yield n, yield* R1(r[t], n)
                    }
            };
            Xa.tree = function*(r) {
                let e = L1.deserialize(r);
                yield* R1(e)
            }
        });
        var z1 = h((Jq, M1) => {
            "use strict";
            var Ja = Ka(),
                ZS = D1();
            M1.exports = {
                util: Ja,
                resolver: ZS,
                codec: Ja.codec,
                defaultHashAlg: Ja.defaultHashAlg
            }
        });
        var $1 = h((Zq, Yi) => {
            "use strict";
            var QS = J(),
                H1 = Ri(),
                {
                    multihash: j1
                } = H1,
                G1 = Lt();
            Yi.exports = {
                codec: G1.RAW,
                defaultHashAlg: j1.names["sha2-256"],
                resolver: {
                    resolve: (r, e) => {
                        if (e !== "/") throw new Error("Only the root path / may be resolved");
                        return {
                            value: r,
                            remainderPath: ""
                        }
                    },
                    async *tree(r) {}
                },
                util: {
                    deserialize: r => r,
                    serialize: r => r,
                    cid: async (r, e = {}) => {
                        let t = {
                                cidVersion: e.cidVersion == null ? 1 : e.cidVersion,
                                hashAlg: e.hashAlg == null ? Yi.exports.defaultHashAlg : e.hashAlg
                            },
                            n = j1.codes[t.hashAlg],
                            i = await H1(r, n),
                            s = G1.getNameFromCode(Yi.exports.codec);
                        return new QS(t.cidVersion, s, i)
                    }
                }
            }
        });
        var Za = h((Qq, V1) => {
            "use strict";
            var ek = Un(),
                tk = z1(),
                rk = $1(),
                Ki = Lt(),
                W1 = r => Promise.reject(new Error(`Missing IPLD format "${r}"`));
            V1.exports = ({
                formats: r = [],
                loadFormat: e = W1
            } = {}) => {
                r = r || [], e = e || W1;
                let t = {
                    [Ki.DAG_PB]: ek,
                    [Ki.DAG_CBOR]: tk,
                    [Ki.RAW]: rk
                };
                return r.forEach(i => {
                    t[i.codec] = i
                }), async i => {
                    let s = Ki.getCodeFromName(i),
                        a = t[s] || await e(i);
                    if (!a) throw Object.assign(new Error(`Missing IPLD format "${i}"`), {
                        missingMulticodec: i
                    });
                    return a
                }
            }
        });
        var Qa = h((eB, Y1) => {
            "use strict";
            var nk = J(),
                ik = v(),
                sk = L();
            Y1.exports = ik(r => async (t, n = {}) => {
                let s = await (await r.post("dag/resolve", {
                    timeout: n.timeout,
                    signal: n.signal,
                    searchParams: sk({
                        arg: `${t}${n.path?`/${n.path}`.replace(/\/[/]+/g,"/"):""}`,
                        ...n
                    }),
                    headers: n.headers
                })).json();
                return {
                    cid: new nk(s.Cid["/"]),
                    remainderPath: s.RemPath
                }
            })
        });
        var J1 = h((tB, K1) => {
            "use strict";
            var ak = v(),
                X1 = Lt(),
                ok = Za();
            K1.exports = ak((r, e) => {
                let t = ca()(e),
                    n = Qa()(e),
                    i = ok(e.ipld);
                return async (a, f = {}) => {
                    let u = await n(a, f),
                        b = await t(u.cid, f),
                        y = X1.getName(u.cid.code),
                        E = await i(y);
                    return u.cid.code === X1.RAW && !u.remainderPath && (u.remainderPath = "/"), E.resolver.resolve(b.data, u.remainderPath || "")
                }
            })
        });
        var ep = h((rB, Z1) => {
            "use strict";
            var Q1 = J(),
                uk = Gt(),
                ck = v(),
                lk = xt(),
                fk = L(),
                hk = wt(),
                {
                    AbortController: dk
                } = Je(),
                pk = Lt(),
                bk = Za();
            Z1.exports = ck((r, e) => {
                let t = bk(e.ipld);
                return async (i, s = {}) => {
                    if (s.cid && (s.format || s.hashAlg)) throw new Error("Failed to put DAG node. Provide either `cid` OR `format` and `hashAlg` options");
                    if (s.format && !s.hashAlg || !s.format && s.hashAlg) throw new Error("Failed to put DAG node. Provide `format` AND `hashAlg` options");
                    let a;
                    if (s.cid) {
                        let I = new Q1(s.cid);
                        a = {
                            ...s,
                            format: pk.getName(I.code),
                            hashAlg: uk.decode(I.multihash).name
                        }, delete s.cid
                    } else a = s;
                    let f = {
                            format: "dag-cbor",
                            hashAlg: "sha2-256",
                            inputEnc: "raw",
                            ...a
                        },
                        b = (await t(f.format)).util.serialize(i),
                        y = new dk,
                        E = hk(y.signal, f.signal),
                        d = await (await r.post("dag/put", {
                            timeout: f.timeout,
                            signal: E,
                            searchParams: fk(f),
                            ...await lk(b, y, f.headers)
                        })).json();
                    return new Q1(d.Cid["/"])
                }
            })
        });
        var rp = h((nB, tp) => {
            "use strict";
            var gk = v();
            tp.exports = gk(r => async (t, n = {}) => {
                throw new Error("Not implemented")
            })
        });
        var ip = h((iB, np) => {
            "use strict";
            np.exports = r => ({
                get: J1()(r),
                put: ep()(r),
                resolve: Qa()(r),
                tree: rp()(r)
            })
        });
        var Xi = h((sB, sp) => {
            "use strict";
            sp.exports = {
                SendingQuery: 0,
                PeerResponse: 1,
                FinalPeer: 2,
                QueryError: 3,
                Provider: 4,
                Value: 5,
                AddingPeer: 6,
                DialingPeer: 7
            }
        });
        var op = h((aB, ap) => {
            "use strict";
            var mk = v(),
                yk = L(),
                {
                    Value: xk
                } = Xi(),
                wk = st(),
                Sk = et();
            ap.exports = mk(r => {
                async function e(t, n = {}) {
                    let i = await r.post("dht/get", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: yk({
                            arg: t instanceof Uint8Array ? wk(t) : t,
                            ...n
                        }),
                        headers: n.headers
                    });
                    for await (let s of i.ndjson()) if (s.Type === xk) return Sk(s.Extra, "base64pad");
                    throw new Error("not found")
                }
                return e
            })
        });
        var cp = h((oB, up) => {
            "use strict";
            var kk = J(),
                {
                    Multiaddr: Ek
                } = Pe(),
                _k = Ne(),
                Ak = v(),
                Ik = L(),
                Tk = xt(),
                Nk = wt(),
                {
                    AbortController: qk
                } = Je();
            up.exports = Ak(r => {
                async function* e(t, n, i = {}) {
                    let s = new qk,
                        a = Nk(s.signal, i.signal),
                        f = await r.post("dht/put", {
                            timeout: i.timeout,
                            signal: a,
                            searchParams: Ik({
                                arg: t,
                                ...i
                            }),
                            ...await Tk(n, s, i.headers)
                        });
                    for await (let u of f.ndjson()) u = _k(u), u.id = new kk(u.id), u.responses && (u.responses = u.responses.map(({
                        ID: b,
                        Addrs: y
                    }) => ({
                        id: b,
                        addrs: (y || []).map(E => new Ek(E))
                    }))), yield u
                }
                return e
            })
        });
        var fp = h((uB, lp) => {
            "use strict";
            var Bk = J(),
                {
                    Multiaddr: Ok
                } = Pe(),
                Pk = v(),
                vk = L(),
                {
                    Provider: Ck
                } = Xi();
            lp.exports = Pk(r => {
                async function* e(t, n = {}) {
                    let i = await r.post("dht/findprovs", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: vk({
                            arg: `${new Bk(t)}`,
                            ...n
                        }),
                        headers: n.headers
                    });
                    for await (let s of i.ndjson()) if (s.Type === Ck && s.Responses)
                        for (let {
                                ID: a,
                                Addrs: f
                            } of s.Responses) yield {
                            id: a,
                            addrs: (f || []).map(u => new Ok(u))
                        }
                }
                return e
            })
        });
        var dp = h((cB, hp) => {
            "use strict";
            var {
                Multiaddr: Uk
            } = Pe(), Fk = v(), Lk = L(), {
                FinalPeer: Rk
            } = Xi();
            hp.exports = Fk(r => {
                async function e(t, n = {}) {
                    let i = await r.post("dht/findpeer", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: Lk({
                            arg: t,
                            ...n
                        }),
                        headers: n.headers
                    });
                    for await (let s of i.ndjson()) if (s.Type === Rk && s.Responses) {
                        let {
                            ID: a,
                            Addrs: f
                        } = s.Responses[0];
                        return {
                            id: a,
                            addrs: (f || []).map(u => new Uk(u))
                        }
                    }
                    throw new Error("not found")
                }
                return e
            })
        });
        var gp = h((lB, pp) => {
            "use strict";
            var bp = J(),
                {
                    Multiaddr: Dk
                } = Pe(),
                Mk = Ne(),
                zk = v(),
                Hk = L();
            pp.exports = zk(r => {
                async function* e(t, n = {
                    recursive: !1
                }) {
                    t = Array.isArray(t) ? t : [t];
                    let i = await r.post("dht/provide", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: Hk({
                            arg: t.map(s => new bp(s).toString()),
                            ...n
                        }),
                        headers: n.headers
                    });
                    for await (let s of i.ndjson()) s = Mk(s), s.id = new bp(s.id), s.responses ? s.responses = s.responses.map(({
                        ID: a,
                        Addrs: f
                    }) => ({
                        id: a,
                        addrs: (f || []).map(u => new Dk(u))
                    })) : s.responses = [], yield s
                }
                return e
            })
        });
        var xp = h((fB, mp) => {
            "use strict";
            var yp = J(),
                {
                    Multiaddr: jk
                } = Pe(),
                Gk = Ne(),
                $k = v(),
                Vk = L();
            mp.exports = $k(r => {
                async function* e(t, n = {}) {
                    let i = await r.post("dht/query", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: Vk({
                            arg: new yp(`${t}`),
                            ...n
                        }),
                        headers: n.headers
                    });
                    for await (let s of i.ndjson()) s = Gk(s), s.id = new yp(s.id), s.responses = (s.responses || []).map(({
                        ID: a,
                        Addrs: f
                    }) => ({
                        id: a,
                        addrs: (f || []).map(u => new jk(u))
                    })), yield s
                }
                return e
            })
        });
        var Sp = h((hB, wp) => {
            "use strict";
            wp.exports = r => ({
                get: op()(r),
                put: cp()(r),
                findProvs: fp()(r),
                findPeer: dp()(r),
                provide: gp()(r),
                query: xp()(r)
            })
        });
        var Ep = h((dB, kp) => {
            "use strict";
            var Wk = v(),
                Yk = L();
            kp.exports = Wk(r => {
                async function e(t = {}) {
                    return (await r.post("diag/net", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: Yk(t),
                        headers: t.headers
                    })).json()
                }
                return e
            })
        });
        var Ap = h((pB, _p) => {
            "use strict";
            var Kk = v(),
                Xk = L();
            _p.exports = Kk(r => {
                async function e(t = {}) {
                    return (await r.post("diag/sys", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: Xk(t),
                        headers: t.headers
                    })).json()
                }
                return e
            })
        });
        var Tp = h((bB, Ip) => {
            "use strict";
            var Jk = v(),
                Zk = L();
            Ip.exports = Jk(r => {
                async function e(t = {}) {
                    return (await r.post("diag/cmds", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: Zk(t),
                        headers: t.headers
                    })).json()
                }
                return e
            })
        });
        var qp = h((gB, Np) => {
            "use strict";
            Np.exports = r => ({
                net: Ep()(r),
                sys: Ap()(r),
                cmds: Tp()(r)
            })
        });
        var Op = h((mB, Bp) => {
            "use strict";
            var Qk = v(),
                eE = L();
            Bp.exports = Qk(r => async (t, n = {}) => (await (await r.post("dns", {
                timeout: n.timeout,
                signal: n.signal,
                searchParams: eE({
                    arg: t,
                    ...n
                }),
                headers: n.headers
            })).json()).Path)
        });
        var vp = h((yB, Pp) => {
            "use strict";
            var tE = v(),
                rE = L();
            Pp.exports = tE(r => {
                async function e(t, n, i = {}) {
                    await (await r.post("files/chmod", {
                        timeout: i.timeout,
                        signal: i.signal,
                        searchParams: rE({
                            arg: t,
                            mode: n,
                            ...i
                        }),
                        headers: i.headers
                    })).text()
                }
                return e
            })
        });
        var Up = h((xB, Cp) => {
            "use strict";
            var nE = J(),
                iE = v(),
                sE = L();
            Cp.exports = iE(r => {
                async function e(t, n, i = {}) {
                    Array.isArray(t) || (t = [t]), await (await r.post("files/cp", {
                        timeout: i.timeout,
                        signal: i.signal,
                        searchParams: sE({
                            arg: t.concat(n).map(a => nE.isCID(a) ? `/ipfs/${a}` : a),
                            ...i
                        }),
                        headers: i.headers
                    })).text()
                }
                return e
            })
        });
        var Lp = h((wB, Fp) => {
            "use strict";
            var aE = J(),
                oE = v(),
                uE = L();
            Fp.exports = oE(r => {
                async function e(t, n = {}) {
                    if (!t || typeof t != "string") throw new Error("ipfs.files.flush requires a path");
                    let s = await (await r.post("files/flush", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: uE({
                            arg: t,
                            ...n
                        }),
                        headers: n.headers
                    })).json();
                    return new aE(s.Cid)
                }
                return e
            })
        });
        var eo = h((SB, Rp) => {
            "use strict";
            var cE = Ne();

            function lE(r) {
                let e = cE(r);
                return Object.prototype.hasOwnProperty.call(e, "mode") && (e.mode = parseInt(e.mode, 8)), Object.prototype.hasOwnProperty.call(e, "mtime") && (e.mtime = {
                    secs: e.mtime,
                    nsecs: e.mtimeNsecs || 0
                }, delete e.mtimeNsecs), e
            }
            Rp.exports = lE
        });
        var jp = h((kB, Dp) => {
            "use strict";
            var Mp = J(),
                zp = eo(),
                fE = v(),
                hE = L();
            Dp.exports = fE(r => {
                async function* e(t, n = {}) {
                    if (!t || typeof t != "string") throw new Error("ipfs.files.ls requires a path");
                    let i = await r.post("files/ls", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: hE({
                            arg: Mp.isCID(t) ? `/ipfs/${t}` : t,
                            long: !0,
                            ...n,
                            stream: !0
                        }),
                        headers: n.headers
                    });
                    for await (let s of i.ndjson()) if ("Entries" in s)
                        for (let a of s.Entries || []) yield Hp(zp(a));
                    else yield Hp(zp(s))
                }
                return e
            });

            function Hp(r) {
                return r.hash && (r.cid = new Mp(r.hash)), delete r.hash, r.type = r.type === 1 ? "directory" : "file", r
            }
        });
        var $p = h((EB, Gp) => {
            "use strict";
            var dE = v(),
                pE = L();
            Gp.exports = dE(r => {
                async function e(t, n = {}) {
                    await (await r.post("files/mkdir", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: pE({
                            arg: t,
                            ...n
                        }),
                        headers: n.headers
                    })).text()
                }
                return e
            })
        });
        var Wp = h((_B, Vp) => {
            "use strict";
            var bE = J(),
                gE = v(),
                mE = L();
            Vp.exports = gE(r => {
                async function e(t, n, i = {}) {
                    Array.isArray(t) || (t = [t]), await (await r.post("files/mv", {
                        timeout: i.timeout,
                        signal: i.signal,
                        searchParams: mE({
                            arg: t.concat(n).map(a => bE.isCID(a) ? `/ipfs/${a}` : a),
                            ...i
                        }),
                        headers: i.headers
                    })).text()
                }
                return e
            })
        });
        var Kp = h((AB, Yp) => {
            Yp.exports = r => {
                if (r[Symbol.asyncIterator]) return r;
                if (r.getReader) return async function*() {
                    let e = r.getReader();
                    try {
                        for (;;) {
                            let {
                                done: t,
                                value: n
                            } = await e.read();
                            if (t) return;
                            yield n
                        }
                    } finally {
                        e.releaseLock()
                    }
                }();
                throw new Error("unknown stream")
            }
        });
        var Jp = h((IB, Xp) => {
            "use strict";
            var yE = Kp(),
                xE = v(),
                wE = L();
            Xp.exports = xE(r => {
                async function* e(t, n = {}) {
                    let i = await r.post("files/read", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: wE({
                            arg: t,
                            count: n.length,
                            ...n
                        }),
                        headers: n.headers
                    });
                    yield* yE(i.body)
                }
                return e
            })
        });
        var Qp = h((TB, Zp) => {
            "use strict";
            var SE = v(),
                kE = L();
            Zp.exports = SE(r => {
                async function e(t, n = {}) {
                    await (await r.post("files/rm", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: kE({
                            arg: t,
                            ...n
                        }),
                        headers: n.headers
                    })).text()
                }
                return e
            })
        });
        var to = h((NB, e2) => {
            "use strict";
            var t2 = J(),
                EE = eo(),
                _E = v(),
                AE = L();
            e2.exports = _E(r => {
                async function e(t, n = {}) {
                    t && !t2.isCID(t) && typeof t != "string" && (n = t || {}, t = "/");
                    let s = await (await r.post("files/stat", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: AE({
                            arg: t,
                            ...n
                        }),
                        headers: n.headers
                    })).json();
                    return s.WithLocality = s.WithLocality || !1, IE(EE(s))
                }
                return e
            });

            function IE(r) {
                return r.cid = new t2(r.hash), delete r.hash, r
            }
        });
        var n2 = h((qB, r2) => {
            "use strict";
            var TE = v(),
                NE = L();
            r2.exports = TE(r => {
                async function e(t, n = {}) {
                    await (await r.post("files/touch", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: NE({
                            arg: t,
                            ...n
                        }),
                        headers: n.headers
                    })).text()
                }
                return e
            })
        });
        var s2 = h((BB, i2) => {
            "use strict";
            var qE = Ni(),
                {
                    parseMtime: BE
                } = Ti(),
                OE = v(),
                PE = xt(),
                vE = L(),
                CE = wt(),
                {
                    AbortController: UE
                } = Je();
            i2.exports = OE(r => {
                async function e(t, n, i = {}) {
                    let s = new UE,
                        a = CE(s.signal, i.signal);
                    await (await r.post("files/write", {
                        timeout: i.timeout,
                        signal: a,
                        searchParams: vE({
                            arg: t,
                            streamChannels: !0,
                            count: i.length,
                            ...i
                        }),
                        ...await PE({
                            content: n,
                            path: "arg",
                            mode: qE(i.mode),
                            mtime: BE(i.mtime)
                        }, s, i.headers)
                    })).text()
                }
                return e
            })
        });
        var o2 = h((OB, a2) => {
            "use strict";
            a2.exports = r => ({
                chmod: vp()(r),
                cp: Up()(r),
                flush: Lp()(r),
                ls: jp()(r),
                mkdir: $p()(r),
                mv: Wp()(r),
                read: Jp()(r),
                rm: Qp()(r),
                stat: to()(r),
                touch: n2()(r),
                write: s2()(r)
            })
        });
        var c2 = h((PB, u2) => {
            "use strict";
            var FE = () => {
                let r = {};
                return r.promise = new Promise((e, t) => {
                    r.resolve = e, r.reject = t
                }), r
            };
            u2.exports = FE
        });
        var on = h((vB, l2) => {
            "use strict";
            var {
                Buffer: kt
            } = zt(), f2 = Symbol.for("BufferList");

            function Se(r) {
                if (!(this instanceof Se)) return new Se(r);
                Se._init.call(this, r)
            }
            Se._init = function(e) {
                Object.defineProperty(this, f2, {
                    value: !0
                }), this._bufs = [], this.length = 0, e && this.append(e)
            };
            Se.prototype._new = function(e) {
                return new Se(e)
            };
            Se.prototype._offset = function(e) {
                if (e === 0) return [0, 0];
                let t = 0;
                for (let n = 0; n < this._bufs.length; n++) {
                    let i = t + this._bufs[n].length;
                    if (e < i || n === this._bufs.length - 1) return [n, e - t];
                    t = i
                }
            };
            Se.prototype._reverseOffset = function(r) {
                let e = r[0],
                    t = r[1];
                for (let n = 0; n < e; n++) t += this._bufs[n].length;
                return t
            };
            Se.prototype.get = function(e) {
                if (e > this.length || e < 0) return;
                let t = this._offset(e);
                return this._bufs[t[0]][t[1]]
            };
            Se.prototype.slice = function(e, t) {
                return typeof e == "number" && e < 0 && (e += this.length), typeof t == "number" && t < 0 && (t += this.length), this.copy(null, 0, e, t)
            };
            Se.prototype.copy = function(e, t, n, i) {
                if ((typeof n != "number" || n < 0) && (n = 0), (typeof i != "number" || i > this.length) && (i = this.length), n >= this.length || i <= 0) return e || kt.alloc(0);
                let s = !!e,
                    a = this._offset(n),
                    f = i - n,
                    u = f,
                    b = s && t || 0,
                    y = a[1];
                if (n === 0 && i === this.length) {
                    if (!s) return this._bufs.length === 1 ? this._bufs[0] : kt.concat(this._bufs, this.length);
                    for (let E = 0; E < this._bufs.length; E++) this._bufs[E].copy(e, b), b += this._bufs[E].length;
                    return e
                }
                if (u <= this._bufs[a[0]].length - y) return s ? this._bufs[a[0]].copy(e, t, y, y + u) : this._bufs[a[0]].slice(y, y + u);
                s || (e = kt.allocUnsafe(f));
                for (let E = a[0]; E < this._bufs.length; E++) {
                    let z = this._bufs[E].length - y;
                    if (u > z) this._bufs[E].copy(e, b, y), b += z;
                    else {
                        this._bufs[E].copy(e, b, y, y + u), b += z;
                        break
                    }
                    u -= z, y && (y = 0)
                }
                return e.length > b ? e.slice(0, b) : e
            };
            Se.prototype.shallowSlice = function(e, t) {
                if (e = e || 0, t = typeof t != "number" ? this.length : t, e < 0 && (e += this.length), t < 0 && (t += this.length), e === t) return this._new();
                let n = this._offset(e),
                    i = this._offset(t),
                    s = this._bufs.slice(n[0], i[0] + 1);
                return i[1] === 0 ? s.pop() : s[s.length - 1] = s[s.length - 1].slice(0, i[1]), n[1] !== 0 && (s[0] = s[0].slice(n[1])), this._new(s)
            };
            Se.prototype.toString = function(e, t, n) {
                return this.slice(t, n).toString(e)
            };
            Se.prototype.consume = function(e) {
                if (e = Math.trunc(e), Number.isNaN(e) || e <= 0) return this;
                for (; this._bufs.length;)
                    if (e >= this._bufs[0].length) e -= this._bufs[0].length, this.length -= this._bufs[0].length, this._bufs.shift();
                    else {
                        this._bufs[0] = this._bufs[0].slice(e), this.length -= e;
                        break
                    } return this
            };
            Se.prototype.duplicate = function() {
                let e = this._new();
                for (let t = 0; t < this._bufs.length; t++) e.append(this._bufs[t]);
                return e
            };
            Se.prototype.append = function(e) {
                if (e == null) return this;
                if (e.buffer) this._appendBuffer(kt.from(e.buffer, e.byteOffset, e.byteLength));
                else if (Array.isArray(e))
                    for (let t = 0; t < e.length; t++) this.append(e[t]);
                else if (this._isBufferList(e))
                    for (let t = 0; t < e._bufs.length; t++) this.append(e._bufs[t]);
                else typeof e == "number" && (e = e.toString()), this._appendBuffer(kt.from(e));
                return this
            };
            Se.prototype._appendBuffer = function(e) {
                this._bufs.push(e), this.length += e.length
            };
            Se.prototype.indexOf = function(r, e, t) {
                if (t === void 0 && typeof e == "string" && (t = e, e = void 0), typeof r == "function" || Array.isArray(r)) throw new TypeError('The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.');
                if (typeof r == "number" ? r = kt.from([r]) : typeof r == "string" ? r = kt.from(r, t) : this._isBufferList(r) ? r = r.slice() : Array.isArray(r.buffer) ? r = kt.from(r.buffer, r.byteOffset, r.byteLength) : kt.isBuffer(r) || (r = kt.from(r)), e = Number(e || 0), isNaN(e) && (e = 0), e < 0 && (e = this.length + e), e < 0 && (e = 0), r.length === 0) return e > this.length ? this.length : e;
                let n = this._offset(e),
                    i = n[0],
                    s = n[1];
                for (; i < this._bufs.length; i++) {
                    let a = this._bufs[i];
                    for (; s < a.length;)
                        if (a.length - s >= r.length) {
                            let u = a.indexOf(r, s);
                            if (u !== -1) return this._reverseOffset([i, u]);
                            s = a.length - r.length + 1
                        } else {
                            let u = this._reverseOffset([i, s]);
                            if (this._match(u, r)) return u;
                            s++
                        } s = 0
                }
                return -1
            };
            Se.prototype._match = function(r, e) {
                if (this.length - r < e.length) return !1;
                for (let t = 0; t < e.length; t++)
                    if (this.get(r + t) !== e[t]) return !1;
                return !0
            };
            (function() {
                let r = {
                    readDoubleBE: 8,
                    readDoubleLE: 8,
                    readFloatBE: 4,
                    readFloatLE: 4,
                    readInt32BE: 4,
                    readInt32LE: 4,
                    readUInt32BE: 4,
                    readUInt32LE: 4,
                    readInt16BE: 2,
                    readInt16LE: 2,
                    readUInt16BE: 2,
                    readUInt16LE: 2,
                    readInt8: 1,
                    readUInt8: 1,
                    readIntBE: null,
                    readIntLE: null,
                    readUIntBE: null,
                    readUIntLE: null
                };
                for (let e in r)(function(t) {
                    r[t] === null ? Se.prototype[t] = function(n, i) {
                        return this.slice(n, n + i)[t](0, i)
                    } : Se.prototype[t] = function(n = 0) {
                        return this.slice(n, n + r[t])[t](0)
                    }
                })(e)
            })();
            Se.prototype._isBufferList = function(e) {
                return e instanceof Se || Se.isBufferList(e)
            };
            Se.isBufferList = function(e) {
                return e != null && e[f2]
            };
            l2.exports = Se
        });
        var p2 = h(Ji => {
            var {
                Buffer: ro
            } = zt(), un = on(), LE = "0".charCodeAt(0), RE = ro.from("ustar\0", "binary"), DE = ro.from("ustar ", "binary"), ME = ro.from(" \0", "binary"), Zi = 257, h2 = 263, zE = function(r, e, t) {
                return typeof r != "number" ? t : (r = ~~r, r >= e ? e : r >= 0 || (r += e, r >= 0) ? r : 0)
            }, HE = function(r) {
                switch (r) {
                    case 0:
                        return "file";
                    case 1:
                        return "link";
                    case 2:
                        return "symlink";
                    case 3:
                        return "character-device";
                    case 4:
                        return "block-device";
                    case 5:
                        return "directory";
                    case 6:
                        return "fifo";
                    case 7:
                        return "contiguous-file";
                    case 72:
                        return "pax-header";
                    case 55:
                        return "pax-global-header";
                    case 27:
                        return "gnu-long-link-path";
                    case 28:
                    case 30:
                        return "gnu-long-path"
                }
                return null
            }, d2 = function(r, e, t, n) {
                for (; t < n; t++)
                    if (r.get(t) === e) return t;
                return n
            }, jE = function(r) {
                let e = 8 * 32;
                for (let t = 0; t < 148; t++) e += r.get(t);
                for (let t = 156; t < 512; t++) e += r.get(t);
                return e
            };

            function GE(r) {
                let e;
                if (r.get(0) === 128) e = !0;
                else if (r.get(0) === 255) e = !1;
                else return null;
                let t = !1,
                    n = [];
                for (let a = r.length - 1; a > 0; a--) {
                    let f = r.get(a);
                    e ? n.push(f) : t && f === 0 ? n.push(0) : t ? (t = !1, n.push(256 - f)) : n.push(255 - f)
                }
                let i = 0,
                    s = n.length;
                for (let a = 0; a < s; a++) i += n[a] * Math.pow(256, a);
                return e ? i : -1 * i
            }
            var Qt = function(r, e, t) {
                    if (r = r.shallowSlice(e, e + t), e = 0, r.get(e) & 128) return GE(r); {
                        for (; e < r.length && r.get(e) === 32;) e++;
                        let n = zE(d2(r, 32, e, r.length), r.length, r.length);
                        for (; e < n && r.get(e) === 0;) e++;
                        return n === e ? 0 : parseInt(r.shallowSlice(e, n).toString(), 8)
                    }
                },
                cn = function(r, e, t, n) {
                    return r.shallowSlice(e, d2(r, 0, e, e + t)).toString(n)
                };
            Ji.decodeLongPath = function(r, e) {
                return r = un.isBufferList(r) ? r : new un(r), cn(r, 0, r.length, e)
            };
            Ji.decodePax = function(r) {
                r = un.isBufferList(r) ? r : new un(r);
                let e = {};
                for (; r.length;) {
                    let t = 0;
                    for (; t < r.length && r.get(t) !== 32;) t++;
                    let n = parseInt(r.shallowSlice(0, t).toString(), 10);
                    if (!n) return e;
                    let i = r.shallowSlice(t + 1, n - 1).toString(),
                        s = i.indexOf("=");
                    if (s === -1) return e;
                    e[i.slice(0, s)] = i.slice(s + 1), r = r.shallowSlice(n)
                }
                return e
            };
            Ji.decode = function(r, e) {
                r = un.isBufferList(r) ? r : new un(r);
                let t = r.get(156) === 0 ? 0 : r.get(156) - LE,
                    n = cn(r, 0, 100, e),
                    i = Qt(r, 100, 8),
                    s = Qt(r, 108, 8),
                    a = Qt(r, 116, 8),
                    f = Qt(r, 124, 12),
                    u = Qt(r, 136, 12),
                    b = HE(t),
                    y = r.get(157) === 0 ? null : cn(r, 157, 100, e),
                    E = cn(r, 265, 32),
                    z = cn(r, 297, 32),
                    d = Qt(r, 329, 8),
                    I = Qt(r, 337, 8),
                    U = jE(r);
                if (U === 8 * 32) return null;
                if (U !== Qt(r, 148, 8)) throw new Error("Invalid tar header. Maybe the tar is corrupted or it needs to be gunzipped?");
                if (RE.compare(r.slice(Zi, Zi + 6)) === 0) r.get(345) && (n = cn(r, 345, 155, e) + "/" + n);
                else if (!(DE.compare(r.slice(Zi, Zi + 6)) === 0 && ME.compare(r.slice(h2, h2 + 2)) === 0)) throw new Error("Invalid tar header: unknown format.");
                return t === 0 && n && n[n.length - 1] === "/" && (t = 5), {
                    name: n,
                    mode: i,
                    uid: s,
                    gid: a,
                    size: f,
                    mtime: new Date(1e3 * u),
                    type: b,
                    linkname: y,
                    uname: E,
                    gname: z,
                    devmajor: d,
                    devminor: I
                }
            }
        });
        var g2 = h((UB, b2) => {
            var no = on();
            b2.exports = r => {
                let e = async function*() {
                    let t = yield,
                        n = new no;
                    for await (let i of r) {
                        if (!t) {
                            t = yield n.append(i), n = new no;
                            continue
                        }
                        for (n.append(i); n.length >= t;) {
                            let s = n.shallowSlice(0, t);
                            if (n.consume(t), t = yield s, !t) {
                                n.length && (t = yield n, n = new no);
                                break
                            }
                        }
                    }
                    if (t) throw Object.assign(new Error(`stream ended before ${t} bytes became available`), {
                        code: "ERR_UNDER_READ",
                        buffer: n
                    })
                }();
                return e.next(), e
            }
        });
        var y2 = h((FB, m2) => {
            var io = on(),
                $E = g2();
            m2.exports = function(e) {
                let t = $E(e),
                    n, i = {
                        [Symbol.asyncIterator]: () => i,
                        async next(s) {
                            if (n) {
                                let a;
                                if (s == null || n.length === s) a = n, n = null;
                                else if (n.length > s) a = n.shallowSlice(0, s), n = n.shallowSlice(s);
                                else if (n.length < s) {
                                    let {
                                        value: f,
                                        done: u
                                    } = await t.next(s - n.length);
                                    if (u) throw Object.assign(new Error(`stream ended before ${s-n.length} bytes became available`), {
                                        code: "ERR_UNDER_READ"
                                    });
                                    a = new io([n, f]), n = null
                                }
                                return {
                                    value: a
                                }
                            }
                            return t.next(s)
                        },
                        async nextLte(s) {
                            let {
                                done: a,
                                value: f
                            } = await i.next();
                            return a ? {
                                done: a
                            } : f.length <= s ? {
                                value: f
                            } : (f = io.isBufferList(f) ? f : new io(f), n ? n.append(f.shallowSlice(s)) : n = f.shallowSlice(s), {
                                value: f.shallowSlice(0, s)
                            })
                        },
                        return () {
                            return t.return()
                        }
                    };
                return i
            }
        });
        var w2 = h((LB, x2) => {
            var VE = c2(),
                jn = p2(),
                WE = y2();

            function YE(r) {
                return r &= 511, r && 512 - r
            }
            async function Gn(r, e) {
                let t = YE(e);
                t && await r.next(t)
            }
            x2.exports = r => (r = r || {}, r.highWaterMark = r.highWaterMark || 1024 * 16, e => async function*() {
                let t = WE(e),
                    n, i, s, a;
                try {
                    for (;;) {
                        let f;
                        try {
                            let {
                                done: d,
                                value: I
                            } = await t.next(512);
                            if (d) return;
                            f = I
                        } catch (d) {
                            if (d.code === "ERR_UNDER_READ") return;
                            throw d
                        }
                        let u = jn.decode(f, r.filenameEncoding);
                        if (!u) continue;
                        if (u.type === "gnu-long-path") {
                            let {
                                done: d,
                                value: I
                            } = await t.next(u.size);
                            if (d) return;
                            n = jn.decodeLongPath(I, r.filenameEncoding), await Gn(t, u.size);
                            continue
                        }
                        if (u.type === "gnu-long-link-path") {
                            let {
                                done: d,
                                value: I
                            } = await t.next(u.size);
                            if (d) return;
                            i = jn.decodeLongPath(I, r.filenameEncoding), await Gn(t, u.size);
                            continue
                        }
                        if (u.type === "pax-global-header") {
                            let {
                                done: d,
                                value: I
                            } = await t.next(u.size);
                            if (d) return;
                            s = jn.decodePax(I, r.filenameEncoding), await Gn(t, u.size);
                            continue
                        }
                        if (u.type === "pax-header") {
                            let {
                                done: d,
                                value: I
                            } = await t.next(u.size);
                            if (d) return;
                            a = jn.decodePax(I, r.filenameEncoding), s && (a = {
                                ...s,
                                ...a
                            }), await Gn(t, u.size);
                            continue
                        }
                        if (n && (u.name = n, n = null), i && (u.linkname = i, i = null), a && (a.path && (u.name = a.path), a.linkpath && (u.linkname = a.linkpath), a.size && (u.size = parseInt(a.size, 10)), u.pax = a, a = null), !u.size || u.type === "directory") {
                            yield {
                                header: u,
                                body: async function*() {}()
                            };
                            continue
                        }
                        let b = u.size,
                            y = VE(),
                            E = await t.nextLte(Math.min(b, r.highWaterMark));
                        b -= E.value.length, b || y.resolve();
                        let z = async function*() {
                            try {
                                for (yield E.value; b;) {
                                    let {
                                        done: d,
                                        value: I
                                    } = await t.nextLte(b);
                                    if (d) {
                                        b = 0;
                                        return
                                    }
                                    b -= I.length, yield I
                                }
                            } finally {
                                y.resolve()
                            }
                        }();
                        if (yield {
                                header: u,
                                body: z
                            }, await y.promise, b)
                            for await (let d of z);
                        await Gn(t, u.size)
                    }
                } finally {
                    await t.return()
                }
            }())
        });
        var k2 = h((RB, S2) => {
            "use strict";
            S2.exports = {
                RTLD_LAZY: 1,
                RTLD_NOW: 2,
                RTLD_GLOBAL: 8,
                RTLD_LOCAL: 4,
                E2BIG: 7,
                EACCES: 13,
                EADDRINUSE: 48,
                EADDRNOTAVAIL: 49,
                EAFNOSUPPORT: 47,
                EAGAIN: 35,
                EALREADY: 37,
                EBADF: 9,
                EBADMSG: 94,
                EBUSY: 16,
                ECANCELED: 89,
                ECHILD: 10,
                ECONNABORTED: 53,
                ECONNREFUSED: 61,
                ECONNRESET: 54,
                EDEADLK: 11,
                EDESTADDRREQ: 39,
                EDOM: 33,
                EDQUOT: 69,
                EEXIST: 17,
                EFAULT: 14,
                EFBIG: 27,
                EHOSTUNREACH: 65,
                EIDRM: 90,
                EILSEQ: 92,
                EINPROGRESS: 36,
                EINTR: 4,
                EINVAL: 22,
                EIO: 5,
                EISCONN: 56,
                EISDIR: 21,
                ELOOP: 62,
                EMFILE: 24,
                EMLINK: 31,
                EMSGSIZE: 40,
                EMULTIHOP: 95,
                ENAMETOOLONG: 63,
                ENETDOWN: 50,
                ENETRESET: 52,
                ENETUNREACH: 51,
                ENFILE: 23,
                ENOBUFS: 55,
                ENODATA: 96,
                ENODEV: 19,
                ENOENT: 2,
                ENOEXEC: 8,
                ENOLCK: 77,
                ENOLINK: 97,
                ENOMEM: 12,
                ENOMSG: 91,
                ENOPROTOOPT: 42,
                ENOSPC: 28,
                ENOSR: 98,
                ENOSTR: 99,
                ENOSYS: 78,
                ENOTCONN: 57,
                ENOTDIR: 20,
                ENOTEMPTY: 66,
                ENOTSOCK: 38,
                ENOTSUP: 45,
                ENOTTY: 25,
                ENXIO: 6,
                EOPNOTSUPP: 102,
                EOVERFLOW: 84,
                EPERM: 1,
                EPIPE: 32,
                EPROTO: 100,
                EPROTONOSUPPORT: 43,
                EPROTOTYPE: 41,
                ERANGE: 34,
                EROFS: 30,
                ESPIPE: 29,
                ESRCH: 3,
                ESTALE: 70,
                ETIME: 101,
                ETIMEDOUT: 60,
                ETXTBSY: 26,
                EWOULDBLOCK: 35,
                EXDEV: 18,
                PRIORITY_LOW: 19,
                PRIORITY_BELOW_NORMAL: 10,
                PRIORITY_NORMAL: 0,
                PRIORITY_ABOVE_NORMAL: -7,
                PRIORITY_HIGH: -14,
                PRIORITY_HIGHEST: -20,
                SIGHUP: 1,
                SIGINT: 2,
                SIGQUIT: 3,
                SIGILL: 4,
                SIGTRAP: 5,
                SIGABRT: 6,
                SIGIOT: 6,
                SIGBUS: 10,
                SIGFPE: 8,
                SIGKILL: 9,
                SIGUSR1: 30,
                SIGSEGV: 11,
                SIGUSR2: 31,
                SIGPIPE: 13,
                SIGALRM: 14,
                SIGTERM: 15,
                SIGCHLD: 20,
                SIGCONT: 19,
                SIGSTOP: 17,
                SIGTSTP: 18,
                SIGTTIN: 21,
                SIGTTOU: 22,
                SIGURG: 16,
                SIGXCPU: 24,
                SIGXFSZ: 25,
                SIGVTALRM: 26,
                SIGPROF: 27,
                SIGWINCH: 28,
                SIGIO: 23,
                SIGINFO: 29,
                SIGSYS: 12,
                UV_FS_SYMLINK_DIR: 1,
                UV_FS_SYMLINK_JUNCTION: 2,
                O_RDONLY: 0,
                O_WRONLY: 1,
                O_RDWR: 2,
                UV_DIRENT_UNKNOWN: 0,
                UV_DIRENT_FILE: 1,
                UV_DIRENT_DIR: 2,
                UV_DIRENT_LINK: 3,
                UV_DIRENT_FIFO: 4,
                UV_DIRENT_SOCKET: 5,
                UV_DIRENT_CHAR: 6,
                UV_DIRENT_BLOCK: 7,
                S_IFMT: 61440,
                S_IFREG: 32768,
                S_IFDIR: 16384,
                S_IFCHR: 8192,
                S_IFBLK: 24576,
                S_IFIFO: 4096,
                S_IFLNK: 40960,
                S_IFSOCK: 49152,
                O_CREAT: 512,
                O_EXCL: 2048,
                UV_FS_O_FILEMAP: 0,
                O_NOCTTY: 131072,
                O_TRUNC: 1024,
                O_APPEND: 8,
                O_DIRECTORY: 1048576,
                O_NOFOLLOW: 256,
                O_SYNC: 128,
                O_DSYNC: 4194304,
                O_SYMLINK: 2097152,
                O_NONBLOCK: 4,
                S_IRWXU: 448,
                S_IRUSR: 256,
                S_IWUSR: 128,
                S_IXUSR: 64,
                S_IRWXG: 56,
                S_IRGRP: 32,
                S_IWGRP: 16,
                S_IXGRP: 8,
                S_IRWXO: 7,
                S_IROTH: 4,
                S_IWOTH: 2,
                S_IXOTH: 1,
                F_OK: 0,
                R_OK: 4,
                W_OK: 2,
                X_OK: 1,
                UV_FS_COPYFILE_EXCL: 1,
                COPYFILE_EXCL: 1,
                UV_FS_COPYFILE_FICLONE: 2,
                COPYFILE_FICLONE: 2,
                UV_FS_COPYFILE_FICLONE_FORCE: 4,
                COPYFILE_FICLONE_FORCE: 4,
                OPENSSL_VERSION_NUMBER: 269488303,
                SSL_OP_ALL: 2147485780,
                SSL_OP_ALLOW_NO_DHE_KEX: 1024,
                SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION: 262144,
                SSL_OP_CIPHER_SERVER_PREFERENCE: 4194304,
                SSL_OP_CISCO_ANYCONNECT: 32768,
                SSL_OP_COOKIE_EXCHANGE: 8192,
                SSL_OP_CRYPTOPRO_TLSEXT_BUG: 2147483648,
                SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS: 2048,
                SSL_OP_EPHEMERAL_RSA: 0,
                SSL_OP_LEGACY_SERVER_CONNECT: 4,
                SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER: 0,
                SSL_OP_MICROSOFT_SESS_ID_BUG: 0,
                SSL_OP_MSIE_SSLV2_RSA_PADDING: 0,
                SSL_OP_NETSCAPE_CA_DN_BUG: 0,
                SSL_OP_NETSCAPE_CHALLENGE_BUG: 0,
                SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG: 0,
                SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG: 0,
                SSL_OP_NO_COMPRESSION: 131072,
                SSL_OP_NO_ENCRYPT_THEN_MAC: 524288,
                SSL_OP_NO_QUERY_MTU: 4096,
                SSL_OP_NO_RENEGOTIATION: 1073741824,
                SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION: 65536,
                SSL_OP_NO_SSLv2: 0,
                SSL_OP_NO_SSLv3: 33554432,
                SSL_OP_NO_TICKET: 16384,
                SSL_OP_NO_TLSv1: 67108864,
                SSL_OP_NO_TLSv1_1: 268435456,
                SSL_OP_NO_TLSv1_2: 134217728,
                SSL_OP_NO_TLSv1_3: 536870912,
                SSL_OP_PKCS1_CHECK_1: 0,
                SSL_OP_PKCS1_CHECK_2: 0,
                SSL_OP_PRIORITIZE_CHACHA: 2097152,
                SSL_OP_SINGLE_DH_USE: 0,
                SSL_OP_SINGLE_ECDH_USE: 0,
                SSL_OP_SSLEAY_080_CLIENT_DH_BUG: 0,
                SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG: 0,
                SSL_OP_TLS_BLOCK_PADDING_BUG: 0,
                SSL_OP_TLS_D5_BUG: 0,
                SSL_OP_TLS_ROLLBACK_BUG: 8388608,
                ENGINE_METHOD_RSA: 1,
                ENGINE_METHOD_DSA: 2,
                ENGINE_METHOD_DH: 4,
                ENGINE_METHOD_RAND: 8,
                ENGINE_METHOD_EC: 2048,
                ENGINE_METHOD_CIPHERS: 64,
                ENGINE_METHOD_DIGESTS: 128,
                ENGINE_METHOD_PKEY_METHS: 512,
                ENGINE_METHOD_PKEY_ASN1_METHS: 1024,
                ENGINE_METHOD_ALL: 65535,
                ENGINE_METHOD_NONE: 0,
                DH_CHECK_P_NOT_SAFE_PRIME: 2,
                DH_CHECK_P_NOT_PRIME: 1,
                DH_UNABLE_TO_CHECK_GENERATOR: 4,
                DH_NOT_SUITABLE_GENERATOR: 8,
                ALPN_ENABLED: 1,
                RSA_PKCS1_PADDING: 1,
                RSA_SSLV23_PADDING: 2,
                RSA_NO_PADDING: 3,
                RSA_PKCS1_OAEP_PADDING: 4,
                RSA_X931_PADDING: 5,
                RSA_PKCS1_PSS_PADDING: 6,
                RSA_PSS_SALTLEN_DIGEST: -1,
                RSA_PSS_SALTLEN_MAX_SIGN: -2,
                RSA_PSS_SALTLEN_AUTO: -2,
                defaultCoreCipherList: "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA",
                TLS1_VERSION: 769,
                TLS1_1_VERSION: 770,
                TLS1_2_VERSION: 771,
                TLS1_3_VERSION: 772,
                POINT_CONVERSION_COMPRESSED: 2,
                POINT_CONVERSION_UNCOMPRESSED: 4,
                POINT_CONVERSION_HYBRID: 6
            }
        });
        var _2 = h((DB, E2) => {
            var KE = on(),
                so = {
                    string: () => "",
                    buffer: () => KE()
                };
            E2.exports = async (r, e) => {
                if (e = e || {}, e.type && !so[e.type]) throw new Error(`invalid type "${e.type}"`);
                let t, n;
                for await (let i of r) t || (n = e.type || (typeof i == "string" ? "string" : "buffer"), t = so[n]()), n === "string" ? t += i : t.append(i);
                return t || so[e.type || "buffer"]()
            }
        });
        var A2 = h(ao => {
            var {
                Buffer: vt
            } = zt(), XE = vt.alloc, JE = "0000000000000000000", ZE = "7777777777777777777", QE = "0".charCodeAt(0), e_ = vt.from("ustar\0", "binary"), t_ = vt.from("00", "binary"), r_ = parseInt("7777", 8), n_ = 257, i_ = 263, s_ = function(r) {
                switch (r) {
                    case "file":
                        return 0;
                    case "link":
                        return 1;
                    case "symlink":
                        return 2;
                    case "character-device":
                        return 3;
                    case "block-device":
                        return 4;
                    case "directory":
                        return 5;
                    case "fifo":
                        return 6;
                    case "contiguous-file":
                        return 7;
                    case "pax-header":
                        return 72
                }
                return 0
            }, a_ = function(r) {
                let e = 8 * 32;
                for (let t = 0; t < 148; t++) e += r[t];
                for (let t = 156; t < 512; t++) e += r[t];
                return e
            }, er = function(r, e) {
                return r = r.toString(8), r.length > e ? ZE.slice(0, e) + " " : JE.slice(0, e - r.length) + r + " "
            }, oo = function(r) {
                let e = vt.byteLength(r),
                    t = Math.floor(Math.log(e) / Math.log(10)) + 1;
                return e + t >= Math.pow(10, t) && t++, e + t + r
            };
            ao.encodePax = function(r) {
                let e = "";
                r.name && (e += oo(" path=" + r.name + `
`)), r.linkname && (e += oo(" linkpath=" + r.linkname + `
`));
                let t = r.pax;
                if (t)
                    for (let n in t) e += oo(" " + n + "=" + t[n] + `
`);
                return vt.from(e)
            };
            ao.encode = function(r) {
                let e = XE(512),
                    t = r.name,
                    n = "";
                if (r.typeflag === 5 && t[t.length - 1] !== "/" && (t += "/"), vt.byteLength(t) !== t.length) return null;
                for (; vt.byteLength(t) > 100;) {
                    let i = t.indexOf("/");
                    if (i === -1) return null;
                    n += n ? "/" + t.slice(0, i) : t.slice(0, i), t = t.slice(i + 1)
                }
                return vt.byteLength(t) > 100 || vt.byteLength(n) > 155 || r.linkname && vt.byteLength(r.linkname) > 100 ? null : (e.write(t), e.write(er(r.mode & r_, 6), 100), e.write(er(r.uid, 6), 108), e.write(er(r.gid, 6), 116), e.write(er(r.size, 11), 124), e.write(er(r.mtime.getTime() / 1e3 | 0, 11), 136), e[156] = QE + s_(r.type), r.linkname && e.write(r.linkname, 157), e_.copy(e, n_), t_.copy(e, i_), r.uname && e.write(r.uname, 265), r.gname && e.write(r.gname, 297), e.write(er(r.devmajor || 0, 6), 329), e.write(er(r.devminor || 0, 6), 337), n && e.write(n, 345), e.write(er(a_(e), 6), 148), e)
            }
        });
        var N2 = h((zB, I2) => {
            var {
                Buffer: uo
            } = zt(), dr = on(), {
                S_IFMT: o_,
                S_IFBLK: u_,
                S_IFCHR: c_,
                S_IFDIR: l_,
                S_IFIFO: f_,
                S_IFLNK: h_
            } = k2(), d_ = _2(), Qi = A2(), p_ = parseInt("755", 8), b_ = parseInt("644", 8), T2 = uo.alloc(1024);

            function g_(r) {
                switch (r & o_) {
                    case u_:
                        return "block-device";
                    case c_:
                        return "character-device";
                    case l_:
                        return "directory";
                    case f_:
                        return "fifo";
                    case h_:
                        return "symlink"
                }
                return "file"
            }

            function co(r) {
                if (r &= 511, r) return new dr(T2.slice(0, 512 - r))
            }

            function lo(r) {
                if (!r.pax) {
                    let e = Qi.encode(r);
                    if (e) return e
                }
                return m_(r)
            }

            function m_(r) {
                let e = Qi.encodePax({
                        name: r.name,
                        linkname: r.linkname,
                        pax: r.pax
                    }),
                    t = {
                        name: "PaxHeader",
                        mode: r.mode,
                        uid: r.uid,
                        gid: r.gid,
                        size: e.length,
                        mtime: r.mtime,
                        type: "pax-header",
                        linkname: r.linkname && "PaxHeader",
                        uname: r.uname,
                        gname: r.gname,
                        devmajor: r.devmajor,
                        devminor: r.devminor
                    };
                return new dr([Qi.encode(t), e, co(e.length), Qi.encode({
                    ...t,
                    size: r.size,
                    type: r.type
                })])
            }
            I2.exports = () => async function*(r) {
                for await (let {
                    header: e,
                    body: t
                } of r) {
                    if ((!e.size || e.type === "symlink") && (e.size = 0), e.type || (e.type = g_(e.mode)), e.mode || (e.mode = e.type === "directory" ? p_ : b_), e.uid || (e.uid = 0), e.gid || (e.gid = 0), e.mtime || (e.mtime = new Date), typeof t == "string" && (t = uo.from(t)), uo.isBuffer(t) || dr.isBufferList(t)) {
                        e.size = t.length, yield new dr([lo(e), t, co(e.size)]);
                        continue
                    }
                    if (e.type === "symlink" && !e.linkname) {
                        e.linkname = (await d_(t)).toString(), yield lo(e);
                        continue
                    }
                    if (yield lo(e), e.type !== "file" && e.type !== "contiguous-file") continue;
                    let n = 0;
                    for await (let s of t) n += s.length, yield dr.isBufferList(s) ? s : new dr(s);
                    if (n !== e.size) throw new Error("size mismatch");
                    let i = co(e.size);
                    i && (yield i)
                }
                yield new dr(T2)
            }
        });
        var q2 = h(fo => {
            fo.extract = w2();
            fo.pack = N2()
        });
        var O2 = h((jB, B2) => {
            "use strict";
            var y_ = q2(),
                x_ = J(),
                w_ = v(),
                S_ = L(),
                k_ = js();
            B2.exports = w_(r => {
                async function* e(t, n = {}) {
                    let i = await r.post("get", {
                            timeout: n.timeout,
                            signal: n.signal,
                            searchParams: S_({
                                arg: `${t instanceof Uint8Array?new x_(t):t}`,
                                ...n
                            }),
                            headers: n.headers
                        }),
                        s = y_.extract();
                    for await (let {
                        header: a,
                        body: f
                    } of s(i.iterator())) a.type === "directory" ? yield {
                        type: "dir",
                        path: a.name
                    } : yield {
                        type: "file",
                        path: a.name,
                        content: k_(f, u => u.slice())
                    }
                }
                return e
            })
        });
        var v2 = h((GB, P2) => {
            "use strict";
            var E_ = v();
            P2.exports = E_(r => () => {
                let e = new URL(r.opts.base || "");
                return {
                    host: e.hostname,
                    port: e.port,
                    protocol: e.protocol,
                    pathname: e.pathname,
                    "api-path": e.pathname
                }
            })
        });
        var ho = h(($B, C2) => {
            "use strict";
            var __ = Ne(),
                {
                    Multiaddr: A_
                } = Pe(),
                I_ = v(),
                T_ = L();
            C2.exports = I_(r => {
                async function e(t = {}) {
                    let i = await (await r.post("id", {
                            timeout: t.timeout,
                            signal: t.signal,
                            searchParams: T_({
                                arg: t.peerId ? t.peerId.toString() : void 0,
                                ...t
                            }),
                            headers: t.headers
                        })).json(),
                        s = {
                            ...__(i)
                        };
                    return s.addresses && (s.addresses = s.addresses.map(a => new A_(a))), s
                }
                return e
            })
        });
        var F2 = h((VB, U2) => {
            "use strict";
            var N_ = ho();
            U2.exports = r => {
                let e = N_(r);
                async function t(n = {}) {
                    let i = await e(n);
                    return Boolean(i && i.addresses && i.addresses.length)
                }
                return t
            }
        });
        var R2 = h((WB, L2) => {
            "use strict";
            var q_ = Ne(),
                B_ = v(),
                O_ = L();
            L2.exports = B_(r => {
                async function e(t, n = {
                    type: "rsa",
                    size: 2048
                }) {
                    let s = await (await r.post("key/gen", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: O_({
                            arg: t,
                            ...n
                        }),
                        headers: n.headers
                    })).json();
                    return q_(s)
                }
                return e
            })
        });
        var M2 = h((YB, D2) => {
            "use strict";
            var P_ = Ne(),
                v_ = v(),
                C_ = L();
            D2.exports = v_(r => {
                async function e(t = {}) {
                    return ((await (await r.post("key/list", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: C_(t),
                        headers: t.headers
                    })).json()).Keys || []).map(s => P_(s))
                }
                return e
            })
        });
        var H2 = h((KB, z2) => {
            "use strict";
            var U_ = Ne(),
                F_ = v(),
                L_ = L();
            z2.exports = F_(r => {
                async function e(t, n, i = {}) {
                    let s = await r.post("key/rename", {
                        timeout: i.timeout,
                        signal: i.signal,
                        searchParams: L_({
                            arg: [t, n],
                            ...i
                        }),
                        headers: i.headers
                    });
                    return U_(await s.json())
                }
                return e
            })
        });
        var G2 = h((XB, j2) => {
            "use strict";
            var R_ = Ne(),
                D_ = v(),
                M_ = L();
            j2.exports = D_(r => {
                async function e(t, n = {}) {
                    let s = await (await r.post("key/rm", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: M_({
                            arg: t,
                            ...n
                        }),
                        headers: n.headers
                    })).json();
                    return R_(s.Keys[0])
                }
                return e
            })
        });
        var V2 = h((JB, $2) => {
            "use strict";
            var z_ = Ne(),
                H_ = v(),
                j_ = L();
            $2.exports = H_(r => {
                async function e(t, n, i, s = {}) {
                    let f = await (await r.post("key/import", {
                        timeout: s.timeout,
                        signal: s.signal,
                        searchParams: j_({
                            arg: t,
                            pem: n,
                            password: i,
                            ...s
                        }),
                        headers: s.headers
                    })).json();
                    return z_(f)
                }
                return e
            })
        });
        var Y2 = h((ZB, W2) => {
            "use strict";
            var G_ = v();
            W2.exports = G_(r => async (t, n, i = {}) => {
                throw new Error("Not implemented")
            })
        });
        var X2 = h((QB, K2) => {
            "use strict";
            var $_ = v();
            K2.exports = $_(r => async (t, n = {}) => {
                throw new Error("Not implemented")
            })
        });
        var Z2 = h((eO, J2) => {
            "use strict";
            J2.exports = r => ({
                gen: R2()(r),
                list: M2()(r),
                rename: H2()(r),
                rm: G2()(r),
                import: V2()(r),
                export: Y2()(r),
                info: X2()(r)
            })
        });
        var eb = h((tO, Q2) => {
            "use strict";
            var V_ = v(),
                W_ = L();
            Q2.exports = V_(r => {
                async function* e(t = {}) {
                    yield*(await r.post("log/tail", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: W_(t),
                        headers: t.headers
                    })).ndjson()
                }
                return e
            })
        });
        var rb = h((rO, tb) => {
            "use strict";
            var Y_ = v(),
                K_ = L();
            tb.exports = Y_(r => {
                async function e(t = {}) {
                    return (await (await r.post("log/ls", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: K_(t),
                        headers: t.headers
                    })).json()).Strings
                }
                return e
            })
        });
        var ib = h((nO, nb) => {
            "use strict";
            var X_ = Ne(),
                J_ = v(),
                Z_ = L();
            nb.exports = J_(r => {
                async function e(t, n, i = {}) {
                    let s = await r.post("log/level", {
                        timeout: i.timeout,
                        signal: i.signal,
                        searchParams: Z_({
                            arg: [t, n],
                            ...i
                        }),
                        headers: i.headers
                    });
                    return X_(await s.json())
                }
                return e
            })
        });
        var ab = h((iO, sb) => {
            "use strict";
            sb.exports = r => ({
                tail: eb()(r),
                ls: rb()(r),
                level: ib()(r)
            })
        });
        var cb = h((sO, ob) => {
            "use strict";
            var ub = J(),
                Q_ = v(),
                e5 = L(),
                t5 = to();
            ob.exports = Q_((r, e) => {
                async function* t(n, i = {}) {
                    let s = `${n instanceof Uint8Array?new ub(n):n}`;
                    async function a(u) {
                        let b = u.Hash;
                        if (b.includes("/")) {
                            let E = b.startsWith("/ipfs/") ? b : `/ipfs/${b}`;
                            b = (await t5(e)(E)).cid
                        }
                        let y = {
                            name: u.Name,
                            path: s + (u.Name ? `/${u.Name}` : ""),
                            size: u.Size,
                            cid: new ub(b),
                            type: r5(u),
                            depth: u.Depth || 1
                        };
                        return u.Mode && (y.mode = parseInt(u.Mode, 8)), u.Mtime !== void 0 && u.Mtime !== null && (y.mtime = {
                            secs: u.Mtime
                        }, u.MtimeNsecs !== void 0 && u.MtimeNsecs !== null && (y.mtime.nsecs = u.MtimeNsecs)), y
                    }
                    let f = await r.post("ls", {
                        timeout: i.timeout,
                        signal: i.signal,
                        searchParams: e5({
                            arg: s,
                            ...i
                        }),
                        headers: i.headers
                    });
                    for await (let u of f.ndjson()) {
                        if (u = u.Objects, !u) throw new Error("expected .Objects in results");
                        if (u = u[0], !u) throw new Error("expected one array in results.Objects");
                        let b = u.Links;
                        if (!Array.isArray(b)) throw new Error("expected one array in results.Objects[0].Links");
                        if (!b.length) {
                            yield a(u);
                            return
                        }
                        yield* b.map(a)
                    }
                }
                return t
            });

            function r5(r) {
                switch (r.Type) {
                    case 1:
                    case 5:
                        return "dir";
                    case 2:
                        return "file";
                    default:
                        return "file"
                }
            }
        });
        var fb = h((aO, lb) => {
            "use strict";
            var n5 = Ne(),
                i5 = v(),
                s5 = L();
            lb.exports = i5(r => {
                async function e(t = {}) {
                    let n = await r.post("dns", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: s5(t),
                        headers: t.headers
                    });
                    return n5(await n.json())
                }
                return e
            })
        });
        var db = h((oO, hb) => {
            "use strict";
            var a5 = Ne(),
                o5 = v(),
                u5 = L();
            hb.exports = o5(r => {
                async function e(t, n = {}) {
                    let i = await r.post("name/publish", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: u5({
                            arg: t,
                            ...n
                        }),
                        headers: n.headers
                    });
                    return a5(await i.json())
                }
                return e
            })
        });
        var bb = h((uO, pb) => {
            "use strict";
            var c5 = v(),
                l5 = L();
            pb.exports = c5(r => {
                async function* e(t, n = {}) {
                    let i = await r.post("name/resolve", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: l5({
                            arg: t,
                            stream: !0,
                            ...n
                        }),
                        headers: n.headers
                    });
                    for await (let s of i.ndjson()) yield s.Path
                }
                return e
            })
        });
        var mb = h((cO, gb) => {
            "use strict";
            var f5 = Ne(),
                h5 = v(),
                d5 = L();
            gb.exports = h5(r => {
                async function e(t, n = {}) {
                    let i = await r.post("name/pubsub/cancel", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: d5({
                            arg: t,
                            ...n
                        }),
                        headers: n.headers
                    });
                    return f5(await i.json())
                }
                return e
            })
        });
        var xb = h((lO, yb) => {
            "use strict";
            var p5 = Ne(),
                b5 = v(),
                g5 = L();
            yb.exports = b5(r => {
                async function e(t = {}) {
                    let n = await r.post("name/pubsub/state", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: g5(t),
                        headers: t.headers
                    });
                    return p5(await n.json())
                }
                return e
            })
        });
        var Sb = h((fO, wb) => {
            "use strict";
            var m5 = v(),
                y5 = L();
            wb.exports = m5(r => {
                async function e(t = {}) {
                    return (await (await r.post("name/pubsub/subs", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: y5(t),
                        headers: t.headers
                    })).json()).Strings || []
                }
                return e
            })
        });
        var Eb = h((hO, kb) => {
            "use strict";
            kb.exports = r => ({
                cancel: mb()(r),
                state: xb()(r),
                subs: Sb()(r)
            })
        });
        var Ab = h((dO, _b) => {
            "use strict";
            _b.exports = r => ({
                publish: db()(r),
                resolve: bb()(r),
                pubsub: Eb()(r)
            })
        });
        var Tb = h((pO, Ib) => {
            "use strict";
            var x5 = J(),
                w5 = v(),
                S5 = L();
            Ib.exports = w5(r => {
                async function e(t, n = {}) {
                    let s = await (await r.post("object/data", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: S5({
                            arg: `${t instanceof Uint8Array?new x5(t):t}`,
                            ...n
                        }),
                        headers: n.headers
                    })).arrayBuffer();
                    return new Uint8Array(s, 0, s.byteLength)
                }
                return e
            })
        });
        var qb = h((bO, Nb) => {
            "use strict";
            var k5 = J(),
                {
                    DAGNode: E5,
                    DAGLink: _5
                } = Un(),
                A5 = v(),
                I5 = L(),
                T5 = et();
            Nb.exports = A5(r => {
                async function e(t, n = {}) {
                    let s = await (await r.post("object/get", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: I5({
                            arg: `${t instanceof Uint8Array?new k5(t):t}`,
                            dataEncoding: "base64",
                            ...n
                        }),
                        headers: n.headers
                    })).json();
                    return new E5(T5(s.Data, "base64pad"), (s.Links || []).map(a => new _5(a.Name, a.Size, a.Hash)))
                }
                return e
            })
        });
        var Ob = h((gO, Bb) => {
            "use strict";
            var N5 = J(),
                {
                    DAGLink: q5
                } = Un(),
                B5 = v(),
                O5 = L();
            Bb.exports = B5(r => {
                async function e(t, n = {}) {
                    return ((await (await r.post("object/links", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: O5({
                            arg: `${t instanceof Uint8Array?new N5(t):t}`,
                            ...n
                        }),
                        headers: n.headers
                    })).json()).Links || []).map(a => new q5(a.Name, a.Size, a.Hash))
                }
                return e
            })
        });
        var vb = h((mO, Pb) => {
            "use strict";
            var P5 = J(),
                v5 = v(),
                C5 = L();
            Pb.exports = v5(r => {
                async function e(t = {}) {
                    let n = await r.post("object/new", {
                            timeout: t.timeout,
                            signal: t.signal,
                            searchParams: C5({
                                arg: t.template,
                                ...t
                            }),
                            headers: t.headers
                        }),
                        {
                            Hash: i
                        } = await n.json();
                    return new P5(i)
                }
                return e
            })
        });
        var Fb = h((yO, Cb) => {
            "use strict";
            var Ub = J(),
                U5 = v(),
                F5 = L();
            Cb.exports = U5(r => {
                async function e(t, n, i = {}) {
                    let s = await r.post("object/patch/add-link", {
                            timeout: i.timeout,
                            signal: i.signal,
                            searchParams: F5({
                                arg: [`${t instanceof Uint8Array?new Ub(t):t}`, n.Name || n.name || "", (n.Hash || n.cid || "").toString() || null],
                                ...i
                            }),
                            headers: i.headers
                        }),
                        {
                            Hash: a
                        } = await s.json();
                    return new Ub(a)
                }
                return e
            })
        });
        var Db = h((xO, Lb) => {
            "use strict";
            var Rb = J(),
                L5 = xt(),
                R5 = v(),
                D5 = L(),
                M5 = wt(),
                {
                    AbortController: z5
                } = Je();
            Lb.exports = R5(r => {
                async function e(t, n, i = {}) {
                    let s = new z5,
                        a = M5(s.signal, i.signal),
                        f = await r.post("object/patch/append-data", {
                            timeout: i.timeout,
                            signal: a,
                            searchParams: D5({
                                arg: `${t instanceof Uint8Array?new Rb(t):t}`,
                                ...i
                            }),
                            ...await L5(n, s, i.headers)
                        }),
                        {
                            Hash: u
                        } = await f.json();
                    return new Rb(u)
                }
                return e
            })
        });
        var Hb = h((wO, Mb) => {
            "use strict";
            var zb = J(),
                H5 = v(),
                j5 = L();
            Mb.exports = H5(r => {
                async function e(t, n, i = {}) {
                    let s = await r.post("object/patch/rm-link", {
                            timeout: i.timeout,
                            signal: i.signal,
                            searchParams: j5({
                                arg: [`${t instanceof Uint8Array?new zb(t):t}`, n.Name || n.name || null],
                                ...i
                            }),
                            headers: i.headers
                        }),
                        {
                            Hash: a
                        } = await s.json();
                    return new zb(a)
                }
                return e
            })
        });
        var $b = h((SO, jb) => {
            "use strict";
            var Gb = J(),
                G5 = xt(),
                $5 = v(),
                V5 = L(),
                W5 = wt(),
                {
                    AbortController: Y5
                } = Je();
            jb.exports = $5(r => {
                async function e(t, n, i = {}) {
                    let s = new Y5,
                        a = W5(s.signal, i.signal),
                        {
                            Hash: f
                        } = await (await r.post("object/patch/set-data", {
                            timeout: i.timeout,
                            signal: a,
                            searchParams: V5({
                                arg: [`${t instanceof Uint8Array?new Gb(t):t}`],
                                ...i
                            }),
                            ...await G5(n, s, i.headers)
                        })).json();
                    return new Gb(f)
                }
                return e
            })
        });
        var Wb = h((kO, Vb) => {
            "use strict";
            Vb.exports = r => ({
                addLink: Fb()(r),
                appendData: Db()(r),
                rmLink: Hb()(r),
                setData: $b()(r)
            })
        });
        var Kb = h((EO, Yb) => {
            "use strict";
            var K5 = J(),
                {
                    DAGNode: X5
                } = Un(),
                J5 = xt(),
                Z5 = v(),
                Q5 = L(),
                eA = wt(),
                {
                    AbortController: tA
                } = Je(),
                po = st(),
                rA = et();
            Yb.exports = Z5(r => {
                async function e(t, n = {}) {
                    let i = {
                        Data: void 0,
                        Links: []
                    };
                    if (t instanceof Uint8Array) n.enc || (i = {
                        Data: po(t),
                        Links: []
                    });
                    else if (t instanceof X5) i = {
                        Data: po(t.Data),
                        Links: t.Links.map(y => ({
                            Name: y.Name,
                            Hash: y.Hash.toString(),
                            Size: y.Tsize
                        }))
                    };
                    else if (typeof t == "object") t.Data && (i.Data = po(t.Data)), t.Links && (i.Links = t.Links);
                    else throw new Error("obj not recognized");
                    let s;
                    t instanceof Uint8Array && n.enc ? s = t : (n.enc = "json", s = rA(JSON.stringify(i)));
                    let a = new tA,
                        f = eA(a.signal, n.signal),
                        u = await r.post("object/put", {
                            timeout: n.timeout,
                            signal: f,
                            searchParams: Q5(n),
                            ...await J5(s, a, n.headers)
                        }),
                        {
                            Hash: b
                        } = await u.json();
                    return new K5(b)
                }
                return e
            })
        });
        var Jb = h((_O, Xb) => {
            "use strict";
            var nA = J(),
                iA = v(),
                sA = L();
            Xb.exports = iA(r => {
                async function e(t, n = {}) {
                    return (await r.post("object/stat", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: sA({
                            arg: `${t instanceof Uint8Array?new nA(t):t}`,
                            ...n
                        }),
                        headers: n.headers
                    })).json()
                }
                return e
            })
        });
        var Qb = h((AO, Zb) => {
            "use strict";
            Zb.exports = r => ({
                data: Tb()(r),
                get: qb()(r),
                links: Ob()(r),
                new: vb()(r),
                patch: Wb()(r),
                put: Kb()(r),
                stat: Jb()(r)
            })
        });
        var tg = h((IO, eg) => {
            "use strict";
            var aA = xi(),
                bo = L(),
                Ht = class {
                    constructor(e) {
                        this.client = new aA(e)
                    }
                    static encodeEndpoint(e) {
                        let t = String(e);
                        if (t === "undefined") throw Error("endpoint is required");
                        return t[t.length - 1] === "/" ? t.slice(0, -1) : t
                    }
                    static decodeRemoteService(e) {
                        return {
                            service: e.Service,
                            endpoint: new URL(e.ApiEndpoint),
                            ...e.Stat && {
                                stat: Ht.decodeStat(e.Stat)
                            }
                        }
                    }
                    static decodeStat(e) {
                        switch (e.Status) {
                            case "valid": {
                                let {
                                    Pinning: t,
                                    Pinned: n,
                                    Queued: i,
                                    Failed: s
                                } = e.PinCount;
                                return {
                                    status: "valid",
                                    pinCount: {
                                        queued: i,
                                        pinning: t,
                                        pinned: n,
                                        failed: s
                                    }
                                }
                            }
                            case "invalid":
                                return {
                                    status: "invalid"
                                };
                            default:
                                return {
                                    status: e.Status
                                }
                        }
                    }
                };
            Ht.prototype.add = async function(e, t) {
                let {
                    endpoint: n,
                    key: i,
                    headers: s,
                    timeout: a,
                    signal: f
                } = t;
                await this.client.post("pin/remote/service/add", {
                    timeout: a,
                    signal: f,
                    searchParams: bo({
                        arg: [e, Ht.encodeEndpoint(n), i]
                    }),
                    headers: s
                })
            };
            Ht.prototype.rm = async function(e, t = {}) {
                await this.client.post("pin/remote/service/rm", {
                    timeout: t.timeout,
                    signal: t.signal,
                    headers: t.headers,
                    searchParams: bo({
                        arg: e
                    })
                })
            };
            Ht.prototype.ls = async function(e = {}) {
                let {
                    stat: t,
                    headers: n,
                    timeout: i,
                    signal: s
                } = e, a = await this.client.post("pin/remote/service/ls", {
                    timeout: i,
                    signal: s,
                    headers: n,
                    searchParams: t === !0 ? bo({
                        stat: t
                    }) : void 0
                }), {
                    RemoteServices: f
                } = await a.json();
                return f.map(Ht.decodeRemoteService)
            };
            eg.exports = Ht
        });
        var ug = h((TO, rg) => {
            "use strict";
            var ng = J(),
                oA = xi(),
                uA = tg(),
                ig = L(),
                ln = class {
                    constructor(e) {
                        this.client = new oA(e), this.service = new uA(e)
                    }
                };
            ln.prototype.add = async function(e, {
                timeout: t,
                signal: n,
                headers: i,
                ...s
            }) {
                let a = await this.client.post("pin/remote/add", {
                    timeout: t,
                    signal: n,
                    headers: i,
                    searchParams: cA({
                        cid: e,
                        ...s
                    })
                });
                return sg(await a.json())
            };
            ln.prototype.ls = async function*({
                timeout: e,
                signal: t,
                headers: n,
                ...i
            }) {
                let s = await this.client.post("pin/remote/ls", {
                    timeout: e,
                    signal: t,
                    headers: n,
                    searchParams: go(i)
                });
                for await (let a of s.ndjson()) yield sg(a)
            };
            ln.prototype.rm = async function({
                timeout: e,
                signal: t,
                headers: n,
                ...i
            }) {
                await this.client.post("pin/remote/rm", {
                    timeout: e,
                    signal: t,
                    headers: n,
                    searchParams: go({
                        ...i,
                        all: !1
                    })
                })
            };
            ln.prototype.rmAll = async function({
                timeout: r,
                signal: e,
                headers: t,
                ...n
            }) {
                await this.client.post("pin/remote/rm", {
                    timeout: r,
                    signal: e,
                    headers: t,
                    searchParams: go({
                        ...n,
                        all: !0
                    })
                })
            };
            var sg = ({
                    Name: r,
                    Status: e,
                    Cid: t
                }) => ({
                    cid: new ng(t),
                    name: r,
                    status: e
                }),
                ag = r => {
                    if (typeof r == "string" && r !== "") return r;
                    throw new TypeError("service name must be passed")
                },
                og = r => {
                    if (ng.isCID(r)) return r.toString();
                    throw new TypeError(`CID instance expected instead of ${r}`)
                },
                go = ({
                    service: r,
                    cid: e,
                    name: t,
                    status: n,
                    all: i
                }) => {
                    let s = ig({
                        service: ag(r),
                        name: t,
                        force: i ? !0 : void 0
                    });
                    if (e)
                        for (let a of e) s.append("cid", og(a));
                    if (n)
                        for (let a of n) s.append("status", a);
                    return s
                },
                cA = ({
                    cid: r,
                    service: e,
                    background: t,
                    name: n,
                    origins: i
                }) => {
                    let s = ig({
                        arg: og(r),
                        service: ag(e),
                        name: n,
                        background: t ? !0 : void 0
                    });
                    if (i)
                        for (let a of i) s.append("origin", a.toString());
                    return s
                };
            rg.exports = ln
        });
        var yo = h((NO, cg) => {
            "use strict";
            var $n = sr(),
                mo = J();
            cg.exports = async function*(e) {
                if (e == null) throw $n(new Error(`Unexpected input: ${e}`), "ERR_UNEXPECTED_INPUT");
                if (mo.isCID(e)) {
                    yield Et({
                        cid: e
                    });
                    return
                }
                if (e instanceof String || typeof e == "string") {
                    yield Et({
                        path: e
                    });
                    return
                }
                if (e.cid != null || e.path != null) return yield Et(e);
                if (Symbol.iterator in e) {
                    let t = e[Symbol.iterator](),
                        n = t.next();
                    if (n.done) return t;
                    if (mo.isCID(n.value) || n.value instanceof String || typeof n.value == "string") {
                        yield Et({
                            cid: n.value
                        });
                        for (let i of t) yield Et({
                            cid: i
                        });
                        return
                    }
                    if (n.value.cid != null || n.value.path != null) {
                        yield Et(n.value);
                        for (let i of t) yield Et(i);
                        return
                    }
                    throw $n(new Error("Unexpected input: " + typeof e), "ERR_UNEXPECTED_INPUT")
                }
                if (Symbol.asyncIterator in e) {
                    let t = e[Symbol.asyncIterator](),
                        n = await t.next();
                    if (n.done) return t;
                    if (mo.isCID(n.value) || n.value instanceof String || typeof n.value == "string") {
                        yield Et({
                            cid: n.value
                        });
                        for await (let i of t) yield Et({
                            cid: i
                        });
                        return
                    }
                    if (n.value.cid != null || n.value.path != null) {
                        yield Et(n.value);
                        for await (let i of t) yield Et(i);
                        return
                    }
                    throw $n(new Error("Unexpected input: " + typeof e), "ERR_UNEXPECTED_INPUT")
                }
                throw $n(new Error("Unexpected input: " + typeof e), "ERR_UNEXPECTED_INPUT")
            };

            function Et(r) {
                let e = r.cid || `${r.path}`;
                if (!e) throw $n(new Error("Unexpected input: Please path either a CID or an IPFS path"), "ERR_UNEXPECTED_INPUT");
                let t = {
                    path: e,
                    recursive: r.recursive !== !1
                };
                return r.metadata != null && (t.metadata = r.metadata), t
            }
        });
        var xo = h((qO, lg) => {
            "use strict";
            var fg = J(),
                lA = v(),
                fA = yo(),
                hA = L();
            lg.exports = lA(r => {
                async function* e(t, n = {}) {
                    for await (let {
                        path: i,
                        recursive: s,
                        metadata: a
                    } of fA(t)) {
                        let f = await r.post("pin/add", {
                            timeout: n.timeout,
                            signal: n.signal,
                            searchParams: hA({
                                ...n,
                                arg: i,
                                recursive: s,
                                metadata: a ? JSON.stringify(a) : void 0,
                                stream: !0
                            }),
                            headers: n.headers
                        });
                        for await (let u of f.ndjson()) {
                            if (u.Pins) {
                                for (let b of u.Pins) yield new fg(b);
                                continue
                            }
                            yield new fg(u)
                        }
                    }
                }
                return e
            })
        });
        var dg = h((BO, hg) => {
            "use strict";
            var dA = xo(),
                pA = qi(),
                bA = v();
            hg.exports = r => {
                let e = dA(r);
                return bA(() => {
                    async function t(n, i = {}) {
                        return pA(e([{
                            path: n,
                            ...i
                        }], i))
                    }
                    return t
                })(r)
            }
        });
        var gg = h((OO, pg) => {
            "use strict";
            var gA = J(),
                mA = v(),
                yA = L();

            function bg(r, e, t) {
                let n = {
                    type: r,
                    cid: new gA(e)
                };
                return t && (n.metadata = t), n
            }
            pg.exports = mA(r => {
                async function* e(t = {}) {
                    let n = [];
                    t.paths && (n = Array.isArray(t.paths) ? t.paths : [t.paths]);
                    let i = await r.post("pin/ls", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: yA({
                            ...t,
                            arg: n.map(s => `${s}`),
                            stream: !0
                        }),
                        headers: t.headers
                    });
                    for await (let s of i.ndjson()) {
                        if (s.Keys) {
                            for (let a of Object.keys(s.Keys)) yield bg(s.Keys[a].Type, a, s.Keys[a].Metadata);
                            return
                        }
                        yield bg(s.Type, s.Cid, s.Metadata)
                    }
                }
                return e
            })
        });
        var wo = h((PO, mg) => {
            "use strict";
            var yg = J(),
                xA = v(),
                wA = yo(),
                SA = L();
            mg.exports = xA(r => {
                async function* e(t, n = {}) {
                    for await (let {
                        path: i,
                        recursive: s
                    } of wA(t)) {
                        let a = new URLSearchParams(n.searchParams);
                        a.append("arg", `${i}`), s != null && a.set("recursive", String(s));
                        let f = await r.post("pin/rm", {
                            timeout: n.timeout,
                            signal: n.signal,
                            headers: n.headers,
                            searchParams: SA({
                                ...n,
                                arg: `${i}`,
                                recursive: s
                            })
                        });
                        for await (let u of f.ndjson()) {
                            if (u.Pins) {
                                yield* u.Pins.map(b => new yg(b));
                                continue
                            }
                            yield new yg(u)
                        }
                    }
                }
                return e
            })
        });
        var wg = h((vO, xg) => {
            "use strict";
            var kA = wo(),
                EA = qi(),
                _A = v();
            xg.exports = r => {
                let e = kA(r);
                return _A(() => {
                    async function t(n, i = {}) {
                        return EA(e([{
                            path: n,
                            ...i
                        }], i))
                    }
                    return t
                })(r)
            }
        });
        var kg = h((CO, Sg) => {
            "use strict";
            var AA = ug();
            Sg.exports = r => ({
                add: dg()(r),
                addAll: xo()(r),
                ls: gg()(r),
                rm: wg()(r),
                rmAll: wo()(r),
                remote: new AA(r)
            })
        });
        var _g = h((UO, Eg) => {
            "use strict";
            var IA = Ne(),
                TA = v(),
                NA = L();
            Eg.exports = TA(r => {
                async function* e(t, n = {}) {
                    yield*(await r.post("ping", {
                        timeout: n.timeout,
                        signal: n.signal,
                        searchParams: NA({
                            arg: `${t}`,
                            ...n
                        }),
                        headers: n.headers,
                        transform: IA
                    })).ndjson()
                }
                return e
            })
        });
        var Ig = h((FO, Ag) => {
            "use strict";
            var qA = v(),
                BA = L();
            Ag.exports = qA(r => {
                async function e(t = {}) {
                    let {
                        Strings: n
                    } = await (await r.post("pubsub/ls", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: BA(t),
                        headers: t.headers
                    })).json();
                    return n || []
                }
                return e
            })
        });
        var Ng = h((LO, Tg) => {
            "use strict";
            var OA = v(),
                PA = L();
            Tg.exports = OA(r => {
                async function e(t, n = {}) {
                    let i = await r.post("pubsub/peers", {
                            timeout: n.timeout,
                            signal: n.signal,
                            searchParams: PA({
                                arg: t,
                                ...n
                            }),
                            headers: n.headers
                        }),
                        {
                            Strings: s
                        } = await i.json();
                    return s || []
                }
                return e
            })
        });
        var Bg = h((RO, qg) => {
            "use strict";
            var vA = v(),
                CA = L(),
                UA = xt(),
                FA = wt(),
                {
                    AbortController: LA
                } = Je();
            qg.exports = vA(r => {
                async function e(t, n, i = {}) {
                    let s = CA({
                            arg: t,
                            ...i
                        }),
                        a = new LA,
                        f = FA(a.signal, i.signal);
                    await (await r.post("pubsub/pub", {
                        timeout: i.timeout,
                        signal: f,
                        searchParams: s,
                        ...await UA(n, a, i.headers)
                    })).text()
                }
                return e
            })
        });
        var So = h((DO, Og) => {
            "use strict";
            var {
                AbortController: RA
            } = Je(), jt = class {
                constructor() {
                    this._subs = new Map
                }
                static singleton() {
                    return jt.instance || (jt.instance = new jt), jt.instance
                }
                subscribe(e, t, n) {
                    let i = this._subs.get(e) || [];
                    if (i.find(a => a.handler === t)) throw new Error(`Already subscribed to ${e} with this handler`);
                    let s = new RA;
                    return this._subs.set(e, [{
                        handler: t,
                        controller: s
                    }].concat(i)), n && n.addEventListener("abort", () => this.unsubscribe(e, t)), s.signal
                }
                unsubscribe(e, t) {
                    let n = this._subs.get(e) || [],
                        i;
                    t ? (this._subs.set(e, n.filter(s => s.handler !== t)), i = n.filter(s => s.handler === t)) : (this._subs.set(e, []), i = n), i.forEach(s => s.controller.abort())
                }
            };
            jt.instance = null;
            Og.exports = jt
        });
        var vg = h((MO, Pg) => {
            "use strict";
            var ko = et(),
                DA = st(),
                MA = Fs()("ipfs-http-client:pubsub:subscribe"),
                zA = So(),
                HA = v(),
                jA = L();
            Pg.exports = HA((r, e) => {
                let t = zA.singleton();
                async function n(i, s, a = {}) {
                    a.signal = t.subscribe(i, s, a.signal);
                    let f, u, b = new Promise((E, z) => {
                            f = E, u = z
                        }),
                        y = setTimeout(() => f(), 1e3);
                    return setTimeout(() => {
                        r.post("pubsub/sub", {
                            timeout: a.timeout,
                            signal: a.signal,
                            searchParams: jA({
                                arg: i,
                                ...a
                            }),
                            headers: a.headers
                        }).catch(E => {
                            t.unsubscribe(i, s), u(E)
                        }).then(E => {
                            clearTimeout(y), !!E && (GA(E, {
                                onMessage: s,
                                onEnd: () => t.unsubscribe(i, s),
                                onError: a.onError
                            }), f())
                        })
                    }, 0), b
                }
                return n
            });
            async function GA(r, {
                onMessage: e,
                onEnd: t,
                onError: n
            }) {
                n = n || MA;
                try {
                    for await (let i of r.ndjson()) try {
                        if (!i.from) continue;
                        e({
                            from: DA(ko(i.from, "base64pad"), "base58btc"),
                            data: ko(i.data, "base64pad"),
                            seqno: ko(i.seqno, "base64pad"),
                            topicIDs: i.topicIDs
                        })
                    } catch (s) {
                        s.message = `Failed to parse pubsub message: ${s.message}`, n(s, !1, i)
                    }
                } catch (i) {
                    $A(i) || n(i, !0)
                } finally {
                    t()
                }
            }
            var $A = r => {
                switch (r.type) {
                    case "aborted":
                        return !0;
                    case "abort":
                        return !0;
                    default:
                        return r.name === "AbortError"
                }
            }
        });
        var Ug = h((zO, Cg) => {
            "use strict";
            var VA = So();
            Cg.exports = r => {
                let e = VA.singleton();
                async function t(n, i) {
                    e.unsubscribe(n, i)
                }
                return t
            }
        });
        var Lg = h((HO, Fg) => {
            "use strict";
            Fg.exports = r => ({
                ls: Ig()(r),
                peers: Ng()(r),
                publish: Bg()(r),
                subscribe: vg()(r),
                unsubscribe: Ug()(r)
            })
        });
        var Dg = h((jO, Rg) => {
            "use strict";
            var WA = Ne(),
                YA = v(),
                KA = L();
            Rg.exports = YA(r => {
                async function* e(t = {}) {
                    yield*(await r.post("refs/local", {
                        timeout: t.timeout,
                        signal: t.signal,
                        transform: WA,
                        searchParams: KA(t),
                        headers: t.headers
                    })).ndjson()
                }
                return e
            })
        });
        var zg = h((GO, Mg) => {
            "use strict";
            var XA = J(),
                JA = Ne(),
                ZA = v(),
                QA = L();
            Mg.exports = ZA((r, e) => Object.assign(async function*(n, i = {}) {
                Array.isArray(n) || (n = [n]), yield*(await r.post("refs", {
                    timeout: i.timeout,
                    signal: i.signal,
                    searchParams: QA({
                        arg: n.map(a => `${a instanceof Uint8Array?new XA(a):a}`),
                        ...i
                    }),
                    headers: i.headers,
                    transform: JA
                })).ndjson()
            }, {
                local: Dg()(e)
            }))
        });
        var jg = h(($O, Hg) => {
            "use strict";
            var eI = J(),
                tI = v(),
                rI = L();
            Hg.exports = tI(r => {
                async function* e(t = {}) {
                    yield*(await r.post("repo/gc", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: rI(t),
                        headers: t.headers,
                        transform: i => ({
                            err: i.Error ? new Error(i.Error) : null,
                            cid: (i.Key || {})["/"] ? new eI(i.Key["/"]) : null
                        })
                    })).ndjson()
                }
                return e
            })
        });
        var Eo = h((VO, Gg) => {
            "use strict";
            var nI = v(),
                iI = L();
            Gg.exports = nI(r => {
                async function e(t = {}) {
                    let i = await (await r.post("repo/stat", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: iI(t),
                        headers: t.headers
                    })).json();
                    return {
                        numObjects: BigInt(i.NumObjects),
                        repoSize: BigInt(i.RepoSize),
                        repoPath: i.RepoPath,
                        version: i.Version,
                        storageMax: BigInt(i.StorageMax)
                    }
                }
                return e
            })
        });
        var Vg = h((WO, $g) => {
            "use strict";
            var sI = v(),
                aI = L();
            $g.exports = sI(r => {
                async function e(t = {}) {
                    return (await (await r.post("repo/version", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: aI(t),
                        headers: t.headers
                    })).json()).Version
                }
                return e
            })
        });
        var Yg = h((YO, Wg) => {
            "use strict";
            Wg.exports = r => ({
                gc: jg()(r),
                stat: Eo()(r),
                version: Vg()(r)
            })
        });
        var Xg = h((KO, Kg) => {
            "use strict";
            var oI = v(),
                uI = L();
            Kg.exports = oI(r => {
                async function e(t, n = {}) {
                    let i = await r.post("resolve", {
                            timeout: n.timeout,
                            signal: n.signal,
                            searchParams: uI({
                                arg: t,
                                ...n
                            }),
                            headers: n.headers
                        }),
                        {
                            Path: s
                        } = await i.json();
                    return s
                }
                return e
            })
        });
        var Zg = h((XO, Jg) => {
            "use strict";
            var cI = v();
            Jg.exports = cI(r => async (t = {}) => {
                throw new Error("Not implemented")
            })
        });
        var em = h((JO, Qg) => {
            "use strict";
            var lI = v(),
                fI = L();
            Qg.exports = lI(r => {
                async function* e(t = {}) {
                    yield*(await r.post("stats/bw", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: fI(t),
                        headers: t.headers,
                        transform: i => ({
                            totalIn: BigInt(i.TotalIn),
                            totalOut: BigInt(i.TotalOut),
                            rateIn: BigInt(i.RateIn),
                            rateOut: BigInt(i.RateOut)
                        })
                    })).ndjson()
                }
                return e
            })
        });
        var rm = h((ZO, tm) => {
            "use strict";
            tm.exports = r => ({
                bitswap: oa()(r),
                bw: em()(r),
                repo: Eo()(r)
            })
        });
        var im = h((QO, nm) => {
            "use strict";
            var hI = v(),
                dI = L();
            nm.exports = hI(r => {
                async function e(t = {}) {
                    await (await r.post("shutdown", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: dI(t),
                        headers: t.headers
                    })).text()
                }
                return e
            })
        });
        var am = h((eP, sm) => {
            "use strict";
            var {
                Multiaddr: pI
            } = Pe(), bI = v(), gI = L();
            sm.exports = bI(r => {
                async function e(t = {}) {
                    let n = await r.post("swarm/addrs", {
                            timeout: t.timeout,
                            signal: t.signal,
                            searchParams: gI(t),
                            headers: t.headers
                        }),
                        {
                            Addrs: i
                        } = await n.json();
                    return Object.keys(i).map(s => ({
                        id: s,
                        addrs: (i[s] || []).map(a => new pI(a))
                    }))
                }
                return e
            })
        });
        var um = h((tP, om) => {
            "use strict";
            var mI = v(),
                yI = L();
            om.exports = mI(r => {
                async function e(t, n = {}) {
                    let i = await r.post("swarm/connect", {
                            timeout: n.timeout,
                            signal: n.signal,
                            searchParams: yI({
                                arg: t,
                                ...n
                            }),
                            headers: n.headers
                        }),
                        {
                            Strings: s
                        } = await i.json();
                    return s || []
                }
                return e
            })
        });
        var lm = h((rP, cm) => {
            "use strict";
            var xI = v(),
                wI = L();
            cm.exports = xI(r => {
                async function e(t, n = {}) {
                    let i = await r.post("swarm/disconnect", {
                            timeout: n.timeout,
                            signal: n.signal,
                            searchParams: wI({
                                arg: t,
                                ...n
                            }),
                            headers: n.headers
                        }),
                        {
                            Strings: s
                        } = await i.json();
                    return s || []
                }
                return e
            })
        });
        var hm = h((nP, fm) => {
            "use strict";
            var {
                Multiaddr: SI
            } = Pe(), kI = v(), EI = L();
            fm.exports = kI(r => {
                async function e(t = {}) {
                    let n = await r.post("swarm/addrs/local", {
                            timeout: t.timeout,
                            signal: t.signal,
                            searchParams: EI(t),
                            headers: t.headers
                        }),
                        {
                            Strings: i
                        } = await n.json();
                    return (i || []).map(s => new SI(s))
                }
                return e
            })
        });
        var pm = h((iP, dm) => {
            "use strict";
            var {
                Multiaddr: _I
            } = Pe(), AI = v(), II = L();
            dm.exports = AI(r => {
                async function e(t = {}) {
                    let n = await r.post("swarm/peers", {
                            timeout: t.timeout,
                            signal: t.signal,
                            searchParams: II(t),
                            headers: t.headers
                        }),
                        {
                            Peers: i
                        } = await n.json();
                    return (i || []).map(s => ({
                        addr: new _I(s.Addr),
                        peer: s.Peer,
                        muxer: s.Muxer,
                        latency: s.Latency,
                        streams: s.Streams,
                        direction: s.Direction == null ? void 0 : s.Direction === 0 ? "inbound" : "outbound"
                    }))
                }
                return e
            })
        });
        var gm = h((sP, bm) => {
            "use strict";
            bm.exports = r => ({
                addrs: am()(r),
                connect: um()(r),
                disconnect: lm()(r),
                localAddrs: hm()(r),
                peers: pm()(r)
            })
        });
        var ym = h((aP, mm) => {
            "use strict";
            var TI = Ne(),
                NI = v(),
                qI = L();
            mm.exports = NI(r => {
                async function e(t = {}) {
                    let n = await r.post("version", {
                        timeout: t.timeout,
                        signal: t.signal,
                        searchParams: qI(t),
                        headers: t.headers
                    });
                    return TI(await n.json())
                }
                return e
            })
        });
        var RI = h((oP, xm) => {
            "use strict";
            var BI = J(),
                {
                    multiaddr: OI
                } = Pe(),
                PI = rr(),
                vI = Lt(),
                CI = Gt(),
                UI = Bc(),
                FI = gl();

            function LI(r = {}) {
                return {
                    add: df()(r),
                    addAll: aa()(r),
                    bitswap: Ef()(r),
                    block: Gf()(r),
                    bootstrap: rh()(r),
                    cat: ih()(r),
                    commands: ah()(r),
                    config: kh()(r),
                    dag: ip()(r),
                    dht: Sp()(r),
                    diag: qp()(r),
                    dns: Op()(r),
                    files: o2()(r),
                    get: O2()(r),
                    getEndpointConfig: v2()(r),
                    id: ho()(r),
                    isOnline: F2()(r),
                    key: Z2()(r),
                    log: ab()(r),
                    ls: cb()(r),
                    mount: fb()(r),
                    name: Ab()(r),
                    object: Qb()(r),
                    pin: kg()(r),
                    ping: _g()(r),
                    pubsub: Lg()(r),
                    refs: zg()(r),
                    repo: Yg()(r),
                    resolve: Xg()(r),
                    start: Zg()(r),
                    stats: rm()(r),
                    stop: im()(r),
                    swarm: gm()(r),
                    version: ym()(r)
                }
            }
            xm.exports = {
                create: LI,
                CID: BI,
                multiaddr: OI,
                multibase: PI,
                multicodec: vI,
                multihash: CI,
                globSource: UI,
                urlSource: FI
            }
        });
        return RI();
    })();
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     */
    /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
    /**
     * [js-sha3]{@link https://github.com/emn178/js-sha3}
     *
     * @version 0.8.0
     * @author Chen, Yi-Cyuan [emn178@gmail.com]
     * @copyright Chen, Yi-Cyuan 2015-2018
     * @license MIT
     */
    //! stable.js 0.1.8, https://github.com/Two-Screen/stable
    //! © 2018 Angry Bytes and contributors. MIT licensed.
    return IpfsHttpClient
}));