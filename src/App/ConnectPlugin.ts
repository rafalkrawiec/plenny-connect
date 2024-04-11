import type { AxiosInstance } from 'axios';
import type { Plugin } from 'vue';
import { ApiClient, EchoConfiguration, type EchoOptions } from '../DependencyInjection/Connect';
import { useHubDictionaryStore } from '../Stores/UseHubDictionaryStore';

type Options = {
  client: AxiosInstance,
  echo: EchoOptions,
}

export const ConnectPlugin: Plugin<Options> = {
  install(app, options) {
    app.provide(ApiClient, options.client);
    app.provide(EchoConfiguration, options.echo);

    options.client.interceptors.response.use((res) => res, (error) => {
      if (error.response.status === 422) {
        return Promise.reject(error);
      }

      if (error.response.status === 419) {
        window.location.reload();

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
