define(["require", "exports"], function (require, exports) {
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
