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

    private constructor(private logger: Logger) {
        this._express = express();
        this._http = http.createServer(this._express);
        this.setupExpress();
        this.setupHttp();
    }

    private setupExpress() {
        this._express.use((req, res) => res.status(404).end())
        this._express.use(compression());
    }

    private setupHttp() {
        this._http.listen(21001);
        this._http.on('listening', () => {
            this.logger.info('HTTP starting on :21001');
        })
        this._http.on('error', (error) => {
            this.logger.error(error);
        })
    }

    public static create() {
        return new HttpExpress(Logger.create(this.name));
    }
}