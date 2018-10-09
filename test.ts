import { CPU } from "./cpu";
import { Memory } from "./memory";
import { MemoryController } from "./memoryController";

const cpu = new CPU();
const mem = new Memory([
    0x01, 20, 123, // mov [20], 123
    0x03, 20, // mov r0, [20]
    0x04, 10, // add 10
    0x02, 21, // mov [21], r0

    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
]);
const mc = new MemoryController(mem, cpu);

for (let i = 0; i < 100; i++) {
    cpu.clk();
    mc.clk();
    mem.clk();
}

console.log('Result memory:', mem.dump().join());
