FROM docker.io/node:20.11 AS base
ENV PNPM_HOME="/pnpm" \
  PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /usr/src/frontend
COPY . .

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN pnpm install

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build


FROM base
ENV NODE_ENV="production"
COPY --from=prod-deps /usr/src/frontend/node_modules /usr/src/frontend/node_modules
COPY --from=build /usr/src/frontend/dist /usr/src/frontend/dist
EXPOSE 5173

CMD ["pnpm", "run", "dev"]