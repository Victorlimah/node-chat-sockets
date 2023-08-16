import net from 'net';
import readline from 'readline';

const serverIp = '127.0.0.1'; // IP do servidor
const serverPort = 6666; // Porta do servidor

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new net.Socket();

client.connect(serverPort, serverIp, () => {
    console.log(`Conectado ao servidor de bate-papo em ${serverIp}:${serverPort}`);

    rl.question('Digite seu nome de usuário: ', (input) => {
        username = input;
        client.write(username); // Enviar o nome de usuário para o servidor
        startChat();
    });
});

let username = null;

function startChat() {
    rl.on('line', (input) => {
        if (input.startsWith('/msg')) {
            const parts = input.split(' ');
            const recipientUsername = parts[1];
            const privateMessage = parts.slice(2).join(' ');
            client.write(`/msg ${recipientUsername} ${privateMessage}`);
        } else {
            client.write(input);
        }
    });

    client.on('data', (data) => {
        console.log(data.toString());
    });

    client.on('close', () => {
        console.log('Conexão fechada.');
        rl.close();
    });
}
