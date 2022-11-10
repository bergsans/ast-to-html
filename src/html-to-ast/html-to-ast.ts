import { HTMLNode, tokenize, parse } from '..';

export function htmlToAST(code: string): HTMLNode {
    return parse(tokenize(code));
}
