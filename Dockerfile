# FROM node:18-alpine3.15

# # Set working directory
# RUN mkdir -p /var/www/forever
# WORKDIR /var/www/forever

# # Copiar el directorio y su contenido
# COPY . ./var/www/forever
# COPY package.json tsconfig.json tsconfig.build.json /var/www/forever/
# RUN yarn install --prod
# RUN yarn build


# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password foreveruser
# RUN chown -R foreveruser:foreveruser /var/www/forever
# USER foreveruser

# # Limpiar el caché
# RUN yarn cache clean --force

# EXPOSE 3000

# CMD [ "node","dist/main" ]


# Install dependencies only when needed
FROM node:18-alpine3.15 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the app with cache dependencies
FROM node:18-alpine3.15 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build


# Production image, copy all the files and run nest
FROM node:18-alpine3.15 AS runner

# Set working directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --prod

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "node","dist/main" ]