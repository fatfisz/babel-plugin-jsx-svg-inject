# babel-plugin-jsx-svg-inject

> Add SVG file imports for React components

This plugin can transform this:
```jsx
<Icon svgName="eye" />
```

into this:
```jsx
import _svgContentsSomePathEyeSvg from "./some-path/eye.svg";
<Icon svgContents={_svgContentsSomePathEyeSvg} />;
```

The main benefit here is that explicit imports for the images are not needed and instead a single component can be used.

The plugin does not contain any implementation of the component that receives the contents of the SVG image or a loader for those images.

Here are some Webpack loaders that could be used with this plugin:
* [react-svg-loader](https://github.com/boopathi/react-svg-loader)

## How does it work?

The plugin searches for a specific prop on JSX Elements (by default it's `'svgName'`) and adds an import to the file for each one.
The exported value is put in a replacement prop (by default it's `'svgContents'`) and the original prop is removed.

The path in the import will be either relative to the processed file or an absolute one (depends on the `root` option).

### Note about v.2

In version 2.x and below the plugin looked for a JSX element with a specific name.
This was less flexible - there was no simple way of having SVG injected into different tags.
This was changed in version 3.0.0 and the JSX property now has the role that the tag previously had.

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

### `root`
Default: `'.'`

The path that will be used in the resulting import declaration.

Relative paths (e.g. `./some-path`), will be resolved using the current working directory.

### `nameProp`
Default: `'svgName'`

The value of the prop with this name will be used for getting the SVG path.

### `contentsProp`
Default: `'svgContents'`

The value of the prop with this name will be used for setting the SVG contents.

## License

Copyright (c) 2017 Rafał Ruciński. Licensed under the MIT license.
