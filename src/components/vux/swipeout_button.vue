<template>
  <button class="vux-swipeout-button"
          :class="{'vux-swipeout-button-primary': type === 'primary', 'vux-swipeout-button-warn': type === 'warn', 'vux-swipeout-button-default': type === 'default'}" @click="onButtonClick" type="button">
    <slot>{{text}}</slot>
  </button>
</template>

<script>
export default {
  name: 'swipeout_button',
  props: {
    text: String,
    backgroundColor: String,
    type: String,
    width: {
      type: Number,
      default: 158
    },
    primaryKey: ''
  },
  methods: {
    onButtonClick () {
      this.$emit('buttonClicked', {parent: this.$parent, primaryKey: this.primaryKey})
      // console.log(this.$parent)
      // if (this.$parent.$options._componentTag === 'swipeout-item') {
      //   this.$parent.onItemClick(this.text)
      // }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/css/common";
  button {
    width: 98px;
    font-size: 28px;
    height: 98px;
    margin-top: 87px;
    border-radius: 49px;
    background-color: #F96D78;
    padding: 0 !important;
  }
</style>
