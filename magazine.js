pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let editionData = {};
let currentPage = 1;
let totalPages = 1;
let currentEdition = null;
let pdfDoc = null;
let pageRendering = false;

async function detectAvailableMagazines() {
    const grid = document.getElementById('magazinesGrid');
    grid.innerHTML = '';
    
    editionData = {};
    
    let volumeNumber = 1;
    let consecutiveFails = 0;
    
    while (consecutiveFails < 3) {
        const filename = `Paradox V${volumeNumber}.pdf`;
        const path = `media/magazines/${filename}`;
        
        try {
            const response = await fetch(path, { method: 'HEAD' });
            
            if (response.ok) {
                editionData[volumeNumber] = {
                    title: `Paradox Magazine - Volume ${volumeNumber}`,
                    description: `Le volume ${volumeNumber} de Paradox Magazine.`,
                    filename: filename
                };
                
                await createMagazineCard(volumeNumber, path);
                consecutiveFails = 0;
            } else {
                consecutiveFails++;
            }
        } catch (error) {
            consecutiveFails++;
        }
        
        volumeNumber++;
    }
    
    if (Object.keys(editionData).length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--gray-text);">Aucun magazine trouvé</p>';
    }
}

async function createMagazineCard(volumeNumber, pdfPath) {
    const grid = document.getElementById('magazinesGrid');
    
    const card = document.createElement('div');
    card.className = 'magazine-card';
    card.onclick = () => openMagazine(volumeNumber);
    
    const cover = document.createElement('div');
    cover.className = 'magazine-cover';
    cover.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i></div>';
    
    const info = document.createElement('div');
    info.className = 'magazine-info';
    info.innerHTML = `<h3>${editionData[volumeNumber].title}</h3>`;
    
    card.appendChild(cover);
    card.appendChild(info);
    grid.appendChild(card);
    
    try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        
        const canvas = document.createElement('canvas');
        const viewport = page.getViewport({ scale: 1.0 });
        const scale = 400 / viewport.height;
        const scaledViewport = page.getViewport({ scale: scale });
        
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;
        
        await page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: scaledViewport
        }).promise;
        
        cover.innerHTML = '';
        cover.appendChild(canvas);
    } catch (error) {
        console.error('Erreur lors du chargement de la couverture:', error);
        cover.innerHTML = '<div class="loading" style="color: var(--primary-pink);">Erreur</div>';
    }
}

document.addEventListener('DOMContentLoaded', detectAvailableMagazines);

async function openMagazine(volumeNumber) {
    currentEdition = volumeNumber;
    const edition = editionData[volumeNumber];
    
    const viewer = document.getElementById('bookViewer');
    const loader = document.getElementById('pdfLoader');
    
    document.body.classList.add('modal-open');
    viewer.style.display = 'flex';
    loader.classList.remove('hidden');
    
    const pdfPath = `media/magazines/${edition.filename}`;
    
    try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;
        
        await preloadAllPages();
        
        currentPage = 1;
        await renderPages();
        
        loader.classList.add('hidden');
        updatePageIndicator();
        
        document.addEventListener('keydown', handleKeyNavigation);
    } catch (error) {
        console.error('Erreur lors du chargement du PDF:', error);
        loader.classList.add('hidden');
        alert('Impossible de charger le PDF. Vérifiez que le fichier existe.');
        closeMagazine();
    }
}

async function preloadAllPages() {
    const loaderText = document.querySelector('.loader-text');
    
    for (let i = 1; i <= totalPages; i++) {
        loaderText.textContent = `Chargement... ${i}/${totalPages}`;
        await pdfDoc.getPage(i);
    }
    
    loaderText.textContent = 'Chargement du magazine...';
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
    
    if (pdfDoc) {
        pdfDoc = null;
    }
}

async function renderPages() {
    if (pageRendering) return;
    pageRendering = true;
    
    const canvasLeft = document.getElementById('pdfPageLeft');
    const canvasRight = document.getElementById('pdfPageRight');
    const container = document.getElementById('pdfContainer');
    
    const containerHeight = container.clientHeight;
    
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    
    if (isFirstPage || isLastPage) {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: 1.0 });
        
        const scale = containerHeight / viewport.height;
        const scaledViewport = page.getViewport({ scale: scale });
        
        canvasLeft.height = scaledViewport.height;
        canvasLeft.width = scaledViewport.width;
        
        const renderContext = {
            canvasContext: canvasLeft.getContext('2d'),
            viewport: scaledViewport
        };
        
        await page.render(renderContext).promise;
        canvasLeft.style.display = 'block';
        canvasRight.style.display = 'none';
    } else {
        if (currentPage <= totalPages) {
            const page = await pdfDoc.getPage(currentPage);
            const viewport = page.getViewport({ scale: 1.0 });
            
            const scale = containerHeight / viewport.height;
            const scaledViewport = page.getViewport({ scale: scale });
            
            canvasLeft.height = scaledViewport.height;
            canvasLeft.width = scaledViewport.width;
            
            const renderContext = {
                canvasContext: canvasLeft.getContext('2d'),
                viewport: scaledViewport
            };
            
            await page.render(renderContext).promise;
            canvasLeft.style.display = 'block';
        } else {
            canvasLeft.style.display = 'none';
        }
        
        if (currentPage + 1 <= totalPages) {
            const page = await pdfDoc.getPage(currentPage + 1);
            const viewport = page.getViewport({ scale: 1.0 });
            
            const scale = containerHeight / viewport.height;
            const scaledViewport = page.getViewport({ scale: scale });
            
            canvasRight.height = scaledViewport.height;
            canvasRight.width = scaledViewport.width;
            
            const renderContext = {
                canvasContext: canvasRight.getContext('2d'),
                viewport: scaledViewport
            };
            
            await page.render(renderContext).promise;
            canvasRight.style.display = 'block';
        } else {
            canvasRight.style.display = 'none';
        }
    }
    
    pageRendering = false;
}

async function previousPage() {
    if (currentPage > 1) {
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
    if (currentPage < totalPages) {
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
