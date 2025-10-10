# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos y dependencias
COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install --frozen-lockfile

# Copiar el resto del proyecto
COPY . .

# Compilar el proyecto
RUN pnpm build

# Etapa de producción
FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

# Copiar archivos necesarios desde builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/pnpm-lock.yaml ./

# Variables de entorno
ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "start"]
