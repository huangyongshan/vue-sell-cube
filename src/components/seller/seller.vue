<template>
  <cube-scroll class="seller" :options="sellerScrollOptions">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-bottom-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block border-right-1px">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block border-right-1px">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div @click="toggleFavorite" class="favorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-bottom-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li
            class="support-item border-bottom-1px"
            v-for="(item,index) in seller.supports"
            :key="index"
          >
            <support-ico :size=4 :type="seller.supports[index].type"></support-ico>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <cube-scroll class="pic-wrapper" :options="picScrollOptions">
          <ul class="pic-list">
            <li
              class="pic-item"
              v-for="(pic,index) in seller.pics"
              :key="index"
            >
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </cube-scroll>
      </div>
    </div>
    <split></split>
    <div class="info">
      <h1 class="title border-bottom-1px">商家信息</h1>
      <ul>
        <li
          class="info-item border-bottom-1px"
          v-for="(info, index) in seller.infos"
          :key="index"
        >{{info}}
        </li>
      </ul>
    </div>
  </cube-scroll>
</template>

<script>
  import Split from 'components/split/split'
  import Star from 'components/star/star'
  import SupportIco from 'components/support-ico/support-ico'
  import { saveTolocal, loadFromLocal } from 'common/js/storage'

  const KEY = 'favorite'

  export default {
    name: 'seller',
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
        favorite: false,
        sellerScrollOptions: {
          directionLockThreshold: 0,
          click: false
        },
        picScrollOptions: {
          scrollX: true,
          stopPropagation: true,
          directionLockThreshold: 0
        }
      }
    },
    computed: {
      seller () {
        return this.data.seller || {}
      },
      favoriteText () {
        return this.favorite ? '已收藏' : '收藏'
      }
    },
    created() {
      this.favorite = loadFromLocal(this.seller.id, KEY, false)
    },
    methods: {
      toggleFavorite: function () {
        this.favorite = !this.favorite
        console.log(this.seller.id)
        saveTolocal(this.seller.id, KEY, this.favorite)
      }
    },
    components: {
      Split,
      Star,
      SupportIco
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin.styl"

  .seller
    height: 100%
    text-align: left

    .overview
      position: relative
      padding: 18px

      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: $fontsize-medium
        color: $color-dark-grey

      .desc
        display: flex
        align-items: center
        padding-bottom: 18px

        .star
          margin-right: 8px

        .text
          margin-right: 12px
          line-height: 18px
          font-size: $fontsize-small-s
          color: $color-light-grey-g

      .remark
        display: flex
        padding-top: 18px

        .block
          flex: 1
          text-align: center

          &:last-child
            border: none

          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: $fontsize-small-s
            color: $color-light-grey

          .content
            line-height: 24px
            font-size: $fontsize-small-s
            color: $color-dark-grey

            .stress
              font-size: $fontsize-large-xxx

      .favorite
        position: absolute
        width: 50px
        right: 11px
        top: 18px
        text-align: center

        .icon-favorite
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: $fontsize-large-xxx
          color: $color-light-grey-s

          &.active
            color: $color-red

        .text
          line-height: 10px
          font-size: $fontsize-small-s
          color: $color-grey

    .bulletin
      padding: 18px 18px 0 18px
      white-space: normal

      .title
        margin-bottom: 8px
        line-height: 14px
        color: $color-dark-grey
        font-size: $fontsize-medium

      .content-wrapper
        padding: 0 12px 16px 12px

        .content
          line-height: 24px
          font-size: $fontsize-small
          color: $color-red

      .supports
        .support-item
          display: flex
          align-items: center
          padding: 16px 12px

          .text
            padding-left: 6px
            color: $color-background
            font-size: $fontsize-small

    .pics
      padding: 18px

      .title
        margin-bottom: 8px
        font-size: $fontsize-medium
        color: $color-dark-grey

      .pic-wrapper
        width: 100%

        >>> .cube-scroll-content
          display: inline-block

          .pic-list
            white-space: nowrap
            font-size: 0

            .pic-item
              margin-right: 6px
              display: inline-block
              width: 120px
              height: 90px

    .info
      padding: 18px

      .title
        padding-bottom: 8px
        font-size: $fontsize-medium
        color: $color-dark-grey

      .info-item
        padding: 16px 12px
        font-size: $fontsize-small
        color: $color-background
        white-space: normal
        line-height: 1.2
</style>
