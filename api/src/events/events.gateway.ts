import { HttpService, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as papa from 'papaparse';
import { ReadStream } from 'fs';

type Stock = {
  symbol: string;
  date: string;
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
};
@WebSocketGateway()
export class EventsGateway {
  constructor(private readonly httpService: HttpService) {}

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
  async identity(@MessageBody() payload: { to: string; message: string }) {
    this.server.to(payload.to).emit('message', payload.message);
    // BOT
    if (payload.message.match(/^\/stock=/)) {
      const stockingResponse = await this.httpService
        .get<ReadStream>('http://localhost:8082')
        .toPromise();

      papa.parse(stockingResponse.data, {
        header: true,
        skipEmptyLines: true,
        transformHeader: col =>
          col
            .trim()
            .toLowerCase()
            .replace(/\s/g, '_'),
        complete: results => {
          const [stock] = results.data as Stock[];
          this.server
            .to(payload.to)
            .emit(
              'message',
              `${stock.symbol} quote is $${stock.close} per share`,
            );
        },
      });
    }
  }
}
