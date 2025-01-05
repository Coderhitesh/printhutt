import axios from 'axios';
import CryptoJS from 'crypto-js';
import { PaymentInitiateResponse, PaymentStatusResponse } from './types/payment';

export class PhonePePayment {
  private merchantId: string;
  private saltKey: string;
  private saltIndex: string;
  private env: 'UAT' | 'PROD';

  constructor(
    merchantId: string,
    saltKey: string,
    saltIndex: string,
    env: 'UAT' | 'PROD' = 'UAT'
  ) {
    this.merchantId = merchantId;
    this.saltKey = saltKey;
    this.saltIndex = saltIndex;
    this.env = env;
  }

  private getBaseUrl(): string {
    return this.env === 'PROD'
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  }

  private generateX_VERIFY(payload: string, endpoint: string): string {
    const string = payload + endpoint + this.saltKey;
    const sha256 = CryptoJS.SHA256(string).toString();
    return `${sha256}###${this.saltIndex}`;
  }

  async initiatePayment(
    amount: number,
    merchantTransactionId: string,
    callbackUrl: string,
    userDetails?: {
      name?: string;
      email?: string;
      phone?: string;
    }
  ): Promise<PaymentInitiateResponse> {
    try {
      const payload = {
        merchantId: this.merchantId,
        merchantTransactionId: merchantTransactionId,
        amount: amount * 100, 
        redirectUrl: callbackUrl,
        redirectMode: 'POST',
        callbackUrl: callbackUrl,
        merchantUserId: 'MUID' + Date.now(),
        paymentInstrument: {
          type: 'PAY_PAGE',
        },
        ...(userDetails && {
          userInfo: {
            ...userDetails,
          },
        }),
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
      const xVerify = this.generateX_VERIFY(base64Payload, '/pg/v1/pay');

      const response = await axios.post<PaymentInitiateResponse>(
        `${this.getBaseUrl()}/pg/v1/pay`,
        {
          request: base64Payload,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': xVerify,
          },
        }
      );

      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error('PhonePe payment initiation error:', error);
      return {
        success: false,
        code: 'ERROR',
        message: 'Failed to initiate payment',
        error: 'Failed to initiate payment',
      };
    }
  }

  async checkStatus(merchantTransactionId: string): Promise<PaymentStatusResponse> {
    try {
      const endpoint = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}`;
      const xVerify = this.generateX_VERIFY('', endpoint);

      const response = await axios.get<PaymentStatusResponse>(
        `${this.getBaseUrl()}${endpoint}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': xVerify,
            'X-MERCHANT-ID': this.merchantId,
          },
        }
      );

      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error('PhonePe status check error:', error);
      return {
        success: false,
        code: 'ERROR',
        message: 'Failed to check payment status',
        error: 'Failed to check payment status',
      };
    }
  }
}