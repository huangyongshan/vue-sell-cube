<template>
  <div class="tab">
    <cube-tab-bar
      :showSlider=true
      v-model="selectedLabel"
      :useTransition="false"
      :data="tabs"
      ref="tabBar"
      class="border-bottom-1px">
    </cube-tab-bar>
    <div class="slider-wrapper">
      <cube-slide
        :loop=false
        :show-dots=false
        :initial-index="index"
        :auto-play=false
        ref="slide"
        :options="slideOptions"
        @change="onChange"
        @scroll="onScroll"
      >
        <cube-slide-item v-for="(tab, index) in tabs" :key="index">
          <component ref="component" :is="tab.component" :data="tab.data"></component>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'tab',
    props: {
      tabs: {
        type: Array,
        default () {
          return {}
        }
      },
      initialIndex: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        index: this.initialIndex,
        slideOptions: {
          listenScroll: true,
          probeType: 3,
          directionLockThreshold: 0
        }
      }
    },
    computed: {
      selectedLabel: {
        get () {
          return this.tabs[this.index].value
        },
        set (newVal) {
          this.index = this.tabs.findIndex((value) => {
            return value.value === newVal
          })
        }
      }
    },
    mounted() {
      this.onChange(this.index)
    },
    methods: {
      onChange(current) {
        const component = this.$refs.component[current]
        component.fetch && component.fetch()
      },
      onScroll (pos) {
        const tabBarWidth = this.$refs.tabBar.$el.clientWidth
        const slideWidth = this.$refs.slide.slide.scrollerWidth
        const tranform = -pos.x / slideWidth * tabBarWidth
        this.$refs.tabBar.setSliderTransform(tranform)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .tab
    >>> .cube-tab
      padding: 10px 0
      border-bottom: 1px solid $color-background-sssss;
    display: flex
    flex-direction: column
    height: 100%

    .slider-wrapper
      flex: 1
      overflow: hidden
</style>
