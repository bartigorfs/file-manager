import {baseHomeDir, getCpus, getEOL, getSystemUserName, getArch} from "./os.js";
import {calculateHash, getFolderLs} from "./fs.js";
import {log} from "./prettyLog.js";

const trimParams = (params) => {
    if (Array.isArray(params)) {
        return params.map(param => param.replace('--', ''));
    } else return params.replace('--', '');
}

const checkArgs = (params, minLength = 1) => {
    if (Array.isArray(params)) {
        if (params.length < minLength) {
            log.warning('Please specify params')
            return false;
        }
        return true;
    } else {
        if (!params) {
            log.warning('Please specify param')
            return false;
        }
        return true;
    }
}

export const processCmd = async (chunk) => {
    const [cmd, ...paramsArr] = chunk.split(' ');

    switch (cmd) {
        case 'os': {
            const params = paramsArr.join(' ').trim();

            switch (trimParams(params)) {
                case 'EOL':
                    return console.log(getEOL());
                case 'cpus':
                    return console.log(getCpus());
                case 'homedir':
                    return console.log(baseHomeDir);
                case 'username':
                    return console.log(getSystemUserName());
                case 'architecture':
                    return console.log(getArch());
            }
            break;
        }
        case 'ls':
            return console.table(await getFolderLs(), ['Name', 'Type']);
        case 'hash': {
            if (checkArgs(paramsArr)) {
                await calculateHash(paramsArr[0]);
            }
            break;
        }
        default:
            return 'Unknown command';
    }
}