<template>
  <div class="form-page">
    <div class="merchant-area">
      <div class="input-item merchant-info" :class="{edited: !editing}">
        <div class="input-label">商家</div>
        <div class="input-area">{{merchantName}}</div>
      </div>
      <div v-if="amount > 0" class="input-item amount-info" :class="{edited: !editing}">
        <div class="input-label">开票合计金额</div>
        <div class="input-area">
          <!--<input v-if="editing" v-model="amount" placeholder="请输入金额"/>-->
          <span>￥{{amount}}</span>
        </div>
      </div>
    </div>
    <div class="title-area">
      <div class="input-item type-info" :class="{edited: !editing}">
        <div class="input-label">抬头类型</div>
        <div class="input-area">
          <template v-if="editing">
            <check-icon :value.sync="companyTitle">企业发票</check-icon>
            <check-icon :value.sync="personalTitle">个人发票</check-icon>
          </template>
          <span v-else>{{companyTitle}}</span>
        </div>
      </div>
      <div class="input-item title-info" ref="titleInfo" :class="{edited: !editing}">
        <div class="input-label">发票抬头 <span class="red">*</span></div>
        <div class="input-area">
          <input v-if="editing" v-model="titleName" placeholder="请输入发票抬头" />
          <span v-else>{{titleName}}</span>
        </div>
        <!--<div class="input-append" v-if="editing"><img src="../assets/img/rb_plus@2x.png"/></div>-->
      </div>
      <div v-if="companyTitle === true" class="input-item" :class="{edited: !editing}">
        <div class="input-label">纳税人识别号 <span class="red">*</span></div>
        <div class="input-area">
          <input v-if="editing" v-model="identifyNum" placeholder="请输入纳税人识别号"/>
          <span v-else>{{identifyNum}}</span>
        </div>
      </div>
    </div>
    <div class="company-area">
      <div class="input-item" :class="{edited: !editing}">
        <div class="input-label">公司地址</div>
        <div class="input-area">
          <input v-if="editing" v-model="companyAddr" placeholder="请输入公司地址"/>
          <span v-else>{{companyAddr}}</span>
        </div>
      </div>
      <div class="input-item" :class="{edited: !editing}">
        <div class="input-label">公司电话</div>
        <div class="input-area">
          <input v-if="editing" v-model="companyContact" placeholder="请输入公司电话"/>
          <span v-else>{{companyContact}}</span>
        </div>
      </div>
      <div class="input-item" :class="{edited: !editing}">
        <div class="input-label">开户银行</div>
        <div class="input-area">
          <input v-if="editing" v-model="bankName" placeholder="请输入银行账户"/>
          <span v-else>{{bankName}}</span>
        </div>
      </div>
      <div class="input-item" :class="{edited: !editing}">
        <div class="input-label">银行账号</div>
        <div class="input-area">
          <input v-if="editing" v-model="bankAccount" placeholder="请输入银行账户"/>
          <span v-else>{{bankAccount}}</span>
        </div>
      </div>
    </div>
    <div class="contact-area">
      <div class="input-item" :class="{edited: !editing}">
        <div class="input-label">收票人手机号</div>
        <div class="input-area">
          <input v-if="editing" type="tel" v-model="mobile" placeholder="请输入收票人手机号"/>
          <span v-else>{{mobile}}</span>
        </div>
      </div>
      <div v-if="invoiceType !== 1" class="input-item" :class="{edited: !editing}">
        <div class="input-label">收票人邮箱</div>
        <div class="input-area">
          <input v-if="editing" v-model="email" placeholder="请输入收票人邮箱"/>
          <span v-else>{{email}}</span>
        </div>
      </div>
    </div>
    <div class="action-area" :class="{'action-area': true, 'disabled-area': !commitDisabled}" @click.stop="confirmEdit">
      {{buttonTxt}}
    </div>
    <div class="recommends wrapper" ref="wrapper" v-show="showRecommends && recommendList.length > 0">
      <div class="content">
        <div class="recommend-item" v-for="(recommend, recommendIndex) in recommendList" :key="recommendIndex" @click.stop="selectRecommend(recommend)">{{recommend.enterpriseName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import { CheckIcon } from 'vux'
import BScroll from 'better-scroll'
import { getRect } from '../../src/assets/js/dom'
export default {
  name: 'form_menu',
  components: { CheckIcon },
  data () {
    return {

      invoiceType: 1, // 开票类型
      templateCode: '',
      invoiceReqSerialNo: '',
      taxpayerNumstr: '',

      merchantName: '',
      amount: 0,

      companyTitle: true,
      personalTitle: false,
      titleName: '',
      identifyNum: '',

      companyAddr: '',
      companyContact: '',
      bankName: '',
      bankAccount: '',

      name: '',
      mobile: '',
      email: '',

      recommendList: [
      ],

      buttonTxt: '确定',
      showRecommends: false,
      recommendOffsetY: 400,
      clickRecommendItem: false,
      editing: true
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user_info
    }),
    commitDisabled () {
      return this.titleName !== '' && (this.personalTitle || this.identifyNum !== '')
    }
  },
  watch: {
    titleName: {
      handler (newValue, oldValue) {
        if (newValue === '') {
          this.showRecommends = false
          return
        }
        if (this.clickRecommendItem) {
          this.clickRecommendItem = false
          this.showRecommends = false
          return
        }
        if (this.showRecommends === false) {
          this.getTitleInputPosY()
        }
        this.getRecommends(newValue)
      },
      deep: true
    },
    recommendList: {
      handler (newValue, oldValue) {
        setTimeout(() => {
          this.refresh()
        }, 20)
      },
      deep: true
    },
    companyTitle: {
      handler (newValue, oldValue) {
        this.personalTitle = !newValue
      }
    },
    personalTitle: {
      handler (newValue, oldValue) {
        this.companyTitle = !newValue
      }
    }
  },
  mounted () {
    let queryData = this.$route.query

    if (typeof queryData.templateCode === 'string' && queryData.templateCode !== '') {
      this.invoiceType = 1
      this.templateCode = queryData.templateCode
    } else if (typeof queryData.invoiceReqSerialNo === 'string' && queryData.invoiceReqSerialNo !== '') {
      this.invoiceType = 2
      this.invoiceReqSerialNo = queryData.invoiceReqSerialNo
    } else if (typeof queryData.taxpayerNumstr === 'string' && queryData.taxpayerNumstr !== '') {
      this.invoiceType = 3
      this.taxpayerNumstr = queryData.taxpayerNumstr
    } else {
      this.$router.push('/error/出错啦/二维码信息不正确')
    }

    // 验证
    // this.verifyTemplate()
  },
  methods: {
    verifyTemplate () {
      if (this.invoiceType === 2) {
        return this.getTemplate()
      }
      let verifyData = {}
      if (this.invoiceType === 1) {
        verifyData.templateCode = this.templateCode
      } else if (this.invoiceType === 3) {
        verifyData.taxpayerNumstr = this.taxpayerNumstr
      }

      this.$vux.loading.show({text: ''})
      this.$http.post(this.API.verifyTemplate[this.invoiceType], verifyData).then(res => {
        this.$vux.loading.hide()
        if (res.return_code !== '0000') {
          this.$router.replace('/error/出错啦/' + res.return_message)
          return false
        }
        return this.getTemplate()
      })
    },
    getTemplate () {
      let postData = {}
      if (this.invoiceType === 1) {
        postData.templateCode = this.templateCode
      } else if (this.invoiceType === 2) {
        postData.invoiceReqSerialNo = this.invoiceReqSerialNo
      } else if (this.invoiceType === 3) {
        postData.taxpayerNumstr = this.taxpayerNumstr
      }

      this.$vux.loading.show({text: ''})
      this.$http.post(this.API.getTemplate[this.invoiceType], postData).then(res => {
        this.$vux.loading.hide()
        if (res.return_code !== '0000') {
          this.$router.replace('/error/出错啦/' + res.return_message)
          return false
        }
        this.merchantName = res.data.seller.enterpriseName
        if (res.data.info.invoiceAmount) {
          this.amount = res.data.info.invoiceAmount
        }
        return true
      })
    },
    getRecommends (searchKey) {
      this.$http.post(this.API.getTitleInfo, {data: searchKey}).then(res => {
        if (res.return_code === '0000') {
          this.recommendList = res.data.info
          this.$nextTick(() => {
            if (!this.scroll) {
              this.initScroll()
            } else {
              this.scroll.refresh()
            }
          })
        }
      })

      // setTimeout(() => {
      //   this.recommendList = [
      //     {
      //       name: '易通金服支付有限公司1'
      //     },
      //     {
      //       name: '易通金服支付有限公司2'
      //     },
      //     {
      //       name: '易通金服支付有限公司3'
      //     },
      //     {
      //       name: '易通金服支付有限公司1'
      //     },
      //     {
      //       name: '易通金服支付有限公司2'
      //     },
      //     {
      //       name: '易通金服支付有限公司3'
      //     }
      //   ]
      // }, 1000)
    },
    getTitleInputPosY () {
      this.recommendOffsetY = parseInt(this.$refs.titleInfo.offsetTop) + 100
      this.showRecommends = true
      this.$refs.wrapper.style.top = this.recommendOffsetY + 'px'
    },
    // 初始化滚动
    initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      if (this.$refs.wrapper && this.pullUpLoad) {
        this.$refs.wrapper.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`
      }
      let options = {
        probeType: 1,
        click: true,
        scrollbar: false,
        pullUpLoad: true,
        startY: 0,
        freeScroll: false,
        mouseWheel: false,
        bounce: true,
        zoom: false
      }
      this.scroll = new BScroll(this.$refs.wrapper, options)

      // if (this.pullUpLoad) {
      //   this._initPullUpLoad()
      // }
    },
    // 当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    destroyed () {
      this.$refs.scroll && this.$refs.scroll.destroy()
    },
    selectRecommend (titleInfo) {
      this.clickRecommendItem = true
      this.titleName = titleInfo.enterpriseName
      this.identifyNum = titleInfo.taxpayerNum

      this.destroyed()
    },
    confirmEdit () {
      if (this.titleName !== '' && (this.personalTitle || this.identifyNum !== '')) {
        if (this.editing) {
          this.buttonTxt = '提交'
          this.editing = false
          return false
        }
        let postData = {}
        if (this.invoiceType === 1) {
          postData.templateCode = this.templateCode
        } else if (this.invoiceType === 2) {
          postData.invoiceReqSerialNo = this.invoiceReqSerialNo
        } else if (this.invoiceType === 3) {
          postData.taxpayerNumstr = this.taxpayerNumstr
        }

        postData.buyerName = this.titleName
        postData.buyerTaxpayerNum = this.identifyNum
        postData.buyerAddress = this.companyAddr
        postData.buyerTel = this.companyContact
        postData.buyerBankName = this.bankName
        postData.buyerBankAccount = this.bankAccount
        postData.takerName = this.name
        postData.takerTel = this.mobile
        postData.takerEmail = this.email
        postData.openid = this.userInfo.openid

        this.$vux.loading.show({text: ''})
        this.$http.post(this.API.setBuyerInfo[this.invoiceType], postData).then(res => {
          this.$vux.loading.hide()
          if (res.return_code === '0000') {
            this.$router.push('/submit_message/' + this.merchantName + '/' + this.amount)
            return true
          } else {
            this.$router.push('/error/申请失败/' + res.return_message)
            return false
          }
        })
      }
      return false
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/css/common";
  .red {
    color: #f43530;
  }
  .input-item {
    display: flex;
    justify-content: flex-start;
    color: #666666;
    font-size: 28px;
    margin-bottom: 28px;
    height: 58px;
    line-height: 58px;
    .input-label {
      margin-left: 10px;
      width: 260px;
      text-align: left;
    }
    .input-area {
      margin-right: 10px;
      input {
        height: 37px;
        font-size: 28px;
        color: #000000;
      }
      input::-webkit-input-placeholder{
        color:#C4C4C4;
        font-size: 28px;
        text-align: left;
      }
      input::-moz-placeholder{   /* Mozilla Firefox 19+ */
        color:#C4C4C4;
        font-size: 28px;
        text-align: left;
      }
      input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        color:#C4C4C4;
        font-size: 28px;
        text-align: left;
      }
      input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
        color:#C4C4C4;
        font-size: 28px;
        text-align: left;
      }
      span {
        color: #333333;
        font-size: 28px;
      }
    }
  }
  .edited {
    justify-content: space-between;
  }
  .form-page {
    height: 100%;
    padding: 28px;
    background-color: #FFFFFF;
    .merchant-area {
      /*height: 172px;*/
      border-bottom: 1px #666666 dashed;
      .merchant-info {
        justify-content: space-between;
        .input-label {
          width: 56px;
        }
        .input-area {
          color: #000000;
          margin-right: 10px;
        }
      }
      .amount-info {
        justify-content: space-between;
        input {
          width: 180px;
          height: 48px;
          font-size: 36px;
          color: #000000;
        }
        input::-webkit-input-placeholder{
          color:#C4C4C4;
          font-size: 30px;
          text-align: left;
        }
        input::-moz-placeholder{   /* Mozilla Firefox 19+ */
          color:#C4C4C4;
          font-size: 30px;
          text-align: left;
        }
        input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
          color:#C4C4C4;
          font-size: 30px;
          text-align: left;
        }
        input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
          color:#C4C4C4;
          font-size: 30px;
          text-align: left;
        }
        .input-area {
          span {
            font-size: 36px;
            color: #000000;
          }
        }
      }
    }
    .title-area, .company-area, .contact-area {
      margin-top: 30px;
      border-bottom: 1px #666666 dashed;
    }
    .title-area {
      .type-info {
        .input-area {
          .vux-check-icon:nth-child(1) {
            margin-right: 60px;
          }
        }
      }
      .title-info {
        .input-append {
          img {
            width: 36px;
            height: 36px;
            transform: translate(0,5px);
          }
        }
      }
    }
    .company-area {}
    .contact-area {
      border: 0;
    }
    .action-area {
      position: absolute;
      bottom: 37px;
      width: 690px;
      height: 88px;
      background-color: #FFD726;
      font-size: 32px;
      line-height: 88px;
      border-radius: 10px;
    }
    .disabled-area {
      color: #EFEFEF;
      background-color: #CCCCCC;
    }
    .recommends {
      position: absolute;
      top: 50%;
      right: 9px;
      width: 470px;
      height: 288px;
      display: flex;
      flex-direction: column;
      padding: 15px 28px;
      background-color: #FFFFFF;
      border-radius: 10px;
      -moz-box-shadow:5px 5px 20px #E8E8E8,5px -5px 20px #E8E8E8,-5px 5px 20px #E8E8E8,-5px -5px 20px #E8E8E8;
      -webkit-box-shadow:5px 5px 20px #E8E8E8,5px -5px 20px #E8E8E8,-5px 5px 20px #E8E8E8,-5px -5px 20px #E8E8E8;
      box-shadow:5px 5px 20px #E8E8E8,5px -5px 20px #E8E8E8,-5px 5px 20px #E8E8E8,-5px -5px 20px #E8E8E8;
      z-index: 999;
      overflow: hidden;
      .content {
        .recommend-item {
          font-size: 28px;
          padding: 14px 0;
          text-align: left;
        }
        .recommend-item:nth-child(1) {
          margin-top: 10px;
        }
      }
    }
  }
</style>
