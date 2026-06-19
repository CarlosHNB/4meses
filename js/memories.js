/* ============================================================
   NÓS. — memories.js
   ============================================================
   
   📸 GUIA PARA ADICIONAR / EDITAR FOTOS:
   
   1. Coloque suas fotos na pasta  /images/
   2. Para cada foto, edite o objeto { } correspondente:
      - image:   caminho da imagem (ex: "images/foto01.jpeg")
      - title:   título romântico
      - message: mensagem para a foto
      - date:    data opcional ou "" para omitir
      - tag:     texto pequeno no topo ou "" para omitir
   
   3. Para adicionar mais fotos: copie um bloco { } e edite
   4. A ordem aqui é a ordem no carrossel
   
   ============================================================ */

const MEMORIES = [
  {
    image: "images/foto01.jpeg",
    title: "O Primeiro Olhar",
    message: "Tem momentos que a gente carrega pra sempre. Esse foi um deles. O começo de tudo.",
    date: "22 de Fevereiro, 2026",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto02.jpeg",
    title: "O Dia que Escolhemos Um ao Outro",
    message: "Namorar você foi a decisão mais certa que já tomei. E todos os dias eu confirmo isso.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto03.jpeg",
    title: "Sorrisos que Guardam o Mundo",
    message: "Você tem o sorriso mais bonito que já vi. E fico feliz de ser o motivo dele às vezes.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto04.jpeg",
    title: "Nossa Paz",
    message: "Contigo aprendi que paz não é ausência de barulho. É a sensação de estar com a pessoa certa.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto05.jpeg",
    title: "Felicidade Simples",
    message: "Não preciso de muito. Preciso é de você. De tudo que a gente cria juntos sem querer.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto06.jpeg",
    title: "Você me Surpreende",
    message: "A cada dia te conheço mais. E cada descoberta me faz querer ficar cada vez mais perto.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto07.jpeg",
    title: "Nosso Cantinho",
    message: "Onde você está, é onde eu quero estar. Simples assim. Profundo assim.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto08.jpeg",
    title: "A Melhor Versão de Mim",
    message: "Você me faz querer ser melhor. Não por obrigação — por amor. Obrigado por isso, Elen.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto09.jpeg",
    title: "Presente",
    message: "Às vezes paro no meio do dia só pra lembrar que você existe. E fico feliz de novo.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto10.jpeg",
    title: "Cumplicidade",
    message: "Não precisamos falar o tempo todo. Basta estar junto. Nosso silêncio também tem voz.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto11.jpeg",
    title: "Você é Diferente",
    message: "Em você encontrei algo raro: leveza. A leveza de ser eu mesmo sem medo algum.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto12.jpeg",
    title: "Instante Favorito",
    message: "Existem tantos momentos bons contigo que já perdi a conta. E isso é o mais gostoso.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto13.jpeg",
    title: "Quando Você Ri",
    message: "Seu riso é a coisa mais bonita do mundo. Não cansa. Nunca vai cansar.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto14.jpeg",
    title: "Juntos é Melhor",
    message: "Tudo fica mais bonito com você do lado. O café, o dia, a vida toda.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto15.jpeg",
    title: "Minha Flor",
    message: "Você é delicada e forte ao mesmo tempo. Uma contradição linda que eu aprendo a amar todo dia.",
    date: "",
    tag: "Carlos & Elen ❤"
  },
  {
    image: "images/foto16.jpeg",
    title: "Te Escolho Todo Dia",
    message: "Amor não é só sentimento. É escolha. E eu te escolho ontem, hoje, e amanhã. Sempre.",
    date: "22 de Junho, 2026",
    tag: "Carlos & Elen ❤"
  },
];

/* ============================================================
   CONFIG GLOBAL
   ============================================================ */
const CONFIG = {
  anniversaryDate:    new Date("2026-02-22"),
  defaultMusic:       "music/musica.mp3",
  defaultMusicTitle:  "Nossa Música",
  autoplayInterval:   0,
  parallaxEnabled:    true,
  kenBurnsIntensity:  1.0,
};
