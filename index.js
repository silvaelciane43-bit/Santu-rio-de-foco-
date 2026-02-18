// --- CONFIGURAÇÃO DA HOME (index.js) ---

// 1. Não criamos mais 'user' ou 'moedas' aqui, pois o storage.js já faz isso.

// Usamos addEventListener para não haver conflito com outros scripts
window.addEventListener('load', () => {
    console.log("Santuário carregado! Iniciando componentes...");
    
    // Funções de Inicialização
    atualizarDisplay();
    gerarCalendario(); // Força a criação do calendário
    atualizarStatusHome();
    
    // Iniciar loop de atualização (Energia e Status)
    setInterval(atualizarStatusHome, 2000);

    // Carregar Animais/Guias Desbloqueados
    const animais = JSON.parse(localStorage.getItem('animais_ane')) || [];
    animais.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('desbloqueado');
    });

    // Carregar Metas na Home
    const listaMetas = document.getElementById('lista-metas');
    if (listaMetas) {
        const metasSalvas = JSON.parse(localStorage.getItem('metas_ane')) || [];
        listaMetas.innerHTML = ""; // Limpa antes de carregar
        metasSalvas.forEach(meta => {
            const texto = meta.texto || meta; // Aceita formato novo e antigo
            criarElementoLista(texto);
        });
    }
});

// --- FUNÇÃO DO CALENDÁRIO ---
function gerarCalendario() {
    const container = document.getElementById('calendario-container');
    if(!container) {
        console.error("Erro: O elemento 'calendario-container' não existe no HTML!");
        return;
    }

    const dataAtual = new Date();
    const mes = dataAtual.getMonth();
    const ano = dataAtual.getFullYear();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    
    container.innerHTML = ""; // Garante que começa vazio

    // Busca dias concluídos no histórico do Foco
    const diasConcluidos = JSON.parse(localStorage.getItem('dias_concluidos_ane')) || [];

    for(let i = 1; i <= ultimoDia; i++) {
        const diaElemento = document.createElement('div');
        diaElemento.classList.add('dia');
        diaElemento.innerText = i;
        
        // Formata a data atual para comparar com o histórico
        const dataFormatada = new Date(ano, mes, i).toLocaleDateString();

        // Se o dia for HOJE
        if (i === dataAtual.getDate()) {
            diaElemento.style.border = "2px solid #4a90e2";
            diaElemento.style.fontWeight = "bold";
        }

        // Se a Ane concluiu missão nesse dia
        if (diasConcluidos.includes(dataFormatada)) {
            diaElemento.style.backgroundColor = "#2ecc71"; // Verde sucesso
            diaElemento.style.color = "white";
            diaElemento.style.borderRadius = "50%";
        }
        
        container.appendChild(diaElemento);
    }
}

// --- ATUALIZAÇÕES DE INTERFACE ---
function atualizarDisplay() {
    const elMoedas = document.getElementById('moedas-contagem');
    if(elMoedas) elMoedas.innerText = user.moedas; // Usa o 'user' do storage.js
}

function atualizarStatusHome() {
    const barra = document.getElementById('energia-fill');
    const corpo = document.getElementById('camada-corpo');
    const nivelTexto = document.getElementById('user-nivel');

    if(nivelTexto) nivelTexto.innerText = user.nivel;

    if(barra){
        const nivelEnergia = Math.max(0, Math.min(100, user.energia));
        barra.style.width = nivelEnergia + "%";
    }

    if (corpo) {
    // 1. A prioridade máxima é a falta de energia (independente do nível)
    if (user.energia <= 10) {
        corpo.src = "img/imc-baixo-removebg-preview.png"; 
    } 
    // 2. Agora verificamos os níveis do MAIOR para o MENOR
    else if (user.energia >= 90) {
        corpo.src = "img/copo-normal-feliz-removebg-preview (1).png";
    } 
    else if (user.energia >= 80) {
        corpo.src = "img/se-mexer.png";
    } 
    else if (user.energia >= 70) {
        corpo.src = "img/alongar.png";
    } 
    else if (user.energia >= 60) {
        corpo.src = "img/estudar.png";
    } 
    else if (user.energia >= 50) {
        corpo.src = "img/beba-agua.png";
    } 
    else if (user.energia >= 40) {
        corpo.src = "img/comer.png";
    } 
    else if (user.energia >= 30) {
        corpo.src = "img/dormir.png";
    } 
    else if (user.energia >= 20) {
        corpo.src = "img/copo-normal-cansado-removebg-preview.png";
    } 
    // 3. Imagem padrão para quem está abaixo do nível 20
    else {
        corpo.src = "img/copo-normal.png"; // Coloque o nome da sua imagem inicial aqui
    }
}
}

// --- SISTEMA DE METAS (SIMPLIFICADO) ---
function adicionarMeta() {
    const input = document.getElementById('nova-meta');
    if(!input || !input.value) return;

    const val = input.value;
    criarElementoLista(val);

    const metasAtuais = JSON.parse(localStorage.getItem('metas_ane')) || [];
    metasAtuais.push({ texto: val, prioridade: 'comum' });
    localStorage.setItem('metas_ane', JSON.stringify(metasAtuais));

    input.value = "";
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