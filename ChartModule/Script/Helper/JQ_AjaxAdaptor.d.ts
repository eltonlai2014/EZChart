export declare class JQ_AjaxAdaptor {
    static readonly DEBUG: boolean;
    static readonly DEFAULT_METHOD: string;
    static readonly DEFAULT_TIMEOUT: Number;
    descroption: string;
    initObj: any;
    constructor(initObj: any);
    getDescription(): string;
    queryInfoBlob(param: any, s_handle: any, e_handle: any): void;
    queryInfo(param: any, s_handle: any, e_handle: any): void;
}
