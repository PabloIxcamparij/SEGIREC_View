# ============================================================
# (1) ETAPA DE BUILD — NODE + VITE
# ============================================================
FROM node:22-alpine AS build

WORKDIR /app

# Copia archivos base
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./

# Instala dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye la aplicación
RUN npm run build

# ============================================================
# (2) ETAPA DE PRODUCCIÓN — NGINX
# ============================================================
FROM nginx:alpine

# Elimina configuraciones por defecto
RUN rm -rf /etc/nginx/conf.d/*

# Copia la configuración de NGINX endurecida
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]