let tg = window.Telegram.WebApp;
let coins = 0;
const coinsDisplay = document.getElementById('coins');
const onion = document.getElementById('onion');
const userInfo = document.getElementById('user-info');

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
    coins = userData.coins || 0;
    updateCoinsDisplay();
    userInfo.textContent = `Привет, ${tg.initDataUnsafe.user.first_name}!`;
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

onion.addEventListener('click', clickOnion);
initGame();
