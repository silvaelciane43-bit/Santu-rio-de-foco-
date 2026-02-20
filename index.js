// 1. LISTA DE FRASES (Sempre no topo)
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

// 2. INICIALIZAÇÃO (O que roda ao abrir a página)
window.addEventListener('load', () => {
    console.log("Santuário carregado! Iniciando componentes...");
    inicializarApp();
    
    // Iniciar loop de atualização (Energia e Status) a cada 2 segundos
    setInterval(atualizarStatusHome, 2000);
});

function inicializarApp() {
    atualizarSaudacao();
    gerarFraseDoDia();
    gerarCalendario(); 
    
    // Carregar dados extras
    if (typeof carregarDadosUsuario === "function") carregarDadosUsuario();
    if (typeof atualizarDisplay === "function") atualizarDisplay();
    atualizarStatusHome();
    carregarMetasHome();
    carregarAnimais();
}

// 3. FUNÇÕES DO CALENDÁRIO E FRASES
function atualizarSaudacao() {
    const hora = new Date().getHours();
    const saudacaoEl = document.getElementById('saudacao');
    if (saudacaoEl) {
        if (hora < 12) saudacaoEl.innerText = "Bom dia, Max!";
        else if (hora < 18) saudacaoEl.innerText = "Boa tarde, Max!";
        else saudacaoEl.innerText = "Boa noite, Max!";
    }
}

function gerarFraseDoDia() {
    const diaDoMes = new Date().getDate();
    const fraseEl = document.getElementById('frase-dia');
    if (fraseEl) {
        fraseEl.innerText = `"${frasesFoco[diaDoMes - 1]}"`;
    }
}

function gerarCalendario() {
    const container = document.getElementById('calendario-container');
    if (!container) return;

    const diaHoje = new Date().getDate();
    let diasConcluidos = JSON.parse(localStorage.getItem('diasMarcados')) || [];

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
    let diasConcluidos = JSON.parse(localStorage.getItem('diasMarcados')) || [];
    if (!diasConcluidos.includes(numero)) {
        diasConcluidos.push(numero);
        localStorage.setItem('diasMarcados', JSON.stringify(diasConcluidos));
        gerarCalendario(); 
    }
}

// 4. STATUS DO AVATAR E ENERGIA
function atualizarStatusHome() {
   
    const corpo = document.getElementById('camada-corpo');
    if (!corpo) return;

    const agora = new Date();
    const hora = agora.getHours();
    const barra = document.getElementById('energia-fill');
    const nivelTexto = document.getElementById('user-nivel');

    // Atualiza Nível e Barra de Energia (usando objeto 'user' do storage.js)
    if(typeof user !== 'undefined') {
        if(nivelTexto) nivelTexto.innerText = user.nivel;
        if(barra){
            const nivelEnergia = Math.max(0, Math.min(100, user.energia));
            barra.style.width = nivelEnergia + "%";
        }
    }

    const missaoAtiva = localStorage.getItem('missao_atual_ane');

    // Prioridade 1: Missão Ativa (Foco)
    if (missaoAtiva) {
        const missao = missaoAtiva.toLowerCase();
        if (missao.includes("estudar") || missao.includes("ler")) { corpo.src = "img/estudando.png"; return; }
        if (missao.includes("treinar") || missao.includes("academia")) { corpo.src = "img/academia.png"; return; }
        if (missao.includes("arrumar") || missao.includes("louça")) { corpo.src = "img/arrumando-casa.png"; return; }
        corpo.src = "img/alongar.png";
        return;
    }

    // Prioridade 2: Baixa Energia
    if (typeof user !== 'undefined' && user.energia <= 10) {
        corpo.src = "img/imc-baixo-removebg-preview.png";
        return;
    }

    // Prioridade 3: Rotina por Horário
    if (hora === 4) corpo.src = "img/dentes.png";
    else if (hora === 6) corpo.src = "img/avatar-banho.png";
    else if (hora === 7) corpo.src = "img/cafe.png";
    else if (hora === 9) corpo.src = "img/comer.png";
    else if (hora === 12) corpo.src = "img/almocando.png";
    else if (hora >= 22 || hora < 5) corpo.src = "img/dormir.png";
    
    // Prioridade 4: Estados de Energia (Se nada acima capturou)
    else if (typeof user !== 'undefined') {
        if (user.energia >= 90) corpo.src = "img/copo-normal-feliz-removebg-preview (1).png";
        else if (user.energia >= 60) corpo.src = "img/estudar.png";
        else if (user.energia >= 30) corpo.src = "img/beba-agua.png";
        else corpo.src = "img/copo-normal.png";
    }
}

// 5. SISTEMA DE METAS E ANIMAIS
function carregarMetasHome() {
    const listaMetas = document.getElementById('lista-metas');
    if (listaMetas) {
        const metasSalvas = JSON.parse(localStorage.getItem('metas_ane')) || [];
        listaMetas.innerHTML = ""; 
        metasSalvas.forEach(meta => {
            const texto = meta.texto || meta;
            criarElementoLista(texto);
        });
    }
}

function criarElementoLista(texto) {
    const lista = document.getElementById('lista-metas');
    if(!lista) return;
    const li = document.createElement('li');
    li.innerHTML = `✨ ${texto} <button onclick="removerMeta('${texto}', this)" style="float:right; background:none; border:none; color:red; cursor:pointer;">✕</button>`;
    lista.appendChild(li);
}

function removerMeta(texto, botao) {
    botao.parentElement.remove();
    let metasAtuais = JSON.parse(localStorage.getItem('metas_ane')) || [];
    metasAtuais = metasAtuais.filter(m => (m.texto || m) !== texto);
    localStorage.setItem('metas_ane', JSON.stringify(metasAtuais));
}

function carregarAnimais() {
    const animais = JSON.parse(localStorage.getItem('animais_ane')) || [];
    animais.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('desbloqueado');
    });
}

function atualizarDisplay() {
    const elMoedas = document.getElementById('moedas-contagem');
    if(elMoedas && typeof user !== 'undefined') elMoedas.innerText = user.moedas;
}