# babel-plugin-jsx-svg-inject

> Add SVG file imports for React components

This plugin can transform this:
```jsx
<SVG name="eye" />
```

into this:
```jsx
import _svgContentsSomePathEye from "./some-path/eye.svg";

<SVG contents={_svgContentsSomePathEye} />;
```

The main benefit here is that explicit imports for the images are not needed and instead a single component can be used.

The plugin does not contain any implementation of the component that receives the contents of the SVG image or a loader for those images.

Here are some Webpack loaders that could be used with this plugin:
* [react-svg-loader](https://github.com/boopathi/react-svg-loader)

## Usage

Install from the npm and then add this to `.babelrc`:
```json
{
  "plugins": [
    "jsx-svg-inject"
  ]
}
```

## Options

### `path`
Default: `'.'`

The path that wll be used in the resulting import declaration.

Relative paths (e.g. `./some-path`), will be resolved using the current working directory.

### `tagName`
Default: `'SVG'`

The name of the React component that will be processed.

### `namePropName`
Default: `'name'`

The value of the prop with this name will be used for getting the icon path.

### `contentsPropName`
Default: `'contents'`

The value of the prop with this name will be used for setting the icon contents.

## License

Copyright (c) 2017 Rafał Ruciński. Licensed under the MIT license.
