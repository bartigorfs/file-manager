import {EOL, cpus, type, arch, userInfo} from "node:os";
import os from "node:os";
import {getLinuxCpuProc} from "../cp/spawn.js";
import {prettyCpuSpeed} from "./utils.js";

export const getEOL = () => {
    return EOL || 'EOL Missing';
}

export const getCpus = async () => {
    try {
        const osType = type();

        if (!osType)
            return `Operation failed\n`;

        if (osType === 'Linux') {
            return await getLinuxCpuProc() || [];
        }

        return cpus().map(cpu => ({
            model: cpu?.model.trim(),
            speed: prettyCpuSpeed(cpu?.speed)
        }))
    } catch (e) {
        return `Operation failed\n`
    }
}

export const getArch = () => {
    try {
        return arch();
    } catch (e) {
        return 'Operation failed\n';
    }
};

export const getSystemUserName = () => {
    try {
        return userInfo()?.username
    } catch (e) {
        return 'Operation failed\n';
    }
};

export const baseHomeDir = os.homedir();
