export default class Logger {
    private constructor(private name: string) {
    }

    public info(message: any) {
        console.log(this.getMessage('\x1b[32minfo\x1b', message))
    }

    public error(message: any) {
        console.error(this.getMessage('\x1b[31merror\x1b', message))
    }

    private getMessage(type: string, message: any) {
        return `[${Logger.getISODate()}] ${type}[0m: ${this.name} ➡️ ${message}`
    }

    private static getISODate() {
        return new Date().toISOString()
    }

    public static log(message: any) {
        console.log(`[${this.getISODate()}]`, message)
    }

    public static create(name: string) {
        return new Logger(name);
    }
}