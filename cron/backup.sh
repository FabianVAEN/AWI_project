#!/bin/sh

# Fecha actual para nombrar el archivo
FECHA=$(date +"%Y%m%d_%H%M%S")

# Nombre del archivo de backup
ARCHIVO="/backups/backup_${FECHA}.sql"

# Hacer el backup
export PGPASSWORD="$DB_PASSWORD"
pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" > "$ARCHIVO"

# Escribir en el log
echo "[$(date)] Backup realizado exitosamente" >> /backups/cron.log
echo "[$(date)] Backup creado: $ARCHIVO" >> /backups/cron.log

# Limpiar backups viejos (mantener solo últimos 30)
cd /backups
ls -t backup_*.sql | tail -n +30 | xargs -r rm

echo "[$(date)] Limpieza completada" >> /backups/cron.log
