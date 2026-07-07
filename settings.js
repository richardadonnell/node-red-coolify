// Node-RED runtime settings — Coolify deploy.
// Secrets come from environment variables (set in Coolify), never committed here.
module.exports = {
    flowFile: 'flows.json',

    // Bind all interfaces so Coolify's Traefik (separate container) can reach us.
    // Node-RED defaults to 127.0.0.1 (loopback) when uiHost is unset → proxy gets 503.
    uiHost: '0.0.0.0',

    // Encrypts the flow credentials file. Set NODE_RED_CREDENTIAL_SECRET in Coolify.
    credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET,

    // Editor + admin API — the arbitrary-code-execution surface. Locked.
    adminAuth: {
        type: "credentials",
        users: [{
            username: process.env.NODE_RED_ADMIN_USER || "admin",
            password: process.env.NODE_RED_PASSWORD_HASH,
            permissions: "*"
        }]
    },

    // Dashboard 2.0 + any HTTP-in endpoints. Locked with basic auth.
    httpNodeAuth: {
        user: process.env.NODE_RED_HTTP_USER || "viewer",
        pass: process.env.NODE_RED_HTTP_PASSWORD_HASH
    },

    uiPort: process.env.PORT || 1880,

    logging: {
        console: { level: "info", metrics: false, audit: false }
    }
};
