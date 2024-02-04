import {getUsername} from "./args/argv.js";
import {processCmd} from "./utils/cmd.js";
import {createInterface} from 'node:readline/promises'
import {log} from "./utils/prettyLog.js";

const writeGreetings = () => {
    log.success(`Welcome to the File Manager, ${getUsername()}! \n`)
}

const bootstrap = async () => {
    writeGreetings();

    const readLine = createInterface(process.stdin, process.stdout);

    readLine.on('line', async data => {
        getCurrentDir();
        await processCmd(data);
    })

    readLine.on('close', () => {
        console.log(`Thank you for using File Manager, ${getUsername()}, goodbye!`);
    })
}

bootstrap();