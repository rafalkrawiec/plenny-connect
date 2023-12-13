import type { AxiosRequestConfig } from 'axios';
import { watch, ref, toValue } from 'vue';
import { useRoute } from 'vue-router';
import { useApiClient } from './UseApiClient';
import { dependenciesFromEndpoint, buildResourceRequest } from '../Services/RequestBuilder';

export type Resource = Record<string, any> | Record<string, any>[];
export type ResourceLoaderOptions<D extends Resource = any> = { endpoint: string, bindings?: Record<string, any>, allowEmpty?: boolean } & AxiosRequestConfig<D>;
export type ResourceLoader<D extends Resource = any> = ReturnType<typeof useResource<D>>;

export function useResource<D extends Resource = any>({ allowEmpty, bindings = {}, ...options }: ResourceLoaderOptions<D>) {
  const client = useApiClient();
  const route = useRoute();

  const resource = ref<D>();
  const exists = ref(false);
  const loading = ref(false);
  const error = ref();

  watch(() => dependenciesFromEndpoint(options.endpoint, { ...route.params, ...bindings }), () => reload(), {
    immediate: true,
    flush: 'post',
  });

  function update(data: D) {
    resource.value = data;
    loading.value = false;
    exists.value = true;
  }

  function reload(loader = true) {
    let endpoint = toValue(options.endpoint);
    let args: AxiosRequestConfig<D>;

    try {
      args = buildResourceRequest<D>({ ...options, endpoint, bindings: { ...route.params, ...bindings } });
    } catch (e) {
      if (!allowEmpty) throw e;
      return Promise.resolve();
    }

    if (loader) {
      loading.value = true;
    }

    return client.request(args).then((res) => {
      resource.value = res.data;
      loading.value = false;
      exists.value = true;

      return res;
    }).catch((err) => {
      error.value = err;
      loading.value = false;
      exists.value = false;
    });
  }

  return { resource, exists, loading, error, update, reload };
}
