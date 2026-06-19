# 💕 Nós. — Carlos Henrique & Elen Ambrosio Souza

> Site romântico interativo — uma experiência cinematográfica de amor.

---

## 📁 Estrutura do Projeto

```
nos/
│
├── index.html              ← Arquivo principal (abre no navegador)
│
├── css/
│   ├── style.css           ← Estilos principais (cores, layout, telas)
│   ├── carousel.css        ← Estilos do carrossel e slides
│   └── animations.css      ← Animações, partículas, pétalas
│
├── js/
│   ├── memories.js         ← ⭐ SUAS FOTOS E MENSAGENS FICAM AQUI
│   ├── particles.js        ← Estrelas e partículas
│   ├── carousel.js         ← Lógica do carrossel
│   ├── music.js            ← Player de música
│   ├── effects.js          ← Pétalas, borboletas, brilhos
│   └── app.js              ← Orquestrador principal
│
├── images/                 ← 📸 COLOQUE SUAS FOTOS AQUI
│   ├── foto01.jpg
│   ├── foto02.jpg
│   └── ... (quantas quiser)
│
├── music/                  ← 🎵 COLOQUE SUA MÚSICA AQUI
│   └── musica.mp3
│
└── manifest.json           ← PWA (instalação como app)
```

---

## 📸 Como Adicionar Suas Fotos

### 1. Copie as fotos para a pasta `/images/`
Formatos aceitos: `.jpg`, `.jpeg`, `.png`, `.webp`

### 2. Edite o arquivo `js/memories.js`
Cada foto é um objeto `{ }` dentro do array `MEMORIES`:

```javascript
{
  image:   "images/foto01.jpg",    // caminho da imagem
  title:   "O Primeiro Olhar",     // título da foto
  message: "Sua mensagem aqui...", // texto romântico
  date:    "22 de Fevereiro, 2026",// data (ou "" para omitir)
  tag:     "Carlos & Elen ❤"       // texto pequeno no topo (ou "" para omitir)
},
```

### 3. Para adicionar mais fotos:
Basta copiar um bloco `{ ... },` e editar. Não tem limite!

---

## 🎵 Como Trocar a Música

### Opção 1 — Antes de abrir (padrão):
1. Coloque o arquivo `.mp3` na pasta `/music/`
2. No arquivo `js/memories.js`, edite:
   ```javascript
   defaultMusic: "music/musica.mp3",
   defaultMusicTitle: "Nome da Música",
   ```

### Opção 2 — Durante o site:
Clique no ícone de recarregar no player (canto superior esquerdo) e escolha qualquer `.mp3` do seu computador.

---

## ⚙️ Configurações (`js/memories.js`)

```javascript
const CONFIG = {
  // Data que vocês começaram a namorar (não mude o formato!)
  anniversaryDate: new Date("2026-02-22"),

  // Música padrão
  defaultMusic: "music/musica.mp3",
  defaultMusicTitle: "Nossa Música",

  // Slide automático em milissegundos (0 = desativado)
  autoplayInterval: 0,

  // Efeito parallax no mouse (desktop)
  parallaxEnabled: true,
};
```

---

## 🚀 Como Abrir o Site

### Localmente (sem internet):
1. Abra a pasta `nos/` no seu computador
2. Dê duplo clique em `index.html`
3. Abre direto no navegador! ✅

### No celular (recomendado):
Use o Chrome e selecione "Adicionar à tela inicial" para instalar como app!

### Hospedar online (para compartilhar):
- **Netlify Drop** (gratuito): arraste a pasta `nos/` em netlify.com/drop
- **GitHub Pages**: suba o código e ative o Pages
- **Vercel**: deploy direto do GitHub

---

## 🎨 Customizar Cores

No arquivo `css/style.css`, no início tem todas as cores:

```css
:root {
  --gold:     #C9A84C;   /* Dourado */
  --rose:     #F4C2C2;   /* Rosa claro */
  --rose-dark:#D4788A;   /* Rosa escuro / corações */
  --cream:    #FDF8F0;   /* Creme / texto principal */
  --black:    #0A0A0A;   /* Fundo preto */
  /* etc... */
}
```

---

## 💡 Dicas

- **Fotos em formato retrato (vertical)** ficam ainda mais bonitas
- Use fotos de boa resolução (acima de 800px de largura)
- Escreva mensagens do coração — é o que faz a diferença 💕
- Salve a música favorita de vocês como `musica.mp3`
- A última foto (foto20 ou a última que você colocar) vai logo antes da tela final

---

## ❤️ Sobre o Projeto

Feito com amor para Carlos Henrique & Elen Ambrosio Souza.
Começou em 22 de Fevereiro de 2026. Uma história que ainda está sendo escrita. 🌸

---

*"O lar não é um lugar. É uma pessoa."*
