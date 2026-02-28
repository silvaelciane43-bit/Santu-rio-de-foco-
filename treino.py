import requests

def registrar_treino():
    print("--- REGISTRO DE TREINO ---")
    try:
        minutos = int(input("Quantos minutos voce treinou? "))
        url = ""
        resposta = requests.post(url, json={"minutos": minutos})
        if resposta.status_code == 200:
            dados = resposta.json()
            print("Sucesso! Moedas: " + str(dados['dados']['moedas']))
    except:
        print("Erro: Servidor desligado!")

        if name == "main":
            registrar_treino()