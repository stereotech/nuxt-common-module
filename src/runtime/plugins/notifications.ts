// import Vue from 'vue'
// import { Vue, Component, Watch, Prop, PropSync } from 'nuxt-property-decorator'
// import { Plugin } from '@nuxt/types'
import { Message, MessageType } from '../../types/notifications'
import { ToastObject } from 'vue-toasted'
import type { Context } from '@nuxt/types';

export class Notification {
  context: Context;
  vDialogElement: HTMLElement;
  vAlertElement: HTMLElement;
  constructor (context: Context) {
    this.context = context;
    this.vDialogElement = document.createElement('v-dialog');
    this.vAlertElement = document.createElement('v-alert')
  }
  
  call (message: Message) {

    this.vDialogElement.setAttribute('id','mari-test-')
    document.body.appendChild(this.vDialogElement)
    
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

//       this.vAlertElement.setAttribute('dense', true)
//       this.vAlertElement.setAttribute('text', true)
//       this.vDialogElement.appendChild(this.vAlertElement)
//       document.body.appendChild(this.vDialogElement)
      
      //this.vAlertElement.setAttribute('type', message.type)
      this.vDialogElement.setAttribute('v-model', message.dialog)  
      console.log('')
      console.log('message: ', message)
    } 
    //else {
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
    //}
  }
}

