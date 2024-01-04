export type MetaDictionary = ReturnType<typeof dictionary>;
export type MetaEntry = { label: string, value: any, [k: string]: any };
export type MetaStore = Array<MetaEntry>;

export function dictionary(initial: MetaStore) {
  let store = initial;

  function record(value: any) {
    if (value == null) {
      return null;
    }

    return store.find((record) => record.value === value);
  }

  function label(value: any) {
    return record(value)?.label;
  }

  function rehydrate(fresh: MetaStore) {
    store = fresh;
  }

  return {
    store,
    record,
    label,
    rehydrate,
  };
}
