import path from "node:path";
import fs from "node:fs/promises";
import {createReadStream} from "node:fs";
import {Transform} from "node:stream";
import {createHash} from "node:crypto";
import {log} from "../prettyLog.js";

export const calculateHash = async (filename) => {
    try {
        const FILE_PATH = path.resolve(filename);
        await fs.access(FILE_PATH, fs.constants.R_OK)
        const READ_STREAM = createReadStream(FILE_PATH).setEncoding('utf-8');

        const SHA256 = new Transform({
            transform(data, encoding, callback) {
                callback(null, createHash('sha256').update(data).digest('hex'));
            },
        });

        READ_STREAM.pipe(SHA256).on("data", (data) => {
            process.stdout.write(data + '\n');
        });
        READ_STREAM.on('error', (err) => {
            log.error('Operation failed\n')
        });
    } catch (e) {
        log.error('Operation failed\n')
    }
}
