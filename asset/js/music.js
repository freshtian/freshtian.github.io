/*
    Copyright (c) 2024 李乐平 (LI Leping)

    This code is proprietary software and may not be used, modified, or distributed
    without the express written permission of 李乐平 (LI Leping).
*/

document.addEventListener('DOMContentLoaded', function () {
    const music = document.getElementById('backgroundMusic');  
    const toggleMusicButton = document.getElementById('bgmButton');

    let audioContext = null;
    let track = null;
    let gainNode = null;
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
        {path: "../../bgm/Resonance of Khvarena.ogg", nameZh: "灵光的回响", nameEn: "Resonance of Khvarena"},
        {path: "../../bgm/The Caress of Three Mothers.ogg", nameZh: "女主人的叮咛", nameEn: "The Caress of Three Mothers"},
        {path: "../../bgm/Village Surrounded by Green.ogg", nameZh: "葳蕤林野间", nameEn: "Village Surrounded by Green"},
        {path: "../../bgm/Above the Glorious Crown.ogg", nameZh: "旷古的荣业", nameEn: "Above the Glorious Crown"},
        {path: "../../bgm/Springtide of Qiaoying.ogg", nameZh: "融风渐暖", nameEn: "Springtide of Qiaoying"},
        {path: "../../bgm/Unfinished Ideal.ogg", nameZh: "未成一篑", nameEn: "Unfinished Ideal"},
        {path: "../../bgm/Cruising in the Balmy Breeze.ogg", nameZh: "遐睠温煦之风", nameEn: "Cruising in the Balmy Breeze"},
        {path: "../../bgm/Ed e subito sera.ogg", nameZh: "转瞬即夜色", nameEn: "Ed e subito sera"},
        {path: "../../bgm/Windborne Hymn.ogg", nameZh: "风带来的圣歌", nameEn: "Windborne Hymn"},
        {path: "../../bgm/A Pearl amongst Legends.ogg", nameZh: "千夜的遗珠", nameEn: "A Pearl amongst Legends"},
        {path: "../../bgm/Golden Crescent.ogg", nameZh: "荒沙与新月", nameEn: "Golden Crescent"},
        {path: "../../bgm/The Crescent Moon's Waning.ogg", nameZh: "褪色的眷恋", nameEn: "The Crescent Moon's Waning"},

    ];

    function initializeAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            track = audioContext.createMediaElementSource(music);
            gainNode = audioContext.createGain();
            track.connect(gainNode).connect(audioContext.destination);
        }
    }

    function showSongInfo(song) {
        const songInfo = document.createElement('div');
        songInfo.classList.add('music-info');
        songInfo.innerHTML = `<div style="font-size: 15px; color: #ffffff;">${song.nameZh}</div>
                              <div style="font-size: 12px; color: #cfedca;">${song.nameEn}</div>`;

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
        if ((!toSwitch) || (startingState === 0)) {
            currentSongIndex = getRandomSongIndex(currentSongIndex);
            const currentSong = songs[currentSongIndex];
            if (music.src !== currentSong.path) {
                music.src = currentSong.path;
                showSongInfo(currentSong); 
            }
            startingState = 1;
        }
        fadeIn();
        music.onended = () => {
            playRandomSong(false);
        };
    }

    function fadeIn() {
        initializeAudioContext();
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

    let isLongPress = false; 
    let longPressTimer;

    toggleMusicButton.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
            isLongPress = false;
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                playRandomSong(false);
                toggleMusicButton.classList.add('playing');
            }, 500);
        }
    });

    toggleMusicButton.addEventListener('mouseup', (event) => {
        if (event.button === 0) {
            clearTimeout(longPressTimer);
            if (!isLongPress) {
                if (isPlaying) {
                    fadeOut();
                    toggleMusicButton.classList.remove('playing');
                } else {
                    playRandomSong(true);
                    toggleMusicButton.classList.add('playing');
                }
            }
        }
    });

    toggleMusicButton.addEventListener('mouseleave', () => {
        clearTimeout(longPressTimer);
    });

    // toggleMusicButton.addEventListener('click', () => {
    //     if (fading) {
    //         return;
    //     }
    //     if (isPlaying) {
    //         fadeOut();
    //         toggleMusicButton.classList.remove('playing');
    //     } else {
    //         playRandomSong(true);
    //         toggleMusicButton.classList.add('playing');
    //     }
    // });
});
