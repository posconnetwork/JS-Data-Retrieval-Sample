/**
 * VABF.ts
 *
 * Module to retrieve information of airports in VABF FIR
 *
 * @license MIT
 *
 * @author Timothy Wong (@wegylexy on GitHub)
 */

import { AerodromeInformation } from "./spec";
// Require the JSDOM & Axios packages
import { JSDOM } from "jsdom";
import axios, { AxiosInstance } from "axios";

/**
 * Inject cookie interceptors to an instance of axios
 * @param instance The instance of axios
 * @returns A function that returns the current cookies delimited by semi-colon (;)
 */
function interceptCookies(instance: AxiosInstance): () => string {
    let cookies: { [name: string]: string } = {};
    const toString = () => Object.keys(cookies).map(n => `${n}=${cookies[n]}`).join(";");
    // Inject the request interceptor
    instance.interceptors.request.use(req => ({
        ...req,
        headers: {
            ...req.headers,
            cookie: toString()
        },
        maxRedirects: 0, // intercept redirect
        validateStatus: s => s >= 200 && s <= 302 // validate redirect
    }));
    // Inject the response interceptor
    instance.interceptors.response.use(async res => {
        (res.headers["set-cookie"] || [])
            .map((c: string) => c.split(";")[0])
            .reduce((all: typeof cookies, c: string) => {
                const cookie = c.match(/^([^=]+)=(.*)$/);
                if (cookie)
                    all[cookie[1]] = cookie[2];
                return all;
            }, cookies);
        return res.status > 300 ?
            await instance.get(res.headers["location"]) : // follow redirect
            res;
    });
    return toString
}

// Create an instance of axios
const atis_instance = axios.create({
    baseURL: "http://www.acdm.in",
    timeout: 5000 // 5 seconds
}),
    atis_cookies = interceptCookies(atis_instance),
    atis_login = "username=testing123&submit=Submit&password=testing123";

/**
 * Get ATIS text for the specified station
 * @param icao ICAO designator of the station
 * @returns A Promise that completes with the ATIS text
 */
const getAtis = async (icao: string) => {
    let document!: Document;
    for (let retry = 2; retry--;) { // retry after login (if required)
        if (atis_cookies()) { // only try with non-empty cookie
            // Get a document with ATIS text or a login form
            document = new JSDOM((
                // Await for a response from the URL
                await atis_instance.get(`/ShowStations.php?q=${icao}`)
            ).data).window.document;
            // Detect login form
            if (!document.querySelector("form.form-signin"))
                // Stop trying to login
                break;
        }
        // Login
        await atis_instance.post("/index.php", atis_login);
    }
    // Find next sibling <td> of the first <td> and return its text content
    return document.querySelector("td + td")!.textContent; // throw if not found
};

// Export default function as declared in spec.d.ts
export default async function (icao: string): Promise<AerodromeInformation> {
    switch (icao) {
        case "VAAH": case "VAAU": case "VABB": case "VABO": case "VABP": case "VABV": case "VAGD": case "VAID": case "VAJB": case "VANP": case "VAPO": case "VARK": case "VASU": case "VAUD":
        case "VEAT": case "VEBN": case "VEBS": case "VECC": case "VEGT": case "VEGY": case "VEIM": case "VEKO": case "VEMN": case "VEMR": case "VEPT": case "VERC": case "VERP":
        case "VIAR": case "VIBR": case "VIDN": case "VIDP": case "VIJP": case "VILK":
        case "VOBL": case "VOBZ": case "VOCB": case "VOCI": case "VOCL": case "VOHB": case "VOHS": case "VOMD": case "VOML": case "VOMM": case "VOTP": case "VOTR": case "VOTV":
            return {
                atis: {
                    body: await getAtis(icao) || "",
                    arrival: "",
                    departure: "",
                },
                wx: {
                    metar: "",
                    taf: "",
                    sigmet: "",
                },
            };
    }
    throw new Error(`${icao} is not supported in VABF.`);
}