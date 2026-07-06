if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)  // as soon as finish
} else {
    ready();
}

function ready() {
    const song = document.querySelector('audio');    
    const playBtn = document.querySelector('.btn.btn-header.btn-play');

    playBtn.addEventListener('click', function() {
        if (song.paused) {
            song.play();
            playBtn.innerText = "⏸"; 
        } else {
            song.pause();
            playBtn.innerText = "▶"; 
        }
    });
}

