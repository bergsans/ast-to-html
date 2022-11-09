import { SPACE, TAB, RETURN, NEW_LINE, CLOSE_TAG, ASSIGN, OPEN_TAG } from './constants';

const isAngleBracket = (currentCharacter: string) =>
    [OPEN_TAG, CLOSE_TAG].includes(currentCharacter);

const isAssign = (currentCharacter: string) => currentCharacter === ASSIGN;

export const isSingleChar = (character: string) =>
    [isAngleBracket, isAssign].reduce(
        (isTrue: boolean, pred: (x: string) => boolean) => (!isTrue ? pred(character) : true),
        false,
    );

export const isWhitespace = (character: string) =>
    [SPACE, RETURN, NEW_LINE, TAB].includes(character);

export const isAlphabetic = (character: string) =>
    character.toLowerCase() >= 'a' && character.toLowerCase() <= 'z';

export const isText = (char: string, input: string, nextPosition: number) =>
    input[nextPosition - 2] === CLOSE_TAG && isAlphabetic(char);

export const isQuoteChar = (character: string) => character === '"';

export const isClosingTag = (character: string, input: string, nextPosition: number) =>
    character === OPEN_TAG && input[nextPosition] === '/';
