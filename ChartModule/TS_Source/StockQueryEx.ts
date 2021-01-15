
import { AxiosAdaptor } from "./Helper/AxiosAdaptor";

declare let Zlib: any; // 這行ts不會做任何處理

export class StockQueryEx {
    initObj: any;
    aAxiosAdaptor: AxiosAdaptor;
    constructor(initObj: any) {
        this.initObj = initObj;
        this.aAxiosAdaptor = new AxiosAdaptor(initObj);
    }

    public queryInfo(param: any, s_handle: any, e_handle: any): void {
        // Axios Promise 包裝為 callback function
        this.aAxiosAdaptor.queryInfo(param)
            .then((res: any) => {
                if (s_handle instanceof Function) {
                    s_handle(res.data);
                }
            })
            .catch(this.errorHandle(e_handle))
            .finally(function () {
                // 不論失敗成功皆會執行 
                // console.log("finally ...");
            })

    }

    private errorHandle(e_handle: any): any {
        return (error: any) => {
            if (e_handle instanceof Function) {
                let errStatus = {};
                let errMsg = {};
                if (error.response) {
                    // Request made and server responded
                    errStatus = error.response;
                }
                else if (error.request) {
                    errStatus = error.request;
                }
                if (error.message) {
                    // Something happened in setting up the request that triggered an Error
                    errMsg = error.message;
                }
                e_handle(errStatus, errMsg);
            }
        };
    }

    public queryInfoBlob(param: any, s_handle: any, e_handle: any): void {
        this.aAxiosAdaptor.queryInfoBlob(param)
            .then((res: any) => {
                if (s_handle instanceof Function) {
                    s_handle(res.data);
                }
            })
            .catch(this.errorHandle(e_handle))
            .finally(function () {
                // 不論失敗成功皆會執行 
                // console.log("finally ...");
            })
    }

    public queryInfoBlob_Unzip(param: any, s_handle: any, e_handle: any): void {
        // Axios Promise 包裝為 callback function
        this.aAxiosAdaptor.queryInfoBlob(param)
            .then((res: any) => {
                // compress mode =================
                // response is unsigned 8 bit integer
                let responseArray = new Uint8Array(res.data);
                //console.log("data.length=" + responseArray.length);
                // 這行ts不會做任何處理
                let deCompressBuffer = new Zlib.Gunzip(responseArray).decompress(); // 將Bytes解壓縮 
                //console.log("deCompressBuffer.length=" + deCompressBuffer.length);
                let aObj = JSON.parse(this.getString(deCompressBuffer));
                //console.log(aObj);
                if (s_handle instanceof Function) {
                    s_handle(aObj);
                }

            })
            .catch(this.errorHandle(e_handle))
            .finally(function () {
                // 不論失敗成功皆會執行 
                // console.log("finally ...");
            })

    }
    
    // Uint8Array轉字串2
    private getString(uintArray: any) {
        let ret = "";
        for (let i = 0, n = uintArray.length; i < n; i++) {
            ret += String.fromCharCode(uintArray[i]);
        }
        ret = decodeURIComponent(escape(ret));
        return ret;
    }

};


