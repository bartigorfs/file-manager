import path from "node:path";

import {baseHomeDir, getArch, getCpus, getEOL, getSystemUserName} from "./os.js";
import {changeDir, checkArgs, prettifyParams, trimParams} from "./utils.js";
import {log} from "./prettyLog.js";
import {calculateHash} from "./streams/hash.js";
import {deleteFile, getFolderLs, renameFile} from "./simpleFs.js";
import {readFile} from "./streams/readFile.js";
import {createFile} from "./simpleFs.js";
import {copyFile} from "./streams/copy.js";

export const processCmd = async (chunk) => {
    const [cmd, ...paramsArr] = chunk.split(' ');

    switch (cmd) {
        case 'ls':
            const directory = process.cwd();
            return console.table(await getFolderLs(directory), ['Name', 'Type']);
        case 'cd': {
            if (!checkArgs(paramsArr)) return log.warning('Invalid input\n');
            const newPath = paramsArr[0];
            changeDir(newPath);
            break;
        }
        case 'add': {
            if (!checkArgs(paramsArr)) return log.warning('Invalid input\n');
            const newFileName = paramsArr[0];
            await createFile(newFileName);
            break;
        }
        case 'rm': {
            if (!checkArgs(paramsArr)) return log.warning('Invalid input\n');
            const deleteFileName = paramsArr[0];
            await deleteFile(deleteFileName);
            break;
        }
        case 'rn': {
            if (!checkArgs(paramsArr, 2)) return log.warning('Invalid input\n');
            const oldFileName = paramsArr[0];
            const newFileName = paramsArr[1];
            await renameFile(oldFileName, newFileName);
            break;
        }
        case 'cp': {
            if (!checkArgs(paramsArr, 2)) return log.warning('Invalid input\n');
            const fileToCopy = paramsArr[0];
            const folderToCopy = paramsArr[1];
            await copyFile(fileToCopy, folderToCopy);
            break;
        }
        case 'up': {
            process.chdir('..');
            break;
        }
        case 'cat': {
            const prettyParams = prettifyParams(paramsArr);
            if (!checkArgs(prettyParams)) return log.warning('Invalid input\n');
            await readFile(prettyParams[0]);
            break;
        }
        case 'hash': {
            if (!checkArgs(paramsArr)) return log.warning('Invalid input\n');
            const prettyParams = prettifyParams(paramsArr);
            const fileName = prettyParams[0];
            await calculateHash(fileName);
            break;
        }
        case 'os': {
            const params = paramsArr.join(' ').trim();
            if (trimParams(params).length <= 0) return log.warning('Invalid input\n');

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
        default:
            return log.warning('Invalid input\n');
    }
}