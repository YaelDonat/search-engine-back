@echo off

REM Demander le port NestJS
set /p nestjs_port="Entrez le port pour NestJS (par exemple, 3000): "
echo NESTJS_PORT=%nestjs_port% > .env

REM Demander le DATABASE_URL
set /p db_url="Entrez votre DATABASE_URL: "
echo DATABASE_URL="%db_url%" > database\prisma\.env

echo Fichiers .env créés avec succès.

REM Exécuter les commandes Prisma
echo Exécution de Prisma Generate et Migrate...
cd database\prisma
call npx prisma generate
call npx prisma migrate dev
cd ..\..

REM Remplir la base de données
echo Lancement du script de remplissage de la base de données...
call node scrapers\script.js

echo Initialisation terminée.

