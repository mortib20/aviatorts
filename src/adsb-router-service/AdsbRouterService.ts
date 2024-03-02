import * as net from 'net';
import Websocket from '../Websocket';
import Logger from '../utils/Logger';

export class AdsbRouterService {
    private socket!: net.Socket;

    private constructor(private readonly websocket: Websocket, private readonly logger: Logger) {
        this.setupEvent();
    }

    private setupEvent() {
        this.socket = new net.Socket();
        this.socket.connect(30000, '127.0.0.1');
        this.socket.on('connect', () => this.logger.info('Connected'));
        this.socket.on('error', (error) => this.logger.error(error.message));
        this.socket.on('data', (msg) => {
            this.websocket.send('readsb', msg);
        })
        this.socket.on('close', () => {
            setTimeout(() => {
                this.socket.removeAllListeners();
                this.socket.destroy();
                this.setupEvent();
            }, 10000);
        })
    }

    public static create(websocket: Websocket): AdsbRouterService {
        return new AdsbRouterService(websocket, Logger.create(this.name));
    }
}