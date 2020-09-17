import * as ws from 'ws';
import { Host } from '@rpc-lib/core';

interface Disposable {
  dispose(): void;
}

export class SocketHost extends Host implements Disposable {
  private handleMessage = (message: string) => this.processMessage(message);

  constructor(private socket: ws) {
    super((message: string) => socket.send(message));
    socket.on('message', this.handleMessage);
  }

  dispose() {
    this.socket.off('message', this.handleMessage);
  }
}
