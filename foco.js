// --- DADOS DA RODA DA VIDA ---
let dadosRoda = JSON.parse(localStorage.getItem('roda_vida_ane')) || {
    espiritualidade: 5, saude: 5, intelectual: 5, emocional: 5,
    realizacao: 5, recursos: 5, contribuicao: 5, familia: 5,
    amoroso: 5, social: 5, hobbies: 5, plenitude: 5
};

let graficoRoda;

// --- INICIALIZAÇÃO ---
window.onload = () => {
    inicializarGrafico();
    carregarMetasFoco();
    carregarHistoricoFoco();
    
    // Verifica se existe um timer rodando ao abrir/atualizar a página
    if (localStorage.getItem('timer_fim_ane')) {
        const missaoSalva = localStorage.getItem('missao_atual_ane');
        const inputMissao = document.getElementById('missao-nome');
        if (inputMissao) inputMissao.value = missaoSalva || "";
        gerenciarTimer();
    }
};

function inicializarGrafico() {
    const canvas = document.getElementById('graficoRodaVida');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    graficoRoda = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(dadosRoda).map(s => s.charAt(0).toUpperCase() + s.slice(1)),
            datasets: [{
                label: 'Meu Equilíbrio',
                data: Object.values(dadosRoda),
                backgroundColor: 'rgba(241, 196, 15, 0.2)',
                borderColor: '#f1c40f',
                pointBackgroundColor: '#f1c40f'
            }]
        },
        options: {
            scales: {
                r: { min: 0, max: 10, ticks: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function ajustarRoda(area, valor) {
    dadosRoda[area] = parseInt(valor);
    localStorage.setItem('roda_vida_ane', JSON.stringify(dadosRoda));
    
    if (graficoRoda) {
        graficoRoda.data.datasets[0].data = Object.values(dadosRoda);
        graficoRoda.update();
    }
}

// --- SISTEMA DE TIMER (HIPERFOCO) ---
let timerId;

function iniciarFoco() {
    const minInput = document.getElementById('minutos');
    const missaoInput = document.getElementById('missao-nome');
    const btn = document.getElementById('btn-foco');

    // Se já estiver rodando, o botão serve para CANCELAR
    if (localStorage.getItem('timer_fim_ane')) {
        clearInterval(timerId);
        localStorage.removeItem('timer_fim_ane');
        localStorage.removeItem('missao_atual_ane');
        btn.innerText = "Iniciar Hiperfoco";
        btn.style.background = "#f1c40f";
        document.getElementById('timer').innerText = "25:00";
        return;
    }

    const minutos = parseInt(minInput.value) || 25;
    const agora = new Date().getTime();
    const tempoTermino = agora + (minutos * 60 * 1000);

    // Salva com a tag _ane para o storage.js reconhecer
    localStorage.setItem('timer_fim_ane', tempoTermino);
    localStorage.setItem('missao_atual_ane', missaoInput.value || "Foco Total");

    gerenciarTimer();
}

function gerenciarTimer() {
    const btn = document.getElementById('btn-foco');
    const display = document.getElementById('timer');
    
    if (timerId) clearInterval(timerId);

    timerId = setInterval(() => {
        const agora = new Date().getTime();
        const fim = parseInt(localStorage.getItem('timer_fim_ane'));
        const missao = localStorage.getItem('missao_atual_ane');

        if (!fim) {
            clearInterval(timerId);
            return;
        }

        const restante = fim - agora;

        if (restante <= 0) {
            clearInterval(timerId);
            localStorage.removeItem('timer_fim_ane');
            localStorage.removeItem('missao_atual_ane');
            display.innerText = "00:00";
            finalizarFoco(missao);
        } else {
            const m = Math.floor((restante % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((restante % (1000 * 60)) / 1000);
            display.innerText = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            if (btn) {
                btn.innerText = "Parar Foco";
                btn.style.background = "#e74c3c";
            }
        }
    }, 1000);
}

function finalizarFoco(missao) {
    alert(`Missão Cumprida, ${user.nome}! Você ganhou 💰 20 moedas e 50 XP!`);
    
    // Atualiza dados usando o objeto global 'user' do storage.js
    user.moedas += 20;
    
    // Chama a função de XP do storage.js para ganhar experiência
    if (typeof ganharXP === "function") {
        ganharXP(50);
    }

    const hoje = new Date().toLocaleDateString();
    const agoraHora = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const historico = JSON.parse(localStorage.getItem('historico_foco_ane')) || [];
    const novaConclusao = { missao: missao, data: hoje, hora: agoraHora };
    
    historico.push(novaConclusao);
    localStorage.setItem('historico_foco_ane', JSON.stringify(historico));

    // Marcar no calendário (sincronizado com a Home)
    let diasMarcados = JSON.parse(localStorage.getItem('diasMarcados_ane')) || [];
    const diaAtual = new Date().getDate();
    if (!diasMarcados.includes(diaAtual)) {
        diasMarcados.push(diaAtual);
        localStorage.setItem('diasMarcados_ane', JSON.stringify(diasMarcados));
    }

    renderizarMissaoConcluida(novaConclusao);
    salvarDados(); // Função do storage.js

    // Resetar UI
    const btn = document.getElementById('btn-foco');
    if (btn) {
        btn.innerText = "Iniciar Hiperfoco";
        btn.style.background = "#f1c40f";
    }
}

// --- SISTEMA DE METAS ---
function adicionarMeta() {
    const input = document.getElementById('nova-meta');
    const prioridade = document.getElementById('prio-meta'); 
    
    if(!input || !input.value) return;

    const textoMeta = input.value;
    const nivelPrio = prioridade ? prioridade.value : 'comum';

    criarElementoLista(textoMeta, nivelPrio);

    const metasAtuais = JSON.parse(localStorage.getItem('metas_ane')) || [];
    metasAtuais.push({ texto: textoMeta, prioridade: nivelPrio });
    localStorage.setItem('metas_ane', JSON.stringify(metasAtuais));

    input.value = "";
}

function criarElementoLista(texto, prio) {
    const lista = document.getElementById('lista-metas');
    if(!lista) return;

    const li = document.createElement('li');
    li.className = "item-meta";
    
    let emoji = "✨";
    if(prio === "imediata") emoji = "⚡";
    if(prio === "prioridade") emoji = "🔥";

    li.innerHTML = `
        <span>${emoji} ${texto}</span>
        <button onclick="removerMeta('${texto}', this)" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-weight:bold;">✕</button>
    `;
    lista.appendChild(li);
}

function removerMeta(texto, botao) {
    botao.parentElement.remove();
    let metasAtuais = JSON.parse(localStorage.getItem('metas_ane')) || [];
    metasAtuais = metasAtuais.filter(m => (m.texto || m) !== texto);
    localStorage.setItem('metas_ane', JSON.stringify(metasAtuais));
}

function carregarMetasFoco() {
    const metasSalvas = JSON.parse(localStorage.getItem('metas_ane')) || [];
    const lista = document.getElementById('lista-metas');
    if(lista) lista.innerHTML = "";
    metasSalvas.forEach(meta => {
        const texto = meta.texto || meta;
        const prio = meta.prioridade || 'comum';
        criarElementoLista(texto, prio);
    });
}

function carregarHistoricoFoco() {
    const historico = JSON.parse(localStorage.getItem('historico_foco_ane')) || [];
    const hoje = new Date().toLocaleDateString();
    const listaUI = document.getElementById('lista-historico-foco');
    if(listaUI) {
        listaUI.innerHTML = "";
        const missoesDeHoje = historico.filter(item => item.data === hoje);
        missoesDeHoje.forEach(item => renderizarMissaoConcluida(item));
    }
}

function renderizarMissaoConcluida(item) {
    const lista = document.getElementById('lista-historico-foco');
    if (!lista) return;
    const li = document.createElement('li');
    li.innerHTML = `✅ <b>${item.missao}</b> <small> às ${item.hora}</small>`;
    lista.prepend(li);
}