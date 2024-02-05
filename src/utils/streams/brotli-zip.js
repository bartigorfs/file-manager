import fs from "node:fs/promises";
import zlib from "node:zlib";
import path from "node:path";
import {createReadStream, createWriteStream} from "node:fs";

import {isDirectoryExists, isFileExists} from "../utils.js";
import {log} from "../prettyLog.js";

export const brotliCompress = async (fileToCompress, compressedPath, compress) => {
    try {
        const FILE_TO_COMPRESS = path.resolve(fileToCompress);
        const COMPRESSED_PATH = path.resolve(compressedPath);

        if (!await isFileExists(FILE_TO_COMPRESS) || await isFileExists(COMPRESSED_PATH)) log.warning('Operation failed\n');

        if (!await isDirectoryExists(path.dirname(COMPRESSED_PATH))) {
            await fs.mkdir(path.dirname(COMPRESSED_PATH), {recursive: true});
        }

        const READ_STREAM = createReadStream(FILE_TO_COMPRESS);
        const WRITE_STREAM = createWriteStream(COMPRESSED_PATH, {flags: 'a+'});
        const BROTLI = compress
            ? zlib.createBrotliCompress()
            : zlib.createBrotliDecompress();

        READ_STREAM.pipe(BROTLI).pipe(WRITE_STREAM);
    } catch (e) {
        log.warning(`Operation failed\n`);
    }
};
