import { reactive, ref, computed, watch, toValue, type MaybeRef } from 'vue';
import { useRoute } from 'vue-router';
import { useApiClient } from './UseApiClient';
import { buildResourceRequest } from '../Services/RequestBuilder';
import type { MetaDictionary } from '../Services/Dictionary';
import { dictionary } from '../Services/Dictionary';

type Bindings = Record<string, any>;
type EndpointResolver<B extends Bindings> = string | undefined | ((bindings: B) => string | undefined);

export function useDictionary<B extends Bindings, T extends Record<string, EndpointResolver<B>>>(endpoints: T, bindings: MaybeRef<B> = {} as B) {
  const client = useApiClient();
  const route = useRoute();

  const data = reactive(Object.fromEntries(Object.entries(endpoints).map(([key]) => [key, dictionary([])]))) as Record<keyof T, MetaDictionary>;
  const ready = reactive(Object.fromEntries(Object.entries(endpoints).map(([key]) => [key, false]))) as Record<keyof T, boolean>;
  const loading = computed(() => !Object.values(ready).every((v) => !!v));
  const error = ref();

  function refresh(key: keyof T) {
    let endpoint: EndpointResolver<B> = endpoints[key];

    if (typeof endpoint === 'function') {
      endpoint = endpoint(toValue(bindings));
    }

    if (!endpoint) {
      data[key].rehydrate([]);
      ready[key] = true;
      return;
    }

    client.request(buildResourceRequest({ endpoint, bindings: { ...route.params, ...toValue(bindings) } })).then((res) => {
      data[key].rehydrate(res.data);
      ready[key] = true;
    }).catch((err) => {
      ready[key] = true;
      error.value = err;
    });
  }

  watch(() => bindings, () => {
    Object.keys(endpoints).forEach((key: keyof T) => refresh(key));
  }, {
    immediate: true,
  });

  return { data, loading, error, refresh };
}

export type MetaRepository<B extends Bindings, T extends Record<string, EndpointResolver<B>>> = ReturnType<typeof useDictionary<B, T>>;
