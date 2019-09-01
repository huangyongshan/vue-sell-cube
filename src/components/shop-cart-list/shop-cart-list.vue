<template>
  <transition name="fade">
    <cube-popup
      v-show="visible"
      :mask-closeable="true"
      :z-index=90
      position="bottom"
      type="shop-cart-list"
      @mask-click="maskClick"
    >
      <transition
        name="move"
        @after-leave="onLeave"
      >
        <div v-show="visible">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="emptyCart">清空</span>
          </div>
          <cube-scroll class="list-content" ref="listContent">
            <ul>
              <li class="food"
                  v-for="(food, index) in selectFoods"
                  :key="index"
              >
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cart-control
                    :food="food"
                    @add="onAdd"
                  ></cart-control>
                </div>
              </li>
            </ul>
          </cube-scroll>
        </div>
      </transition>
    </cube-popup>
  </transition>
</template>

<script>
  import CartControl from 'components/cart-control/cart-control'
  import popupMixin from 'common/mixins/popup'

  const EVENT_HIDE = 'hide'
  const EVENT_LEAVE = 'leave'
  const EVENT_ADD = 'add'
  const EVENT_SHOW = 'show'

  export default {
    mixins: [popupMixin],
    name: 'shop-cart-list',
    props: {
      selectFoods: {
        type: Array,
        default () {
          return []
        }
      }
    },
    created () {
      this.$on(EVENT_SHOW, () => {
        this.$nextTick(() => {
          this.$refs.listContent.refresh()
        })
      })
    },
    methods: {
      maskClick () {
        this.hide()
      },
      emptyCart () {
        this.$createDialog({
          type: 'confirm',
          content: '清空购物车吗？',
          $events: {
            confirm: () => {
              this.selectFoods.forEach((food) => {
                food.count = 0
              })
              this.hide()
            }
          }
        }).show()
      },
      onLeave () {
        this.$emit(EVENT_LEAVE)
      },
      onAdd (target) {
        this.$emit(EVENT_ADD, target)
      }
    },
    components: {
      CartControl
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"

  .cube-shop-cart-list
    bottom: 48px

    &.fade-enter, &.fade-leave-active
      opacity: 0

    &.fade-enter-active, &.fade-leave-active
      transition: all .3s ease-in-out

    .move-enter, .move-leave-active
      transform: translate3d(0, 100%, 0)

    .move-enter-active, .move-leave-active
      transition: all .3s ease-in-out

    .list-header
      height: 40px
      line-height: 40px
      padding: 0 18px
      background: $color-background-ssss

      .title
        float: left
        font-size: $fontsize-medium
        color: $color-dark-grey

      .empty
        float: right
        font-size: $fontsize-small
        color: $color-blue

    .list-content
      padding: 0 18px
      max-height: 217px
      overflow: hidden
      background: $color-white

      .food
        display: flex
        padding: 12px 0
        font-size: $fontsize-medium
        justify-content: flex-end
        align-items: center

        .name
          color: $color-background
          flex: 1

        .price
          color: $color-red
          padding: 0 6px
</style>
