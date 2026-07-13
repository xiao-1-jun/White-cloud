import { reactive, watch } from 'vue'

const STORAGE_KEY = 'douyin_video_player_data'

const defaultData = {
  currentUser: {
    id: 'user-0',
    nickname: '肖俊杰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-0',
    bio: '一个热爱编程的小白',
    works: 0,
    followers: 128,
    following: 56
  },
  users: [
    {
      id: 'user-1',
      nickname: 'Python大师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-1',
      bio: '专注Python教学10年',
      works: 156,
      followers: 5234,
      following: 128
    },
    {
      id: 'user-2',
      nickname: '前端达人',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-2',
      bio: 'Web开发爱好者',
      works: 89,
      followers: 2156,
      following: 342
    },
    {
      id: 'user-3',
      nickname: '数据科学家',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-3',
      bio: 'AI与机器学习研究员',
      works: 67,
      followers: 3890,
      following: 256
    },
    {
      id: 'user-4',
      nickname: 'Git专家',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-4',
      bio: '版本控制大师',
      works: 45,
      followers: 1876,
      following: 89
    }
  ],
  videos: [
    {
      id: 'video-local',
      userId: 'user-0',
      title: '我的第一个视频',
      desc: '这是我上传的第一个视频',
      src: '/videos/video1.mp4',
      createdAt: Date.now() - 3600000
    },
    {
      id: 'video-1',
      userId: 'user-1',
      title: 'Python入门教程',
      desc: '从零开始学习Python编程，适合零基础学员',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      createdAt: Date.now() - 86400000 * 3
    },
    {
      id: 'video-2',
      userId: 'user-2',
      title: 'Web开发实战',
      desc: 'HTML、CSS、JavaScript全栈开发教程',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      createdAt: Date.now() - 86400000 * 2
    },
    {
      id: 'video-3',
      userId: 'user-3',
      title: '数据可视化',
      desc: '使用Python进行数据可视化分析',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      createdAt: Date.now() - 86400000
    },
    {
      id: 'video-4',
      userId: 'user-3',
      title: '机器学习基础',
      desc: '机器学习算法原理与实践',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      createdAt: Date.now() - 3600000 * 12
    },
    {
      id: 'video-5',
      userId: 'user-4',
      title: 'Git版本控制',
      desc: 'Git和GitHub使用教程',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      createdAt: Date.now() - 3600000 * 6
    }
  ],
  follows: ['user-1']
}

const loadData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load data:', e)
  }
  return defaultData
}

const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save data:', e)
  }
}

const store = reactive(loadData())

watch(
  store,
  (newData) => {
    saveData(newData)
  },
  { deep: true }
)

const getUserById = (id) => {
  if (id === store.currentUser.id) return store.currentUser
  return store.users.find(u => u.id === id)
}

const getVideosByUserId = (userId) => {
  return store.videos.filter(v => v.userId === userId).sort((a, b) => b.createdAt - a.createdAt)
}

const getFollowedVideos = () => {
  return store.videos
    .filter(v => store.follows.includes(v.userId))
    .sort((a, b) => b.createdAt - a.createdAt)
}

const toggleFollow = (userId) => {
  const index = store.follows.indexOf(userId)
  if (index > -1) {
    store.follows.splice(index, 1)
    if (userId !== store.currentUser.id) {
      const user = getUserById(userId)
      if (user) user.followers--
    }
    return false
  } else {
    store.follows.push(userId)
    if (userId !== store.currentUser.id) {
      const user = getUserById(userId)
      if (user) user.followers++
    }
    return true
  }
}

const isFollowing = (userId) => {
  return store.follows.includes(userId)
}

const addVideo = (video) => {
  const newVideo = {
    id: `video-${Date.now()}`,
    userId: store.currentUser.id,
    ...video,
    createdAt: Date.now()
  }
  store.videos.unshift(newVideo)
  store.currentUser.works++
  return newVideo
}

const updateProfile = (profile) => {
  Object.assign(store.currentUser, profile)
}

const getFollowUsers = () => {
  return store.follows.map(id => getUserById(id)).filter(Boolean)
}

const getFans = () => {
  return store.users.filter(u => u.follows && u.follows.includes(store.currentUser.id))
}

export const useStore = () => ({
  store,
  getUserById,
  getVideosByUserId,
  getFollowedVideos,
  toggleFollow,
  isFollowing,
  addVideo,
  updateProfile,
  getFollowUsers,
  getFans
})

export default store