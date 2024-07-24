//NIE DZIAŁA 
//NIE DZIAŁA
//NIE DZIAŁA
//NIE DZIAŁA
//NIE DZIAŁA
//NIE DZIAŁA
//NIE DZIAŁA

/*
// Funkcje pomocnicze do obsługi przeciągania i upuszczania
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.currentTarget.style.backgroundColor = 'yellow';
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;
    dropzone.appendChild(draggableElement);
    event.dataTransfer.clearData();
}

// Obsługa dotykowa
function handleTouchStart(event) {
    event.currentTarget.style.backgroundColor = 'yellow';
    event.currentTarget.classList.add('dragging');
}

function handleTouchMove(event) {
    const touchLocation = event.targetTouches[0];
    const draggingItem = document.querySelector('.dragging');
    draggingItem.style.position = 'absolute';
    draggingItem.style.left = `${touchLocation.pageX - draggingItem.offsetWidth / 2}px`;
    draggingItem.style.top = `${touchLocation.pageY - draggingItem.offsetHeight / 2}px`;
}

function handleTouchEnd(event) {
    const draggingItem = document.querySelector('.dragging');
    const touchLocation = event.changedTouches[0];
    draggingItem.style.position = 'static';
    draggingItem.style.backgroundColor = '';
    draggingItem.classList.remove('dragging');
    
    const dropzones = document.querySelectorAll('.area-drop-dad');
    dropzones.forEach(dropzone => {
        const rect = dropzone.getBoundingClientRect();
        if (touchLocation.pageX >= rect.left && touchLocation.pageX <= rect.right &&
            touchLocation.pageY >= rect.top && touchLocation.pageY <= rect.bottom) {
            dropzone.appendChild(draggingItem);
        }
    });
}

// Dodanie nasłuchiwania zdarzeń do elementów do przeciągania i upuszczania
document.querySelectorAll('.option-dad').forEach(option => {
    option.setAttribute('draggable', true);
    option.id = `draggable-${Math.random().toString(36).substr(2, 9)}`;
    option.addEventListener('dragstart', handleDragStart);
    option.addEventListener('touchstart', handleTouchStart);
    option.addEventListener('touchmove', handleTouchMove);
    option.addEventListener('touchend', handleTouchEnd);
});

document.querySelectorAll('.area-drop-dad').forEach(area => {
    area.addEventListener('dragover', handleDragOver);
    area.addEventListener('drop', handleDrop);
});
*/