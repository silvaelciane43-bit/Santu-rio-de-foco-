# config.py
usuario = {
    "nome": "Lua",  # Este nome será alterado no primeiro acesso
    "peso": 0,
    "altura": 0,
    "objetivo": ""
}

def saudar_usuario():
    return f"--- SANTUÁRIO MAX: Olá, {usuario['nome']}! ---"