const JSDOM = require("jsdom").JSDOM;
const axios = require("axios")

const vhhh_url = "http://atis.cad.gov.hk/ATIS/ATISweb/atis.php"


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

async function run(icao) {
    const response = await axios.get(vhhh_url);
    const dom = new JSDOM(response.data);
    const doc = dom.window.document
    const col1 = [...doc.querySelectorAll(".data_outer_1 .width_left")];
    const col2 = [...doc.querySelectorAll(".data_outer_3 .width_right")];

    const col1text = cleanHTML(col1[0].textContent)
    const col2text = cleanHTML(col2[0].textContent)
    const ret = {
        "arrival": col1text,
        "departure": col2text,
        "body": ""
    }

    return ret
}

module.exports = run