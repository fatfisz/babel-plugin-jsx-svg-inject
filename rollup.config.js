import babel from 'rollup-plugin-babel';


const pkg = require('./package.json');
const external = ['fs', 'path', ...Object.keys(pkg.dependencies)];

export default {
  entry: 'src/index.js',
  plugins: [
    babel({
      babelrc: false,
      plugins: [
        ['transform-object-rest-spread', { useBuiltIns: true }],
      ],
      presets: [
        ['env', {
          targets: {
            node: 6,
          },
          exclude: [
            'transform-regenerator',
          ],
          loose: true,
          modules: false,
        }],
      ],
    }),
  ],
  external,
  targets: [
    {
      dest: pkg.main,
      format: 'cjs',
    },
  ],
  interop: false,
};
