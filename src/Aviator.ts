import express, { Express } from 'express';
import * as http from 'node:http';
import RouterService from './router-service/RouterService';
import compression from 'compression';
import Logger from './utils/Logger';
import Metrics from './Metrics';
import Websocket from './Websocket';
import HttpExpress from './HttpExpress'

export default class Aviator {
    private static httpExpress: HttpExpress;
    private static websocket: Websocket;
    private static routerService: RouterService;
    private static metrics: Metrics;

    public static async main(){
        await this.printSystemInfo();

        this.httpExpress = HttpExpress.create();
        this.websocket = Websocket.create(this.httpExpress.http);

        this.metrics = Metrics.create(this.httpExpress.express);
        this.routerService = RouterService.create(this.httpExpress.express, this.websocket, this.metrics);

        this.routerService.start();

        process.on('SIGTERM', (s) => {
            console.log(s);
            process.exit(0);
        })
    }



    private static async printSystemInfo() {
        Logger.log('               _       _                   ');
        Logger.log('     /\\       (_)     | |                 ');
        Logger.log('    /  \\__   ___  __ _| |_ ___  _ __      ');
        Logger.log('   / /\\ \\ \\ / / |/ _` | __/ _ \\| \'__| ');
        Logger.log('  / ____ \\ V /| | (_| | || (_) | |        ');
        Logger.log(' /_/    \\_\\_/ |_|\\__,_|\\__\\___/|_|    ');
        Logger.log(`Platform@Arch: ${process.platform}@${process.arch} NodeJs-Version: ${process.version}`);
    }
}