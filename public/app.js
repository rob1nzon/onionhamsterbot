
let tg = window.Telegram.WebApp;
let coins = 0;
let liquidity = 0;
const coinsDisplay = document.getElementById('coins');
const liquidityDisplay = document.getElementById('liquidity');
const onion = document.getElementById('onion');
const userInfo = document.getElementById('user-info');
const authButton = document.getElementById('auth-button');
const addLiquidityButton = document.getElementById('add-liquidity');
const removeLiquidityButton = document.getElementById('remove-liquidity');

tg.expand();

// Функция для проверки авторизации
function checkAuthorization() {
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        // Пользователь авторизован
        userInfo.textContent = `Привет, ${tg.initDataUnsafe.user.first_name}!`;
        authButton.style.display = 'none';
        initGame();
    } else {
        // Пользователь не авторизован
        userInfo.textContent = 'Пожалуйста, авторизуйтесь';
        authButton.style.display = 'block';
        onion.style.pointerEvents = 'none'; // Отключаем клики по луку
    }
}

authButton.addEventListener('click', () => {
    tg.showPopup({
        title: 'Авторизация',
        message: 'Для игры необходимо авторизоваться',
        buttons: [{ type: 'ok', text: 'Авторизоваться' }]
    }, () => {
        // Этот колбэк вызовется после закрытия попапа
        // В реальном приложении здесь должна быть логика авторизации
        checkAuthorization();
    });
});

async function getUserData() {
    if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
        return null;
    }
    const response = await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: tg.initDataUnsafe.user.id })
    });
    return await response.json();
}

async function saveUserData() {
    if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
        return;
    }
    await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: tg.initDataUnsafe.user.id, coins, liquidity })
    });
}


async function initGame() {
    const userData = await getUserData();
    if (userData) {
        coins = userData.coins || 0;
        updateCoinsDisplay();
        onion.style.pointerEvents = 'auto'; // Включаем клики по луку
    }
}

function updateCoinsDisplay() {
    coinsDisplay.textContent = `Луккоины: ${coins}`;
}

async function clickOnion() {
    coins++;
    updateCoinsDisplay();
    createFloatingCoin();
    if (coins % 10 === 0) createBackgroundOnion();
    await saveUserData();
}


tg.expand();

async function getUserData() {
    const response = await fetch('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: tg.initDataUnsafe.user.id })
    });
    return await response.json();
}

async function saveUserData() {
    await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: tg.initDataUnsafe.user.id, coins: coins })
    });
}

async function initGame() {
    const userData = await getUserData();
    if (userData) {
        coins = userData.coins || 0;
        liquidity = userData.liquidity || 0;
        updateDisplays();
        onion.style.pointerEvents = 'auto';
    }
}

function updateDisplays() {
    coinsDisplay.textContent = `Луккоины: ${coins}`;
    liquidityDisplay.textContent = `Ликвидность: ${liquidity}`;
}

function updateCoinsDisplay() {
    coinsDisplay.textContent = `Луккоины: ${coins}`;
}

async function clickOnion() {
    coins++;
    updateDisplays();
    createFloatingCoin();
    if (coins % 10 === 0) createBackgroundOnion();
    await saveUserData();
}

function addLiquidity() {
    if (coins >= 10) {
        coins -= 10;
        liquidity++;
        updateDisplays();
        saveUserData();
    } else {
        alert('Недостаточно луккоинов для добавления ликвидности!');
    }
}

function removeLiquidity() {
    if (liquidity > 0) {
        liquidity--;
        coins += 9; // 10% комиссия при выводе ликвидности
        updateDisplays();
        saveUserData();
    } else {
        alert('У вас нет ликвидности для вывода!');
    }
}


function createFloatingCoin() {
    const coin = document.createElement('div');
    coin.textContent = '+1';
    coin.classList.add('coin');
    coin.style.left = `${Math.random() * window.innerWidth}px`;
    coin.style.top = `${Math.random() * window.innerHeight}px`;
    document.body.appendChild(coin);
    setTimeout(() => coin.remove(), 1000);
}

function createBackgroundOnion() {
    const bgOnion = document.createElement('div');
    bgOnion.textContent = '🧅';
    bgOnion.classList.add('background-onion');
    bgOnion.style.left = `${Math.random() * window.innerWidth}px`;
    bgOnion.style.top = `${Math.random() * window.innerHeight}px`;
    document.body.appendChild(bgOnion);
    setTimeout(() => bgOnion.remove(), 20000);
}

// ... (остальные функции остаются без изменений) ...

onion.addEventListener('click', clickOnion);
addLiquidityButton.addEventListener('click', addLiquidity);
removeLiquidityButton.addEventListener('click', removeLiquidity);

// Запускаем проверку авторизации при загрузке страницы
checkAuthorization();

// Добавляем обработчик для события viewportChanged
tg.onEvent('viewportChanged', checkAuthorization);
onion.addEventListener('click', clickOnion);
initGame();
