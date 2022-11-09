import { Token } from '../typings';

export type List<T> = {
    isHead: (s: string) => boolean;
    isPeakAt: (i: number, t: string) => boolean;
    peakAt: (i: number) => T;
    length: () => number;
    get: () => T[];
    next: () => T;
    head: () => T;
};

export function list(_xs: Token[]): List<Token> {
    const xs = [..._xs];
    return {
        isHead: (type) => xs[0]?.type === type,
        isPeakAt: (i, type) => xs[i].type === type,
        peakAt: (i) => xs[i],
        length: () => xs.length,
        get: () => xs,
        next: () => {
            const currentToken = xs.shift();
            return currentToken as Token;
        },
        head: () => xs[0],
    };
}
