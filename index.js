/* ********************************************************
 * Slack Node+Express Slash Commands Example with BlockKit
 *
 * Tomomi Imura (@girlie_mac)
 * ********************************************************/

const express = require('express');
const bodyParser = require('body-parser');


const app = express();

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});



/*
 * Slash Command Endpoint to receive a payload 
 */

app.post('/command', async (req, res) => {
  

    // Do something!
    //console.log(req.body.text);
    
    const query = req.body.text ? req.body.text : 'lunch, San Francisco';
    const queries = query.split(',');
    const term = queries.shift(); // "Pizza" 
    const location = queries; // "San Francisco, CA"
    
    
    
    
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
    
    



const getPlaces = async(term, location) => {  
  const header = {
    Authorization: `Bearer ${process.env.YELP_API_KEY}`
  };
  const url = `https://api.yelp.com/v3/businesses/search?limit=3&open_now=true&location=${location}&term=${term}`;
  const results = await axios.get(url, {headers: header});  
  return results.data.businesses;

};

// ⭐️
const getStars = (rating) => {
  let star = '';
  for(let i=1; i<=rating; i++){
    star += ':star:';
  }
  star += ` (${rating})`;
  return star;
}

// 💰
const getMoneybags = (price) => {
  if(!price) { return 'N/A'};
  
  let moneybag =  price.replace(/[$]/g, ':moneybag:');
  return moneybag;
}