import {baseHomeDir, getArch, getCpus, getEOL, getSystemUserName} from "./os.js";
import {changeDir, checkArgs, parseCommand, trimParams} from "./utils.js";
import {log} from "./prettyLog.js";
import {calculateHash} from "./streams/hash.js";
import {deleteFile, getFolderLs, renameFile} from "./simpleFs.js";
import {readFile} from "./streams/readFile.js";
import {createFile} from "./simpleFs.js";
import {copyFile} from "./streams/copy.js";
import {brotliCompress} from "./streams/brotli-zip.js";
import {moveFile} from "./streams/move.js";

export const processCmd = async (chunk) => {
    const {cmd, params} = parseCommand(chunk);

    switch (cmd) {
        case 'ls':
            const directory = process.cwd();
            return console.table(await getFolderLs(directory), ['Name', 'Type']);
        case 'cd': {
            if (!checkArgs(params)) return log.warning('Invalid input\n');
            const newPath = params[0];
            changeDir(newPath);
            break;
        }
        case 'add': {
            if (!checkArgs(params)) return log.warning('Invalid input\n');
            const newFileName = params[0];
            await createFile(newFileName);
            break;
        }
        case 'rm': {
            if (!checkArgs(params)) return log.warning('Invalid input\n');
            const deleteFileName = params[0];
            await deleteFile(deleteFileName);
            break;
        }
        case 'rn': {
            if (!checkArgs(params, 2)) return log.warning('Invalid input\n');
            const oldFileName = params[0];
            const newFileName = params[1];
            await renameFile(oldFileName, newFileName);
            break;
        }
        case 'cp': {
            if (!checkArgs(params, 2)) return log.warning('Invalid input\n');
            const fileToCopy = params[0];
            const folderToCopy = params[1];
            await copyFile(fileToCopy, folderToCopy);
            break;
        }
        case 'mv': {
            if (!checkArgs(params, 2)) return log.warning('Invalid input\n');
            const fileToCopy = params[0];
            const folderToCopy = params[1];
            await moveFile(fileToCopy, folderToCopy);
            break;
        }
        case 'up': {
            process.chdir('..');
            break;
        }
        case 'cat': {
            if (!checkArgs(params)) return log.warning('Invalid input\n');
            await readFile(params[0]);
            break;
        }
        case 'hash': {
            if (!checkArgs(params)) return log.warning('Invalid input\n');
            const fileName = params[0];
            await calculateHash(fileName);
            break;
        }
        case 'compress' : {
            if (!checkArgs(params, 2)) return log.warning('Invalid input\n');
            const fileToCopy = params[0];
            const folderToCopy = params[1];
            await brotliCompress(fileToCopy, folderToCopy, true);
            break;
        }
        case 'decompress' : {
            if (!checkArgs(params, 2)) return log.warning('Invalid input\n');
            const fileToCopy = params[0];
            const folderToCopy = params[1];
            await brotliCompress(fileToCopy, folderToCopy, false);
            break;
        }
        case 'os': {
            const os_params = params.join(' ').trim();
            if (trimParams(os_params).length <= 0) return log.warning('Invalid input\n');

            switch (trimParams(os_params)) {
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
