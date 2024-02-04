import {createInterface} from 'node:readline/promises';

import {processCmd} from "./utils/cmd.js";
import {log} from "./utils/prettyLog.js";
import {baseHomeDir} from "./utils/os.js";
import {setCurrentDirectory} from "./utils/memodir.js";
import {getCurrentDir} from "./utils/fs.js";

import {getUsername} from "./args/argv.js";

const writeGreetings = () => {
    log.success(`Welcome to the File Manager, ${getUsername()}! \n`)
}

const bootstrap = async () => {
    writeGreetings();
    setCurrentDirectory(baseHomeDir);
    getCurrentDir();

    const readLine = createInterface(process.stdin, process.stdout);

    readLine.on('line', async data => {
        await processCmd(data);
        console.log('\n');
        getCurrentDir();
    })

    readLine.on('close', () => {
        log.success(`Thank you for using File Manager, ${getUsername()}, goodbye!`);
    })
}

bootstrap();