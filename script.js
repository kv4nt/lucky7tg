const coinBalanceSpan = document.getElementById('coin-balance');
const addCoinsButton = document.getElementById('add-coins-button');
const playButton = document.getElementById('play-button');
const resultDisplay = document.getElementById('result-display');
const messageArea = document.getElementById('message-area');
const resultArea = document.querySelector('.result-area'); // Получаем div с классом result-area

let coinBalance = 100; // Начальный баланс
const playCost = 10;   // Стоимость игры
const winPayout = 90;  // Выигрыш при выпадении 7 (добавляется к балансу)
const replenishAmount = 50; // Сумма пополнения

// Функция для обновления отображения баланса
function updateBalanceDisplay() {
    coinBalanceSpan.textContent = coinBalance;
}

// Инициализация: отобразить начальный баланс при загрузке страницы
updateBalanceDisplay();

// Обработчик для кнопки пополнения монет
addCoinsButton.addEventListener('click', () => {
    coinBalance += replenishAmount;
    updateBalanceDisplay();
    messageArea.textContent = `Вы пополнили баланс на ${replenishAmount} монет.`;
    messageArea.className = 'info-message'; // Класс для информационных сообщений
});

// Обработчик для кнопки \"Играть\"
playButton.addEventListener('click', () => {
    // Проверка на наличие достаточного количества монет
    if (coinBalance < playCost) {
        messageArea.textContent = `Недостаточно монет! Необходимо ${playCost} монет для игры.`;
        messageArea.className = 'loss-message'; // Класс для сообщений об ошибке/проигрыше
        return; // Прекращаем выполнение функции, если монет мало
    }

    // Снимаем стоимость игры
    coinBalance -= playCost;
    updateBalanceDisplay();
    messageArea.textContent = 'Делаем ставку...';
    messageArea.className = 'info-message';

    // Отключаем кнопку \"Играть\" во время анимации
    playButton.disabled = true;

    // Запускаем анимацию \"вращения\" и генерацию числа
    startRollAnimation().then(finalNumber => {
        // Анимация завершена, обрабатываем результат
        let message = '';
        let messageClass = '';

        if (finalNumber === 7) {
            // Выигрыш! Добавляем выигрыш к балансу
            coinBalance += winPayout;
            message = `Поздравляем! Выпало ${finalNumber}! Вы выиграли ${winPayout} монет!`;
            messageClass = 'win-message'; // Класс для сообщений о выигрыше
        } else {
            // Проигрыш. Стоимость игры уже снята
            message = `Выпало ${finalNumber}. Вы проиграли ${playCost} монет. Попробуйте еще!`;
            messageClass = 'loss-message'; // Класс для сообщений о проигрыше
        }

        // Обновляем отображение баланса после обработки результата
        updateBalanceDisplay();
        // Отображаем сообщение о результате
        messageArea.textContent = message;
        messageArea.className = messageClass;

        // Включаем кнопку \"Играть\" снова
        playButton.disabled = false;
    });
});

// Функция для запуска анимации \"вращения\" и определения финального числа
function startRollAnimation() {
    return new Promise(resolve => {
        let interval;
        const duration = 2000; // Длительность анимации в миллисекундах (2 секунды)
        const intervalSpeed = 50; // Скорость смены чисел в миллисекундах

        // Добавляем класс для CSS анимации \"вращения\"
        resultArea.classList.add('rolling');
        resultDisplay.textContent = '?'; // Сбрасываем отображение перед началом

        let startTime = Date.now();

        interval = setInterval(() => {
            // Быстро меняем число в resultDisplay на случайное (от 0 до 10)
            const randomNum = Math.floor(Math.random() * 11); // Генерирует целое число от 0 до 10
            resultDisplay.textContent = randomNum;

            // Проверяем, не прошло ли время анимации
            if (Date.now() - startTime >= duration) {
                clearInterval(interval); // Останавливаем интервал
                resultArea.classList.remove('rolling'); // Убираем класс CSS анимации

                // Определяем окончательное случайное число (от 0 до 10)
                const finalNumber = Math.floor(Math.random() * 11);
                resultDisplay.textContent = finalNumber; // Показываем финальное число

                resolve(finalNumber); // Завершаем промис, передавая финальное число
            }
        }, intervalSpeed);
    });
}
