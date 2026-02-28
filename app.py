import json
import os
import time

def limpar_tela():
    os.system('cls' if os.name == 'nt' else 'clear')

def configurar_santuario():
    limpar_tela()
    print("\n" + "✨ " * 15)
    print("      🌟 BEM-VINDA(O) AO SEU LUGAR 🌟")
    print("    Um espaço calmo para focar no que importa.")
    print("✨ " * 15 + "\n")

    try:
        # --- COLETA HUMANIZADA ---
        nome_digitado = input("✨ Primeiro, como posso te chamar? ").strip().title()

        print(f"\nPrazer em te conhecer, {nome_digitado}! Vamos configurar tudo sem pressa.")

        genero = ""
        while genero not in ["M", "F"]:
            genero = input("➞ Tu te identificas como Homem (M) ou Mulher (F)? ").strip().upper()

            artigo = "o" if genero == "M" else "a"
            pronome = "Bem-vindo" if genero == "M" else "Bem-vinda"

            print(f"\nPerfeito! Agora, conta-me um pouco sobre {artigo} teu corpo:")

            # O .replace(',', '.') ajuda se a pessoa digitar com vírgula por distração
            idade = int(input("➞ Qual a tua idade atual? "))
            peso = float(input("➞ Teu peso em kg (ex: 70.5): ").replace(',', '.'))
            altura = float(input("➞ Tua altura em metros (ex: 1.75): ").replace(',', '.'))

    print("\n--- No teu ritmo! Como é o teu nível de atividade? ---")
    print("1 - Fico mais tempo sentad{}(a) (Sedentário)".format(artigo))
    print("2 - Faço caminhadas ou coisas leves (Leve)")
    print("3 - Sou uma pessoa ativa (Moderado)")
    print("4 - Treino pesado ou sou atleta (Intenso)")

    nivel = int(input("\nEscolhe o número que mais combina contigo (1-4): "))
    if nivel not in [1, 2, 3, 4]: nivel = 1

    # --- PROCESSAMENTO ---
    imc = peso / (altura ** 2)
    meta_agua = (peso * 35) / 1000
    fatores = {1: 30, 2: 35, 3: 40, 4: 45}
    calorias = peso * fatores.get(nivel, 30)

    # --- PERFIL COM FOCO NO USUÁRIO ---
    perfil_usuario = {
        "nome": nome_digitado,
        "genero": "Masculino" if genero == "M" else "Feminino",
        "idade": idade,
        "peso": peso,
        "altura": altura,
        "imc": round(imc, 2),
        "meta_agua_litros": round(meta_agua, 2),
        "energia_diaria_kcal": int(calorias),
        "moedas_iniciais": 100
    }

    # --- SALVAMENTO ---
    with open("config_usuario.json", "w", encoding="utf-8") as arquivo:
        json.dump(perfil_usuario, arquivo, indent=4, ensure_ascii=False)

        limpar_tela()
        print("\n" + "⭐" * 30)
        print(f"✨ TUDO PRONTO, {nome_digitado.upper()}! ✨")
        print("⭐" * 30)

        print(f"\n{pronome}, a tua jornada começa agora.")
        print(f"📌 {artigo.capitalize()} teu IMC é {round(imc, 1)}. Não te apegues a números, foca em sentir-te bem!")
        print(f"💧 Lembrete gentil: Tenta beber cerca de {round(meta_agua, 1)}L de água hoje.")

        print("\n[SISTEMA] Teu progresso foi salvo com carinho. Até logo!")
        time.sleep(2)

    except ValueError:
        print("\nOops! Parece que houve um pequeno erro nos números. 🌿")
        print("Tenta preencher novamente com calma, sem pressa.")

if __name__ == "__main__":
    configurar_santuario()