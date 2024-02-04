import * as path from 'node:path';
import fs from "node:fs/promises";
import {fileURLToPath} from 'url';
import {log} from "./prettyLog.js";
import {getUsername} from "../args/argv.js";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

/*
Used to get file type in entityTypeCheck();
 */
const EntityTypesMap = {
    'file': entity => entity.isFile(),
    'directory': entity => entity.isDirectory(),
    'symbolic link': entity => entity.isSymbolicLink(),
    'socket': entity => entity.isSocket(),
    'character device': entity => entity.isCharacterDevice(),
    'FIFO pipe': entity => entity.isFIFO(),
}
/*
Checks entity type using lstat
Returns: string
 */
export const entityTypeCheck = async (entity, findPath = process.cwd()) => {
    try {
        await fs.access(path.join(findPath, entity), fs.constants.F_OK || fs.constants.R_OK);
        const entityStat = await fs.lstat(path.join(findPath, entity));
        return Object.entries(EntityTypesMap).find(([_, check]) => (check(entityStat)))?.[0];
    } catch (e) {
        return e.message.split(',')[0];
    }
}

/*
Writes current directory
 */
export const getCurrentDir = () => {
    console.log(`You are currently in ${process.cwd()}`);
}

/*
Safely changes directory
 */
export const changeDir = (newPath) => {
    try {
        process.chdir(newPath);
    } catch (e) {
        log.warning('Operation failed\n')
    }
}
/*
Writes greeting message
 */
export const writeGreetings = () => {
    log.success(`Welcome to the File Manager, ${getUsername()}! \n`)
}

export const trimParams = (params) => {
    if (Array.isArray(params)) {
        return params.map(param => param.replace('--', ''));
    } else return params.replace('--', '');
}

export const checkArgs = (params, minLength = 1) => {
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

export const isValidPath = (str) => {
    try {
        const normalizedPath = path.normalize(str);
        const isAbsolutePath = path.isAbsolute(normalizedPath);
        return isAbsolutePath || normalizedPath.startsWith('.');
    } catch (error) {
        return false;
    }
}

export const prettifyParams = (params) => {
    const joinedParams = params.join(' ');

    const paramRegex = /"([^"]+)"/g;
    let match;
    const prettifiedParams = [];

    while ((match = paramRegex.exec(joinedParams)) !== null) {
        prettifiedParams.push(match[1]);
    }
    return prettifiedParams;
}