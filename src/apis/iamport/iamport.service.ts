import { UnprocessableEntityException } from '@nestjs/common';
import axios from 'axios';
import 'dotenv/config';

export class IamportService {
  async getToken() {
    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
      data: {
        imp_key: process.env.IMP_KEY, // REST API키
        imp_secret: process.env.IMP_SECRET, // REST API Secret
      },
    });
    return getToken.data.response.access_token;
  }

  async checkToken({ impUid: imp_uid }) {
    const getToken = await this.getToken();
    try {
      const data = await axios({
        url: `https://api.iamport.kr/payments/${imp_uid}`,
        method: 'get', // GET method
        headers: { Authorization: getToken }, // 인증 토큰 Authorization header에 추가
      });
    } catch (error) {
      throw new UnprocessableEntityException('존재하지 않는 결제내역');
    }
  }
}
