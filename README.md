# chat-sockets com node

# Descrição

Esse é um código node que implementa um chat simples usando sockets. O chat é via terminal, e tem a comunicação entre cliente e servidor feita via TCP. Cada cliente pode enviar mensagens para o servidor, que as repassa para todos os outros clientes conectados ou enviar mensagens para um cliente específico, passando o nome do cliente e a mensagem.

# Requisitos
- Node.js (versão 12 ou superior)

# Como executar o servidor
`npm run start:server`

# Como executar o cliente
`npm run start:client`

# Lista de comandos
- `/users` - Exibe a lista de clientes conectados
- `<mensagem>` - Envia uma mensagem para todos os clientes conectados
- `/msg <username> <mensagem>` - Envia uma mensagem para um cliente específico