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
    if (localStorage.getItem('timer_fim_ane')) {
        const missaoSalva = localStorage.getItem('missao_atual_ane');
        document.getElementById('missao-nome').value = missaoSalva;
        gerenciarTimer();
    }
};

function inicializarGrafico() {
    const ctx = document.getElementById('graficoRodaVida').getContext('2d');
    
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
    
    // Atualiza o gráfico em tempo real
    graficoRoda.data.datasets[0].data = Object.values(dadosRoda);
    graficoRoda.update();
}

// --- SISTEMA DE TIMER (HIERFOCO) ---
let tempoRestante;
let timerId;

function iniciarFoco() {
    const minInput = document.getElementById('minutos');
    const missaoInput = document.getElementById('missao-nome');
    const btn = document.getElementById('btn-foco');

    // Se já estiver rodando e clicar de novo, ele cancela
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

    // Salva o momento exato do fim e a missão
    localStorage.setItem('timer_fim_ane', tempoTermino);
    localStorage.setItem('missao_atual_ane', missaoInput.value || "Missão Secreta");

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
            display.innerText = "00:00";
            btn.innerText = "Iniciar Hiperfoco";
            btn.style.background = "#f1c40f";
            finalizarFoco(missao);
        } else {
            const m = Math.floor((restante % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((restante % (1000 * 60)) / 1000);
            display.innerText = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            btn.innerText = "Parar Foco";
            btn.style.background = "#e74c3c";
            
            // Atualiza a barra de progresso se ela existir
            const barra = document.getElementById('barra-progresso');
            if(barra) {
                // Cálculo de porcentagem (opcional)
                // barra.style.width = ... 
            }
        }
    }, 1000);
}

function exibirTempo() {
    const m = Math.floor(tempoRestante / 60);
    const s = tempoRestante % 60;
    document.getElementById('timer').innerText = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function finalizarFoco(missao) {
    alert("Missão Cumprida, Ane!");
    
    // Ganhar moedas (conecta com o seu sistema)
    let moedas = parseInt(localStorage.getItem('moedas_ane')) || 0;
    moedas += 20;
    localStorage.setItem('moedas_ane', moedas);

    // 2. Salvar no histórico de missões (para não sumir ao sair da página)
    const hoje = new Date().toLocaleDateString();
    const historico = JSON.parse(localStorage.getItem('historico_foco_ane')) || [];
    const novaConclusao = { 
        missao: missao, 
        data: hoje, 
        hora: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
    // SALVA PARA O CALENDÁRIO
    const diasConcluidos = JSON.parse(localStorage.getItem('dias_concluidos_ane')) || [];
    if (!diasConcluidos.includes(hoje)) {
        diasConcluidos.push(hoje);
        localStorage.setItem('dias_concluidos_ane', JSON.stringify(diasConcluidos));
    }
    };
// 3. Marcar presença para o Calendário
    // Salvamos uma lista de datas que tiveram missões concluídas
    const diasConcluidos = JSON.parse(localStorage.getItem('dias_concluidos_ane')) || [];
    if (!diasConcluidos.includes(hoje)) {
        diasConcluidos.push(hoje);
        localStorage.setItem('dias_concluidos_ane', JSON.stringify(diasConcluidos));
    }

    renderizarMissaoConcluida(novaConclusao);

    // Salvar no histórico
    const lista = document.getElementById('lista-historico-foco');
    const li = document.createElement('li');
    li.innerHTML = `✅ ${missao} <span style="font-size:10px; opacity:0.7;">(+20 moedas)</span>`;
    lista.prepend(li); // Adiciona no topo

    // Função para mostrar na tela (usada ao concluir e ao carregar a página)
function renderizarMissaoConcluida(item) {
    const lista = document.getElementById('lista-historico-foco');
    if (!lista) return;
    const li = document.createElement('li');
    li.style.padding = "5px 0";
    li.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
    li.innerHTML = `✅ <b>${item.missao}</b> <small>(${item.hora})</small>`;
    lista.prepend(li);
}

    // Resetar botão
    document.getElementById('btn-foco').innerText = "Iniciar Hiperfoco";
    document.getElementById('btn-foco').style.background = "#f1c40f";


// --- SISTEMA DE METAS (ADICIONADO PARA O FOCO.HTML) ---
function adicionarMeta() {
    const input = document.getElementById('nova-meta');
    const prioridade = document.getElementById('prio-meta'); // Pega a prioridade do select
    
    if(!input || !input.value) return;

    const textoMeta = input.value;
    const nivelPrio = prioridade ? prioridade.value : 'comum';

    // Criar o visual na lista
    criarElementoLista(textoMeta, nivelPrio);

    // SALVAR NA MEMÓRIA (localStorage)
    const metasAtuais = JSON.parse(localStorage.getItem('metas_ane')) || [];
    metasAtuais.push({ texto: textoMeta, prioridade: nivelPrio });
    localStorage.setItem('metas_ane', JSON.stringify(metasAtuais));

    input.value = "";
}

function criarElementoLista(texto, prio) {
    const lista = document.getElementById('lista-metas');
    if(!lista) return;

    const li = document.createElement('li');
    li.style.marginBottom = "8px";
    li.style.padding = "10px";
    li.style.borderRadius = "8px";
    li.style.background = "rgba(255,255,255,0.05)";
    
    // Define o emoji baseado na prioridade
    let emoji = "✨";
    if(prio === "imediata") emoji = "⚡";
    if(prio === "prioridade") emoji = "🔥";

    li.innerHTML = `
        ${emoji} ${texto} 
        <button onclick="removerMeta('${texto}', this)" style="float:right; background:none; border:none; color:#ff4d4d; cursor:pointer; font-weight:bold;">✕</button>
    `;
    lista.appendChild(li);
}

function removerMeta(texto, botao) {
    botao.parentElement.remove();
    let metasAtuais = JSON.parse(localStorage.getItem('metas_ane')) || [];
    // Filtra para remover o objeto que tem o mesmo texto
    metasAtuais = metasAtuais.filter(m => (m.texto || m) !== texto);
    localStorage.setItem('metas_ane', JSON.stringify(metasAtuais));
}

// Adicione isso dentro da sua função window.onload do foco.js para carregar as metas ao abrir a página
function carregarMetasFoco() {
    const metasSalvas = JSON.parse(localStorage.getItem('metas_ane')) || [];
    metasSalvas.forEach(meta => {
        // Lida tanto com metas antigas (string) quanto novas (objeto)
        const texto = meta.texto || meta;
        const prio = meta.prioridade || 'comum';
        criarElementoLista(texto, prio);
    });
}
function carregarHistoricoFoco() {
    // Busca tudo que já foi feito na história do app
    const historico = JSON.parse(localStorage.getItem('historico_foco_ane')) || [];
    const hoje = new Date().toLocaleDateString();
    
    // Limpa a lista antes de carregar (evita duplicar itens ao navegar)
    const listaUI = document.getElementById('lista-historico-foco');
    if(listaUI) listaUI.innerHTML = "";

    // Filtra apenas as missões que foram feitas HOJE
    const missoesDeHoje = historico.filter(item => item.data === hoje);
    
    // Manda cada uma delas para a tela
    missoesDeHoje.forEach(item => renderizarMissaoConcluida(item));
}