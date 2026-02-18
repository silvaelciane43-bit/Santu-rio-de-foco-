// --- DADOS INICIAIS ---
let peso = parseFloat(localStorage.getItem('user_peso_ane')) || 0;
let aguaAtual = parseInt(localStorage.getItem('agua_hoje_ane')) || 0;
let dataUltimoAcesso = localStorage.getItem('data_nutri_ane');

// --- INICIALIZAÇÃO ---
window.onload = () => {
    // Verificar se mudou o dia para resetar a água
    const hoje = new Date().toLocaleDateString();
    if (dataUltimoAcesso !== hoje) {
        aguaAtual = 0;
        localStorage.setItem('agua_hoje_ane', 0);
        localStorage.setItem('data_nutri_ane', hoje);
        localStorage.setItem('nutri_lista_ane', JSON.stringify([]));
    }

    if (peso > 0) {
        document.getElementById('input-peso').value = peso;
        calcularMetaAgua();
    }
    
    atualizarInterfaceAgua();
    carregarListaNutri();
};

// --- HIDRATAÇÃO ---
function salvarPeso() {
    const inputPeso = document.getElementById('input-peso');
    peso = parseFloat(inputPeso.value);
    
    if (peso > 0) {
        localStorage.setItem('user_peso_ane', peso);
        calcularMetaAgua();
        alert("Peso salvo! Meta de hidratação atualizada.");
    }
}

function calcularMetaAgua() {
    // Cálculo padrão: 35ml por quilo
    const meta = Math.round(peso * 35);
    document.getElementById('agua-meta').innerText = meta;
    document.getElementById('meta-agua-texto').innerText = `Sua meta ideal é ${meta}ml por dia.`;
    atualizarInterfaceAgua();
}

function adicionarAgua(quantidade) {
    if (peso === 0) return alert("Defina seu peso primeiro!");
    
    aguaAtual += quantidade;
    localStorage.setItem('agua_hoje_ane', aguaAtual);
    atualizarInterfaceAgua();

    // Ganhar 1 moedinha por copo d'água (incentivo!)
    let moedas = parseInt(localStorage.getItem('moedas_ane')) || 0;
    moedas += 1;
    localStorage.setItem('moedas_ane', moedas);
}

function atualizarInterfaceAgua() {
    const meta = Math.round(peso * 35) || 2000;
    const porcentagem = Math.min((aguaAtual / meta) * 100, 100);
    
    document.getElementById('agua-atual').innerText = aguaAtual;
    document.getElementById('agua-meta').innerText = meta;
    document.getElementById('barra-agua-interna').style.width = porcentagem + "%";
}

// --- NUTRIÇÃO ---
function validarNutriente(tipo, pontos) {
    // 1. Adicionar na lista visual
    const lista = JSON.parse(localStorage.getItem('nutri_lista_ane')) || [];
    const item = { tipo, hora: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    lista.push(item);
    localStorage.setItem('nutri_lista_ane', JSON.stringify(lista));

    // 2. Afetar a ENERGIA do gatinho (conecta com a Home)
    let energia = parseInt(localStorage.getItem('energia_ane')) || 100;
    energia = Math.max(0, Math.min(100, energia + pontos));
    localStorage.setItem('energia_ane', energia);

    // 3. Dar moedas se for algo saudável
    if (pontos > 0) {
        let moedas = parseInt(localStorage.getItem('moedas_ane')) || 0;
        moedas += 5;
        localStorage.setItem('moedas_ane', moedas);
    }

    renderizarItemLista(item);
    alert(`${tipo} validado! Energia do avatar: ${energia}%`);
}

function carregarListaNutri() {
    const lista = JSON.parse(localStorage.getItem('nutri_lista_ane')) || [];
    document.getElementById('lista-nutricao').innerHTML = "";
    lista.forEach(item => renderizarItemLista(item));
}

function renderizarItemLista(item) {
    const listaUI = document.getElementById('lista-nutricao');
    const li = document.createElement('li');
    li.style.cssText = "list-style:none; margin-bottom:5px; font-size:13px; opacity:0.9;";
    li.innerHTML = `✅ <b>${item.tipo}</b> consumido às ${item.hora}`;
    listaUI.prepend(li);
}