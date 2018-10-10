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

    public log(dump : number[], diff : number[]) {
        for (let i = 0; i < dump.length; i += 16) {
            console.log(
                `\x1b[36m${`            ${i} : `.slice(-8)}\x1b[0m` +
                dump.slice(i, i + 16)
                    .map((n, offset) => {
                        let str = ('000' + n.toString(10)).slice(-3);

                        if (diff && dump[i + offset] !== diff[i + offset]) {
                            str = `\x1b[41;1m${str}\x1b[0m`;
                        }

                        return str;
                    })
                    .join(" ") +
                `\x1b[36m : ${i + 16 - 1}\x1b[0m`
            );

            Object.keys(this.links).forEach((key) => {
                const address = this.links[key];

                if (! (address >= i && address < (i + 16))) {
                    return;
                }

                const offset = (
                    '                                      ' +
                    '                                      ' +
                    '                                      ' +
                    '                                      '
                ).slice(-(8 + 4 * (address - i)));
                
                console.log(`\x1b[36m${offset}^ ${key}\x1b[34m [${address}]\x1b[0m`);
            });
        }
    }
}
