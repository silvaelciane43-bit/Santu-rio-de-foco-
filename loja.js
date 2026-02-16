const ITENS = [
    { id: 'armadura_bronze', nome: 'Peitoral de Bronze', preco: 500, img: 'armadura_bronze.png', nivelMin: 1 },
    { id: 'oculos_foco', nome: 'Óculos de Foco', preco: 30, img: 'oculos_foco.png', nivelMin: 1 },
    { id: 'espada_luz', nome: 'Espada de Luz', preco: 1200, img: 'espada_luz.png', nivelMin: 2 }, // Exemplo de item para Nível 2
];

window.onload = () => {
    // Inicialização básica caso o objeto não exista
    if (!user.loja) {
        user.loja = { itensComprados: [], itemEquipado: "padrao", acessorioEquipado: "nenhum" };
    }
    if (user.xp === undefined) user.xp = 0;
    if (user.nivel === undefined) user.nivel = 1;

    atualizarInterface();
    renderizarItensLoja();
};

function atualizarInterface() {
    // Atualiza Moedas
    document.getElementById('saldo-moedas').innerText = user.moedas;
    
    // Atualiza Nível e Barra de XP
    const nivelElemento = document.getElementById('nivel-usuario');
    const barraXp = document.getElementById('barra-xp');
    const xpTexto = document.getElementById('xp-atual');
    const xpProx = document.getElementById('xp-proximo');

    const xpNecessario = user.nivel * 1000;
    const porcentagem = (user.xp / xpNecessario) * 100;

    nivelElemento.innerText = user.nivel;
    xpTexto.innerText = user.xp;
    xpProx.innerText = xpNecessario;
    barraXp.style.width = porcentagem + "%";
}

function renderizarItensLoja() {
    const container = document.getElementById('lista-loja');
    if (!container) return;
    container.innerHTML = "";

    ITENS.forEach(item => {
        const jaComprou = user.loja.itensComprados.includes(item.id);
        const nivelBloqueado = user.nivel < item.nivelMin;
        
        container.innerHTML += `
            <div class="item-loja card-glass ${nivelBloqueado ? 'item-bloqueado' : ''}">
                <img src="${item.img}" style="width: 80px; margin-bottom: 10px;" 
                     onerror="this.src='https://cdn-icons-png.flaticon.com/512/679/679821.png'">
                <h4>${item.nome}</h4>
                <p class="preco-tag">💰 ${item.preco}</p>
                <button onclick="comprarItem('${item.id}')" 
                        ${(jaComprou || nivelBloqueado) ? 'disabled' : ''} 
                        class="btn-comprar">
                    ${nivelBloqueado ? `Nível ${item.nivelMin} 🔒` : (jaComprou ? 'Adquirido' : 'Comprar')}
                </button>
            </div>
        `;
    });
}

function comprarItem(id) {
    const item = ITENS.find(i => i.id === id);
    const alerta = document.getElementById('alerta-loja');

    // 1. Verificação de Saldo
    if (user.moedas >= item.preco) {
        user.moedas -= item.preco;
        user.loja.itensComprados.push(id);
        
        // Equipa automaticamente conforme o tipo
        if (id.includes('armadura')) user.loja.itemEquipado = id;
        if (id.includes('oculos')) user.loja.acessorioEquipado = id;
        
        alerta.style.color = "#00ff88";
        alerta.innerText = `Excelente escolha, Lua! O ${item.nome} já está com o gatinho!`;
        
        salvar();
        atualizarInterface();
        renderizarItensLoja();
    } else {
        // 2. Sistema de Saldo Insuficiente (Sua Missão!)
        const faltam = item.preco - user.moedas;
        alerta.style.color = "#ff4444";
        alerta.innerText = `Puxa, Lua! Faltam 💰 ${faltam} moedas para o ${item.nome}. Foque um pouco mais para conquistar! 💪`;
    }
}