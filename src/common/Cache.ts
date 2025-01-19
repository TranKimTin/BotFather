interface CacheItem {
    value: any,
    expired: number //date time miliseconds
}

interface HeapItem {
    key: string, expired: number
};

class MinHeap {
    private heap: Array<HeapItem>;

    constructor() {
        this.heap = [];
    }

    private getParentIndex(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    private getLeftChildIndex(index: number): number {
        return 2 * index + 1;
    }

    private getRightChildIndex(index: number): number {
        return 2 * index + 2;
    }

    private swap(index1: number, index2: number): void {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    public push(item: HeapItem): void {
        this.heap.push(item);
        this.heapifyUp();
    }

    private heapifyUp(): void {
        let index = this.heap.length - 1;
        while (
            index > 0 &&
            this.heap[this.getParentIndex(index)].expired > this.heap[index].expired
        ) {
            this.swap(index, this.getParentIndex(index));
            index = this.getParentIndex(index);
        }
    }

    public pop(): void {
        if (this.heap.length === 0) return;
        if (this.heap.length === 1) {
            this.heap.pop();
            return;
        }

        this.heap[0] = this.heap.pop()!;
        this.heapifyDown();
    }

    private heapifyDown(): void {
        let index = 0;
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(index);

            if (
                this.getRightChildIndex(index) < this.heap.length &&
                this.heap[this.getRightChildIndex(index)].expired < this.heap[smallerChildIndex].expired
            ) {
                smallerChildIndex = this.getRightChildIndex(index);
            }

            if (this.heap[index].expired <= this.heap[smallerChildIndex].expired) {
                break;
            }

            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }

    public top(): HeapItem | null {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    public size(): number {
        return this.heap.length;
    }
}

let data: { [key: string]: CacheItem | undefined } = {};
let heap = new MinHeap();

function update(): void {
    const now = new Date().getTime();
    while (heap.size() > 0) {
        const item = heap.top()!;
        if (item.expired < now) {
            if (item.expired === data[item.key]?.expired) {
                delete data[item.key];
            }
            heap.pop();
        }
        else {
            break;
        }
    }
}

let cntAll = 0;
let cntCache = 0;
export function get(key: string) {
    update();
    cntAll++;
    if (data[key]?.value) cntCache++;
    return data[key]?.value || null;
}

export function set(key: string, value: any, expiredTime: number) {
    update();
    const now = new Date().getTime();
    const expired = now + expiredTime;
    data[key] = { expired, value };
    heap.push({
        expired,
        key
    });
}