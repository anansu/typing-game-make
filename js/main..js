const GAME_TIME = 6;
const wordInput = document.querySelector('.word-input');
const wordDisplay = document.querySelector('.word-display');
const scoreDisplay = document.querySelector('.score');
const timeDisplay = document.querySelector('.time');
const button = document.querySelector('.button');

// 사용 변수
let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];




init();

function init() {
    buttonChange("게임 로딩중...");
    getWords();
    wordInput.addEventListener('input', checkMatch);
}


// 게임 실행
function run() {
    if (isPlaying) {
        return;
    }
    isPlaying = true;
    time = GAME_TIME;
    wordInput.focus();
    scoreDisplay.innerText = 0;
    timeInterval = setInterval(countDown, 1000);
    checkInterval = setInterval(checkStatus, 50);
    buttonChange("게임중");
}

function checkStatus() {
    if(!isPlaying && time === 0) {
        buttonChange("게임시작");
        clearInterval(checkInterval);
        wordInput.value = "";
    }
}


// 단어 불러오기
function getWords() {
    axios.get('https://random-word-api.herokuapp.com/word?number=50')
        .then(function (response) {
            
            response.data.forEach(fetchedWord => {
                if(fetchedWord.length < 10) {
                    words.push(fetchedWord);
                }
                buttonChange("게임시작");
            });
            console.log(`response headers' content-type is ${response.headers["content-type"]}`);
            console.log(`response request is ${response.request}`);
            console.log(`response config is ${response.request}`);
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}


// 단어 일치 체크
function checkMatch () {
    if (wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
        wordInput.value = '';
        if(!isPlaying) {
            return;
        }
        score += 1;
        scoreDisplay.innerText = score;
        time = GAME_TIME;
        const randomIndex = Math.floor(Math.random()*words.length);
        wordDisplay.innerText = words[randomIndex];
    }
}



function countDown(){
    time > 0 ? time -= 1 : isPlaying = false;
    if(!isPlaying) {
        clearInterval(timeInterval);
    }
    timeDisplay.innerText = time;
}


function buttonChange(text) {
    button.innerText = text;
    text === "게임시작" ? button.classList.remove('loading') : button.classList.add('loading');
}