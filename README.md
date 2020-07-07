# POSCON JavaScript Automated Data Retrieval

Welcome! If you're reading this page, you probably want to program your own data retrieval software to be used by the POSCON. This can be used to:

- Pull an ATIS from a live source
- Pull a METAR from a live source
- Generate an ATIS or METAR automatically

<!-- toc -->

- [Architecture](#architecture)
  * [Recommended Development Environment](#recommended-development-environment)
  * [Entrypoint](#entrypoint)
  * [Response Format](#response-format)
- [Allowed Modules](#allowed-modules)
- [Sample Code](#sample-code)
- [How do I test locally?](#how-do-i-test-locally)
- [I'm done, now what?](#im-done-now-what)
- [Questions? Comments? Concerns?](#questions-comments-concerns)

<!-- tocstop -->

## Architecture

All user-supplied JavaScript for the purpose of retriving an ATIS is run in a v8 Isolate. What does that mean? It means your code is running in an isolated process, with no access to the host machine. We use this to ensure that no other ATIS retrieval code supplied by other users can impact the performance of your scripts.

There may be _one_ file provided per FIR, which must contain all code for retrieval for any airports within the FIR. Unsafe functions, modules, and objects are also disabled, such as `process`, `eval`, and `fs`.

### Recommended Development Environment

Our servers use Node v14 on an Alpine image, and store scripts on a remote location.

### Entrypoint

When your script is called, the host machine looks for the default export, which must be an entrypoint in the following form:

```javascript
functionName(icao)

module.exports = functionName
```

The host will run the default export. It can return a `Promise`, but may not require or return a callback. It can also be an asynchronous function - it must simply accept a single argument (an ICAO-formatted airport identifier), and return either a `Promise` that resolves to data, or returns JSON data directly.

### Response Format

The desired response is either a `Promise` that resolves to this, or this directly:

```json
{
    "arrival": "<arrival ATIS, if present>",
    "departure": "<departure ATIS, if present>",
    "body": "<ATIS, if departure/arrival are not separated>",
    "metar": "<METAR of the airport>"
}
```

**You may _only_ return _either_ body, or _both_ arrival and departure**

## Allowed Modules

The following modules are currently allowed to be `require`'d by a script:

- [jsdom](https://www.npmjs.com/package/jsdom)
- [axios](https://www.npmjs.com/package/axios)

If you would like a library added that is not currently available, please email [support@poscon.net](mailto:support@poscon.net) with the library name and justification for its inclusion.

## Sample Code

The following code will retrieve the ATIS for Hong Kong International Airport (VHHH) in the VHHK FIR. Note: this code can also be viewed in [VHHK.js](VHHK.js)

```javascript
// Require the JSDOM & Axios packages
const JSDOM = require("jsdom").JSDOM;
const axios = require("axios")

// Define the URL to query against for the VHHH atis
const vhhh_url = "http://atis.cad.gov.hk/ATIS/ATISweb/atis.php"

/**
 * Concatenate text content of HTML elements of the specified class in the specified document
 * 
 * @param {Document} document HTML document
 * @param {string} className CSS class name
 * @returns {string} Cleaned HTML string
 */
const concat = (document, className) =>
    [...document.querySelectorAll(className)]
        .map(n => n.textContent.trim())
        .filter(t => t)
        .join(" ");

/**
 * Get the ATIS for a given ICAO
 * @param {string} icao ICAO of the airport to be queried
 */
async function run(icao) {
    const doc = new JSDOM((await axios.get(vhhh_url)).data).window.document;
    return {
        arrival: concat(doc, ".data_name_arr"),
        departure: concat(doc, ".data_name_dep")
    };
}

// Export the run function as the default export
module.exports = run;
```

## How do I test locally?

To test `VHHK.js`, run `node test.js VHHK`. While it is not the exact way the script will be integrated, the sandbox ensures that only allowed modules may be loaded.

## I'm done, now what?

Once you've written your script, please send it to [support@poscon.net](mailto:support@poscon.net) to be integrated.

## Questions? Comments? Concerns?

If you have any questions about the library, please feel free to send us a message at [support@poscon.net](mailto:support@poscon.net)
