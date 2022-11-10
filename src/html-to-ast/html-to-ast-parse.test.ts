import { describe, expect, test } from '@jest/globals';

import { Token, HTMLNode } from '../typings';
import tokenize from './html-to-ast-tokenize';
import parse from './html-to-ast-parse';

type Description = string;

describe('parse tokens', () => {
    const testCases: [Description, Token[], HTMLNode][] = [
        [
            'p with attribute and text',
            tokenize('<p autoFocus="true">One child</p>'),
            {
                tag: 'p',
                children: [{ text: 'One child' }],
                attributes: {
                    autoFocus: 'true',
                },
            },
        ],
        [
            'complex, nested div',
            tokenize('<div id="mydiv"><div><p>Hello</p></div></div>'),
            {
                tag: 'div',
                children: [
                    {
                        tag: 'div',
                        children: [
                            {
                                tag: 'p',
                                children: [{ text: 'Hello' }],
                            },
                        ],
                    },
                ],
                attributes: {
                    id: 'mydiv',
                },
            },
        ],
        [
            'Self-closed tag',
            tokenize('<img src="hello.png" />'),
            {
                tag: 'img',
                attributes: {
                    src: 'hello.png',
                },
                closed: true,
            },
        ],
    ];

    for (const [description, testCase, expectedResult] of testCases) {
        test(description, () => expect(parse(testCase)).toEqual(expectedResult));
    }
});
