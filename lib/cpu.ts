import { ISyncDevice, IMemoryDevice } from "./iDevice";

enum CPUState {
    Start,
    ReadInstruction,
    Execute,
    Halt,
}

export enum OpCode {
    NOP,

    HLT,

    MOV_Ax0_x1,
    MOV_Ax0_R0,
    MOV_AR0_R1,
    MOV_Rx0_R0,
    MOV_R0_Rx0,
    MOV_R0_x0,
    MOV_R0_Ax0,

    ADD_x0,
    SUB_x0, // todo

    JMP_x0,
    JMP, // todo
    JIZ_x0, // todo
    JIG_x0, // todo
}

export class CPU implements IMemoryDevice, ISyncDevice {
    public maddr : number = 0;
    public mdata : number = 0;
    public mread : boolean = false;
    public mwait : boolean = false;
    public mdone : boolean = false;

    private state : CPUState = CPUState.Start;

    private ip : number = 0;
    private ix : number[] = [
        0, 0, 0, 0,
    ];
    private rx : number[] = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ];

    private instr : number = 0;
    private instr_i : number = 0;

    constructor(unitNumber : number) {
        this.mwait = false;

        this.rx[15] = unitNumber;
        this.ip = unitNumber * 4;
    }

    public clk() {
        switch (this.state) {
            case CPUState.Halt:
                break;
            case CPUState.Start:
                this.state = CPUState.ReadInstruction;
                break;
            case CPUState.ReadInstruction:
                if (this.mdone) {
                    this.mdone = false;
                    this.mwait = false;

                    this.instr = this.mdata;
                    this.instr_i = 0;

                    this.state = CPUState.Execute;
                } else if (! this.mwait) {
                    this.maddr = this.ip;
                    this.mread = true;
                    this.mwait = true;

                    this.ip++;
                }
                break;
            case CPUState.Execute:
                if (this.instr === OpCode.NOP) this.inst_nop();
                if (this.instr === OpCode.HLT) this.inst_hlt();
                else if (this.instr === OpCode.MOV_Ax0_x1) this.inst_mov_ax0_x1();
                else if (this.instr === OpCode.MOV_Ax0_R0) this.inst_mov_ax0_r0();
                else if (this.instr === OpCode.MOV_AR0_R1) this.isnt_mov_ar0_r1();
                else if (this.instr === OpCode.MOV_Rx0_R0) this.isnt_mov_rx0_r0();
                else if (this.instr === OpCode.MOV_R0_Rx0) this.isnt_mov_r0_rx0();
                else if (this.instr === OpCode.MOV_R0_x0) this.inst_mov_r0_x0();
                else if (this.instr === OpCode.MOV_R0_Ax0) this.inst_mov_r0_ax0();
                else if (this.instr === OpCode.ADD_x0) this.inst_add_x0();
                else if (this.instr === OpCode.JMP_x0) this.inst_jmp_x0();
                break;
        }
    }

    /**
     * No operation
     */
    private inst_nop() {
        this.state = CPUState.ReadInstruction;
    }

    /**
     * Halt
     */
    private inst_hlt() {
        this.state = CPUState.Halt;
    }

    /**
     * [x0] = x1
     */
    private inst_mov_ax0_x1()
    {
        switch (this.instr_i) {
            case 0:
            case 2:
                this.maddr = this.ip;
                this.mread = true;
                this.mwait = true;

                this.ip++;

                this.instr_i++;
                break;
            case 1:
            case 3:
                if (this.mdone) {
                    switch (this.instr_i) {
                        case 1: this.ix[0] = this.mdata; break;
                        case 3: this.ix[1] = this.mdata; break;
                    }

                    this.mwait = false;
                    this.mdone = false;

                    this.instr_i++;
                }
                break;
            case 4:
                this.maddr = this.ix[0];
                this.mdata = this.ix[1];
                this.mread = false;
                this.mwait = true;

                this.instr_i++;
                break;
            case 5:
                if (this.mdone) {
                    this.state = CPUState.ReadInstruction;

                    this.mwait = false;
                    this.mdone = false;
                }
                break;
        }
    }

    /**
     * [x0] = r0
     */
    private inst_mov_ax0_r0() {
        switch (this.instr_i) {
            case 0:
                this.maddr = this.ip;
                this.mread = true;
                this.mwait = true;

                this.ip++;

                this.instr_i++;
                break;
            case 1:
                if (this.mdone) {
                    this.ix[0] = this.mdata;

                    this.mwait = false;
                    this.mdone = false;

                    this.instr_i++;
                }
                break;
            case 2:
                this.maddr = this.ix[0];
                this.mdata = this.rx[0];
                this.mread = false;
                this.mwait = true;

                this.instr_i++;
                break;
            case 3:
                if (this.mdone) {
                    this.mwait = false;
                    this.mdone = false;

                    this.state = CPUState.ReadInstruction;
                }
                break;
        }
    }

    /**
     * [r0] = r1
     */
    private isnt_mov_ar0_r1() {
        switch (this.instr_i) {
            case 0:
                this.maddr = this.rx[0];
                this.mdata = this.rx[1];
                this.mread = false;
                this.mwait = true;

                this.instr_i++;
                break;
            case 1:
                if (this.mdone) {
                    this.mwait = false;
                    this.mdone = false;

                    this.state = CPUState.ReadInstruction;
                }
                break;
        }
    }

    /**
     * r(x0) = r0
     */
    private isnt_mov_rx0_r0() {
        switch (this.instr_i) {
            case 0:
                this.maddr = this.ip;
                this.mread = true;
                this.mwait = true;

                this.ip++;

                this.instr_i++;
                break;
            case 1:
                if (this.mdone) {
                    this.ix[0] = this.mdata;

                    this.mwait = false;
                    this.mdone = false;

                    this.instr_i++;
                }
                break;
            case 2:
                this.rx[this.ix[0]] = this.rx[0];

                this.state = CPUState.ReadInstruction;
                break;
        }
    }

    /**
     * r0 = r(x0)
     */
    private isnt_mov_r0_rx0() {
        switch (this.instr_i) {
            case 0:
                this.maddr = this.ip;
                this.mread = true;
                this.mwait = true;

                this.ip++;

                this.instr_i++;
                break;
            case 1:
                if (this.mdone) {
                    this.ix[0] = this.mdata;

                    this.mwait = false;
                    this.mdone = false;

                    this.instr_i++;
                }
                break;
            case 2:
                this.rx[0] = this.rx[this.ix[0]];

                this.state = CPUState.ReadInstruction;
                break;
        }
    }

    /**
     * r0 = x0
     */
    private inst_mov_r0_x0() {
        switch (this.instr_i) {
            case 0:
                this.maddr = this.ip;
                this.mread = true;
                this.mwait = true;

                this.ip++;

                this.instr_i++;
                break;
            case 1:
                if (this.mdone) {
                    this.rx[0] = this.mdata;

                    this.mwait = false;
                    this.mdone = false;

                    this.state = CPUState.ReadInstruction;
                }
                break;
        }
    }

    /**
     * r0 = [x0]
     */
    private inst_mov_r0_ax0() {
        switch (this.instr_i) {
            case 0:
                this.maddr = this.ip;
                this.mread = true;
                this.mwait = true;

                this.ip++;

                this.instr_i++;
                break;
            case 1:
                if (this.mdone) {
                    this.ix[0] = this.mdata;

                    this.mwait = false;
                    this.mdone = false;

                    this.instr_i++;
                }
                break;
            case 2:
                this.maddr = this.ix[0];
                this.mread = true;
                this.mwait = true;

                this.instr_i++;
                break;
            case 3:
                if (this.mdone) {
                    this.rx[0] = this.mdata;

                    this.mwait = false;
                    this.mdone = false;

                    this.state = CPUState.ReadInstruction;
                }
                break;
        }
    }

    /**
     * r0 = r0 + x0
     */
    private inst_add_x0() {
        switch (this.instr_i) {
            case 0:
                this.maddr = this.ip;
                this.mread = true;
                this.mwait = true;

                this.ip++;

                this.instr_i++;
                break;
            case 1:
                if (this.mdone) {
                    this.rx[0] += this.mdata;

                    this.mwait = false;
                    this.mdone = false;

                    this.state = CPUState.ReadInstruction;
                }
                break;
        }
    }

    /**
     * ip = x0
     */
    private inst_jmp_x0() {
        switch (this.instr_i) {
            case 0:
                this.maddr = this.ip;
                this.mread = true;
                this.mwait = true;

                this.ip++;

                this.instr_i++;
                break;
            case 1:
                if (this.mdone) {
                    this.ip = this.mdata;

                    this.mwait = false;
                    this.mdone = false;

                    this.state = CPUState.ReadInstruction;
                }
                break;
        }
    }
}