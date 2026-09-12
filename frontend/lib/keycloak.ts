import Keycloak from "keycloak-js";
export const keycloak = new Keycloak({ url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? "http://localhost:8082", realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? "portfolio-builder", clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "portfolio-frontend" });
