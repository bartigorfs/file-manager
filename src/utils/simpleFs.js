import fs from "node:fs/promises";
import path from "node:path";
import {log} from "./prettyLog.js";
import {entityTypeCheck, isFileExists} from "./utils.js";

export const createFile = async (filename) => {
    try {
        const FILE_PATH = path.resolve(filename);

        if (!await isFileExists(FILE_PATH)) {
            await fs.open(FILE_PATH, 'a').then(fh => fh.close());
        } else log.warning('Operation failed\n');
    } catch (e) {
        return log.warning('Operation failed\n');
    }
}

export const deleteFile = async (filename) => {
    try {
        const FILE_PATH = path.resolve(filename);

        if (await isFileExists(FILE_PATH)) {
            await fs.rm(FILE_PATH);
        } else log.warning('Operation failed\n');
    } catch (e) {
        return log.warning('Operation failed\n');
    }
}

export const renameFile = async (oldFileName, newFileName) => {
    try {
        const OLD_FILE_PATH = path.resolve(oldFileName);
        const NEW_FILE_PATH = path.resolve(newFileName);

        if (await isFileExists(OLD_FILE_PATH) && !await isFileExists(NEW_FILE_PATH)) {
            await fs.rename(OLD_FILE_PATH, NEW_FILE_PATH);
        } else log.warning('Operation failed\n');
    } catch (e) {
        return log.warning('Operation failed\n');
    }
}


export const getFolderLs = async (folder) => {
    try {
        const entities = await fs.readdir(folder);

        const entityPromises = entities.map(async entity => {
            const entity_type = await entityTypeCheck(entity);
            return {
                Name: entity,
                Type: entity_type
            };
        });

        return Promise.all(entityPromises);
    } catch (e) {
        log.error('Operation failed\n')
    }
};