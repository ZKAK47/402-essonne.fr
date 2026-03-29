// Pour stocker les infos et le slider
let sliderContainer, imgElement, infoBar;
let slideIndex = 0;
let imageSrcs = [];

// Création une fois pour toutes
function createSlider(imageElements) {
  sliderContainer = document.createElement("div");
  sliderContainer.id = "custom-slider";
  sliderContainer.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
    flex-direction: column;
    opacity: 0;
    transition: opacity 0.5s ease;
  `;

  imgElement = document.createElement("img");
  imgElement.style.cssText = `
    max-width: 100vw;
    max-height: 100vh;
    object-fit: contain;
  `;

  infoBar = document.createElement("div");
  infoBar.style.cssText = `
    background: rgba(226, 0, 26, 0.8);
    color: white;
    width: 100%;
    padding: 10px;
    text-align: center;
    font-family: sans-serif;
    font-size: 16px;
    position: absolute;
    bottom: 0;;
  `;

  const btnPrev = document.createElement("button");
  btnPrev.textContent = "←";
  btnPrev.onclick = () => showImage((slideIndex - 1 + imageSrcs.length) % imageSrcs.length);
  btnPrev.style.cssText = `
    position: absolute; left: 20px; top: 50%;
    transform: translateY(-50%);
    font-size: 32px; background: transparent;
    color: white; border: none; cursor: pointer;
  `;

  const btnNext = document.createElement("button");
  btnNext.textContent = "→";
  btnNext.onclick = () => showImage((slideIndex + 1) % imageSrcs.length);
  btnNext.style.cssText = `
    position: absolute; right: 20px; top: 50%;
    transform: translateY(-50%);
    font-size: 32px; background: transparent;
    color: white; border: none; cursor: pointer;
  `;

  const btnClose = document.createElement("button");
  btnClose.textContent = "✕";
  btnClose.onclick = closeSlider;
  btnClose.style.cssText = `
    position: absolute; top: 10px; right: 20px;
    font-size: 24px; background: transparent;
    color: white; border: none; cursor: pointer;
  `;

  if (imageElements.length > 1) {
  sliderContainer.appendChild(btnPrev);
  sliderContainer.appendChild(btnNext);}
  sliderContainer.appendChild(btnClose);
  sliderContainer.appendChild(imgElement);
  sliderContainer.appendChild(infoBar);

  document.body.appendChild(sliderContainer);

  // Clavier
  document.addEventListener("keydown", (e) => {
    if (!sliderContainer || sliderContainer.style.display !== "flex") return;
    if (e.key === "Escape") closeSlider();
    if (e.key === "ArrowRight") btnNext.click();
    if (e.key === "ArrowLeft") btnPrev.click();
  });
}

function showImage(index) {
  slideIndex = index;
  const imageUrl = imageSrcs[index];
  imgElement.src = imageUrl;

  // Extraire le nom du fichier depuis l'URL
  const match = imageUrl.match(/([^\/?#]+\.(?:jpg|jpeg|png|svg|gif))(?=[?#]|$)/i);
  const filename = match ? match[1].replace(/%20/g, ' ') : null;

  // Vérifier s'il y a une description locale
  const localspec = localImageInfo.find(item => item.nom === filename);
  if (filename && localspec) {
    if (localspec.url) {
      infoBar.innerHTML = `<a href="${localspec.url}">${localspec.auteur}</a>`;
    }
    else {infoBar.innerHTML = `${localspec.auteur}`}
    return;
  }

  // Sinon, aller chercher les métadonnées depuis Wikimedia
  getImageMetadataFromUrl(imageUrl)
    .then((metadata) => {
      if (metadata) {
        infoBar.innerHTML = `Photo par ${metadata.auteur || "Auteur inconnu"} sous <a href="${metadata.lienLicence || "#"}" target="_blank">${metadata.licence || "Licence inconnue"}</a>`;
        if (metadata.auteur) {
          const link = infoBar.querySelector("a"); // Recherche le lien <a> dans infoBar

          if (link && link.classList.contains("new")) {
            // Retirer les décorations et mettre l'élément en rouge
            link.style.textDecoration = "none"; // Retirer la décoration (soulignement)
            link.style.color = "red"; // Mettre le texte en rouge
            link.style.webkitTextStroke = '0.01em white'
          }
        }
      } else {
        infoBar.textContent = "Informations indisponibles";
      }
    })
    .catch((e) => {
      console.error("Erreur lors de la récupération des métadonnées", e);
      infoBar.textContent = "Erreur lors de la récupération des informations";
    });
}


function launchSlider(startIndex) {
  sliderContainer.style.display = "flex";
  document.body.classList.add('noscroll')
  requestAnimationFrame(() => {
    sliderContainer.style.opacity = "1";
    showImage(startIndex);
  });
}

function closeSlider() {
  sliderContainer.style.opacity = "0";
  document.body.classList.remove('noscroll')
  setTimeout(() => {
    sliderContainer.style.display = "none";
  }, 500);
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  const imageElements = Array.from(document.querySelectorAll(".slider-image"));
  createSlider(imageElements);
  imageSrcs = imageElements.map(img => img.src);

  imageElements.forEach((img, i) => {
    img.addEventListener("click", () => {
      launchSlider(i);
    });
  });
});