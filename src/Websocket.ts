import { Server } from 'socket.io'
import * as http from 'node:http';

export default class Websocket {
    private constructor(private readonly io: Server) {
    }

    public send(name: string, data: any) {
        this.io.compress(true).emit(name, data)
    }

    public static create(http: http.Server) {
        return new Websocket(new Server(http, { httpCompression: true }))
    }
}