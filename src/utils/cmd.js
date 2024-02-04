import path from "node:path";

import {baseHomeDir, getArch, getCpus, getEOL, getSystemUserName} from "./os.js";
import {changeDir, checkArgs, isValidPath, prettifyParams, trimParams} from "./utils.js";
import {log} from "./prettyLog.js";
import {calculateHash} from "./streams/hash.js";
import {getFolderLs} from "./streams/ls.js";
import {readFile} from "./streams/readFile.js";

export const processCmd = async (chunk) => {
    const [cmd, ...paramsArr] = chunk.split(' ');

    switch (cmd) {
        case 'os': {
            const params = paramsArr.join(' ').trim();

            switch (trimParams(params)) {
                case 'EOL':
                    return console.log(getEOL());
                case 'cpus':
                    return console.log(await getCpus());
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
            const prettyParams = prettifyParams(paramsArr);
            const fileName = prettyParams[0];
            await calculateHash(fileName);
            break;
        }
        case 'cd': {
            if (checkArgs(paramsArr)) {
                const prettyParams = prettifyParams(paramsArr);

                const newPath = prettyParams[0];

                if (!isValidPath(newPath)) {
                    const newDirectory = path.join(process.cwd(), newPath);
                    changeDir(newDirectory);
                } else changeDir(newPath);
            }
            break;
        }
        case 'cat': {
            const prettyParams = prettifyParams(paramsArr);
            if (!checkArgs(prettyParams)) return log.warning('Please specify params\n');
            await readFile(prettyParams[0]);
            break;
        }
        case 'up': {
            process.chdir('..');
            break;
        }
        default:
            return log.warning('Unknown command\n');
    }
}