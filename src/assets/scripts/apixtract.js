const failedurl = []

async function getImageMetadataFromUrl(imageUrl) {
  if (failedurl.includes(imageUrl)) {
    return
  }
    try {
      // Extraire le nom du fichier depuis l'URL
      const match = imageUrl.match(/([^\/?#]+\.(?:jpg|jpeg|png|svg|gif))(?=[?#]|$)/i);
      if (!match) throw new Error("Nom de fichier non reconnu dans l'URL.");
      
      const filename = decodeURIComponent(match[1]);
        // Vérifier si les métadonnées sont déjà en cache
        const cachedData = localStorage.getItem(filename);
        if (cachedData) {
        console.log("Données récupérées depuis le cache.");
        return JSON.parse(cachedData);  // Retourner les données mises en cache
        }
      const fichier = fichiersConnus.find(item => item.nom === filename);
      const apiUrl = fichier
      ? fichier.url
      : `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${filename}&prop=imageinfo&iiprop=extmetadata&format=json&origin=*`
      console.log(apiUrl)
  
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      const page = Object.values(data.query.pages)[0];
      const meta = page.imageinfo?.[0]?.extmetadata;
  
      if (!meta) throw new Error("Aucune métadonnée trouvée.");
  
      const metadata = {
        nomFichier: filename,
        auteur: meta.Artist?.value || "Auteur inconnu",
        licence: meta.LicenseShortName?.value || "license inconnu",
        lienLicence: meta.LicenseUrl?.value || "N/A",
        description: meta.ImageDescription?.value || "Sans description"
      };
      // Mettre les données en cache (localStorage)
        localStorage.setItem(filename, JSON.stringify(metadata));
        console.log("Données mises en cache.");
        return metadata
    } catch (error) {
      console.error("Erreur :", error.message);
      if (error.message === 'Aucune métadonnée trouvée.') {
        failedurl.push(imageUrl)
      }
      return false;
    }
  }
  