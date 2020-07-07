// for testing only, not exact setup. e.g. `node test.js VHHH`
(async () => {
    const aerodrome = process.argv[2],
        script = require("fs").readFileSync(`${aerodrome.toLowerCase()}.js`, "utf-8"),
        names = Object.getOwnPropertyNames(globalThis).filter(n => !["eval", "module", "require"].includes(n)),
        sandbox = {
            Object, Function, Array, Number, parseFloat, parseInt, Infinity, NaN, undefined, Boolean, String, Symbol, Date, Promise, RegExp,
            Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError, JSON,
            Math, console: { error: () => { }, log: () => { }, warn: () => { } }, Intl,
            ArrayBuffer, Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Float32Array, Float64Array,
            DataView, Map, BigInt, Set, WeakMap, WeakSet,
            Proxy, decodeURI, decodeURIComponent, encodeURI, encodeURIComponent, escape, unescape,
            isFinite, isNaN, SharedArrayBuffer, Atomics, WebAssembly, Buffer, URL, URLSearchParams,
            TextEncoder, TextDecoder
        },
        m = {};
    sandbox.GLOBAL = sandbox.global = sandbox.globalThis = sandbox;
    new Function("module", "require", ...names, `"use strict";${script}`)(
        m,
        moduleName => require(["jsdom", "axios"].includes(moduleName) ? moduleName : " "),
        ...names.map(n => (sandbox[n]))
    );
    const atis = await m.exports(aerodrome.toUpperCase()),
        t = atis.body || atis.arrival && atis.departure && [atis.arrival, , atis.departure].join("\n");
    if (t)
        console.log(t);
    else
        console.error("NO DATA");
})();
