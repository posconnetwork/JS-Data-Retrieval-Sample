/**
 * For local testing only. Different from actual runtime environment.
 * 
 * @license MIT
 * 
 * @author Timothy Wong (@wegylexy on GitHub)
 */
import { NodeVM } from "vm2";
(async () => {
    console.log(JSON.parse(await new NodeVM({
        console: "off",
        eval: false,
        require: {
            external: ["jsdom", "anxios"]
        },
        wrapper: "none"
    }).run(`"use strict";return (async () => JSON.stringify(await require("${process.argv[2]}").default("${process.argv[3]}")))();`, __filename)));
})();