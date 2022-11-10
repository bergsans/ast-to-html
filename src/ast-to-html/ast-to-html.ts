import { HTMLNode, Tag, TextContent } from '..';

const isTag = (o: HTMLNode): o is Tag => 'tag' in o;

const isTextContentTag = (o: HTMLNode): o is Tag & TextContent => 'text' in o;

const isNodeList = (o: HTMLNode): o is Tag & { children: HTMLNode[] } =>
    isTag(o) && 'children' in o;

const buildKeyValuePair = (acc: string, [k, v]: [string, string]) => acc.concat(`${k}="${v}" `);

const buildAttributes = (attributes: Record<string, string>) =>
    Object.entries(attributes).reduce(buildKeyValuePair, ' ').trimEnd();

const buildList = (acc: string, v: HTMLNode) => acc.concat(astToHTML(v));

const buildOpenTag = (o: Tag) =>
    `<${o.tag}${o.attributes ? buildAttributes(o.attributes) : ''}${o.closed ? ' /' : ''}>`;

const buildCloseTag = (o: Tag) => `</${o.tag}>`;

const buildTag = (o: Tag, infix = '') =>
    o.closed ? buildOpenTag(o) : ''.concat(buildOpenTag(o), infix, buildCloseTag(o));

export function astToHTML(o: HTMLNode): string {
    if (isNodeList(o)) {
        return buildTag(o, o.children.reduce(buildList, ''));
    }
    if (isTextContentTag(o)) {
        return o.text;
    }
    if (!isTag(o)) {
        throw new Error(`${JSON.stringify(o)} is an invalid HTML node.`);
    }
    return buildTag(o);
}
