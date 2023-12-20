document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audio');
  const bars = document.querySelectorAll('.bar');

  // Create an audio context
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaElementSource(audio);

  source.connect(analyser);
  analyser.connect(audioContext.destination);

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

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
