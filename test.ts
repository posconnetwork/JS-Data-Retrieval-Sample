/**
 * For local testing only. Different from actual runtime environment.
 * 
 * @license MIT
 * 
 * @author Timothy Wong (@wegylexy on GitHub)
 */
import { NodeVM } from "vm2";
const allowedModules = ["jsdom", "axios"];
(async () => {
    console.log(JSON.parse(await new NodeVM({
        console: "off",
        eval: false,
        require: {
            context: "sandbox",
            external: true,
            mock: allowedModules.reduce((a, m) => {
                a[m] = require(m);
                return a;
            }, {} as { [name: string]: any }),
            root: "."
        },
        wrapper: "none"
    }).run(`"use strict";return (async () => JSON.stringify(await require("${process.argv[2]}").default("${process.argv[3]}")))();`, __filename)));
})();