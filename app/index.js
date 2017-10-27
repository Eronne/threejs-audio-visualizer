import './index.css';
import App from './scripts/App';

let landingPage = document.getElementById('landing')
let landingButton = document.getElementById('landingButton')
let controls = document.getElementById('controls')

landingButton.addEventListener('click', () => {
    landingPage.style.display="none";
    window.app = new App();
    controls.classList.remove('hidden');
})
