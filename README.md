# babel-plugin-jsx-svg-icon-inject

This plugin that translates this:
```jsx
<Icon name="eye" />
```

into this:
```jsx
var _iconMarkupEye = require("some-path/eye.svg");

<Icon markup={_iconMarkupEye} />;
```

It does not contain any implementation of the `Icon` component or a loader for the svg icons.

## Usage

Install from the npm and then add this to `.babelrc`:
```json
{
  "plugins": [
    ["jsx-svg-icon-inject", {
      "path": "some-path",
      "tagName": "Icon"
    }]
  ]
}
```

## Options

### `path` (required)

If the path is absolute, it will stay as is in `require`.

If the path is relative (e.g. `./some-path`), it will be resolved using the current working directory, and the path in `require` will be relative wrt the transpiled script.

Else the path is treated as a "package name" and is left as is.

### `tagName` (required)

Only the tags that have this name will be processed.

### `namePropName`
Default: `'name'`

The value of the prop with this name will be used for getting the icon path.

### `markupPropName`
Default: `'markup'`

The value of the prop with this name will be used for setting the icon markup.

## License

Copyright (c) 2017 Rafał Ruciński. Licensed under the MIT license.
