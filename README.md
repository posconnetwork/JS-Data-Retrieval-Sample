# POSCON JavaScript Automated Data Retrieval

Welcome! If you're reading this page, you probably want to program your own data retrieval software to be used by the POSCON. This can be used to:

- Pull ATIS information, METAR, TAF, and/or SIGMET from live sources
- Generate an ATIS, METAR, TAF, and/or SIGMET automatically

<!-- toc -->

- [Architecture](#architecture)
  * [Recommended Development Environment](#recommended-development-environment)
  * [Interface](#interface)
- [Allowed Modules](#allowed-modules)
- [Sample Code](#sample-code)
- [How do I test locally?](#how-do-i-test-locally)
- [I'm done, now what?](#im-done-now-what)
- [Questions? Comments? Concerns?](#questions-comments-concerns)

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

The sample code in [VHHK.ts](VHHK.ts) will retrieve information for Hong Kong International Airport (VHHH) in VHHK FIR.

The sample code in TypeScript embeds type annotations for easy understanding as well as context-aware code completion in popular IDEs. Run `npm run build` to build the CommonJS. You can also write in CommonJS directly.

## How do I test locally?

To test `VHHK.ts` (or `VHHK.js` if you write in CommonJS directly), run `npm test ./VHHK VHHH` where VHHK is the FIR and VHHH is the aerodrome.

## I'm done, now what?

Once you've written your script, please send it to [support@poscon.net](mailto:support@poscon.net) to be integrated.

## Questions? Comments? Concerns?

If you have any questions about the library, please feel free to open an issue, or send us a message at [support@poscon.net](mailto:support@poscon.net)
