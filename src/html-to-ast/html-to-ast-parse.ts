import { Token, HTMLNode } from '../typings';

export default function parse(tokens: Token[]): HTMLNode {
    while (tokens.length) {
        const currentToken = tokens.shift();
        if (currentToken && currentToken.type === 'IDENTIFIER') {
        }
    }
}
