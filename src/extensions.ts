import type { HubDictionaryStore } from './Stores/UseHubDictionaryStore';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $dictionary: HubDictionaryStore,
  }
}
