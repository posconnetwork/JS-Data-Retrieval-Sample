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
        }));
    console.log(await new NodeVM({
        console: "off",
        eval: false,
        require: {
            external: ["jsdom", "axios"],
            root: "."
        }
    }).run(await read, path).default(process.argv[3]));
})();