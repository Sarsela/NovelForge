const novelData = {
    startSceneId: "start",
    scenes: {
        "start": {
            id: "start",
            background: "#667eea",
            dialogue: "🌅 Ты стоишь на перепутье. Куда отправишься?",
            choices: [
                { text: "🌲 Пойти в лес", target: "forest" },
                { text: "🏰 Пойти в замок", target: "castle" }
            ]
        },
        "forest": {
            id: "forest",
            background: "#2d6a4f",
            dialogue: "🌳 В лесу темно и таинственно...",
            choices: [
                { text: "🔦 Идти дальше", target: "treasure" },
                { text: "↩️ Вернуться", target: "start" }
            ]
        },
        "castle": {
            id: "castle",
            background: "#6c757d",
            dialogue: "🏰 Замок выглядит заброшенным. Войти?",
            choices: [
                { text: "🚪 Войти", target: "throne" },
                { text: "↩️ Уйти в лес", target: "forest" }
            ]
        },
        "treasure": {
            id: "treasure",
            background: "#ffc107",
            dialogue: "💰 Ты нашёл сундук с сокровищами! Конец!",
            choices: []
        },
        "throne": {
            id: "throne",
            background: "#dc3545",
            dialogue: "👑 Ты стал королём! История завершена.",
            choices: [{ text: "🏁 Начать сначала", target: "start" }]
        }
    }
};