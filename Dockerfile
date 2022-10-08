FROM node:18-alpine3.15

# Set working directory
RUN mkdir -p /var/www/forever
WORKDIR /var/www/forever

# Copiar el directorio y su contenido
COPY . ./var/www/forever
COPY package.json tsconfig.json tsconfig.build.json /var/www/forever/
RUN yarn install --prod
RUN yarn build


# Dar permiso para ejecutar la applicación
RUN adduser --disabled-password foreveruser
RUN chown -R foreveruser:foreveruser /var/www/forever
USER foreveruser

# Limpiar el caché
RUN yarn cache clean --force

EXPOSE 3000

CMD [ "node","dist/main" ]
