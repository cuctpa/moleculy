document.addEventListener('DOMContentLoaded', () => {
    initBlog();
});

function initBlog() {
    loadBlogPosts();
    initBlogEventListeners();
}

// Массив постов
let blogPosts = [];

// Загрузка постов из localStorage
function loadBlogPosts() {
    const savedPosts = localStorage.getItem('bioChemBlogPosts');
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    } else {
        // Начальные посты
        blogPosts = [
            {
                id: 1,
                title: "Мой первый день в 10 классе",
                content: "Сегодня начался мой первый день в 10 классе! Так волнительно. Мы начали изучать органическую химию - это так интересно! Особенно понравились формулы углеводородов.",
                date: "01.09.2023",
                tags: ["школа", "химия", "начало"]
            },
            {
                id: 2,
                title: "Эксперимент с кристаллами",
                content: "На выходных провела эксперимент по выращиванию кристаллов медного купороса. Получились прекрасные синие кристаллы! Процесс занял 3 дня, но результат того стоил.",
                date: "15.09.2023",
                tags: ["эксперимент", "кристаллы", "химия"]
            }
        ];
        saveBlogPosts();
    }
    
    renderBlogPosts();
}

// Сохранение постов
function saveBlogPosts() {
    localStorage.setItem('bioChemBlogPosts', JSON.stringify(blogPosts));
}

// Отображение постов
function renderBlogPosts(filter = '') {
    const container = document.getElementById('blogPosts');
    if (!container) return;
    
    container.innerHTML = '';
    
    let filteredPosts = blogPosts;
    
    if (filter) {
        filteredPosts = blogPosts.filter(post => 
            post.title.toLowerCase().includes(filter.toLowerCase()) ||
            post.content.toLowerCase().includes(filter.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
        );
    }
    
    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-book-open"></i>
                <h3>Постов не найдено</h3>
                <p>Попробуйте изменить поисковый запрос или создайте новый пост!</p>
            </div>
        `;
        return;
    }
    
    filteredPosts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <div class="post-header">
                <h3 class="post-title">${post.title}</h3>
                <span class="post-date">${post.date}</span>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
            </div>
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>
            <div class="post-actions">
                <button class="action-btn edit-post" data-id="${post.id}">
                    <i class="fas fa-edit"></i> Редактировать
                </button>
                <button class="action-btn delete-post" data-id="${post.id}">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        `;
        
        container.appendChild(postElement);
    });
    
    // Добавляем обработчики событий
    addPostEventListeners();
}

// Инициализация обработчиков событий блога
function initBlogEventListeners() {
    const newPostBtn = document.getElementById('newPostBtn');
    const blogSearch = document.getElementById('blogSearch');
    const postModal = document.getElementById('postModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelPostBtn = document.getElementById('cancelPostBtn');
    const savePostBtn = document.getElementById('savePostBtn');
    
    if (newPostBtn) {
        newPostBtn.addEventListener('click', () => {
            openPostModal();
        });
    }
    
    if (blogSearch) {
        blogSearch.addEventListener('input', (e) => {
            renderBlogPosts(e.target.value);
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closePostModal);
    }
    
    if (cancelPostBtn) {
        cancelPostBtn.addEventListener('click', closePostModal);
    }
    
    if (savePostBtn) {
        savePostBtn.addEventListener('click', savePost);
    }
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (e) => {
        if (e.target === postModal) {
            closePostModal();
        }
    });
}

function addPostEventListeners() {
    // Кнопки редактирования
    document.querySelectorAll('.edit-post').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postId = parseInt(e.target.closest('button').dataset.id);
            openPostModal(postId);
        });
    });
    
    // Кнопки удаления
    document.querySelectorAll('.delete-post').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postId = parseInt(e.target.closest('button').dataset.id);
            if (confirm('Вы уверены, что хотите удалить этот пост?')) {
                deletePost(postId);
            }
        });
    });
}

function openPostModal(postId = null) {
    const modal = document.getElementById('postModal');
    const titleInput = document.getElementById('postTitle');
    const contentInput = document.getElementById('postContent');
    const modalHeader = document.querySelector('.modal-header h3');
    
    if (postId) {
        // Редактирование существующего поста
        const post = blogPosts.find(p => p.id === postId);
        if (post) {
            titleInput.value = post.title;
            contentInput.value = post.content;
            modalHeader.textContent = 'Редактировать пост';
            modal.dataset.editId = postId;
        }
    } else {
        // Новый пост
        titleInput.value = '';
        contentInput.value = '';
        modalHeader.textContent = 'Новый пост в блог';
        delete modal.dataset.editId;
    }
    
    modal.classList.add('active');
    titleInput.focus();
}

function closePostModal() {
    const modal = document.getElementById('postModal');
    modal.classList.remove('active');
}

function savePost() {
    const titleInput = document.getElementById('postTitle');
    const contentInput = document.getElementById('postContent');
    const modal = document.getElementById('postModal');
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title || !content) {
        alert('Заполните все поля!');
        return;
    }
    
    if (modal.dataset.editId) {
        // Обновление существующего поста
        const postId = parseInt(modal.dataset.editId);
        const postIndex = blogPosts.findIndex(p => p.id === postId);
        
        if (postIndex !== -1) {
            blogPosts[postIndex].title = title;
            blogPosts[postIndex].content = content;
            blogPosts[postIndex].date = new Date().toLocaleDateString('ru-RU');
        }
    } else {
        // Создание нового поста
        const newPost = {
            id: blogPosts.length > 0 ? Math.max(...blogPosts.map(p => p.id)) + 1 : 1,
            title: title,
            content: content,
            date: new Date().toLocaleDateString('ru-RU'),
            tags: extractTags(content)
        };
        
        blogPosts.unshift(newPost);
        
        // Разблокировка достижения за первый пост
        if (blogPosts.length === 1) {
            window.unlockAchievement('blog_post');
        }
    }
    
    saveBlogPosts();
    renderBlogPosts();
    closePostModal();
    
    // Показываем уведомление
    showNotification('Пост успешно сохранен!', 'success');
}

function deletePost(postId) {
    blogPosts = blogPosts.filter(post => post.id !== postId);
    saveBlogPosts();
    renderBlogPosts();
    showNotification('Пост удален', 'info');
}

function extractTags(content) {
    const tags = [];
    const words = content.toLowerCase().split(/\s+/);
    
    const commonTags = ['химия', 'биология', 'эксперимент', 'школа', 'учеба', 'наука', 'открытие'];
    
    commonTags.forEach(tag => {
        if (content.toLowerCase().includes(tag)) {
            tags.push(tag);
        }
    });
    
    return tags.slice(0, 3); // Максимум 3 тега
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Анимация
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// CSS для тегов
const tagStyle = document.createElement('style');
tagStyle.textContent = `
    .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 1rem 0;
    }
    
    .tag {
        background: var(--primary);
        color: var(--dark);
        padding: 0.2rem 0.8rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .no-posts {
        text-align: center;
        padding: 3rem;
        color: #666;
    }
    
    .no-posts i {
        font-size: 3rem;
        color: var(--accent2);
        margin-bottom: 1rem;
    }
    
    .no-posts h3 {
        margin-bottom: 0.5rem;
        color: var(--dark);
    }
`;
document.head.appendChild(tagStyle);