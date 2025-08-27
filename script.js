document.addEventListener('DOMContentLoaded', () => {
    const songs = [
        'dinchak.mp3',  
        'kp.mp3',
        'kt.mp3',
        'mahaan.mp3',
        'moaning.mp3'
    ];

    function getRandomSong() {
        const randomIndex = Math.floor(Math.random() * songs.length);
        return songs[randomIndex];
    }

    const audio = document.getElementById('audio');
    const audioSource = document.getElementById('audio-source');
    const songSelect = document.getElementById('song-select');

    // Function to load selected song
    function loadSong(songFileName) {
        audioSource.src = `songs/${songFileName}`;
        audio.load();
    }

    // Initialize with random song
    loadSong(getRandomSong());

    // Handle song selection change
    songSelect.addEventListener('change', (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === 'random') {
            loadSong(getRandomSong());
        } else {
            loadSong(selectedValue);
        }
    });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const bars = document.querySelectorAll('.bar');

    function updateBars() {
        analyser.getByteFrequencyData(dataArray);

        bars.forEach((bar, index) => {
            // Scale the bar height to a reasonable range, e.g., 0-2
            const barHeight = dataArray[index] / 128;
            const limitedHeight = Math.min(barHeight * 100, 200);

            // Apply the scaled height to the bar
            bar.style.height = limitedHeight + 'px';
        });

        requestAnimationFrame(updateBars);
    }

    audio.addEventListener('play', () => {
        audioContext.resume().then(() => {
            updateBars();
        });
    });
});
