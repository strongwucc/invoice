<template>
  <div class="invoices-page">
    <div class="search-area">
      <div class="input-area">
        <div :class="{'search-input': true, long: searchKey === '' && selectedType.key === '' && selectedDate === ''}">
          <img class="search-icon" src="../assets/img/ic_search@2x.png"/>
          <input v-model="searchKey" placeholder="收款方/付款方名" :class="{long: searchKey === '' && selectedType.key === '' && selectedDate === ''}" />
          <img v-show="searchKey" class="search-clear" src="../assets/img/ic_del@2x.png" @click.stop="clearInput"/>
          <span class="search-clear" v-show="!searchKey"></span>
        </div>
        <div class="search-cancel" v-if="searchKey !== '' || selectedType.key !== '' || selectedDate !== ''" @click.stop="refreshList">
          取消
        </div>
      </div>
      <div class="select-area" v-show="!isShowTypes">
        <div class="type-select" @click.stop="showTypes">
          <span class="type-name">{{selectedType.value}}</span>
          <img src="../assets/img/ic_arrow_down@2x.png"/>
        </div>
        <div class="time-select" @click.stop="showDateTime">
          <span class="time-name">发票时间</span>
          <img src="../assets/img/ic_arrow_down@2x.png"/>
        </div>
      </div>
      <div class="types-area" v-show="isShowTypes">
        <div class="types-data">
          <div class="type-item" v-for="(type, typeIndex) in types" :key="typeIndex" @click.stop="selectType(type)">
            <span :class="{selected:selectedType.key === type.key}">{{type.value}}</span>
            <img v-if="selectedType.key === type.key" src="../assets/img/ic_tick@2x.png"/>
          </div>
        </div>
        <div class="mask"></div>
      </div>
    </div>
    <div class="content-area">
      <div class="wrapper" ref="wrapper" v-if="invoiceList.length > 0">
        <ul class="content">
          <li class="content-item" v-for="(invoiceData, invoiceDataIndex) in invoiceList" :key="invoiceDataIndex">
            <div class="date">{{invoiceData.time}}</div>
            <swipeout class="list">
              <!--<ul>-->
                <!--<li v-for="(invoice, invoiceIndex) in invoiceData.list" :key="invoiceIndex">-->
                  <!--<swipeout>-->
                    <swipeout-item v-for="(invoice, invoiceIndex) in invoiceData.invoiceList" :key="invoiceIndex" @on-close="handleEvents('on-close')" @on-open="handleEvents('on-open')" transition-mode="follow">
                      <div slot="right-menu">
                        <swipeout-button :primaryKey="invoice.invoiceReqSerialNo" @buttonClicked="onButtonClick" :width="158">删除</swipeout-button>
                      </div>
                      <div slot="content" class="invoice-content" @click.stop="showDetail(invoice.invoiceReqSerialNo)">
                        <div class="company">
                          <div class="name">{{invoice.buyerName|longStrFormat(14)}}</div>
                          <div
                            :class="{
                        type:true,
                        success:invoice.status === '0000',
                        pending:invoice.status === '7777',
                        fail:invoice.status === '9999',
                        }"
                          >
                            <template v-if="invoice.status === '0000'">开票成功</template>
                            <template v-else-if="invoice.status === '7777'">开票申请中</template>
                            <template v-else-if="invoice.status === '9999'">开票失败</template>
                          </div>
                        </div>
                        <div class="amount">发票金额：{{invoice.totalAmount}}</div>
                        <div class="payment">付款方：{{invoice.enterpriseName}}</div>
                        <div class="date-time">申请时间：{{invoice.timestamp}}</div>
                      </div>
                    </swipeout-item>
                  <!--</swipeout>-->
                <!--</li>-->
              <!--</ul>-->
            </swipeout>
          </li>
          <div class="pullup-wrapper">
            <div class="before-trigger" v-if="!loading && !isPullUpLoad">
              <span>{{pullUpTxt}}</span>
            </div>
            <div class="after-trigger" v-if="loading || isPullUpLoad">
              <loading></loading>
              <div class="after-trigger-msg">{{refreshTxt}}</div>
            </div>
          </div>
        </ul>
      </div>
      <div class="empty" v-if="!loading && invoiceList.length === 0">
        <div class="icon"><img src="../assets/img/img_empty_fapiao@2x.png"/></div>
        <div class="message">暂无发票</div>
      </div>
      <!--<div class="pullup-wrapper">-->
        <!--<div class="before-trigger" v-if="!loading && !isPullUpLoad">-->
          <!--<span>{{pullUpTxt}}</span>-->
        <!--</div>-->
        <!--<div class="after-trigger" v-if="loading || isPullUpLoad">-->
          <!--<loading></loading>-->
          <!--<div class="after-trigger-msg">{{refreshTxt}}</div>-->
        <!--</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import BScroll from 'better-scroll'
import { getRect } from '../../src/assets/js/dom'
import { Swipeout, SwipeoutItem } from 'vux'
import swipeoutButton from '../components/vux/swipeout_button'
import Valid from '../utils/valid'
export default {
  name: 'invoices',
  components: { Swipeout, SwipeoutItem, swipeoutButton },
  inject: ['reload'], // 引入方法
  data () {
    return {
      searchKey: '',
      selectedType: { // 选中的发票类型
        key: '',
        value: '全部发票'
      },
      selectedDate: '',
      isShowTypes: false,
      types: [ // 发票类型
        {key: '', value: '全部发票'},
        {key: '7777', value: '开票申请中'},
        {key: '0000', value: '开票成功'},
        {key: '9999', value: '开票失败'}
      ],
      page: 1, // 当前页数
      pageSize: 10,
      invoiceList: [ // 发票列表数据
      ],
      startY: 0,
      refreshDelay: 20,
      pullUpDirty: true, // 是否未加载完毕
      pullUpLoad: false, // 是否开启滑动刷新
      isPullUpLoad: false,
      loading: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user_info
    }),
    pullUpTxt () {
      return this.pullUpDirty ? '滑动加载更多' : '已无更多'
    },
    refreshTxt () {
      return '正在加载更多数据'
    }
  },
  watch: {
    invoiceList: {
      handler (newValue, oldValue) {
        setTimeout(() => {
          this.forceUpdate()
        }, this.refreshDelay)
      },
      deep: true
    },
    selectedType: {
      handler (newValue, oldValue) {
        this.resetList()
      },
      deep: true
    },
    selectedDate: {
      handler (newValue, oldValue) {
        this.resetList()
      },
      deep: true
    },
    searchKey: {
      handler (newValue, oldValue) {
        if (Valid.check_chinese(newValue) || newValue === '') {
          this.resetList()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.getInvoiceList()
    // this.$nextTick(() => {
    //   this.initScroll()
    // })
  },
  destroyed () {
    this.$refs.scroll && this.$refs.scroll.destroy()
  },
  methods: {
    // 获取发票列表数据
    getInvoiceList () {
      let postData = {
        openid: this.userInfo.openid,
        page: this.page,
        size: this.pageSize,
        keyword: '',
        time: '',
        status: ''
      }

      if (this.searchKey !== '') {
        postData.keyword = this.searchKey
      }

      if (this.selectedDate !== '') {
        postData.time = this.selectedDate
      }

      if (this.selectedType.key !== '') {
        postData.selectedType = this.selectedType.key
      }

      this.loading = true
      this.$http.post(this.API.queryInvoiceList, postData).then(res => {
        this.loading = false

        if (res.return_code === '0000') {
          if (this.page > 1) {
            this.invoiceList = this.invoiceList.concat(res.data.info)
          } else {
            this.invoiceList = res.data.info
          }

          if (res.data.total < this.pageSize) {
            // if (this.page === 1) {
            //   this.destroy()
            // }
            this.pullUpLoad = false
            this.pullUpDirty = false
          } else {
            this.pullUpDirty = true
            this.pullUpLoad = true
            this.page = this.page + 1
          }
        }
        // this.pullUpLoad = true // 根据接口返回的数据设置是否滑动刷新，还有数据则设置为 true
        this.$nextTick(() => {
          if (!this.scroll) {
            this.initScroll()
          } else {
            this.scroll.refresh()
          }
        })
      })
      // setTimeout(() => {
      //   this.loading = false
      //   this.invoiceList = this.invoiceList.concat([
      //     {
      //       time: '2018年11月',
      //       invoiceList: [
      //         {
      //           invoiceReqSerialNo: 1,
      //           buyerName: '深圳家乐福有限公司',
      //           status: '9999',
      //           totalAmount: '￥235',
      //           enterpriseName: '上海易通金服有限公司',
      //           timestamp: '2018.04.05'
      //         },
      //         {
      //           invoiceReqSerialNo: 2,
      //           buyerName: '深圳家乐福有限公司',
      //           status: '9999',
      //           totalAmount: '￥235',
      //           enterpriseName: '上海易通金服有限公司',
      //           timestamp: '2018.04.05'
      //         },
      //         {
      //           invoiceReqSerialNo: 3,
      //           buyerName: '深圳家乐福有限公司',
      //           status: '9999',
      //           totalAmount: '￥235',
      //           enterpriseName: '上海易通金服有限公司',
      //           timestamp: '2018.04.05'
      //         }
      //       ]
      //     },
      //     {
      //       time: '2018年11月',
      //       invoiceList: [
      //         {
      //           invoiceReqSerialNo: 4,
      //           buyerName: '深圳家乐福有限公司',
      //           status: '9999',
      //           totalAmount: '￥235',
      //           enterpriseName: '上海易通金服有限公司',
      //           timestamp: '2018.04.05'
      //         },
      //         {
      //           invoiceReqSerialNo: 5,
      //           buyerName: '深圳家乐福有限公司',
      //           status: '9999',
      //           totalAmount: '￥235',
      //           enterpriseName: '上海易通金服有限公司',
      //           timestamp: '2018.04.05'
      //         },
      //         {
      //           invoiceReqSerialNo: 6,
      //           buyerName: '深圳家乐福有限公司',
      //           status: '9999',
      //           totalAmount: '￥235',
      //           enterpriseName: '上海易通金服有限公司',
      //           timestamp: '2018.04.05'
      //         }
      //       ]
      //     }
      //   ])
      //   if (this.page >= 1) {
      //     this.pullUpLoad = false
      //     this.pullUpDirty = false
      //   } else {
      //     this.pullUpDirty = true
      //     this.pullUpLoad = true
      //     this.page = this.page + 1
      //   }
      //   // this.pullUpLoad = true // 根据接口返回的数据设置是否滑动刷新，还有数据则设置为 true
      //   this.$nextTick(() => {
      //     if (!this.scroll) {
      //       this.initScroll()
      //     } else {
      //       this.scroll.refresh()
      //     }
      //   })
      // }, 2000)
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
        pullUpLoad: {
          threshold: 250
        },
        startY: this.startY,
        freeScroll: false,
        mouseWheel: false,
        bounce: true,
        zoom: false
      }
      this.scroll = new BScroll(this.$refs.wrapper, options)

      this.scroll.on('scrollEnd', (pos) => {
        this.startY = pos.y
        if (this.scroll.y <= (this.scroll.maxScrollY + 50) && this.pullUpDirty) {
          this.isPullUpLoad = true
          this.getInvoiceList()
          this.$emit('scrollToEnd')
        }
      })

      // if (this.pullUpLoad) {
      //   this._initPullUpLoad()
      // }
    },
    // 当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    destroy () {
      this.scroll && this.scroll.destroy()
    },
    forceUpdate () {
      if (this.isPullUpLoad) {
        this.isPullUpLoad = false
        this.scroll.finishPullUp()
        this.refresh()
      } else {
        this.refresh()
      }
    },
    _initPullUpLoad () {
      this.scroll.on('pullingUp', () => {
        this.isPullUpLoad = true
        this.getInvoiceList()
        this.$emit('pullingUp')
      })
    },
    showTypes () {
      this.isShowTypes = true
    },
    selectType (type) {
      this.selectedType = type
      this.isShowTypes = false
    },
    handleEvents (type) {
      console.log('event: ', type)
    },
    clearInput () {
      this.searchKey = ''
    },
    refreshList () {
      this.reload()
    },
    showDetail (invoiceId) {
      this.$router.push('/invoice/' + invoiceId)
    },
    // 根据主键删除发票
    deleteInvoiceById (invoiceId) {
      this.invoiceList.some((invoiceData, dataIndex) => {
        return invoiceData.invoiceList.some((invoice, invoiceIndex) => {
          if (invoice.invoiceReqSerialNo === invoiceId) {
            this.invoiceList[dataIndex].invoiceList.splice(invoiceIndex, 1)
            return true
          }
        })
      })
    },
    onButtonClick (args) {
      var vm = this
      this.$vux.confirm.show({
        title: '提示',
        content: '一旦删除不可找回<br/>' + '是否确定删除？',
        dialogTransition: 'vux-dialog',
        onCancel () {
          args.parent.onItemClick()
        },
        onConfirm () {
          args.parent.onItemClick()
          console.log(args)
          let postData = {
            openid: vm.userInfo.openid,
            invoiceReqSerialNo: args.primaryKey
          }
          vm.$vux.loading.show({text: ''})
          vm.$http.post(vm.API.deleteMyInvoice, postData).then(res => {
            vm.$vux.loading.hide()
            if (res.return_code === '0000') {
              vm.deleteInvoiceById(args.primaryKey)
              return true
            } else {
              vm.$vux.toast.show({
                text: res.return_message,
                type: 'text'
              })
              return false
            }
          })
        }
      })
    },
    showDateTime () {
      var vm = this
      this.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        format: 'YYYY-MM',
        yearRow: '{value}年',
        monthRow: '{value}月',
        value: vm.selectedDate, // 其他参数同 props
        onConfirm (val) {
          vm.selectedDate = val
        },
        onHide () {
          console.log('hide')
        },
        onShow () {
          console.log('show')
        }
      })
    },
    resetList () {
      this.page = 1
      // this.invoiceList = []
      this.startY = 0
      this.pullUpDirty = true
      this.pullUpLoad = false
      this.isPullUpLoad = false
      this.loading = false
      this.getInvoiceList()
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/css/common";
  .invoices-page {
    height: 100%;
    .search-area {
      display: -webkit-flex; /* Safari */
      display: flex;
      flex-direction: column;
      /*justify-content: center;*/
      background-color: #FFFFFF;
      /*height: 15%;*/
      height: 182px;
      .input-area {
        display: -webkit-flex; /* Safari */
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        margin-left: 55px;
        margin-right: 29px;
        .search-input {
          display: -webkit-flex; /* Safari */
          display: flex;
          justify-content: space-between;
          width: 580px;
          height: 60px;
          background-color: #F0F0F0;
          border-radius: 30px;
          img, span {
            width: 32px;
            height: 32px;
          }
          img.search-icon {
            margin: 14px 10px 14px 30px;
          }
          img.search-clear, span.search-clear {
            margin: 14px 29px 14px 14px;
          }
          input {
            height: 40px;
            width: 433px;
            margin-top: 10px;
            font-size: 28px;
            background-color: #F0F0F0;
          }
          input::-webkit-input-placeholder{
            color:#C4C4C4;
          }
          input::-moz-placeholder{   /* Mozilla Firefox 19+ */
            color:#C4C4C4;
          }
          input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
            color:#C4C4C4;
          }
          input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
            color:#C4C4C4;
          }
          input.long {
            width: 493px;
          }
        }
        .long {
          width: 640px;
        }
        .search-cancel {
          height: 60px;
          /*width: 56px;*/
          color: #666666;
          line-height: 60px;
          text-align: center;
          font-size: 28px;
          /*margin-left: 25px;*/
        }
      }
      .select-area {
        display: flex;
        justify-content: center;
        margin: 29px;
        .type-select, .time-select {
          width: 50%;
          height: 42px;
          line-height: 42px;
          text-align: center;
          font-size: 30px;
          img {
            width: 32px;
            height: 32px;
          }
        }
      }
      .types-area {
        position: absolute;
        top: 115px;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        border-top: 1px #E5E5E5 solid;
        .types-data {
          width: 100%;
          z-index: 999;
          height: 350px;
          background-color: #FFFFFF;
          .type-item {
            padding: 30px 70px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 28px;
            span.selected {
              color: #3CC7B2;
            }
            img {
              width: 32px;
              height: 32px;
            }
          }
        }
        .mask {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100%;
          z-index: 99;
          background-color: #78787A;
          opacity: 0.5;
        }
      }
    }
    .content-area {
      /*height: 85%;*/
      /*height: 41rem;*/
      height: 100%;
      .wrapper {
        position: absolute;
        top: 200px;
        bottom: 10px;
        margin-top: 10px;
        width: 100%;
        overflow: hidden;
        z-index: 9;
        .content {
          background-color: #F2F2F5;
        }
        .content-item {
          margin: 30px 30px 0 30px;
          .date {
            width: 130px;
            height: 30px;
            font-size: 24px;
            color: #333333;
          }
          .vux-swipeout {
            .invoice-content {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-top: 20px;
              height: 260px;
              border-radius: 10px;
              background-color: #FFFFFF;
              padding: 30px 36px 30px 30px;
              .company {
                display: flex;
                justify-content: space-between;
                .name {
                  color: #333333;
                  font-size: 36px;
                }
                .type {
                  font-size: 24px;
                  padding-top: 10px;
                }
                .pending {
                  color: #3CC7B2;
                }
                .fail {
                  color: #F5713D;
                }
              }
              .amount, .payment, .date-time {
                text-align: left;
                font-size: 24px;
              }
              .payment {
                margin-top: 40px;
                color: #666666;
              }
              .date-time {
                color: #666666;
              }
            }
          }
        }
      }
      .pullup-wrapper {
        position: relative;
        /*bottom: 40px;*/
        top: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px 0;
        .before-trigger {
          color: #999999;
          font-size: 28px;
        }
        .after-trigger {
          color: #999999;
          font-size: 28px;
          display: flex;
          .after-trigger-msg {
            margin-left: 5px;
          }
        }
      }
      .empty {
        height: 100%;
        display: flex;
        flex-direction: column;
        /*justify-content: center;*/
        /*align-items: center;*/
        .icon {
          margin-top: 260px;
          img {
            width: 140px;
            height: 100px;
          }
        }
        .message {
          margin-top: 50px;
          color: #CCCCCC;
          font-size: 28px;
        }
      }
    }
  }
</style>
