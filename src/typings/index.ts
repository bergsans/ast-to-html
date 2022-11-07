export type Attributes = Record<string, string>;

export type Tag = {
    tag: string;
    attributes?: Attributes;
    children?: HTMLNode[];
    closed?: true;
};

export type TextContent = {
    text: string;
};

export type HTMLNode = Tag | TextContent;

export type TokenType = string;

export type Literal = string;

export type Token = {
    type: TokenType;
    literal: Literal;
    name?: string;
};
