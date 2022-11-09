import { describe, expect, test } from '@jest/globals';

import { Token } from '../typings';
import tokenize from './html-to-ast-tokenize';

type ExpectedValue = Token[];

type Description = string;

type Code = string;

describe('tokenize', () => {
    const testCases: [Description, Code, ExpectedValue][] = [
        [
            'p with attribute and text',
            '<p autoFocus="true">One child</p>',
            [
                { type: 'OPEN_TAG', literal: '<' },
                { type: 'IDENTIFIER', literal: 'p' },
                { type: 'IDENTIFIER', literal: 'autoFocus' },
                { type: 'ASSIGN', literal: '=' },
                { type: 'ATTRIBUTE_VALUE', literal: 'true' },
                { type: 'CLOSE_TAG', literal: '>' },
                { type: 'Text', literal: 'One child' },
                { type: 'CLOSE_TAG_END', literal: '</' },
                { type: 'IDENTIFIER', literal: 'p' },
                { type: 'CLOSE_TAG', literal: '>' },
            ],
        ],
        [
            'div with nested p and test',
            '<div id="mydiv"><p>Hello</p></div>',
            [
                { type: 'OPEN_TAG', literal: '<' },
                { type: 'IDENTIFIER', literal: 'div' },
                { type: 'IDENTIFIER', literal: 'id' },
                { type: 'ASSIGN', literal: '=' },
                { type: 'ATTRIBUTE_VALUE', literal: 'mydiv' },
                { type: 'CLOSE_TAG', literal: '>' },
                { type: 'OPEN_TAG', literal: '<' },
                { type: 'IDENTIFIER', literal: 'p' },
                { type: 'CLOSE_TAG', literal: '>' },
                { type: 'Text', literal: 'Hello' },
                { type: 'CLOSE_TAG_END', literal: '</' },
                { type: 'IDENTIFIER', literal: 'p' },
                { type: 'CLOSE_TAG', literal: '>' },
                { type: 'CLOSE_TAG_END', literal: '</' },
                { type: 'IDENTIFIER', literal: 'div' },
                { type: 'CLOSE_TAG', literal: '>' },
            ],
        ],
        [
            'p with attribute and span text',
            '<p style="color:green;" id="hello">One <span>child</span></p>',
            [
                { type: 'OPEN_TAG', literal: '<' },
                { type: 'IDENTIFIER', literal: 'p' },
                { type: 'IDENTIFIER', literal: 'style' },
                { type: 'ASSIGN', literal: '=' },
                { type: 'ATTRIBUTE_VALUE', literal: 'color:green;' },
                { type: 'IDENTIFIER', literal: 'id' },
                { type: 'ASSIGN', literal: '=' },
                { type: 'ATTRIBUTE_VALUE', literal: 'hello' },
                { type: 'CLOSE_TAG', literal: '>' },
                { type: 'Text', literal: 'One ' },
                { type: 'OPEN_TAG', literal: '<' },
                { type: 'IDENTIFIER', literal: 'span' },
                { type: 'CLOSE_TAG', literal: '>' },
                { type: 'Text', literal: 'child' },
                { type: 'CLOSE_TAG_END', literal: '</' },
                { type: 'IDENTIFIER', literal: 'span' },
                { type: 'CLOSE_TAG', literal: '>' },
                { type: 'CLOSE_TAG_END', literal: '</' },
                { type: 'IDENTIFIER', literal: 'p' },
                { type: 'CLOSE_TAG', literal: '>' },
            ],
        ],
    ];

    for (const [description, testCase, expectedResult] of testCases) {
        test(description, () => {
            expect(JSON.stringify(tokenize(testCase))).toEqual(JSON.stringify(expectedResult));
        });
    }
});
