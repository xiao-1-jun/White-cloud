<template>
  <nav class="navbar">
    <div class="nav-content">
      <div class="nav-left">
        <span class="logo">🎬</span>
        <span class="title">视频流</span>
      </div>
      <div class="nav-right">
        <button class="nav-btn" @click="$router.push('/')">首页</button>
        <button class="nav-btn" @click="$router.push('/upload')">上传</button>
        <button class="nav-btn" @click="$router.push('/follow')">关注</button>
        <button class="nav-btn" @click="$router.push('/profile')">我的</button>
      </div>
    </div>
  </nav>
</template>