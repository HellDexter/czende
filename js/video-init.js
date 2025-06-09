/**
 * Inicializace video přehrávače se synchronizací zvuku a moderními ovládacími prvky
 */
document.addEventListener('DOMContentLoaded', function() {
    // Přidáme CSS styly pro vlastní ovládací prvky
    const style = document.createElement('style');
    style.textContent = `
        .video-container {
            position: relative;
        }
        
        .custom-video-controls {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            padding: 10px;
            z-index: 10;
            transition: opacity 0.3s;
            opacity: 0; /* Výchozí stav - skryté */
        }
        
        .video-container:hover .custom-video-controls {
            opacity: 1; /* Zobrazí se při najetí myší */
        }
        
        .play-pause-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #07ff01;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: black;
            font-size: 18px;
        }
        
        .volume-control {
            display: flex;
            align-items: center;
            margin-left: auto;
        }
        
        .volume-icon {
            color: #07ff01;
            font-size: 20px;
            margin-right: 8px;
            cursor: pointer;
        }
        
        .volume-slider {
            -webkit-appearance: none;
            width: 80px;
            height: 5px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 5px;
            background-image: linear-gradient(#07ff01, #07ff01);
            background-size: 50% 100%;
            background-repeat: no-repeat;
        }
        
        .volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 15px;
            width: 15px;
            border-radius: 50%;
            background: #07ff01;
            cursor: pointer;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
        
        .volume-slider::-moz-range-thumb {
            height: 15px;
            width: 15px;
            border-radius: 50%;
            background: #07ff01;
            cursor: pointer;
            border: none;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
    `;
    document.head.appendChild(style);
    
    // Najdeme všechna video na stránce
    const videos = [
        document.getElementById('aboutVideo'),
        document.getElementById('aboutVideoEn'),
        document.getElementById('aboutVideoDe'),
        document.getElementById('constructionVideo')
    ];
    
    // Najdeme odpovídající audio elementy
    const audioElements = {
        'aboutVideo': document.getElementById('videoAudio'),
        'aboutVideoEn': document.getElementById('videoAudioEn'),
        'aboutVideoDe': document.getElementById('videoAudioDe')
    };
    
    // Pro každé video nastavíme základní vlastnosti
    for (const video of videos) {
        if (!video) continue;
        
        // Zajistíme, že video bude viditelné
        video.style.display = 'block';
        video.style.visibility = 'visible';
        video.style.opacity = '1';
        
        // Odstraníme standardní ovládací prvky
        video.controls = false;
        
        // Nastavíme video jako muted, protože zvuk bude přehráván přes audio element
        video.muted = true;
        
        // Získáme odpovídající audio element
        const audio = audioElements[video.id];
        
        // Získáme container videa
        const videoContainer = video.parentElement;
        
        // Přeskakujeme constructionVideo - pro něj nechceme vlastní ovládací prvky
        if (video.id === 'constructionVideo') {
            // Pro constructionVideo nastavíme standardní ovládací prvky
            video.controls = true;
            continue;
        }
        
        if (videoContainer) {
            // Vytvoříme container pro vlastní ovládací prvky
            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'custom-video-controls';
            
            // Vytvoříme tlačítko pro přehrávání/pauzu
            const playPauseBtn = document.createElement('button');
            playPauseBtn.className = 'play-pause-btn';
            playPauseBtn.innerHTML = '▶'; // Symbol pro přehrávání
            
            // Vytvoříme container pro ovládání hlasitosti
            const volumeControl = document.createElement('div');
            volumeControl.className = 'volume-control';
            
            // Vytvoříme ikonu hlasitosti
            const volumeIcon = document.createElement('div');
            volumeIcon.className = 'volume-icon';
            volumeIcon.innerHTML = '♫'; // Hudební nota jako ikona
            
            // Vytvoříme slider pro ovládání hlasitosti
            const volumeSlider = document.createElement('input');
            volumeSlider.className = 'volume-slider';
            volumeSlider.type = 'range';
            volumeSlider.min = '0';
            volumeSlider.max = '1';
            volumeSlider.step = '0.01';
            volumeSlider.value = '0.5'; // Výchozí hlasitost 50%
            
            // Přidáme prvky do containeru
            volumeControl.appendChild(volumeIcon);
            volumeControl.appendChild(volumeSlider);
            controlsContainer.appendChild(playPauseBtn);
            controlsContainer.appendChild(volumeControl);
            videoContainer.appendChild(controlsContainer);
            
            // Nastavíme výchozí hlasitost audia
            if (audio) {
                audio.volume = 0.5;
            }
            
            // Přidáme event listener pro kliknutí na video (přehrávání/pauza)
            video.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                    playPauseBtn.innerHTML = '⏸'; // Symbol pro pauzu
                } else {
                    video.pause();
                    playPauseBtn.innerHTML = '▶'; // Symbol pro přehrávání
                }
            });
            
            // Přidáme event listener pro tlačítko přehrávání/pauza
            playPauseBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Zabráníme propagaci události na video
                
                if (video.paused) {
                    video.play();
                    this.innerHTML = '⏸'; // Symbol pro pauzu
                } else {
                    video.pause();
                    this.innerHTML = '▶'; // Symbol pro přehrávání
                }
            });
            
            // Přidáme event listener pro změnu hlasitosti
            volumeSlider.addEventListener('input', function() {
                if (audio) {
                    audio.volume = this.value;
                    
                    // Aktualizujeme background-size slideru pro vizuální efekt
                    const percentage = this.value * 100;
                    this.style.backgroundSize = `${percentage}% 100%`;
                    
                    // Změníme ikonu podle hlasitosti
                    if (parseFloat(this.value) === 0) {
                        volumeIcon.innerHTML = '❏'; // Ikona ztlumeno
                    } else {
                        volumeIcon.innerHTML = '♫'; // Hudební nota
                    }
                }
            });
            
            // Přidáme event listener pro kliknutí na ikonu (ztlumení/zapnutí zvuku)
            volumeIcon.addEventListener('click', function() {
                if (audio) {
                    if (audio.volume > 0) {
                        // Uložíme aktuální hlasitost před ztlumením
                        volumeIcon.dataset.previousVolume = audio.volume;
                        audio.volume = 0;
                        volumeSlider.value = 0;
                        volumeSlider.style.backgroundSize = '0% 100%';
                        volumeIcon.innerHTML = '❏'; // Ikona ztlumeno
                    } else {
                        // Obnovíme předchozí hlasitost
                        const previousVolume = volumeIcon.dataset.previousVolume || 0.5;
                        audio.volume = previousVolume;
                        volumeSlider.value = previousVolume;
                        volumeSlider.style.backgroundSize = `${previousVolume * 100}% 100%`;
                        volumeIcon.innerHTML = '♫'; // Hudební nota
                    }
                }
            });
        }
        
        // Pokud máme audio element, nastavíme synchronizaci
        if (audio) {
            // Předem načteme audio pro lepší synchronizaci
            audio.load();
            
            // Nastavíme výchozí čas na 0 pro jistotu
            audio.currentTime = 0;
            video.currentTime = 0;
            
            // Synchronizace při přehrávání
            video.addEventListener('play', function() {
                // Nastavíme čas a přehrajeme audio s opakovanými pokusy
                audio.currentTime = video.currentTime;
                
                const playAudio = () => {
                    audio.play().catch(e => {
                        console.error('Chyba při přehrávání audia:', e);
                        // Zkusíme to znovu po krátké pauze
                        setTimeout(playAudio, 100);
                    });
                };
                
                playAudio();
            });
            
            // Synchronizace při pozastavení
            video.addEventListener('pause', function() {
                audio.pause();
                // Ujistíme se, že časy jsou synchronizované
                audio.currentTime = video.currentTime;
            });
            
            // Synchronizace při posunu v čase
            video.addEventListener('seeked', function() {
                audio.currentTime = video.currentTime;
            });
            
            // Další synchronizace při změně času videa
            video.addEventListener('timeupdate', function() {
                // Kontrolujeme synchronizaci častěji, ale jen při větších rozdílech
                if (Math.abs(video.currentTime - audio.currentTime) > 0.5) {
                    audio.currentTime = video.currentTime;
                }
            });
            
            // Synchronizace při konci videa
            video.addEventListener('ended', function() {
                audio.pause();
                audio.currentTime = 0;
                
                // Aktualizujeme tlačítko přehrávání/pauza
                const playPauseBtn = videoContainer.querySelector('.play-pause-btn');
                if (playPauseBtn) {
                    playPauseBtn.innerHTML = '▶'; // Symbol pro přehrávání
                }
            });
            
            // Pravidelná kontrola synchronizace
            const syncInterval = setInterval(() => {
                if (!video.paused && Math.abs(video.currentTime - audio.currentTime) > 0.3) {
                    audio.currentTime = video.currentTime;
                }
            }, 500); // Častější kontrola
        }
    }
});
