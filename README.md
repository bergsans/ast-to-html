# HTML to AST & AST to HTML

## Installation
```
npm install html-2-ast-2-html
```

## Interface

### HTML -> AST
```
> htmlToAST('<p autoFocus="true">One child</p>');
{
    tag: 'p',
    children: [{ text: 'One child' }],
    attributes: {
        autoFocus: 'true',
    },
}
```

### AST -> HTML
```
> astToHTML({
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
})
<div><button>Button 1</button><button>Button 2</button></div>'
```

### Available functions and types
* tokenize
* parse
* htmlToAST
* astToHTML
* types

## Setup
```
yarn
```

## Tests
```
yarn test
```
