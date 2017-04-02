import babel from 'rollup-plugin-babel';


const pkg = require('./package.json');
const external = ['fs', 'path', ...Object.keys(pkg.dependencies)];

export default {
  entry: 'src/index.js',
  plugins: [
    babel({
      plugins: [
        ['transform-object-rest-spread', { useBuiltIns: true }],
      ],
      presets: [
        ['es2015', { modules: false }],
      ],
    }),
  ],
  external,
  targets: [
    {
      dest: pkg.main,
      format: 'cjs',
    },
  ]
};
