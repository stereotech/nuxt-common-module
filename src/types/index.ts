import { } from '@nuxt/types'
import { Helpers } from '../runtime/plugins/helpers'
import { Notification } from '../runtime/plugins/notifications'
import { ModuleOptions } from '..'
import { Common } from './common'

declare module 'vue/types/vue' {
  interface Vue {
    $helpers: Helpers
    // $notify: Notification
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $helpers: Helpers
    // $notify: Notification
  }
}

declare module '@nuxt/types' {
  interface Context {
    // $common: Common
    $helpers: Helpers
    // $notify: Notification
  }

  interface NuxtAppOptions {
    // $common: Common
    $helpers: Helpers
    // $notify: Notification
  }

  // interface Configuration {
  //   common?: Partial<ModuleOptions>
  // }
}
