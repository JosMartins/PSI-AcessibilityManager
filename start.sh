#assume que comandos dão bem
#!bin/bash

#Backend 
start_backend() {
  cd /home/PSI017/ProjetoSistemasInformacao/AccessibilityManagerBackend
  npm start > /home/PSI017/ProjetoSistemasInformacao/logs/backend.txt 2>&1 & #log sq
  echo "Backend iniciado - $!" 
}

#Frontend
start_frontend() {
  cd /home/PSI017/ProjetoSistemasInformacao/AccessibilityManagerFrontend
  npm start > /home/PSI017/ProjetoSistemasInformacao/logs/frontend.txt 2>&1 &  # log sq
  echo "Frontend iniciado - $!"
}

# Iniciar tudo em ordem

start_backend
start_frontend
disown
echo "Tudo Iniciado"


