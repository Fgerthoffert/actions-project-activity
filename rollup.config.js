// See: https://rollupjs.org/introduction/

import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const config = {
  input: { index: 'src/index.ts', main: 'src/main.ts' },
  output: {
    esModule: true,
    dir: 'dist/',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    typescript(),
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    {
      name: 'string',

      transform(code, id) {
        if (id.endsWith('.html')) {
          return {
            code: `export default ${JSON.stringify(code).replaceAll('<', '\\u003C')};`,
            map: { mappings: '' }
          }
        }
      }
    }
  ]
}

export default config
