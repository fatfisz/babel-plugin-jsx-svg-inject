# babel-plugin-jsx-svg-inject

> Add SVG file imports for React components

This plugin can transform this:
```jsx
<Icon svgName="eye" />
```

into this:
```jsx
var _svgContents = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="100"/></svg>;
<Icon svgName="eye" svgContents={_svgContents} />;
```

The main benefit here is that explicit imports for the images are not needed and instead a single component can be used.

The plugin includes the contents of the file as a JSX element, so there is no need for additional plugins or loaders.
There is also an option to have the imports added instead (`useImports`).

## How does it work?

The plugin searches for a specific prop on JSX Elements (by default it's `'svgName'`) and adds the contents of the file as a JSX element (or a file import) for each one.
The exported value is put in an additional prop (by default it's `'svgContents'`).

### Upgrading to v.5

The plugin now outputs JSX elements instead of text.
This has the benefit of not needing to use `dangerouslySetInnerHTML`, which in turn solves a problem React has with swapping SVGs in IE 11.
The plugin encourages a use of very few (in most cases one) image components, so the changes should be minimal.

For example, if you previously had a component like this:

```jsx
export default function Image({ svgName, svgContents, ...props }) {
  return <svg {...props} dangerouslySetInnerHTML={{ __html: svgContents }} />;
}

Image.propTypes = {
  svgContents: PropTypes.string.isRequired,
  svgName: PropTypes.string.isRequired,
};
```

it could be rewritten like so:

```jsx
export default function Image({ svgName, svgContents, ...props }) {
  return <svg {...props}>{svgContents}</svg>;  // svgContents is used the same as React children
}

Image.propTypes = {
  svgContents: PropTypes.node.isRequired,  // The type has changed
  svgName: PropTypes.string.isRequired,
};
```

### Upgrading to v.4

The plugin now inlines the source of the image by default.
Previously another plugin or loader was needed for that (an import was added instead), which could be quite bothersome.

The upgrade should be painless if no complicated logic was used for importing the files.
In case the imports are preferred, please use the `useImports` option.

### Upgrading to v.3

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

### `nameProp`
Default: `'svgName'`

The value of the prop with this name will be used for getting the SVG path.

### `contentsProp`
Default: `'svgContents'`

The value of the prop with this name will be used for passing the SVG contents.

### `unwrap`
Default: `false`

If set to `true`, the `<svg>` element will be stripped and its props will be passed to the resulting element.

For example, with this option enabled and a file like this:
```jsx
<SVG svgName="some-path/foo" />
```

the output might be something similar to this:
```jsx
var _svgContents = <rect x=\"10\" y=\"10\" width=\"100\" height=\"100\" />;
<SVG svgName="some-path/foo" svgContents={_svgContents} viewBox="0 0 120 120" height="120" width="120" xmlns="http://www.w3.org/2000/svg" />;
```

When the `<svg>` element has multiple children, they have keys provided automatically.

### `useImports`
Default: `false`

If `true`, a relative import will be added instead of an inlined content.
This was the default behavior before v.4.

### `root`
Default: `'.'`

The path that will be used in the resulting import declaration.

Relative paths (e.g. `./some-path`), will be resolved using the current working directory.

## License

Copyright (c) 2017 Rafał Ruciński. Licensed under the MIT license.
