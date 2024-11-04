import express from "express";
import cors from "cors";
import morgan from "morgan";
import body_parser from "body-parser";
import path from "path";
import { Server } from "socket.io";
import http from 'http';
import { CustomRequest } from '../common/Interface';
import routes from './routes';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    pingInterval: 25000,
    pingTimeout: 60000
});

const TAG = 'WebConfigSocket';
io.on('connection', client => {
    console.log(`${TAG}: client connected. total: ${io.sockets.sockets.size} connection`);

    client.on('disconnect', () => {
        console.log(`${TAG}: onDisconnect - Client disconnected. total: ${io.sockets.sockets.size} connection`);
    });
});

app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(cors());
app.use(
    morgan(
        ":remote-addr :remote-user :user-agent :method :url HTTP/:http-version :status :res[content-length] - :response-time ms"
    )
);
app.use(body_parser.json({ limit: "50mb" }));
app.use(body_parser.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.static(path.join(__dirname, 'public')));

function onChangeConfig(botName: string) {
    io.emit('onUpdateConfig', botName);
}

app.post('*', (req, res, next) => {
    (req as unknown as CustomRequest).onChangeConfig = onChangeConfig;
    next();
});
app.delete('*', (req, res, next) => {
    (req as unknown as CustomRequest).onChangeConfig = onChangeConfig;
    next();
});

app.use('/api/', routes);

const port = 8080;
server.listen(port, () => {
    console.log(`\nStart server at: ${new Date()}
                    HTTP server is listening at: ${"localhost"}:${port}
        `);
});
