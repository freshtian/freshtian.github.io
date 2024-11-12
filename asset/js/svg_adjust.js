function adjustPath() {
    const svg = document.getElementById('loading-shape');
    const aspectRatio = 1920 / 1080;
    const windowRatio = window.innerWidth / window.innerHeight;
  
    if (windowRatio > aspectRatio) {
        const scale = window.innerWidth / 1920;
        const translateY = (window.innerHeight - 1080 * scale) / 2;
        svg.setAttribute("viewBox", `0 ${-translateY / scale} 1920 ${1080}`);
    } else {
        const scale = window.innerHeight / 1080;
        const translateX = (window.innerWidth - 1920 * scale) / 2;
        svg.setAttribute("viewBox", `${-translateX / scale} 0 1920 ${1080}`);
    }
}
  
window.addEventListener('resize', adjustPath);
adjustPath();
  