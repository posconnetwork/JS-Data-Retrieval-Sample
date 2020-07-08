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

import { AerodromeInformation } from "./spec";
// Require the JSDOM & Axios packages
import { JSDOM } from "jsdom";
import axios from "axios";

// Define the URL to query against for the VHHH atis
const atis_url = "http://atis.cad.gov.hk/ATIS/ATISweb/atis.php",
    metar_url = "http://www.hko.gov.hk/aviat/metar_eng_revamp.json",
    taf_url = "http://www.hko.gov.hk/aviat/taf_decode_eng_revamp.json",
    sigmet_url = "http://www.hko.gov.hk/aviat/sigmet_data_e.json";

/**
 * Get an HTML document from a URL
 * @param url URL from which to download an HTML document
 * @param select (Optional) A function to transform a response into HTML
 * @returns A Promise that completes with the HTML document
 */
const getDom = async (url: string, select = (d: any) => d): Promise<Document> =>
    new JSDOM(select((
        // Await for a response from the URL
        await axios.get(url)
    ).data)).window.document;

/**
 * Concatenate text content of HTML elements matching the specified CSS selector in the specified document
 * 
 * @param document HTML document
 * @param selector CSS selector
 * @returns Concatenated plain text
 */
const concat = (document: Document, selector: string): string =>
    [...document.querySelectorAll(selector) as unknown as Element[]]
        .map(n => n.textContent!.trim())
        .filter(t => t)
        .join(" ");

// Export default function as declared in spec.d.ts
export default async function (icao: string): Promise<AerodromeInformation> {
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
                axios.get(sigmet_url)
                    .then(res => res.data.content2.sigmet)
            ].map(p => p.catch(e => "")); // fulfil the promises with empty strings on error
            return {
                atis: {
                    // Pre-fill properties with empty strings
                    body: "", // as required by the interface to be a string
                    arrival: "", departure: "", // fallback to empty strings
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