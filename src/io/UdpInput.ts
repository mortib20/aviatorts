import * as dgram from 'node:dgram';
import Logger from '../utils/Logger';

export default class UdpInput {
    private socket: dgram.Socket;
    private constructor(port: number, private logger: Logger) {
        this.socket = dgram.createSocket('udp4');
        this.socket.bind(port);
        this.socket.on('listening', () => this.logger.info('Listening'));
        this.socket.on('close', () => this.logger.info('Closing'));
        this.socket.on('error', (error) => this.logger.error(error));
    }

    public handleMessage(handler: (msg: Buffer) => void) {
        this.socket.on('message', handler);
    }

    public static create(port: number) {
        return new UdpInput(port, Logger.create(`${this.name}:${port}`));
    }
}