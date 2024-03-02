import UdpInput from '../io/UdpInput';
import Logger from '../utils/Logger';
import RouterOutputService from './RouterOutputService';
import {Express} from 'express';
import ConfigService from './ConfigService';
import Metrics from '../Metrics';
import BasicAcars from '../acars/BasicAcars';
import Websocket from '../Websocket';
import {AcarsType} from '../acars/AcarsType'

export default class RouterService {
    private input = UdpInput.create(21000);
    private routerConfigService = ConfigService.create();
    private routerOutputService = RouterOutputService.create(this.routerConfigService);

    private constructor(private express: Express, private websocketService: Websocket, private metricsService: Metrics, private logger: Logger) {
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
        let basicAcars: undefined | BasicAcars;

        if (AcarsType.isDumpVdl2(json)) {
            this.routerOutputService.write('vdl2', data);
            if (AcarsType.isAcarsFrame(json)) {
                basicAcars = BasicAcars.fromDumpVdl2(json);
            }
        }

        if (AcarsType.isDumpHfdl(json)) {
            this.routerOutputService.write('hfdl', data);
            if (AcarsType.isAcarsFrame(json)) {
                basicAcars = BasicAcars.fromDumpHfdl(json);
            }
        }

        if (AcarsType.isAcarsdec(json)) {
            this.routerOutputService.write('acars', data);
            if (AcarsType.isAcarsFrame(json)) {
                basicAcars = BasicAcars.fromAcarsdec(json);
            }
        }

        if (AcarsType.isJaero(json)) {
            this.routerOutputService.write('aero', data);
            if (AcarsType.isAcarsFrame(json)) {
                basicAcars = BasicAcars.fromJaero(json);
            }
        }

        if (basicAcars) {
            this.metricsService
                .receivedMessagesTotal
                .labels({
                    label: basicAcars.label,
                    type: basicAcars.type,
                    channel: basicAcars.channel,
                    icao: basicAcars.icao || '000000'
                }).inc()
            this.websocketService.send(basicAcars.type, basicAcars);
        }
    }

    public start() {
        this.logger.info('Starting');
        this.input.handleMessage((msg) => this.handleMessage(msg))
    }

    public static create(express: Express, websocketService: Websocket, metricsService: Metrics) {
        return new RouterService(express, websocketService, metricsService, Logger.create('RouterService'));
    }
}