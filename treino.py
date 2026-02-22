import json
import os

# Caminho para o cérebro do treino
DB_TREINO = "dados_treino.json"

def registrar_treino():
    print("\n" + "⚔️ " * 15)
    print("  SANTUÁRIO MAX - MÓDULO TREINO")
    print("     Transformando Suor em Ouro")
    print("⚔️ " * 15)

    print("\nO que você treinou hoje?")
    print("1 - Cardio (Corrida/Caminhada)")
    print("2 - Força (Academia/Peso do Corpo)")
    print("3 - Mobilidade (Ioga/Alongamento)")
    
    try:
        tipo = int(input("Escolha a opção (1-3): "))
        duracao = int(input("Quantos minutos durou o treino? "))

        # --- CÁLCULO DE RECOMPENSAS ---
        # Regra: 1 moeda por minuto + bônus de XP
        moedas_ganhas = duracao 
        xp_ganho = duracao * 10
        energia_gasta = duracao * 0.5 # Treinar cansa!

        print(f"\n--- RESULTADO DO ESFORÇO ---")
        print(f"💰 Moedas Ganhas: {moedas_ganhas}")
        print(f"⭐ XP Adquirido: {xp_ganho}")
        print(f"⚡ Energia Gasta: -{energia_gasta}%")

        # --- SALVAMENTO ---
        dados_treino = {
            "tipo": tipo,
            "minutos": duracao,
            "moedas": moedas_ganhas,
            "xp": xp_ganho,
            "energia_reducao": energia_gasta
        }

        with open(DB_TREINO, "w", encoding="utf-8") as f:
            json.dump(dados_treino, f, indent=4)

        print("\n[Cérebro]: Treino registrado! O Avatar está ficando mais forte.")

    except ValueError:
        print("❌ Erro: Digite apenas os números das opções.")

if __name__ == "__main__":
    registrar_treino()