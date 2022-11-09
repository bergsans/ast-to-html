import { Tag, Attributes, Token, HTMLNode } from '../typings';
import { List, list } from './helpers';

function parseTag(li: List<Token>): Tag {
    li.next();
    const currentToken = li.next();
    let tag: Tag = {
        tag: currentToken.literal,
    };
    let attributes = {};
    let children: HTMLNode[] = [];
    while (
        !li.isHead('CLOSE_TAG_END') &&
        !li.isPeakAt(1, 'IDENTIFIER') &&
        li.peakAt(1).literal !== currentToken.literal
    ) {
        if (li.isHead('IDENTIFIER')) {
            attributes = parseAttributeValues(li) as Attributes;
        }
        if (li.isHead('CLOSE_TAG')) {
            li.next();
            children = [...parseChildren(li)];
        }
    }
    li.next();
    li.next();
    li.next();
    tag.children = children;
    if (Object.keys(attributes).length > 0) {
        tag.attributes = attributes;
    }
    return tag;
}

function parseChildren(li: List<Token>): HTMLNode[] {
    const children: HTMLNode[] = [];
    while (!li.isHead('CLOSE_TAG_END')) {
        children.push(_parse(li) as HTMLNode);
    }
    return children;
}

function parseAttributeValues(li: List<Token>): Attributes {
    const attributes: Record<string, string> = {};
    while (!li.isHead('CLOSE_TAG')) {
        const attribute = li.next();
        if (!li.isHead('ASSIGN') && !li.isPeakAt(1, 'ATTRIBUTE_VALUE')) {
            throw new Error('Expected assign.');
        }
        li.next();
        const attributeValue = li.next();
        attributes[attribute.literal] = attributeValue.literal;
    }
    return attributes;
}

function parseText(li: List<Token>) {
    return { text: li.next().literal };
}

function _parse(li: List<Token>) {
    while (li.length()) {
        if (li.isHead('OPEN_TAG') && li.isPeakAt(1, 'IDENTIFIER')) {
            return parseTag(li);
        }
        if (li.isHead('Text')) {
            return parseText(li);
        }
    }
}

export default function parse(tokens: Token[]): HTMLNode {
    const li = list(tokens);
    return _parse(li) as HTMLNode;
}
