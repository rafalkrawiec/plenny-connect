import { ref } from 'vue';

export type MetaDictionary = ReturnType<typeof dictionary>;
export type MetaEntry = { label: string, value: any, [k: string]: any };
export type MetaStore = Array<MetaEntry>;

export function dictionary(initial: MetaStore) {
  const store = ref(initial);

  function record(value: any) {
    if (value == null) {
      return null;
    }

    return store.value.find((record) => record.value === value);
  }

  function label(value: any) {
    return record(value)?.label;
  }

  function rehydrate(fresh: MetaStore) {
    store.value = fresh;
  }

  return {
    store,
    record,
    label,
    rehydrate,
  };
}
