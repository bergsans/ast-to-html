import { HTMLNode } from '../typings';
import tokenize from './html-to-ast-tokenize';
import parse from './html-to-ast-parse';

export default function htmlToAST(code: string): HTMLNode {
    return parse(tokenize(code));
}
