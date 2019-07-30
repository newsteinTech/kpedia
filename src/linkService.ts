import { linkDbModel } from "./linkModel"
import * as express from "express";


export class linkService {

    constructor() { }

    public PorcessSlackCommand(req: express.Request, res: express.Response) {

        // kpedia command, link, tags
        // kepdia create, http://abc.com, c# Python
        //[command, link, tags]

        const query = req.body.text ? req.body.text : 'help';
        const queries: Array<any> = query.split(' ');
        const command = queries[0];

        console.log("AAAABBBB")
        console.log(command)
        if (command && command.toString().toLocaleLowerCase() == "help") {
            return linkService.sendHelpCommandResponse(res);
        } else if (command && command.toString().toLocaleLowerCase() == "get") {
            console.log("CCCCC")
            return linkService.getAllLinks(res)

        } else if (command && command.toString().toLocaleLowerCase() == "search") {
            console.log("ANISH")
            console.log(queries[1])

            let tags = queries.length > 1 ? queries[1].split(',') : [];
            return linkService.searchLinksByTags(tags, res);
        }else  {
            let link = queries[0];
            let tags = queries.length > 0 ? queries[1].toString().toLocaleLowerCase().split(',') : ""
            console.log("CREATE")
            console.log(queries[1])
            console.log(tags)
            return linkService.processCreateLinkCommand(link, tags, res);
            // if (queries.length > 0) {
            //     let link = queries[1];
            //     let tags = queries.length > 2 ? queries[2].toString().toLocaleLowerCase().split(' ') : ""
            //     return linkService.processCreateLinkCommand(link, tags, res);
            // } else {
            //     return linkService.sendInvalidOperationResponse(res);
            // }

        } 
        // else {
        //     return linkService.sendInvalidOperationResponse(res);
        // }
    }

    private static sendHelpCommandResponse(res: express.Response) {

        let commandOptions = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "`[link] [Tag]`        Share links across org. for e.g. https://confluence.kabbage.com/display/QA/Partner+Test+Accounts partner testing,confluence"
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "`get [Number]`        Fetch the Top links, limited by Number option "
                }
            },
            {
                "type": "divider"
            },

            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "`search [Tag]`        Search for links by tags. for e.g. search python3,django"
                }
            },
            {
                "type": "divider"
            }
        ];

        const message = {
            response_type: 'in_channel',
            blocks: commandOptions
        };

        return res.json(message);
    }

    private static async processCreateLinkCommand(link: String, tags: String, res: express.Response) {
        if (link != null) {

            let linkExist = await linkDbModel.findOne({ link: link }).exec();

            if (linkExist != null) {
                return linkService.duplicateLinkResponse(res);
            }

            let linKData: any = {
                "link": link,
                "tags": tags
            }

            let linkItem: any = new linkDbModel(linKData);
            await linkItem.save();

            let createResp = [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "`Success`        Blog posted successfully"
                    }
                }];

            const Createmessage = {
                response_type: 'in_channel',
                blocks: createResp
            };

            return res.json(Createmessage);
        }
    }

    private static sendInvalidOperationResponse(res: express.Response) {
        let createResp = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "`Error`        Something went wrong, Please run comman in this way kpedia command, link, tags for eg. kepdia create, http://abc.com, c# Python"
                }
            }];

        const message = {
            response_type: 'in_channel',
            blocks: createResp
        };

        return res.json(message);
    }

    private static duplicateLinkResponse(res: express.Response) {
        let createResp = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "`Error`        This link has already been shared!"
                }
            }];

        const message = {
            response_type: 'in_channel',
            blocks: createResp
        };

        return res.json(message);
    }

    private static noResultResponse(res: express.Response) {
        let createResp = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "`Success`        No Result found"
                }
            }];

        const message = {
            response_type: 'in_channel',
            blocks: createResp
        };

        return res.json(message);
    }

    private static async getAllLinks(res: express.Response) {

        try {
            let allLinks: Array<any> = await linkDbModel.find().limit(10).exec();
            console.log(allLinks)
            let blocks: Array<any> = [];


            allLinks.forEach(item => {

                let description = item.description ? item.description : " ";
                let topic = item.topic ? item.topic : " ";
                let tags = item.tags ? item.tags : " ";

                blocks.push({
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `${topic}\n${item.link}\n`
                    }
                },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `${description}`
                        }
                    }
                    ,
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `*Tags:*\n${tags}\n*Date:*\n${item.modifiedDate}`
                        },
                        "accessory": {
                            "type": "image",
                            "image_url": "https://api.slack.com/img/blocks/bkb_template_images/approvalsNewDevice.png",
                            "alt_text": "computer thumbnail"
                        }
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "emoji": true,
                                    "text": `${item.like} UpVote`
                                },
                                "style": "primary",
                                "value": "click_me_123"
                            },
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "emoji": true,
                                    "text": `${item.dislike} DownVote`
                                },
                                "style": "danger",
                                "value": "click_me_123"
                            }
                        ]
                    })

                // blocks.push({
                //     type: 'section',
                //     text: {
                //         type: 'mrkdwn',
                //         text: `*${topic}* \n<${item.link}> \n${description} \n${tags}`
                //     }
                // },
                //     {
                //         'type': 'context',
                //         'elements': [
                //             {
                //                 'type': 'image',
                //                 'image_url': 'https://cdn.glitch.com/203fa7da-fadf-4c32-8d75-fb80800ef1b5%2Fyelp_logo_sm.png?1550364622921',
                //                 'alt_text': 'kepia'
                //             },
                //             {
                //                 "type": "button",
                //                 "text": {
                //                     "type": "plain_text",
                //                     "emoji": true,
                //                     "text": `${item.like}`
                //                 },
                //                 "style": "primary",
                //                 "value": "click_me_123"
                //             },
                //             {
                //                 "type": "button",
                //                 "text": {
                //                     "type": "plain_text",
                //                     "emoji": true,
                //                     "text": `${item.dislike}`
                //                 },
                //                 "style": "danger",
                //                 "value": "click_me_123"
                //             }
                //         ]
                //     },
                //     {
                //         'type': 'divider'
                //     })
            });

            const message = {
                response_type: 'in_channel',
                blocks: blocks
            };

            return res.json(message);
        } catch (err) {
            console.log("Error")
            console.log(err)
        }


        // const blocks = [
        //     // Result 1
        //     {
        //       type: 'section',
        //       text: {
        //         type: 'mrkdwn',
        //         text: `*Bangalore* \Bangalore City \n\nRating: 4 on Yelp \nPrice: 500`
        //       },
        //       accessory: {
        //         type: 'image',
        //         image_url: `https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg`,
        //         alt_text: 'venue image'
        //       }
        //     },
        //     {
        //       'type': 'context',
        //       'elements': [
        //         {
        //           'type': 'image',
        //           'image_url': 'https://cdn.glitch.com/203fa7da-fadf-4c32-8d75-fb80800ef1b5%2Fyelp_logo_sm.png?1550364622921',
        //           'alt_text': 'Yelp logo'
        //         },
        //         {
        //           'type': 'plain_text',
        //           'text': `200 reviews`,
        //           'emoji': true,
        //           "icon_emoji":":upvote:"
        //         }
        //       ]
        //     },
        //     {
        //       'type': 'divider'
        //     }
        //   ];


    }

    private static async searchLinksByTags(tags: any, res: express.Response) {

        try {
            console.log("TAGS")
            console.log(tags)
            let allLinks: Array<any> = await linkDbModel.find({ "tags": { "$all": tags } }).limit(10).exec();

            console.log("search")
            console.log(allLinks)

            if (allLinks && allLinks.length == 0) {
                return linkService.noResultResponse(res);
            }

            let blocks: Array<any> = [];

            allLinks.forEach(item => {
                let description = item.description ? item.description : " ";
                let topic = item.topic ? item.topic : " ";
                let tags = item.tags ? item.tags : " ";

                blocks.push({
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `${topic}\n${item.link}\n`
                    }
                },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `${description}`
                        }
                    }
                    ,
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `*Tags:*\n${tags}\n*Date:*\n${item.modifiedDate}`
                        },
                        "accessory": {
                            "type": "image",
                            "image_url": "https://api.slack.com/img/blocks/bkb_template_images/approvalsNewDevice.png",
                            "alt_text": "computer thumbnail"
                        }
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "emoji": true,
                                    "text": `${item.like} UpVote`
                                },
                                "style": "primary",
                                "value": "click_me_123"
                            },
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "emoji": true,
                                    "text": `${item.dislike} DownVote`
                                },
                                "style": "danger",
                                "value": "click_me_123"
                            }
                        ]
                    })
            });

            const message = {
                response_type: 'in_channel',
                blocks: blocks
            };

            return res.json(message);
        } catch (err) {
            console.log("Error")
            console.log(err);
        }
    }

}