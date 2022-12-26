import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  failOnWarn: false,
  rollup: {
    emitCJS: true
  },
  entries: [
    { input: './src/runtime/', outDir: 'dist/runtime', ext: 'js' },
    './src/index'
  ],
  externals: [
    '@nuxt/types'
  ]
})