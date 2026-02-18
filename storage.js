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