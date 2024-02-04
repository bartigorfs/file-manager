import * as path from 'node:path';
import {fileURLToPath} from 'url';
import * as os from "node:os";
import fs from "node:fs/promises";

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

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const userHomeDir = os.homedir();

export const entityTypeCheck = async (entity, findPath = userHomeDir) => {
    const entityStat = await fs.lstat(path.join(findPath, entity));
    return Object.entries(EntityTypesMap).find(([type, check]) => (check(entityStat)))?.[0];
}