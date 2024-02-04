import {baseHomeDir, getCpus, getEOL, getSystemUserName, getArch} from "./os.js";
import {getFolderLs} from "./fs.js";

const trimParams = (params) => {
    if (Array.isArray(params)) {
        return params.map(param => param.replace('--', ''));
    } else return params.replace('--', '');
}

export const processCmd = async (chunk) => {
    const [cmd, ...paramsArr] = chunk.split(' ');
    const params = paramsArr.join(' ').trim();

    switch (cmd) {
        case 'os': {
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

        default:
            return 'Unknown command';
    }
}