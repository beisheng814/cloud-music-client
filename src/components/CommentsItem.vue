<template>
  <div class="comments-item-box">
    <a-avatar class="comments-avatar">
      <img alt="avatar" :src="data.user.avatarUrl" />
    </a-avatar>
    <div class="info">
      <div class="top">
        <span class="user">{{ data.user.nickname }} :</span>
        <span class="content">{{ data.content }}</span>
      </div>
      <div class="bottom">
        <div class="time gray">{{ formatDate(data.time, 1) }}</div>
        <div class="opt">
          <a-space :size="2">
            <div><icon-thumb-up-fill /> {{ data.likedCount }}</div>
            <a-divider direction="vertical" />
            <div><icon-share-internal /></div>
            <a-divider direction="vertical" />
            <div><icon-message /></div>
          </a-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { formatDate } from '@/util/index'
  interface Item {
    [key: string]: any // 使用索引签名表示未知个数的属性和属性值
  }
  const props = defineProps({
    data: {
      type: Object as () => Item,
      required: true,
      default: () => ({ name: 'Default Item' })
    }
  })
</script>

<style lang="less" scoped>
  .comments-item-box {
    width: 100%;
    display: flex;
    .comments-avatar {
      width: 40px;
    }
    .info {
      flex: 1;
      margin-left: 12px;
      .top {
        .user {
          color: #7cb0d8;
        }
      }
      .bottom {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
