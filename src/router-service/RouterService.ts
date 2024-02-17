import UdpInput from '../io/UdpInput';
import Logger from '../utils/Logger';
import RouterOutputService from './RouterOutputService';
import {Express} from 'express';
import RouterConfigService from './RouterConfigService';

export default class RouterService {
    private input = UdpInput.create(21000);
    private routerConfigService = RouterConfigService.create();
    private routerOutputService = RouterOutputService.create(this.routerConfigService);

    private constructor(private express: Express, private logger: Logger) {
        this.setupExpress();
    }

    private setupExpress() {
        this.express.get('/router/config', (_req, res) => {
            res.send(this.currentConfig());
        })

        this.express.get('/router/status', (_req, res) => {
            res.send(this.routerOutputService.status())
        })
    }

    private currentConfig() {
        let currentConfig: any = {};
        for (const key of this.routerConfigService.currentConfig.keys()) {
            currentConfig[key] = this.routerConfigService.currentConfig.get(key);
        }
        return currentConfig;
    }

    private handleMessage(data: Buffer) {
        const json = JSON.parse(data.toString());
        if (RouterService.isDumpVdl2(json)) {
            this.routerOutputService.write('vdl2', data);
        }

        if (RouterService.isDumpHfdl(json)) {
            this.routerOutputService.write('hfdl', data);
        }

        if (RouterService.isAcarsdec(json)) {
            this.routerOutputService.write('acars', data);
        }

        if (RouterService.isJaero(json)) {
            this.routerOutputService.write('aero', data);
        }
    }

    public start() {
        this.logger.info('Starting');
        this.input.handleMessage((msg) => this.handleMessage(msg))
    }

    private static isDumpVdl2(json: any): boolean {
        return json['vdl2']?.['app']?.['name'] === 'dumpvdl2'
    }


    private static isDumpHfdl(json: any): boolean {
        return json['hfdl']?.['app']?.['name'] === 'dumphfdl'
    }

    private static isAcarsdec(json: any): boolean {
        return json['app']?.['name'] === 'acarsdec'
    }

    private static isJaero(json: any): boolean {
        return json['app']?.['name'] === 'JAERO'
    }

    private static isAcarsFrame(json: any): boolean {
        return !!(json['vdl2']?.['avlc']?.['acars'] || json['hfdl']?.['lpdu']?.['hfnpdu']?.['acars'] || json['isu']?.['acars'] || json['text'])
    }

    public static create(express: Express) {
        return new RouterService(express, Logger.create('RouterService'));
    }
}