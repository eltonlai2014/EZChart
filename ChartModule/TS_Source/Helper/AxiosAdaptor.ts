import axios, { AxiosRequestConfig, AxiosPromise } from './../../Script/lib/axios';

export class AxiosAdaptor {
    // Axios 工具類別
    static readonly DEBUG = true;
    static readonly DEFAULT_METHOD = "GET";
    static readonly DEFAULT_TIMEOUT = 20000;
    static readonly DEFAULT_URL = "/";
    descroption: string;
    initObj: any;
    userRequest: any;
    constructor(initObj: any) {
        this.descroption = initObj.descroption;
        this.initObj = initObj;
        this.userRequest = axios.create({
            baseURL: this.initObj.URL || AxiosAdaptor.DEFAULT_URL
        });
    }

    public getDescription(): string {
        return "[AxiosAdaptor] " + this.descroption + " " + this.initObj;
    }

    public queryInfoBlob(param: any) {
        // 加上timestamp避免cache
        if (param.URL) {
            // 加上timestamp避免cache
            var timestamp = new Date().getTime();
            param.URL = param.URL + "?timestamp=" + timestamp;
        }
        // 預設參數設定
        if (!param.type) {
            param.type = this.initObj.type || AxiosAdaptor.DEFAULT_METHOD;
        }
        if (!param.timeout) {
            param.timeout = this.initObj.timeout || AxiosAdaptor.DEFAULT_TIMEOUT;
        }
        if (AxiosAdaptor.DEBUG) {
            console.log(param);
        }
        if (param.type.toUpperCase() === "POST") {
            return this.userRequest.post(param.URL, null, { params: param.data, responseType: 'arraybuffer' });
        }
        else if (param.type.toUpperCase() === "GET") {
            return this.userRequest.get(param.URL, null, { params: param.data, responseType: 'arraybuffer' });
        }

    }

    public queryInfo(param: any) {
        if (param.URL) {
            // 加上timestamp避免cache
            var timestamp = new Date().getTime();
            param.URL = param.URL + "?timestamp=" + timestamp;
        }
        // 預設參數設定
        if (!param.type) {
            param.type = this.initObj.type || AxiosAdaptor.DEFAULT_METHOD;
        }
        if (!param.timeout) {
            param.timeout = this.initObj.timeout || AxiosAdaptor.DEFAULT_TIMEOUT;
        }
        if (AxiosAdaptor.DEBUG) {
            console.log(param);
        }
        if (param.type.toUpperCase() == "POST") {
            return this.userRequest.post(param.URL, null, { 'params': param.data, 'responseType': 'application/json' });
        }
        else if (param.type.toUpperCase() == "GET") {
            return this.userRequest.get(param.URL, null, { 'params': param.data, 'responseType': 'application/json' });
        }
    }

};

