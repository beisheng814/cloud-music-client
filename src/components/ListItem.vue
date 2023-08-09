<template>
  <div class="item-box pointer noselect" @click="emit('boxClick')">
    <div class="item-img-box" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <img class="item-img" :src="listItem?.picUrl || listItem?.coverImgUrl" />
      <div class=""></div>
      <div class="playCount" v-if="listItem?.playCount"><icon-play-arrow />{{ numFormat(listItem?.playCount) }}</div>
      <div class="itemAuthor" v-if="isShowAuthor"><icon-idcard /> feng</div>
      <transition name="fade">
        <div class="playBtn" v-if="isHovered" @click.stop="emit('playClick')">
          <icon-play-arrow-fill size="24" />
        </div>
      </transition>
    </div>
    <div class="item-msg" v-if="listItem?.name">
      {{ listItem?.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, toRefs } from 'vue'
  import { numFormat } from '@/util/index'
  const isHovered = ref(false)
  const isShowAuthor = ref(false)

  interface Item {
    name: string
    playCount?: number
    picUrl?: string
    coverImgUrl?: string
    [key: string]: any // 使用索引签名表示未知个数的属性和属性值
  }
  const emit = defineEmits(['boxClick','playClick']) 
  const props = defineProps({
    listItem: {
      type: Object as () => Item,
      required: true,
      default: () => ({ name: 'Default Item' })
    },
    size: {
      type: String,
      default: '12vw'
    }
  })

  const { listItem } = toRefs(props)

  const handleMouseEnter = () => {
    isHovered.value = true
  }
  const handleMouseLeave = () => {
    isHovered.value = false
  }
</script>

<style scoped lang="less">
  .item-box {
    width: v-bind(size);
    .item-img-box {
      position: relative;
      height: max-content;
      border-radius: 6px;
      overflow: hidden;

      .item-img {
        width: 100%;
        display: block;
      }

      .playCount {
        position: absolute;
        top: 0;
        right: 4%;
        color: white;
      }

      .itemAuthor {
        position: absolute;
        bottom: 2%;
        left: 2%;
        color: white;
      }

      .playBtn {
        position: absolute;
        bottom: 4%;
        right: 4%;
        color: red;
        padding-top: 2px;
        width: 30px;
        height: 28px;
        text-align: center;
        border-radius: 50%;
        background-color: white;
      }
    }

    .item-msg {
      box-sizing: border-box;
      padding-top: 4px;
      min-height: 2vw;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* 设置要显示的行数 */
      -webkit-box-orient: vertical; /* 设置文本的排列方向为垂直 */
      overflow: hidden;
      text-overflow: ellipsis; /* 使用省略号显示超出的内容 */
    }
  }

  //过度动画样式
  //渐显
  //动画开始
  .fade-enter-from {
    opacity: 0;
  }

  //动画生效中
  .fade-enter-active {
    transition: opacity 0.5s linear;
  }

  //动画结束
  .fade-enter-to {
    opacity: 1;
  }

  //渐隐
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
