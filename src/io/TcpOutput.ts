import Logger from '../utils/Logger';
import {EndpointConfig} from '../router-service/RouterConfigService';
import * as net from 'node:net';
import IOutput, {OutputStatus} from './IOutput';

export default class TcpOutput implements IOutput {
    private readonly _status: OutputStatus;
    private socket: net.Socket = new net.Socket();

    private constructor(private endpoint: EndpointConfig, private logger: Logger) {
        this._status = {
            endpoint: this.endpoint,
            connected: false
        };
        this.socket = net.createConnection(endpoint.port, endpoint.address);
        this.setupEvents();
    }

    private setupEvents() {
        this.socket.on('error', (error) => this.logger.error(error));
        this.socket.on('connect', () => {
            this.logger.info('Connected');
            this._status.connected = true;
        })
        this.socket.on('close', () => {
            this._status.connected = false;
            this.socket.removeAllListeners();
            this.socket.destroy();
            this.socket = net.createConnection(this.endpoint.port, this.endpoint.address);
            this.setupEvents();
        })
    }

    public connect() {
        this.socket.connect(this.endpoint.port, this.endpoint.address)
    }

    public send(data: Buffer) {
        this.socket.write(data);
    }

    public status(): OutputStatus {
        return this._status;
    }

    public static create(endpoint: EndpointConfig) {
        return new TcpOutput(endpoint, Logger.create(`${this.name}:${endpoint.address}:${endpoint.port}`));
    }
}