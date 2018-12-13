import Vue from 'vue'
import Router from 'vue-router'

const Invoices = r => require.ensure([], () => r(require('@/page/invoices')), 'invoices') // 我的票夹
const Invoice = r => require.ensure([], () => r(require('@/page/invoice')), 'invoice') // 发票详情
const FormMenu = r => require.ensure([], () => r(require('@/page/form_menu')), 'form_menu') // 发票
const SubmitMessage = r => require.ensure([], () => r(require('@/page/submit_message')), 'submit_message') // 提交申请结果页面
const Show = r => require.ensure([], () => r(require('@/page/show')), 'show') // 发票展示

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/invoices'
    },

    {
      path: '/invoices',
      name: 'invoices',
      component: Invoices,
      meta: {
        auth: 1,
        title: '我的票夹'
      }
    },

    {
      path: '/invoice/:invoiceId',
      name: 'invoice',
      component: Invoice,
      meta: {
        auth: 1,
        title: '发票详情'
      }
    },

    {
      path: '/form_menu',
      name: 'form_menu',
      component: FormMenu,
      meta: {
        auth: 1,
        title: '发票'
      }
    },

    {
      path: '/submit_message/:invoiceId',
      name: 'submit_message',
      component: SubmitMessage,
      meta: {
        auth: 1,
        title: '提交申请'
      }
    },

    {
      path: '/show/:invoiceId',
      name: 'show',
      component: Show,
      meta: {
        auth: 1,
        title: '发票'
      }
    }
  ]
})
