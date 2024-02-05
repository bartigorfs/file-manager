import * as path from 'node:path';
import fs from "node:fs/promises";
import {log} from "./prettyLog.js";
import {getUsername} from "../args/argv.js";

const CPU_SPEED_MODIFIER = 1000;

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

/*
Trim -- for simplicity
 */
export const trimParams = (params) => {
    if (Array.isArray(params)) {
        return params.map(param => param.replace('--', ''));
    } else return params.replace('--', '');
}

/*
Checks if args is presented and have required length
 */
export const checkArgs = (params, minLength = 1) => {
    if (Array.isArray(params)) {
        return params.length >= minLength;
    } else {
        return params;
    }
}

/*
Parse string with command and params
 */
export const parseCommand = (chunk) => {
    const chunks = chunk.match(/"([^"]+)"|(\S+)/g) || [];
    const [cmd, ...paramsArr] = chunks.map(chunk => chunk.replace(/"/g, ''));
    return {cmd, params: paramsArr.length > 0 ? paramsArr : chunk.includes('"') ? [chunk] : chunk.split(' ').slice(1)};
}

/*
Helper to parse result of cat /proc/cpuinfo | grep -E 'model name|cpu MHz' in cp
*/
export function parseCpuInfo(output) {
    const cpuInfo = [];

    output.split('\n').forEach((line, index, array) => {
        if (index % 2 === 0 && index < array.length - 1) {
            const [key, ...values] = line.split(':').map(entry => entry.trim());
            const [secondKey, ...secondValues] = array[index + 1].split(':').map(entry => entry.trim());

            const formattedKey = key?.replace(/\s/g, '') === 'modelname'
                ? 'model'
                : 'speed';
            const secFormattedKey = secondKey?.replace(/\s/g, '') === 'cpuMHz'
                ? 'speed'
                : 'model';

            if (formattedKey && secFormattedKey && values.length > 0 && secondValues.length > 0) {
                cpuInfo.push({
                    [formattedKey]: values.join(':').trim(),
                    [secFormattedKey]: prettyCpuSpeed(Number(secondValues.join(':').trim()))
                });
            }
        }
    });

    return [...cpuInfo];
}

/*
Core speed MHz to GHz
 */
export const prettyCpuSpeed = (speed) => {
    return (speed / CPU_SPEED_MODIFIER).toFixed(2) + ' GHz'
}

/*
Checks if file exists
 */
export const isFileExists = async (fileRoute) => {
    try {
        await fs.access(fileRoute, fs.constants.R_OK || fs.constants.W_OK);
        return true;
    } catch {
        return false;
    }
}

/*
Checks if folder exists
 */
export const isDirectoryExists = async (dirPath) => {
    try {
        const stats = await fs.stat(dirPath);
        return stats.isDirectory();
    } catch (error) {
        return false;
    }
};
