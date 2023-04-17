import { Workbox } from 'workbox-window';
import Editor from './editor';
import './database';
import '../css/style.css';

const main = document.querySelector('#main');
main.innerHTML = '';

const loadSpinner = () => {
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
  <div class="loading-container">
  <div class="loading-spinner" />
  </div>
  `;
    main.appendChild(spinner);
};

const editor = new Editor();

if (typeof editor === 'undefined') {
    loadSpinner();
}

// Check if service workers are supported
if ('serviceWorker' in navigator) {
    // register workbox service worker
    const workboxSW = new Workbox('/src-sw.js');
    workboxSW.register();
} else {
    console.error('Service workers are not supported in this browser.');
}

//event listeners
editor.addEventListener('blur', saveContent);
window.addEventListener('load', initDB);
window.addEventListener('load', retrieveContent);

// Install button
window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    const installBtn = document.querySelector('#install-btn');
    installBtn.style.display = 'block';
    installBtn.addEventListener('click', () => {
        event.prompt();
        event.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            installBtn.style.display = 'none';
        });
    });
});
