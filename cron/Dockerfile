# Imagen base ligera
FROM alpine:3.19

# Instalar PostgreSQL client y cron
RUN apk add --no-cache postgresql-client busybox-suid

# Crear carpetas para scripts y backups
RUN mkdir /scripts /backups

# Copiar archivos
COPY backup.sh /scripts/backup.sh
COPY crontab.txt /etc/crontabs/root

# Dar permisos de ejecución al script
RUN chmod +x /scripts/backup.sh

# Crear archivo de log
RUN touch /backups/cron.log

# Iniciar cron en modo foreground
CMD ["crond", "-f", "-l", "2"]