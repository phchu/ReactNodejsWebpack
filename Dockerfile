FROM node:18.19.1-bookworm
ARG NODE_ENV=development

ENV NODE_PATH=/app/node_modules
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV OPTIPNG_BIN_SKIP_TEST=true
ENV CFLAGS="-O2 -Wall -Wextra -DNO_ARM_NEON -Wno-unused-function -Wno-type-limits"
ENV LDFLAGS="-lz -lm"

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends build-essential python3 python3-pip optipng libpng-dev libjpeg-dev libgif-dev optipng pngquant jpegoptim gifsicle libc6 && rm -rf /var/lib/apt/lists/* 

RUN npm install --global yarn --force

RUN yarn cache clean
RUN yarn config set network-timeout 300000
RUN yarn global add pm2 node-addon-api node-gyp --verbose

EXPOSE 3000
EXPOSE 8080
CMD ["yarn", "start"]

