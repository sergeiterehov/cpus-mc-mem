import { ISyncDevice, IMemoryDevice } from "./iDevice";

enum CPUState {
    Start,
    ReadInstruction,
    Execute,
}

export enum OpCode {
    NOP,
    MOV_Ax0_x1,
    MOV_Ax0_R0,
    MOV_R0_Ax0,
    ADD_x0,
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

    constructor() {
        this.mwait = false;
    }

    public clk() {
        switch (this.state) {
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
                else if (this.instr === OpCode.MOV_Ax0_x1) this.inst_mov_ab0_b1();
                else if (this.instr === OpCode.MOV_Ax0_R0) this.inst_mov_ab0_r0();
                else if (this.instr === OpCode.MOV_R0_Ax0) this.inst_mov_r0_ab0();
                else if (this.instr === OpCode.ADD_x0) this.inst_add_b0();
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
     * [b0] = b1
     */
    private inst_mov_ab0_b1()
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
     * [b0] = r0
     */
    private inst_mov_ab0_r0() {
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
     * r0 = [b0]
     */
    private inst_mov_r0_ab0() {
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
     * r0 = r0 + b0
     */
    private inst_add_b0() {
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
}