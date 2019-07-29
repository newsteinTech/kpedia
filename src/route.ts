import * as express from "express"
import {linkService} from "./linkService"
const linkServiceObj = new linkService();


export class Routes {

    constructor(){}
    public static configRoutes(app :express.Application): void { 

        app.get('/', (req : express.Request, res: express.Response) => {
            res.status(200).send({
                message: 'Health Check Success'
            })
        });

        app.post('/kpedia', linkServiceObj.PorcessSlackCommand);
    }
}