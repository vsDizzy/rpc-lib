import * as ws from 'ws';
import { SocketHost } from '../src/socket';

describe(SocketHost.name, () => {
  class Api {
    add(a: number, b: number) {
      return a + b;
    }
  }

  it('example', async () => {
    const api = new Api();

    const server = new ws.Server({ port: 5000 });
    server.on('connection', async (socket: ws) => {
      const sh = new SocketHost(socket);
      sh.addEndpoint('api', api);

      socket.on('close', () => {
        server.close();
      });
    });

    const cs = new ws('ws://localhost:5000');
    cs.on('open', async () => {
      const sh = new SocketHost(cs);
      const remoteApi = sh.getEndpoint<typeof api>('api');

      const res = remoteApi.add(1, 2);
      await expectAsync(res).toBeResolvedTo(3);

      cs.close();
    });
  });
});
