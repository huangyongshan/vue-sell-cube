<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab-wrapper">
      <tab :tabs="tabs" :initialIndex="2"></tab>
    </div>
  </div>
</template>

<script>
  import VHeader from 'components/v-header/v-header.vue'
  import Tab from 'components/tab/tab.vue'
  import Goods from 'components/goods/goods.vue'
  import Seller from 'components/seller/seller.vue'
  import Ratings from 'components/ratings/ratings'
  import { getSeller } from 'api'
  import qs from 'query-string'

  export default {
    name: 'app',
    data() {
      return {
        seller: {
          id: qs.parse(location.search).id
        }
      }
    },
    created () {
      this._getSeller()
    },
    computed: {
      tabs() {
        return [
          {
            label: '商品',
            value: 'Goods',
            component: Goods,
            data: {
              seller: this.seller
            }
          },
          {
            label: '评价',
            value: 'ratings',
            component: Ratings,
            data: {
              seller: this.seller
            }
          },
          {
            label: '商家 ',
            value: 'seller',
            component: Seller,
            data: {
              seller: this.seller
            }
          }
        ]
      }
    },
    methods: {
      _getSeller() {
        getSeller({
          id: this.seller.id
        }).then((seller) => {
          this.seller = seller
        })
      }
    },
    components: {
      VHeader,
      Tab
    }
  }
</script>
<style lang="stylus">
  #app
    .tab-wrapper
      position: fixed
      top: 136px
      left: 0
      right: 0
      bottom: 0
</style>
