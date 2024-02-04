import fs from "node:fs/promises";
import {log} from "../prettyLog.js";
import {entityTypeCheck} from "../utils.js";

//TODO: Refactor as WriteStream
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