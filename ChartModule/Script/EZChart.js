var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("Helper/JQ_AjaxAdaptor", ["require", "exports", "jquery"], function (require, exports, jquery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    jquery_1 = __importDefault(jquery_1);
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
            jquery_1.default.ajax(param.URL, {
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
            jquery_1.default.ajax(param.URL, {
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
define("Helper/BaseChart", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // 繪圖基礎類別，包含一些共用方法
    var BaseChart = /** @class */ (function () {
        function BaseChart(initObj) {
            var _this_1 = this;
            this.measureSize = function () {
            };
            // 前景繪圖，子類別若有需要則overwrite
            this.drawFrontContext = function (mouseEvent) {
            };
            this.mouseMove = function (evt) {
                _this_1.mouseHandle(evt);
            };
            this.mouseDown = function (evt) {
                _this_1.mouseHandle(evt);
            };
            this.mouseOut = function (evt) {
                _this_1.mouseHandle(evt);
            };
            this.mouseHandle = function (evt) {
                // 留給子類別處理
            };
            this.getMousePos = function (evt) {
                var rect = _this_1.mClientRect;
                var aPos = {
                    x: Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * _this_1.cWidth),
                    y: Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * _this_1.cHeight)
                };
                return aPos;
            };
            this.hexToRgb = function (hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : {};
            };
            this.addComma = function (x) {
                var parts = x.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return parts.join(".");
            };
            this.initObj = initObj;
            var ComponentId = this.getParamValue(initObj.ComponentId, "BaseChart");
            this.mFontType = this.getParamValue(initObj.FontType, "Arial, sans-serif");
            this.mFontSize = this.getParamValue(initObj.FontSize, 26); // 字型大小　　　　　　
            this.mBgColor = this.getParamValue(initObj.BgColor, "#FFFFFF"); // 背景顏色
            this.mChartBgColor = this.getParamValue(initObj.ChartBgColor, "#FFFFFF"); // 圖型背景顏色
            this.mUseClientHeight = this.getParamValue(initObj.UseClientHeight, false);
            // 基本設定 ====================================================================
            // 取得Component寬度+高度
            // "strictNullChecks": true
            // assert aComponent is not null
            var aComponent = document.querySelector("#" + ComponentId);
            this.mClientRect = aComponent.getBoundingClientRect();
            this.cHeight = this.mClientRect.height;
            this.cWidth = this.mClientRect.width;
            if (this.mUseClientHeight) {
                var xComponent = document.getElementById(ComponentId);
                // "strictNullChecks": true
                // assert aComponent is not null,need to write -> xComponent!.clientHeight 
                this.cHeight = xComponent.clientHeight;
                this.cWidth = xComponent.clientWidth;
                //console.log("UseClientHeight=" + this.UseClientHeight + " " + this.cHeight + " " + this.cWidth);
            }
            // 產生mCanvas與mBgCanvas
            this.mCanvas = document.createElement('canvas');
            this.mCanvas.width = this.cWidth;
            this.mCanvas.height = this.cHeight;
            this.mContext = this.mCanvas.getContext('2d');
            this.mBgCanvas = document.createElement('canvas');
            this.mBgCanvas.width = this.cWidth;
            this.mBgCanvas.height = this.cHeight;
            this.mBgContext = this.mBgCanvas.getContext('2d');
            // 避免antialias(應該沒效)
            // this.mContext.imageSmoothingEnabled = false;
            // this.mBgContext.imageSmoothingEnabled = false;
            // 基本設定 End =================================================================        
        }
        // 搭配建構子 initObj: any，取參數的方法
        BaseChart.prototype.getParamValue = function (aValue, def) {
            if (typeof aValue === "undefined" || aValue === undefined || aValue === null) {
                return def;
            }
            return aValue;
        };
        // 重新繪製元件 [delay] setTimeout的毫秒數 ex:delay=1000為1秒 , 執行完畢呼叫callback function
        BaseChart.prototype.repaint = function (delay, callback) {
            delay = delay || 0;
            //console.log("repaint " + delay + " callback=" + callback);
            var _this = this;
            try {
                setTimeout(function () {
                    _this.drawMain();
                    _this.drawBgToContext();
                    if (callback instanceof Function) {
                        callback("repaint(" + delay + ") finish ");
                    }
                }, delay);
            }
            catch (err) {
                console.log("repaint(" + delay + ") error, " + err.message);
            }
        };
        BaseChart.prototype.drawBgToContext = function (mouseEvent) {
            // 將背景層貼到前景
            this.mContext.clearRect(0, 0, this.cWidth, this.cHeight);
            this.mContext.drawImage(this.mBgCanvas, 0, 0);
            // 前景繪圖，搭配mouseEvent
            this.drawFrontContext(mouseEvent);
        };
        //  字串池 
        //  let aText: TextObj = this.MeasureText("00000000", "normal", this.AxisFont, this.AxisFontSize);
        BaseChart.prototype.MeasureText = function (text, bold, font, size) {
            // This global variable is used to cache repeated calls with the same arguments
            var aKey = text + ':' + bold + ':' + font + ':' + size;
            if (typeof (BaseChart.Text_Chche) == 'object' && BaseChart.Text_Chche[aKey]) {
                return BaseChart.Text_Chche[aKey];
            }
            var aWidth = 0;
            if (this.mBgContext) {
                this.mBgContext.font = size + "pt " + font;
                aWidth = this.mBgContext.measureText(text).width;
            }
            // 字串高度取法(新增一個不可見標籤，取offsetHeight，刪除，加入快取)
            var div = document.createElement("MyDIV");
            div.innerHTML = text;
            div.style.position = 'absolute';
            div.style.top = '-100px';
            div.style.left = '-100px';
            div.style.fontFamily = font;
            div.style.fontWeight = bold;
            div.style.fontSize = size + 'pt';
            document.body.appendChild(div);
            var aText = new TextObj(aWidth, Math.round(div.offsetHeight));
            document.body.removeChild(div);
            // Add the sizes to the cache as adding DOM elements is costly and can cause slow downs
            BaseChart.Text_Chche[aKey] = aText;
            return aText;
        };
        // 圓角矩形
        BaseChart.prototype.drawRoundRect = function (ctx, x, y, width, height, radius, fill, stroke, lineWidth) {
            if (typeof stroke === "undefined") {
                stroke = true;
            }
            if (typeof fill === "undefined") {
                fill = false;
            }
            if (typeof radius === "undefined") {
                radius = 5;
            }
            lineWidth = lineWidth || 1.2;
            //x = Math.round(x);
            //y = Math.round(y);
            ctx.save();
            ctx.translate(0.5, 0.5);
            ctx.beginPath();
            // 畫圓角
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.lineWidth = lineWidth;
            ctx.closePath();
            if (stroke) {
                ctx.stroke();
            }
            if (fill) {
                ctx.fill();
            }
            ctx.restore();
        };
        // 虛線
        BaseChart.prototype.dashedLineTo = function (ctx, fromX, fromY, toX, toY, pattern, lineColor) {
            // default interval distance -> 5px
            if (typeof pattern === "undefined") {
                pattern = 5;
            }
            lineColor = lineColor || '#FFFFFF';
            // 避免畫線時產生antialias，save()->translate()->restore()
            ctx.save();
            ctx.translate(0.5, 0.5);
            // calculate the delta x and delta y
            var dx = (toX - fromX);
            var dy = (toY - fromY);
            var distance = Math.floor(Math.sqrt(dx * dx + dy * dy));
            var dashlineInteveral = (pattern <= 0) ? distance : (distance / pattern);
            var deltay = (dy / distance) * pattern;
            var deltax = (dx / distance) * pattern;
            // draw dash line
            ctx.beginPath();
            for (var dl = 0; dl < dashlineInteveral; dl++) {
                if (dl % 2) {
                    ctx.lineTo(Math.round(fromX + dl * deltax), Math.round(fromY + dl * deltay));
                }
                else {
                    ctx.moveTo(Math.round(fromX + dl * deltax), Math.round(fromY + dl * deltay));
                }
            }
            //ctx.lineWidth = 1;
            ctx.strokeStyle = lineColor;
            ctx.stroke();
            ctx.restore();
        };
        // 直線，避免antialias
        BaseChart.prototype.clearLineTo = function (ctx, fromX, fromY, toX, toY, lineColor, lineWidth) {
            // default lineWidth -> 1px lineColor -> #FFFFFF
            lineWidth = lineWidth || 1;
            lineColor = lineColor || '#000000';
            // 避免畫線時產生antialias，save()->translate()->restore()
            ctx.save();
            ctx.translate(0.5, 0.5);
            // draw line
            fromX = Math.round(fromX);
            fromY = Math.round(fromY);
            toX = Math.round(toX);
            toY = Math.round(toY);
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = lineColor;
            ctx.stroke();
            ctx.restore();
        };
        // 任意線段，避免antialias，用矩形模擬
        /*
        public drawLineNoAliasing(ctx: CanvasRenderingContext2D, sx: number, sy: number, tx: number, ty: number, lineColor?: string): void {
            lineColor = lineColor || '#FFFFFF';
            let dist = Syspower.Util.DBP(sx, sy, tx, ty); // length of line
            let ang = Syspower.Util.getAngle(tx - sx, ty - sy); // angle of line
            ctx.save();
            ctx.fillStyle = lineColor;
            for (let i = 0; i < dist; i++) {
                // for each point along the line
                ctx.fillRect(Math.round(sx + Math.cos(ang) * i), // round for perfect pixels
                    Math.round(sy + Math.sin(ang) * i), // thus no aliasing
                    1, 1); // fill in one pixel, 1x1
            }
            ctx.restore();
        }
        */
        // 畫清晰矩形 !!注意自訂方法名稱不要取為跟物件既有的名子重覆，否則效能會很差 
        // !! JS NEVER TRY THIS !! : CanvasRenderingContext2D.prototype.drawRect
        BaseChart.prototype.drawRectEx = function (ctx, x, y, width, height, color, lineWidth) {
            this.clearLineTo(ctx, x, y, x + width, y, color, lineWidth);
            this.clearLineTo(ctx, x + width, y, x + width, y + height, color, lineWidth);
            this.clearLineTo(ctx, x + width, y + height, x, y + height, color, lineWidth);
            this.clearLineTo(ctx, x, y + height, x, y, color, lineWidth);
        };
        // !! JS NEVER DO THIS !! : CanvasRenderingContext2D.prototype.fillRect
        BaseChart.prototype.fillRectEx = function (ctx, x, y, width, height, color) {
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.fillStyle = color;
            ctx.fill();
        };
        BaseChart.prototype.drawString = function (ctx, txt, x, y, size, font, color, align, base) {
            // 畫字串
            color = color || "#000000";
            base = base || "bottom";
            align = align || "left";
            font = font || "Arial";
            ctx.save();
            ctx.fillStyle = color;
            ctx.font = size + "pt " + font;
            ctx.textAlign = align;
            ctx.textBaseline = base;
            if (size <= 8) {
                //因為chrome字型指定9px就不能更小，故用ctx.scale縮放處理 (x,y,size 先放大兩倍，再scale 0.5) 
                //放大前先紀錄
                size *= 2;
                x *= 2;
                y *= 2;
                ctx.font = size + "pt " + font;
                ctx.scale(0.5, 0.5);
                ctx.fillText(txt, x, y);
            }
            else {
                ctx.fillText(txt, x, y);
            }
            var wordWidth = ctx.measureText(txt).width;
            //回復
            ctx.restore();
            return wordWidth;
        };
        BaseChart.prototype.drawCircle = function (ctx, x, y, radius, color) {
            // 畫圓型
            ctx.save();
            color = color || "#000000";
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        };
        BaseChart.prototype.getPrettyAxis = function (dMin, dMax, aDiv) {
            if (aDiv == undefined) { // 幾等分，預設5等分
                aDiv = 5;
            }
            var ret = []; // 回傳陣列
            // 最大最小值乘數 dMax-(dMax+dMin)/2 = dMax/2-dMin/2
            var factor = 0.05;
            var aRange = Math.abs(dMax - dMin) * factor;
            //console.log("aRange="+aRange+" dMax*factor="+(dMax*factor));
            if (dMin < 0) {
                dMin = dMin - aRange;
            }
            else if (dMin > 0) {
                dMin = Math.max(dMin - aRange, 0);
            }
            if (dMax > 0) {
                dMax = dMax + aRange;
            }
            else if (dMax < 0) {
                dMax = Math.min(dMax + aRange, 0);
            }
            var diff = (dMax - dMin) / aDiv;
            //console.log("dMin="+dMin+" dMax="+dMax+" diff="+diff);
            // 計算等分數值
            var segment = -1;
            var startValue = 0;
            for (var i = 0; i < BaseChart.Axis_Default.length; i++) {
                if (diff <= BaseChart.Axis_Default[i]) {
                    startValue = Math.floor(dMin / BaseChart.Axis_Default[i]);
                    //console.log("startValue="+startValue+" Axis_5["+i+"]="+this.Axis_5[i]);
                    if ((startValue * BaseChart.Axis_Default[i] + BaseChart.Axis_Default[i] * (aDiv - 1)) >= dMax) {
                        segment = BaseChart.Axis_Default[i];
                        break;
                    }
                }
            }
            // 如果Array找不到最適值，例外處理
            if (segment == -1) {
                // 用最大值取Log，四捨五入乘上10來當單位
                var foo = Math.round(Math.max(Math.abs(dMin), Math.abs(dMax))).toString();
                //console.log("foo="+((foo.length)));  
                var foo2 = Math.pow(10, (foo.length - 1));
                //console.log("Math.pow="+foo2);  
                var Axis_foo = [foo2, foo2 * 1.2, foo2 * 1.5, foo2 * 2, foo2 * 2.5, foo2 * 3, foo2 * 4, foo2 * 5, foo2 * 6, foo2 * 7, foo2 * 8, foo2 * 9];
                startValue = 0;
                for (var i = 0; i < Axis_foo.length; i++) {
                    if (diff <= Axis_foo[i]) {
                        startValue = Math.floor(dMin / Axis_foo[i]);
                        //console.log("startValue="+startValue+" Axis_foo["+i+"]="+Axis_foo[i]);
                        if ((startValue * Axis_foo[i] + Axis_foo[i] * (aDiv - 1)) > dMax) {
                            segment = Axis_foo[i];
                            break;
                        }
                    }
                }
                //console.log("segment="+segment);  	
            }
            for (var i = startValue; i < startValue + aDiv; i++) {
                ret.push(i * segment);
            }
            return ret;
        };
        BaseChart.prototype.log10 = function (val) {
            return Math.log(val) / Math.LN10;
        };
        BaseChart.Text_Chche = {}; // 字串池
        BaseChart.Axis_Default = [
            0.1, 0.2, 0.25, 0.5, 0.8,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
            150, 200, 250, 300, 350, 400, 450, 500, 800, 1000,
            1200, 1250, 1500, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
            12000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
            120000, 150000, 200000, 250000, 500000, 1000000
        ];
        return BaseChart;
    }());
    exports.BaseChart = BaseChart;
    var TextObj = /** @class */ (function () {
        function TextObj(Width, Height) {
            this.Width = Width;
            this.Height = Height;
        }
        return TextObj;
    }());
    exports.TextObj = TextObj;
    var MyMouseEvent = /** @class */ (function () {
        function MyMouseEvent(XPos, YPos, EventType) {
            this.XPos = XPos;
            this.YPos = YPos;
            this.EventType = EventType;
        }
        return MyMouseEvent;
    }());
    exports.MyMouseEvent = MyMouseEvent;
});
define("Helper/HashMap", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HashMap = /** @class */ (function () {
        function HashMap() {
            // Map Size
            this.size = 0;
            // Map Object
            this.entry = {};
        }
        // 存
        HashMap.prototype.put = function (key, value) {
            if (!this.containsKey(key)) {
                this.size++;
            }
            this.entry[key] = value;
        };
        // 取
        HashMap.prototype.get = function (key) {
            if (this.containsKey(key)) {
                return this.entry[key];
            }
            else {
                return null;
            }
        };
        // 刪除
        HashMap.prototype.remove = function (key) {
            if (delete this.entry[key]) {
                this.size--;
            }
        };
        // 是否包含Key
        HashMap.prototype.containsKey = function (key) {
            return (key in this.entry);
        };
        // 是否包含Value
        HashMap.prototype.containsValue = function (value) {
            for (var prop in this.entry) {
                if (this.entry[prop] == value) {
                    return true;
                }
            }
            return false;
        };
        // 所有Value
        HashMap.prototype.values = function () {
            var values = [];
            for (var prop in this.entry) {
                values.push(this.entry[prop]);
            }
            return values;
        };
        // 所有Key
        HashMap.prototype.keys = function () {
            var keys = [];
            for (var prop in this.entry) {
                keys.push(prop);
            }
            return keys;
        };
        HashMap.prototype.getSize = function () {
            return this.size;
        };
        // 清Map
        HashMap.prototype.clear = function () {
            this.size = 0;
            this.entry = {};
            return this.size;
        };
        return HashMap;
    }());
    exports.HashMap = HashMap;
});
define("Helper/index", ["require", "exports", "Helper/JQ_AjaxAdaptor", "Helper/BaseChart", "Helper/HashMap"], function (require, exports, JQ_AjaxAdaptor_1, BaseChart_1, HashMap_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    // 把package底下的類別匯出
    __export(JQ_AjaxAdaptor_1);
    __export(BaseChart_1);
    __export(HashMap_1);
});
define("StockQuery", ["require", "exports", "Helper/index"], function (require, exports, index_1) {
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
});
define("StockChart", ["require", "exports", "Helper/index"], function (require, exports, index_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StockChart = /** @class */ (function (_super) {
        __extends(StockChart, _super);
        function StockChart(initObj) {
            var _this = _super.call(this, initObj) || this;
            _this.mChartData = {};
            _this.mChartRectWidth = 0;
            _this.mMaxRealAmt = 0;
            _this.mMinRealAmt = 0;
            _this.mPrettyAxis = [];
            _this.mouseHandle = function (evt) {
                // 取得滑鼠位置之後重新畫圖
                var mousePos = _this.getMousePos(evt);
                var aEvent = new index_2.MyMouseEvent(mousePos.x, mousePos.y, evt.type);
                _this.drawBgToContext(aEvent);
            };
            // 貼底圖後繪製前景
            _this.drawFrontContext = function (mouseEvent) {
                if (!mouseEvent || _this.mChartRectWidth == 0 || !_this.mChartData) {
                    return;
                }
                // 畫查價線
                // 計算x座標
                var xPos = Math.max(mouseEvent.XPos, _this.mAxisWidth);
                xPos = Math.min(mouseEvent.XPos, _this.mAxisWidth + _this.mChartWidth);
                xPos = Math.max(mouseEvent.XPos, _this.mAxisWidth);
                var xIndex = -1;
                if ((_this.mChartRectWidth > 0 || xPos < _this.mAxisWidth || xPos > (_this.mAxisWidth + _this.mChartRectWidth))) {
                    xIndex = Math.round((xPos - _this.mAxisWidth - _this.mChartRectWidth) / _this.mChartRectWidth);
                    //xIndex = Math.min(xIndex, this.ChartData.length-1);
                    //xIndex = Math.max(xIndex, 0);
                }
                //console.log("xIndex=" + xIndex);
                if (xIndex >= 0 && xIndex < _this.mChartData.length) {
                    var LineX = Math.round(_this.mAxisWidth + (xIndex + 1) * _this.mChartRectWidth);
                    if (_this.mShowQuoteLine) {
                        //this.clearLineTo(this.mContext, LineX, this.mTopHeight, LineX, this.mTopHeight + this.mChartHeight, this.mQuoteLineColor);
                        // draw circle ?
                        //let yPos = this.mChartData.length[xIndex]
                        var xAlpha = 0.7;
                        var xRadius = 5;
                        var aInfo = _this.mChartData[xIndex];
                        var aColor = _this.hexToRgb(_this.mRealColor);
                        var yPos = _this.getYPosByType(aInfo, ChartType.REAL_CHART);
                        _this.drawCircle(_this.mContext, LineX, yPos, xRadius, 'rgba(' + aColor.r + ',' + aColor.g + ',' + aColor.b + ',' + xAlpha + ')');
                        aColor = _this.hexToRgb(_this.mInvColor);
                        yPos = _this.getYPosByType(aInfo, ChartType.INV_CHART);
                        _this.drawCircle(_this.mContext, LineX, yPos, xRadius, 'rgba(' + aColor.r + ',' + aColor.g + ',' + aColor.b + ',' + xAlpha + ')');
                    }
                    // 畫提示資料
                    var hintDisplay = true;
                    var mHint = {
                        "BorderWidth": 20,
                        "Width": 150,
                        "Height": 60,
                        "BorderColor": "#000000",
                        "BgColor": "#FFFFFF",
                        "Alpha": 0.7,
                    };
                    // 畫hint區塊
                    if (hintDisplay) {
                        var hintStartX = LineX + mHint.BorderWidth;
                        if (hintStartX + mHint.Width > _this.mAxisWidth + _this.mChartWidth - mHint.BorderWidth) {
                            hintStartX = LineX - mHint.BorderWidth - mHint.Width;
                        }
                        var hintStartY = _this.mTopHeight + _this.mChartHeight / 2 + mHint.BorderWidth;
                        //mContext.lineWidth = mHint.BorderLineWdith;
                        _this.mContext.strokeStyle = mHint.BorderColor;
                        var aColor = _this.hexToRgb(mHint.BgColor);
                        _this.mContext.fillStyle = 'rgba(' + aColor.r + ',' + aColor.g + ',' + aColor.b + ',' + mHint.Alpha + ')';
                        _this.drawRoundRect(_this.mContext, hintStartX, hintStartY, mHint.Width, mHint.Height, 7, true);
                        var HintX = [Math.round(hintStartX + 6), Math.round(hintStartX + 20), Math.round(hintStartX + 52)];
                        // 日期
                        var yPos = Math.round(hintStartY + mHint.Height / 6 + _this.mAxisHeight / 2);
                        _this.drawString(_this.mContext, _this.mChartData[xIndex].MktDate, HintX[1], yPos, _this.mAxisFontSize, _this.mAxisFont, "#000000", "left");
                        // 成本
                        yPos = Math.round(hintStartY + 5 * mHint.Height / 6 + _this.mAxisHeight / 2);
                        _this.drawCircle(_this.mContext, HintX[0] + 4, Math.round(hintStartY + 5 * mHint.Height / 6), 5, _this.mInvColor);
                        _this.drawString(_this.mContext, "成本 ", HintX[1], yPos, _this.mAxisFontSize, _this.mAxisFont, "#000000", "left");
                        _this.drawString(_this.mContext, _this.addComma(_this.mChartData[xIndex].SumAmt.toFixed(2)), HintX[2], yPos, _this.mAxisFontSize, _this.mAxisFont, "#000000", "left");
                        // 市值
                        yPos = Math.round(hintStartY + 3 * mHint.Height / 6 + _this.mAxisHeight / 2);
                        _this.drawCircle(_this.mContext, HintX[0] + 4, Math.round(hintStartY + 3 * mHint.Height / 6), 5, _this.mRealColor);
                        _this.drawString(_this.mContext, "市值 ", HintX[1], yPos, _this.mAxisFontSize, _this.mAxisFont, "#000000", "left");
                        _this.drawString(_this.mContext, _this.addComma(_this.mChartData[xIndex].RealAmt.toFixed(2)), HintX[2], yPos, _this.mAxisFontSize, _this.mAxisFont, "#000000", "left");
                    }
                }
            };
            var ComponentId = _this.getParamValue(initObj.ComponentId, "");
            _this.mBorderWidth = _this.getParamValue(initObj.BorderWidth, 14);
            _this.mTopHeight = _this.getParamValue(initObj.TopHeight, 14);
            _this.mBottomHeight = _this.getParamValue(initObj.BottomHeight, 14);
            _this.mAxisFont = _this.getParamValue(initObj.AxisFont, _this.mFontType);
            _this.mAxisFontSize = _this.getParamValue(initObj.AxisFontSize, 9);
            _this.mAxisWidth = _this.getParamValue(initObj.AxisWidth, 59);
            _this.mAxisAmount = _this.getParamValue(initObj.AxisAmount, 5);
            _this.mAxisAmount = _this.getParamValue(initObj.AxisAmount, 5);
            _this.mAxisColor = _this.getParamValue(initObj.AxisColor, "#111111"); // 坐標軸Label顏色
            _this.mTitleFont = _this.getParamValue(initObj.TitleFont, _this.mFontType);
            _this.mTitleFontSize = _this.getParamValue(initObj.TitleFontSize, 9);
            _this.mTitleLabel = _this.getParamValue(initObj.TitleLabel, "");
            _this.mShowChartBorder = _this.getParamValue(initObj.ShowChartBorder, false);
            _this.mShowQuoteLine = _this.getParamValue(initObj.ShowQuoteLine, true);
            _this.mQuoteLineColor = _this.getParamValue(initObj.QuoteLineColor, "#111111");
            _this.mInvColor = _this.getParamValue(initObj.InvColor, "#0000FF"); // 投資顏色
            _this.mRealColor = _this.getParamValue(initObj.RealColor, "#FF0000"); // 市值顏色
            //this.RectAmounts = this.getParamValue(initObj.RectAmounts, 80);                          // 畫面資料筆數
            // 頁面加入<Canvas>標籤
            var aComponent = document.querySelector("#" + ComponentId);
            aComponent.appendChild(_this.mCanvas);
            console.log(_this.mClientRect);
            var aText = _this.MeasureText("00000000", "normal", _this.mAxisFont, _this.mAxisFontSize);
            _this.mAxisWidth = aText.Width;
            _this.mAxisHeight = aText.Height;
            _this.mChartHeight = _this.cHeight - _this.mTopHeight - _this.mBottomHeight;
            _this.mChartWidth = _this.cWidth - _this.mAxisWidth - _this.mBorderWidth;
            var PaintOnCreate = _this.getParamValue(initObj.PaintOnCreate, false);
            if (PaintOnCreate) {
                _this.repaint();
            }
            _this.bindingEvent();
            return _this;
        }
        StockChart.prototype.bindingEvent = function () {
            // 滑鼠移動事件
            this.mCanvas.addEventListener('mousemove', this.mouseMove, false);
            // this.mCanvas.addEventListener('mousedown', this.mouseDown, false);
            // this.mCanvas.addEventListener('mouseup', this.mouseUp, false);
            // this.mCanvas.addEventListener('mouseout', this.mouseOut, false);
            /*
            // 註冊觸控事件
            if (EnableTouchEvent) {
                mCanvas.addEventListener("touchstart", touchDown, false);
                mCanvas.addEventListener("touchmove", touchMove, false);
                mCanvas.addEventListener("touchend", touchUp, false);
            }
            // 鍵盤事件(註冊在windows)
            window.addEventListener("keydown", keyPress, false);
            */
        };
        StockChart.prototype.setData = function (data, invList) {
            this.mMinRealAmt = 999999999;
            this.mMaxRealAmt = 0;
            if (invList.length > 0) {
                // 投資開始日期
                var startDate = invList[0].MktDate;
                // 投資計畫、歷史Tick，對齊資料起始日
                for (var i = 0; i < data.length; i++) {
                    if (data[i].MktDate == startDate) {
                        data = data.slice(i);
                        break;
                    }
                }
                //console.log(startDate + " " + data.length);
                var invMap = new index_2.HashMap();
                for (var i = 0, n = invList.length; i < n; i++) {
                    invMap.put(invList[i].MktDate, invList[i]);
                }
                //console.log(invMap);
                // 計算市值
                var SumShares = 0;
                for (var i = 0; i < data.length; i++) {
                    var aObj = invMap.get(data[i].MktDate);
                    if (aObj) {
                        // [扣款日] 累計購買金額與股數
                        SumShares += aObj.Shares;
                        data[i].SumShares = SumShares;
                        data[i].SumAmt = aObj.Amt;
                        if (i > 0) {
                            data[i].SumAmt += data[i - 1].SumAmt;
                        }
                    }
                    else {
                        // [非扣款日] 用前一日的資料
                        data[i].SumShares = data[i - 1].SumShares;
                        data[i].SumAmt = data[i - 1].SumAmt;
                    }
                    // 實際市值 = 累計股數 * 收盤價
                    data[i].RealAmt = data[i].SumShares * data[i].CP;
                    this.mMaxRealAmt = Math.max(this.mMaxRealAmt, data[i].RealAmt);
                    this.mMinRealAmt = Math.min(this.mMinRealAmt, data[i].RealAmt);
                }
            }
            // 最大最小值取整數
            this.calMaxMin();
            this.mChartData = data;
        };
        StockChart.prototype.getInvResult = function () {
            var ret = {};
            if (this.mChartData.length > 0) {
                ret.SumShares = this.mChartData[this.mChartData.length - 1].SumShares;
                ret.SumAmt = this.mChartData[this.mChartData.length - 1].SumAmt;
                ret.RealAmt = this.mChartData[this.mChartData.length - 1].RealAmt;
            }
            return ret;
        };
        StockChart.prototype.drawChartArea = function () {
            // 畫底圖與座標軸
            this.drawAxis();
            var xChartData = this.mChartData;
            console.log(xChartData);
            // X軸間隔
            this.mChartRectWidth = this.mChartWidth / (xChartData.length + 1);
            // 畫投資金額
            this.drawChartWithCircle(xChartData, ChartType.INV_CHART, this.mInvColor, 1.5);
            // 畫實際金額
            this.drawChart(xChartData, ChartType.REAL_CHART, this.mRealColor, 2);
        };
        // 畫底圖與座標軸
        StockChart.prototype.drawAxis = function () {
            var xAlign = "right";
            // 背景
            this.fillRectEx(this.mBgContext, 0, 0, this.cWidth, this.cHeight, this.mBgColor);
            // 主要圖形底色
            this.fillRectEx(this.mBgContext, this.mAxisWidth, this.mTopHeight, this.mChartWidth, this.mChartHeight, this.mChartBgColor);
            // 邊框       
            if (this.mShowChartBorder) {
                this.drawRectEx(this.mBgContext, this.mAxisWidth, this.mTopHeight, this.mChartWidth, this.mChartHeight, "111111", 1);
            }
            // 標題
            var aText = this.MeasureText(this.mTitleLabel, "normal", this.mTitleFont, this.mTitleFontSize);
            this.drawString(this.mBgContext, this.mTitleLabel, this.cWidth / 2 + aText.Width / 2, this.mTopHeight / 2 + aText.Height / 2, this.mTitleFontSize, this.mTitleFont, this.mAxisColor, xAlign);
            // 畫坐標軸
            for (var i = 0; i < this.mAxisAmount; i++) {
                var yPOS_1 = (this.mChartHeight / (this.mAxisAmount + 1)) * (this.mAxisAmount - i) + this.mTopHeight;
                this.dashedLineTo(this.mBgContext, this.mAxisWidth, yPOS_1, this.mChartWidth + this.mAxisWidth, yPOS_1, 3, this.mAxisColor);
                this.drawString(this.mBgContext, this.mPrettyAxis[i + 1] + "", this.mAxisWidth - 4, Math.round(yPOS_1 + this.mAxisHeight / 2), this.mAxisFontSize, this.mAxisFont, this.mAxisColor, xAlign);
            }
            var yPOS = this.mChartHeight + this.mTopHeight + this.mAxisHeight / 2;
            this.drawString(this.mBgContext, this.mPrettyAxis[0] + "", this.mAxisWidth - 4, Math.round(yPOS), this.mAxisFontSize, this.mAxisFont, this.mAxisColor, xAlign);
            yPOS = this.mTopHeight + this.mAxisHeight / 2;
            this.drawString(this.mBgContext, this.mPrettyAxis[this.mPrettyAxis.length - 1] + "", this.mAxisWidth - 4, Math.round(yPOS), this.mAxisFontSize, this.mAxisFont, this.mAxisColor, xAlign);
        };
        // 畫線圖
        StockChart.prototype.drawChart = function (xChartData, aType, aColor, lineWidth) {
            lineWidth = lineWidth || 1.5;
            this.mBgContext.save();
            this.mBgContext.translate(0.5, 0.5);
            this.mBgContext.lineWidth = lineWidth;
            this.mBgContext.beginPath();
            for (var i = 0; i < xChartData.length; i++) {
                var aInfo = xChartData[i];
                var xPos = this.mChartRectWidth * (i + 1) + this.mAxisWidth;
                var yPos = this.getYPosByType(aInfo, aType);
                this.mBgContext.lineTo(xPos, yPos);
            }
            this.mBgContext.strokeStyle = aColor;
            this.mBgContext.lineJoin = 'round';
            this.mBgContext.stroke();
            this.mBgContext.restore();
        };
        // 畫線圖+符號
        StockChart.prototype.drawChartWithCircle = function (xChartData, aType, aColor, lineWidth) {
            lineWidth = lineWidth || 1.5;
            this.mBgContext.save();
            this.mBgContext.translate(0.5, 0.5);
            this.mBgContext.lineWidth = lineWidth;
            this.mBgContext.beginPath();
            for (var i = 0; i < xChartData.length; i++) {
                var aInfo = xChartData[i];
                var xPos = this.mChartRectWidth * (i + 1) + this.mAxisWidth;
                var yPos = this.getYPosByType(aInfo, aType);
                this.mBgContext.lineTo(xPos, yPos);
            }
            this.mBgContext.strokeStyle = aColor;
            this.mBgContext.lineJoin = 'round';
            this.mBgContext.stroke();
            this.mBgContext.restore();
            // 當資料量少時畫符號        
            if (xChartData.length < 50) {
                for (var i = 0; i < xChartData.length; i++) {
                    var aInfo = xChartData[i];
                    var xPos = this.mChartRectWidth * (i + 1) + this.mAxisWidth;
                    var yPos = this.getYPosByType(aInfo, aType);
                    this.drawCircle(this.mBgContext, xPos, yPos, 3, aColor);
                }
            }
        };
        // 依據不同型態計算Y軸位置
        StockChart.prototype.getYPosByType = function (aInfo, aType) {
            switch (aType) {
                case ChartType.INV_CHART:
                    return this.mTopHeight + this.mChartHeight * (this.mMaxRealAmt - aInfo.SumAmt) / (this.mMaxRealAmt - this.mMinRealAmt);
                case ChartType.REAL_CHART:
                    return this.mTopHeight + this.mChartHeight * (this.mMaxRealAmt - aInfo.RealAmt) / (this.mMaxRealAmt - this.mMinRealAmt);
                default:
                    return 0;
            }
        };
        StockChart.prototype.calMaxMin = function () {
            // 水平座標軸與水平線
            this.mPrettyAxis = this.getPrettyAxis(this.mMinRealAmt, this.mMaxRealAmt, this.mAxisAmount + 2);
            //console.log(this.PrettyAxis);
            this.mMaxRealAmt = Math.max(this.mMaxRealAmt, this.mPrettyAxis[this.mPrettyAxis.length - 1]);
            this.mMinRealAmt = Math.min(this.mMinRealAmt, this.mPrettyAxis[0]);
            // 依據最大值計算Axis寬度，再加上00
            var aText = this.MeasureText(this.mPrettyAxis[this.mPrettyAxis.length - 1] + "00", "normal", this.mAxisFont, this.mAxisFontSize);
            this.mAxisWidth = aText.Width;
            this.mChartWidth = this.cWidth - this.mAxisWidth - this.mBorderWidth;
        };
        // 主要繪圖方法
        StockChart.prototype.drawMain = function () {
            this.drawChartArea();
        };
        return StockChart;
    }(index_2.BaseChart));
    exports.StockChart = StockChart;
    var ChartType;
    (function (ChartType) {
        ChartType[ChartType["INV_CHART"] = 1] = "INV_CHART";
        ChartType[ChartType["REAL_CHART"] = 2] = "REAL_CHART";
    })(ChartType || (ChartType = {}));
});
