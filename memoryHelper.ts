export class MemoryHelper {
    private links : {[s: string]: number};

    private lastIndex : number = 0;
    private vector : any[];

    static init(size : number) {
        return new this(size);
    }

    constructor(size : number) {
        this.vector = [];
        this.links = {};

        for (let i = 0; i < size; i++) {
            this.vector.push(0);
        }
    }

    public block(address : number, block : any[]) {
        if (address + block.length > this.lastIndex) {
            this.lastIndex = address + block.length;
        }

        block.forEach((item, i) => this.vector[address + i] = item);

        return this;
    }

    public link(name : string, block : any[]) {
        this.links[name] = this.lastIndex;

        this.block(this.lastIndex, block);

        return this;
    }

    public build() : number[] {
        const mem : number[] = this.vector.map((item, address) => {
            if ('number' === typeof item) {
                return item;
            } else if ('string' === typeof item) {
                return this.links[item];
            }

            throw new Error('Bad type of cell!');
        })

        return mem;
    }
}
