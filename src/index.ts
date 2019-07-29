import * as express from "express";
import * as bodyParser from "body-parser"
import { Db } from "./../src/db"
import { Routes } from './../src/route'
const port = process.env.PORT || "3000";

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

        Routes.configRoutes(this.app)

        this.config();
        Db.mongoSetup();
    }

    private config(): void {
        this.app.use(bodyParser.urlencoded({ verify: this.rawBodyBuffer, extended: true }));
        this.app.use(bodyParser.json({ verify: this.rawBodyBuffer }));
    }
}

export default new App().app;