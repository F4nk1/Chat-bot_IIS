import csv
import os
from backend.config.settings import ajustes, BASE_DIR

class KnowledgeGraph:
    def __init__(self):
        self.alumnos = {}
        self.docentes = {}
        self.asignaciones = {}
        self.cursos = {}
        self._cargar_datos()

    def _cargar_datos(self):
        ruta_base = os.path.join(BASE_DIR, "data", "estructurado")
        
        # Cargar docentes
        try:
            with open(os.path.join(ruta_base, "docentes.csv"), mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    self.docentes[row['codigo_docente']] = row
        except Exception as e:
            print(f"Error cargando docentes: {e}")

        # Cargar alumnos
        try:
            with open(os.path.join(ruta_base, "alumnos.csv"), mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    self.alumnos[row['codigo']] = row
        except Exception as e:
            print(f"Error cargando alumnos: {e}")

        # Cargar asignaciones
        try:
            with open(os.path.join(ruta_base, "asignacion_tutor.csv"), mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row['codigo_alumno'] not in self.asignaciones:
                        self.asignaciones[row['codigo_alumno']] = []
                    if row['activo'] == '1':
                        self.asignaciones[row['codigo_alumno']].append(row['codigo_docente'])
        except Exception as e:
            print(f"Error cargando asignaciones: {e}")

        # Cargar cursos
        try:
            with open(os.path.join(ruta_base, "cursos_malla.csv"), mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    self.cursos[row['codigo_curso']] = row
        except Exception as e:
            print(f"Error cargando cursos: {e}")

    def obtener_tutor_de_alumno(self, codigo_alumno: str):
        if codigo_alumno in self.asignaciones:
            docentes_cods = self.asignaciones[codigo_alumno]
            if docentes_cods:
                cod_tutor = docentes_cods[0]
                return self.docentes.get(cod_tutor)
        return None

    def obtener_info_alumno(self, codigo_alumno: str):
        return self.alumnos.get(codigo_alumno)

    def obtener_cursos_por_semestre(self, semestre: str):
        cursos_semestre = []
        for cod, curso in self.cursos.items():
            if curso['semestre'] == str(semestre):
                cursos_semestre.append(curso)
        return cursos_semestre

# Instancia global (Singleton)
knowledge_graph = KnowledgeGraph()
