define(["require", "exports", "./Helper/AxiosAdaptor"], function (require, exports, AxiosAdaptor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StockQueryEx = /** @class */ (function () {
        function StockQueryEx(initObj) {
            this.initObj = initObj;
            this.aAxiosAdaptor = new AxiosAdaptor_1.AxiosAdaptor(initObj);
        }
        StockQueryEx.prototype.queryInfo = function (param, s_handle, e_handle) {
            // Axios Promise 包裝為 callback function
            this.aAxiosAdaptor.queryInfo(param)
                .then(function (res) {
                if (s_handle instanceof Function) {
                    s_handle(res.data);
                }
            })
                .catch(this.errorHandle(e_handle))
                .finally(function () {
                // 不論失敗成功皆會執行 
                // console.log("finally ...");
            });
        };
        StockQueryEx.prototype.errorHandle = function (e_handle) {
            return function (error) {
                if (e_handle instanceof Function) {
                    var errStatus = {};
                    var errMsg = {};
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
        };
        StockQueryEx.prototype.queryInfoBlob = function (param, s_handle, e_handle) {
            this.aAxiosAdaptor.queryInfoBlob(param)
                .then(function (res) {
                if (s_handle instanceof Function) {
                    s_handle(res.data);
                }
            })
                .catch(this.errorHandle(e_handle))
                .finally(function () {
                // 不論失敗成功皆會執行 
                // console.log("finally ...");
            });
        };
        StockQueryEx.prototype.queryInfoBlob_Unzip = function (param, s_handle, e_handle) {
            var _this = this;
            // Axios Promise 包裝為 callback function
            this.aAxiosAdaptor.queryInfoBlob(param)
                .then(function (res) {
                // compress mode =================
                // response is unsigned 8 bit integer
                var responseArray = new Uint8Array(res.data);
                //console.log("data.length=" + responseArray.length);
                // 這行ts不會做任何處理
                var deCompressBuffer = new Zlib.Gunzip(responseArray).decompress(); // 將Bytes解壓縮 
                //console.log("deCompressBuffer.length=" + deCompressBuffer.length);
                var aObj = JSON.parse(_this.getString(deCompressBuffer));
                //console.log(aObj);
                if (s_handle instanceof Function) {
                    s_handle(aObj);
                }
            })
                .catch(this.errorHandle(e_handle))
                .finally(function () {
                // 不論失敗成功皆會執行 
                // console.log("finally ...");
            });
        };
        // Uint8Array轉字串2
        StockQueryEx.prototype.getString = function (uintArray) {
            var ret = "";
            for (var i = 0, n = uintArray.length; i < n; i++) {
                ret += String.fromCharCode(uintArray[i]);
            }
            ret = decodeURIComponent(escape(ret));
            return ret;
        };
        return StockQueryEx;
    }());
    exports.StockQueryEx = StockQueryEx;
    ;
});
