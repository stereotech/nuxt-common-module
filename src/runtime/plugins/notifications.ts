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
  
  call (message: Message) {

        let Nf = Vue.component('notificationDialog', {
        render: function (createElement) {

          const alertVNode = createElement('v-alert', {
            attrs: { type: message.type, icon: false },
            style: {
              width: '100%'
            }
          },
            message.text)

          const closeButtonVNode = createElement('v-btn', {
            attrs: {
              outlined: true,
              color: 'primary',
              block: false,
              inline: true
            },
            on: {
              click: () => {
                this.$destroy()
                this.$el?.parentNode?.removeChild(this.$el);
              }
            }
          }, 'Close')

          const cardDivVNode = createElement('v-card', {
            class: ['pa-2', 'd-flex', 'flex-column', 'align-end',]
          },
            [alertVNode, closeButtonVNode]
          )

          const dialogDivVNode = createElement('div', {
            class: ['v-dialog', 'v-dialog--active', 'v-dialog--persistent'],
            style: {
              transformOrigin: 'center center',
              maxWidth: '600px'
            }
          },
            [cardDivVNode])

          const dialogContentDivVNode = createElement('div', {
            class: {
              'v-dialog__content': true,
              'v-dialog__content--active': true
            },
            style: {
              zIndex: 204
            }
          },
            [dialogDivVNode])

          const overlayDivVNode = createElement('div', {
            class: {
              'v-overlay__scrim': true,
            },
            style: {
              backgroundColor: 'rgb(33, 33, 33, 0.46)',
              zIndex: 203,
            }
          },
            [dialogContentDivVNode])

          return overlayDivVNode
        },
      })
        
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
//    document.body.clientWidth
    
    if(message.dialog){
        let component = new Nf()
        component.$mount()
        document.getElementById('app')?.appendChild(component.$el)
    } 
    else {
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

