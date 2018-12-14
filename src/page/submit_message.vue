<template>
  <div class="invoice-page">
    <div class="notice-area">
      <div class="company">{{merchantName}}</div>
      <div class="amount" v-if="amount > 0">{{amount}}</div>
      <div class="line"></div>
      <div class="icon">
        <img src="../../src/assets/img/ic_success@2x.png"/>
      </div>
      <div class="typeValue">开票申请已提交</div>
      <div class="notice">系统将自动为您开具发票</div>
      <div class="dateTime">再次扫描发票二维码可查看发票信息</div>
    </div>
    <div class="action-area" @click="myInvoices">
      查看我的票夹
    </div>
  </div>
</template>

<script>
export default {
  name: 'submit_message',
  data () {
    return {
      merchantName: '',
      amount: 0
    }
  },
  mounted () {
    this.merchantName = this.$route.params.merchantName
    this.amount = this.$route.params.merchantName
  },
  methods: {
    myInvoices () {
      this.$router.push('/invoices')
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
        width: 416px;
        font-size: 26px;
        bottom: 42px;
        color: #999999;
      }
    }
    .action-area {
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
      bottom: 41px;
    }
  }
</style>
