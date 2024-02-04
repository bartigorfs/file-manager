import {entityTypeCheck, userHomeDir} from "./utils/fs.js";
import {getUsername} from "./args/argv.js";
import * as fs from "node:fs/promises";
import * as path from "path";
import {log} from "./utils/prettyLog.js";
import {getArch, getCpus, getEOL, getSystemUserName} from "./utils/os.js";

const bootstrap = async () => {
    console.log(`Username: ${getUsername()} `);
    console.log(userHomeDir);
    const dirContents = await fs.readdir(userHomeDir)
        .then((entities) => {
            entities.map(async entity => {
                const entity_type = await entityTypeCheck(entity);
                return {
                    entity,
                    type: entity_type
                }
            })
        });
    console.log(dirContents);
    console.log(getEOL());
    console.log(getCpus());
    console.log(getArch());
    console.log(getSystemUserName());
    console.table(dirContents);
}

bootstrap();