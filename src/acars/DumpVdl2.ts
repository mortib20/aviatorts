export type DumpVdl2 = {
    vdl2: {
        station: string,
        app: {
            name: string
            ver: string
        },
        t: {
            sec: number
            usec: number
        }
        freq: number
        burst_len_octets: number
        hdr_bits_fixed: number
        octets_corrected_by_fec: number
        idx: number
        sig_level: number
        noise_level: number
        freq_skew: number
        avlc: {
            src: {
                addr: string
                type: string
                status: string
            }
            dst: {
                addr: string
                type: string
            }
            cr: string
            frame_type: string
            rseq: number
            sseq: number
            poll: boolean
            acars: {
                err: boolean
                crc_ok: boolean
                more: boolean
                reg: string
                mode: string
                label: string
                blk_id: string
                ack: string
                flight: string
                msg_num: string
                msg_num_seq: string
                msg_text: string
            }
        }
    }
}