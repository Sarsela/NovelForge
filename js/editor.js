let currentSceneId = "start";
let previewSceneId = "start";
let novel = JSON.parse(JSON.stringify(novelData));

function renderSceneList() {
    const container = document.getElementById("sceneList");
    container.innerHTML = "";
    for (let id in novel.scenes) {
        const scene = novel.scenes[id];
        const div = document.createElement("div");
        div.className = `scene-card ${currentSceneId === id ? 'active' : ''}`;
        div.innerHTML = `<strong>${id}</strong><br><small>${scene.dialogue.substring(0, 40)}</small>`;
        div.onclick = () => {
            currentSceneId = id;
            previewSceneId = id;
            loadSceneToEditor(id);
            updatePreview(id);
            renderSceneList();
        };
        container.appendChild(div);
    }
}

function loadSceneToEditor(sceneId) {
    const scene = novel.scenes[sceneId];
    if (!scene) return;
    document.getElementById("sceneId").value = scene.id;
    document.getElementById("bgInput").value = scene.background || "";
    document.getElementById("dialogueInput").value = scene.dialogue || "";
    
    const container = document.getElementById("choicesContainer");
    container.innerHTML = "";
    if (scene.choices && scene.choices.length) {
        scene.choices.forEach(ch => addChoiceRow(ch.text, ch.target));
    } else {
        addChoiceRow("", "");
    }
}

function addChoiceRow(text = "", target = "") {
    const container = document.getElementById("choicesContainer");
    const div = document.createElement("div");
    div.className = "input-group mb-2";
    div.innerHTML = `
        <input type="text" class="form-control choice-text" placeholder="Текст" value="${escapeHtml(text)}">
        <input type="text" class="form-control choice-target" placeholder="ID сцены" value="${escapeHtml(target)}">
        <button class="btn btn-outline-danger remove-choice" type="button"><i class="bi bi-x"></i></button>
    `;
    container.appendChild(div);
}

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function collectChoices() {
    const rows = document.querySelectorAll("#choicesContainer .input-group");
    const choices = [];
    rows.forEach(row => {
        const text = row.querySelector(".choice-text").value.trim();
        const target = row.querySelector(".choice-target").value.trim();
        if (text && target) choices.push({ text, target });
    });
    return choices;
}

function saveCurrentScene() {
    const sceneId = document.getElementById("sceneId").value.trim();
    if (!sceneId) { alert("Укажите ID сцены!"); return; }
    const background = document.getElementById("bgInput").value.trim() || "#343a40";
    const dialogue = document.getElementById("dialogueInput").value.trim() || "...";
    const choices = collectChoices();
    
    if (currentSceneId !== sceneId) {
        if (novel.scenes[sceneId]) { alert("Сцена с таким ID уже есть!"); return; }
        delete novel.scenes[currentSceneId];
        currentSceneId = sceneId;
    }
    novel.scenes[sceneId] = { id: sceneId, background, dialogue, choices };
    renderSceneList();
    if (previewSceneId === sceneId) updatePreview(sceneId);
    alert("Сцена сохранена!");
}

function deleteCurrentScene() {
    if (currentSceneId === novel.startSceneId) { alert("Нельзя удалить стартовую сцену!"); return; }
    delete novel.scenes[currentSceneId];
    const remaining = Object.keys(novel.scenes);
    if (!remaining.length) { alert("Создайте новую сцену"); return; }
    currentSceneId = remaining[0];
    previewSceneId = currentSceneId;
    loadSceneToEditor(currentSceneId);
    updatePreview(currentSceneId);
    renderSceneList();
}

function createNewScene() {
    let newId = "new_scene";
    let cnt = 1;
    while (novel.scenes[newId + (cnt > 1 ? cnt : "")]) cnt++;
    const finalId = newId + (cnt > 1 ? cnt : "");
    novel.scenes[finalId] = { id: finalId, background: "#343a40", dialogue: "Новая сцена", choices: [] };
    currentSceneId = finalId;
    loadSceneToEditor(currentSceneId);
    renderSceneList();
}

function updatePreview(sceneId) {
    const scene = novel.scenes[sceneId];
    if (!scene) return;
    const bgDiv = document.getElementById("previewBg");
    if (scene.background && scene.background.startsWith("http")) {
        bgDiv.style.backgroundImage = `url(${scene.background})`;
        bgDiv.style.backgroundSize = "cover";
        bgDiv.innerHTML = "";
    } else {
        bgDiv.style.backgroundImage = "none";
        bgDiv.style.backgroundColor = scene.background || "#343a40";
        bgDiv.innerHTML = "🎨";
    }
    document.getElementById("previewDialogue").innerHTML = scene.dialogue;
    const choicesDiv = document.getElementById("previewChoices");
    choicesDiv.innerHTML = "";
    if (scene.choices && scene.choices.length) {
        scene.choices.forEach(ch => {
            const btn = document.createElement("button");
            btn.className = "btn btn-outline-light btn-sm m-1";
            btn.innerHTML = ch.text;
            btn.onclick = () => {
                if (novel.scenes[ch.target]) {
                    previewSceneId = ch.target;
                    updatePreview(previewSceneId);
                } else alert(`Сцена "${ch.target}" не найдена`);
            };
            choicesDiv.appendChild(btn);
        });
    } else {
        const reset = document.createElement("button");
        reset.className = "btn btn-warning btn-sm m-1";
        reset.innerHTML = "🏁 Начать сначала";
        reset.onclick = () => {
            previewSceneId = novel.startSceneId;
            updatePreview(previewSceneId);
        };
        choicesDiv.appendChild(reset);
    }
}

function exportProject() {
    const dataStr = JSON.stringify(novel, null, 2);
    const blob = new Blob([dataStr], {type: "application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "novel_project.json";
    a.click();
    alert("Проект экспортирован!");
}

document.getElementById("saveBtn")?.addEventListener("click", saveCurrentScene);
document.getElementById("deleteBtn")?.addEventListener("click", deleteCurrentScene);
document.getElementById("newSceneBtn")?.addEventListener("click", createNewScene);
document.getElementById("exportBtn")?.addEventListener("click", exportProject);
document.getElementById("addChoiceBtn")?.addEventListener("click", () => addChoiceRow());

renderSceneList();
loadSceneToEditor(currentSceneId);
updatePreview("start");