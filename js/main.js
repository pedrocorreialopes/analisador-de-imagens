// =====================================================
// Analisador de Imagens - resolução e impressão
// =====================================================

// Elementos DOM
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const selectButton = document.getElementById('select-button');
const resetButton = document.getElementById('reset-button');
const uploadSection = document.getElementById('upload-section');
const resultsSection = document.getElementById('results-section');
const previewImage = document.getElementById('preview-image');
const fileNameEl = document.getElementById('file-name');
const resolutionEl = document.getElementById('resolution');
const pixelsEl = document.getElementById('pixels');
const fileSizeEl = document.getElementById('file-size');
const fileTypeEl = document.getElementById('file-type');
const aspectRatioEl = document.getElementById('aspect-ratio');
const qualityRatingEl = document.getElementById('quality-rating');
const printSizesContainer = document.getElementById('print-sizes');
const paperSizesContainer = document.getElementById('paper-sizes');
const customDpiInput = document.getElementById('custom-dpi');
const applyDpiButton = document.getElementById('apply-dpi');

// Imagem atual em análise
let currentImage = { width: 0, height: 0 };

// Constantes
const CM_PER_INCH = 2.54;

// Tamanhos de papel padrão (em cm)
const PAPER_SIZES = [
    { name: '10x15 cm', widthCm: 10, heightCm: 15, description: 'Foto padrão' },
    { name: '13x18 cm', widthCm: 13, heightCm: 18, description: 'Foto média' },
    { name: '15x21 cm', widthCm: 15, heightCm: 21, description: 'Foto grande' },
    { name: '20x30 cm', widthCm: 20, heightCm: 30, description: 'Pôster pequeno' },
    { name: 'A4', widthCm: 21, heightCm: 29.7, description: '21 × 29,7 cm' },
    { name: 'A3', widthCm: 29.7, heightCm: 42, description: '29,7 × 42 cm' },
    { name: '30x45 cm', widthCm: 30, heightCm: 45, description: 'Pôster' },
    { name: 'A2', widthCm: 42, heightCm: 59.4, description: '42 × 59,4 cm' }
];

// Níveis de DPI considerados
const DPI_LEVELS = [
    { dpi: 72,  name: 'Tela / Web', description: 'Visualização digital', color: '#64748b' },
    { dpi: 150, name: 'Aceitável', description: 'Pôsteres vistos a distância', color: '#f59e0b' },
    { dpi: 300, name: 'Profissional', description: 'Foto de alta qualidade', color: '#10b981', recommended: true },
    { dpi: 600, name: 'Excelente', description: 'Arte e detalhes finos', color: '#4f46e5' }
];

// =====================================================
// Eventos
// =====================================================
selectButton.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

// Drag & drop
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-over');
    });
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
    });
});

dropZone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
});

resetButton.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');
    fileInput.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

applyDpiButton.addEventListener('click', () => {
    if (currentImage.width > 0) {
        renderPrintSizes(currentImage.width, currentImage.height);
    }
});

customDpiInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applyDpiButton.click();
});

// =====================================================
// Processamento
// =====================================================
function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, GIF, WEBP, BMP).');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            currentImage = { width: img.naturalWidth, height: img.naturalHeight };
            displayResults(file, img);
        };
        img.onerror = () => {
            alert('Não foi possível carregar a imagem. Tente outro arquivo.');
        };
        img.src = e.target.result;
        previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function displayResults(file, img) {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const totalPixels = width * height;
    const megapixels = (totalPixels / 1_000_000).toFixed(2);

    // Informações da imagem
    resolutionEl.textContent = `${width} × ${height} px`;
    pixelsEl.textContent = `${megapixels} MP (${totalPixels.toLocaleString('pt-BR')})`;
    fileSizeEl.textContent = formatFileSize(file.size);
    fileTypeEl.textContent = file.type || 'desconhecido';
    fileNameEl.textContent = file.name;
    aspectRatioEl.textContent = calculateAspectRatio(width, height);

    // Avaliação de qualidade
    setQualityRating(totalPixels);

    // Tamanhos de impressão
    renderPrintSizes(width, height);

    // Comparação de papéis
    renderPaperCompatibility(width, height);

    // Mostrar resultados
    uploadSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setQualityRating(totalPixels) {
    const mp = totalPixels / 1_000_000;
    let rating = '', cls = '';

    if (mp >= 12) {
        rating = 'Excelente';
        cls = 'quality-excellent';
    } else if (mp >= 6) {
        rating = 'Boa';
        cls = 'quality-good';
    } else if (mp >= 2) {
        rating = 'Média';
        cls = 'quality-medium';
    } else {
        rating = 'Baixa';
        cls = 'quality-low';
    }

    qualityRatingEl.textContent = `${rating} (${mp.toFixed(1)} MP)`;
    qualityRatingEl.className = 'value quality ' + cls;
}

function renderPrintSizes(widthPx, heightPx) {
    const customDpi = parseInt(customDpiInput.value, 10) || 300;

    // Combinar níveis padrão + DPI personalizado (se diferente)
    const levels = [...DPI_LEVELS];
    const isCustom = !levels.some(l => l.dpi === customDpi);
    if (isCustom) {
        levels.push({
            dpi: customDpi,
            name: 'Personalizado',
            description: `${customDpi} DPI definido por você`,
            color: '#06b6d4',
            custom: true
        });
        levels.sort((a, b) => a.dpi - b.dpi);
    }

    printSizesContainer.innerHTML = '';

    levels.forEach(level => {
        const widthIn = widthPx / level.dpi;
        const heightIn = heightPx / level.dpi;
        const widthCm = widthIn * CM_PER_INCH;
        const heightCm = heightIn * CM_PER_INCH;

        const item = document.createElement('div');
        item.className = 'print-size-item' + (level.recommended ? ' recommended' : '');

        item.innerHTML = `
            <div class="dpi-label">${level.dpi} DPI · ${level.name}</div>
            <div class="dimension">${widthCm.toFixed(1)} × ${heightCm.toFixed(1)} cm</div>
            <div class="dimension-cm">${widthIn.toFixed(2)} × ${heightIn.toFixed(2)} polegadas</div>
            <span class="quality-label" style="background:${level.color}22; color:${level.color};">
                ${level.description}
            </span>
        `;

        printSizesContainer.appendChild(item);
    });
}

function renderPaperCompatibility(widthPx, heightPx) {
    paperSizesContainer.innerHTML = '';
    const dpiTarget = 300; // qualidade fotográfica

    PAPER_SIZES.forEach(paper => {
        // Calcular pixels necessários para esse papel a 300 DPI
        // Considera ambas orientações (retrato/paisagem) e pega a melhor
        const widthInNeed1 = paper.widthCm / CM_PER_INCH;
        const heightInNeed1 = paper.heightCm / CM_PER_INCH;
        const pxW1 = Math.round(widthInNeed1 * dpiTarget);
        const pxH1 = Math.round(heightInNeed1 * dpiTarget);

        // Verificar nas duas orientações
        const fits1 = widthPx >= pxW1 && heightPx >= pxH1;
        const fits2 = widthPx >= pxH1 && heightPx >= pxW1;
        const fits = fits1 || fits2;

        // DPI efetivo nessa orientação
        const orientFits = fits1 ? { w: pxW1, h: pxH1 } : { w: pxH1, h: pxW1 };
        const effectiveDpi = Math.min(widthPx / (orientFits.w / dpiTarget), heightPx / (orientFits.h / dpiTarget));

        const item = document.createElement('div');
        item.className = 'paper-item ' + (fits ? 'compatible' : 'incompatible');

        item.innerHTML = `
            <div class="paper-name">${paper.name}</div>
            <div class="paper-size">${paper.description}</div>
            <div class="paper-status">
                <i class="fas fa-${fits ? 'check-circle' : 'times-circle'}"></i>
                ${fits
                    ? `OK (~${Math.round(effectiveDpi)} DPI)`
                    : `Insuficiente para 300 DPI`}
            </div>
        `;

        paperSizesContainer.appendChild(item);
    });
}

// =====================================================
// Utilidades
// =====================================================
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function calculateAspectRatio(w, h) {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(w, h);
    const ratioW = w / divisor;
    const ratioH = h / divisor;

    // Se a proporção tiver números muito grandes, mostrar decimal
    if (ratioW > 50 || ratioH > 50) {
        return `${(w / h).toFixed(2)}:1`;
    }
    return `${ratioW}:${ratioH}`;
}
