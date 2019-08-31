<template>
  <div>
    <div>
      <div class="shopcart">
        <div class="content">
          <div class="content-left">
            <div class="logo-wrapper">
              <div class="logo" :class="{'highlight':totalCount>0}">
                <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
              </div>
              <div class="num" v-show="totalCount>0">{{totalCount}}</div>
            </div>
            <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
            <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
          </div>
          <div class="content-right">
            <div class="pay" :class="payClass">
              {{payDesc}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'shop-cart',
    props: {
      selectFoods: {
        type: Array,
        default () {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    computed: {
      totalPrice () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount () {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      payClass() {
        if (!this.totalCount || this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .shopcart
    height: 46px
    .content
      display: flex
      background: #141d27
      height: 100%
      color: rgba(255, 255, 255, 0.4)
    .content-left
      flex: 1
      display: flex
      align-items: center
      .logo-wrapper
        border-radius: 50%
        width: 40px
        height: 40px
        padding: 6px
        background: $color-background-b
        position: relative
        top: -10px
        margin: 0 12px
        .logo
          background: $color-background-bbb
          border-radius: 50%
          width: 100%
          height: 100%
          text-align: center
          line-height: 54px
          &.highlight
            background: $color-blue
            .icon-shopping_cart
              color: $color-white
          .icon-shopping_cart
            font-size: 26px
      .price
        border-right: 1px solid rgba(255,255,255,0.1)
        margin: 8px 0
        padding: 0 8px 0 0
      .desc
        font-size: 8px
        padding: 0 0 0 8px
    .content-right
      flex: 0 0 100px
      .pay
        display: flex
        height: 100%
        justify-content: center
        align-items: center
        font-size: 12px
        font-weight: 700
        &.not-enough
          background: $color-background-bb
        &.enough
          background: $color-green
          color: $color-white
</style>
