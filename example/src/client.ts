import * as ws from 'ws';
import * as rpc from '@rpc-lib/ws';
import type { ServerApi } from './server';

const socket = new ws('ws://localhost:5000');
socket.on('open', async () => {
  const rh = new rpc.Host(socket);

  const serverApi = rh.getEndpoint<ServerApi>('server-api');
  console.log('Calling server methods:');
  console.log('1 + 2 =', await serverApi.add(1, 2));
  console.log('1 - 2 =', await serverApi.sub(1, 2));

  socket.close();
});
