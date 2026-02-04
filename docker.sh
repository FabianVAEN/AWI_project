#!/bin/bash

# Script de utilidad para gestionar Docker Compose del proyecto AWI

COMPOSE_FILE="docker-compose.yml"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función de ayuda
show_help() {
    echo -e "${BLUE}=== AWI Project - Docker Manager ===${NC}"
    echo ""
    echo "Uso: ./docker.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo -e "  ${GREEN}start${NC}        - Inicia todos los servicios"
    echo -e "  ${GREEN}stop${NC}         - Detiene todos los servicios"
    echo -e "  ${GREEN}restart${NC}      - Reinicia todos los servicios"
    echo -e "  ${GREEN}logs${NC}         - Muestra logs de todos los servicios"
    echo -e "  ${GREEN}logs-backend${NC} - Muestra logs solo del backend"
    echo -e "  ${GREEN}logs-db${NC}      - Muestra logs solo de PostgreSQL"
    echo -e "  ${GREEN}status${NC}       - Muestra el estado de los servicios"
    echo -e "  ${GREEN}build${NC}        - Reconstruye las imágenes"
    echo -e "  ${GREEN}reset${NC}        - Detiene servicios y elimina volúmenes (⚠️  borra datos)"
    echo -e "  ${GREEN}shell-backend${NC}- Abre una terminal en el contenedor del backend"
    echo -e "  ${GREEN}shell-db${NC}     - Abre psql en PostgreSQL"
    echo -e "  ${GREEN}tables${NC}       - Lista las tablas de la base de datos"
    echo -e "  ${GREEN}help${NC}         - Muestra esta ayuda"
    echo ""
}

# Función para verificar que Docker está corriendo
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker no está corriendo. Por favor, inicia Docker.${NC}"
        exit 1
    fi
}

# Comandos
case "$1" in
    start)
        check_docker
        echo -e "${GREEN}🚀 Iniciando servicios...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✅ Servicios iniciados${NC}"
        docker-compose ps
        ;;
    
    stop)
        echo -e "${YELLOW}🛑 Deteniendo servicios...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Servicios detenidos${NC}"
        ;;
    
    restart)
        echo -e "${YELLOW}🔄 Reiniciando servicios...${NC}"
        docker-compose restart
        echo -e "${GREEN}✅ Servicios reiniciados${NC}"
        docker-compose ps
        ;;
    
    logs)
        docker-compose logs -f
        ;;
    
    logs-backend)
        docker-compose logs -f backend
        ;;
    
    logs-db)
        docker-compose logs -f postgres
        ;;
    
    status)
        echo -e "${BLUE}📊 Estado de los servicios:${NC}"
        docker-compose ps
        ;;
    
    build)
        check_docker
        echo -e "${YELLOW}🔨 Reconstruyendo imágenes...${NC}"
        docker-compose build
        echo -e "${GREEN}✅ Imágenes reconstruidas${NC}"
        ;;
    
    reset)
        echo -e "${RED}⚠️  ADVERTENCIA: Esto eliminará todos los datos de la base de datos${NC}"
        read -p "¿Estás seguro? (s/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            echo -e "${YELLOW}🗑️  Eliminando servicios y volúmenes...${NC}"
            docker-compose down -v
            echo -e "${GREEN}✅ Reset completado${NC}"
        else
            echo -e "${BLUE}Operación cancelada${NC}"
        fi
        ;;
    
    shell-backend)
        echo -e "${BLUE}🐚 Abriendo shell en el backend...${NC}"
        docker exec -it awi_backend sh
        ;;
    
    shell-db)
        echo -e "${BLUE}🐚 Abriendo PostgreSQL...${NC}"
        docker exec -it awi_db psql -U postgres -d awi_db
        ;;
    
    tables)
        echo -e "${BLUE}📋 Tablas en la base de datos:${NC}"
        docker exec -it awi_db psql -U postgres -d awi_db -c "\dt"
        ;;
    
    help|--help|-h|"")
        show_help
        ;;
    
    *)
        echo -e "${RED}❌ Comando no reconocido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
