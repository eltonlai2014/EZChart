define(["require", "exports", "./Helper/index"], function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StockQuery = /** @class */ (function () {
        function StockQuery(initObj) {
            this.initObj = initObj;
            this.aJQ_AjaxAdaptor = new index_1.JQ_AjaxAdaptor(initObj);
        }
        StockQuery.prototype.queryInfo = function (param, s_handle, e_handle) {
            this.aJQ_AjaxAdaptor.queryInfo(param, s_handle, e_handle);
        };
        StockQuery.prototype.queryInfoBlob = function (param, s_handle, e_handle) {
            this.aJQ_AjaxAdaptor.queryInfoBlob(param, s_handle, e_handle);
        };
        StockQuery.prototype.queryInfoBlob_Unzip = function (param, s_handle, e_handle) {
            var _this = this;
            this.aJQ_AjaxAdaptor.queryInfoBlob(param, function (data) {
                // compress mode =================
                // response is unsigned 8 bit integer
                var responseArray = new Uint8Array(data);
                //console.log("data.length=" + responseArray.length);
                // 這行ts不會做任何處理
                var deCompressBuffer = new Zlib.Gunzip(responseArray).decompress(); // 將Bytes解壓縮 
                //console.log("deCompressBuffer.length=" + deCompressBuffer.length);
                var aObj = JSON.parse(_this.getString(deCompressBuffer));
                if (s_handle instanceof Function) {
                    s_handle(aObj);
                }
            }, e_handle);
        };
        // Uint8Array轉字串2
        StockQuery.prototype.getString = function (uintArray) {
            var ret = "";
            for (var i = 0, n = uintArray.length; i < n; i++) {
                ret += String.fromCharCode(uintArray[i]);
            }
            ret = decodeURIComponent(escape(ret));
            return ret;
        };
        return StockQuery;
    }());
    exports.StockQuery = StockQuery;
    ;
});
