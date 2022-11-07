import { describe, expect, test } from '@jest/globals';

import { Token, HTMLNode } from '../typings';
import tokenize from './html-to-ast-tokenize';
import parse from './html-to-ast-parse';

type Description = string;

describe.only('parse tokens', () => {
    const testCases: [Description, Token[], HTMLNode][] = [
        [
            'p with attribute and text',
            tokenize('<p autoFocus="true">One child</p>'),
            {
                tag: 'p',
                attributes: {
                    autoFocus: 'true',
                },
                children: [{ text: 'One child' }],
            },
        ],
    ];

    for (const [description, testCase, expectedResult] of testCases) {
        test(description, () => expect(parse(testCase)).toEqual(expectedResult));
    }
});
