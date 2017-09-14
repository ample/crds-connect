import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify';
import typescript  from 'rollup-plugin-typescript2';
import strip from 'rollup-plugin-strip';
import gzip from "rollup-plugin-gzip";

export default {
  input: 'src/main.js',
  output: {
    file: 'src/build.js', // output a single application bundle
    format: 'iife'
  },
  sourceMap: false,
  onwarn: function(warning) {
    // Skip certain warnings

    // should intercept ... but doesn't in some rollup versions
    if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }

    // console.warn everything else
    console.warn( warning.message );
  },
  plugins: [
    typescript(),
    nodeResolve({jsnext: true, module: true}),
    commonjs({
      include: [
        'node_modules/rxjs/**',
        'node_modules/ng2-toastr/**',
        'node_modules/ng-select/**',
        'node_modules/angular2-cookie/**',
        'node_modules/angular2-google-maps/core/**',
        'node_modules/crds-ng2-content-block/src/content-block/**'
      ]
    }),
    {
      name: 'replace moment imports',
      transform: code => ({
        code: code.replace(/import\s*\*\s*as\s*moment/g, 'import moment'),
        map: { mappings: '' }
      })
    },
    uglify(),
    strip({ debugger: true }),  // Set to false to leave debugging in
    gzip()
  ]
};
