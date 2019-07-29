import * as mongoose from "mongoose";

export class Db {
    private static mongoUrl: string = 'mongodb://Kabbage:Kabbage123@ds151450.mlab.com:51450/kardology';

    public static mongoSetup() {
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true })
            .then(() => {
                console.log("connection successful");
            })
            .catch(error => {
                console.log(error);
                console.log("connection failed");
            });
    }

}