# rpc-lib

Two-way RPC over websocket.
The main goal is to expose entire interfaces not individual methods.

Usage:

```ts
import * as rpc from 'rpc-lib';
```

[socket server](example/src/server.ts#L16-L17)

```ts
export class ServerApi {
  add(a: number, b: number) {
    return a + b;
  }

  sub(a: number, b: number) {
    return a - b;
  }
}
```

```ts
const rh = new rpc.Host(socket);
rh.addEndpoint('server-api', new ServerApi());
```

[socket client](example/src/client.ts#L7-L12)

```ts
  const rh = new rpc.Host(socket);

  const serverApi = rh.getEndpoint<ServerApi>('server-api');
  console.log('1 + 2 =', await serverApi.add(1, 2));
  console.log('1 - 2 =', await serverApi.sub(1, 2));
});
```
