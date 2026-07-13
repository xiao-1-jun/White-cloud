<template>
  <div class="video-container" ref="containerRef">
    <VideoPlayer
      v-for="video in videos"
      :key="video.id"
      :video="video"
      :ref="(el) => { if (el) videoRefs[video.id] = el }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import VideoPlayer from '../components/VideoPlayer.vue'
import { useStore } from '../store'

const { store } = useStore()
const containerRef = ref(null)
const videoRefs = ref({})

const videos = computed(() => store.videos)

const handleWheel = (e) => {
  e.preventDefault()
  
  const container = containerRef.value
  if (!container) return
  
  const cardHeight = window.innerHeight
  const scrollAmount = cardHeight
  
  if (e.deltaY > 0) {
    container.scrollBy({ top: scrollAmount, behavior: 'smooth' })
  } else {
    container.scrollBy({ top: -scrollAmount, behavior: 'smooth' })
  }
}

onMounted(() => {
  const container = containerRef.value
  if (container) {
    container.addEventListener('wheel', handleWheel, { passive: false })
  }
})

onUnmounted(() => {
  const container = containerRef.value
  if (container) {
    container.removeEventListener('wheel', handleWheel)
  }
})
</script>