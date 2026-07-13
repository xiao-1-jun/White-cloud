<template>
  <div class="upload-page">
    <div class="upload-container">
      <h2>📤 上传视频</h2>
      
      <div class="upload-area" :class="{ dragging: isDragging }" @drop.prevent="handleDrop" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @click="triggerFileInput">
        <input type="file" ref="fileInput" accept="video/*" class="file-input" @change="handleFileSelect">
        <div class="upload-icon">📁</div>
        <p>点击或拖拽视频文件到这里</p>
        <p class="hint">支持 MP4 格式，大小不超过 50MB</p>
      </div>

      <div v-if="selectedFile" class="file-preview">
        <video :src="previewUrl" controls class="preview-video" @loadedmetadata="onVideoLoaded"></video>
        <div class="file-info">
          <p>文件名: {{ selectedFile.name }}</p>
          <p>大小: {{ formatSize(selectedFile.size) }}</p>
          <p v-if="videoDuration">时长: {{ formatTime(videoDuration) }}</p>
        </div>
      </div>

      <div class="form-group">
        <label>标题</label>
        <input type="text" v-model="videoTitle" placeholder="输入视频标题">
      </div>

      <div class="form-group">
        <label>描述</label>
        <textarea v-model="videoDesc" placeholder="输入视频描述" rows="3"></textarea>
      </div>

      <button class="upload-btn" :disabled="!selectedFile || uploadProgress > 0" @click="uploadVideo">
        <span v-if="uploadProgress === 0">开始上传</span>
        <span v-else-if="uploadProgress < 100">上传中 {{ uploadProgress }}%</span>
        <span v-else>✅ 上传完成</span>
      </button>

      <div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'

const { addVideo } = useStore()
const router = useRouter()

const fileInput = ref(null)
const isDragging = ref(false)
const selectedFile = ref(null)
const previewUrl = ref('')
const videoTitle = ref('')
const videoDesc = ref('')
const uploadProgress = ref(0)
const videoDuration = ref(0)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('video/')) {
    processFile(file)
  }
}

const processFile = (file) => {
  if (!file.type.startsWith('video/')) {
    alert('请选择视频文件')
    return
  }
  
  if (file.size > 50 * 1024 * 1024) {
    alert('视频大小不能超过 50MB')
    return
  }
  
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const onVideoLoaded = (e) => {
  videoDuration.value = e.target.duration
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const uploadVideo = async () => {
  if (!selectedFile.value) return
  
  uploadProgress.value = 0
  
  const chunks = 10
  for (let i = 1; i <= chunks; i++) {
    await new Promise(resolve => setTimeout(resolve, 300))
    uploadProgress.value = Math.floor((i / chunks) * 100)
  }
  
  addVideo({
    title: videoTitle.value || '未命名视频',
    desc: videoDesc.value || '',
    src: previewUrl.value
  })
  
  setTimeout(() => {
    router.push('/')
  }, 1000)
}
</script>

<style scoped>
.upload-page {
  min-height: 100vh;
  background: #0f0f23;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.upload-container {
  width: 100%;
  max-width: 600px;
  background: #1a1a2e;
  border-radius: 12px;
  padding: 40px;
}

.upload-container h2 {
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
}

.upload-area {
  border: 2px dashed rgba(255,255,255,0.3);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover,
.upload-area.dragging {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.upload-area p {
  color: #888;
  margin: 5px 0;
}

.upload-area .hint {
  font-size: 12px;
  color: #666;
}

.file-input {
  display: none;
}

.file-preview {
  margin: 20px 0;
}

.preview-video {
  width: 100%;
  border-radius: 8px;
  max-height: 300px;
  object-fit: contain;
}

.file-info {
  margin-top: 15px;
  color: #888;
  font-size: 14px;
}

.file-info p {
  margin: 5px 0;
}

.form-group {
  margin: 20px 0;
}

.form-group label {
  display: block;
  color: white;
  margin-bottom: 10px;
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
  resize: none;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #666;
}

.upload-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s;
}

.upload-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.progress-bar {
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  margin-top: 15px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #667eea;
  border-radius: 2px;
  transition: width 0.3s;
}
</style>