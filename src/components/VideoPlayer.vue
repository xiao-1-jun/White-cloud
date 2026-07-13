<template>
  <div class="video-card" ref="cardRef">
    <video
      ref="videoRef"
      class="video-player"
      :muted="isMuted"
      :loop="isLoop"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @click="togglePlay"
    >
      <source :src="video.src" type="video/mp4">
    </video>
    <div class="video-info">
      <div class="user-info" @click="goToUserPage">
        <img :src="user?.avatar" alt="头像" class="user-avatar">
        <span class="user-nickname">{{ user?.nickname }}</span>
        <button 
          class="follow-btn" 
          :class="{ followed: isFollowed }"
          @click.stop="handleFollow"
        >
          {{ isFollowed ? '已关注' : '+ 关注' }}
        </button>
      </div>
      <h3>{{ video.title }}</h3>
      <p>{{ video.desc }}</p>
    </div>
    <div class="video-controls">
      <div class="progress-bar" @click="seekVideo">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        <div class="progress-thumb" :style="{ left: progressPercent + '%' }"></div>
      </div>
      <div class="controls-row">
        <div class="time-display">
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <span>/</span>
          <span class="total-time">{{ formatTime(duration) }}</span>
        </div>
        <div class="controls-group">
          <button
            v-for="speed in speeds"
            :key="speed"
            class="control-btn speed-btn"
            :class="{ active: playbackRate === speed }"
            @click="setPlaybackRate(speed)"
          >
            {{ speed }}x
          </button>
          <button class="control-btn volume-btn" @click="toggleMute">
            {{ isMuted ? '🔇' : '🔊' }}
          </button>
          <button class="control-btn loop-btn" :class="{ active: isLoop }" @click="toggleLoop">
            🔄
          </button>
          <button class="control-btn fullscreen-btn" @click="toggleFullscreen">
            ⛶
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../store'

const router = useRouter()
const { getUserById, toggleFollow, isFollowing } = useStore()

const props = defineProps({
  video: {
    type: Object,
    required: true
  }
})

const videoRef = ref(null)
const cardRef = ref(null)
const currentTime = ref(0)
const duration = ref(0)
const playbackRate = ref(1)
const isMuted = ref(true)
const isLoop = ref(false)

const user = computed(() => getUserById(props.video.userId))
const isFollowed = computed(() => isFollowing(props.video.userId))

const goToUserPage = () => {
  router.push(`/user/${props.video.userId}`)
}

const handleFollow = () => {
  toggleFollow(props.video.userId)
}

const speeds = [0.5, 1, 1.5, 2]

let observer = null

const progressPercent = ref(0)

const formatTime = (time) => {
  const mins = Math.floor(time / 60)
  const secs = Math.floor(time % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const onTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime
    progressPercent.value = (currentTime.value / duration.value) * 100
  }
}

const onLoadedMetadata = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
  }
}

const seekVideo = (e) => {
  if (videoRef.value && duration.value > 0) {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    videoRef.value.currentTime = percent * duration.value
  }
}

const setPlaybackRate = (speed) => {
  playbackRate.value = speed
  if (videoRef.value) {
    videoRef.value.playbackRate = speed
  }
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (videoRef.value) {
    videoRef.value.muted = isMuted.value
  }
}

const toggleLoop = () => {
  isLoop.value = !isLoop.value
  if (videoRef.value) {
    videoRef.value.loop = isLoop.value
  }
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const togglePlay = () => {
  if (videoRef.value) {
    if (videoRef.value.paused) {
      videoRef.value.play()
    } else {
      videoRef.value.pause()
    }
  }
}

const playVideo = () => {
  if (videoRef.value && videoRef.value.paused) {
    videoRef.value.play()
  }
}

const pauseVideo = () => {
  if (videoRef.value && !videoRef.value.paused) {
    videoRef.value.pause()
  }
}

defineExpose({ playVideo, pauseVideo })

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playVideo()
        } else {
          pauseVideo()
        }
      })
    },
    {
      threshold: 0.5
    }
  )

  if (cardRef.value) {
    observer.observe(cardRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

watch(isMuted, (val) => {
  if (videoRef.value) {
    videoRef.value.muted = val
  }
})

watch(isLoop, (val) => {
  if (videoRef.value) {
    videoRef.value.loop = val
  }
})
</script>