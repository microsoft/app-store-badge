import summary from 'rollup-plugin-summary';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';

export default {
  input: 'ms-store-badge.js',
  output: {
    file: 'dist/ms-store-badge.bundled.js',
    format: 'esm',
  },
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    copy({
      targets: [
        { src: 'src/iframe.html', dest: 'dist' },
        { src: 'src/create-your-own.html', dest: 'dist' },
        { src: 'dev/index.html', dest: 'dist', transform: (contents) => contents.toString().replace("../ms-store-badge.js", "https://badgedelivery.z20.web.core.windows.net/ms-store-badge.bundled.js") }
      ]
    }),
    replace({
      'Reflect.decorate': 'undefined'
    }),
    resolve(),
    terser({
      ecma: 2017,
      module: true,
      warnings: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    summary()
  ],
};
