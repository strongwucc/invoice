<template>
  <div class="invoice-page" >
    <div class="invoice-image">
      <img :src="imgUrl">
    </div>
    <div class="my-invoices" :class="{'has-brother': isWx}" @click.stop="myInvoices">
      查看我的票夹
    </div>
    <div class="download-area" v-if="!isWx" @click.stop="download">
      下载发票
    </div>
  </div>
</template>

<script>
import Valid from '../utils/valid'
export default {
  name: 'show',
  data () {
    return {
      invoiceReqSerialNo: '',
      pdfUrl: '',
      imgUrl: ''
    }
  },
  computed: {
    isWx () {
      return Valid.check_weixin()
    }
  },
  mounted () {
    this.invoiceReqSerialNo = this.$route.query.invoiceReqSerialNo
    this.getInvoiceDetail()
  },
  methods: {
    getInvoiceDetail () {
      this.$vux.loading.show({text: ''})
      this.$http.get(this.API.getInvoiceInfo + '?invoiceReqSerialNo=' + this.invoiceReqSerialNo).then(res => {
        this.$vux.loading.hide()
        if (res.return_code === '0000') {
          this.pdfUrl = res.data.info.invoicePdf
          this.imgUrl = res.data.info.invoiceImg
        } else {
          this.$router.replace('/error/出错啦/' + res.return_message)
        }
      })

      // this.$http.post(this.API.invoice, {}).then(res => {
      //   this.loading = false
      //   this.invoiceData = res.invoiceData
      // })
    },
    share () {
      console.log('share...')
    },
    download () {
      console.log('downloading...')
      this.saveFile(this.imgUrl, 'invoice.png')
    },
    saveFile (data, filename) {
      const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      saveLink.href = data
      saveLink.download = filename

      const event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      saveLink.dispatchEvent(event)
    },
    myInvoices () {
      this.$router.push('/invoices')
      // var ua = window.navigator.userAgent.toLowerCase()
      // if (ua.match(/MicroMessenger/i) === 'micromessenger') {
      //   this.$router.push('/invoices')
      // } else {
      //   var vm = this
      //   this.$vux.confirm.show({
      //     title: '提示',
      //     content: '在"微信"中打开链接吗',
      //     dialogTransition: 'vux-dialog',
      //     onConfirm () {
      //       console.log('要在微信中打开...')
      //     }
      //   })
      // }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/css/common";
  .invoice-page {
    height: 100%;
    .invoice-image {
      width: 100%;
      height: 700px;
      background-color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 640px;
        height: 414px;
        -moz-box-shadow:10px 10px 40px #E8E8E8,10px -10px 40px #E8E8E8,-10px 10px 40px #E8E8E8,-10px -10px 40px #E8E8E8;
        -webkit-box-shadow:10px 10px 40px #E8E8E8,10px -10px 40px #E8E8E8,-10px 10px 40px #E8E8E8,-10px -10px 40px #E8E8E8;
        box-shadow:10px 10px 40px #E8E8E8,10px -10px 40px #E8E8E8,-10px 10px 40px #E8E8E8,-10px -10px 40px #E8E8E8;
      }
    }
    .notice-area {
      width: 690px;
      background-color: #FFFFFF;
      position: absolute;
      top: 21px;
      left: 29px;
      bottom: 154px;
      border-radius: 10px;
      .company, .amount, .line, .icon, .typeValue, .notice, .dateTime {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
      }
      .company {
        height: 45px;
        font-size: 32px;
        top: 54px;
      }
      .amount {
        height: 50px;
        font-size: 36px;
        top: 118px;
      }
      .line {
        width: 570px;
        height: 1px;
        top: 220px;
        background-color: #E5E5E5;
      }
      .icon {
        width: 150px;
        height: 150px;
        top: 361px;
        img {
          width: 150px;
          height: 150px;
        }
      }
      .typeValue {
        width: 90%;
        height: 50px;
        font-size: 36px;
        color: #F5713D;
        top: 563px;
      }
      .notice {
        height: 40px;
        font-size: 28px;
        top: 630px;
        color: #666666;
      }
      .dateTime {
        height: 68px;
        font-size: 26px;
        bottom: 42px;
        color: #999999;
      }
    }
    .my-invoices, .download-area {
      width: 690px;
      height: 88px;
      background-color: #FFD726;
      font-size: 32px;
      line-height: 88px;
      text-align: center;
      border-radius: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%);
    }
    .my-invoices {
      bottom: 161px;
    }
    .has-brother {
      bottom: 53px;
    }
    .download-area {
      bottom: 53px;
    }
  }
  .fail {
    background-color: #FFFFFF;
  }
</style>
