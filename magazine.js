pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let editionData = {};
let currentPage = 1;
let totalPages = 1;
let currentEdition = null;
let pdfDoc = null;
let pageRendering = false;
let pageCache = {};

async function detectAvailableMagazines() {
    const grid = document.getElementById('magazinesGrid');
    grid.innerHTML = '';
    
    editionData = {};
    
    try {
        const response = await fetch('/paradox/data/magazines.json');
        const data = await response.json();
        
        if (data.magazines && data.magazines.length > 0) {
            data.magazines.forEach((magazine, index) => {
                editionData[index] = {
                    title: magazine.titre,
                    pdf: magazine.pdf,
                    couverture: magazine.couverture
                };
                
                createMagazineCard(index);
            });
        } else {
            grid.innerHTML = '<p style="text-align: center; color: var(--gray-text);">Aucun magazine trouvé</p>';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des magazines:', error);
        grid.innerHTML = '<p style="text-align: center; color: var(--gray-text);">Erreur lors du chargement des magazines</p>';
    }
}

function createMagazineCard(index) {
    const grid = document.getElementById('magazinesGrid');
    const edition = editionData[index];
    
    const card = document.createElement('div');
    card.className = 'magazine-card';
    card.onclick = () => openMagazine(index);
    
    const cover = document.createElement('div');
    cover.className = 'magazine-cover';
    cover.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i></div>';
    
    const info = document.createElement('div');
    info.className = 'magazine-info';
    info.innerHTML = `<h3>${edition.title}</h3>`;
    
    card.appendChild(cover);
    card.appendChild(info);
    grid.appendChild(card);
    
    const img = new Image();
    img.onload = () => {
        cover.innerHTML = '';
        cover.appendChild(img);
    };
    img.onerror = () => {
        console.error(`Erreur lors du chargement du thumbnail: ${edition.couverture}`);
        cover.innerHTML = '<div class="loading" style="color: var(--primary-pink);">Image introuvable</div>';
    };
    img.src = edition.couverture;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.objectFit = 'contain';
}

document.addEventListener('DOMContentLoaded', detectAvailableMagazines);

async function openMagazine(index) {
    currentEdition = index;
    const edition = editionData[index];
    
    const viewer = document.getElementById('bookViewer');
    const loader = document.getElementById('pdfLoader');
    
    document.body.classList.add('modal-open');
    viewer.style.display = 'flex';
    loader.classList.remove('hidden');
    
    const pdfPath = edition.pdf;
    
    try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;
        
        pageCache = {};
        
        currentPage = 1;
        await renderPages();
        
        loader.classList.add('hidden');
        updatePageIndicator();
        
        preloadAdjacentPages();
        
        document.addEventListener('keydown', handleKeyNavigation);
    } catch (error) {
        console.error('Erreur lors du chargement du PDF:', error);
        loader.classList.add('hidden');
        alert('Impossible de charger le PDF. Vérifiez que le fichier existe.');
        closeMagazine();
    }
}

async function preloadAdjacentPages() {
    const pagesToPreload = [];
    
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    
    if (isFirstPage || isLastPage) {
        if (currentPage - 1 >= 1) pagesToPreload.push(currentPage - 1);
        if (currentPage + 1 <= totalPages) pagesToPreload.push(currentPage + 1);
        if (currentPage + 2 <= totalPages) pagesToPreload.push(currentPage + 2);
    } else {
        for (let offset = -2; offset <= 3; offset++) {
            const pageNum = currentPage + offset;
            if (pageNum >= 1 && pageNum <= totalPages && !pageCache[pageNum]) {
                pagesToPreload.push(pageNum);
            }
        }
    }
    
    for (const pageNum of pagesToPreload) {
        if (!pageCache[pageNum]) {
            renderPageToCache(pageNum);
        }
    }
}

async function renderPageToCache(pageNum) {
    if (pageCache[pageNum]) return pageCache[pageNum];
    
    try {
        const page = await pdfDoc.getPage(pageNum);
        const container = document.getElementById('pdfContainer');
        const containerHeight = container.clientHeight;
        
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = containerHeight / viewport.height;
        const scaledViewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement('canvas');
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;
        
        await page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: scaledViewport
        }).promise;
        
        pageCache[pageNum] = {
            canvas: canvas,
            width: scaledViewport.width,
            height: scaledViewport.height
        };
        
        return pageCache[pageNum];
    } catch (error) {
        console.error(`Erreur lors du cache de la page ${pageNum}:`, error);
        return null;
    }
}

function handleKeyNavigation(event) {
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        previousPage();
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextPage();
    } else if (event.key === 'Escape') {
        event.preventDefault();
        closeMagazine();
    }
}

function closeMagazine() {
    const viewer = document.getElementById('bookViewer');
    viewer.style.display = 'none';
    document.body.classList.remove('modal-open');
    
    document.removeEventListener('keydown', handleKeyNavigation);
    
    pageCache = {};
    
    if (pdfDoc) {
        pdfDoc = null;
    }
}

async function renderPages() {
    if (pageRendering) return;
    pageRendering = true;
    
    const canvasLeft = document.getElementById('pdfPageLeft');
    const canvasRight = document.getElementById('pdfPageRight');
    
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    
    if (isFirstPage || isLastPage) {
        const cached = await renderPageToCache(currentPage);
        if (cached) {
            canvasLeft.width = cached.width;
            canvasLeft.height = cached.height;
            canvasLeft.getContext('2d').drawImage(cached.canvas, 0, 0);
            canvasLeft.style.display = 'block';
        }
        canvasRight.style.display = 'none';
    } else {
        if (currentPage <= totalPages) {
            const cached = await renderPageToCache(currentPage);
            if (cached) {
                canvasLeft.width = cached.width;
                canvasLeft.height = cached.height;
                canvasLeft.getContext('2d').drawImage(cached.canvas, 0, 0);
                canvasLeft.style.display = 'block';
            }
        } else {
            canvasLeft.style.display = 'none';
        }
        
        if (currentPage + 1 <= totalPages) {
            const cached = await renderPageToCache(currentPage + 1);
            if (cached) {
                canvasRight.width = cached.width;
                canvasRight.height = cached.height;
                canvasRight.getContext('2d').drawImage(cached.canvas, 0, 0);
                canvasRight.style.display = 'block';
            }
        } else {
            canvasRight.style.display = 'none';
        }
    }
    
    pageRendering = false;
    preloadAdjacentPages();
}

async function previousPage() {
    if (currentPage > 1 && !pageRendering) {
        if (currentPage === 2) {
            currentPage = 1;
        } else if (currentPage === totalPages) {
            currentPage = totalPages - 2;
            if (currentPage < 2) currentPage = 2;
        } else {
            currentPage -= 2;
            if (currentPage < 1) currentPage = 1;
        }
        await renderPages();
        updatePageIndicator();
    }
}

async function nextPage() {
    if (currentPage < totalPages && !pageRendering) {
        if (currentPage === 1) {
            currentPage = 2;
        } else if (currentPage + 1 >= totalPages) {
            currentPage = totalPages;
        } else {
            currentPage += 2;
        }
        await renderPages();
        updatePageIndicator();
    }
}

function updatePageIndicator() {
    const indicator = document.getElementById('pageIndicator');
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    
    if (isFirstPage) {
        indicator.innerHTML = `Page ${currentPage} (Couverture) / ${totalPages}`;
    } else if (isLastPage) {
        indicator.innerHTML = `Page ${currentPage} (Quatrième de couverture) / ${totalPages}`;
    } else {
        const rightPage = currentPage + 1 <= totalPages ? ` & ${currentPage + 1}` : '';
        indicator.innerHTML = `Pages ${currentPage}${rightPage} / ${totalPages}`;
    }
    
    const prevArrow = document.getElementById('prevArrow');
    const nextArrow = document.getElementById('nextArrow');
    
    if (currentPage <= 1) {
        prevArrow.classList.add('disabled');
    } else {
        prevArrow.classList.remove('disabled');
    }
    
    if (currentPage >= totalPages) {
        nextArrow.classList.add('disabled');
    } else {
        nextArrow.classList.remove('disabled');
    }
}
