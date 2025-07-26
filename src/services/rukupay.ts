import axios, { AxiosError } from 'axios';

interface CreateCustomerPayload {
  name: string;
  email: string;
}

interface RukuCustomerResponse {
  id: string;
  object: string;
  address: any;
  balance: number;
  created: number;
  currency: string | null;
  default_source: string | null;
  delinquent: boolean;
  description: string | null;
  discount: any;
  email: string;
  invoice_prefix: string;
  invoice_settings: {
    custom_fields: any;
    default_payment_method: any;
    footer: any;
    rendering_options: any;
  };
  livemode: boolean;
  metadata: Record<string, any>;
  name: string;
  next_invoice_sequence: number;
  phone: string | null;
  preferred_locales: string[];
  shipping: any;
  tax_exempt: string;
  test_clock: any;
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface CreateCustomerPayload {
  name: string;
  email: string;
}

@Injectable()
export class RukuService {
  constructor(private readonly configService: ConfigService) {}

  async createRukuCustomer(
    payload: CreateCustomerPayload,
  ): Promise<RukuCustomerResponse> {
    const baseURL = this.configService.get<string>('RUKU_API_URL');

    try {
      const response = await axios.post(`${baseURL}/stripe/customer`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        maxBodyLength: Infinity,
      });

      return response.data;
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        console.error('Ruku API Error:', err.response.data);
        throw new Error(`Ruku API Error: ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        throw new Error('No response from Ruku service.');
      } else {
        console.error('Unexpected error:', err.message);
        throw new Error(`Unexpected Error: ${err.message}`);
      }
    }
  }
}
