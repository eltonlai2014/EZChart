// import * as AJAX_Helper from "./Helper/index";
import { JQ_AjaxAdaptor } from "./Helper/index";

export class StockQuery {
    initObj: any;
    aJQ_AjaxAdaptor: JQ_AjaxAdaptor;
    constructor(initObj: any) {
        this.initObj = initObj;
        this.aJQ_AjaxAdaptor = new JQ_AjaxAdaptor(initObj);
    }

    public queryInfo(param: any, s_handle: any, e_handle: any): void {
        this.aJQ_AjaxAdaptor.queryInfo(param, s_handle, e_handle);
    }

    public queryInfoBlob(param: any, s_handle: any, e_handle: any): void {
        this.aJQ_AjaxAdaptor.queryInfoBlob(param, s_handle, e_handle);
    }

    public queryInfoBlob_Unzip(param: any, s_handle: any, e_handle: any): void {
        this.aJQ_AjaxAdaptor.queryInfoBlob(param,
            (data: any) => {
                // compress mode =================
                // response is unsigned 8 bit integer
                let responseArray = new Uint8Array(data);
                //console.log("data.length=" + responseArray.length);
                // 這行ts不會做任何處理
                let deCompressBuffer = new Zlib.Gunzip(responseArray).decompress(); // 將Bytes解壓縮 
                //console.log("deCompressBuffer.length=" + deCompressBuffer.length);
                let aObj = JSON.parse(this.getString(deCompressBuffer));
                if (s_handle instanceof Function) {
                    s_handle(aObj);
                }
            },
            e_handle
        );
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
}


