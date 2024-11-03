document.addEventListener('DOMContentLoaded', function () {
    const music = document.getElementById('backgroundMusic');  
    const toggleMusicButton = document.getElementById('bgmButton');

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const track = audioContext.createMediaElementSource(music);
    const gainNode = audioContext.createGain();
    track.connect(gainNode).connect(audioContext.destination);

    let isPlaying = false;
    let fading = false;

    function fadeIn() {
        audioContext.resume();
        music.play();
        fading = true;
        gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 1);
        setTimeout(() => {
            fading = false;
            isPlaying = true;
        }, 1000);
    }
    
    function fadeOut() {
        gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        setTimeout(() => {
            music.pause();
            fading = false;
            isPlaying = false;
        }, 1000);
    }

    toggleMusicButton.addEventListener('click', () => {
        if (fading) {
            return;
        }
        if (isPlaying) {
            fadeOut();
            toggleMusicButton.classList.remove('playing');
        } else {
            fadeIn();
            toggleMusicButton.classList.add('playing');
        }
    });
});