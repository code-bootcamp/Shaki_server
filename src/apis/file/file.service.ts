import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import 'dotenv/config';

@Injectable()
export class FileService {
  async upload({ file }) {
    const storage = new Storage({
      projectId: process.env.GCP_STORAGE_PROJECTID,
      // keyFilename: process.env.GCP_STORAGE_KEYFILENAME,
      keyFilename: 'canvas-pathway-356414-d563349b4cc1.json',
    }).bucket(process.env.GCP_STORAGE_BUCKET);

    const filename = v4() + file.filename;
    let url = await new Promise((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(filename).createWriteStream())
        .on('finish', () =>
          resolve(`${process.env.GCP_STORAGE_BUCKET}/${filename}`),
        )
        .on('error', (error) => reject(error));
    });

    url = 'https://storage.googleapis.com/' + url;
    return url;
  }

  async remove({ imageUrl }) {
    try {
      const url = imageUrl.split('/shaki_bucket/')[1];

      const storage = new Storage({
        projectId: process.env.GCP_STORAGE_PROJECTID,
        // keyFilename: process.env.GCP_STORAGE_KEYFILENAME,
        keyFilename: 'canvas-pathway-356414-d563349b4cc1.json',
      }).bucket(process.env.GCP_STORAGE_BUCKET);

      await storage.file(url).delete();
      return true;
    } catch {
      return false;
    }
  }
}
