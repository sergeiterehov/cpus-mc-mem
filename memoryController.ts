import { ISyncDevice, IMemoryDevice } from "./iDevice";
import { Memory } from "./memory";

export class MemoryController implements ISyncDevice {
    private mem : Memory;
    private devices : IMemoryDevice[] = [];
    
    constructor(memory : Memory, ...devices : IMemoryDevice[]) {
        this.mem = memory;
        this.devices = [...devices];
    }

    public clk() {
        if (this.mem.lock && ! this.mem.done) {
            return;
        }

        this.devices.forEach((device) => {
            if (! device.mwait) {
                return;
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
            }
        });
    }
}