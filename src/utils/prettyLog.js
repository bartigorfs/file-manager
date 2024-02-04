/*
Pretty stdout feature, thanks to student in Discord.
Please, do not count this as Module when you'll be checking, this is not my module, just a funky thing
Link: https://muffinman.io/blog/nodejs-simple-colorful-logging/
 */

const reset = "\x1b[0m";

const log = {
    success: (text) => process.stdout.write("\x1b[32m" + text + reset),
    error: (text) => process.stdout.write("\x1b[31m" + text + reset),
    // blue: (text) => console.log("\x1b[34m" + text + reset),
    warning: (text) => process.stdout.write("\x1b[33m" + text + reset),
};

export {log};