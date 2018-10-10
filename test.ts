import { CPU } from "./cpu";
import { Memory } from "./memory";
import { MemoryController } from "./memoryController";
import { dump } from "./test.dump";

const cpu0 = new CPU(0);
const cpu1 = new CPU(1);

const mem = new Memory(dump.build());

const mc = new MemoryController(mem, cpu0, cpu1);

console.log('Source memory:', mem.dump().join());

for (let i = 0; i < 999; i++) {
    cpu0.clk();
    cpu1.clk();
    mc.clk();
    mem.clk();
}

console.log('Result memory:', mem.dump().join());
