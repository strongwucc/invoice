<template>
  <div class="invoice-page" :class="{fail: invoiceData.typeKey && invoiceData.typeKey}">
    <div class="invoice-image" v-if="invoiceData.typeKey && invoiceData.typeKey === 'success'">
      <!--<img :src="invoiceData.imageUrl">-->
      <img src="../../src/assets/img/invoice.png">
    </div>
    <div class="notice-area" v-if="invoiceData.typeKey && invoiceData.typeKey !== 'success'">
      <!--<div class="company">{{invoiceData.companyName}}</div>-->
      <!--<div class="amount">{{invoiceData.amount}}</div>-->
      <!--<div class="line"></div>-->
      <div class="icon">
        <img v-if="invoiceData.typeKey === 'pending'" src="../../src/assets/img/ic_success@2x.png"/>
        <img v-else src="../../src/assets/img/ic_fail@2x.png"/>
      </div>
      <div class="typeValue">{{invoiceData.typeValue}}</div>
      <div class="notice">{{invoiceData.notice}}</div>
      <!--<div class="dateTime">申请时间：{{invoiceData.dateTime}}</div>-->
    </div>
    <div class="my-invoices" v-if="invoiceData.typeKey && invoiceData.typeKey === 'success'" @click.stop="myInvoices">
      查看我的票夹
    </div>
    <div class="download-area" v-if="invoiceData.typeKey && invoiceData.typeKey === 'success'" @click.stop="download">
      下载PDF文件
    </div>
  </div>
</template>

<script>
export default {
  name: 'show',
  data () {
    return {
      invoiceData: {
        invoiceId: 0,
        companyName: '',
        typeKey: '',
        typeValue: '',
        notice: '',
        amount: '',
        payment: '',
        dateTime: '',
        imageUrl: '',
        pdfUrl: '',
        merContact: ''
      }
    }
  },
  mounted () {
    this.invoiceData.invoiceId = this.$route.params.invoiceId
    this.getInvoiceDetail()
  },
  methods: {
    getInvoiceDetail () {
      this.$vux.loading.show({text: ''})
      setTimeout(() => {
        this.$vux.loading.hide()
        let data = {
          companyName: '深圳家乐福有限公司',
          typeKey: 'success',
          typeValue: '开票处理中',
          notice: '开票处理中提示信息',
          amount: '￥235',
          payment: '上海易通金服有限公司',
          dateTime: '2018.04.05',
          imageUrl: '../../src/assets/img/invoice.png',
          pdfUrl: '',
          merContact: '8765678765'
        }
        switch (this.invoiceData.invoiceId) {
          case '1':
            data = {
              companyName: '深圳家乐福有限公司',
              typeKey: 'success',
              typeValue: '开票处理中',
              notice: '开票处理中提示信息',
              amount: '￥235',
              payment: '上海易通金服有限公司',
              dateTime: '2018.04.05',
              imageUrl: '../../src/assets/img/invoice.png',
              pdfUrl: '',
              merContact: '8765678765'
            }
            break
          case '2':
            data = {
              companyName: '深圳家乐福有限公司',
              typeKey: 'pending',
              typeValue: '开票处理中',
              notice: '开票处理中提示信息',
              amount: '￥235',
              payment: '上海易通金服有限公司',
              dateTime: '2018.04.05',
              imageUrl: '../../src/assets/img/invoice.png',
              pdfUrl: '',
              merContact: '8765678765'
            }
            break
          case '3':
            data = {
              companyName: '深圳家乐福有限公司',
              typeKey: 'fail',
              typeValue: '开票处理中',
              notice: '开票处理中提示信息',
              amount: '￥235',
              payment: '上海易通金服有限公司',
              dateTime: '2018.04.05',
              imageUrl: '../../src/assets/img/invoice.png',
              pdfUrl: '',
              merContact: '8765678765'
            }
            break
          default:
            break
        }

        this.invoiceData = Object.assign({}, this.invoiceData, data)
      }, 2000)

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
      var ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) === 'micromessenger') {
        this.$router.push('/invoices')
      } else {
        var vm = this
        this.$vux.confirm.show({
          title: '提示',
          content: '在"微信"中打开链接吗',
          dialogTransition: 'vux-dialog',
          onConfirm () {
            console.log('要在微信中打开...')
          }
        })
      }
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
    .download-area {
      bottom: 53px;
    }
  }
  .fail {
    background-color: #FFFFFF;
  }
</style>
