const STORAGE_NOVELS_KEY = "novels";
const STORAGE_READING_PROGRESS_KEY = "reading_progress";

const GENRES = [
    "Романтика", "Фэнтези", "Научная фантастика", "Детектив", 
    "Ужасы", "Приключения", "Комедия", "Драма", "Постапокалипсис", "Киберпанк"
];

function getNovels() {
    const novels = localStorage.getItem(STORAGE_NOVELS_KEY);
    if (novels) return JSON.parse(novels);
    
    const defaultNovels = [
        {
            id: "novel_1",
            title: "Тайна старого замка",
            author: "Тестовый Автор",
            authorEmail: "author@example.com",
            description: "Мистическая история о заброшенном замке и его тайнах.",
            coverImage: null,
            genre: "Детектив",
            rating: 4.5,
            ratingsCount: 128,
            createdAt: "2025-01-15T10:00:00Z",
            updatedAt: "2025-01-20T15:30:00Z",
            views: 1542,
            startSceneId: "start",
            scenes: {
                "start": {
                    id: "start",
                    background: "#2c3e50",
                    backgroundImage: null,
                    character: "Вы",
                    dialogue: "Ты стоишь перед воротами старого замка...",
                    choices: [
                        { text: "Войти в замок", target: "hall", conditions: [] },
                        { text: "Вернуться домой", target: "home", conditions: [] }
                    ]
                },
                "hall": {
                    id: "hall",
                    background: "#4a2e2e",
                    dialogue: "Ты входишь в главный зал...",
                    choices: [
                        { text: "Подойти к блеску", target: "treasure", conditions: [] },
                        { text: "Изучить свитки", target: "scrolls", conditions: [] }
                    ]
                },
                "treasure": {
                    id: "treasure",
                    background: "#daa520",
                    dialogue: "Ты нашёл сокровище! Поздравляю!",
                    choices: [{ text: "Начать сначала", target: "start", conditions: [] }]
                },
                "scrolls": {
                    id: "scrolls",
                    background: "#8b4513",
                    dialogue: "Ты узнал тайну замка!",
                    choices: [{ text: "Завершить", target: "start", conditions: [] }]
                },
                "home": {
                    id: "home",
                    background: "#2ecc71",
                    dialogue: "Ты вернулся домой...",
                    choices: [{ text: "Попробовать снова", target: "start", conditions: [] }]
                }
            }
        }
    ];
    localStorage.setItem(STORAGE_NOVELS_KEY, JSON.stringify(defaultNovels));
    return defaultNovels;
}

function saveNovels(novels) {
    localStorage.setItem(STORAGE_NOVELS_KEY, JSON.stringify(novels));
}

function addNovel(novel) {
    const novels = getNovels();
    const newId = "novel_" + Date.now();
    const newNovel = {
        ...novel,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        rating: 0,
        ratingsCount: 0
    };
    novels.push(newNovel);
    saveNovels(novels);
    return newId;
}

function updateNovel(novelId, updatedData) {
    const novels = getNovels();
    const index = novels.findIndex(n => n.id === novelId);
    if (index !== -1) {
        novels[index] = { ...novels[index], ...updatedData, updatedAt: new Date().toISOString() };
        saveNovels(novels);
    }
}

function deleteNovel(novelId) {
    let novels = getNovels();
    novels = novels.filter(n => n.id !== novelId);
    saveNovels(novels);
}

function rateNovel(novelId, rating, userId) {
    const novels = getNovels();
    const novel = novels.find(n => n.id === novelId);
    if (novel) {
        const ratings = JSON.parse(localStorage.getItem(`ratings_${novelId}`) || "{}");
        if (!ratings[userId]) {
            ratings[userId] = rating;
            localStorage.setItem(`ratings_${novelId}`, JSON.stringify(ratings));
            
            const total = Object.values(ratings).reduce((a, b) => a + b, 0);
            const count = Object.keys(ratings).length;
            novel.rating = total / count;
            novel.ratingsCount = count;
            saveNovels(novels);
            return true;
        }
    }
    return false;
}

function getUserRating(novelId, userId) {
    const ratings = JSON.parse(localStorage.getItem(`ratings_${novelId}`) || "{}");
    return ratings[userId] || null;
}

function saveReadingProgress(novelId, sceneId, userId) {
    const progress = JSON.parse(localStorage.getItem(STORAGE_READING_PROGRESS_KEY) || "{}");
    progress[`${userId}_${novelId}`] = {
        sceneId: sceneId,
        lastRead: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_READING_PROGRESS_KEY, JSON.stringify(progress));
}

function getReadingProgress(novelId, userId) {
    const progress = JSON.parse(localStorage.getItem(STORAGE_READING_PROGRESS_KEY) || "{}");
    return progress[`${userId}_${novelId}`] || null;
}

function addComment(novelId, userId, userName, comment) {
    const comments = JSON.parse(localStorage.getItem(`comments_${novelId}`) || "[]");
    comments.unshift({
        id: Date.now(),
        userId: userId,
        userName: userName,
        comment: comment,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem(`comments_${novelId}`, JSON.stringify(comments));
    return comments;
}

function getComments(novelId) {
    return JSON.parse(localStorage.getItem(`comments_${novelId}`) || "[]");
}

function incrementViews(novelId) {
    const novels = getNovels();
    const novel = novels.find(n => n.id === novelId);
    if (novel) {
        novel.views++;
        saveNovels(novels);
    }
}