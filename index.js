/* --- CONFIGURAÇÃO DE FRASES --- */
const frasesFoco = [
    "Foco é dizer não a centenas de outras boas ideias.",
    "Onde o foco vai, a energia flui.",
    "Não pare até se orgulhar. O progresso é degrau por degrau.",
    "Sua mente é sua maior ferramenta. Afie-a hoje.",
    "Pequenos passos geram grandes resultados. Comece agora.",
    "Menos ruído, mais foco. O que importa hoje?",
    "Elimine as distrações antes que elas eliminem seus sonhos.",
    "Um foco por vez. A pressa é inimiga da perfeição.",
    "A disciplina é a liberdade de ser quem você quer ser.",
    "Você é mais forte que sua procrastinação.",
    "O segredo do sucesso é a constância no objetivo.",
    "Não conte os dias, faça os dias contarem.",
    "Foque no processo, o resultado é consequência.",
    "Atenção total no agora. O futuro é construído hoje.",
    "Sua energia é limitada. Use-a no que te faz crescer.",
    "O sucesso começa quando a desculpa termina.",
    "Mantenha o olhar no alvo, não nos obstáculos.",
    "A calmaria não forma bons marinheiros. Foque na ação.",
    "Seja mais forte que sua melhor desculpa.",
    "Respire fundo, organize a mente e recomece.",
    "A vitória pertence aos que persistem com foco.",
    "O tédio é apenas um teste de resistência. Continue.",
    "Não olhe para os lados. O seu caminho é para frente.",
    "Cada minuto de foco economiza horas de retrabalho.",
    "Sua vontade deve ser maior que sua distração.",
    "A clareza precede o poder. Saiba o que você quer.",
    "Grandes feitos levam tempo. Mantenha a mira.",
    "Focar é uma escolha diária. Escolha seu futuro.",
    "O que você faz hoje define quem você será amanhã.",
    "Seja obstinado pelo seu progresso.",
    "Mês concluído com sucesso. O foco venceu!"
];

/* --- INICIALIZAÇÃO PRINCIPAL --- */
window.addEventListener('load', async () => {
    console.log("Santuário de " + user.nome + " carregado!");
    
    // 1. Tenta sincronizar com o arquivo do Python primeiro
    if (typeof sincronizacaoAutomatica === "function") {
        await sincronizacaoAutomatica();
    }

    // 2. Inicializa os componentes da tela
    inicializarApp();
    
    // 3. Loop de atualização constante (Energia e Imagens)
    setInterval(atualizarStatusHome, 2000);
});

function inicializarApp() {
    atualizarSaudacao();
    gerarFraseDoDia();
    gerarCalendario(); 
    atualizarDisplay();
    atualizarBioStatus(); // Força a barra de IMC ficar vermelha se necessário
    carregarMetasHome();
    carregarAnimais();
}

/* --- SISTEMA DE BIO-STATUS (A BARRA VERTICAL) --- */
function atualizarBioStatus() {
    const barraContainer = document.getElementById('barra-corpo');
    const fill = document.getElementById('energia-fill-vertical');
    const ponteiro = document.getElementById('ponteiro-imc');
    const textoFala = document.getElementById('texto-fala');
    const balao = document.getElementById('avatar-speech');

    const imc = user.saude.imc || 0;
    const energiaAtual = user.energia || 100;

    // Listas de frases por situação
    const horaAtual = new Date().getHours();

if (horaAtual < 9 && imc < 25) {
    textoFala.innerText = `Bom dia, ${user.nome}! O Santuário detectou que você acordou com tudo! ☀️`;
} else if (horaAtual > 21) {
    textoFala.innerText = `O dia foi produtivo, ${user.nome}. Que tal baixar a frequência para um sono reparador? 🌙`;
}

    const frasesAlerta = [
        `Atenção, ${user.nome}! Detectei IMC de ${imc}. Sua vitalidade está em alerta vermelho! ⚠️`,
        `Ei ${user.nome}, os sensores indicam IMC alto. Que tal uma caminhada hoje? 🏃‍♀️`,
        `Status Crítico: IMC ${imc}. Vamos focar na nutrição agora? 🍎`,
        `O Santuário está em alerta! Seu corpo precisa de movimento, ${user.nome}.`
    ];

    const frasesSaudaveis = [
    `Dá para ver de longe que você está se cuidando, ${user.nome}! Que energia incrível. ✨`,
    `Você está em sintonia com o seu corpo hoje. É muito bom te ver assim!`,
    `Sinto que você está com foco total. O que vamos conquistar hoje? ⚡`,
    `Cuidar de si é a melhor escolha que você faz no dia. Orgulho da sua dedicação!`,
    `Você está construindo a sua melhor versão, um passo de cada vez. Continue assim!`,
    `Sua disciplina é inspiradora, ${user.nome}. O bem-estar fica bem em você!`,
    `Aproveite essa clareza mental e essa disposição. Você está brilhando! 🌟`,
    `Corpo e mente em equilíbrio... nada segura você hoje!`,
    `O autocuidado é a sua maior força. Fico feliz em ver sua evolução.`,
    `Sua energia está contagiante! Vamos aproveitar esse ritmo, ${user.nome}?`
];

    const frasesCansada = [
    `Você deu o seu melhor hoje, ${user.nome}. Agora, seu corpo pede uma pausa. Descansa, tá? 🌙`,
    `Sinto que sua energia está no fim... Não se cobre tanto, ${user.nome}. O mundo pode esperar até amanhã.`,
    `Amanhã é um novo começo, mas agora o que você mais precisa é de um abraço do seu travesseiro. ✨`,
    `Respeite o seu ritmo, ${user.nome}. Até as mentes mais brilhantes precisam de um tempo offline.`,
    `Estou sentindo que você está exausto(a). Que tal desligar as telas e fechar os olhos por um momento?`
];

    // 1. Lógica do Ponteiro e Preenchimento (Mantida)
    if (fill) fill.style.height = energiaAtual + "%";
    let posicaoPonteiro = (imc - 15) * 5; 
    if (ponteiro) ponteiro.style.bottom = Math.min(95, Math.max(5, posicaoPonteiro)) + "%";

    // 2. Lógica de escolha de frases
    if (balao) balao.style.display = "block";

    if (imc >= 25) {
        // MODO PERIGO
        if (barraContainer) barraContainer.classList.add('barra-perigo');
        const sorteio = Math.floor(Math.random() * frasesAlerta.length);
        if (textoFala) textoFala.innerText = frasesAlerta[sorteio];
    } 
    else if (energiaAtual < 20) {
        // MODO CANSADO
        if (barraContainer) barraContainer.classList.remove('barra-perigo');
        const sorteio = Math.floor(Math.random() * frasesCansada.length);
        if (textoFala) textoFala.innerText = frasesCansada[sorteio];
    }
    else {
        // MODO NORMAL/SAUDÁVEL
        if (barraContainer) barraContainer.classList.remove('barra-perigo');
        const sorteio = Math.floor(Math.random() * frasesSaudaveis.length);
        if (textoFala) textoFala.innerText = frasesSaudaveis[sorteio];
    }
}

/* --- FUNÇÕES DE INTERFACE --- */
function atualizarSaudacao() {
    const hora = new Date().getHours();
    const saudacaoEl = document.getElementById('saudacao');
    if (saudacaoEl) {
        let msg = "";
        if (hora < 12) msg = `Bom dia, ${user.nome}!`;
        else if (hora < 18) msg = `Boa tarde, ${user.nome}!`;
        else msg = `Boa noite, ${user.nome}!`;
        saudacaoEl.innerText = msg;
    }
}

function gerarFraseDoDia() {
    const diaDoMes = new Date().getDate();
    const fraseEl = document.getElementById('frase-dia');
    if (fraseEl) {
        fraseEl.innerText = `"${frasesFoco[(diaDoMes - 1) % frasesFoco.length]}"`;
    }
}

function atualizarDisplay() {
    const elMoedas = document.getElementById('moedas-contagem');
    const elNivel = document.getElementById('user-nivel');
    const barraHorizontal = document.getElementById('energia-fill');

    if(elMoedas) elMoedas.innerText = user.moedas;
    if(elNivel) elNivel.innerText = user.nivel;
    if(barraHorizontal) barraHorizontal.style.width = user.energia + "%";
}

/* --- CALENDÁRIO --- */
function gerarCalendario() {
    const container = document.getElementById('calendario-container');
    if (!container) return;

    const diaHoje = new Date().getDate();
    let diasConcluidos = JSON.parse(localStorage.getItem('diasMarcados_ane')) || [];

    container.innerHTML = ""; 

    for (let i = 1; i <= 31; i++) {
        const divDia = document.createElement('div');
        divDia.classList.add('dia-calendario');
        divDia.innerText = i;

        if (i === diaHoje) divDia.classList.add('dia-atual');

        if (diasConcluidos.includes(i)) {
            divDia.classList.add('dia-concluido');
            const x = document.createElement('span');
            x.classList.add('x-dourado');
            x.innerText = "X";
            divDia.appendChild(x);
        }

        divDia.onclick = () => marcarDia(i);
        container.appendChild(divDia);
    }
}

function marcarDia(numero) {
    let evento = prompt(`O que você tem planejado para o dia ${numero}? (Ex: Entrevista, Treino, Médico)`);
    
    if (evento) {
        let horario = prompt(`Que horas devo te avisar? (Formato 24h, ex: 14:30)`);
        
        // Salva no sistema
        let lembretes = JSON.parse(localStorage.getItem('lembretes_santuario')) || [];
        lembretes.push({
            dia: numero,
            tarefa: evento,
            hora: horario,
            notificado: false
        });
        localStorage.setItem('lembretes_santuario', JSON.stringify(lembretes));

        alert(`Agendado! O Santuário vai te alertar sobre "${evento}" às ${horario}.`);
        
        // Ganha XP por se organizar (Crucial para TDAH!)
        if (typeof ganharXP === "function") ganharXP(100);
        
        gerarCalendario(); 
    }
}
function checarAlarmes() {
    const agora = new Date();
    const diaHoje = agora.getDate();
    const horaAgora = agora.getHours().toString().padStart(2, '0') + ":" + 
                agora.getMinutes().toString().padStart(2, '0');

    let lembretes = JSON.parse(localStorage.getItem('lembretes_santuario')) || [];

    lembretes.forEach(l => {
        if (l.dia === diaHoje && l.hora === horaAgora && !l.notificado) {
            // DISPARA O ALERTA!
            alert(`🚨 ALERTA DO SANTUÁRIO: ${l.tarefa} AGORA!`);
            
            // Se estiver no celular, faz vibrar
            if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
            
            l.notificado = true; // Para não apitar o minuto inteiro
            localStorage.setItem('lembretes_santuario', JSON.stringify(lembretes));
        }
    });
}

// Adicione isso no seu setInterval que já existe
setInterval(() => {
    atualizarStatusHome();
    checarAlarmes();
}, 60000); // Checa a cada minuto

/* --- LOGICA DO AVATAR --- */
function atualizarStatusHome() {
    const corpo = document.getElementById('camada-corpo');
    if (!corpo) return;

    const hora = new Date().getHours();
    atualizarDisplay(); // Atualiza moedas e barra horizontal no loop

    const missaoAtiva = localStorage.getItem('missao_atual_ane');

    if (missaoAtiva) {
        const missao = missaoAtiva.toLowerCase();
        if (missao.includes("estudar") || missao.includes("ler")) { corpo.src = "img/estudando.png"; return; }
        if (missao.includes("treinar") || missao.includes("academia")) { corpo.src = "img/academia.png"; return; }
        corpo.src = "img/alongar.png";
        return;
    }

    if (user.energia <= 10) {
        corpo.src = "img/imc-baixo-removebg-preview.png"; 
        return;
    }

    if (hora >= 22 || hora < 5) corpo.src = "img/dormir.png";
    else if (user.saude.imc >= 25) corpo.src = "img/copo-normal.png"; // Pode trocar por uma imagem de "preocupado"
    else if (user.energia >= 90) corpo.src = "img/copo-normal-feliz-removebg-preview (1).png";
    else corpo.src = "img/copo-normal.png";
}

/* --- SISTEMA DE METAS E ANIMAIS --- */
function carregarMetasHome() {
    const listaMetas = document.getElementById('lista-metas');
    if (!listaMetas) return;
    const metasSalvas = JSON.parse(localStorage.getItem('metas_ane')) || [];
    listaMetas.innerHTML = ""; 
    metasSalvas.forEach(meta => {
        const texto = meta.texto || meta;
        criarElementoLista(texto);
    });
}

function criarElementoLista(texto) {
    const lista = document.getElementById('lista-metas');
    if(!lista) return;
    const li = document.createElement('li');
    li.innerHTML = `✨ ${texto} <button onclick="removerMeta('${texto}', this)" style="float:right; cursor:pointer;">✕</button>`;
    lista.appendChild(li);
}

function carregarAnimais() {
    const animais = JSON.parse(localStorage.getItem('animais_ane')) || [];
    animais.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('desbloqueado');
    });
}