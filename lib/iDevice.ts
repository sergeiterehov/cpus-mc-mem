export interface ISyncDevice {
    clk();
}

export interface IMemoryDevice {
    maddr : number;
    mdata : number;
    mread : boolean;
    mwait : boolean;
    mdone : boolean;
}
