# Multiprocessor CPU emulator

## CPU Architecture

This is CISC architecture. Uses 1 cell for instruction code, but it can be extended and added.

Processor have 16 common registers. Executing instruction is multi-tick operation.
Each processore have personal number. That number defines value of instruction pointer by follow method: `ip = 4 * unitNumber`.

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
        OpCode.MOV_R0_x0, 'data_0',
        OpCode.JMP_x0, 'entry',
    ])
    .block(4, [
        OpCode.MOV_R0_x0, 'data_1',
        OpCode.JMP_x0, 'entry',
    ])
    .link('entry', [
        OpCode.MOV_AR0_R1,
        OpCode.HLT,
    ])
    .link('data_0', [
        0,0,0,0,
    ])
    .link('data_1', [
        0,0,0,0,
    ])
```

## Creating architecture

```ts
const cpu0 = new CPU(0);
const cpu1 = new CPU(1);

const mem = new Memory(dump.build());

const mc = new MemoryController(mem, cpu0, cpu1);
```

## Begin emulation

```ts
for (let i = 0; i < 100; i++) {
    cpu0.clk();
    cpu1.clk();
    mc.clk();
    mem.clk();
}
```
