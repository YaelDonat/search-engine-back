@echo off

REM Demander le port NestJS
set /p nestjs_port="Entrez le port pour NestJS (exemple, 3000): "
echo NESTJS_PORT=%nestjs_port% > .env

REM Demander le DATABASE_URL
set /p db_url="Entrez votre DATABASE_URL (exemple: postgresql://user:password@localhost:5432/dbname?schema=public): "
echo DATABASE_URL="%db_url%" > database\prisma\.env

echo Fichiers .env créés avec succès.

REM Vérifier Docker et Docker Compose
docker -v > nul 2>&1
if %errorlevel% neq 0 (
    echo Docker n'est pas installé. Veuillez installer Docker avant de continuer.
    exit /b 1
)

docker-compose -v > nul 2>&1
if %errorlevel% neq 0 (
    echo docker-compose n'est pas installé. Veuillez installer docker-compose avant de continuer.
    exit /b 1
)

REM Démarrer les services Docker
echo Lancement des services Docker...
cd database
docker-compose up -d

REM Exécuter les commandes Prisma
echo Exécution de Prisma Generate et Migrate...
cd prisma
call npx prisma generate
call npx prisma migrate dev
cd ..\..

REM Remplir la base de données
echo Lancement du script de remplissage de la base de données...
call node scrapers\script.js

echo Initialisation terminée.
