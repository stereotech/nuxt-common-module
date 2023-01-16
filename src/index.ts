import { Module } from '@nuxt/types'
import { resolve } from 'upath'

export * from './types'

export interface ModuleOptions {
  a: boolean
  b: number
  c: string
}

const commonModule: Module<ModuleOptions> = function (moduleOptions) {
  const { nuxt, addPlugin } = this

  const defaults: ModuleOptions = {
    a: true,
    b: 0,
    c: ''
  }
  const runtimeDir = resolve(__dirname, 'runtime')
  nuxt.options.alias['~common'] = runtimeDir
  nuxt.options.build.transpile.push(runtimeDir)
  addPlugin({
    filename: 'common.js',
    src: resolve(runtimeDir, 'plugin.js'),
    // options: {
    //   defaults
    // }
  })
}

export default commonModule

export const meta = require('../package.json')
