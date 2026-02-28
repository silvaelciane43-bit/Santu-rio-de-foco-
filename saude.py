def registrar_saude():
    print("--- CONSULTA DE SAUDE ---")
    try:
        peso = float(input("Qual seu peso (kg)? "))
        altura = float(input("Qual sua altura (m)? "))
        imc = peso / (altura * altura)
        print("Seu IMC e: " + str(round(imc, 2)))
    except:
        print("Erro: Use ponto e nao virgula.")

        if name == "main":
            registrar_saude()