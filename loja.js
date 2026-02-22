// --- CONFIGURAÇÃO DA LOJA ---
const ITENS = [
    { id: 'armadura_bronze', nome: 'Peitoral de Bronze', preco: 500, img: 'armadura_bronze.png', nivelMin: 1 },
    { id: 'oculos_foco', nome: 'Óculos de Foco', preco: 30, img: 'oculos_foco.png', nivelMin: 1 },
    { id: 'espada_luz', nome: 'Espada de Luz', preco: 1200, img: 'espada_luz.png', nivelMin: 2 },
];

// REMOVIDO: A declaração "let user = {...}" foi removida daqui 
// pois agora ela vem do storage.js automaticamente.

window.onload = () => {
    // Inicialização usando as funções do storage.js e da loja
    atualizarInterfaceLoja();
    renderizarItensLoja();
};

function atualizarInterfaceLoja() {
    // Atualiza Moedas (usa o saldo do objeto user global)
    const saldoMoedas = document.getElementById('saldo-moedas');
    if (saldoMoedas) saldoMoedas.innerText = user.moedas;
    
    // Atualiza Nível e Barra de XP
    const nivelElemento = document.getElementById('nivel-usuario');
    const barraXp = document.getElementById('barra-xp');
    const xpTexto = document.getElementById('xp-atual');
    const xpProx = document.getElementById('xp-proximo');

    const xpNecessario = user.nivel * 1000;
    const porcentagem = (user.xp / xpNecessario) * 100;

    if (nivelElemento) nivelElemento.innerText = user.nivel;
    if (xpTexto) xpTexto.innerText = user.xp;
    if (xpProx) xpProx.innerText = xpNecessario;
    if (barraXp) barraXp.style.width = porcentagem + "%";
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

    // 1. Verificação usando a função global de moedas do storage.js
    if (user.moedas >= item.preco) {
        user.moedas -= item.preco;
        user.loja.itensComprados.push(id);
        
        // Equipa automaticamente conforme o tipo
        if (id.includes('armadura')) user.loja.itemEquipado = id;
        if (id.includes('oculos')) user.loja.acessorioEquipado = id;
        
        if (alerta) {
            alerta.style.color = "#00ff88";
            alerta.innerText = `Excelente escolha, ${user.nome}! O ${item.nome} já está equipado!`;
        }
        
        salvarDados(); // Função do storage.js
        atualizarInterfaceLoja();
        renderizarItensLoja();
    } else {
        const faltam = item.preco - user.moedas;
        if (alerta) {
            alerta.style.color = "#ff4444";
            alerta.innerText = `Puxa, ${user.nome}! Faltam 💰 ${faltam} moedas para o ${item.nome}. Foque um pouco mais para conquistar! 💪`;
        }
    }
}