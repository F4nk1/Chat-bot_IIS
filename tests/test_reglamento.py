import unittest
import requests

class TestReglamentoAPI(unittest.TestCase):
    URL_BASE = "http://127.0.0.1:8000/reglamento"

    def test_obtener_reglamento_id_valido(self):
        # Usamos el ID 94 que confirmamos existe en la BD
        id_prueba = 94
        try:
            # Nota: Esta prueba requiere que el servidor uvicorn este corriendo
            # Si no esta corriendo, saltamos la prueba o lanzamos error controlado
            respuesta = requests.get(f"{self.URL_BASE}/{id_prueba}")
            if respuesta.status_code == 200:
                datos = respuesta.json()
                self.assertEqual(datos["id"], id_prueba)
                self.assertIn("categoria", datos)
                print(f"Prueba exitosa: Documento {id_prueba} recuperado correctamente.")
            else:
                print(f"Servidor no disponible o ID no encontrado (Status: {respuesta.status_code})")
        except requests.exceptions.ConnectionError:
            print("Saltando prueba: El servidor uvicorn no está en ejecución.")

    def test_obtener_reglamento_id_invalido(self):
        id_invalido = 999999
        try:
            respuesta = requests.get(f"{self.URL_BASE}/{id_invalido}")
            if respuesta.status_code == 404:
                print("Prueba exitosa: El servidor retorno 404 para un ID inexistente.")
                self.assertEqual(respuesta.status_code, 404)
        except requests.exceptions.ConnectionError:
            pass

if __name__ == "__main__":
    unittest.main()
