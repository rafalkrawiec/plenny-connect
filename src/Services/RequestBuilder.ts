import type { RouteParams } from 'vue-router';
import type { AxiosRequestConfig } from 'axios';
import { toValue } from 'vue';

export type ResourceOptions<D = any> = AxiosRequestConfig<D> & {
  endpoint: string,
  bindings: RouteParams,
}

export function buildResourceRequest<D = any>({ endpoint, bindings, ...options }: ResourceOptions<D>): AxiosRequestConfig<D> {
  let segments = endpoint.split('/');
  let last = segments[segments.length - 1];
  let data = toValue(options.data);
  let method = data ? 'PATCH' : 'GET';

  function handleMissingBinding(segment: string): void {
    if (!!data && segment === last) {
      method = 'POST';
    } else {
      throw new Error(`Missing route binding ${segment}`);
    }
  }

  function binder(segment: string): string {
    if (/\{[a-z0-9-_]+}/i.test(segment)) {
      return bindRouteParameter(segment, toValue(bindings), handleMissingBinding);
    }

    return segment;
  }

  let url = '/' + segments.map(binder).filter((v) => !!v).join('/');

  return { ...options, method: toValue(options.method) || method, url, data };
}

function bindRouteParameter(binding: string, bindings: RouteParams, callback: (binding: string) => void): string {
  let name = binding.substring(1, binding.length - 1);
  let value = bindings[name];

  if (!value) {
    callback(binding);
  }

  if (Array.isArray(value)) {
    throw new Error(`Route binding doesn't support multiple values!`);
  }

  return value;
}

/**
 * This function creates a string combination of route parameters from endpoint.
 * It is used to determine which route params to observe, and when watcher
 * should trigger an update.
 *
 * @param endpoint
 * @param bindings
 */
export function dependenciesFromEndpoint(endpoint: string, bindings: RouteParams) {
  return endpoint.split('/')
    .filter((segment) => /\{[a-z0-9-_]+}/i.test(segment))
    .map((segment) => bindings[segment.substring(1, segment.length - 1)])
    .join('');
}
