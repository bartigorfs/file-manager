import {exec} from "node:child_process";
import {parseCpuInfo} from "../../utils/utils.js";

exec('cat /proc/cpuinfo | grep -E \'model name|cpu MHz\'', (error, stdout) => {
    try {
        process.send(parseCpuInfo(stdout));
    } catch (err) {
        process.send(err?.message);
    }
    process.exit();
});