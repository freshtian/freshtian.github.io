/*
    Copyright (c) 2024 李乐平 (LI Leping)

    This code is proprietary software and may not be used, modified, or distributed
    without the express written permission of 李乐平 (LI Leping).
*/

let album = "default";
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
    

    const songs = {
        "default": [
            {path: "../../bgm/The Beatles - Hey Jude.mp3", nameZh: "嘿，朱迪", nameEn: "Hey Jude"},
            {path: "../../bgm/The Beatles - Love Me Do.mp3", nameZh: "爱我吧", nameEn: "Love Me Do"},
            {path: "../../bgm/The Beatles - Two Of Us (Remastered).mp3", nameZh: "我哥两", nameEn: "Two of US"},
            {path: "../../bgm/The Beatles - Yesterday (Remastered).mp3", nameZh: "昨夜旧梦", nameEn: "Yesterday"},

        ],
        "fairgroundContent": [
            {path: "../../bgm/The Beatles - In My Life (Remastered).mp3", nameZh: "我的生命中", nameEn: "in my life"}
        ]
    };

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
            currentAlbum = `${(album in songs) ? album : "default"}`;
            randomIndex = Math.floor(Math.random() * songs[currentAlbum].length);
            if(songs[currentAlbum].length === 1) {
                break;
            }
        } while (randomIndex === excludeIndex);
        return randomIndex;
    }

    function playRandomSong(toSwitch) {
        if ((!toSwitch) || (startingState === 0)) {
            currentSongIndex = getRandomSongIndex(currentSongIndex);
            const currentSong = songs[`${(album in songs) ? album : "default"}`][currentSongIndex];
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
