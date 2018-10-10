import { CPU } from "./lib/cpu";
import { Memory } from "./lib/memory";
import { MemoryController } from "./lib/memoryController";
import { dump } from "./test.dump";

const cpu0 = new CPU(0);
const cpu1 = new CPU(1);

const mem = new Memory(dump.build());

const mc = new MemoryController(mem, cpu0, cpu1);

const diff = mem.dump();

for (let i = 0; i < 999; i++) {
    cpu0.clk();
    cpu1.clk();
    mc.clk();
    mem.clk();
}

dump.log(mem.dump(), diff);
