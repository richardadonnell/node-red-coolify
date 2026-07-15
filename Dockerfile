FROM nodered/node-red:5.0

# Extra nodes baked into the app dir (/usr/src/node-red).
# npm installs here, NOT under /data, so the persistent volume never shadows them.
RUN npm install --no-fund --no-update-notifier \
    @flowfuse/node-red-dashboard \
    node-red-contrib-cron-plus \
    node-red-node-email \
    node-red-contrib-postgresql \
    node-red-contrib-telegrambot

# Auth config lives outside /data so the persistent volume can't shadow it.
# The image entrypoint launches: node red.js --userDir /data $FLOWS "$@"
# so this CMD just appends "--settings <path>" to that command.
COPY settings.js /usr/src/node-red/settings.js
CMD ["--settings", "/usr/src/node-red/settings.js"]

# The image's stock healthcheck does require('/data/settings.js'), which doesn't
# exist here (settings live in /usr/src/node-red). It throws -> container
# "unhealthy" -> Traefik drops it from the load balancer -> 503. Plain HTTP probe instead.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
    CMD node -e "require('http').get({host:'127.0.0.1',port:process.env.PORT||1880,timeout:4000},r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"
