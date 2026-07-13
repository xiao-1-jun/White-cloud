const videos = [
    {
        id: 1,
        title: 'Python入门教程',
        desc: '从零开始学习Python编程，适合零基础学员',
        duration: '45:32',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
        id: 2,
        title: 'Web开发实战',
        desc: 'HTML、CSS、JavaScript全栈开发教程',
        duration: '58:15',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
        id: 3,
        title: '数据可视化',
        desc: '使用Python进行数据可视化分析',
        duration: '32:48',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
        id: 4,
        title: '机器学习基础',
        desc: '机器学习算法原理与实践',
        duration: '1:12:20',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
        id: 5,
        title: 'Git版本控制',
        desc: 'Git和GitHub使用教程',
        duration: '28:10',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
        id: 6,
        title: 'Linux命令行',
        desc: 'Linux系统命令行入门到精通',
        duration: '42:55',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4'
    }
];

const videoGrid = document.getElementById('videoGrid');
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const closeBtn = document.getElementById('closeBtn');

function renderVideos() {
    videos.forEach((video, index) => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="video-thumbnail" data-duration="${video.duration}">
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-desc">${video.desc}</p>
            </div>
        `;
        
        card.addEventListener('click', () => openVideo(video));
        videoGrid.appendChild(card);
    });
}

function openVideo(video) {
    modalVideo.src = video.src;
    modalTitle.textContent = video.title;
    modalDesc.textContent = video.desc;
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideo() {
    videoModal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeVideo);

videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        closeVideo();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideo();
    }
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    renderVideos();
    
    document.querySelectorAll('.video-card').forEach(card => {
        observer.observe(card);
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;
});