import { } from '@nuxt/types'
import { Helpers } from '../runtime/plugins/helpers'
import { Notification } from '../runtime/plugins/notifications'
import { ModuleOptions } from '..'
import { Common } from './common'

declare module '@nuxt/types' {
  interface Context {
    $common: Common
    $helpers: Helpers
    $notify: Notification
  }

  interface NuxtAppOptions {
    $common: Common
    $helpers: Helpers
    $notify: Notification
  }

  interface Configuration {
    common?: Partial<ModuleOptions>
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    // $common: Common
    $helpers: Helpers
    $notify: Notification
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  interface Store<S> {
    $common: Common
    $helpers: Helpers
    $notify: Notification
  }
}