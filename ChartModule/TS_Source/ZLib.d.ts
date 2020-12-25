//declare let Zlib: any; // 這行ts不會做任何處理

// 宣告 Zlib.Gunzip 類別與方法
declare module Zlib {
    export class Gunzip {
        constructor(data: any);
        decompress(): any;
    }

} 