import Logger from './utils/Logger'
import express, { Express } from 'express';
import * as http from 'node:http';
import compression from 'compression'

export default class HttpExpress {
    private readonly _http: http.Server;
    private readonly _express: Express;

    public get http() {
        return this._http;
    }

    public get express() {
        return this._express;
    }

    private constructor(port: number, private logger: Logger) {
        this._express = express();
        this._http = http.createServer(this._express);
        this.setupExpress();
        this.setupHttp(port);
    }

    private setupExpress() {
        //this._express.use((req, res) => res.status(404).end())
        this._express.use(compression());
    }

    private setupHttp(port: number) {
        this._http.listen(port);
        this._http.on('listening', () => {
            this.logger.info(`Starting on :${port}`);
        })
        this._http.on('error', (error) => {
            this.logger.error(error);
        })
    }

    public static create(port: number) {
        return new HttpExpress(port, Logger.create(this.name));
    }
}