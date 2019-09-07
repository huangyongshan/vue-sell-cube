<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop="decrease">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop="add"></div>
  </div>
</template>
<script>
  const EVENT_ADD = 'add'

  export default {
    name: 'cart-control',
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      add (event) {
        if (!this.food.count) {
          this.$set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        this.$emit(EVENT_ADD, event.target)
      },
      decrease () {
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .cartcontrol
    display: flex
    align-items: center
    justify-content: flex-end
    .cart-decrease
      margin: 0 6px
      font-size: 24px
      color: $color-blue
      opacity: 1
      transform: translate3d(0, 0, 0)
      .inner
        display: block
        transform: rotate(0)
      &.move-enter-active, &.move-leave-active
        transition: all 0.2s linear
        .inner
          transform: rotate(30deg)
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(30deg)
    .cart-count
      margin: 0 6px
    .cart-add
      margin: 6px
      font-size: 24px
      color: $color-blue
</style>
