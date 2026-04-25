# Analisador de Imagens 📸

Aplicação web estática que permite ao usuário fazer upload de uma imagem e obter, instantaneamente, informações detalhadas sobre **resolução**, **tamanho do arquivo** e **tamanho máximo recomendado para impressão com boa qualidade**.

Toda a análise é feita **localmente no navegador** — nenhum arquivo é enviado a servidores.

---

## ✅ Funcionalidades implementadas

- **Upload de imagem** via clique ou arrastar e soltar (drag & drop).
- **Suporte a múltiplos formatos**: JPG, PNG, GIF, WEBP, BMP.
- **Pré-visualização** da imagem carregada.
- **Informações exibidas**:
  - Resolução (largura × altura em pixels)
  - Total de pixels e megapixels (MP)
  - Tamanho do arquivo (KB / MB)
  - Tipo MIME
  - Proporção (aspect ratio) — ex.: 16:9, 4:3
  - Avaliação automática de qualidade (Excelente / Boa / Média / Baixa)
- **Cálculo de tamanho máximo de impressão** em quatro níveis padrão de qualidade:
  - **72 DPI** — uso em tela / web
  - **150 DPI** — qualidade aceitável (banners, pôsteres a distância)
  - **300 DPI** — padrão profissional (fotografia)
  - **600 DPI** — qualidade excepcional (arte)
- **DPI personalizado**: o usuário pode informar qualquer valor (72–600).
- **Compatibilidade com tamanhos de papel padrão** (a 300 DPI):
  - 10×15, 13×18, 15×21, 20×30, A4, A3, 30×45, A2
  - Indica visualmente se a imagem possui resolução suficiente em cada tamanho.
- **Design responsivo** (desktop, tablet e mobile).
- **Seção educativa** explicando os níveis de DPI.

---

## 🌐 Entradas funcionais (URIs)

| Caminho | Descrição |
|---------|-----------|
| `index.html` | Página única da aplicação (SPA estática) |
| `css/style.css` | Estilos da aplicação |
| `js/main.js` | Lógica de upload, leitura de imagem e cálculos de impressão |

A aplicação **não possui parâmetros de URL**, todas as ações são feitas pela interface.

---

## 🧠 Como funciona o cálculo

A relação usada é a clássica de impressão:

```
Tamanho em polegadas = pixels / DPI
Tamanho em centímetros = polegadas × 2,54
```

Exemplo: uma imagem de 3000 × 2000 px a 300 DPI gera uma impressão de **25,4 × 16,9 cm** com qualidade fotográfica profissional.

---

## ❌ Funcionalidades ainda não implementadas

- Leitura de metadados EXIF (câmera, lente, ISO, data, GPS).
- Detecção do DPI embutido no arquivo (quando presente nos metadados).
- Suporte a múltiplas imagens simultâneas (lote).
- Exportação do relatório em PDF.
- Histórico das últimas imagens analisadas.
- Sugestão automática de redimensionamento para ajustar a um papel específico.

---

## 🚀 Próximos passos recomendados

1. Adicionar leitura de metadados EXIF usando a biblioteca `exif-js` ou `piexifjs` via CDN.
2. Permitir comparar várias imagens em uma única tela.
3. Adicionar uma calculadora reversa: "quero imprimir em X cm a 300 DPI — qual resolução preciso?".
4. Gerar e baixar um PDF com o relatório de análise.
5. Internacionalização (i18n) para inglês e espanhol.

---

## 🏗️ Arquitetura

```
index.html              → Estrutura HTML semântica
css/
  └── style.css         → Estilos modernos, responsivos e animações
js/
  └── main.js           → FileReader API + Image API para análise local
```

### Tecnologias utilizadas
- **HTML5** semântico
- **CSS3** com variáveis e Grid/Flexbox
- **JavaScript vanilla** (FileReader, Image API)
- **Font Awesome** (ícones via CDN)
- **Google Fonts — Inter** (tipografia)

### Modelo de dados
A aplicação **não armazena dados** (sem backend, sem tabelas). Toda informação é calculada em tempo real e descartada ao recarregar a página.

---

## 📦 Como publicar

Use a aba **Publish** para fazer o deploy do site com um clique. A aba Publish cuida de todo o processo automaticamente e fornece a URL pública.
