var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./../../Script/lib/axios"], function (require, exports, axios_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    axios_1 = __importDefault(axios_1);
    var AxiosAdaptor = /** @class */ (function () {
        function AxiosAdaptor(initObj) {
            this.descroption = initObj.descroption;
            this.initObj = initObj;
            this.userRequest = axios_1.default.create({
                baseURL: this.initObj.URL || AxiosAdaptor.DEFAULT_URL
            });
        }
        AxiosAdaptor.prototype.getDescription = function () {
            return "[AxiosAdaptor] " + this.descroption + " " + this.initObj;
        };
        AxiosAdaptor.prototype.queryInfoBlob = function (param) {
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
        };
        AxiosAdaptor.prototype.queryInfo = function (param) {
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
        };
        // Axios 工具類別
        AxiosAdaptor.DEBUG = true;
        AxiosAdaptor.DEFAULT_METHOD = "GET";
        AxiosAdaptor.DEFAULT_TIMEOUT = 20000;
        AxiosAdaptor.DEFAULT_URL = "/";
        return AxiosAdaptor;
    }());
    exports.AxiosAdaptor = AxiosAdaptor;
    ;
});
