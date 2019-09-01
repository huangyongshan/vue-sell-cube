<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="goods">
    <div class="scroller-nav-wrapper">
      <cube-scroll-nav
        :side=true
        :data="goods"
        :options="scrollerOptions"
        v-if="goods.length"
      >
        <template v-slot:bar="props">
          <cube-scroll-nav-bar
            direction="vertical"
            :labels="props.labels"
            :txts="barTxts"
            :current="props.current"
          >
            <template v-slot:default="props">
              <div class="text">
                <support-ico
                  v-if="props.txt.type>=1"
                  :size=3
                  :type="props.txt.type"
                ></support-ico>
                <span>{{props.txt.name}}</span>
                <span class="num" v-if="props.txt.count">
                  <bubble :num="props.txt.count"></bubble>
                </span>
              </div>
            </template>
          </cube-scroll-nav-bar>
        </template>
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
                <div class="footer">
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cart-control
                      :food="food"
                      @add="onAdd"
                    ></cart-control>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
      </cube-scroll-nav>
    </div>
    <div class="shop-cart">
      <shop-cart
        ref="shopCart"
        :select-foods="selectFoods"
        :deliver-price="seller.deliveryPrice"
        :min-price="seller.minPrice"
      ></shop-cart>
    </div>
  </div>
</template>

<script>
  import { getGoods } from 'api'
  import ShopCart from 'components/shop-cart/shop-cart'
  import CartControl from 'components/cart-control/cart-control'
  import SupportIco from 'components/support-ico/support-ico'
  import Bubble from 'components/bubble/bubble'

  export default {
    name: 'goods',
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        goods: [],
        scrollerOptions: {
          click: false,
          directionLockThreshold: 0
        }
      }
    },
    computed: {
      seller () {
        return this.data.seller
      },
      selectFoods () {
        let ret = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              ret.push(food)
            }
          })
        })
        return ret
      },
      barTxts () {
        var ret = []
        this.goods.forEach((good) => {
          const { type, name, foods } = good
          let count = 0
          foods.forEach((food) => {
            count += food.count || 0
          })
          ret.push({
            type,
            name,
            count
          })
        })
        return ret
      }
    },
    methods: {
      fetch () {
        if (this.goods.length) {
          return
        }
        getGoods().then((goods) => {
          this.goods = goods
        })
      },
      onAdd (el) {
        this.$refs.shopCart.drop(el)
      }
    },
    components: {
      ShopCart,
      CartControl,
      Bubble,
      SupportIco
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
      text-align: left /*&:after
        height: 1px
        content: ''
        left: 10px
        right: 10px
        bottom: 0
        position: absolute
        background: $color-background-sssss*/

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
      position: relative

      .icon
        margin-right: 10px

      .content
        font-size: $fontsize-small
        color: $color-light-grey
        white-space: normal
        flex: 1

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

      .footer
        display: flex
        flex-wrap: wrap
        justify-content: flex-end

        .price
          font-size: $fontsize-large
          color: $color-red
          flex: auto

          .old
            padding-left: 10px
            text-decoration: line-through
            font-size: $fontsize-small
            color: $color-light-grey

        .cartcontrol-wrapper
          flex: 0 0 100px

    .shop-cart
      position: absolute
      bottom: 0
      left: 0
      right: 0
      z-index: 50
</style>
