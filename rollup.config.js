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
    replace({
      'Reflect.decorate': 'undefined',

      // In the ms-store-badge.js, swap out the local iframe for the production deployed iframe
      '../src/iframe.html': 'https://black-water-0eaf5100f.azurestaticapps.net/iframe.html',

      delimiters: ['', '']
    }),
    copy({
      targets: [
        { src: 'src/iframe.html', dest: 'dist' },

        // When copying create-your-own.html, use production URL for script
        { src: 'src/create-your-own.html', dest: 'dist', transform: (contents) => contents.toString().replace(new RegExp('../ms-store-badge.js', 'g'), 'https://badgedelivery.z20.web.core.windows.net/ms-store-badge.bundled.js') },

        // When copying index.html, use the production URL for script
        { src: 'dev/index.html', dest: 'dist', transform: (contents) => contents.toString().replace(new RegExp('../ms-store-badge.js', 'g'), 'https://badgedelivery.z20.web.core.windows.net/ms-store-badge.bundled.js') },
      ]
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
