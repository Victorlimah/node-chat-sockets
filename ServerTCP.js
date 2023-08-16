import net from 'net';
import readline from 'readline';

const serverPort = 6666;
const clients = [];

const server = net.createServer((clientSocket) => {
    let username = null;

    clientSocket.on('data', (data) => {
        const message = data.toString().trim();

        if (!username) {
            username = message;
            clients.push({ socket: clientSocket, username });
            clientSocket.write(`Olá, ${username}! Você está conectado. Pode digitar as mensagens abaixo.\n`);
            clientSocket.write(`Para enviar uma mensagem privada, digite /msg <usuário> <mensagem>\n`);
            clientSocket.write(`Para ver a lista de usuários conectados, digite /users\n`);
            clientSocket.write(`Para sair, digite /quit\n\n`);
            broadcastMessage(`${username} entrou no chat.`);
        } else {
            if (message.startsWith('/msg')) {
                const sendPrivateMsg = handlePrivateMessage(username, message);
                if(sendPrivateMsg) {
                    const recipientUsername = message.split(' ')[1];
                    const privateMessage = message.split(' ').slice(2).join(' ');
                    clientSocket.write(`[Mensagem Privada para ${recipientUsername}]: ${privateMessage}\n`);
                }
            } else if (message === '/users') {
                const users = clients.map((client) => client.username).join(', ');
                clientSocket.write(`Usuários conectados: ${users}\n`);
            } else if (message === '/quit') {
                clientSocket.end();
            } else {
                broadcastMessage(`${username}: ${message}`);
            }
        }
    });

    clientSocket.on('end', () => {
        if (username) {
            removeClient(username);
            broadcastMessage(`${username} saiu do chat.`);
        }
    });
});

server.listen(serverPort, () => {
    console.log(`Servidor de bate-papo escutando na porta ${serverPort}`);
});

function broadcastMessage(message) {
    clients.forEach((client) => {
        client.socket.write(`${message}\n`);
    });
}

function handlePrivateMessage(senderUsername, message) {
    const parts = message.split(' ');
    const recipientUsername = parts[1];
    const privateMessage = parts.slice(2).join(' ');

    const recipientClient = clients.find((client) => client.username === recipientUsername);

    if (recipientClient) {
        recipientClient.socket.write(`[Mensagem Privada de ${senderUsername}]: ${privateMessage}\n`);
        return true;
    } else {
        clients.find((client) => client.username === senderUsername).socket.write(`Usuário ${recipientUsername} não encontrado.\n`);
        return false;
    }
}

function removeClient(username) {
    const index = clients.findIndex((client) => client.username === username);
    if (index !== -1) {
        clients.splice(index, 1);
    }
}
