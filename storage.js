// --- CENTRAL DE DADOS (STORAGE) ---

// 1. Definição do Objeto de Usuário Dinâmico
let user = {
    // Busca o nome salvo. Se for a primeiríssima vez e o Python não enviou nada, fica "Usuário"
    nome: localStorage.getItem('user_nome') || "Usuário", 
    moedas: parseInt(localStorage.getItem('moedas_ane')) || 0,
    energia: parseInt(localStorage.getItem('energia_ane')) || 100,
    nivel: parseInt(localStorage.getItem('nivel_ane')) || 1,
    xp: parseInt(localStorage.getItem('xp_ane')) || 0,
    
    saude: JSON.parse(localStorage.getItem('user_saude')) || {
        peso: 0,
        altura: 0,
        imc: 0,
        meta_agua: 2.0
    },
    
    loja: JSON.parse(localStorage.getItem('loja_ane')) || { 
        itensComprados: [], 
        itemEquipado: "padrao", 
        acessorioEquipado: "nenhum" 
    }
};

// --- SALVAR DADOS (O que mantém o nome personalizado gravado) ---
function salvarDados() {
    localStorage.setItem('user_nome', user.nome); // Grava o nome que veio do Python
    localStorage.setItem('moedas_ane', user.moedas);
    localStorage.setItem('energia_ane', user.energia);
    localStorage.setItem('nivel_ane', user.nivel);
    localStorage.setItem('xp_ane', user.xp);
    localStorage.setItem('user_saude', JSON.stringify(user.saude));
    localStorage.setItem('loja_ane', JSON.stringify(user.loja));
}
function verificarPrimeiroAcesso() {
    const nomeSalvo = localStorage.getItem('user_nome');
    
    // Se não houver nome, redireciona ou avisa que precisa do Python
    if (!nomeSalvo || nomeSalvo === "Usuário") {
        console.log("Primeiro acesso detetado. Aguardando dados do Python...");
        return true;
    }
    return false;
}

// 2. A FUNÇÃO CHAVE: Importar do Python (Cadastro Inicial)
function importarDadosPython(dados) {
    // Aqui a mágica acontece: o nome que o usuário digitou no Python vira a lei aqui.
    user.nome = dados.nome; 
    
    localStorage.setItem('user_nome', dados.nome);
    localStorage.setItem('user_saude', JSON.stringify({
        peso: dados.peso,
        altura: dados.altura,
        imc: dados.imc,
        meta_agua: dados.meta_agua
    }));
    
    user.moedas += dados.moedas_iniciais || 0;
    salvarDados();
    
    // Alerta personalizado com o NOVO nome
    alert(`Bem-vindo(a), ${user.nome}! Seu perfil foi criado com sucesso.`);
    location.reload(); 
}

// 3. Sincronização Contínua (Mantém o nome atualizado se mudar no servidor)
async function sincronizarComServidor() {
    try {
        const resposta = await fetch('http://127.0.0.1:5000/status');
        const dadosDoServidor = await resposta.json();
        
        // Se o nome no servidor for diferente do local, ele atualiza aqui
        if (dadosDoServidor.nome && dadosDoServidor.nome !== user.nome) {
            user.nome = dadosDoServidor.nome;
            localStorage.setItem('user_nome', user.nome);
        }

        user.moedas = dadosDoServidor.moedas;
        user.xp = dadosDoServidor.xp;
        user.energia = dadosDoServidor.energia;
        
        console.log(`Sincronizado: Perfil de ${user.nome} atualizado.`);
        
        if (typeof atualizarDisplay === "function") {
            atualizarDisplay();
        }
    } catch (erro) {
        console.warn("Servidor Python offline. Usando cache local.");
    }
}

// 4. Sistema de XP e Level Up (Agora usa o nome do usuário no alerta)
function ganharXP(quantidade) {
    user.xp += quantidade;
    const xpNecessario = user.nivel * 1000;

    if (user.xp >= xpNecessario) {
        user.nivel++;
        user.xp = 0; 
        // Aqui o alerta chama o nome que o usuário escolheu!
        alert(`🎉 Parabéns, ${user.nome}! Você subiu para o Nível ${user.nivel}!`);
    }
    salvarDados();
}

// --- Restante das funções (Tema, Moedas, Treino) ---
// (Mantidas exatamente como você criou, apenas removendo nomes fixos)

function toggleTema() {
    const body = document.body;
    body.classList.toggle('modo-candy');
    const novoTema = body.classList.contains('modo-candy') ? 'candy' : 'galaxia';
    localStorage.setItem('tema_preferido', novoTema);
    const btn = document.getElementById('btn-tema');
    if(btn) btn.innerText = novoTema === 'candy' ? "🌌 Modo Galáxia" : "🍭 Modo Candy";
}

function aplicarTemaSalvo() {
    const tema = localStorage.getItem('tema_preferido');
    if (tema === 'candy') {
        document.body.classList.add('modo-candy');
        const btn = document.getElementById('btn-tema');
        if(btn) btn.innerText = "🌌 Modo Galáxia";
    }
}

document.addEventListener('DOMContentLoaded', aplicarTemaSalvo);
// --- SINCRONIZAÇÃO AUTOMÁTICA ---

// Assim que o arquivo storage.js carregar, ele tenta buscar os dados do Python
async function sincronizacaoAutomatica() {
    console.log("Tentando sincronização automática com o Cérebro...");
    try {
        const resposta = await fetch('config_usuario.json');
        if (resposta.ok) {
            const dados = await resposta.json();
            
            // Só importa se o nome for diferente ou se for o primeiro acesso
            if (dados.nome && dados.nome !== localStorage.getItem('user_nome')) {
                console.log("Novo perfil detectado: " + dados.nome);
                importarDadosPython(dados);
            }
        }
    } catch (erro) {
        console.warn("Cérebro offline ou arquivo não gerado. Mantendo perfil local.");
    }
}

// Executa a busca assim que abrir o Santuário
sincronizacaoAutomatica();

function abrirConfiguracoes() {
    const confirmar = confirm("Deseja refazer o questionário? Isso limpará os dados atuais do navegador.");
    if (confirmar) {
        localStorage.clear();
        alert("Dados limpos! Rode o app.py e recarregue a página.");
        location.reload();
    }
}
// No topo do storage.js
