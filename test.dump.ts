import { MemoryHelper } from "./helpers/memoryHelper";
import { OpCode } from "./lib/cpu";

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
        OpCode.MOV_Rx0_R0, 2, // r2 = r0
        OpCode.MOV_R0_Rx0, 15, // r0 = r15
        OpCode.ADD_x0, 1, // r0 += 1
        OpCode.MOV_Rx0_R0, 1, // r1 = r0
        OpCode.MOV_R0_Rx0, 2, // r0 = r2

        OpCode.MOV_AR0_R1, // [r0] = r1

        OpCode.HLT,
    ])
    .link('data_0', [
        0,0,0,0,
    ])
    .link('data_1', [
        0,0,0,0,
    ])
