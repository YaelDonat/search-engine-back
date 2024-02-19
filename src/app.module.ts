import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import pino from 'pino';
import * as fs from 'fs';

const logDirectory = './logs'; 

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        formatters: {
          level: (label, number) => {
            return { level: label };
          },
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
          sync: false,
        }),

        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
