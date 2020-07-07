/**
 * VHHK.js
 * 
 * File can be used to retrieve the VHHH airport at in the VHHK FIR 
 * by calling the default export
 * 
 * @license MIT
 * 
 * @author Eamonn Nugent (@space55 on GitHub)
 * @author Timothy Wong (@wegylexy on GitHub)
 */
 
// Require the JSDOM & Axios packages
const JSDOM = require("jsdom").JSDOM;
const axios = require("axios")

// Define the URL to query against for the VHHH atis
const vhhh_url = "http://atis.cad.gov.hk/ATIS/ATISweb/atis.php"

/**
 * Concatenate text content of HTML elements matching the specified CSS selector in the specified document
 * 
 * @param {Document} document HTML document
 * @param {string} selector CSS selector
 * @returns {string} Concatenated plain text
 */
const concat = (document, selector) =>
    [...document.querySelectorAll(selector)]
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