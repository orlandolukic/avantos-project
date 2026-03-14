

export default class LinkedListNode<T> {

    private info: T;
    private next: LinkedListNode<T> | null;

    constructor(info: T) {
        this.info = info;
        this.next = null;
    }

    public getInfo(): T {
        return this.info;
    }

    public getNext(): LinkedListNode<T> | null {
        return this.next;
    }

    public setNext(next: LinkedListNode<T> | null): void {
        this.next = next;
    }


}