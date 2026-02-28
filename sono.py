import requests

def registrar_sono():
    print("--- REGISTRO DE SONO ---")
    try:
        horas = float(input("Quantas horas voce dormiu? "))
        url = ""
        resposta = requests.post(url, json={"horas": horas})
        if resposta.status_code == 200:
            dados = resposta.json()
            print("Energia atual: " + str(dados['dados']['energia']) + "%")
        else:
            print("Erro no servidor.")
    except:
        print("Erro: Use ponto nas horas.")

        if name == "main":
            registrar_sono()