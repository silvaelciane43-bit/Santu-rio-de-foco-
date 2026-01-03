let moedas = parseInt(localStorage.getItem('moedas_ane')) || 0;
let animais = JSON.parse(localStorage.getItem('animais_ane')) || [];
let intervalo;

const precos = { 'guia-onca': 500, 'guia-escorpiao': 1000, 'guia-gato': 1500, 'guia-cabra': 2000, 'guia-calopsita': 2500 };

window.onload = () => {
    atualizarDisplay();
    gerarCalendario();
    animais.forEach(id => document.getElementById(id)?.classList.add('desbloqueado'));
};

function atualizarDisplay() {
    document.getElementById('moedas-contagem').innerText = moedas;
    localStorage.setItem('moedas_ane', moedas);
}

function mudarAmbiente(tipo) {
    // Remove as classes antigas
    document.body.classList.remove('modo-mata', 'modo-galaxia');
    
    // Adiciona a nova classe (garantindo o prefixo modo-)
    if(tipo === 'galaxia') {
        document.body.classList.add('modo-galaxia');
    } else if(tipo === 'mata') {
        document.body.classList.add('modo-mata');
    }
}

function mudarTema(tema) {
    document.body.classList.remove('modo-lua', 'modo-sol');
    document.body.classList.add('modo-' + tema);
}

function ativarHiperfoco() {
    const min = document.getElementById('minutos').value;
    if(!min) return alert("Ane, coloque o tempo!");
    let tempo = min * 60;
    let total = tempo;
    
    clearInterval(intervalo);
    intervalo = setInterval(() => {
        tempo--;
        let m = Math.floor(tempo / 60);
        let s = tempo % 60;
        document.getElementById('timer').innerText = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        document.getElementById('barra-progresso').style.width = ((total-tempo)/total)*100 + "%";

        if(tempo <= 0) {
            clearInterval(intervalo);
            moedas += 10;
            atualizarDisplay();
            falar("Parabéns Ane! Missão cumprida. Dez moedas para você.");
            confetti();
        }
    }, 1000);
}

function falar(texto) {
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-BR';
    window.speechSynthesis.speak(msg);
}

function validarFoto() {
    moedas += 50;
    atualizarDisplay();
    confetti();
    alert("Prova Real validada! +50 moedas.");
}

document.querySelectorAll('.animal-wrapper').forEach(item => {
    item.onclick = () => {
        if(animais.includes(item.id)) return;
        if(moedas >= precos[item.id]) {
            moedas -= precos[item.id];
            animais.push(item.id);
            localStorage.setItem('animais_ane', JSON.stringify(animais));
            item.classList.add('desbloqueado');
            atualizarDisplay();
            confetti();
        } else {
            alert(`Faltam ${precos[item.id] - moedas} moedas!`);
        }
    };
});

function gerarCalendario() {
    const cal = document.getElementById('calendario');
    for(let i=1; i<=31; i++) {
        let d = document.createElement('div');
        d.className = 'dia'; d.innerText = i;
        cal.appendChild(d);
    }
}

function adicionarMeta() {
    const val = document.getElementById('nova-meta').value;
    if(!val) return;
    const li = document.createElement('li');
    li.innerText = "✨ " + val;
    document.getElementById('lista-metas').appendChild(li);
    document.getElementById('nova-meta').value = "";
}

// 1. Modifique a função de carregar (window.onload) para incluir as missões
window.onload = () => {
    atualizarDisplay();
    gerarCalendario();
    animais.forEach(id => document.getElementById(id)?.classList.add('desbloqueado'));
    
    // CARREGAR MISSÕES DA MEMÓRIA
    const metasSalvas = JSON.parse(localStorage.getItem('metas_ane')) || [];
    metasSalvas.forEach(meta => criarElementoLista(meta));
};

// 2. Modifique a função de adicionar meta para salvar na memória
function adicionarMeta() {
    const input = document.getElementById('nova-meta');
    const val = input.value;
    if(!val) return;

    // Criar o visual
    criarElementoLista(val);

    // SALVAR NA MEMÓRIA
    const metasAtuais = JSON.parse(localStorage.getItem('metas_ane')) || [];
    metasAtuais.push(val);
    localStorage.setItem('metas_ane', JSON.stringify(metasAtuais));

    input.value = "";
}

// 3. Função auxiliar para criar o item na tela (evita repetição de código)
function criarElementoLista(texto) {
    const li = document.createElement('li');
    li.innerHTML = `✨ ${texto} <button onclick="removerMeta('${texto}', this)" style="float:right; background:none; border:none; color:red; cursor:pointer;">✕</button>`;
    document.getElementById('lista-metas').appendChild(li);
}

// 4. Nova função para REMOVER da memória (essencial para a memória não ficar "suja")
function removerMeta(texto, botao) {
    // Remove do visual
    botao.parentElement.remove();

    // Remove do localStorage
    let metasAtuais = JSON.parse(localStorage.getItem('metas_ane')) || [];
    metasAtuais = metasAtuais.filter(m => m !== texto);
    localStorage.setItem('metas_ane', JSON.stringify(metasAtuais));
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Santuário pronto para instalação!"))
    .catch(err => console.log("Erro no registro:", err));
}