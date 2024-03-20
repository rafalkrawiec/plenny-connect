import Echo from 'laravel-echo';
import { inject } from 'vue';
import { EchoConfiguration } from '../DependencyInjection/Connect';

let broadcast: Echo;

export function useBroadcast() {
  const config = inject(EchoConfiguration);

  if (!config) {
    throw new Error('Missing Pusher configuration!');
  }

  if (!broadcast) {
    broadcast = new Echo(config);
  }

  return { broadcast };
}
