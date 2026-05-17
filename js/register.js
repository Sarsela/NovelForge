const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const pass = document.getElementById("regPassword").value;
        const pass2 = document.getElementById("regPasswordConfirm").value;
        
        if (!name || !email || !pass) {
            showMessage("Заполните все поля!", "danger");
            return;
        }
        if (pass !== pass2) {
            showMessage("Пароли не совпадают!", "danger");
            return;
        }
        if (pass.length < 4) {
            showMessage("Пароль должен быть минимум 4 символа", "danger");
            return;
        }
        
        localStorage.setItem("novel_user", JSON.stringify({ name, email, registered: true, date: new Date() }));
        showMessage(`✅ Добро пожаловать, ${name}! Регистрация успешна.`, "success");
        registerForm.reset();
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    });
}

function showMessage(msg, type) {
    const div = document.getElementById("registerMessage");
    div.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
    setTimeout(() => div.innerHTML = "", 3000);
}