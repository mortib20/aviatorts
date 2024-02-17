import Logger from '../utils/Logger';
import * as dgram from 'node:dgram';
import {EndpointConfig} from '../router-service/RouterConfigService';
import IOutput, {OutputStatus} from './IOutput';

export default class UdpOutput implements IOutput {
    private readonly _status: OutputStatus;

    private constructor(private endpoint: EndpointConfig, private socket: dgram.Socket, private logger: Logger) {
        this._status = {
            endpoint: endpoint,
            connected: null
        };
        this.setupEvents();
        this.logger.info('Starting')
    }

    private setupEvents() {
        this.socket.on('error', (error) => this.logger.error(error));
    }

    public send(data: Buffer) {
        this.socket.send(data, this.endpoint.port, this.endpoint.address);
    }

    public status(): OutputStatus {
        return this._status;
    }

    public static create(endpoint: EndpointConfig) {
        return new UdpOutput(endpoint, dgram.createSocket('udp4'), Logger.create(`${this.name}:${endpoint.address}:${endpoint.port}`));
    }
}
