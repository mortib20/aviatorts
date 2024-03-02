import Logger from '../utils/Logger';
import * as fs from 'node:fs';
import * as path from 'node:path';

export type EndpointConfig = {
    protocol: 'tcp' | 'udp',
    address: string,
    port: number
}

export type RouterConfig = Map<string, EndpointConfig[]>;

export default class ConfigService {
    private readonly configName = 'router-config.json';
    private readonly configPath = path.join(process.cwd(), this.configName);
    private _currentConfig: RouterConfig;
    public set currentConfig(newConfig: RouterConfig) {
        this._currentConfig = newConfig;
        this.saveConfigFile(newConfig);
    }
    public get currentConfig() {
        return this._currentConfig;
    }

    private constructor(private logger: Logger) {
        this._currentConfig = this.readConfigFile();
    }

    private readConfigFile(): RouterConfig {
        if (!fs.existsSync(this.configPath)) {
            throw new Error(`${this.configName} not found`);
        }

        this.logger.info(`Reading ${this.configPath}`);

        const fileContent = fs.readFileSync(this.configPath, { encoding: 'utf-8' });
        return new Map(Object.entries(JSON.parse(fileContent)));
    }

    public saveConfigFile(config: RouterConfig) {
        this.logger.info(`Writing ${this.configPath}`);
        fs.writeFileSync(this.configPath, Buffer.from(JSON.stringify(config, null, 2)))
    }

    public static create() {
        return new ConfigService(Logger.create(this.name));
    }
}