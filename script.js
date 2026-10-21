// LOG Studio — Pro Cinema Viewer Controller

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('comparisonWrapper');
  const logLayer = document.getElementById('logLayer');
  const sliderHandle = document.getElementById('sliderHandle');
  if (!wrapper || !logLayer || !sliderHandle) return;

  const logImg = logLayer.querySelector('img');
  let isDragging = false;

  function syncImageDimensions() {
    if (logImg && wrapper) {
      logImg.style.width = `${wrapper.offsetWidth}px`;
      logImg.style.maxWidth = `${wrapper.offsetWidth}px`;
    }
  }

  function updateSplit(percentage) {
    const clamped = Math.max(0, Math.min(100, percentage));
    logLayer.style.width = `${clamped}%`;
    sliderHandle.style.left = `${clamped}%`;
  }

  function handleInteraction(clientX) {
    const rect = wrapper.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    updateSplit(percentage);
  }

  wrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleInteraction(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) handleInteraction(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  wrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) handleInteraction(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches[0]) handleInteraction(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('resize', syncImageDimensions);
  syncImageDimensions();
  updateSplit(50);
});
