import {EndpointConfig} from '../router-service/ConfigService';

export type OutputStatus = {
    endpoint: EndpointConfig;
    connected: boolean | null;
}

export default interface IOutput {
    send(data: Buffer): void;
    status(): OutputStatus;
}