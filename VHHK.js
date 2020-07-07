/**
 * VHHK.js
 * 
 * File can be used to retrieve the VHHH airport at in the VHHK FIR
 * by calling the default export
 * 
 * License: MIT
 * 
 * By: Eamonn Nugent (@space55 on GitHub)
 */

// Require the JSDOM & Axios packages
const JSDOM = require("jsdom").JSDOM;
const axios = require("axios")

// Define the URL to query against for the VHHH atis
const vhhh_url = "http://atis.cad.gov.hk/ATIS/ATISweb/atis.php"


/**
 * Take an HTML string and strip out unnecessary characters.
 * Note: this is customized to work with VHHH's ATIS broadcast, and
 * might not work for all airports
 * 
 * @param {string} html HTML string to be modified
 * @returns {string} Cleaned HTML string
 */
function cleanHTML(html) {

    let ret = html.replace(/\n/g, " ")
    ret = ret.replace(/\t/g, "")
    ret = ret.replace(/[ ]+/g, " ")
    ret = ret.replace(" ARRIVAL ", "")
    ret = ret.replace(" DEPARTURE ", "")
    ret = ret.replace(/[\u00A0]/g, "")
    ret = ret.replace(/[ ]+/g, " ")
    ret = ret.substring(0, ret.length - 1)
    return ret
}

/**
 * Get the ATIS for a given ICAO
 * @param {string} icao ICAO of the airport to be queried
 */
async function run(icao) {
    // If the ICAO isn't "VHHH", we haven't implemented it so far
    if (icao !== "VHHH") {
        console.log("Unimplemented")
        return {
            "arrival": "",
            "departure": "",
            "body": ""
        }
    }

    // Query `vhhh_url` and await the response
    const response = await axios.get(vhhh_url);
    // Convert the response into a JSDOM object
    const dom = new JSDOM(response.data);
    // Temp var to hold the document
    const doc = dom.window.document

    // Pull out the two necessary HTML elements, and expand outwards to an array
    const col1 = [...doc.querySelectorAll(".data_outer_1 .width_left")];
    const col2 = [...doc.querySelectorAll(".data_outer_3 .width_right")];

    // Get the text content of the first position in each array, then clean the HTML
    const col1text = cleanHTML(col1[0].textContent)
    const col2text = cleanHTML(col2[0].textContent)

    // Create the response
    const ret = {
        "arrival": col1text,
        "departure": col2text,
        "body": ""
    }

    return ret
}

// Export the run function as the default export
module.exports = run