import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { inject } from 'vue';
import { PusherConfiguration } from '../DependencyInjection/Connect';

export type PusherOptions = {
  key: string;
  cluster: string;
}

let broadcast: Echo;

export function useBroadcast() {
  const config = inject(PusherConfiguration);

  if (!config) {
    throw new Error('Missing Pusher configuration!');
  }

  if (!broadcast) {
    broadcast = createBroadcast(config);
  }

  return { broadcast };
}

function createBroadcast(config: PusherOptions) {
  const { key, cluster } = config;

  return new Echo({
    broadcaster: 'pusher',
    key: key,
    cluster: cluster,
    wsHost: `ws-${cluster}.pusher.com`,
    wsPort: 80,
    wssPort: 443,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    Pusher,
  });
}
