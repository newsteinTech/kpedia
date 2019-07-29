import * as express from "express";
import * as bodyParser from "body-parser"
import { Db } from "./db"
import { Routes } from "./route"
const port = process.env.PORT || "5000";

class App {

    public app: express.Application;

    private rawBodyBuffer = (req, res, buf, encoding) => {
        if (buf && buf.length) {
            req.rawBody = buf.toString(encoding || 'utf8');
        }
    };

    constructor() {
        this.app = express();

        this.app.listen(parseInt(port), 'localhost', () => {
            console.log('Express server listening on port ');
        })

        this.config();
        Routes.configRoutes(this.app);
        Db.mongoSetup();
    }

    private config(): void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
}

export default new App().app;