import { describe, expect, test } from '@jest/globals';
import astToHtml from './ast-to-html';
import { HTMLNode } from '../typings';

type ExpectedValue = string;

type Description = string;

describe('From AST-tree to html', () => {
    const testCases: [Description, HTMLNode, ExpectedValue][] = [
        [
            'A button in a div',
            {
                tag: 'div',
                children: [
                    {
                        tag: 'button',
                        children: [{ text: 'One child' }],
                    },
                ],
            },
            '<div><button>One child</button></div>',
        ],
        [
            'Two buttons in a div',
            {
                tag: 'div',
                children: [
                    {
                        tag: 'button',
                        children: [{ text: 'Button 1' }],
                    },
                    {
                        tag: 'button',
                        children: [{ text: 'Button 2' }],
                    },
                ],
            },
            '<div><button>Button 1</button><button>Button 2</button></div>',
        ],
        [
            'A button with attributes in a div',
            {
                tag: 'div',
                children: [
                    {
                        tag: 'button',
                        attributes: { autoFocus: 'true', class: 'button' },
                        children: [{ text: 'Button 1' }],
                    },
                ],
            },
            '<div><button autoFocus="true" class="button">Button 1</button></div>',
        ],
        [
            'A deply nested h1',
            {
                tag: 'div',
                children: [
                    {
                        tag: 'div',
                        children: [
                            {
                                tag: 'h1',
                                children: [{ text: 'Hello' }],
                            },
                        ],
                    },
                ],
            },
            '<div><div><h1>Hello</h1></div></div>',
        ],
        [
            'a style tag with content',
            {
                tag: 'style',
                children: [
                    {
                        text: `
.some-class {
    color: green;
}`,
                    },
                ],
            },
            `<style>
.some-class {
    color: green;
}</style>`,
        ],
        [
            'A selfclosed img tag',
            {
                tag: 'img',
                attributes: { src: '/img.png' },
                closed: true,
            },
            '<img src="/img.png" />',
        ],
        [
            'A h1 with text and a span',
            {
                tag: 'h1',
                children: [
                    {
                        text: 'Hello, ',
                    },
                    {
                        tag: 'span',
                        children: [{ text: 'world' }],
                    },
                ],
            },
            '<h1>Hello, <span>world</span></h1>',
        ],
    ];
    for (const [description, testCase, expectedResult] of testCases) {
        test(description, () => expect(astToHtml(testCase)).toEqual(expectedResult));
    }
});
