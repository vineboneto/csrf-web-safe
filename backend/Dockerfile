FROM docker.io/node:20.11 AS base
ENV PNPM_HOME="/pnpm" \
  PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/backend
COPY . .

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN pnpm install

FROM base
ENV NODE_ENV="production"
COPY --from=prod-deps /usr/src/backend/node_modules /usr/src/backend/node_modules
EXPOSE 3000

CMD ["node", "main.js"]