import Logger from '../utils/Logger';
import UdpOutput from '../io/UdpOutput';
import RouterConfigService, {RouterConfig} from './RouterConfigService';
import TcpOutput from '../io/TcpOutput';
import IOutput from '../io/IOutput';

export type Outputs = Map<string, IOutput[]>;

export default class RouterOutputService {
    private outputs: Outputs;

    private constructor(routerConfigService: RouterConfigService, private logger: Logger) {
        this.outputs = this.routerConfigToOutputs(routerConfigService.currentConfig);
    }

    private routerConfigToOutputs(routerConfig: RouterConfig): Outputs {
        const outputs = new Map();
        for (const key of routerConfig.keys()) {
            outputs.set(key, routerConfig.get(key)?.map(value => value.protocol === 'tcp' ? TcpOutput.create(value) : UdpOutput.create(value)));
        }
        return outputs;
    }

    public status() {
        const status: any = {};
        for (const key of this.outputs.keys()) {
            status[key] = this.outputs.get(key)?.map(s => s.status());
        }
        return status;
    }

    public write(type: string, data: Buffer) {
        this.outputs.get(type)?.forEach(o => o.send(data));
    }

    public static create(routerConfigService: RouterConfigService,) {
        return new RouterOutputService(routerConfigService, Logger.create(this.name));
    }
}