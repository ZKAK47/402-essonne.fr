document.addEventListener("DOMContentLoaded", () => {

    // ===== Onglets ===== //
    const tabs = document.querySelectorAll("[data-tab-target]");
    const tabContents = document.querySelectorAll("[data-tab-content]");

    function activateTab(tab) {
        const target = document.querySelector(tab.dataset.tabTarget);
        const isSubTab = tab.closest(".sub-tabs") !== null;

        if (isSubTab) {
            const siblingSubTabs = tab.closest(".sub-tabs").querySelectorAll("[data-tab-target]");
            const siblingSubContents = tab.closest(".section").querySelectorAll("[data-tab-content]");
            siblingSubTabs.forEach(t => t.classList.remove("active"));
            siblingSubContents.forEach(tc => tc.classList.remove("active"));
        } else {
            const parentContainer = tab.closest(".tabs-container");
            const siblingTabs = parentContainer.querySelectorAll("[data-tab-target]");
            const siblingContents = parentContainer.querySelectorAll("[data-tab-content]");
            siblingTabs.forEach(t => t.classList.remove("active"));
            siblingContents.forEach(tc => tc.classList.remove("active"));
        }
        tab.classList.add("active");
        target.classList.add("active");

        const subTabsContainer = target.querySelector(".sub-tabs");
        if (subTabsContainer) {
            const firstSubTab = subTabsContainer.querySelector("[data-tab-target]");
            if (firstSubTab) activateTab(firstSubTab);
        }
    }

    tabs.forEach(tab => tab.addEventListener("click", () => activateTab(tab)));

    const firstMainTab = document.querySelector(".tabs-container .tab");
    if (firstMainTab) activateTab(firstMainTab);


    // ===== ScrollSpy ===== //
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('.section');
        const links = document.querySelectorAll('.header-nav nav ul li a');
        let currentSection = '';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSection = section.id;
            }
        });

        links.forEach(link => {
            link.classList.toggle('active-scroll', link.getAttribute('href').substring(1) === currentSection);
        });
    });

    // ===== Remplacement picto et oldp ===== //
    document.querySelectorAll("picto").forEach(pictoTag => {
        let code = pictoTag.textContent.trim();
        let img = document.createElement("img");
        img.src = `/assets/images/pictos/${code}.png`;
        img.alt = code;
        img.classList.add("Logotext");
        pictoTag.replaceWith(img);
    });

    document.querySelectorAll("oldp").forEach(oldpTag => {
        const colorMap = {"401": "#bb5438", "402": "#bb5e7a", "403": "#6b4e70", "404": "#81ba6a", "405": "#6b4e70", "Error": "#F44336"};
        let text = oldpTag.textContent.trim();
        let backgroundColor = colorMap[text] || "#3498db";
        let borderColor = darkenColor(backgroundColor, -20);
        let span = document.createElement("span");
        span.classList.add("circle-pic");
        span.textContent = text;
        span.style.backgroundColor = backgroundColor;
        span.style.borderColor = borderColor;
        oldpTag.replaceWith(span);
    });

    document.querySelectorAll(".Indice-bus").forEach(indiceTag => {
        const bgcolorMap = {"4206": "#E2001A", "402": "#E2001A", "4242": "#E2001A", "Tzen4": "#D5C900", "Tzen 4": "#D5C900",
        "420": "#00814F", "4220": "#00814F", "403": "#f0a800", "Tzen1": "#D5C900", "Tzen 1": "#D5C900",
        "404": "#D5C900", "405": "#0064b0", "407": "#98D4E2", "301": "#0064b0", "4203": "#0064b0",
        "4501": "#98D4E2", "9118": "#4d92cb", "9101": "#4d92cb", "9112": "#4d92cb", "4504": "#E2001A",};
        const txtcolorMap = {"4206": "#FFFFFF", "402": "#FFFFFF", "4242": "#FFFFFF", "9118": "#FFFFFF", "9112": "#FFFFFF",
        "420": "#FFFFFF", "4220": "#FFFFFF", "403": "#FFFFFF", "9101": "#FFFFFF",
        "405": "#FFFFFF", "301": "#FFFFFF", "4203": "#FFFFFF", "4504": "#FFFFFF",};
        let text = indiceTag.textContent.trim();
        indiceTag.style.background = bgcolorMap[text] || "#FFFFFF";
        indiceTag.style.color = txtcolorMap[text] || "#000000";
    });
    
    // ===== Fonction darkenColor ===== //
    function darkenColor(color, percent) {
        let num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent);
        let R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
        return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1).toUpperCase()}`;
    }

});
