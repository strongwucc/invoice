import Vue from 'vue'
import Router from 'vue-router'

const Invoices = r => require.ensure([], () => r(require('@/page/invoices')), 'invoices') // 我的票夹
const Invoice = r => require.ensure([], () => r(require('@/page/invoice')), 'invoice') // 发票详情

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
    }
  ]
})
