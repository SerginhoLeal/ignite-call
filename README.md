## API Routes
  - Caso todos da equipe seja front ou fullstack, fará sentido o uso da api route

## Prisma & Prisma Client
  Comando de instalação da interface de linha de comando do Prisma:
  - npm i prisma -D

  Comando de instalação da dependência que iremos utilizar na nossa aplicação:
  - npm i @prisma/client

  Comando para iniciar o Prisma:
  - npx prisma init --datasource-provider SQLite

  Comando pra rodar a migration:
  - npx prisma migrate dev

  Comando pra rodar o Prisma Studio:
  - npx prisma studio

## Google OAuth 2.0
  Existe uma documentação completa nesse link [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2?hl=pt-br),
  mas abordarei apenas o necessário para seguir com esse projeto.

  Primeiro passo você terá que entrar no seu painel 


  API Consol > Tela de Permissões OAuth > 

## Docker
  Comando utilizado para rodar o Docker:
    - docker run --name "nome do projeto" -e MYSQL_ROOT_PASSWORD=docker -p 3306:3306 mysql:latest

  Comando utilizado para iniciar o container
    - docker start mysql

  Comando utilizado para parar o container:
    - docker stop mysql

https://blurha.sh/