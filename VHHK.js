"use strict";
/**
 * VHHK.ts
 *
 * Module to retrieve information of VHHH airport in VHHK FIR
 *
 * @license MIT
 *
 * @author Eamonn Nugent (@space55 on GitHub)
 * @author Timothy Wong (@wegylexy on GitHub)
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Require the JSDOM & Axios packages
const jsdom_1 = require("jsdom");
const axios_1 = require("axios");
// Define the URL to query against for the VHHH atis
const atis_url = "http://atis.cad.gov.hk/ATIS/ATISweb/atis.php", metar_url = "http://www.hko.gov.hk/aviat/metar_eng_revamp.json", taf_url = "http://www.hko.gov.hk/aviat/taf_decode_eng_revamp.json", sigmet_url = "http://www.hko.gov.hk/aviat/sigmet_data_e.json";
/**
 * Get an HTML document from a URL
 * @param url URL from which to download an HTML document
 * @param select (Optional) A function to transform a response into HTML
 * @returns A Promise that completes with the HTML document
 */
const getDom = async (url, select = (d) => d) => new jsdom_1.JSDOM(select((
// Await for a response from the URL
await axios_1.default.get(url)).data)).window.document;
/**
 * Concatenate text content of HTML elements matching the specified CSS selector in the specified document
 *
 * @param document HTML document
 * @param selector CSS selector
 * @returns Concatenated plain text
 */
const concat = (document, selector) => [...document.querySelectorAll(selector)]
    .map(n => n.textContent.trim())
    .filter(t => t)
    .join(" ");
// Export default function as declared in spec.d.ts
async function default_1(icao) {
    switch (icao) {
        case "VHHH": {
            // Start fetching data with multiple promises to be awaited for later
            const [atis, metar, taf, sigmet] = [
                // ATIS
                getDom(atis_url)
                    .then(doc => ({
                    arrival: concat(doc, ".data_name_arr"),
                    departure: concat(doc, ".data_name_dep")
                })),
                // METAR
                getDom(metar_url, data => data.metar_decode_eng_json.content.table.content)
                    .then(doc => concat(doc, "table strong ~ p")),
                // TAF
                getDom(taf_url, data => data.taf_decode_eng_json.content1.table1.content)
                    .then(doc => concat(doc, "table strong ~ p")),
                // SIGMET
                axios_1.default.get(sigmet_url)
                    .then(res => res.data.content2.sigmet)
            ].map(p => p.catch(e => "")); // fulfil the promises with empty strings on error
            return {
                atis: {
                    // Pre-fill properties with empty strings
                    body: "",
                    arrival: "", departure: "",
                    // Expand filled properties (if any) to replace the empty strings
                    ...await atis
                },
                wx: {
                    // Awaits for other asynchronous tasks started earlier
                    metar: await metar,
                    taf: await taf,
                    sigmet: await sigmet
                }
            };
        }
    }
    throw new Error(`${icao} is not supported in VHHK.`);
}
exports.default = default_1;
