export declare class Deque<T = any> {
    constructor(capacity?: number | T[]);

    readonly length: number;

    toArray(): T[];

    push(...items: T[]): number;
    pop(): T | undefined;

    shift(): T | undefined;
    unshift(...items: T[]): number;

    peekBack(): T | undefined;
    peekFront(): T | undefined;

    get(index: number): T | undefined;

    isEmpty(): boolean;
    clear(): void;

    toString(): string;
    valueOf(): string;
    toJSON(): T[];

    removeFront(): T | undefined;
    removeBack(): T | undefined;

    insertFront(...items: T[]): number;
    insertBack(...items: T[]): number;

    enqueue(...items: T[]): number;
    dequeue(): T | undefined;

    [index: number]: T;
}
