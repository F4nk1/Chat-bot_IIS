import sys
sys.path.append('.')
from backend.services.nlu.symspell_checker import spell_checker
print(spell_checker.corregir("arquitectura de el computador"))
