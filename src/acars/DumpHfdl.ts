export type DumpHfdl = {
    hfdl: {
        app: {
            name: string
            ver: string
        }
        bit_rate: number
        freq: number
        freq_skew: number
        lpdu: {
            dst: {
                id: number
                type: string
            }
            err: boolean
            hfnpdu: {
                acars: {
                    ack: string
                    blk_id: string
                    crc_ok: boolean
                    err: boolean
                    flight: string
                    label: string
                    'media-adv': {
                        current_link: {
                            code: string
                            descr: string
                            established: boolean
                            time: {
                                hour: number
                                min: number
                                sec: number
                            }
                        }
                        err: boolean
                        links_avail: {
                            code: string
                            descr: string
                        }[]
                        version: number
                    }
                    mode: string
                    more: boolean
                    msg_num: string
                    msg_num_seq: string
                    msg_text: string
                    reg: string
                }
                err: boolean
                type: {
                    id: number
                    name: string
                }
            }
            src: {
                ac_info: {
                    icao?: string
                }
                id: number
                type: string
            }
            type: {
                id: number
                name: string
            }
        }
        noise_level: number
        sig_level: number
        slot: string
        station: string
        t: {
            sec: number
            usec: number
        }
    }
}