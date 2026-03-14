import LinkedListNode from "./LinkedListNode";


export default class LinkedList<T> {

    private first: LinkedListNode<T> | null;
    private last: LinkedListNode<T> | null;

    constructor() {
        this.first = null;
        this.last = null;
    }

    public insert(data: T): void {
        // Inserting at the end of the queue
        const newElem = new LinkedListNode(data);
        if (this.first === null) {
            this.first = this.last = newElem;
        } else {
            this.last?.setNext(newElem);
            this.last = newElem;
        }
    }

    public hasElements(): boolean {
        return this.first !== null;
    }

    public remove(): T | null {
        if (this.first !== null) {
            const elem = this.first.getInfo();
            this.first = this.first.getNext();
            if (this.first === null) {
                this.last = null;
            }

            return elem;
        }
        return null;
    }

}