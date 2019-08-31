<template>
    <div class="goods">
      <div class="scroller-nav-wrapper">
        <cube-scroll-nav
          :side=true
          :data="goods"
          :options="scrollerOptions"
          v-if="goods.length"
        >
          <cube-scroll-nav-panel
            v-for="(good, index) in goods"
            :key="index"
            :label="good.name"
            :title="good.name"
          >
            <ul>
              <li v-for="food in good.foods"
                :key="food.name"
                class="food-item"
              >
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </cube-scroll-nav-panel>
        </cube-scroll-nav>
      </div>
      <div class="shop-cart">
        <shop-cart
          :deliverPrice="seller.deliveryPrice"
          :minPrice="seller.minPrice"
        ></shop-cart>
      </div>
    </div>
</template>

<script>
  import { getGoods } from 'api'
  import ShopCart from 'components/shop-cart/shop-cart'

  export default {
    name: 'goods',
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        goods: [],
        scrollerOptions: {
          click: false,
          directionLockThreshold: 0
        }
      }
    },
    computed: {
      seller() {
        return this.data.seller
      }
    },
    methods: {
      fetch() {
        if (this.goods.length) {
          return
        }
        getGoods().then((goods) => {
          this.goods = goods
        })
      }
    },
    components: {
      ShopCart
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .goods
    position: relative
    text-align: left
    height: 100%
    .scroller-nav-wrapper
      position: absolute
      width: 100%
      top: 0
      left: 0
      bottom: 48px
    >>> .cube-scroll-nav-bar
        background: $color-background-ssss
    >>> .cube-scroll-nav-bar
      width: 80px
      white-space: normal
      overflow: hidden
    >>> .cube-scroll-nav-bar-item
      position: relative
      padding: 0 10px
      display: flex
      align-items: center
      height: 56px
      line-height: 14px
      font-size: $fontsize-small
      text-align: left
      &:after
        height: 1px
        content: ''
        left: 10px
        right: 10px
        bottom: 0
        position: absolute
        background: $color-background-sssss
      .text
        flex: 1
        position: relative
      .num
        position: absolute
        right: -8px
        top: -10px
      .support-ico
        display: inline-block
        vertical-align: top
        margin-right: 4px
    >>> .cube-scroll-nav-bar-item_active
      background: $color-white
      color: $color-dark-grey
    >>> .cube-scroll-nav-panel-title
      height: 26px
      line-height: 23px
      color: $color-light-grey
      background: $color-background-ssss
      border-left: 2px solid #d9dde1
      padding-left: 10px
      font-size: $fontsize-small
    .food-item
      padding: 20px
      display: flex
      .icon
        margin-right: 10px
      .content
        font-size: $fontsize-small
        color: $color-light-grey
        white-space: normal
      .name
        font-size: $fontsize-medium
        color: $color-dark-grey
        padding-bottom: 4px
      .desc
        padding-bottom: 4px
        line-height: 1.2
      .extra
        padding-bottom: 4px
        .count
          margin-right: 10px
      .price
        font-size: $fontsize-large
        color: $color-red
        .old
          padding-left: 10px
          text-decoration: line-through
          font-size: $fontsize-small
          color: $color-light-grey
    .shop-cart
      position: absolute
      bottom: 0
      left: 0
      right: 0
      z-index: 50
</style>
