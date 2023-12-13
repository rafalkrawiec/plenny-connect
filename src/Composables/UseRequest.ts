import type { Method, AxiosRequestConfig } from 'axios';
import { useRoute } from 'vue-router';
import { useApiClient } from './UseApiClient';
import { buildResourceRequest } from '../Services/RequestBuilder';

type Config = AxiosRequestConfig & {
  endpoint: string;
  method: Method;
  bindings?: Record<string, any>;
}

export function useRequest() {
  const client = useApiClient();
  const route = useRoute();

  async function request({ endpoint, bindings = {}, ...config }: Config) {
    return await client.request(buildResourceRequest({ endpoint, bindings: { ...route.params, ...bindings }, ...config }));
  }

  return request;
}
