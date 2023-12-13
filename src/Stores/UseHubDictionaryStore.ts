import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApiClient } from '../Composables/UseApiClient';
import { dictionary } from '../Services/Dictionary';

/**
 * A global store used to keep some basic system data globally without need
 * to load it for all the time.
 *
 * @public
 *
 * @deprecated This approach is deprecated as it's way too far complicated
 *             to keep global store state in sync with backend.
 *             Use `useDictionary` composable instead to load up-to-date
 *             dictionaries on demand when you need them.
 */
export const useHubDictionaryStore = defineStore('hub_dictionary', () => {
  const client = useApiClient();
  const hasBeenInitialized = ref(false);
  const registry = ref({});

  async function init() {
    if (!hasBeenInitialized.value) {
      return await client.get('/api/v1/hub/dictionary').then((res) => {
        registry.value = res.data;
        hasBeenInitialized.value = true;

        return Promise.resolve();
      });
    }

    return Promise.resolve();
  }

  async function refresh() {
    return await client.get('/api/v1/hub/dictionary').then((res) => {
      registry.value = res.data;
      hasBeenInitialized.value = true;

      return Promise.resolve(res.data);
    });
  }

  function toMeta(name) {
    return dictionary(store(name));
  }

  function store(name) {
    if (!hasBeenInitialized.value) {
      throw new Error('Trying to access dictionary before initialization.');
    }

    const resolved = registry.value[name];

    if (resolved == null) {
      throw new Error('Trying to access unknown dictionary ' + name + '.');
    }

    return resolved;
  }

  function record(name, value) {
    if (!hasBeenInitialized.value) {
      throw new Error('Trying to access dictionary before initialization.');
    }

    if (value == null) {
      return null;
    }

    return store(name).find((record) => record.value === value);
  }

  function label(store, value) {
    return record(store, value)?.label;
  }

  return {
    hasBeenInitialized,
    registry,
    init,
    refresh,
    label,
    record,
    store,
    toMeta,
  };
});

export type HubDictionaryStore = ReturnType<typeof useHubDictionaryStore>;
