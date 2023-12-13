import { inject } from 'vue';
import { ApiClient } from '../DependencyInjection/Connect';

export function useApiClient() {
  const client = inject(ApiClient);

  if (!client) {
    throw new Error('API client has not been configured!');
  }

  return client;
}
