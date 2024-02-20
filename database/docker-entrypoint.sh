#!/bin/bash

# Attente jusqu'à ce que PostgreSQL soit prêt
until pg_isready -q -d "${POSTGRES_DB}" -U "${POSTGRES_USER}" -h localhost -p 5432
do
  echo "Waiting for PostgreSQL to start..."
  sleep 1
done

# Exécuter la commande par défaut du conteneur PostgreSQL
exec "$@"
