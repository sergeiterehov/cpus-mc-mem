import { MemoryHelper } from "./memoryHelper";
import { OpCode } from "./cpu";

export const dump = MemoryHelper.init(64);

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
