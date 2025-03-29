# Stremio Addon

Este é um addon para o Stremio que fornece streams para filmes e séries.

## Sobre o Projeto

Este addon lê dados de um arquivo JSON (`all.json`) e disponibiliza streams para o Stremio baseado nos IDs do IMDb.

## Requisitos

- Docker
- Docker Compose
- Traefik configurado como proxy reverso

## Configuração

### 1. Configuração do Traefik

Antes de executar este projeto, é necessário ter o Traefik configurado. Se você ainda não tem o Traefik configurado, você pode seguir estas etapas:

1. Crie uma rede Docker para o Traefik:
```bash
docker network create traefik-network
```

2. Crie um diretório para o Traefik e os arquivos de configuração:
```bash
mkdir -p traefik
```

3. Crie o arquivo de configuração do Traefik (`traefik/traefik.yml`):
```yaml
api:
  dashboard: true
  insecure: true

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https

  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false

certificatesResolvers:
  letsencrypt:
    acme:
      email: seu-email@exemplo.com
      storage: /acme.json
      httpChallenge:
        entryPoint: web
```

4. Crie um arquivo vazio para armazenar os certificados HTTPS:
```bash
touch traefik/acme.json
chmod 600 traefik/acme.json
```

### 2. Configuração do Projeto

1. Clone este repositório:
```bash
git clone https://seu-repositorio/stremio-addon.git
cd stremio-addon
```

2. Certifique-se de que o arquivo `all.json` está presente na raiz do projeto.

3. Edite o arquivo `docker-compose.yml` e substitua `stremio-addon.ramondev.site` pelo seu próprio domínio.

## Executando o Projeto

Para iniciar o projeto, execute:

```bash
docker-compose up -d
```

Para verificar os logs:

```bash
docker-compose logs -f
```

## Acessando o Addon

Após a execução, o addon estará disponível em:

```
https://stremio-addon.ramondev.site/
```

Para adicionar ao Stremio, use a URL:

```
https://stremio-addon.ramondev.site/manifest.json
```

## Estrutura do Projeto

- `index.js` - Arquivo principal que configura e inicia o servidor do addon
- `all.json` - Banco de dados contendo informações sobre filmes e séries
- `Dockerfile` - Instruções para construir a imagem Docker
- `docker-compose.yml` - Configuração para orquestrar containers Docker com Traefik

## Licença
