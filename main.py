import json
import os
import config # Garante que tens o config.py na mesma pasta

def carregar_ou_configurar_usuario():
    arquivo = 'config_usuario.json'
    
    # 1. Tenta ler o ficheiro se ele já existir
    if os.path.exists(arquivo):
        with open(arquivo, 'r', encoding='utf-8') as f:
            dados = json.load(f)
            # Atualiza o objeto global no config.py
            config.usuario['nome'] = dados['nome']
            config.usuario['peso'] = dados['peso']
            config.usuario['altura'] = dados['altura']
            config.usuario['meta_agua'] = dados['peso'] * 35
            return False # Não é a primeira vez
    else:
        # 2. Se não existir, é o primeiro acesso: Pergunta e Salva
        print("--- 🌟 BEM-VINDA AO SANTUÁRIO MAX (CONFIGURAÇÃO INICIAL) ---")
        nome = input("Como queres ser chamada? ")
        peso = float(input("Teu peso atual (kg): "))
        altura = float(input("Tua altura (ex: 1.65): "))
        
        # Estrutura para salvar
        dados_usuario = {
            "nome": nome,
            "peso": peso,
            "altura": altura
        }
        
        with open(arquivo, 'w', encoding='utf-8') as f:
            json.dump(dados_usuario, f, indent=4)
            
        # Atualiza o config.py para a sessão atual
        config.usuario.update(dados_usuario)
        config.usuario['meta_agua'] = peso * 35
        
        print(f"\n✅ Prazer, {nome}! Os teus dados foram guardados para sempre.")
        return True # É a primeira vez

# Inicialização
is_primeiro_acesso = carregar_ou_configurar_usuario()

# --- MENU PRINCIPAL ---
while True:
    print(f"\n{config.saudar_usuario()}")
    print("1 - Ver Status de Saúde (IMC/Água)")
    print("2 - Ajustar Dados (Peso/Altura)")
    print("0 - Sair")
    
    opcao = input("\nO que pretendes fazer? ")
    
    if opcao == "1":
        # Cálculo de saúde direto para evitar erro de ficheiro em falta
        peso = config.usuario['peso']
        altura = config.usuario['altura']
        imc = peso / (altura ** 2)
        meta_agua = config.usuario['meta_agua']
        
        print("\n--- 📊 TEU RELATÓRIO ---")
        print(f"Nome: {config.usuario['nome']}")
        print(f"IMC: {imc:.2f}")
        print(f"Meta de Água: {meta_agua/1000:.2f}L por dia")
        
        if imc < 18.5: print("Status: Abaixo do peso")
        elif imc < 25: print("Status: Peso Ideal")
        else: print("Status: Acima do peso")

    elif opcao == "2":
        # Permite alterar se o usuário quiser
        print("\n--- ATUALIZAR DADOS ---")
        config.usuario['peso'] = float(input("Novo peso (kg): "))
        config.usuario['altura'] = float(input("Nova altura (m): "))
        config.usuario['meta_agua'] = config.usuario['peso'] * 35
        
        # Salva a alteração no ficheiro
        with open('config_usuario.json', 'w', encoding='utf-8') as f:
            json.dump(config.usuario, f, indent=4)
        print("Dados atualizados!")

    elif opcao == "0":
        print(f"\nSantuário Max a encerrar... Até logo, {config.usuario['nome']}!")
        break
    else:
        print("\nOpção inválida!")