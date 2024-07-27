let task_num = 1;
let reveal_task_num = 1 ;
let words_EN = [
    "eat",
    "good",
    "good morning",
    "age",
    "hello",
    "please",
    "my name is...",
    "there",
    "I like ...",
    "can I get...",
    "I am ... years old",
    "thank you",
];
let words_PL = [
    "jeść",
    "dobry",
    "dzień dobry",
    "wiek",
    "cześć",
    "proszę",
    "nazywam się",
    "tam",
    "Lubię...",
    "czy mogę dostać...",
    "Mam ... lat",
    "dziękuję",
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
    let goodanswerused = false;
    let optionsHTML = '';
    let numberoptions = 1;

    while (numberoptions <= 3) {
        let randomizer = RandomNumber(2);

        if (!insertgoodanswer && randomizer === 0 && !goodanswerused) {
            insertgoodanswer = true;
            goodanswerused = true;
        } else if (insertgoodanswer && randomizer === 1) {
            insertgoodanswer = false;
        } else if (numberoptions == 3 && !insertgoodanswer && !goodanswerused) {
            insertgoodanswer = true;
        }

        if (!polishwords) {
            if (insertgoodanswer) {
                optionsHTML += `
                    <div class="horizontal-center option-container">
                        <input type="radio" name="option${task_num}" value="${goodanswer}" class="options-radio" id="option${task_num}-${numberoptions}">
                        <label for="option${task_num}-${numberoptions}">${goodanswer}</label>
                    </div>
                `;
            } else {
                let randomizer = RandomNumber(words_EN.length - 1);
                let randomWord = words_EN[randomizer];
                while (randomWord === goodanswer || randomWord == undefined) {
                    randomizer = RandomNumber(words_EN.length - 1);
                    randomWord = words_EN[randomizer];
                }
                optionsHTML += `
                    <div class="horizontal-center option-container">
                        <input type="radio" name="option${task_num}" value="${randomWord}" class="options-radio" id="option${task_num}-${numberoptions}">
                        <label for="option${task_num}-${numberoptions}">${randomWord}</label>
                    </div>
                `;
            }
        } else {
            if (insertgoodanswer) {
                optionsHTML += `
                    <div class="horizontal-center option-container">
                        <input type="radio" name="option${task_num}" value="${goodanswer}" class="options-radio" id="option${task_num}-${numberoptions}">
                        <label for="option${task_num}-${numberoptions}">${goodanswer}</label>
                    </div>
                `;
            } else {
                let randomizer = RandomNumber(words_PL.length - 1);
                let randomWord = words_PL[randomizer];
                while (randomWord === goodanswer || randomWord == undefined) {
                    randomizer = RandomNumber(words_PL.length - 1);
                    randomWord = words_PL[randomizer];
                }
                optionsHTML += `
                    <div class="horizontal-center option-container">
                        <input type="radio" name="option${task_num}" value="${randomWord}" class="options-radio" id="option${task_num}-${numberoptions}">
                        <label for="option${task_num}-${numberoptions}">${randomWord}</label>
                    </div>
                `;
            }
        }
        numberoptions++;
    }
    return optionsHTML;
}

// Tworzenie losowych opcji CHECK
function createoptionscheck(goodanswers, polishwords) {
    let insertgoodanswer = false;
    let optionsHTML = '';
    let goodinserted = [];
    let goodinserted_IDN = 0; // ARRAY goodanswers INDICATOR
    let numberoptions = 1;

    while (numberoptions <= 5) {
        let randomizer = RandomNumber(2);

        if (!insertgoodanswer && randomizer === 0 && (goodinserted.length != 1 || goodinserted != 2)) {
            insertgoodanswer = true;
        } else if (insertgoodanswer && randomizer === 1) {
            insertgoodanswer = false;
        } else if ((numberoptions === 5 && !insertgoodanswer && goodinserted.length < 2) || (numberoptions === 4 && !insertgoodanswer && goodinserted == [])) {
            insertgoodanswer = true;
        }

        if (!polishwords) {
            if (insertgoodanswer) {
                optionsHTML += `
                    <div class="horizontal-center option-container">
                        <input type="checkbox" name="option${task_num}" value="${goodanswers[goodinserted_IDN]}" id="option${task_num}-${numberoptions}" class="options-check">
                        <label for="option${task_num}-${numberoptions}">${goodanswers[goodinserted_IDN]}</label>
                    </div>
                `;
                goodinserted.push(goodanswers[goodinserted_IDN]);
                goodinserted_IDN++;
            } else {
                let randomizer = RandomNumber(words_EN.length - 1);
                let randomWord = words_EN[randomizer];
                while (randomWord === goodanswers[0] || randomWord === goodanswers[1] || randomWord == undefined) {
                    randomizer = RandomNumber(words_EN.length - 1);
                    randomWord = words_EN[randomizer];
                }
                optionsHTML += `
                    <div class="horizontal-center option-container">
                        <input type="checkbox" name="option${task_num}" value="${randomWord}" id="option${task_num}-${numberoptions}" class="options-check">
                        <label for="option${task_num}-${numberoptions}">${randomWord}</label>
                    </div>
                `;
            }
        } else {
            if (insertgoodanswer) {
                optionsHTML += `
                    <div class="horizontal-center option-container">
                        <input type="checkbox" name="option${task_num}" value="${goodanswers[goodinserted_IDN]}" id="option${task_num}-${numberoptions}" class="options-check">
                        <label for="option${task_num}-${numberoptions}">${goodanswers[goodinserted_IDN]}</label>
                    </div>
                `;
                goodinserted.push(goodanswers[goodinserted_IDN]);
                goodinserted_IDN++;
            } else {
                let randomizer = RandomNumber(words_PL.length - 1);
                let randomWord = words_PL[randomizer];
                while (randomWord === goodanswers[0] || randomWord === goodanswers[1] || randomWord == undefined) {
                    randomizer = RandomNumber(words_PL.length - 1);
                    randomWord = words_PL[randomizer];
                }
                optionsHTML += `
                    <div class="horizontal-center option-container">
                        <input type="checkbox" name="option${task_num}" value="${randomWord}" id="option${task_num}-${numberoptions}" class="options-check">
                        <label for="option${task_num}-${numberoptions}">${randomWord}</label>
                    </div>
                `;
            }
        }
        numberoptions++;
    }
    return optionsHTML;
}

// BAZA PYTAŃ
function loadquestions() {
    let usedquestions = [];

    while (task_num <= 5) {
        let randomizer = RandomNumber(8);
        let desiredpanel = document.getElementById('task' + task_num);

        while (usedquestions.includes(randomizer)) {
            randomizer = RandomNumber(8);
        }

        usedquestions.push(randomizer);

        switch (randomizer) {
            case 0:
                desiredpanel.innerHTML += `
                    <h4 class="task-count">Question ${task_num} of 5</h4>
                    <h3 class="task-header">
                        How do you say <em>Dzień dobry</em> in English?
                    </h3>
                    <div class="options-area" id="area-task${task_num}">
                        <input type="text" name="textinput${task_num}" placeholder="Answer..." id="option${task_num}-1" class="text-input">
                    </div>
                    <button class="next-btn" onclick="check('good morning')">Next</button>
                `;
                break;
            case 1:
                desiredpanel.innerHTML += `
                    <h4 class="task-count">Question ${task_num} of 5</h4>
                    <h3 class="task-header">
                        Which is the correct form of <em>Dobrze</em>?
                    </h3>
                    <div class="options-area option-area-radio${task_num}" id="area-task${task_num}">
                        ${createoptionsradio("good", false)}
                    </div>
                    <button class="next-btn" onclick="check('good')">Next</button>
                `;
                break;
            case 2:
                desiredpanel.innerHTML += `
                    <h4 class="task-count">Question ${task_num} of 5</h4>
                    <h3 class="task-header">
                        Select all forms of Greetings
                    </h3>
                    <div class="options-area option-area-check${task_num}" id="area-task${task_num}">
                        ${createoptionscheck(["dzień dobry", "cześć"], true)}
                    </div>
                    <button class="next-btn" onclick="check(['dzień dobry', 'cześć'])">Next</button>
                `;
                break;
            case 3:
                desiredpanel.innerHTML += `
                    <h4 class="task-count">Question ${task_num} of 5</h4>
                    <h3 class="task-header">
                        How to say <em>Mam ... lat</em> in English?
                    </h3>
                    <div class="options-area option-area-radio${task_num}" id="area-task${task_num}">
                        ${createoptionsradio("I am ... years old", false)}
                    </div>
                    <button class="next-btn" onclick="check('I am ... years old')">Next</button>
                `;
                break;
            case 4:
                desiredpanel.innerHTML += `
                    <h4 class="task-count">Question ${task_num} of 5</h4>
                    <h3 class="task-header">
                        How do you say <em>Eat</em> in Polish?
                    </h3>
                    <div class="options-area option-area-radio${task_num}" id="area-task${task_num}">
                        ${createoptionsradio("jeść", true)}
                    </div>
                    <button class="next-btn" onclick="check('jeść')">Next</button>
                `;
                break;
            case 5:
                desiredpanel.innerHTML += `
                    <h4 class="task-count">Question ${task_num} of 5</h4>
                    <h3 class="task-header">
                        How do you say <em>Wiek</em> in English?
                    </h3>
                    <div class="options-area option-area-radio${task_num}" id="area-task${task_num}">
                        ${createoptionsradio("age", false)}
                    </div>
                    <button class="next-btn" onclick="check('age')">Next</button>
                `;
                break;
            case 6:
                desiredpanel.innerHTML += `
                    <h4 class="task-count">Question ${task_num} of 5</h4>
                    <h3 class="task-header">
                        How do you say <em>dziękuję</em> in English?
                    </h3>
                    <div class="options-area" id="area-task${task_num}">
                        <input type="text" name="textinput${task_num}" placeholder="Answer..." id="option${task_num}-1" class="text-input">
                    </div>
                    <button class="next-btn" onclick="check('thank you')">Next</button>
                `;
                break;
            case 7:
                desiredpanel.innerHTML += `
                    <h4 class="task-count">Question ${task_num} of 5</h4>
                    <h3 class="task-header">
                        How do you say <em>My name is</em> in Polish?
                    </h3>
                    <div class="options-area" id="area-task${task_num}">
                        <input type="text" name="textinput${task_num}" placeholder="Answer..." id="option${task_num}-1" class="text-input">
                    </div>
                    <button class="next-btn" onclick="check('nazywam się')">Next</button>
                `;
                break;
        }
        task_num++;
    }
}

// Odsłonięcie pytania
function reveal() {
    let revealed = document.getElementById("task" + reveal_task_num);
    revealed.classList.remove("hidden");
}

// LICZENIE PUNKTÓW - COOKIES
let userpoints_total = 0;

// Sprawdzenie
function check(correct) {
    let checkedarea = document.getElementById("area-task" + reveal_task_num);

    if(checkedarea.classList.contains("option-area-radio" + reveal_task_num)) {
        let val1 = document.getElementById("option" + reveal_task_num + "-1");
        let val2 = document.getElementById("option" + reveal_task_num + "-2");
        let val3 = document.getElementById("option" + reveal_task_num + "-3");

        let chosenoption = null;

        if (val1.checked) {
            chosenoption = val1.value;
        } else if (val2.checked) {
            chosenoption = val2.value;
        } else if (val3.checked) {
            chosenoption = val3.value;
        }

        if (chosenoption == correct) {
            userpoints_total++;
            console.log(userpoints_total);
            // dodać innera
        } else if (chosenoption == null) {
            // dodać innera
        }
    }
    else if (checkedarea.classList.contains("option-area-check" + reveal_task_num)) {
        let val1 = document.getElementById("option" + reveal_task_num + "-1");
        let val2 = document.getElementById("option" + reveal_task_num + "-2");
        let val3 = document.getElementById("option" + reveal_task_num + "-3");
        let val4 = document.getElementById("option" + reveal_task_num + "-4");
        let val5 = document.getElementById("option" + reveal_task_num + "-5");

        let listofoptions = [val1, val2, val3, val4, val5];
        let chosenoption = [];

        // Zbieranie wybranych opcji
        for (let i = 0; i < listofoptions.length; i++) {
            if (listofoptions[i].checked) {
                chosenoption.push(listofoptions[i].value);
            }
        }

        chosenoption.sort();
        correct.sort();

        let firstcor = false;
        let secondcor = false;

        if (chosenoption[0] == correct[0] && chosenoption.length == 2) {
            firstcor = true;
            if(chosenoption[1] == correct[1] && firstcor && chosenoption.length == 2) {
                secondcor = true;
            }
        } 

        if (firstcor && secondcor) {
            userpoints_total++;
            console.log(userpoints_total);
            // dodać innera
        } else if (chosenoption.length < 2) {
            // dodać innera
        } else {
            if (firstcor && !secondcor) {
                // dodać innera
            } else if (!firstcor && secondcor) {
                // dodać innera
            } else {
                // dodać innera
            }
        }
    }
    else {
        let val1 = document.getElementById("option" + reveal_task_num + "-1").value;

        if(val1 == correct) {
            userpoints_total++;
            console.log(userpoints_total);
            // dodać innera
        } else if (val1 == null || undefined) {
            // dodać innera
        } else {
            // dodać innera
        }
    }

    if (reveal_task_num == 5) {
        popup()
        createcookie("score",userpoints_total,"10")
    } else {
        reveal_task_num++;
        reveal();
    }
}

// Wysyłanie danych (tworzenie cookiesa)

function popup() {
    
}
function createcookie(name, value, days) {
    let expires;

    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }

    document.cookie = escape(name) + "=" +
        value + expires + "; path=/";
}