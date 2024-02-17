import express, { Express } from 'express';
import RouterService from './router-service/RouterService';
import morgan from 'morgan';
import compression from 'compression';
import Logger from './utils/Logger';

export default class Aviator {
    private static _express: Express;
    private static routerService: RouterService;

    public static async main(){
        await this.printSystemInfo();

        this._express = express();
        this.routerService = RouterService.create(this._express)

        await this.setupExpress();

        this.routerService.start();

        process.on('SIGTERM', (s) => {
            console.log(s);
            process.exit(0);
        })
    }

    private static async setupExpress() {
        this._express.listen(21001);
        this._express.use(morgan('common'));
        this._express.use(compression());
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