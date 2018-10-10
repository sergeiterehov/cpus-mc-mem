import { ISyncDevice, IMemoryDevice } from "./iDevice";

export class Memory implements ISyncDevice {
    public lock : boolean = false;
    public addr : number = 0;
    public data : number = 0;
    public done : boolean = false;
    public read : boolean = false;

    private mem : number[];

    constructor(memoryArray : number[]) {
        this.mem = memoryArray;
    }

    public clk() {
        if (! this.lock) {
            this.done = false;
            return;
        }

        if (this.read) {
            this.data = this.mem[this.addr];
        } else {
            this.mem[this.addr] = this.data;
        }

        this.done = true;
    }

    public dump() {
        return [...this.mem];
    }
}