define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JQ_AjaxAdaptor = /** @class */ (function () {
        function JQ_AjaxAdaptor(initObj) {
            this.descroption = initObj.descroption;
            this.initObj = initObj;
        }
        JQ_AjaxAdaptor.prototype.getDescription = function () {
            return "[JQ_AjaxAdaptor] " + this.descroption + " " + this.initObj;
        };
        JQ_AjaxAdaptor.prototype.queryInfoBlob = function (param, s_handle, e_handle) {
            // 加上timestamp避免cache
            if (param.URL) {
                // 加上timestamp避免cache
                var timestamp = new Date().getTime();
                param.URL = param.URL + "?timestamp=" + timestamp;
            }
            // 預設參數設定
            if (!param.type) {
                param.type = this.initObj.type || JQ_AjaxAdaptor.DEFAULT_METHOD;
            }
            if (!param.timeout) {
                param.timeout = this.initObj.timeout || JQ_AjaxAdaptor.DEFAULT_TIMEOUT;
            }
            if (JQ_AjaxAdaptor.DEBUG) {
                console.log(param);
            }
            // 使用jQuery不要用$，避免webpack有bug
            jQuery.ajax(param.URL, {
                type: param.type,
                timeout: param.timeout,
                cache: false,
                data: param.data,
                xhr: function () {
                    // JQuery3.0+ support ,Seems like the only way to get access to the xhr object
                    // xhr.onreadystatechange callback function is MUST for IE11, to prevent InvalidStateError
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        try {
                            xhr.responseType = 'arraybuffer';
                            //console.log('XHR state: ' + xhr.readyState);
                        }
                        catch (e) {
                            //console.log('XHR state: ' + xhr.readyState + ' ==> exception: ' + e);
                        }
                    };
                    return xhr;
                },
                success: s_handle,
                error: e_handle
            });
        };
        JQ_AjaxAdaptor.prototype.queryInfo = function (param, s_handle, e_handle) {
            if (param.URL) {
                // 加上timestamp避免cache
                var timestamp = new Date().getTime();
                param.URL = param.URL + "?timestamp=" + timestamp;
            }
            // 預設參數設定
            if (!param.type) {
                param.type = this.initObj.type || JQ_AjaxAdaptor.DEFAULT_METHOD;
            }
            if (!param.timeout) {
                param.timeout = this.initObj.timeout || JQ_AjaxAdaptor.DEFAULT_TIMEOUT;
            }
            if (JQ_AjaxAdaptor.DEBUG) {
                console.log(param);
            }
            jQuery.ajax(param.URL, {
                type: param.type,
                timeout: param.timeout,
                cache: false,
                data: param.data,
                success: s_handle,
                error: e_handle
            });
        };
        // JQUERY AJAX 工具類別
        JQ_AjaxAdaptor.DEBUG = true;
        JQ_AjaxAdaptor.DEFAULT_METHOD = "GET";
        JQ_AjaxAdaptor.DEFAULT_TIMEOUT = 20000;
        return JQ_AjaxAdaptor;
    }());
    exports.JQ_AjaxAdaptor = JQ_AjaxAdaptor;
});
