const buttonPlay = document.querySelector('.play');
const form = document.getElementById("registrationForm");
const restartButton = document.querySelector('.restart-button');
const newGameButton = document.querySelector('.new-game');
const sectionGritting = document.querySelector('.greeting');
const sectionPlayersProfile = document.querySelector('.players-profile');
const sectionGameField = document.querySelector('.game-field');
const sectionCongratulation = document.querySelector('.congratulation');
const divGameField = document.querySelector('#gameField');
const backwardButton = document.querySelector('.backward-button');
const timer = document.querySelector(".timer");
const cards = document.querySelector('.cards');
const USER_KEY_STORAGE = 'USER_KEY_STORAGE';
const RESULT_KEY_STORAGE = 'RESULT_KEY_STORAGE';
const userObject = {};
const openCardImage = [
    'white url("images/image_1.png") no-repeat',
    'white url("images/image_2.png") no-repeat',
    'white url("images/image_3.png") no-repeat',
    'white url("images/image_4.png") no-repeat',
    'white url("images/image_5.png") no-repeat',
    'white url("images/image_6.png") no-repeat',
    'white url("images/image_7.png") no-repeat',
    'white url("images/image_8.png") no-repeat',
    'white url("images/image_9.png") no-repeat',
    'white url("images/image_10.png") no-repeat',
    'white url("images/image_11.png") no-repeat',
    'white url("images/image_12.png") no-repeat',
    'white url("images/image_14.png") no-repeat',
    'white url("images/image_15.png") no-repeat',
    'white url("images/image_16.png") no-repeat',
    'white url("images/image_17.png") no-repeat',
    'white url("images/image_18.png") no-repeat',
];
let interval;
let cardsArray = [];
let openCardsArray = [];
let idForLi = [];
let counterGuessedCard = 0;
let seconds = 0;
let minutes = 0;
//localStorage.clear();

let start = function () {
    let difficulty = +userObject.difficulty;
    divGameField.removeAttribute("class");
    cards.innerHTML = '';
    openCardsArray = [];
    cardsArray = [];
    idForLi = [];
    counterGuessedCard = 0;
    for (let i = 0; i < difficulty; i++) {
        const card = document.createElement('li');
        card.classList.add('card', userObject['shirt']);
        card.setAttribute('id', `${i}`);
        cardsArray.push(card);
        cards.appendChild(card);
    }
    switch (difficulty) {
        case 12:
            divGameField.classList.add('game-field-wrapper_easy');
            break;
        case 20:
            divGameField.classList.add('game-field-wrapper_medium');
            break;
        default:
            divGameField.classList.add('game-field-wrapper_hard');
    }
    cardsArray.forEach((i, index) => i[0] = openCardImage[index % (cardsArray.length / 2)]);
    shuffle(cardsArray);
    seconds = 0;
    minutes = 0;
    timer.innerHTML = "0 mins  0 secs";
    clearInterval(interval);
    startTimer();
};

let displayCard = function (e) {
    e.target.style.background = cardsArray[e.target.id][0];
    e.target.style.backgroundSize = 'cover';
    e.target.classList.add('rotation-effect');
    openCardsArray.push(cardsArray[e.target.id]);
    idForLi.push(+e.target.id);
    let firstOpen = document.getElementById(idForLi[0]);
    let secondOpen = document.getElementById(idForLi[1]);
    compareCheckCards(firstOpen, secondOpen);
};

let shuffle = function (array) {
    let currentIndex = array.length;
    let randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

let compareCheckCards = function (firstOpen, secondOpen) {
    if (openCardsArray.length === 2 && openCardsArray[0][0] === openCardsArray[1][0]) {
        counterGuessedCard++;
        setTimeout(function () {
            setTimeout(function () {
                firstOpen.classList.add('disappearance');
                secondOpen.classList.add('disappearance');
            }, 100);
            if (counterGuessedCard === userObject.difficulty / 2) {
                setTimeout(function () {
                    sectionGameField.style.display = 'none';
                    sectionCongratulation.style.display = 'block';
                }, 1000);
                checkAndInsertToStorageResult();
                showTopList();
            }
        }, 700);
        openCardsArray = [];
        idForLi = [];
    } else if (openCardsArray.length === 2 && openCardsArray[0][0] !== openCardsArray[1][0]) {
        setTimeout(function () {
            firstOpen.classList.remove('rotation-effect');
            secondOpen.classList.remove('rotation-effect');
            setTimeout(function () {
                firstOpen.removeAttribute("style");
                secondOpen.removeAttribute("style");
                secondOpen.classList.add('rotation-effect');
                firstOpen.classList.add('rotation-effect');
                setTimeout(function () {
                    firstOpen.classList.remove('rotation-effect');
                    secondOpen.classList.remove('rotation-effect');
                }, 700);
            }, 100);
        }, 700);
        openCardsArray = [];
        idForLi = [];
    }
};

let startTimer = function () {
    interval = setInterval(function () {
        timer.innerHTML = `${minutes} mins ${seconds + 1} secs`;
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
    }, 1000);
};

let checkAndInsertToStorageResult = function () {
    const gameResults = getResGame();
    if (localStorage.getItem(RESULT_KEY_STORAGE) === null) {
        let rootRes = {};
        rootRes[userObject.email] = gameResults;
        localStorage.setItem(RESULT_KEY_STORAGE, JSON.stringify(rootRes));
    } else {
        let results = JSON.parse(localStorage.getItem(RESULT_KEY_STORAGE));
        if (results[userObject.email] === undefined) {
            results[userObject.email] = gameResults;
            localStorage.setItem(RESULT_KEY_STORAGE, JSON.stringify(results));
        } else if (results[userObject.email].score < gameResults.score) {
            results[userObject.email] = gameResults;
            localStorage.setItem(RESULT_KEY_STORAGE, JSON.stringify(results));
        }
    }
};

let getResGame = function () {
    let res = {};
    res.timeGame = minutes * 60 + seconds;
    res.levelGame = userObject.difficulty;
    res.score = Math.round(10000 * res.levelGame * (res.levelGame / 12) / res.timeGame);
    return res;
};

let getSortedRes = function () {
    let users = JSON.parse(localStorage.getItem(USER_KEY_STORAGE));
    let results = JSON.parse(localStorage.getItem(RESULT_KEY_STORAGE));
    let resArray = [];
    for (let resKey in results) {
        let res = {};
        res.name = users[resKey].name;
        res.surname = users[resKey].surname;
        res.result = results[resKey].score;
        resArray.push(res);
    }
    resArray.sort(function (resObjL, resObjR) {
        return resObjL.result < resObjR.result;
    });
    return resArray;
};

let showTopList = function () {
    const resArray = getSortedRes();
    const ulTopList = document.querySelector('.top-list');
    while (ulTopList.hasChildNodes()) {
        ulTopList.removeChild(ulTopList.firstChild);
    }
    let numberOfItems = Math.min(9, resArray.length - 1);
    for (let i = 0; i <= numberOfItems; i++) {
        const listItem = document.createElement('li');

        let divPosition = document.createElement('div');
        divPosition.classList.add('top-list_position');
        divPosition.innerHTML = i + 1;

        let divPlayer = document.createElement('div');
        divPlayer.classList.add('top-list_player');
        divPlayer.innerHTML = resArray[i].name + ' ' + resArray[i].surname;

        let divScore = document.createElement('div');
        divScore.classList.add('top-list_score');
        divScore.innerHTML = resArray[i].result;

        listItem.appendChild(divPosition);
        listItem.appendChild(divPlayer);
        listItem.appendChild(divScore);
        ulTopList.appendChild(listItem);
    }
};

let checkAndInsertToStorageProfile = function (json) {
    if (localStorage.getItem(USER_KEY_STORAGE) === null) {
        let initObject = {};
        initObject[json.email] = json;
        localStorage.setItem(USER_KEY_STORAGE, JSON.stringify(initObject));
    } else {
        let users = JSON.parse(localStorage.getItem(USER_KEY_STORAGE));
        users[json.email] = json;
        localStorage.setItem(USER_KEY_STORAGE, JSON.stringify(users));
    }
};

let formValuesToObject = function (form, obj) {
    const elements = form.querySelectorAll("input, select");
    for (let i = 0; i < elements.length; ++i) {
        let element = elements[i];
        let name = element.name;
        let value = element.value;
        if (element.type === 'radio') {
            if (element.checked) {
                obj[name] = value;
            }
        } else {
            if (name) {
                obj[name] = value;
            }
        }
    }
    return obj;
};

cards.addEventListener("click", displayCard);

buttonPlay.addEventListener('click', function () {
    sectionGritting.style.display = 'none';
    sectionPlayersProfile.style.display = 'block';
});

restartButton.addEventListener('click', start);

newGameButton.addEventListener('click', function () {
    sectionGameField.style.display = 'block';
    sectionCongratulation.style.display = 'none'
});

newGameButton.addEventListener('click', start);

backwardButton.addEventListener('click', function () {
    sectionGameField.style.display = 'none';
    sectionPlayersProfile.style.display = 'block';
});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    let json = formValuesToObject(this, userObject);
    checkAndInsertToStorageProfile(json);
});

form.addEventListener("submit", function () {
    sectionPlayersProfile.style.display = 'none';
    sectionGameField.style.display = 'block'
});

form.addEventListener("submit", start);