import * as rpc from '@rpc-lib/ws';
import * as ws from 'ws';

export class ServerApi {
  add(a: number, b: number) {
    return a + b;
  }

  sub(a: number, b: number) {
    return a - b;
  }
}

const server = new ws.Server({ port: 5000 });
server.on('connection', async (socket: ws) => {
  const rh = new rpc.Host(socket);
  rh.addEndpoint('server-api', new ServerApi());

  socket.on('close', () => {
    server.close();
  });
});
