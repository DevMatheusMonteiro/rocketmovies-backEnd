import fs from "fs";
import path from "path";
import * as upload from "../configs/upload.js";

export default class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename(
      path.resolve(upload.TMP_FOLDER, file),
      path.resolve(upload.UPLOAD_FOLDER, file)
    );

    return file;
  }

  async deleteFile(file) {
    const filePath = path.resolve(upload.UPLOAD_FOLDER, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
