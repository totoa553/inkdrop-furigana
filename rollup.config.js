import { nodeResolve } from '@rollup/plugin-node-resolve'

export default [
  {
    input: 'src/index.js',
    output: {
      dir: 'lib',
      format: 'cjs',
      strict: true,
      sourcemap: true,
      exports: 'auto'
    },
    external: ['react', 'codemirror', 'inkdrop'],
    plugins: [
      nodeResolve()
    ]
  }
]
