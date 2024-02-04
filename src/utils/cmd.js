import {baseHomeDir, getCpus, getEOL, getSystemUserName, getArch} from "./os.js";
import {calculateHash, changeDir, getFolderLs} from "./fs.js";
import {log} from "./prettyLog.js";
import path from "node:path";

const trimParams = (params) => {
    if (Array.isArray(params)) {
        return params.map(param => param.replace('--', ''));
    } else return params.replace('--', '');
}

const checkArgs = (params, minLength = 1) => {
    if (Array.isArray(params)) {
        if (params.length < minLength) {
            log.warning('Please specify params\n')
            return false;
        }
        return true;
    } else {
        if (!params) {
            log.warning('Please specify param\n')
            return false;
        }
        return true;
    }
}

function isValidPath(str) {
    try {
        const normalizedPath = path.normalize(str);
        const isAbsolutePath = path.isAbsolute(normalizedPath);
        return isAbsolutePath || normalizedPath.startsWith('.');
    } catch (error) {
        return false;
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
            const directory = process.cwd();
            return console.table(await getFolderLs(directory), ['Name', 'Type']);
        case 'hash': {
            if (!checkArgs(paramsArr)) return log.warning('Please specify params\n');
            const fileName = paramsArr[0];
            await calculateHash(fileName);
            break;
        }
        case 'cd': {
            if (checkArgs(paramsArr)) {
                const newPath = paramsArr[0];

                if (!isValidPath(newPath)) {
                    const newDirectory = path.join(process.cwd(), newPath);
                    changeDir(newDirectory);
                } else changeDir(newPath);
            }
            break;
        }
        default:
            return log.warning('Unknown command\n');
    }
}