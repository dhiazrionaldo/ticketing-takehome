// src/core/api/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: { "Content-Type": "application/json" },
    });
  }

  async request<T = any>(
    path: string,
    options: AxiosRequestConfig = {},
    token?: string
  ): Promise<T> {
    const headers = token
      ? { ...options.headers, Authorization: `Bearer ${token}` }
      : options.headers;

    const res = await this.client.request<T>({
      url: path,
      ...options,
      headers,
    });
    return res.data;
  }
}
