import * as p from 'prom-client'
import { Express } from "express";

export default class MetricsService {
    private readonly registry: p.Registry = new p.Registry();
    public receivedMessagesTotal = new p.Counter({
        name: 'received_messages_total',
        help: 'Total received messages',
        labelNames: ['label', 'flight_number', 'flight', 'icao', 'channel', 'type'],
    })

    private constructor(private readonly express: Express) {
        this.registry.setDefaultLabels({ app: 'aviator' })
        this.registry.registerMetric(this.receivedMessagesTotal)

        this.setupExpress();
    }

    private setupExpress() {
        this.express.get('/metrics', (req, res) => {
            (async () => {
                res.setHeader('Content-Type', this.registry.contentType)
                res.end(await this.registry.metrics())
            })();
        })
    }

    public static create(express: Express) {
        return new MetricsService(express)
    }
}