// --- CENTRAL DE DADOS (STORAGE) ---
// --- CENTRAL DE DADOS (STORAGE) ---

// 1. Definição do Objeto de Usuário com Inteligência de Perfil
let user = {
    nome: localStorage.getItem('user_nome') || "Ane",
    moedas: parseInt(localStorage.getItem('moedas_ane')) || 0,
    energia: parseInt(localStorage.getItem('energia_ane')) || 100,
    nivel: parseInt(localStorage.getItem('nivel_ane')) || 1,
    xp: parseInt(localStorage.getItem('xp_ane')) || 0,
    
    // Dados que vieram do app.py (Questionário)
    saude: JSON.parse(localStorage.getItem('user_saude')) || {
        peso: 0,
        altura: 0,
        imc: 0,
        meta_agua: 2.0 // Padrão
    },
    
    loja: JSON.parse(localStorage.getItem('loja_ane')) || { 
        itensComprados: [], 
        itemEquipado: "padrao", 
        acessorioEquipado: "nenhum" 
    }
};

// Função para atualizar o perfil após o questionário Python
function importarDadosPython(dados) {
    localStorage.setItem('user_nome', dados.nome);
    localStorage.setItem('user_saude', JSON.stringify({
        peso: dados.peso,
        altura: dados.altura,
        imc: dados.imc,
        meta_agua: dados.meta_agua
    }));
    // Dá o bónus de moedas do app.py
    user.moedas += dados.moedas_iniciais || 0;
    salvarDados();
    location.reload(); // Recarrega para aplicar o nome
}
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

// Adicione isso ao seu storage.js
function sincronizarSono(dadosSono) {
    // Atualiza a energia baseada no que o Python calculou
    user.energia = dadosSono.energia_final;
    
    // Ganha o XP de bônus
    ganharXP(dadosSono.xp_ganho);
    
    // Salva tudo no LocalStorage
    salvarDados();
    
    // Atualiza a barra visualmente
    const fill = document.getElementById('energia-fill');
    if(fill) fill.style.width = user.energia + "%";
    
    console.log("Energia Vital Sincronizada!");
}
function sincronizarTreino(dadosTreino) {
    // 1. Adiciona as moedas ganhas
    alterarMoedas(dadosTreino.moedas);
    
    // 2. Adiciona o XP
    ganharXP(dadosTreino.xp);
    
    // 3. Reduz a energia (porque o treino cansa)
    user.energia -= dadosTreino.energia_reducao;
    if (user.energia < 0) user.energia = 0;
    
    // 4. Salva e atualiza a tela
    salvarDados();
    alert(`Treino Sincronizado! +${dadosTreino.moedas} moedas na conta!`);
    location.reload(); 
}

async function sincronizarDadosPython() {
    try {
        // Ele tenta ler o arquivo que o treino.py criou
        const resposta = await fetch('dados_treino.json');
        
        if (!resposta.ok) {
            alert("Nenhum treino novo encontrado no Cérebro!");
            return;
        }

        const dadosTreino = await resposta.json();

        // Verifica se esse treino já foi processado para não ganhar moedas infinitas
        const ultimoTreinoID = localStorage.getItem('ultimo_treino_id');
        const treinoAtualID = dadosTreino.data_registro + dadosTreino.minutos; // Cria um ID único

        if (ultimoTreinoID === treinoAtualID) {
            alert("Você já recebeu as moedas desse treino, Ane!");
        } else {
            // Executa as recompensas!
            alterarMoedas(dadosTreino.moedas);
            ganharXP(dadosTreino.xp);
            
            // Marca esse treino como "já lido"
            localStorage.setItem('ultimo_treino_id', treinoAtualID);
            
            alert(`Sucesso! O site leu o seu treino de ${dadosTreino.minutos}min. Moedas adicionadas! 💰`);
            location.reload(); 
        }
    } catch (erro) {
        console.log("Aguardando novo arquivo de treino...");
        alert("Erro ao ler o Cérebro. Certifique-se de que rodou o treino.py primeiro!");
    }
}