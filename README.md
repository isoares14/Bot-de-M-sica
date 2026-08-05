# Bot de Música para Discord

Bot de música para Discord desenvolvido com Node.js, Discord.js e Discord Player. Reproduz músicas e playlists, administra a fila e oferece controles interativos diretamente pelo Discord.

## Funcionalidades

- Busca de músicas por nome ou URL
- Reprodução de playlists
- Fila de reprodução por servidor
- Pausar, continuar, pular, repetir e voltar
- Controle de volume
- Ordem aleatória e limpeza da fila
- Filtros de áudio com FFmpeg
- Favoritos por usuário
- Painel interativo com botões
- Comandos slash registrados automaticamente

## Comandos

| Comando | Descrição |
| --- | --- |
| `/play` | Pesquisa e reproduz uma música ou playlist |
| `/pause` | Pausa a reprodução atual |
| `/resume` | Continua uma música pausada |
| `/skip` | Avança para a próxima música |
| `/back` | Volta para a música anterior |
| `/replay` | Reinicia a música atual |
| `/stop` | Encerra a reprodução |
| `/volume` | Altera o volume entre 1 e 100 |
| `/shuffle` | Embaralha a fila |
| `/clear` | Remove as músicas da fila |
| `/loop` | Ativa repetição da música ou da fila |
| `/filters` | Aplica ou remove filtros de áudio |
| `/favorite` | Adiciona ou remove músicas favoritas |

## Tecnologias

- Node.js 20+
- Discord.js 14
- Discord Player 6
- FFmpeg
- WioDB

## Instalação

Clone o repositório:

```bash
git clone https://github.com/tiosoaress/Bot-de-Musica.git
cd Bot-de-Musica
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Preencha o `.env` com os dados da sua aplicação no Discord Developer Portal:

```env
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=id_da_aplicacao_aqui
BOT_EMBED_COLOR=#5865F2
```

Inicie o bot:

```bash
npm start
```

## Configuração no Discord

1. Crie uma aplicação no [Discord Developer Portal](https://discord.com/developers/applications).
2. Adicione um bot à aplicação e copie o token para `DISCORD_TOKEN`.
3. Copie o Application ID para `DISCORD_CLIENT_ID`.
4. No OAuth2 URL Generator, selecione os escopos `bot` e `applications.commands`.
5. Conceda as permissões de visualizar canais, enviar mensagens, conectar e falar.
6. Use a URL gerada para adicionar o bot ao servidor.

Nunca publique o arquivo `.env` nem compartilhe o token do bot.

## Validação

Verifique a sintaxe de todos os arquivos JavaScript:

```bash
npm run check
```

## Estrutura

```text
Bot-de-Musica/
├── commands/slashcommands/
├── database/
├── events/music/
├── functions/
├── scripts/
├── utils/
├── .env.example
├── config.js
├── index.js
└── package.json
```

## Contribuição

Contribuições são bem-vindas. Leia o [guia de contribuição](CONTRIBUTING.md) antes de abrir um pull request.

## Segurança

Encontrou uma vulnerabilidade? Consulte a [política de segurança](SECURITY.md) para reportá-la de forma responsável.

## Licença

Distribuído sob a licença MIT. Consulte [LICENSE](LICENSE) para mais informações.
