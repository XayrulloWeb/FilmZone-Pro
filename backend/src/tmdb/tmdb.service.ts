import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TmdbService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async get(endpoint: string, params: Record<string, any> = {}) {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    const baseUrl = this.configService.get<string>('TMDB_API_URL');

    try {
      const response = await lastValueFrom(
        this.httpService.get(`${baseUrl}${endpoint}`, {
          params: {
            ...params,
            api_key: apiKey,
            language: params.language || 'ru-RU',
          },
        }),
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data || 'Error connecting to TMDB';
      const errorStatus =
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(errorData, errorStatus);
    }
  }
}
