/**
 * VABF.ts
 *
 * Module to retrieve information of airports in VABF FIR
 *
 * @license MIT
 *
 * @author Rahul Singh (@drph4nt0m on GitHub)
 */

import { AerodromeInformation } from "./spec";
// Require the Axios package
import axios from "axios";

// Define the URL to query against for the VABF atis
const atis_url = "https://services.poscon.in/atis";

/**
 * Get ATIS text for the specified station
 * @param icao ICAO designator of the station
 * @returns A Promise that completes with the ATIS text
 */
const getAtis = async (icao: string) => {
    const res = await axios.get(`${atis_url}/${icao}`)
    return res.data.atis;
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