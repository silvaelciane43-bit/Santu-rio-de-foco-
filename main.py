import json
import os
import config  # Importa o teu config.py atualizado
import time

def limpar_tela():
    os.system('cls' if os.name == 'nt' else 'clear')

def salvar_no_arquivo():
    """Guarda tudo o que foi alterado no JSON para não perder nada."""
    with open('config_usuario.json', 'w', encoding='utf-8') as f:
        json.dump(config.usuario, f, indent=4, ensure_ascii=False)

def carregar_ou_configurar_usuario():
    arquivo = 'config_usuario.json'
    if os.path.exists(arquivo):
        with open(arquivo, 'r', encoding='utf-8') as f:
            dados = json.load(f)
            config.usuario.update(dados)
            # Garante que a gaveta de lembretes existe
            if 'lembretes' not in config.usuario:
                config.usuario['lembretes'] = []
                return False
            else:
                limpar_tela()
                print("--- 🌟 BEM-VINDA(O) AO SANTUÁRIO MAX ---")
                nome = input("✨ Como queres ser chamada(o)? ").strip().title()

                genero = ""
                while genero not in ["M", "F"]:
                    genero = input(f"✨ {nome}, tu és Homem (M) ou Mulher (F)? ").strip().upper()

                    peso = float(input("✨ Teu peso atual (kg): ").replace(',', '.'))
                    altura = float(input("✨ Tua altura (ex: 1.65): ").replace(',', '.'))

                    config.usuario.update({
                        "nome": nome, "genero": genero, "peso": peso,
                        "altura": altura, "lembretes": []
                    })
                    salvar_no_arquivo()
                    return True

def abrir_sino():
    """A 'gaveta' onde o usuário vê e mexe nos lembretes."""
    while True:
        limpar_tela()
        print("🔔 --- DENTRO DO TEU SINO --- 🔔")
        lembretes = config.usuario.get('lembretes', [])

        if not lembretes:
            print("\nO teu sino está silencioso. Queres guardar algo aqui? 🌱")
        else:
            print(f"Tens {len(lembretes)} lembrete(s) guardado(s):")
            for i, texto in enumerate(lembretes, 1):
                print(f" {i} ➞ {texto}")

                print("\n" + "-"*30)
                print("1 ➞ Adicionar novo lembrete")
                print("2 ➞ Apagar um lembrete")
                print("0 ➞ Fechar o Sino")

                op = input("\nO que pretendes fazer? ")

                if op == "1":
                    novo = input("\nEscreve o que o Sino deve guardar: ")
                    config.usuario['lembretes'].append(novo)
                    salvar_no_arquivo()
                    print("✅ Guardado com sucesso!")
                    time.sleep(1)
                elif op == "2" and lembretes:
                    try:
                        idx = int(input("\nQual o número do lembrete para apagar? ")) - 1
                        if 0 <= idx < len(lembretes):
                            removido = config.usuario['lembretes'].pop(idx)
                            salvar_no_arquivo()
                            print(f"🗑️ '{removido}' foi removido!")
                        else:
                            print("Número inválido.")
                    except ValueError:
                        print("Por favor, digita o número.")
                        time.sleep(1)
                elif op == "0":
                    break

                # --- INÍCIO DO PROGRAMA ---
                carregar_ou_configurar_usuario()

                while True:
                    limpar_tela()
                    # Pega o gênero para a saudação humana
                    artigo = "o" if config.usuario.get('genero') == "M" else "a"
                    total_l = len(config.usuario.get('lembretes', []))

                    # Exibe a saudação amigável do config.py
                    print(config.saudar_usuario())

                    print(f"O que vamos fazer hoje, noss{artigo} favorit{artigo}?")
                    print("-" * 40)
                    print("1 ➞ 📊 Ver meu Status de Saúde")

                    # O SINO: Ele mostra apenas a quantidade, escondendo o texto
                    status_sino = f"({total_l})" if total_l > 0 else "(Vazio)"
                    print(f"2 ➞ 🔔 Sino de Lembretes {status_sino}")

                    print("3 ➞ ⚙️  Ajustar meus Dados")
                    print("0 ➞ 🚪 Sair do Santuário")
                    print("-" * 40)

                    opcao = input("\nEscolhe uma opção: ")

                    if opcao == "1":
                        limpar_tela()
                        p, alt = config.usuario['peso'], config.usuario['altura']
                        imc = p / (alt ** 2)
                        print(f"--- RELATÓRIO ---\nIMC: {imc:.1f}\nÁgua: {(p*35)/1000:.2f}L")
                        input("\n[ENTER para voltar]")
                    elif opcao == "2":
                        abrir_sino()
                    elif opcao == "3":
    print("\n--- ATUALIZAÇÃO ---")
    config.usuario['peso'] = float(input("Novo peso: ").replace(',', '.'))
    config.usuario['altura'] = float(input("Nova altura: ").replace(',', '.'))
    salvar_no_arquivo()
    print("Atualizado!")
    time.sleep(1)
                    elif opcao == "0":
                        print(f"\nAté logo, {config.usuario['nome']}! Vai com calma. 🌤️")
                        break