<template>
  <div class="invoice-page">
    <div class="invoice-image" v-if="info.status && info.status === '0000'">
      <!--<img :src="info.imageUrl">-->
      <img :src="info.invoiceImg">
    </div>
    <div class="notice-area" v-if="info.status && info.status !== '0000'">
      <div class="company">{{info.enterpriseName}}</div>
      <div class="amount">{{info.invoiceAmount}}</div>
      <div class="line"></div>
      <div class="icon">
        <img v-if="info.status === '7777'" src="../../src/assets/img/ic_success@2x.png"/>
        <img v-else src="../../src/assets/img/ic_fail@2x.png"/>
      </div>
      <div class="typeValue" v-if="info.status === '7777'">开票申请已提交</div>
      <div class="typeValue" v-else>开票失败</div>
      <div class="notice" v-if="info.status === '7777'">{{info.notice}}</div>
      <div class="notice" v-else>{{info.notice}}</div>
      <div class="dateTime">申请时间：{{info.dateTime}}</div>
    </div>
    <div class="share-area" v-if="info.status && info.status === '0000'" @click="share">
      分享给朋友
    </div>
    <div class="download-area" v-if="info.status && info.status === '0000'" @click.stop="download">
      下载PDF文件
    </div>
    <div class="contact-area" v-if="info.status && info.status !== '0000'">
      <a :href="'tel:' + info.merContact">联系商家：{{info.merContact}}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'invoice',
  data () {
    return {
      invoiceReqSerialNo: 0,
      info: {
        status: '0000',
        invoicePdf: 'http://ceshi6.sdykt.com.cn:1280/03100160021138570170.pdf',
        invoiceImg: '',
        enterpriseName: '',
        invoiceAmount: '',
        notice: '',
        dateTime: '',
        merContact: ''
      }
    }
  },
  mounted () {
    this.invoiceReqSerialNo = this.$route.params.invoiceReqSerialNo
    this.getInvoiceDetail()
  },
  methods: {
    getInvoiceDetail () {
      this.$vux.loading.show({text: ''})
      this.$http.post(this.API.getInvoiceInfo, {invoiceReqSerialNo: this.invoiceReqSerialNo}).then(res => {
        this.$vux.loading.hide()
        if (res.return_code === '0000') {
          this.info = res.data.info
        } else {
          // this.$router.replace('/error/出错啦/' + res.return_message)
        }
      })
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
        top: 563px;
      }
      .notice {
        height: 40px;
        font-size: 28px;
        top: 630px;
      }
      .dateTime {
        height: 68px;
        font-size: 26px;
        bottom: 42px;
        color: #999999;
      }
    }
    .share-area, .download-area, .contact-area {
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
    .share-area {
      bottom: 161px;
    }
    .download-area {
      bottom: 53px;
    }
    .contact-area {
      bottom: 41px;
      a {
        padding: 22px 168px 22px 170px;
        color: #333333;
        font-size: 32px;
      }
    }
  }
</style>
