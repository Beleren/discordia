import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import * as papa from 'papaparse';

@Controller()
export class AppController {
  db = {
    ['appl.us']: [
      {
        symbol: 'APPL.US',
        date: new Date(2021, 4, 7, 0, 0, 0, 0),
        time: '22:00:04',
        open: 130.85,
        high: 131.2582,
        low: 129475,
        close: 130.21,
        volume: 78845855,
      },
    ],
  };

  @Get(':stockId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/csv')
  @Header('Content-Disposition', 'attachment; filename=test.csv')
  getStock(@Param('stockId') stockId: string) {
    const stock = this.db[stockId];
    if (!stock) throw new NotFoundException();
    return papa.unparse(stock);
  }
}
