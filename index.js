let moedas = parseInt(localStorage.getItem('moedas_ane')) || 0;
let animais = JSON.parse(localStorage.getItem('animais_ane')) || [];
let intervalo;

// Simulação do objeto user (ajuste conforme seu storage.js)
let user = {
    energia: parseInt(localStorage.getItem('energia_ane')) || 100,
    nivel: parseInt(localStorage.getItem('nivel_ane')) || 0
};

const precos = { 
    'guia-onca': 500, 
    'guia-escorpiao': 1000, 
    'guia-gato': 1500, 
    'guia-cabra': 2000, 
    'guia-calopsita': 2500 
};

// --- ÚNICO WINDOW.ONLOAD ---
window.onload = () => {
    atualizarDisplay();
    gerarCalendario();
    atualizarStatusHome();
    
    // Iniciar loop de atualização
    setInterval(atualizarStatusHome, 2000);

    // Desbloquear animais comprados
    animais.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('desbloqueado');
    });

    // Carregar Metas
    const metasSalvas = JSON.parse(localStorage.getItem('metas_ane')) || [];
    metasSalvas.forEach(meta => criarElementoLista(meta));
};

function atualizarDisplay() {
    // Ajustado para os IDs que estão no seu HTML
    const elMoedas = document.getElementById('moedas-contagem');
    if(elMoedas) elMoedas.innerText = moedas;
    
    localStorage.setItem('moedas_ane', moedas);
}

// --- FUNÇÕES DE INTERFACE ---
function gerarCalendario() {
    const container = document.getElementById('calendario-container');
    if(!container) return;

    const dataAtual = new Date();
    const mes = dataAtual.getMonth();
    const ano = dataAtual.getFullYear();
    
    // Pega o último dia do mês atual
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    
    container.innerHTML = ""; // Limpa antes de gerar

    for(let i = 1; i <= ultimoDia; i++) {
        const diaElemento = document.createElement('div');
        diaElemento.classList.add('dia');
        diaElemento.innerText = i;
        
        if (i === dataAtual.getDate()) {
            diaElemento.style.backgroundColor = "#4a90e2";
            diaElemento.style.color = "white";
            diaElemento.style.borderRadius = "50%";
        }
        
        container.appendChild(diaElemento);
    }
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
        // Lógica de evolução baseada em nível e energia
        if (user.energia < 20) {
            corpo.src = "img/imc-baixo-removebg-preview.png"; 
        } else if (user.nivel >= 30) {
            corpo.src = "img/copo-normal-cançado-removebg-preview.png";
        } else if (user.nivel >= 20) {
            corpo.src = "img/estagio_3.png";
      
        }
    }
}

// --- SISTEMA DE METAS ---
function adicionarMeta() {
    const input = document.getElementById('nova-meta');
    if(!input || !input.value) return;

    const val = input.value;
    criarElementoLista(val);

    const metasAtuais = JSON.parse(localStorage.getItem('metas_ane')) || [];
    metasAtuais.push(val);
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
    metasAtuais = metasAtuais.filter(m => m !== texto);
    localStorage.setItem('metas_ane', JSON.stringify(metasAtuais));
}

// --- FOCO / TIMER ---
function ativarHiperfoco() {
    const inputMin = document.getElementById('minutos');
    if(!inputMin || !inputMin.value) return alert("Ane, coloque o tempo!");
    
    let tempo = inputMin.value * 60;
    let total = tempo;
    
    clearInterval(intervalo);
    intervalo = setInterval(() => {
        tempo--;
        let m = Math.floor(tempo / 60);
        let s = tempo % 60;
        
        const displayTimer = document.getElementById('timer');
        if(displayTimer) displayTimer.innerText = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        
        const barraProgresso = document.getElementById('barra-progresso');
        if(barraProgresso) barraProgresso.style.width = ((total-tempo)/total)*100 + "%";

        if(tempo <= 0) {
            clearInterval(intervalo);
            moedas += 10;
            atualizarDisplay();
            alert("Parabéns Ane! +10 moedas.");
        }
    }, 1000);
}