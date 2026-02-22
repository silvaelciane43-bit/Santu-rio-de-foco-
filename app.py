import json
import os

def configurar_santuario():
    print("\n" + "="*40)
    print("🌟 BEM-VINDA AO SEU SANTUÁRIO MAX 🌟")
    print("      (Configuração de Primeiro Acesso)")
    print("="*40 + "\n")

    # --- COLETA DE DADOS (QUESTIONÁRIO) ---
    nome = input("Como devo chamar-te, Ane? ")
    idade = int(input(f"Prazer, {nome}! Qual a tua idade? "))
    peso = float(input("Qual o teu peso atual em kg? (ex: 65.5): "))
    altura = float(input("Qual a tua altura em metros? (ex: 1.60): "))
    
    print("\nNível de Atividade Diária:")
    print("1 - Muito Pouco (Sedentário)")
    print("2 - Pouco (Leve)")
    print("3 - Moderado (Ativo)")
    print("4 - Intenso (Atleta)")
    nivel = int(input("Escolhe uma opção (1-4): "))

    # --- PROCESSAMENTO INTELIGENTE ---
    
    # 1. IMC
    imc = peso / (altura ** 2)
    
    # 2. ÁGUA (Regra dos 35ml por kg)
    meta_agua_litros = (peso * 35) / 1000
    
    # 3. CALORIAS (Taxa Metabólica Basal Estimada)
    fatores = {1: 30, 2: 35, 3: 40, 4: 45}
    calorias_diarias = peso * fatores.get(nivel, 30)

    # --- CRIAÇÃO DO PERFIL (CÉREBRO) ---
    perfil_usuario = {
        "nome": nome,
        "idade": idade,
        "peso": peso,
        "altura": altura,
        "imc": round(imc, 2),
        "meta_agua": round(meta_agua_litros, 2),
        "meta_sono": 8,
        "calorias_alvo": int(calorias_diarias),
        "primeiro_acesso": False, # Agora o sistema sabe que já entraste
        "moedas_iniciais": 100    # Um presente de boas-vindas!
    }

    # --- SALVAMENTO PARA INTEGRAÇÃO ---
    # Guardamos num JSON para o JavaScript ler
    with open("dados_usuario_ane.json", "w", encoding="utf-8") as arquivo:
        json.dump(perfil_usuario, f, indent=4, ensure_ascii=False)

    # --- PAINEL DE SUCESSO ---
    print("\n" + "✅" * 20)
    print(f"Santuário Configurado com Sucesso, {nome.upper()}!")
    print(f"-> Teu IMC: {imc:.1f}")
    print(f"-> Beber: {meta_agua_litros:.2f}L de água por dia")
    print(f"-> Meta de Calorias: {int(calorias_diarias)} kcal")
    print("✅" * 20)
    print("\n[INFO] Os teus dados foram guardados. Agora podes abrir o teu index.html!")

if __name__ == "__main__":
    # Verifica se já existe uma configuração para não repetir o processo
    if os.path.exists("dados_usuario_ane.json"):
        decisao = input("Já tens um perfil configurado. Queres refazer o questionário? (s/n): ")
        if decisao.lower() == 's':
            configurar_santuario()
        else:
            print("\nRedirecionando para o Santuário... Até logo!")
    else:
        configurar_santuario()