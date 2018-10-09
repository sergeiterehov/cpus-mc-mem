import { CPU, OpCode } from "./cpu";
import { Memory } from "./memory";
import { MemoryController } from "./memoryController";

const cpu = new CPU();
const mem = new Memory([
    /* mov [20], 123 */ OpCode.MOV_Ax0_x1, 20, 123,
    /* mov r0, [20] */ OpCode.MOV_R0_Ax0, 20,
    /* add 10 */ OpCode.ADD_x0, 10,
    /* mov [21], r0 */ OpCode.MOV_Ax0_R0, 21,

    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
]);
const mc = new MemoryController(mem, cpu);

for (let i = 0; i < 100; i++) {
    cpu.clk();
    mc.clk();
    mem.clk();
}

console.log('Result memory:', mem.dump().join());
