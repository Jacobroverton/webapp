const setParallax = () => {
    const parallax = document.querySelector('.parallax');
    if (parallax) parallax.style.transform = `translateY(${window.pageYOffset * -0.15}px)`;
};

const toggleHeaderOpacity = () => {
    const header = document.querySelector('header');
    if (header) header.classList.toggle('scrolled', window.pageYOffset > 0);
};

const saveLists = () => {
    const getItems = id => Array.from(document.getElementById(id).children).map(item => item.querySelector('.grocery-item').textContent);
    localStorage.setItem('uncheckedList', JSON.stringify(getItems('uncheckedList')));
    localStorage.setItem('checkedList', JSON.stringify(getItems('checkedList')));
};

const loadLists = () => {
    const createItems = (list, id) => list.forEach(item => addItemToList(item, id === 'checkedList'));
    createItems(JSON.parse(localStorage.getItem('uncheckedList')) || [], 'uncheckedList');
    createItems(JSON.parse(localStorage.getItem('checkedList')) || [], 'checkedList');
};

const addItemToList = (itemText, checked) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span class="grocery-item">${itemText}</span>
        <div class="grocery-actions">
            <button class="check">${checked ? 'Uncheck' : 'Check'}</button>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
    `;
    if (checked) listItem.classList.add('checked');
    document.getElementById(checked ? 'checkedList' : 'uncheckedList').appendChild(listItem);
    listItem.querySelector('.check').addEventListener('click', () => {
        listItem.classList.toggle('checked');
        document.getElementById(listItem.classList.contains('checked') ? 'checkedList' : 'uncheckedList').appendChild(listItem);
        listItem.querySelector('.check').textContent = listItem.classList.contains('checked') ? 'Uncheck' : 'Check';
        saveLists();
    });
    listItem.querySelector('.edit').addEventListener('click', () => editItem(listItem));
    listItem.querySelector('.delete').addEventListener('click', () => {
        listItem.remove();
        saveLists();
    });
};

const addItem = () => {
    const input = document.getElementById('groceryInput');
    if (input.value.trim()) {
        addItemToList(input.value.trim(), false);
        saveLists();
        input.value = '';
        input.focus();
    }
};

const editItem = listItem => {
    const itemSpan = listItem.querySelector('.grocery-item');
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = itemSpan.textContent;
    editInput.className = 'edit-input';
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'save';
    const saveChanges = () => {
        if (editInput.value.trim()) {
            itemSpan.textContent = editInput.value.trim();
            editInput.remove();
            saveButton.remove();
            itemSpan.style.display = 'inline';
            saveLists();
        }
    };
    saveButton.addEventListener('click', saveChanges);
    editInput.addEventListener('keypress', e => e.key === 'Enter' && saveChanges());
    itemSpan.style.display = 'none';
    listItem.insertBefore(editInput, itemSpan.nextSibling);
    listItem.insertBefore(saveButton, editInput.nextSibling);
};

const calculateTip = () => {
    const billAmount = parseFloat(document.getElementById('billAmount').value);
    const tipPercent = parseFloat(document.getElementById('tipPercent').value);
    const totalBill = document.getElementById('totalBill');
    if (!isNaN(billAmount) && !isNaN(tipPercent)) {
        totalBill.innerText = (billAmount + (billAmount * tipPercent / 100)).toFixed(2);
    } else {
        totalBill.innerText = '0.00';
    }
};

document.getElementById('addButton')?.addEventListener('click', addItem);
document.getElementById('groceryInput')?.addEventListener('keypress', e => e.key === 'Enter' && addItem());

document.querySelector('button[onclick="calculateTip()"]')?.addEventListener('click', calculateTip);

window.addEventListener('scroll', () => {
    setParallax();
    toggleHeaderOpacity();
});

window.addEventListener('DOMContentLoaded', () => {
    setParallax();
    toggleHeaderOpacity();
    loadLists();
    initMap();
});

let consecutiveWins = 0;
let currentLevel = 1;
let secretMoveSequence = '1234567890';
let secretMoveIndex = 0;

const getComputerChoice = () => {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * 3)];
};

const updateLevel = () => {
    const levelElement = document.getElementById('current-level');
    if (consecutiveWins === 3) {
        currentLevel++;
        levelElement.textContent = currentLevel;
        document.getElementById('result-message').textContent = `You have leveled up to Level ${currentLevel}!`;
        consecutiveWins = 0;
    }
};

const playRound = (playerChoice) => {
    const computerChoice = getComputerChoice();
    let resultMessage = '';

    if (playerChoice === computerChoice) {
        resultMessage = `It's a tie! You both chose ${playerChoice}.`;
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        resultMessage = `You win! ${playerChoice} beats ${computerChoice}.`;
        consecutiveWins++;
        updateLevel();
    } else {
        resultMessage = `You lose! ${computerChoice} beats ${playerChoice}.`;
        consecutiveWins = 0;
    }

    document.getElementById('result-message').textContent = resultMessage;
    document.getElementById('consecutive-wins').textContent = consecutiveWins;
};

const checkSecretMove = (key) => {
    if (key === secretMoveSequence[secretMoveIndex]) {
        secretMoveIndex++;
        if (secretMoveIndex === secretMoveSequence.length) {
            currentLevel = 1000;
            document.getElementById('current-level').textContent = currentLevel;
            document.getElementById('result-message').textContent = 'You used GUN!';
            secretMoveIndex = 0;
        }
    } else {
        secretMoveIndex = 0;
    }
};

document.addEventListener('keydown', (event) => {
    checkSecretMove(event.key);
});

const getWeather = async () => {
    const city = document.getElementById('cityInput').value;
    const apiKey = 'd49533afe8b5f59c0302217867c82f12';
    const weatherResult = document.getElementById('weatherResult');

    if (city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            const data = await response.json();

            if (data.cod === 200) {
                const temperatureFahrenheit = (data.main.temp * 9/5) + 32;
                weatherResult.textContent = `The weather in ${data.name} is currently ${data.weather[0].description} and the temperature is ${temperatureFahrenheit.toFixed(1)}°F`;
            } else {
                weatherResult.textContent = `Error: ${data.message}`;
            }
        } catch (error) {
            weatherResult.textContent = `Error: ${error.message}`;
        }
    } else {
        weatherResult.textContent = 'Please enter a city name.';
    }
};

document.getElementById('getWeatherButton').addEventListener('click', getWeather);

// Google Maps Integration
let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
        zoom: 8
    });

    map.addListener('click', async (event) => {
        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();
        const weatherData = await fetchWeatherData(lat, lng);
        displayWeatherPopup(weatherData, latLng);
    });
}

async function fetchWeatherData(lat, lng) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=d49533afe8b5f59c0302217867c82f12&units=metric`);
    return response.json();
}

function displayWeatherPopup(data, latLng) {
    const infowindow = new google.maps.InfoWindow({
        content: `<h3>${data.name}</h3><p>${data.weather[0].description}, ${data.main.temp}°C</p>`,
        position: latLng
    });
    infowindow.open(map);
}

window.addEventListener('DOMContentLoaded', () => {
    initMap();
});
