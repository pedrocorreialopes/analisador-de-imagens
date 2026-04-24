# Analisador de Imagens

Uma aplicação web que permite aos usuários fazer upload de imagens e obter informações detalhadas sobre resolução, tamanho do arquivo, DPI e tamanhos máximos de impressão com qualidade adequada.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Upload de imagens** por arrastar e soltar ou seleção manual
- **Análise automática** de imagens (formatos: JPG, PNG, GIF, WebP)
- **Informações detalhadas**:
  - Resolução em pixels (largura × altura)
  - Tamanho do arquivo em KB/MB
  - Tipo de arquivo
  - DPI calculado
  - Qualidade de impressão classificada
- **Cálculo de tamanhos máximos de impressão** para diferentes qualidades:
  - 300 DPI (Excelente qualidade)
  - 150 DPI (Boa qualidade)
  - 72 DPI (Qualidade básica)
- **Interface responsiva** para desktop e dispositivos móveis
- **Guia visual** de qualidade de impressão

### 🎯 Como Usar

1. Acesse a aplicação
2. Arraste uma imagem para a área de upload ou clique para selecionar
3. Aguarde o processamento automático
4. Visualize as informações detalhadas sobre sua imagem
5. Consulte os tamanhos máximos de impressão recomendados

## 📊 Cálculos e Métricas

### DPI (Pontos por Polegada)
- **Excelente (300+ DPI)**: Impressão profissional, fotos de alta qualidade
- **Boa (150-299 DPI)**: Impressão comum, boa qualidade para a maioria dos usos
- **Regular (72-149 DPI)**: Impressão básica, pode parecer granulada
- **Baixa (<72 DPI)**: Não recomendada para impressão

### Tamanhos de Impressão
Os tamanhos são calculados considerando:
- Conversão de pixels para polegadas (divisão pelo DPI)
- Conversão de polegadas para centímetros (× 2,54)
- Tamanhos máximos para diferentes níveis de qualidade

## 🛠️ Tecnologias Utilizadas

- **HTML5/CSS3**: Estrutura e estilização
- **JavaScript Vanilla**: Lógica da aplicação
- **Font Awesome**: Ícones
- **CSS Grid/Flexbox**: Layout responsivo
- **Drag & Drop API**: Upload interativo

## 📁 Estrutura do Projeto

```
/
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos e responsividade
├── js/
│   └── script.js      # Lógica JavaScript
└── README.md          # Documentação
```

## 🌐 Endpoints e Funcionalidades

### Página Principal
- **URL**: `/index.html`
- **Descrição**: Interface principal da aplicação
- **Funcionalidades**: Upload de imagens, análise e exibição de resultados

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (1200px+)
- Tablets (768px - 1199px)
- Smartphones (< 768px)

## 🔧 Configurações

### Limitações
- Tamanho máximo de arquivo: 20MB
- Formatos suportados: JPG, PNG, GIF, WebP
- Máximo de pixels: Limitado pela memória do navegador

### Personalização
As cores e estilos podem ser facilmente modificados no arquivo `css/style.css`.

## 🚀 Próximas Funcionalidades Sugeridas

1. **Análise de cores predominantes**
2. **Detecção de metadados EXIF** (data, câmera, GPS)
3. **Comparação lado a lado** de múltiplas imagens
4. **Histórico de análises**
5. **Download de relatório PDF**
6. **Compartilhamento de resultados**
7. **Análise de compressão e perda de qualidade**
8. **Conversão entre formatos**

## 📈 Melhorias de Performance

- Implementar cache de imagens processadas
- Adicionar lazy loading para imagens grandes
- Otimizar cálculos para imagens de alta resolução
- Adicionar indicadores de progresso durante o processamento

## 🐛 Tratamento de Erros

A aplicação inclui validação de:
- Formatos de arquivo não suportados
- Arquivos muito grandes
- Arquivos corrompidos
- Imagens que não conseguem ser carregadas

## 📄 Notas Importantes

- O cálculo de DPI é estimado baseado na resolução da imagem
- Para DPI exato, seria necessário acesso aos metadados EXIF
- Os tamanhos de impressão são recomendações baseadas em padrões gráficos
- A qualidade final da impressão também depende da impressora e papel utilizados