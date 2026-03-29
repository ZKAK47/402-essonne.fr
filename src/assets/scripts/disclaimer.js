function showDisclaimPopUp(currentDate) {

  let noscrollelement = document.createElement('style');
  noscrollelement.innerHTML = `
    .noscroll {
      overflow: hidden !important;
    }
  `;
  document.head.appendChild(noscrollelement);

    // Crée le conteneur du popup
    const popverlay = document.createElement('div');
    popverlay.id = 'disclaimpop-back'
    popverlay.style = `
      height: 100vh;
      width: 100vw;
      position: fixed;
      z-index: 100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;
      top: 0;
      left: 0;
      background: rgba(0,0,0,0.9);
    `;
    popverlay.style.transition = 'all 0.5s'

    const disclaimpop = document.createElement('div');
    disclaimpop.id = 'disclaimpop-notice';
    disclaimpop.style.cssText = `
      position: fixed;
      top: 20%;
      overflow: auto;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      color: #000;
      max-height: 100vh;
      border: 1px solid #ccc;
      padding: 20px;
      transition: all 0.5s;
      max-width: 80vw;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      border-radius: 10px;
      font-family: sans-serif;
    `;
    disclaimpop.style.transition = 'all 0.5s'
  
    // Ajoute le contenu HTML
    disclaimpop.innerHTML = `
      <h2 style="margin-top:0;text-align:center">Important</h2>
      <p>Ce site à but non-lucratif n'est affilié d'aucune manière à Île-de-France Mobilités, Keolis, TISSE ou toute autre entreprise de transport.</p>
      <p>Il utilise la charte signalétique d'Île-de-France Mobilités sous licence 
        <a href="https://creativecommons.org/licenses/by-nc-nd/3.0/fr/" target="_blank" style="color: #007bff;">Creative Commons CC BY-NC-ND 3.0</a>.
      </p>
      <p>Le site est actuellement en cours de construction&nbsp;: certaines fonctionnalités ou informations peuvent être absentes.</p>
    `;
  
    // Ajoute le disclaimpop au body
    document.body.appendChild(popverlay);
    popverlay.appendChild(disclaimpop);
    document.body.classList.add('noscroll')

    const closedisclaimer = document.createElement('button')
    closedisclaimer.id = 'disclaimpop-close-btn'
    closedisclaimer.style = `
        margin-top: 15px;
        padding: 8px 15px;
        background: #a0a0a0;
        cursor: not-allowed;
        color: white;
        border: none;
        transition: all, 0.5s;
        border-radius: 5px;
    `;

    closedisclaimer.innerHTML = `Fermer`

    
    disclaimpop.appendChild(closedisclaimer)

    setTimeout(() => {
      closedisclaimer.style.background = '#E2001A'
      closedisclaimer.style.cursor = 'pointer'
      closedisclaimer.onclick = removedisclaimerpopup
    }, 5000);
    function removedisclaimerpopup() {
      if (popverlay) {
        popverlay.style.opacity = '0';
        document.body.classList.remove('noscroll');
        localStorage.setItem('lastExecutionDate', currentDate.toISOString());
        setTimeout(() => {
          popverlay.remove();
        }, 500); // doit correspondre au `transition: all 0.5s`
      }
    }
  }
  
  // Affiche le disclaimpop au chargement
  window.onload=function () {
    const lastExecution = localStorage.getItem('lastExecutionDate');
    const currentDate = new Date();
  
    // Si aucune date n'est enregistrée, ou si plus d'une semaine s'est écoulée
    if (!lastExecution || (currentDate - new Date(lastExecution)) >= 7 * 24 * 60 * 60 * 1000) {
        showDisclaimPopUp(currentDate);
    }
};