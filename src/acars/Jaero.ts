export type Jaero = {
    station: string;
    t: {
        sec: number;
        usec: number;
    },
    app: {
        name: string;
        ver: string;
    },
    isu: {
        acars: {
            ack: string;
            blk_id: string;
            label: string;
            mode: string;
            msg_text: string;
            reg: string;
        },
        dst: {
            addr: string;
            type: string;
        },
        src: {
            addr: string;
            type: string;
        }
    }
}