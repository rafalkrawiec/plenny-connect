import type { InjectionKey } from 'vue';
import type { AxiosInstance } from 'axios';

export type EchoOptions = any;

export const ApiClient = Symbol('ApiClient') as InjectionKey<AxiosInstance>;
export const EchoConfiguration = Symbol('EchoConfiguration') as InjectionKey<EchoOptions>;
