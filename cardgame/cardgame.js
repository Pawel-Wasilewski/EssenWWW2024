// DECLARATIONS

let polish_words = ['tekst1', 'tekst2', 'tekst3', 'tekst4']; // Original Words
let english_translate = ['text1', 'text2', 'text3', 'text4']; // Translation

let i = 0; // our Pointer for Arrays

// Declaration of areas (spans)
let polish_area;
let english_area;

// Every time when site is loaded
window.onload = function() {
    polish_area = document.getElementById('front_text');
    english_area = document.getElementById('back_text');
    put_data(); 
}
// Putting data to span via array
function put_data() {
    polish_area.innerHTML = polish_words[i];
    english_area.innerHTML = english_translate[i];
}


function previous() {
    i--;
    if(i <= -1) {
        i = polish_words.length - 1;
        put_data();
    } else {
        put_data();
    }
}

function next() {
    i++;
    if(i >= polish_words.length) {
        i = polish_words.length - i
        put_data();
    } else {
        put_data();
    }
}