const STORAGE_USERS_KEY = "novel_users";
const STORAGE_CURRENT_USER_KEY = "novel_current_user";

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
    const users = localStorage.getItem(STORAGE_USERS_KEY);
    if (users) return JSON.parse(users);
    const defaultUsers = {
        "author@example.com": {
            name: "Тестовый Автор",
            email: "author@example.com",
            password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", // "password"
            role: "author",
            registeredAt: new Date().toISOString()
        },
        "reader@example.com": {
            name: "Тестовый Читатель",
            email: "reader@example.com",
            password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
            role: "reader",
            registeredAt: new Date().toISOString()
        }
    };
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
}

async function saveUser(email, name, password, role = "reader") {
    const users = getUsers();
    const hashedPassword = await hashPassword(password);
    users[email] = {
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
        registeredAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

async function loginUser(email, password) {
    const users = getUsers();
    const user = users[email];
    if (user) {
        const hashedInput = await hashPassword(password);
        if (user.password === hashedInput) {
            localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify({
                name: user.name,
                email: user.email,
                role: user.role || "reader",
                isLoggedIn: true
            }));
            return true;
        }
    }
    return false;
}

function isUserLoggedIn() {
    const current = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (current) {
        try {
            const data = JSON.parse(current);
            return data && data.isLoggedIn === true;
        } catch(e) { return false; }
    }
    return false;
}

function getCurrentUser() {
    const current = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    return current ? JSON.parse(current) : null;
}

function isAuthor() {
    const user = getCurrentUser();
    return user && user.role === "author";
}

function logout() {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    window.location.href = "index.html";
}

function requireAuth() {
    if (!isUserLoggedIn()) {
        localStorage.setItem("redirectAfterLogin", window.location.pathname);
        window.location.href = "login.html";
        return false;
    }
    return true;
}

function requireAuthor() {
    if (!requireAuth()) return false;
    if (!isAuthor()) {
        alert("Доступ только для авторов! Зарегистрируйтесь как автор.");
        window.location.href = "index.html";
        return false;
    }
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function userExists(email) {
    const users = getUsers();
    return !!users[email];
}
