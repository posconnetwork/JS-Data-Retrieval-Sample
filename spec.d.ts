/**
 * spec.d.ts
 * 
 * Type declarations for POSCON automatic aerodrome information retrieval
 * 
 * @license MIT
 * 
 * @author Timothy Wong (@wegylexy on GitHub)
 */

/**
 * Terminal and weather information of an aerodrome
 */
export interface AerodromeInformation {
    atis: {
        /** ATIS in plain text */
        body: string;
        /** Arrival ATIS in plain text */
        arrival: string;
        /** Departure ATIS in plain text */
        departure: string;
    };
    wx: {
        /** METAR in plain text */
        metar: string;
        /** TAF in plain text */
        taf: string;
        /** SIGMET in plain text */
        sigmet: string;
    }
}

/**
 * Fetch information for the specified aerodrome
 * @param icao ICAO designator of the aerodrome
 * @returns Aerodrome information, or a promise that completes with it
 */
export default function (icao: string): AerodromeInformation | PromiseLike<AerodromeInformation>;