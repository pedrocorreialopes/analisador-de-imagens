// Analisador de Imagens - JavaScript Principal

class ImageAnalyzer {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');

        // Event listeners para upload
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        uploadArea.addEventListener('click', () => fileInput.click());
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processImage(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processImage(file);
        }
    }

    processImage(file) {
        // Validação do arquivo
        if (!this.validateFile(file)) {
            return;
        }

        // Ler o arquivo
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.analyzeImage(img, file);
            };
            img.onerror = () => {
                this.showError('Erro ao carregar a imagem. Verifique se o arquivo não está corrompido.');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    validateFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 20 * 1024 * 1024; // 20MB

        if (!validTypes.includes(file.type)) {
            this.showError('Formato de arquivo não suportado. Use JPG, PNG, GIF ou WebP.');
            return false;
        }

        if (file.size > maxSize) {
            this.showError('Arquivo muito grande. Tamanho máximo: 20MB.');
            return false;
        }

        return true;
    }

    analyzeImage(img, file) {
        // Obter informações básicas
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const fileSize = this.formatFileSize(file.size);
        const fileType = this.getFileType(file.type);
        const resolution = `${width} × ${height}`;

        // Calcular DPI (assumindo 72 DPI como padrão se não houver metadados)
        const dpi = this.calculateDPI(width, height);
        const dpiInfo = this.getDPIQuality(dpi);

        // Calcular tamanhos máximos de impressão
        const printSizes = this.calculatePrintSizes(width, height);

        // Atualizar interface
        this.updateResults({
            preview: img.src,
            resolution: resolution,
            width: width,
            height: height,
            fileSize: fileSize,
            fileType: fileType,
            fileName: file.name,
            dpi: dpi,
            dpiQuality: dpiInfo.quality,
            dpiRating: dpiInfo.rating,
            maxPrintSize300: printSizes.dpi300,
            maxPrintSize150: printSizes.dpi150,
            maxPrintSize72: printSizes.dpi72
        });

        this.showResults();
    }

    calculateDPI(width, height) {
        // Como não temos acesso direto aos metadados EXIF em JavaScript puro,
        // calculamos um DPI estimado baseado na resolução
        // Valores típicos: 72 (web), 150 (impressão básica), 300 (impressão profissional)
        
        const totalPixels = width * height;
        
        if (totalPixels >= 5000000) { // 5MP+
            return 300;
        } else if (totalPixels >= 1000000) { // 1MP+
            return 150;
        } else {
            return 72;
        }
    }

    getDPIQuality(dpi) {
        if (dpi >= 300) {
            return { 
                quality: 'Excelente', 
                rating: 'Profissional' 
            };
        } else if (dpi >= 150) {
            return { 
                quality: 'Boa', 
                rating: 'Comercial' 
            };
        } else if (dpi >= 72) {
            return { 
                quality: 'Regular', 
                rating: 'Básica' 
            };
        } else {
            return { 
                quality: 'Baixa', 
                rating: 'Não recomendada' 
            };
        }
    }

    calculatePrintSizes(width, height) {
        // Converter pixels para polegadas considerando diferentes DPIs
        const inchToCm = 2.54;
        
        // 300 DPI - Excelente qualidade
        const widthInches300 = width / 300;
        const heightInches300 = height / 300;
        const widthCm300 = widthInches300 * inchToCm;
        const heightCm300 = heightInches300 * inchToCm;

        // 150 DPI - Boa qualidade
        const widthInches150 = width / 150;
        const heightInches150 = height / 150;
        const widthCm150 = widthInches150 * inchToCm;
        const heightCm150 = heightInches150 * inchToCm;

        // 72 DPI - Qualidade básica
        const widthInches72 = width / 72;
        const heightInches72 = height / 72;
        const widthCm72 = widthInches72 * inchToCm;
        const heightCm72 = heightInches72 * inchToCm;

        return {
            dpi300: `${widthCm300.toFixed(1)} × ${heightCm300.toFixed(1)} cm (${widthInches300.toFixed(1)} × ${heightInches300.toFixed(1)}")`,
            dpi150: `${widthCm150.toFixed(1)} × ${heightCm150.toFixed(1)} cm (${widthInches150.toFixed(1)} × ${heightInches150.toFixed(1)}")`,
            dpi72: `${widthCm72.toFixed(1)} × ${heightCm72.toFixed(1)} cm (${widthInches72.toFixed(1)} × ${heightInches72.toFixed(1)}")`
        };
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getFileType(mimeType) {
        const types = {
            'image/jpeg': 'JPEG',
            'image/jpg': 'JPEG',
            'image/png': 'PNG',
            'image/gif': 'GIF',
            'image/webp': 'WebP'
        };
        return types[mimeType] || mimeType;
    }

    updateResults(data) {
        // Atualizar todos os campos
        document.getElementById('previewImage').src = data.preview;
        document.getElementById('resolution').textContent = data.resolution;
        document.getElementById('width').textContent = data.width;
        document.getElementById('height').textContent = data.height;
        document.getElementById('fileSize').textContent = data.fileSize;
        document.getElementById('fileType').textContent = data.fileType;
        document.getElementById('fileName').textContent = data.fileName;
        document.getElementById('dpi').textContent = data.dpi + ' DPI';
        document.getElementById('dpiQuality').textContent = data.dpiQuality;
        document.getElementById('dpiRating').textContent = data.dpiRating;
        document.getElementById('maxPrintSize300').textContent = data.maxPrintSize300;
        document.getElementById('maxPrintSize150').textContent = data.maxPrintSize150;
        document.getElementById('maxPrintSize72').textContent = data.maxPrintSize72;

        // Adicionar destaque ao DPI
        this.highlightDPI(data.dpi);
    }

    highlightDPI(dpi) {
        const dpiElement = document.getElementById('dpi');
        dpiElement.classList.remove('highlight');
        
        if (dpi >= 300) {
            dpiElement.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        } else if (dpi >= 150) {
            dpiElement.style.background = 'linear-gradient(135deg, #007bff, #0056b3)';
        } else if (dpi >= 72) {
            dpiElement.style.background = 'linear-gradient(135deg, #ffc107, #e0a800)';
        } else {
            dpiElement.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
        }
        
        dpiElement.style.color = 'white';
        dpiElement.classList.add('highlight');
    }

    showResults() {
        document.querySelector('.upload-section').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
    }

    showError(message) {
        alert('Erro: ' + message);
    }

    resetUpload() {
        document.getElementById('fileInput').value = '';
        document.querySelector('.upload-section').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
    }
}

// Funções globais
function resetUpload() {
    document.getElementById('fileInput').value = '';
    document.querySelector('.upload-section').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new ImageAnalyzer();
});