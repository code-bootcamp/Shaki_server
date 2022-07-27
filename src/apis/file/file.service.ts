import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import 'dotenv/config';

/* =======================================================================
 *  TYPE : Service
 *  Class : FileService
 *  UpdatedAt : 2022-07-25
 *  Description : 파일(이미지) API에 필요한 각종 함수 설정
 *  Content :
 *      [ Function => String  ] : upload - 이미지 GCP STORAGE에 저장
 *      [ Function => Boolean ] : remove - GCP STORAGE에 저장된 이미지 삭제
 * ======================================================================= */

@Injectable()
export class FileService {
  async upload({ file }) {
    /* ===================================================================
     *  처리 과정
     *  1. 사용할 storage bucket 설정
     *  2. 이미지 이름 선언
     *      ( 각 이미지가 고유의 이름을 얻을 수 있도록 v4(uuid) 추가 )
     *  3. 저장할 이이미 storage bucket에 저장
     *  4. 저장한 이미지에 접근할 수 있는 url return
     * =================================================================== */

    /* ===================================================================
     * 1. 사용할 storage bucket 설정
     * =================================================================== */
    const storage = new Storage({
      projectId: process.env.GCP_STORAGE_PROJECTID,
      keyFilename: process.env.GCP_STORAGE_KEYFILENAME,
    }).bucket(process.env.GCP_STORAGE_BUCKET);

    /* ===================================================================
     * 2. 이미지 이름 선언
     * =================================================================== */
    const filename = v4() + file.filename;

    /* ===================================================================
     * 3. 저장할 이이미 storage bucket에 저장
     * =================================================================== */
    let url = await new Promise((resolve, reject) => {
      file
        .createReadStream()
        .pipe(storage.file(filename).createWriteStream())
        .on('finish', () =>
          resolve(`${process.env.GCP_STORAGE_BUCKET}/${filename}`),
        )
        .on('error', (error) => reject(error));
    });

    /* ===================================================================
     * 4. 저장한 이미지에 접근할 수 있는 url return
     * =================================================================== */
    url = 'https://storage.googleapis.com/' + url;
    return url;
  }

  async remove({ imageUrl }) {
    /* ===================================================================
     *  처리 과정
     *  1. 파라미터로 받은 url에서 이미지 이름만 추출
     *  2. 삭제할 이미지가 저장된 storage bucket 설정
     *  3. 해당 이미지 삭제
     * =================================================================== */

    try {
      /* =================================================================
       * 1. 파라미터로 받은 url에서 이미지 이름만 추출
       * ================================================================= */
      const url = imageUrl.split('/shaki_bucket/')[1];

      /* =================================================================
       * 2. 삭제할 이미지가 저장된 storage bucket 설정
       * ================================================================= */
      const storage = new Storage({
        projectId: process.env.GCP_STORAGE_PROJECTID,
        keyFilename: process.env.GCP_STORAGE_KEYFILENAME,
      }).bucket(process.env.GCP_STORAGE_BUCKET);

      /* =================================================================
       * 3. 해당 이미지 삭제
       * ================================================================= */
      await storage.file(url).delete();
      return true;
    } catch {
      return false;
    }
  }
}
