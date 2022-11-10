import { Token } from '../typings';
import { NUL, CLOSE_TAG, OPEN_TAG, characterNames } from './constants';
import {
    isSingleChar,
    isSelfClosingTag,
    isWhitespace,
    isAlphabetic,
    isText,
    isQuoteChar,
    isClosingTag,
} from './html-to-ast-predicate-helpers';

function consumeWhitespace(input: string, nextPosition: number, character: string) {
    while (isWhitespace(character)) {
        const nextCharacter = readCharacter(input, nextPosition);
        character = nextCharacter.character;
        nextPosition = nextCharacter.nextPosition;
    }
    return { nextPosition, character };
}

const newToken = (type: string, literal: string): Token => ({ type, literal });

const produceChar = (
    _input: string,
    nextPosition: number,
    character: keyof typeof characterNames,
) => ({
    nextPosition,
    currentToken: newToken(characterNames[character], character),
});

function produceText(input: string, nextPosition: number, character: string) {
    let str: string = '';
    // refactor me!
    nextPosition--;
    character = input[nextPosition];
    while (character && character !== OPEN_TAG) {
        str += character;
        nextPosition++;
        character = input[nextPosition];
    }
    return {
        nextPosition,
        currentToken: newToken('Text', str),
    };
}

function produceAttributeValue(input: string, nextPosition: number, character: string) {
    let str = '';
    character = input[nextPosition];
    while (!isQuoteChar(character)) {
        str += character;
        nextPosition++;
        character = input[nextPosition];
    }
    nextPosition++;
    return {
        nextPosition,
        currentToken: newToken('ATTRIBUTE_VALUE', str),
    };
}

export function produceIdentifier(
    input: string,
    nextPosition: number,
    character: keyof typeof characterNames,
) {
    const nextToken = read({ input, nextPosition, character }, 'name', isAlphabetic);
    nextPosition = nextToken.nextPosition as number;
    character = nextToken.character as keyof typeof characterNames;

    return {
        nextPosition,
        currentToken: newToken('IDENTIFIER', nextToken.name as string),
    };
}

export function produceSelfClosingTag(_input: string, nextPosition: number) {
    return {
        currentToken: newToken('CLOSE_TAG_END', '/>'),
        nextPosition: nextPosition + 1,
    };
}

export function produceClosingTag(
    input: string,
    nextPosition: number,
    character: keyof typeof characterNames,
) {
    const combinedCurrentAndNextCharacter = character + peekCharacter(input, nextPosition);
    const sign = (
        ![OPEN_TAG, CLOSE_TAG].includes(character) ? combinedCurrentAndNextCharacter : character
    ) as keyof typeof characterNames;
    return {
        currentToken: newToken('CLOSE_TAG_END', sign + '/'),
        nextPosition: nextPosition + 1,
    };
}

type Producer = (
    input: string,
    nextPosition: number,
    character: keyof typeof characterNames,
) => { currentToken: Token; nextPosition: number };

type Predicate = ((c: string) => boolean) | ((ch: string, inp: string, pos: number) => boolean);

type TokenHandler = [Predicate, Producer];

const tokenHandlers: TokenHandler[] = [
    [isSelfClosingTag, produceSelfClosingTag],
    [isClosingTag, produceClosingTag],
    [isText, produceText],
    [isAlphabetic, produceIdentifier],
    [isQuoteChar, produceAttributeValue],
    [isSingleChar, produceChar],
];

const readCharacter = (input: string, nextPosition: number) => ({
    character: nextPosition >= input.length ? NUL : input[nextPosition],
    currentPosition: nextPosition,
    nextPosition: nextPosition + 1,
});

const peekCharacter = (input: string, nextPosition: number) =>
    nextPosition >= input.length ? NUL : input[nextPosition];

function read(
    data: { input: string; nextPosition: number; character: string },
    readType: string,
    pred: (v: string) => boolean,
) {
    let key = '';
    while (pred(data.character)) {
        key = ''.concat(key, data.character);
        const nextCharacter = readCharacter(data.input, data.nextPosition);
        if (!pred(peekCharacter(data.input, data.nextPosition))) break;
        data = Object.assign(data, nextCharacter);
    }
    return { nextPosition: data.nextPosition, character: data.character, [readType]: key };
}

function nextToken(
    input: string,
    _currentPosition: number,
    _nextPosition: number,
    _character: string,
) {
    let currentToken: Token | undefined;
    let { nextPosition, character } = consumeWhitespace(input, _nextPosition, _character);
    for (const [predicate, producer] of tokenHandlers) {
        if (predicate(character, input, nextPosition)) {
            const result = producer(input, nextPosition, character as keyof typeof characterNames);
            currentToken = result.currentToken;
            nextPosition = result.nextPosition;
            break;
        }
    }
    return {
        ...readCharacter(input, nextPosition),
        currentToken,
    };
}

type Data = {
    input: string;
    currentPosition: number;
    nextPosition: number;
    character: string;
    currentToken?: Token;
};
function produceTokens(data: Data, tokens: Token[] = []): Token[] {
    if (data.character === NUL) {
        return tokens;
    }
    const nextData = Object.assign(
        data,
        nextToken(data.input, data.currentPosition, data.nextPosition, data.character),
    );
    return produceTokens(nextData, tokens.concat(nextData.currentToken as Token));
}

export default function tokenize(input: string): Token[] {
    return produceTokens({
        input,
        ...readCharacter(input, 0),
    });
}
