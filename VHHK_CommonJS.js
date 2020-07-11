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


// Require the JSDOM & Axios packages
const jsdom = require("jsdom");
const axios = require("axios");
// Define the URL to query against for the VHHH atis
const atis_url = "http://atis.cad.gov.hk/ATIS/ATISweb/atis.php",
    weather_url = (type, station) =>
        `https://www.aviationweather.gov/adds/dataserver_current/httpparam?dataSource=${type}s&requestType=retrieve&format=xml&hoursBeforeNow=12&mostRecent=true&stationString=${station}`,
    sigmet_url = "http://www.hko.gov.hk/aviat/sigmet_data_e.json";

/**
 * Get an HTML document from a URL
 * @param url URL from which to download an HTML document
 * @param select (Optional) A function to transform a response into HTML
 * @returns A Promise that completes with the HTML document
 */
const getDom = async (url, select = (d) => d) =>
    new jsdom.JSDOM(select((
        // Await for a response from the URL
        await axios.default.get(url)
    ).data)).window.document;

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
exports.default = async function (icao) {
    switch (icao) {
        case "VHHH": {
            // Start fetching data with multiple promises to be awaited for later
            const [atis, metar, taf, sigmet] = [

                // ATIS
                getDom(atis_url).then(doc => ({
                    arrival: concat(doc, ".data_name_arr"),
                    departure: concat(doc, ".data_name_dep")
                })),

                // METAR
                getDom(
                    weather_url("metar", icao)
                ).then(
                    doc => concat(doc, "raw_text")
                ),

                // TAF
                getDom(
                    weather_url("taf", icao)
                ).then(
                    doc => concat(doc, "raw_text")
                ),

                // SIGMET
                axios.default.get(sigmet_url).then(
                    res => res.data.content2.sigmet || ""
                )

            ].map(p => p.catch(e => "")); // fulfil the promises with empty strings on error
            return {
                atis: {
                    // Pre-fill properties with empty strings
                    body: "",
                    arrival: "",
                    departure: "",
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