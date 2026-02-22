import json
import os
from datetime import datetime

# --- CONFIGURAÇÃO ---
DB_SONO = "dados_sono.json"

def registrar_sono():
    print("\n" + "🌙" * 15)
    print("  SANTUÁRIO MAX - MÓDULO SONO")
    print("   Recuperação de Energia Vital")
    print("🌙" * 15)

    try:
        print(f"\nHoje é {datetime.now().strftime('%d/%m/%Y')}")
        horas = float(input("Quantas horas você dormiu na última noite? "))
        qualidade = int(input("Qualidade do sono (1-Ruim, 5-Excelente): "))

        # --- LÓGICA DE RECUPERAÇÃO ---
        # A meta ideal é 8 horas. 
        # Se dormir menos, a energia não carrega 100%
        recuperacao = (horas / 8) * 100
        if recuperacao > 100: recuperacao = 100
        
        # Bônus por qualidade
        bonus_xp = qualidade * 20

        print(f"\n--- RELATÓRIO DE DESCANSO ---")
        print(f"-> Energia Recuperada: {recuperacao:.1f}%")
        print(f"-> Bônus de XP por disciplina: {bonus_xp}")

        if horas < 6:
            print("⚠️ Alerta: Sono insuficiente. O Avatar terá menos foco hoje.")
        elif horas >= 8 and qualidade >= 4:
            print("✨ Perfeito! Você está em estado de Fluxo Máximo!")

        # --- SALVAMENTO PARA O CÉREBRO ---
        dados = {
            "ultima_noite": horas,
            "qualidade": qualidade,
            "energia_final": round(recuperacao, 2),
            "xp_ganho": bonus_xp,
            "data_registro": str(datetime.now().date())
        }

        with open(DB_SONO, "w", encoding="utf-8") as f:
            json.dump(dados, f, indent=4)

        print("\n[Cérebro]: Dados de sono enviados para o LocalStorage!")

    except ValueError:
        print("❌ Erro: Use apenas números.")

if __name__ == "__main__":
    registrar_sono()