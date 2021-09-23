FROM node:14-buster as build
ADD . /appBuild
WORKDIR /appBuild
RUN yarn install && \
    yarn build 

FROM node:14-buster
WORKDIR /app
COPY --from=build /appBuild/dist ./dist
COPY --from=build /appBuild/node_modules ./node_modules
COPY --from=build /appBuild/package.json ./package.json
ENTRYPOINT [ "yarn", "start:prod" ]
