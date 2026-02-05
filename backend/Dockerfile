# Usa una imagen base de Node.js LTS
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto del backend
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
