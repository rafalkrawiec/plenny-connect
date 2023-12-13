import type { InjectionKey } from 'vue';
import type { AxiosInstance } from 'axios';
import type { PusherOptions } from '../Composables/UseBroadcast';

export const ApiClient = Symbol('ApiClient') as InjectionKey<AxiosInstance>;
export const PusherConfiguration = Symbol('PusherConfiguration') as InjectionKey<PusherOptions>;
