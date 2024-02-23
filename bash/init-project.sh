#!/bin/bash

# Demander le port NestJS
read -p "Entrez le port pour NestJS (par exemple, 3000): " nestjs_port
echo "NESTJS_PORT=$nestjs_port" > .env

# Demander le DATABASE_URL
read -p "Entrez votre DATABASE_URL: " db_url
echo "DATABASE_URL=\"$db_url\"" > database/prisma/.env

echo "Fichiers .env créés avec succès."

# Exécuter les commandes Prisma
echo "Exécution de Prisma Generate et Migrate..."
cd database/prisma
npx prisma generate
npx prisma migrate dev
cd ../..

# Remplir la base de données
echo "Lancement du script de remplissage de la base de données..."
node scraper/script.js

echo "Initialisation terminée."
