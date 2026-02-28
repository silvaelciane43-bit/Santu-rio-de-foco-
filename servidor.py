from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Permite que o seu navegador converse com o Python

# Arquivo onde o servidor vai guardar tudo para não perder ao fechar
DB_FILE = "dados_usuario_ane.json"

def carregar_dados():
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return {"nome": "Ane", "moedas": 100, "xp": 0, "energia": 100, "nivel": 1}

def salvar_dados(dados):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=4)

# --- ROTAS (OS FIOS INVISÍVEIS) ---

@app.route('/status', methods=['GET'])
def obter_status():
    """O Site chama isso para ler os dados atuais"""
    return jsonify(carregar_dados())

@app.route('/treinar', methods=['POST'])
def registrar_treino():
    """O treino.py chama isso para dar moedas"""
    dados = carregar_dados()
    info_treino = request.json
    
    minutos = info_treino.get('minutos', 0)
    dados["moedas"] += minutos
    dados["xp"] += minutos * 10
    dados["energia"] = max(0, dados["energia"] - (minutos * 0.5))
    
    salvar_dados(dados)
    return jsonify({"status": "sucesso", "dados": dados})

@app.route('/dormir', methods=['POST'])
def registrar_sono():
    """O sono.py chama isso para recuperar energia"""
    dados = carregar_dados()
    info_sono = request.json
    
    horas = info_sono.get('horas', 0)
    recuperacao = (horas / 8) * 100
    dados["energia"] = min(100, dados["energia"] + recuperacao)
    dados["xp"] += 20 # Bônus por dormir
    
    salvar_dados(dados)
    return jsonify({"status": "sucesso", "dados": dados})

if __name__ == '__main__':
    print("🚀 SERVIDOR DO SANTUÁRIO RODANDO EM: http://127.0.0.1:5000")
    app.run(port=5000, debug=True)