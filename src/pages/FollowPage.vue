<template>
  <div class="follow-page">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h2>👥 关注列表</h2>
    </div>

    <div class="tabs">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'following' }"
        @click="activeTab = 'following'"
      >
        关注中 ({{ followUsers.length }})
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'fans' }"
        @click="activeTab = 'fans'"
      >
        粉丝 ({{ fans.length }})
      </button>
    </div>

    <div class="user-list">
      <div v-if="activeTab === 'following'">
        <div v-if="followUsers.length > 0" class="user-items">
          <div v-for="user in followUsers" :key="user.id" class="user-item">
            <img :src="user.avatar" alt="头像" class="avatar">
            <div class="user-info" @click="$router.push(`/user/${user.id}`)">
              <h3>{{ user.nickname }}</h3>
              <p class="bio">{{ user.bio }}</p>
            </div>
            <button 
              class="follow-btn followed"
              @click="handleUnfollow(user.id)"
            >
              已关注
            </button>
          </div>
        </div>
        <div v-else class="empty-state">
          <span class="empty-icon">👤</span>
          <p>还没有关注任何人</p>
          <button class="explore-link" @click="$router.push('/')">去浏览</button>
        </div>
      </div>

      <div v-if="activeTab === 'fans'">
        <div v-if="fans.length > 0" class="user-items">
          <div v-for="user in fans" :key="user.id" class="user-item">
            <img :src="user.avatar" alt="头像" class="avatar">
            <div class="user-info" @click="$router.push(`/user/${user.id}`)">
              <h3>{{ user.nickname }}</h3>
              <p class="bio">{{ user.bio }}</p>
            </div>
            <button 
              class="follow-btn"
              :class="{ followed: isFollowing(user.id) }"
              @click="handleFollow(user.id)"
            >
              {{ isFollowing(user.id) ? '已关注' : '+ 关注' }}
            </button>
          </div>
        </div>
        <div v-else class="empty-state">
          <span class="empty-icon">🔔</span>
          <p>还没有粉丝</p>
          <button class="upload-link" @click="$router.push('/upload')">去发布</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../store'

const { getFollowUsers, getFans, toggleFollow, isFollowing } = useStore()

const activeTab = ref('following')

const followUsers = computed(() => getFollowUsers())
const fans = computed(() => getFans())

const handleFollow = (userId) => {
  toggleFollow(userId)
}

const handleUnfollow = (userId) => {
  toggleFollow(userId)
}
</script>

<style scoped>
.follow-page {
  min-height: 100vh;
  background: #0f0f23;
  padding: 80px 20px 20px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
}

.page-header h2 {
  color: white;
  font-size: 24px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.tab-btn {
  flex: 1;
  padding: 15px;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 8px;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  background: #667eea;
  color: white;
}

.user-list {
  max-width: 600px;
  margin: 0 auto;
}

.user-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #1a1a2e;
  padding: 20px;
  border-radius: 12px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  cursor: pointer;
}

.user-info h3 {
  color: white;
  font-size: 16px;
  margin-bottom: 5px;
}

.bio {
  color: #888;
  font-size: 12px;
}

.follow-btn {
  padding: 8px 20px;
  background: #667eea;
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.follow-btn.followed {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.3);
}

.empty-state {
  text-align: center;
  padding: 60px;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 15px;
}

.empty-state p {
  color: #888;
  margin-bottom: 20px;
}

.explore-link,
.upload-link {
  background: #667eea;
  border: none;
  color: white;
  padding: 10px 24px;
  border-radius: 20px;
  cursor: pointer;
}
</style>