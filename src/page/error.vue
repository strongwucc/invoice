<template>
  <div class="error-page">
    <div class="notice-area">
      <div class="icon">
        <img src="../../src/assets/img/ic_fail@2x.png"/>
      </div>
      <div class="errorType">{{errorType}}</div>
      <div class="notice">{{errorMsg}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error',
  data () {
    return {
      errorType: '出错啦',
      errorMsg: '哎呀，系统出错啦'
    }
  },
  mounted () {
    this.errorType = this.$route.params.errorType
    this.errorMsg = this.$route.params.errorMsg
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/css/common";
  .error-page {
    height: 100%;
    background-color: #FFFFFF;
    .notice-area {
      width: 690px;
      background-color: #FFFFFF;
      position: absolute;
      top: 21px;
      left: 29px;
      bottom: 154px;
      border-radius: 10px;
      .icon, .errorType, .notice {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
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
      .errorType {
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
    }
  }
</style>
