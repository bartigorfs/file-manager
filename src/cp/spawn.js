import {fork} from "node:child_process";
import path from "node:path";
import {__dirname} from "../convert.js";

export const getLinuxCpuProc = () => {
    return new Promise((resolve, reject) => {
        const procPath = path.join(__dirname, 'cp', 'proc', 'getLinuxCPU.js');

        const cp = fork(procPath);

        cp.on('message', cpuInfo => {
            resolve(cpuInfo);
        });

        cp.on('error', (err) => reject(err));
    })
}