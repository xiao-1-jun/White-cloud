<template>
  <div class="user-page">
    <div class="user-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <div class="user-info">
        <img :src="user?.avatar" alt="头像" class="avatar">
        <div class="info-text">
          <h2>{{ user?.nickname }}</h2>
          <p class="bio">{{ user?.bio }}</p>
        </div>
        <button 
          class="follow-btn" 
          :class="{ followed: isFollowed }"
          @click="handleFollow"
        >
          {{ isFollowed ? '已关注' : '+ 关注' }}
        </button>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">{{ user?.works || 0 }}</span>
          <span class="stat-label">作品</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ user?.followers || 0 }}</span>
          <span class="stat-label">粉丝</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ user?.following || 0 }}</span>
          <span class="stat-label">关注</span>
        </div>
      </div>
    </div>

    <div class="video-section">
      <h3>{{ user?.nickname }} 的作品</h3>
      <div v-if="userVideos.length > 0" class="video-grid">
        <div v-for="video in userVideos" :key="video.id" class="video-item">
          <video :src="video.src" class="mini-video" muted loop playsinline></video>
          <div class="video-overlay">
            <span class="play-icon">▶</span>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <span class="empty-icon">📹</span>
        <p>暂无作品</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '../store'

const route = useRoute()
const { getUserById, getVideosByUserId, toggleFollow, isFollowing } = useStore()

const userId = ref('')
const user = computed(() => getUserById(userId.value))
const userVideos = computed(() => getVideosByUserId(userId.value))
const isFollowed = computed(() => isFollowing(userId.value))

onMounted(() => {
  userId.value = route.params.id
})

const handleFollow = () => {
  toggleFollow(userId.value)
}
</script>

<style scoped>
.user-page {
  min-height: 100vh;
  background: #0f0f23;
  padding: 80px 20px 20px;
}

.user-header {
  text-align: center;
  margin-bottom: 40px;
}

.back-btn {
  position: absolute;
  left: 20px;
  top: 80px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #667eea;
}

.info-text {
  text-align: left;
}

.info-text h2 {
  color: white;
  font-size: 24px;
  margin-bottom: 5px;
}

.bio {
  color: #888;
  font-size: 14px;
}

.follow-btn {
  padding: 10px 24px;
  background: #667eea;
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.follow-btn.followed {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.3);
}

.stats {
  display: flex;
  justify-content: center;
  gap: 60px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  color: #888;
  font-size: 14px;
}

.video-section {
  max-width: 800px;
  margin: 0 auto;
}

.video-section h3 {
  color: white;
  font-size: 20px;
  margin-bottom: 20px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.video-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 9/16;
}

.mini-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.3);
}

.play-icon {
  font-size: 32px;
  color: white;
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
}
</style>