import json
import os

# --- CONFIGURAÇÃO DE INTEGRAÇÃO ---
# Este arquivo simula o banco de dados que o seu JavaScript (storage.js) vai ler
DB_PATH = "health_data.json"

def salvar_no_cerebro(dados):
    """Salva os resultados para que o sistema Web possa ler depois"""
    with open(DB_PATH, "w") as f:
        json.dump(dados, f, indent=4)

def calcular_saude():
    print("\n" + "="*30)
    print("🩺 MÓDULO DE SAÚDE - SANTUÁRIO MAX")
    print("="*30)

    try:
        peso = float(input("Digite seu peso atual (kg): "))
        altura = float(input("Digite sua altura (ex: 1.65): "))
        litros_agua = float(input("Quantos litros de água bebeu hoje? "))

        # 1. CÁLCULO DE IMC
        imc = peso / (altura ** 2)
        
        # 2. CÁLCULO DE HIDRATAÇÃO (35ml por kg)
        meta_agua = (peso * 35) / 1000  # Converte ml para Litros
        porcentagem_agua = (litros_agua / meta_agua) * 100

        # --- LÓGICA DE STATUS ---
        status_corpo = "excelente"
        if imc < 18.5 or imc > 25:
            status_corpo = "alerta"
        
        if porcentagem_agua < 70:
            status_corpo = "desidratado"

        # --- PAINEL DE RESULTADOS ---
        print("\n--- DIAGNÓSTICO ---")
        print(f"-> IMC: {imc:.1f}")
        print(f"-> Meta de Água: {meta_agua:.2f}L")
        print(f"-> Progresso Hidratação: {porcentagem_agua:.1f}%")
        
        if status_corpo == "desidratado":
            print("⚠️ AVISO: Seu nível de água está baixo! O Avatar vai ficar cansado.")
        elif status_corpo == "alerta":
            print("⚖️ AVISO: Seu IMC está fora da zona ideal. Foco na nutrição!")
        else:
            print("✅ Tudo em ordem! Você ganhou 10 moedas de bônus por saúde!")

        # --- ENVIANDO PARA O CÉREBRO (JSON) ---
        dados_saude = {
            "imc": round(imc, 2),
            "meta_agua": round(meta_agua, 2),
            "agua_consumida": litros_agua,
            "status_geral": status_corpo,
            "bonus_moedas": 10 if status_corpo == "excelente" else 0
        }
        
        salvar_no_cerebro(dados_saude)
        print("\n[Cérebro Atualizado]: Dados enviados para o Santuário Web!")

    except ValueError:
        print("❌ Erro: Por favor, use números e pontos (ex: 70.5).")

if __name__ == "__main__":
    calcular_saude()