import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  logger = new Logger(EventsGateway.name);

  @SubscribeMessage('join')
  join(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    this.logger.debug('connecting to room: ' + room);
    client.join(room);
    this.server.to(room).emit('message', 'welcome');
  }

  @SubscribeMessage('message')
  identity(@MessageBody() payload: { to: string; message: string }) {
    this.logger.debug('message received: ' + payload.message);
    this.server.to(payload.to).emit('message', payload.message);
    this.logger.debug('message sent to: ' + payload.to);
  }
}
