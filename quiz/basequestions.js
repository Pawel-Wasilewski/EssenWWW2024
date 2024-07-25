let task_num = 1;

// Ładowanie pytań do paneli oraz ujawnienie pierwszego
window.onload = function() {
    loadquestions();
    reveal();
}
// Losowanie Liczb

function RandomNumber() {
    let randomizer = Math.floor(Math.random() * 9);

    console.log(randomizer)

    return randomizer;
}

// BAZA PYTAŃ 

function loadquestions(randomizer) {
    let usedquestions = [];

    while(task_num <= 4) {
        RandomNumber()
        let desiredpanel = document.getElementById('task' + task_num)


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
                    <button class=next-btn onclick="next(), check${task_num}()"> Next </button>
                `;
                usedquestions.push(randomizer)
                break;
            case 1:
                let goodanswer = "Good";
                let badanswer = ["Fantastic", "Good Morning", "Eat", "Can", "Age"];
                let insertgoodasnwer = false;

                desiredpanel.innerHTML+=
                `
                    <h4 class="task-count">Question ${task_num} of 5 </h4>
                    <h3 class="task-header">
                        Which is correct form of <em> Dobrze </em>?
                    </h3>
                    <div class="options-area">
                        <div class="horizontal-center option-container">
                            <input type="radio" name="option${task_num}" id="option${task_num}-1" class="options-radio">
                            <label for="option${task_num}-1">option1</label>
                        </div>
                        <div class="horizontal-center option-container">
                            <input type="radio" name="option${task_num}" id="option${task_num}-2" class="options-radio">
                            <label for="option${task_num}-2">option2</label>
                        </div>
                        <div class="horizontal-center option-container">
                            <input type="radio" name="option${task_num}" id="option${task_num}-3" class="options-radio">
                            <label for="option${task_num}-3">option3</label>
                        </div>
                    </div>
                    <button class=next-btn onclick="next(), check${task_num}()"> Next </button>
                `;
                break;

        }
        task_num++
    }
}