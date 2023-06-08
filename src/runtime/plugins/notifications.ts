// import Vue from 'vue'
// import { Vue, Component, Watch, Prop, PropSync } from 'nuxt-property-decorator'
// import { Plugin } from '@nuxt/types'
import { Message, MessageType } from '../../types/notifications'
import { ToastObject } from 'vue-toasted'
import type { Context } from '@nuxt/types';

export class Notification {
  context: Context;
  constructor (context: Context) {
    this.context = context;
  }
  
  let vDialogElement = document.createElement('v-dialog')
  vDialogElement.setAttribute('id','mari-test-')
  let vAlertElement = document.createElement('v-alert')
  vAlertElement.setAttribute('dense', true)
  vAlertElement.setAttribute('text', true)
  vDialogElement.appendChild(vAlertElement)
  document.body.appendChild(vDialogElement)

  call (message: Message) {

    const closeAction = {
      text: '',
      icon: 'close',
      onClick: (e: any, toastObject: ToastObject) => {
        toastObject.goAway(0)
      }
    }

    const iconFromType = (type: MessageType) => {
      if (type === 'success') {
        return 'check'
      }
      else if (type === 'error') {
        return 'alert-circle'
      }
      else {
        return 'information'
      }
    }
    document.body.clientWidth
    
    if(message.dialog){
      vAlertElement.setAttribute('type', message.type)
      vDialogElement.setAttribute('v-model', true)  
    } else {
    this.context.app.$toast.show(message.text, {
      icon: iconFromType(message.type),
      type: message.type,
      fullWidth: document.body.clientWidth <= 960,
      fitToScreen: document.body.clientWidth <= 960,
      duration: message.timeout || 6000,
      action: [
        ...(message.actions || []).map(a => {
          return {
            text: a.text,
            onClick: (e: any, toastObject: ToastObject) => {
              a.onClick(e)
              if (a.closeOnClick) {
                toastObject.goAway(0)
              }
            }
          }
        }),
        closeAction]
    })
    }
  }
}

