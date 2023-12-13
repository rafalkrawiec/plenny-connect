import type { AxiosInstance } from 'axios';
import type { Plugin } from 'vue';
import type { PusherOptions } from '../Composables/UseBroadcast';
import { ApiClient, PusherConfiguration } from '../DependencyInjection/Connect';
import { useHubDictionaryStore } from '../Stores/UseHubDictionaryStore';

type Options = {
  client: AxiosInstance,
  pusher: PusherOptions,
}

export const ConnectPlugin: Plugin<Options> = {
  install(app, options) {
    app.provide(ApiClient, options.client);
    app.provide(PusherConfiguration, options.pusher);

    options.client.interceptors.response.use((res) => res, (error) => {
      if (error.response.status === 422) {
        return Promise.reject(error);
      }

      const dialog = document.createElement('div');
      const iframe = document.createElement('iframe');

      dialog.classList.add('exception-handler-window');
      dialog.appendChild(iframe);

      document.body.appendChild(dialog);

      iframe.contentWindow!.document.open();
      iframe.contentWindow!.document.write(error.response.data);
      iframe.contentWindow!.document.close();

      return Promise.reject(error);
    });

    app.config.globalProperties.$dictionary = useHubDictionaryStore();
  },
};
