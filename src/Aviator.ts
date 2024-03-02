import RouterService from './router-service/RouterService';
import Logger from './utils/Logger';
import Metrics from './Metrics';
import Websocket from './Websocket';
import HttpExpress from './HttpExpress'
import {AdsbRouterService} from './adsb-router-service/AdsbRouterService';

export default class Aviator {
    private static httpExpress: HttpExpress;
    private static websocket: Websocket;
    private static adsbRouterService: AdsbRouterService;
    private static routerService: RouterService;
    private static metrics: Metrics;

    public static async main(){
        await this.printSystemInfo();

        this.httpExpress = HttpExpress.create(21001);
        this.websocket = Websocket.create(this.httpExpress.http);

        this.metrics = Metrics.create(this.httpExpress.express);
        this.adsbRouterService = AdsbRouterService.create(this.websocket);
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