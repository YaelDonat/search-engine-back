import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { ScrapersModule } from './scrapers/scrapers.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './book/book.module';
import { WordModule } from './word/word.module';
import pino from 'pino';
import * as fs from 'fs';

const logDirectory = './logs';

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        formatters: {
          level: (label, number) => {
            return { level: label };
          }
        },

        customReceivedMessage: function (req, res) {
          return `request ${req.id} received: ${req.method} ${req.url}`;
        },

        customSuccessMessage: function (req, res) {
          return `${req.method} ${req.url} completed`;
        },

        customErrorMessage: function (req, res, err) {
          return `request ${req.id} to ${req.method} ${req.url} errored with status code: ${res.statusCode} message: ${err.message}`;
        },

        stream: pino.destination({
          dest: `./logs/${new Date().toLocaleDateString('en-US').replace(/\//g, '-')}.log`,
          minLength: 4096,
          sync: false
        }),

        serializers: {
          res: res => {
            return { statusCode: res.statusCode };
          },
          req: req => {
            return {
              method: req.method,
              url: req.url,
              remoteAddress: req.remoteAddress
            };
          }
        },

        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined
      }
    }),
    ScrapersModule,
    PrismaModule,
    WordModule,
    BookModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
