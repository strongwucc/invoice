export default {
  auth: {
    getOpenid: ''
  },
  verifyTemplate: {
    1: 'getIskjfpbytemplateCode',
    3: 'getIskjfpbytaxpayerNum'
  },
  getTemplate: {
    1: 'getTemplateInvoiceInfo',
    2: 'getReserveInvoiceInfo',
    3: 'getSellerInfo'
  },
  setBuyerInfo: {
    1: 'setBuyerInfoAndInvoiceTemplate',
    2: 'setBuyerInfoAndInvoice',
    3: 'setBuyerInfoAndReserveInvoice'
  },
  getTitleInfo: 'getTitleInfo',
  getInvoiceInfo: 'getInvoiceInfo',
  queryInvoiceList: 'queryInvoiceList', // 获取发票列表（分页）
  delInvoice: '', // 删除发票
  invoice: '' // 发票明细
}
