// --- CENTRAL DE DADOS (STORAGE) ---

// 1. Definição do Objeto de Usuário com valores vindos do LocalStorage ou Padrão
let user = {
    nome: "Ane",
    moedas: parseInt(localStorage.getItem('moedas_ane')) || 0,
    energia: parseInt(localStorage.getItem('energia_ane')) || 100,
    nivel: parseInt(localStorage.getItem('nivel_ane')) || 1,
    xp: parseInt(localStorage.getItem('xp_ane')) || 0,
    loja: JSON.parse(localStorage.getItem('loja_ane')) || { 
        itensComprados: [], 
        itemEquipado: "padrao", 
        acessorioEquipado: "nenhum" 
    }
};
// Função que troca o tema e salva no banco (localStorage)
function toggleTema() {
    const body = document.body;
    body.classList.toggle('modo-candy');
    
    const novoTema = body.classList.contains('modo-candy') ? 'candy' : 'galaxia';
    localStorage.setItem('tema_preferido', novoTema);
    
    // Atualiza o texto de todos os botões de tema que existirem na página
    const btn = document.getElementById('btn-tema');
    if(btn) {
        btn.innerText = novoTema === 'candy' ? "🌌 Modo Galáxia" : "🍭 Modo Candy";
    }
}

// Função que aplica o tema assim que a página abre
function aplicarTemaSalvo() {
    const tema = localStorage.getItem('tema_preferido');
    if (tema === 'candy') {
        document.body.classList.add('modo-candy');
        const btn = document.getElementById('btn-tema');
        if(btn) btn.innerText = "🌌 Modo Galáxia";
    }
}

// Executa automaticamente em qualquer página que tenha o storage.js
document.addEventListener('DOMContentLoaded', aplicarTemaSalvo);
// 2. Função Global para Salvar todos os dados de uma vez
function salvarDados() {
    localStorage.setItem('moedas_ane', user.moedas);
    localStorage.setItem('energia_ane', user.energia);
    localStorage.setItem('nivel_ane', user.nivel);
    localStorage.setItem('xp_ane', user.xp);
    localStorage.setItem('loja_ane', JSON.stringify(user.loja));
}

// 3. Sistema de Ganho de XP e Level Up
function ganharXP(quantidade) {
    user.xp += quantidade;
    const xpNecessario = user.nivel * 1000;

    if (user.xp >= xpNecessario) {
        user.nivel++;
        user.xp = 0; // Reset ao subir de nível
        alert(`🎉 Parabéns Ane! Você subiu para o Nível ${user.nivel}!`);
    }
    salvarDados();
}

// 4. Sistema de Gastar/Ganhar Moedas
function alterarMoedas(quantidade) {
    if (user.moedas + quantidade < 0) {
        return false; // Saldo insuficiente
    }
    user.moedas += quantidade;
    salvarDados();
    return true;
}