<template>
    <cube-scroll class="ratings" :data="computedRatings" :options="scrollOptions">
      <div class="ratings-content">
        <div class="overview">
          <div class="overview-left border-right-1px">
            <h1 class="score">{{seller.score}}</h1>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="overview-right">
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <star :size="36" :score="seller.serviceScore"></star>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">商品评分</span>
              <star :size="36" :score="seller.foodScore"></star>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery-wrapper">
              <span class="title">送达时间</span>
              <span class="delivery">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
        <split></split>
        <rating-select
          :ratings="ratings"
          :onlyContent="onlyContent"
          :selectType="selectType"
          @select="onSelectType"
          @toggle="onToggle"
          v-if="ratings.length"
        ></rating-select>
        <div class="rating-wrapper border-top-1px">
          <ul>
            <li
              v-for="(rating,index) in computedRatings"
              :key="index"
              class="rating-item border-bottom-1px"
            >
              <div class="avatar">
                <img width="28" :src="rating.avatar">
              </div>
              <div class="content">
                <h1 class="name">{{rating.username}}</h1>
                <div class="star-wrapper">
                  <star :size="24" :score="rating.score"></star>
                  <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                </div>
                <p class="text">{{rating.text}}</p>
                <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                  <span class="icon" :class="{
                      'icon-thumb_up': rating.rateType === 0,
                      'icon-thumb_down':rating.rateType === 1
                    }"></span>
                  <div class="list">
                    <span class="item" v-for="(item,index) in rating.recommend" :key="index">{{item}}</span>
                  </div>
                </div>
                <div class="time">{{formatDate(rating.rateTime)}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </cube-scroll>
</template>

<script>
  import Star from 'components/star/star'
  import Split from 'components/split/split'
  import RatingSelect from 'components/rating-select/rating-select'
  import { getRatings } from 'api'
  import ratingMixin from 'common/mixins/rating'
  import moment from 'moment'

  export default {
    mixins: [ratingMixin],
    name: 'ratings',
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        scrollOptions: {
          click: false,
          directionLockThreshold: 0
        }
      }
    },
    computed: {
      seller() {
        return this.data.seller || {}
      }
    },
    methods: {
      fetch () {
        if (this.ratings.length) {
          return
        }
        console.log(this.seller)
        getRatings({
          id: this.seller.id
        }).then((ratings) => {
          this.ratings = ratings
        })
      },
      formatDate(time) {
        return moment(time).format('YYYY-MM-DD hh:mm')
      }
    },
    components: {
      Star,
      Split,
      RatingSelect
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .overview
    display: flex
    padding: 18px 0
    .overview-left
      flex: 0 1 30%
      text-align: center
      padding: 0 10px
      .score
        color: $color-orange
        font-size: $fontsize-large-xxx
      .title
        margin-top: 6px
        font-size: $fontsize-small
      .rank
        margin-top: 6px
        font-size: $fontsize-small-s
        color: $color-light-grey
    .overview-right
      padding: 0 10px 0 20px
      font-size: $fontsize-small
      .score-wrapper
        margin-bottom: 8px
        display: flex
        .title
          margin-right: 12px
        .score
          padding-left: 12px
          color: $color-orange
      .delivery-wrapper
        .title
          margin-right: 12px
        .delivery
          color: $color-light-grey
  .rating-wrapper
    padding: 0 18px 18px 18px
    .rating-item
      display: flex
      padding: 18px 0
      .avatar
        img
          border-radius: 50%
      .content
        padding: 0 0 0px 12px
        white-space: normal
        position: relative
        width: 100%
        .name
          font-size: $fontsize-small
        .star-wrapper
          display: flex
          padding-top: 3px
          .delivery
            padding-left: 6px
            font-size: $fontsize-small
            color: $color-light-grey
        .text
          padding-top: 6px
          font-size: $fontsize-medium
          line-height: 1.2
        .recommend
          padding-top: 8px
          font-size: $fontsize-small-s
          color: $color-light-grey
          line-height: 24px
          display: flex

          .icon-thumb_up
            color: $color-blue
            position: relative
            top: 8px
          .item
            border: 1px solid $color-background-sssss
            border-radius: 2px
            margin: 0 4px
            padding: 4px 6px
            white-space: nowrap
        .time
          position: absolute
          top: 0
          right: 0
          color: $color-light-grey
          font-size: $fontsize-small
</style>
