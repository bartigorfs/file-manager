import {log} from "../utils/prettyLog.js";
import {getSystemUserName} from "../utils/os.js";
/*
Module that helps to obtain username from arguments
Returns: typeof string | undefined
 */

export const getUsername = () => {
    const cli_args = process.argv.slice(2);

    const userIndex = cli_args.indexOf('--username');

    if (userIndex !== -1 && userIndex + 1 < cli_args.length) {
        return cli_args[userIndex + 1];
    } else {
        log.warning('Using fallback username');
        return getSystemUserName();
    }
}
