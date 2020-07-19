/**
 * For local testing only. Different from actual runtime environment.
 * 
 * @license MIT
 * 
 * @author Timothy Wong (@wegylexy on GitHub)
 */
import { NodeVM } from "vm2";
import { readFile } from "fs";
(async () => {
    const path = process.argv[2] + ".js",
        read = new Promise<string>((res, rej) => readFile(path, "utf-8", (err, data) => {
            if (err)
                rej(err);
            else
                res(data);
        })),
        retrieve = new NodeVM({
            console: "off",
            eval: false,
            require: {
                external: ["jsdom", "axios"],
                root: "."
            }
        }).run(await read, path).default;

    // // Test in parallel
    // console.log(Object.assign.apply({}, await Promise.all(process.argv.slice(3).map(async (icao: string) => {
    //     try {
    //         return { [icao]: await retrieve(icao) };
    //     } catch (e) {
    //         return { [icao]: e };
    //     }
    // })) as any));

    // Test in series
    await Promise.all(process.argv.slice(3).map(async icao => {
        try {
            console.log(await retrieve(icao));
        } catch (e) {
            console.error(`Oops, it didn't work for ${icao} due to ${e}.`);
        }
    }));
})();