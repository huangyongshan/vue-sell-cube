<template>
  <div>
    <div>
      <div class="shopcart">
        <div class="content" @click="toggleList">
          <div class="content-left">
            <div class="logo-wrapper">
              <div class="logo" :class="{'highlight':totalCount>0}">
                <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
              </div>
              <div class="num" v-show="totalCount>0">
                <bubble :num="totalCount"></bubble>
              </div>
            </div>
            <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
            <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
          </div>
          <div class="content-right">
            <div class="pay" @click="pay" :class="payClass">
              {{payDesc}}
            </div>
          </div>
        </div>
        <div class="ball-container">
          <div v-for="(ball,index) in balls" :key="index">
            <transition
              @before-enter="beforeDrop"
              @enter="dropping"
              @after-enter="afterDrop"
            >
              <div class="ball" v-show="ball.show">
                <div class="inner inner-hook"></div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Bubble from 'components/bubble/bubble'

  const BALL_LEN = 10
  const innerClsHook = 'inner-hook'

  function createBalls () {
    let ret = []
    for (let i = 0; i < BALL_LEN; i++) {
      ret.push({
        show: false
      })
    }
    return ret
  }

  export default {
    name: 'shop-cart',
    data () {
      return {
        balls: createBalls(),
        listFold: this.fold
      }
    },
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
      },
      fold: {
        type: Boolean,
        default: true
      },
      sticky: {
        type: Boolean,
        default: false
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
      payClass () {
        if (!this.totalCount || this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      }
    },
    created () {
      this.dropBalls = []
    },
    methods: {
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          const ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeDrop (el) {
        const ball = this.dropBalls[this.dropBalls.length - 1]
        const rect = ball.el.getBoundingClientRect()
        const x = rect.left - 32
        const y = -(window.innerHeight - rect.top - 22)
        el.style.display = ''
        el.style.transform = el.style.webkitTransform = `translate3d(0,${y}px,0)`
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px,0,0)`
      },
      dropping (el, done) {
        // 触发一次重绘
        this._reflow = document.body.offsetHeight
        el.style.transform = el.style.webkitTransform = `translate3d(0,0,0)`
        const inner = el.getElementsByClassName(innerClsHook)[0]
        inner.style.transform = inner.style.webkitTransform = `translate3d(0,0,0)`
        el.addEventListener('transitionend', done)
      },
      afterDrop (el) {
        const ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      toggleList () {
        if (this.listFold) {
          if (!this.totalCount) {
            return
          }
          this.listFold = false
          this._showShopCartList()
          this._showShopCartStick()
        } else {
          this.listFold = true
          this._hideShopCartList()
        }
      },
      pay (e) {
        if (this.totalPrice < this.minPrice) {
          return
        }
        this.$createDialog({
          title: '支付',
          content: `您需要支付共${this.totalPrice}元`
        }).show()
        e.stopPropagation()
      },
      _showShopCartList () {
        this.showShopCartListComp = this.showShopCartListComp || this.$createShopCartList({
          $props: {
            selectFoods: 'selectFoods'
          },
          $events: {
            hide: () => {
              this.listFold = true
            },
            leave: () => {
              this._hideShopCartStick()
            },
            add: (el) => {
              this.showShopCartStickComp.drop(el)
            }
          }
        })
        this.showShopCartListComp.show()
      },
      _hideShopCartList () {
        if (this.sticky) {
          this.$parent.list.hide()
        } else {
          this.showShopCartListComp.hide()
        }
      },
      _showShopCartStick () {
        this.showShopCartStickComp = this.showShopCartStickComp || this.$createShopCartSticky({
          $props: {
            selectFoods: 'selectFoods',
            deliveryPrice: 'deliveryPrice',
            minPrice: 'minPrice',
            fold: 'listFold',
            list: this.showShopCartListComp
          }
        })
        this.showShopCartStickComp.show()
      },
      _hideShopCartStick () {
        this.showShopCartStickComp.hide()
      }
    },
    watch: {
      fold (newVal) {
        this.listFold = newVal
      },
      totalCount (newVal) {
        if (!this.listFold && !newVal) {
          this._hideShopCartList()
        }
      }
    },
    components: {
      Bubble
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

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

          .num
            position: absolute
            top: 0
            right: 0

        .price
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          margin: 8px 0
          padding: 0 8px 0 0

          &.highlight
            color: $color-white

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

    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)

        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: $color-blue
          transition: all 0.4s linear
</style>
