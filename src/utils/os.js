import {EOL, cpus, type, arch, userInfo} from "node:os";

const calculateCPUSpeedModifier = {
    'Darwin': 10000,
    'Linux': 1000,
    'Windows_NT': 1000,
};

export const getEOL = () => {
    return EOL;
}

export const getCpus = () => {
    return cpus().map(cpu => ({
        model: cpu.model,
        speed: (cpu.speed / calculateCPUSpeedModifier[type()]).toFixed(2) + ' GHz'
    }))
}

export const getArch = () => (arch());

export const getSystemUserName = () => (userInfo()?.username);
