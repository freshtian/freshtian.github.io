document.addEventListener('DOMContentLoaded', function () {
    const music = document.getElementById('backgroundMusic');  
    const toggleMusicButton = document.getElementById('bgmButton');

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const track = audioContext.createMediaElementSource(music);
    const gainNode = audioContext.createGain();
    track.connect(gainNode).connect(audioContext.destination);

    let isPlaying = false;
    let fading = false;
    let currentSongIndex = 0;
    let startingState = 0;

    const songs = [
        {path: "../../bgm/A Luminous Path.ogg", nameZh: "星月之路", nameEn: "A Luminous Path"},
        {path: "../../bgm/Crepuscule des idoles.ogg", nameZh: "喝彩吧，终幕之时已至", nameEn: "Crepuscule des idoles"},
        {path: "../../bgm/Regali teneri.ogg", nameZh: "海风的馈赠", nameEn: "Regali teneri"},
        {path: "../../bgm/Romantic Encounter.ogg", nameZh: "巧遇的漫想", nameEn: "Romantic Encounter"},
        {path: "../../bgm/The Faded Idyll.ogg", nameZh: "牧歌的旧梦", nameEn: "The Faded Idyll"},
        {path: "../../bgm/To the Crescent Moon's Shimmer.ogg", nameZh: "终至月明", nameEn: "To the Crescent Moon's Shimmer"},
    ]

    function showSongInfo(song) {
        const songInfo = document.createElement('div');
        songInfo.classList.add('music-info');
        songInfo.innerHTML = `<div style="font-size: 15px; color: #fff;">${song.nameZh}</div>
                              <div style="font-size: 12px; color: #ccc;">${song.nameEn}</div>`;

        document.body.appendChild(songInfo);

        setTimeout(() => {
            songInfo.classList.add('slide-in');
        }, 100);

        setTimeout(() => {
            songInfo.classList.remove('slide-in');
            setTimeout(() => document.body.removeChild(songInfo), 1300);
        }, 5000);
    }

    function getRandomSongIndex(excludeIndex) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === excludeIndex);
        return randomIndex;
    }

    function playRandomSong(toSwitch) {
        if((!toSwitch) || (startingState === 0)){
            currentSongIndex = getRandomSongIndex(currentSongIndex);
            const currentSong = songs[currentSongIndex];
            music.src = currentSong.path;
            showSongInfo(currentSong); 
            music.load();
            startingState = 1;
        }
        fadeIn();
        music.onended = () => {
            playRandomSong(false);
        }
    }

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
            // fadeIn();
            playRandomSong(true);
            toggleMusicButton.classList.add('playing');
        }
    });
});