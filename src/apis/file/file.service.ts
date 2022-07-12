import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import 'dotenv/config';

@Injectable()
export class FileService {
  async upload({ files }) {
    const waitedFiles = await Promise.all(files);

    const storage = new Storage({
      projectId: process.env.GCP_STORAGE_PROJECTID,
      keyFilename: process.env.GCP_STORAGE_KEYFILENAME,
    }).bucket(process.env.GCP_STORAGE_BUCKET);

    let results = await Promise.all(
      waitedFiles.map((el) => {
        return new Promise((resolve, reject) => {
          const filename = v4() + el.filename;
          el.createReadStream()
            .pipe(storage.file(filename).createWriteStream())
            .on('finish', () =>
              resolve(`${process.env.GCP_STORAGE_BUCKET}/${filename}`),
            )
            .on('error', () => reject());
        });
      }),
    );

    results = results.map((el) => 'https://storage.googleapis.com/' + el);

    return results;
  }
}
