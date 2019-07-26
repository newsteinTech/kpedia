const express = require('express');
const bodyParser = require('body-parser');
const db = require("./db")
const linkModel = require('./link');
const app = express();
db.mongoSetup();

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});



/*
 * Slash Command Endpoint to receive a payload 
 */

app.post('/kpedia', async (req, res) => {


  // Do something!
  //console.log(req.body.text);

  const query = req.body.text ? req.body.text : 'help';
  const queries = query.split(',');
  const command = queries[0];

  if (command.toString().toLocaleLowerCase() == "help") {
    let commandOptions = [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "`Create`        Add Site into Kpedia and get Karma "
        }
      },
      {
        "type": "divider"
      },

      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "`GetAll`        Get All the top rated sites link"
        }
      }
    ];

    const message = {
      response_type: 'in_channel',
      //text: `${places[0].name}`,
      blocks: commandOptions
    };
    return res.json(message);

  }else if(command.toString().toLocaleLowerCase() == "create"){
     if(queries[1] != null){
      let link = queries[1];
      let linKData = {
        "link": link,
        "tags": queries[2]
      }
      let aa = new linkModel.KpediaLink(linKData)
      aa.save();
     return res.json("success")
     }
      
  }


  const blocks = [
    // Result 1
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Bangalore* \Bangalore City \n\nRating: 4 on Yelp \nPrice: 500`
      },
      accessory: {
        type: 'image',
        image_url: `https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg`,
        alt_text: 'venue image'
      }
    },
    {
      'type': 'context',
      'elements': [
        {
          'type': 'image',
          'image_url': 'https://cdn.glitch.com/203fa7da-fadf-4c32-8d75-fb80800ef1b5%2Fyelp_logo_sm.png?1550364622921',
          'alt_text': 'Yelp logo'
        },
        {
          'type': 'plain_text',
          'text': `200 reviews`,
          'emoji': true
        }
      ]
    },
    {
      'type': 'divider'
    },

    // Result 2
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Bangalore* \nBangalore City \n\nRating: 4 on Yelp \nPrice: 1000`
      },
      accessory: {
        type: 'image',
        image_url: `https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg`,
        alt_text: 'venue image'
      }
    },
    {
      'type': 'context',
      'elements': [
        {
          'type': 'image',
          'image_url': 'https://cdn.glitch.com/203fa7da-fadf-4c32-8d75-fb80800ef1b5%2Fyelp_logo_sm.png?1550364622921',
          'alt_text': 'Yelp logo'
        },
        {
          'type': 'plain_text',
          'text': `600 reviews`,
          'emoji': true
        }
      ]
    },
    {
      'type': 'divider'
    }
  ];


  // and send back an HTTP response with data
  const message = {
    response_type: 'in_channel',
    //text: `${places[0].name}`,
    blocks: blocks
  };
  res.json(message);


});

// ⭐️
const getStars = (rating) => {
  let star = '';
  for (let i = 1; i <= rating; i++) {
    star += ':star:';
  }
  star += ` (${rating})`;
  return star;
}

// 💰
const getMoneybags = (price) => {
  if (!price) { return 'N/A' };

  let moneybag = price.replace(/[$]/g, ':moneybag:');
  return moneybag;
}