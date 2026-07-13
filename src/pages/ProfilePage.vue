<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="profile-info">
        <div class="avatar-container" @click="triggerAvatarUpload">
          <img :src="user.avatar" alt="头像" class="avatar">
          <div class="avatar-edit">📷</div>
        </div>
        <input type="file" ref="avatarInput" accept="image/*" class="avatar-input" @change="handleAvatarChange">
        <h2>{{ user.nickname }}</h2>
        <p class="bio">{{ user.bio }}</p>
        <button class="edit-btn" @click="toggleEdit">编辑资料</button>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">{{ user.works }}</span>
          <span class="stat-label">作品</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ user.followers }}</span>
          <span class="stat-label">粉丝</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ user.following }}</span>
          <span class="stat-label">关注</span>
        </div>
      </div>
    </div>

    <div v-if="isEditing" class="edit-form">
      <h3>编辑资料</h3>
      <div class="form-group">
        <label>昵称</label>
        <input type="text" v-model="editNickname">
      </div>
      <div class="form-group">
        <label>个性签名</label>
        <textarea v-model="editBio" rows="3"></textarea>
      </div>
      <div class="form-actions">
        <button class="save-btn" @click="saveProfile">保存</button>
        <button class="cancel-btn" @click="cancelEdit">取消</button>
      </div>
    </div>

    <div class="video-section">
      <h3>我的作品</h3>
      <div v-if="myVideos.length > 0" class="video-grid">
        <div v-for="video in myVideos" :key="video.id" class="video-item">
          <video :src="video.src" class="mini-video" muted loop playsinline></video>
          <div class="video-overlay">
            <span class="play-icon">▶</span>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <span class="empty-icon">📹</span>
        <p>还没有发布视频</p>
        <button class="upload-link" @click="$router.push('/upload')">去上传</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from '../store'

const { store, updateProfile, getVideosByUserId } = useStore()

const user = computed(() => store.currentUser)
const myVideos = computed(() => getVideosByUserId(store.currentUser.id))

const isEditing = ref(false)
const editNickname = ref('')
const editBio = ref('')
const avatarInput = ref(null)

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (isEditing.value) {
    editNickname.value = user.value.nickname
    editBio.value = user.value.bio
  }
}

const saveProfile = () => {
  updateProfile({
    nickname: editNickname.value,
    bio: editBio.value
  })
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
}

const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      updateProfile({
        avatar: event.target.result
      })
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #0f0f23;
  padding: 80px 20px 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.avatar-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
  cursor: pointer;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #667eea;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

.avatar-input {
  display: none;
}

.profile-info h2 {
  color: white;
  font-size: 24px;
  margin-bottom: 10px;
}

.bio {
  color: #888;
  font-size: 14px;
  margin-bottom: 20px;
}

.edit-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 8px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.edit-btn:hover {
  background: rgba(255,255,255,0.2);
}

.stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 30px;
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

.edit-form {
  max-width: 400px;
  margin: 0 auto 40px;
  background: #1a1a2e;
  padding: 30px;
  border-radius: 12px;
}

.edit-form h3 {
  color: white;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin: 15px 0;
}

.form-group label {
  display: block;
  color: #888;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.save-btn {
  flex: 1;
  padding: 12px;
  background: #667eea;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.cancel-btn {
  flex: 1;
  padding: 12px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
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
  text-shadow: 0 0 10px rgba(0,0,0,0.5);
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

.upload-link {
  background: #667eea;
  border: none;
  color: white;
  padding: 10px 24px;
  border-radius: 20px;
  cursor: pointer;
}
</style>