import {EOL, cpus, type, arch, userInfo} from "node:os";
import os from "node:os";

const calculateCPUSpeedModifier = {
    'Darwin': 10000,
    'Linux': 1000,
    'Windows_NT': 1000,
};

export const getEOL = () => {
    return EOL || 'EOL Missing';
}

export const getCpus = () => {
    try {
        const osType = type();

        if (!osType)
            throw Error('Cannot get OS Type!');

        return cpus().map(cpu => ({
            model: cpu?.model.trim(),
            speed: (cpu?.speed / calculateCPUSpeedModifier[osType]).toFixed(2) + ' GHz'
        }))
    } catch (e) {
        return `Operation failed ${e && ', Error: ' + e.message}`
    }
}

export const getArch = () => {
    try {
        return arch();
    } catch (e) {
        return 'Operation failed';
    }
};

export const getSystemUserName = () => (userInfo()?.username);

export const baseHomeDir = os.homedir();