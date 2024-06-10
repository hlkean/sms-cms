# SMS -> CMS 
This repo is a tool to make managing and updating content on websites built using various CMS offerings easier.

Many small business owners use CMS products to manage their digital presence. These tools are invaluable, but often require users to log into clunky, non-responsive web interfaces to make small content updates. When you're on the go or have more business critical tasks to focus on, finding the time for this can be a big task. Creating a SMS-based interface for updating content will make this process faster, and easier, and therefore lead to more accurate and up to date content on sites. This ultimately benefits business owners and the customers they serve.


## Running the project
You'll need to configure your project with a .env file with the following values:

ACCOUNT_ID: WIX account ID
SITE_ID: WIX site ID
API_KEY: WIX API Key
TWILIO_PHONE: Twilio 'From' phone number
TWILIO_AUTH_TOKEN: Twilio Auth Token
TWILIO_SID: Twilio SID
TO_PHONE: Twilio to phone number 

To test, you'll need to have ngrok installed. In the root of the repository, run `node index.js` to start the Express serve on port 3000. Then in a separate terminal instance, run `ngrok http http://localhost:3000`. Now update your incoming SMS webhook in Twilio to point to the ngrok tunnel endpoint. Then send your Twilio number a comma separated text like this: "title, description content"