const JSDOM = require("jsdom").JSDOM;
const axios = require("axios")

const vhhh_url = "http://atis.cad.gov.hk/ATIS/ATISweb/atis.php"

const concat = (document, className) =>
    [...document.querySelectorAll(className)].map(n => n.textContent.trim()).filter(t => t).join(" ");

module.exports = async function (icao) {
    const doc = new JSDOM((await axios.get(vhhh_url)).data).window.document;
    return {
        arrival: concat(doc, ".data_name_arr"),
        departure: concat(doc, ".data_name_dep")
    };
}
