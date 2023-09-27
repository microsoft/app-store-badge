import summary from 'rollup-plugin-summary';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/ms-store-badge.js',
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

      // Mark us as production
      'window.__rollup_injected_env': '"prod"',

      delimiters: ['', ''],
      preventAssignment: true
    }),
    copy({
      targets: [
        { src: 'src/images', dest: 'dist' },
        { src: 'src/staticwebapp.config.json', dest: 'dist' },
        { src: 'src/iframe.html', dest: 'dist' },
        { src: 'src/testinst.exe', dest: 'dist' },
        { src: 'src/index.html', dest: 'dist' },
        { src: 'dist/ms-store-badge.bundled.js', dest: 'dist/badge' }, // Copy to a badge subdirectory so that we can serve the badge script from get.microsoft.com/badge/ms-store-badge.bundled.js
        {
          src: 'src/index.html',
          dest: 'dist',
          transform: (contents) => contents.toString().replace(new RegExp('/ms-store-badge.js', 'g'), 'https://getbadgecdn.azureedge.net/ms-store-badge.bundled.js')
        }
      ]
    }),
    resolve(),
    terser({
      ecma: 2020,
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
