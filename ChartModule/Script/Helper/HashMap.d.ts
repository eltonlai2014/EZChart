export declare class HashMap {
    private size;
    private entry;
    constructor();
    put(key: string, value: any): void;
    get(key: string): any;
    remove(key: string): void;
    containsKey(key: string): boolean;
    containsValue(value: any): boolean;
    values(): any;
    keys(): string[];
    getSize(): number;
    clear(): number;
}
