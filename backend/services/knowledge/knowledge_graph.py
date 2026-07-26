import csv
import os
import networkx as nx
from backend.config.settings import ajustes, BASE_DIR

class KnowledgeGraph:
    def __init__(self):
        self.alumnos = {}
        self.docentes = {}
        self.asignaciones = {}
        self.cursos = {}
        self.grafo = nx.DiGraph()
        self._cargar_datos()
        self.cargar_grafo_malla()

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

    def cargar_grafo_malla(self):
        """
        Construye el grafo donde:
        - Nodos: Códigos de Curso (con atributos 'nombre', 'semestre', etc.)
        - Aristas Dirigidas: Curso A -> Curso B (A es prerequisito de B)
        """
        self.grafo.clear() # Limpiar por si se recarga
        
        # 1. Añadir nodos
        for cod, curso in self.cursos.items():
            self.grafo.add_node(cod, nombre=curso['nombre'], semestre=curso['semestre'])
            
        # 2. Añadir aristas verdaderas desde el CSV
        for cod, curso in self.cursos.items():
            prerreq_str = curso.get('prerrequisitos', '').strip()
            if prerreq_str:
                separador = ';' if ';' in prerreq_str else ','
                lista_prerreqs = [p.strip() for p in prerreq_str.split(separador) if p.strip()]
                
                for pre in lista_prerreqs:
                    if pre in self.grafo.nodes:
                        self.grafo.add_edge(pre, cod)

    def obtener_cursos_bloqueados(self, curso_desaprobado: str):
        """
        Encuentra todos los cursos dependientes directa e indirectamente.
        """
        codigo_exacto = None
        nombre_exacto = None
        
        for cod in self.grafo.nodes:
            nombre_curso = self.grafo.nodes[cod].get('nombre', '')
            # Cursos muy cortos como "I" podrían dar falsos positivos, requerimos un match estricto para el nombre
            # o que el código esté en el texto.
            if nombre_curso.lower() in curso_desaprobado.lower() or cod.lower() in curso_desaprobado.lower():
                codigo_exacto = cod
                nombre_exacto = nombre_curso
                break
                
        if not codigo_exacto:
            return None
            
        nodos_bloqueados = list(nx.descendants(self.grafo, codigo_exacto))
        nombres_bloqueados = [self.grafo.nodes[c].get('nombre', c) for c in nodos_bloqueados]
        
        return {
            "curso": nombre_exacto,
            "bloqueados": nombres_bloqueados
        }

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
            if str(curso['semestre']) == str(semestre):
                cursos_semestre.append(curso)
        return cursos_semestre

    def obtener_info_curso(self, nombre_o_codigo: str):
        for cod, curso in self.cursos.items():
            if nombre_o_codigo.lower() in curso['nombre'].lower() or nombre_o_codigo.lower() == cod.lower():
                return curso
        return None

    def obtener_alumnos_por_tutor(self, nombre_tutor: str):
        codigos_tutor = []
        # Buscar el código del docente
        for cod_doc, docente in self.docentes.items():
            nombre_completo = f"{docente.get('nombres','')} {docente.get('apellidos','')}".lower()
            if nombre_tutor.lower() in nombre_completo:
                codigos_tutor.append(cod_doc)
        
        if not codigos_tutor:
            return None
            
        alumnos_asignados = []
        for cod_alum, tutores_asignados in self.asignaciones.items():
            for t_cod in tutores_asignados:
                if t_cod in codigos_tutor:
                    info_alumno = self.obtener_info_alumno(cod_alum)
                    if info_alumno:
                        alumnos_asignados.append(info_alumno)
        return alumnos_asignados

    def obtener_prerrequisitos(self, curso_objetivo: str):
        codigo_exacto = None
        nombre_exacto = None
        
        for cod in self.grafo.nodes:
            nombre_curso = self.grafo.nodes[cod].get('nombre', '')
            if nombre_curso.lower() in curso_objetivo.lower() or cod.lower() in curso_objetivo.lower():
                codigo_exacto = cod
                nombre_exacto = nombre_curso
                break
                
        if not codigo_exacto:
            return None
            
        nodos_prerreq = list(self.grafo.predecessors(codigo_exacto))
        nombres_prerreq = [self.grafo.nodes[c].get('nombre', c) for c in nodos_prerreq]
        
        return {
            "curso": nombre_exacto,
            "prerrequisitos": nombres_prerreq
        }

# Instancia global (Singleton)
knowledge_graph = KnowledgeGraph()
