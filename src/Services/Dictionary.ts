import { ref, unref, type MaybeRef, type ComputedRef, type Ref } from 'vue';

export type MetaDictionary<T extends MetaEntry = never> = ReturnType<typeof dictionary<T>>;
export type MetaEntry = { label: string, value: any };
export type MetaStore<T extends MetaEntry = never> = MaybeRef<T[]> | ComputedRef<T[]>;

export function dictionary<T extends MetaEntry = never>(initial: MetaStore<T>) {
  const store = ref(unref(initial)) as Ref<T[]>;

  function record(value: any) {
    if (value != null) {
      return store.value.find((record) => record.value === value);
    } else {
      return null;
    }
  }

  function label(value: any) {
    return record(value)?.label;
  }

  function rehydrate(fresh: MetaStore<T>) {
    store.value = unref(fresh);
  }

  return {

    [Symbol.iterator]() {
      return store.value[Symbol.iterator]();
    },

    get length() {
      return store.value.length;
    },

    store,
    record,
    label,
    rehydrate,

  };
}
