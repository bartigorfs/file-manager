import * as path from 'node:path';
import {fileURLToPath} from 'url';
import fs from "node:fs/promises";
import {baseHomeDir} from "./os.js";

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

export const entityTypeCheck = async (entity, findPath = baseHomeDir) => {
    const entityStat = await fs.lstat(path.join(findPath, entity));
    return Object.entries(EntityTypesMap).find(([_, check]) => (check(entityStat)))?.[0];
}

export const getFolderLs = async (folder = baseHomeDir) => {
    //TODO: Check directory!
    const entities = await fs.readdir(baseHomeDir);

    const entityPromises = entities.map(async entity => {
        const entity_type = await entityTypeCheck(entity);
        return {
            Name: entity,
            Type: entity_type
        };
    });

    return Promise.all(entityPromises);
};

export const getCurrentDir = () => {

}