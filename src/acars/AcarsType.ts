export class AcarsType {
    public static isDumpVdl2(json: any): boolean {
        return json['vdl2']?.['app']?.['name'] === 'dumpvdl2'
    }

    public static isDumpHfdl(json: any): boolean {
        return json['hfdl']?.['app']?.['name'] === 'dumphfdl'
    }

    public static isAcarsdec(json: any): boolean {
        return json['app']?.['name'] === 'acarsdec'
    }

    public static isJaero(json: any): boolean {
        return json['app']?.['name'] === 'JAERO'
    }

    public static isAcarsFrame(json: any): boolean {
        return !!(json['vdl2']?.['avlc']?.['acars'] || json['hfdl']?.['lpdu']?.['hfnpdu']?.['acars'] || json['isu']?.['acars'] || json['text'])
    }
}