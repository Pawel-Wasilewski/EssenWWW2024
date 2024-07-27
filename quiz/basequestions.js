let task_num = 1;
let words_EN = [
    "Eat",
    "Good",
    "Good morning",
    "Age",
    "Hello",
    "Please",
    "My name is...",
    "There",
    "I like ...",
    "Can i get...",
    "I am ... years old"
];

// Ładowanie pytań do paneli oraz ujawnienie pierwszego

window.onload = function() {
    loadquestions();
    reveal();
}
// Losowanie Liczb

function RandomNumber(maxnum) {
    let randomizer = Math.floor(Math.random() * maxnum);

    console.log(randomizer);

    return randomizer;
}

// Tworzenie losowych opcji RADIO

function createoptionsradio(goodanswer, polishwords) {
    let insertgoodanswer = false;
    let insertarea = document.getElementsByClassName("option-area-check" + task_num)

    let numberoptions = 1;

    while(numberoptions <= 3) {
        RandomNumber(2);

        // Losowanie by dać poprawną odpowiedź

        if (!insertgoodanswer && randomizer === 0) {
            insertgoodanswer = true;
        } else if (insertgoodanswer && randomizer === 1) {
            insertgoodanswer = false;
        } else if (numberoptions == 3 && !insertgoodanswer) {
            insertgoodanswer = true;
        }

        // insert innerHTML

        if (!polishwords) {
            if (insertgoodanswer) {
                insertarea.innerHTML += `
                    <div class="horizontal-center option-container">
                        <input type="radio" name="option${task_num}" value="${goodanswer}" id="option${task_num}-${numberoptions}">
                        <label for="option${task_num}-${numberoptions}">${goodanswer}</label>
                    </div>
                `;
            } else {
                RandomNumber(words_EN.length)
                let randomWord = words_EN[randomizer];
                while (randomWord === goodanswer) {
                    RandomNumber(words_EN.length)
                    randomWord = words_EN[randomizer];
                }
                insertarea.innerHTML += `
                    <div class="horizontal-center option-container">
                        <input type="radio" name="option${task_num}" value="${randomWord}" id="option${task_num}-${numberoptions}">
                        <label for="option${task_num}-${numberoptions}">${randomWord}</label>
                    </div>
                `;
            }
        } else {
            if (insertgoodanswer) {
                insertarea.innerHTML += `
                    <div class="horizontal-center option-container">
                        <input type="radio" name="option${task_num}" value="${goodanswer}" id="option${task_num}-${numberoptions}">
                        <label for="option${task_num}-${numberoptions}">${goodanswer}</label>
                    </div>
                `;
            } else {
                RandomNumber(words_PL.length)
                let randomWord = words_PL[randomizer];
                while (randomWord === goodanswer) {
                    RandomNumber(words_PL.length)
                    randomWord = words_PL[randomizer];
                }
                insertarea.innerHTML += `
                    <div class="horizontal-center option-container">
                        <input type="radio" name="option${task_num}" value="${randomWord}" id="option${task_num}-${numberoptions}">
                        <label for="option${task_num}-${numberoptions}">${randomWord}</label>
                    </div>
                `;
            }
        }
        numberoptions++
    }
}

// Tworzenie losowych opcji CHECK

function createoptionscheck(goodanswers, polishwords) {
    let insertgoodanswer = false;
    let insertarea = document.getElementsByClassName("option-area-check" + task_num);
    let goodinserted = [];
    let goodinserted_IDN = 0; // ARRAY goodanswers INDICATOR
    let numberoptions = 1;

    while(numberoptions <= 5) {
        RandomNumber(2);

        if (!insertgoodanswer && randomizer === 0 && (goodinserted.length != 1 || goodinserted != 2) ) {
            insertgoodanswer = true;
        } else if (insertgoodanswer && randomizer === 1) {
            insertgoodanswer = false;
        } else if ((numberoptions === 5 && !insertgoodanswer && goodinserted.length < 2) || (numberoptions === 4 && !insertgoodanswer && goodinserted == [])) {
            insertgoodanswer = true;
        }

        if (!polishwords) {
            if (insertgoodanswer) {
                insertarea.innerHTML += `
                    <div class="horizontal-center option-container">
                        <input type="checkbox" name="option${task_num}" value="${goodanswers[goodinserted_IDN]}" id="option${task_num}-${numberoptions}" class="options-check">
                        <label for="option${task_num}-${numberoptions}">option3</label>
                    </div>
                `;
                goodinserted.push(goodanswers[goodinserted_IDN])
                goodinserted_IDN++
                goodinserted_num++;
            } else {
                RandomNumber(words_EN.length);
                let randomWord = words_EN[randomizer];
                while (randomWord === goodanswers[0] || randomWord === goodanswers[1]) {
                    RandomNumber(words_EN.length);
                    randomWord = words_EN[randomizer]
                }
                insertarea.innerHTML +=`
                    <div class="horizontal-center option-container">
                        <input type="checkbox" name="option${task_num}" value="${randomWord}" id="option${task_num}-${numberoptions}" class="options-check">
                        <label for="option${task_num}-${numberoptions}">option3</label>
                    </div>
                `
            }
        } else {
            if (insertgoodanswer) {
                insertarea.innerHTML += `
                    <div class="horizontal-center option-container">
                        <input type="checkbox" name="option${task_num}" value="${goodanswers[goodinserted_IDN]}" id="option${task_num}-${numberoptions}" class="options-check">
                        <label for="option${task_num}-${numberoptions}">option3</label>
                    </div>
                `;
                goodinserted.push(goodanswers[goodinserted_IDN])
                goodinserted_IDN++;
                goodinserted_num++;
            } else {
                RandomNumber(words_PL.length);
                let randomWord = words_EN[randomizer];
                while (randomWord === goodanswers[0] || randomWord === goodanswers[1]) {
                    RandomNumber(words_PL.length);
                    randomWord = words_PL[randomizer]
                }
                insertarea.innerHTML +=`
                    <div class="horizontal-center option-container">
                        <input type="checkbox" name="option${task_num}" value="${randomWord}" id="option${task_num}-${numberoptions}" class="options-check">
                        <label for="option${task_num}-${numberoptions}">option3</label>
                    </div>
                `
            }
        }
        numberoptions++
    }
}
// BAZA PYTAŃ 

function loadquestions(randomizer) {
    let usedquestions = [];
    let usedquestions_IDN = 0; // Iterator usedquestion

    while(task_num <= 5) {
        RandomNumber(8);
        let desiredpanel = document.getElementById('task' + task_num);

        while (randomizer === usedquestions[usedquestions_IDN]) {
            RandomNumber(8)
        }

        switch(randomizer) {

            case 0:
                desiredpanel.innerHTML += 
                `
                    <h4 class="task-count">Question ${task_num} of 5 </h4>
                    <h3 class="task-header">
                        How do you say <em> Dzień dobry </em> in english?
                    </h3>
                    <div class="options-area">
                        <input type="text" name="textinput${task_num}" placeholder="Answer..." id="option${task_num}-1" class="text-input">
                    </div>
                    <button class=next-btn onclick="check('Good morning')"> Next </button>
                `;
                task_num++;
                break;
            case 1:
                desiredpanel.innerHTML +=
                `
                    <h4 class="task-count">Question ${task_num} of 5 </h4>
                    <h3 class="task-header">
                        Which is correct form of <em> Dobrze </em>?
                    </h3>
                    <div class="options-area option-area-radio${task_num}">
                        ${createoptionsradio("Good", false)}
                    </div>
                    <button class=next-btn onclick="check('Good')"> Next </button>
                `;
                task_num++;
            case 2:
                desiredpanel.innerHTML +=
                `
                    <h4 class="task-count">Question ${task_num} of 5 </h4>
                    <h3 class="task-header">
                        Select all forms of Greetings
                    </h3>
                    <div class="options-area option-area-check${task_num}">
                        ${createoptionscheck(["Dzień Dobry","Witaj"], true)}
                    </div>
                    <button class=next-btn onclick="check(['Dzień Dobry','Witaj'])"> Next </button>
                `;
                task_num++;
            case 3: 
                desiredpanel.innerHTML +=
                `
                    <h4 class="task-count">Question ${task_num} of 5 </h4>
                    <h3 class="task-header">
                        How to say <em> Mam ... Lat </em> in english?
                    </h3>
                    <div class="options-area option-area-radio${task_num}">
                        ${createoptionsradio("I am ... years old", false)}
                    </div>
                    <button class=next-btn onclick="check('I am ... years old')"> Next </button>
                `;
                task_num++;
            case 4:
                desiredpanel.innerHTML +=
                `
                    <h4 class="task-count">Question ${task_num} of 5 </h4>
                    <h3 class="task-header">
                        How do you say <em> Eat </em> in polish?
                    </h3>
                    <div class="options-area option-area-radio${task_num}">
                        ${createoptionsradio("Jeść", true)}
                    </div>
                    <button class=next-btn onclick="check('Jeść')"> Next </button>
                `;
                task_num++
            case 5:
                desiredpanel.innerHTML +=
                `
                    <h4 class="task-count">Question ${task_num} of 5 </h4>
                    <h3 class="task-header">
                        How do you say <em> Wiek </em> in english?
                    </h3>
                    <div class="options-area option-area-radio${task_num}">
                        ${createoptionsradio("Age", false)}
                    </div>
                    <button class=next-btn onclick="check('Age')"> Next </button>
                `;
                task_num++
            case 6:
                desiredpanel.innerHTML +=
                `
                    <h4 class="task-count">Question ${task_num} of 5 </h4>
                    <h3 class="task-header">
                        How do you say <em> Jeść </em> in english?
                    </h3>
                    <div class="options-area">
                        <input type="text" name="textinput${task_num}" placeholder="Answer..." id="option${task_num}-1" class="text-input">
                    </div>
                    <button class=next-btn onclick="check('Eat')"> Next </button>
                `;
                task_num++;
            case 7:
                desiredpanel.innerHTML +=
                `
                    <h4 class="task-count">Question ${task_num} of 5 </h4>
                    <h3 class="task-header">
                        How do you say <em> Jeść </em> in english?
                    </h3>
                    <div class="options-area">
                        <input type="text" name="textinput${task_num}" placeholder="Answer..." id="option${task_num}-1" class="text-input">
                    </div>
                    <button class=next-btn onclick="check('Eat')"> Next </button>
                `;
                task_num++;
        }
        usedquestions.push(randomizer);
    }
}