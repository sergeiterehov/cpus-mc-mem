# Multiprocessor CPU emulator

## CPU Architecture

This is CISC architecture. Uses 1 cell for instruction code, but it can be extended and added.

Processor have 16 common registers. Executing instruction is multi-tick operation.
Each processore have personal number. That number defines value of instruction pointer by follow method: `ip = 4 * unitNumber`. Also `r15 = unitNumber`.

## Memory controller

Controller can be connected to any devices with `IMemoryDevice` interface.
It is deviding access to memory device between all devices.

## Memory

Memory is simple device, wich get or set data by presented address.

# How to

## Creating initial memory dump

```ts
const dump = MemoryHelper.init(64);

dump
    .block(0, [
        // Entry point for the first CPU.
        OpCode.MOV_R0_x0, 'data_0',
        OpCode.JMP_x0, 'entry',
    ])
    .block(4, [
        // Entry point for the second CPU.
        OpCode.MOV_R0_x0, 'data_1',
        OpCode.JMP_x0, 'entry',
    ])
    .link('entry', [
        // Common code area.
        OpCode.MOV_AR0_R1,
        OpCode.HLT,
    ])
    .link('data_0', [
        // Block for results of CPU 0.
        0,0,0,0,
    ])
    .link('data_1', [
        // Block for results of CPU 1.
        0,0,0,0,
    ])
```

## Creating architecture

```ts
// Creating processors.
const cpu0 = new CPU(0);
const cpu1 = new CPU(1);

// Creating and initializing memory device.
const mem = new Memory(dump.build());

// Connecting memory with all processors.
const mc = new MemoryController(mem, cpu0, cpu1);
```

## Begin emulation

```ts
// Executing 100 cycles for each device.
for (let i = 0; i < 100; i++) {
    cpu0.clk();
    cpu1.clk();
    mc.clk();
    mem.clk();
}
```

## Look at results

```ts
dump.log(mem.dump(), diff);
```

* This data will be colored:

```
    0 : 007 020 010 008 007 024 010 008 005 002 006 015 009 001 005 001 : 15
                                        ^ entry [8] = 5
   16 : 006 002 004 001 001 000 000 000 002 000 000 000 000 000 000 000 : 31
                        ^ data_0 [20] = 1
                                        ^ data_1 [24] = 2
   32 : 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 : 47
   48 : 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 000 : 63
```