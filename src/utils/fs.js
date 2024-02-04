import * as path from 'node:path';
import fs from "node:fs/promises";
import {fileURLToPath} from 'url';
import {createReadStream} from "node:fs";
import {Transform} from "node:stream";
import {createHash} from "node:crypto";
import {log} from "./prettyLog.js";

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

export const entityTypeCheck = async (entity, findPath = process.cwd()) => {
    try {
        await fs.access(path.join(findPath, entity), fs.constants.F_OK);
        const entityStat = await fs.lstat(path.join(findPath, entity));
        return Object.entries(EntityTypesMap).find(([_, check]) => (check(entityStat)))?.[0];
    } catch (e) {
        return e.message.split(',')[0];
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
        log.error('Operation failed')
    }

};

export const calculateHash = async (filename) => {
    try {
        const FILE_PATH = path.join(process.cwd(), filename);

        await fs.access(FILE_PATH, fs.constants.R_OK)

        const READ_STREAM = createReadStream(FILE_PATH).setEncoding('utf-8');

        const SHA256 = new Transform({
            transform(data, encoding, callback) {
                callback(null, createHash('sha256').update(data).digest('hex'));
            },
        });

        READ_STREAM.pipe(SHA256).on("data", (data) => {
            process.stdout.write(data + '\n');
            READ_STREAM.close();
        });

        READ_STREAM.on('error', (err) => {
            log.error('Operation failed')
        });
    } catch (e) {
        log.error('Operation failed')
    }
}

export const getCurrentDir = () => {
    console.log(`You are currently in ${process.cwd()}`);
}

export const changeDir = (newPath) => {
    try {
        process.chdir(newPath);
    } catch (e) {
        log.warning('Operation failed\n')
    }
}