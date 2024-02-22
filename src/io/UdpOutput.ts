import Logger from '../utils/Logger';
import * as dgram from 'node:dgram';
import {EndpointConfig} from '../router-service/RouterConfigService';
import IOutput, {OutputStatus} from './IOutput';

export default class UdpOutput implements IOutput {
    private readonly _status: OutputStatus;
    private socket: dgram.Socket;

    private constructor(private endpoint: EndpointConfig, private logger: Logger) {
        this._status = {
            endpoint: endpoint,
            connected: null
        };
        this.socket = dgram.createSocket('udp4');
        this.setupEvents();
        this.socket.connect(endpoint.port, endpoint.address);

        this.logger.info('Starting')
    }

    private setupEvents() {
        this.socket.on('connect', () => { this.logger.info('Connected'); this._status.connected = true; });
        this.socket.on('error', (error) => {
            this.logger.error(error);
            this._status.connected = false;
            this.socket.removeAllListeners();
            this.socket = dgram.createSocket('udp4');
            this.setupEvents();
            this.socket.connect(this.endpoint.port, this.endpoint.address);
        });
    }

    public send(data: Buffer) {
        this.socket.send(data);
    }

    public status(): OutputStatus {
        return this._status;
    }

    public static create(endpoint: EndpointConfig) {
        return new UdpOutput(endpoint, Logger.create(`${this.name}:${endpoint.address}:${endpoint.port}`));
    }
}
