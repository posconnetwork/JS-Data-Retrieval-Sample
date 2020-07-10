# POSCON JavaScript Automated Data Retrieval

Welcome! If you're reading this page, you probably want to program your own data retrieval software to be used by the POSCON. This can be used to:

- Pull ATIS information, METAR, TAF, and/or SIGMET from live sources
- Generate an ATIS, METAR, TAF, and/or SIGMET automatically

## Table of Contents

<!-- toc -->

- [Architecture](#architecture)
  * [Recommended Development Environment](#recommended-development-environment)
  * [Interface](#interface)
- [Allowed Modules](#allowed-modules)
- [Sample Code](#sample-code)
- [How do I test locally?](#how-do-i-test-locally)
  * [CommonJS](#commonjs)
  * [TypeScript](#typescript)
- [I'm done, now what?](#im-done-now-what)
  * [My script adheres to the above, and I'm ready for it to be used](#my-script-adheres-to-the-above-and-im-ready-for-it-to-be-used)
- [Questions? Comments? Concerns?](#questions-comments-concerns)
- [Credits](#credits)

<!-- tocstop -->

## Architecture

All user-supplied JavaScript for the purpose of retriving an ATIS is run in a v8 Isolate. What does that mean? It means your code is being run in an isolated process, with no access to the host machine. We use this to ensure that no code supplied by other users may intefere with yours.

There may only be _one_ file provided per FIR, which must contain all code for retrieval for any airports within the FIR. Unsafe functions, modules, and objects are also disabled, such as `process`, `eval`, and `fs`.

### Recommended Development Environment

Our servers use Node v14 on an Alpine image, and store scripts on a remote location.

### Interface

Your script must export a default function that returns `AerodromeInformation` or a `Promise` that completes with one.

```typescript
export default function(icao: string): AerodromeInformation | PromiseLike<AerodromeInformation> { ... }
```

Please refer to [spec.d.ts](spec.d.ts) for details. When compiled to CommonJS, it becomes the following:

```javascript
exports.default = function(icao) { ... }
```

## Allowed Modules

The following modules are currently allowed to be `import`'ed by a script:

- [jsdom](https://www.npmjs.com/package/jsdom)
- [axios](https://www.npmjs.com/package/axios)

If you would like a module added that is not currently available, please open an issue with the title `Request to add <module name>`, and the body containing a brief description of how the module would be used, and justification for its inclusion.

## Sample Code

The sample code in [VHHK.ts](VHHK.ts) will retrieve information for Hong Kong International Airport (VHHH) in VHHK FIR written in TypeScript. A CommonJS implementation is available in [VHHK_CommonJS.js](VHHK_CommonJS.js)

The sample code in TypeScript embeds type annotations for easy understanding as well as context-aware code completion in popular IDEs. Run `npm run build` to build a CommonJS file from TypeScript. You can also write in CommonJS directly.

## How do I test locally?

### CommonJS

To test `VHHK_CommonJS.js`, run `npm run test-js ./VHHK_CommonJS VHHH` where VHHH is the aerodrome.

### TypeScript

To test `VHHK.ts`, run `npm run test ./VHHK VHHH` where VHHH is the aerodrome.

## I'm done, now what?

There are a few requirements for your file. They are as such:

- It must be named YOUR-FIR.js (it cannot be TypeScript, it must be compiled)
  - I.e., if you are writing a file to be used by the VHHK FIR, it would be named `VHHK.js`
- The default export must be a function that returns either:
  - `AerodromeInformation`, as defined in [spec.d.ts](spec.d.ts)
  - A promise that resolves to `AerodromeInformation`
- All unused or unknown fields must be blank values
- Only _**ONE**_ of these two may be defined:
  - ATIS `body`
  - ATIS `departure` and `arrival`

### My script adheres to the above, and I'm ready for it to be used

Once you've written your script, please send it to [support@poscon.net](mailto:support@poscon.net) to be integrated.

## Questions? Comments? Concerns?

If you have any questions about the library, please feel free to open an issue, or send us a message at [support@poscon.net](mailto:support@poscon.net)

## Credits

- Server software by Eamonn Nugent ([@space55](https://github.com/space55))
- Client side TypeScript, documentation assistance, and testing by Tim Wong ([@wegylexy](https://github.com/wegylexy))
