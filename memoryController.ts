import { ISyncDevice, IMemoryDevice } from "./iDevice";
import { Memory } from "./memory";

export class MemoryController implements ISyncDevice {
    private mem : Memory;
    private devices : IMemoryDevice[] = [];
    private start : number = 0;
    
    constructor(memory : Memory, ...devices : IMemoryDevice[]) {
        this.mem = memory;
        this.devices = [...devices];
    }

    public clk() {
        if (this.mem.lock && ! this.mem.done) {
            return;
        }

        if (this.start >= this.devices.length) {
            this.start = 0;
        }

        for (let i = this.start; i < this.devices.length; i++) {
            const device = this.devices[i];

            if (! device.mwait) {
                this.start++;
                continue;
            }

            this.mem.lock = true;

            this.mem.read = device.mread;
            this.mem.addr = device.maddr;

            if (device.mread) {
                device.mdata = this.mem.data;
            } else {
                this.mem.data = device.mdata;
            }

            if (this.mem.done) {
                device.mdone = true;
                this.mem.lock = false;

                this.start++;
            }

            return;
        }
    }
}