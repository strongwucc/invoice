<template>
  <div></div>
</template>

<script>
import {oauthUrl, baseRedirectUrl} from '../config/env'
import {mapMutations} from 'vuex'
export default {
  name: 'auth',
  data () {
    return {
      code: '',
      redirect: ''
    }
  },
  mounted () {
    let queryData = this.$route.query

    if (typeof queryData.redirect === 'string' && queryData.redirect !== '') {
      this.redirect = queryData.redirect
    }

    if (typeof queryData.code === 'string' && queryData.code !== '') {
      this.code = queryData.code
      // 获取用户 openid 并保存
      this.$vux.loading.show({text: ''})
      this.$http.get(this.API.auth.getOpenid + '?code=' + this.code).then(res => {
        console.log(res)
        this.$vux.loading.hide()
        if (res.return_code === '0000') {
          this.set_user_login_status(1)
          this.set_user_info(res.data)
          this.$router.push(this.redirect)
        } else {
          this.$router.replace('/error/出错啦/' + res.return_message)
        }
      })
    } else {
      let redirectUri = baseRedirectUrl + this.$route.fullPath
      console.log(oauthUrl + '&redirect_uri=' + encodeURIComponent(redirectUri))
      window.location.href = oauthUrl + '&redirect_uri=' + encodeURIComponent(redirectUri)
    }
  },
  methods: {
    ...mapMutations([
      'set_user_info',
      'set_user_login_status'
    ])
  }
}
</script>

<style scoped>

</style>
