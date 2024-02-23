#!/bin/bash

# Demander le port NestJS
read -p "Entrez le port pour NestJS (par exemple, 3000): " nestjs_port
echo "NESTJS_PORT=$nestjs_port" > .env

# Demander le DATABASE_URL
read -p "Entrez votre DATABASE_URL (exemple: postgresql://user:password@localhost:5432/dbname?schema=public): " db_url
echo "DATABASE_URL=\"$db_url\"" > database/prisma/.env

echo "Fichiers .env créés avec succès."

# Vérifier Docker et Docker Compose
if ! command -v docker &> /dev/null
then
    echo "Docker n'est pas installé. Veuillez installer Docker avant de continuer."
    exit 1
fi

if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose n'est pas installé. Veuillez installer docker-compose avant de continuer."
    exit 1
fi

# Démarrer les services Docker
echo "Lancement des services Docker..."
cd database
docker-compose up -d

# Exécuter les commandes Prisma
echo "Exécution de Prisma Generate et Migrate..."
cd prisma
npx prisma generate
npx prisma migrate dev
cd ../..

# Remplir la base de données
echo "Lancement du script de remplissage de la base de données..."
node scrapers/script.js

echo "Initialisation terminée."
