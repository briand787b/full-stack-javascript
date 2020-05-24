# Expect the host fs to be mounted (for hot reloading), so
# do not copy any files here.  Also, re-run npm install
# on every rebuild of the dev container. This works around
# the issue of the bind-mount overwriting the node_modules
# dir. It is also not a pain to run `npm install` every time
# (as you would expect) because this image should only
# ever be built once per dev session since changes to the
# host fs are immediately propagated without rebuilding
FROM node:14.3
WORKDIR /app
EXPOSE 3000
CMD [ "sh", "-c", "npm install && npm start" ]