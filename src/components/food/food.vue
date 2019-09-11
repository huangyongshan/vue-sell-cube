<template>
  <transition
    name="move"
    @after-leave="onLeave"
  >
    <div class="food" v-show="visible">
      <cube-scroll :data="computedRatings" ref="scroll">
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <div class="title">{{food.name}}</div>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span>
              <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cart-control-wrapper" v-show="food.count">
              <cart-control @add="addFood" :food="food"></cart-control>
            </div>
            <transition name="fade">
              <div @click="addFirst" class="buy" v-show="!food.count">加入购物车</div>
            </transition>
          </div>
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.info}}</p>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <rating-select
              :ratings="ratings"
              :onlyContent="onlyContent"
              :selectType="selectType"
              @select="onSelectType"
              @toggle="onToggle"
              :desc="desc"
            ></rating-select>
            <div class="rating-wrapper border-top-1px">
              <ul v-show="computedRatings && computedRatings.length">
                <li
                  v-for="(rating,index) in computedRatings"
                  class="rating-item border-bottom-1px"
                  :key="index"
                >
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img
                      class="avatar"
                      width="12"
                      height="12"
                      :src="rating.avatar"
                    >
                  </div>
                  <div class="time">{{formatDate(rating.rateTime)}}</div>
                  <p class="text">
                    <span
                      class="icon"
                      :class="{
                        'icon-thumb_up': rating.rateType === 0,
                        'icon-thumb_down':rating.rateType === 1
                      }"
                    ></span>{{rating.text}}
                  </p>
                </li>
              </ul>
              <div
                class="no-rating"
                v-show="!computedRatings || !computedRatings.length"
              >暂无评价
              </div>
            </div>
          </div>
        </div>
      </cube-scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import popupMixin from 'common/mixins/popup'
  import ratingMixin from 'common/mixins/rating'
  import Split from 'components/split/split'
  import CartControl from 'components/cart-control/cart-control'
  import RatingSelect from 'components/rating-select/rating-select'
  import moment from 'moment'

  const EVENT_SHOW = 'show'
  const EVENT_LEAVE = 'leave'
  const EVENT_ADD = 'add'

  export default {
    mixins: [popupMixin, ratingMixin],
    name: 'food',
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    computed: {
      ratings () {
        return this.food.ratings
      }
    },
    created () {
      this.$on(EVENT_SHOW, () => {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      })
    },
    methods: {
      onLeave () {
        this.$emit(EVENT_LEAVE)
      },
      addFirst (event) {
        this.$set(this.food, 'count', 1)
        this.$emit(EVENT_ADD, event.target)
      },
      addFood (target) {
        this.$emit(EVENT_ADD, target)
      },
      formatDate (timeSpan) {
        return moment(timeSpan).format('YYYY-MM-DD hh:mm')
      }
    },
    components: {
      Split,
      CartControl,
      RatingSelect
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin.styl"

  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: $color-white

    &.move-enter-active, &.move-leave-active
      transition: all 0.3s linear

    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)

    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%

      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%

      .back
        position: absolute
        top: 10px
        left: 0

        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: $fontsize-large-xx
          color: $color-white

    .content
      position: relative
      padding: 18px

      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: $fontsize-medium
        font-weight: 700
        color: $color-dark-grey

      .detail
        margin-bottom: 18px
        line-height: 10px
        color: $color-light-grey
        font-size: $fontsize-small

        .sell-count
          padding-right: 6px

      .price
        .now
          color: $color-red
          font-size: $fontsize-medium
          font-weight: 700
          padding-right: 6px

        .old
          color: $color-light-grey
          font-weight: 700
          font-size: $fontsize-small

      .cart-control-wrapper
        position: absolute
        bottom: 18px
        right: 18px

      .buy
        background: $color-blue
        padding: 10px 17px
        position: absolute
        bottom: 18px
        right: 18px
        color: #fff
        border-radius: 30px

        &.fade-enter-active, &.fade-leave-active
          transition: opacity .5s

        &.fade-enter, &.fade-leave-to
          opacity: 0

    .info
      padding: 18px

      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: $fontsize-medium
        font-weight: 700
        color: $color-dark-grey

      .text
        font-size: $fontsize-small
        color: $color-light-grey-g
        line-height: 2

    .rating

      .title
        padding: 18px
        line-height: 14px
        font-size: $fontsize-medium
        font-weight: 700
        color: $color-dark-grey

      .rating-wrapper
        padding: 0 18px

        .rating-item
          padding: 18px 0
          position: relative
          color: $color-light-grey

          .user
            position: absolute
            right: 0
            top: 18px

            .name
              margin-right: 6px

            .avatar
              border-radius: 50%

          .time
            padding-bottom: 6px
            font-size: $fontsize-small

          .text
            color: $color-background

            .icon
              color: $color-light-grey
              margin-right: 4px

            .icon-thumb_up
              color: $color-blue

        .no-rating
          padding: 18px 0
          color: $color-light-grey
</style>
