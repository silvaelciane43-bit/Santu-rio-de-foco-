import json
import os
import random

# Estrutura inicial (Mantive o que pediste, apenas adicionei os 'lembretes')
usuario_padrao = {
    "nome": "Viajante",
    "genero": "F",
    "peso": 0,
    "altura": 0,
    "objetivo": "Cuidar da mente e do corpo",
    "meta_agua_litros": 0,
    "lembretes": []  # 📝 Adicionado para guardares teus alarmes e avisos
}

def carregar_dados():
    """Tenta ler o arquivo JSON. Se não existir ou der erro, usa o padrão."""
    if os.path.exists("config_usuario.json"):
        try:
            with open("config_usuario.json", "r", encoding="utf-8") as f:
                # Carrega os dados e garante que 'lembretes' sempre exista (evita erro)
                dados = json.load(f)
                if "lembretes" not in dados:
                    dados["lembretes"] = []
                    return dados
        except (json.JSONDecodeError, IOError):
            return usuario_padrao
        return usuario_padrao

def saudar_usuario():
    dados = carregar_dados()
    nome = dados.get("nome", "Viajante")
    genero = dados.get("genero", "F")

    # Ajuste humano de acordo com o gênero
    boas_vindas = "Bem-vinda" if genero == "F" else "Bem-vindo"

    # 🧠 Frases curtas e gentis para TDAH (Reduz a pressão e o ruído mental)
    frases_tdah = [
        "Que tal focar em uma pequena coisa de cada vez? ✨",
        "Não precisas de perfeição, apenas de presença. 🌿",
        "Como está o teu foco hoje? Vamos com calma. 🎯",
        "Lembra-te: