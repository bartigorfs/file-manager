import {createInterface} from 'node:readline/promises';

import {processCmd} from "./utils/cmd.js";
import {log} from "./utils/prettyLog.js";
import {baseHomeDir} from "./utils/os.js";
import {getCurrentDir, writeGreetings} from "./utils/utils.js";

import {getUsername} from "./args/argv.js";

const bootstrap = async () => {
    writeGreetings();
    process.chdir(baseHomeDir);
    getCurrentDir();

    const readLine = createInterface(process.stdin, process.stdout);

    readLine.on('line', async data => {
        if (data === '.exit') readLine.close();
        await processCmd(data);
        getCurrentDir();
    })

    readLine.on('close', () => {
        log.success(`Thank you for using File Manager, ${getUsername()}, goodbye!`);
        process.exit();
    })
}

bootstrap();