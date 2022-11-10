import { describe, expect, test } from '@jest/globals';

import { Token, HTMLNode, htmlToAST } from '../src';

type Description = string;

describe('html to AST', () => {
    const testCases: [Description, string, HTMLNode][] = [
        [
            'p with attribute and text',
            '<p autoFocus="true">One child</p>',
            {
                tag: 'p',
                children: [{ text: 'One child' }],
                attributes: {
                    autoFocus: 'true',
                },
            },
        ],
    ];

    for (const [description, testCase, expectedResult] of testCases) {
        test(description, () => expect(htmlToAST(testCase)).toEqual(expectedResult));
    }
});
