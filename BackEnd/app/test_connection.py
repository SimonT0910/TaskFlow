from app.database import engine

def test():
    try:
        with engine.connect() as conn:
            print("Conexion exitosa")
    except Exception as e:
        print("Error:", e)
        
test()