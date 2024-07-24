let tasknum = 1;

window.onload = function () {
    reveal();
}

function reveal() {
    let revealing = document.getElementById('task' + tasknum);

    revealing.classList.remove('hidden');

}

function next() {
    tasknum++;
    reveal();
}
