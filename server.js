
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Your 46elks credentials
const apiUsername = 'your 46elks usernme';
const apiPassword = 'your 46elks password';

// Endpoint to receive messages
app.post('/messages', async (req, res) => {
    try {
        const incomingMsg = req.body.message;
        const senderNumber = req.body.from;

        if (incomingMsg.toLowerCase().includes('titta')) {
            // Fetch real estate listing details
            const listingDetails = 'Listing details: \n Price 40 000 000kr \n Bostadstyp: Lägenhet \n Upplåtelseform: Bostadsrätt \n Antal rum: 6 rum \n Boarea: 199 m² \n Byggår: 2020 \n http://tinyurl.com/mv4554zw';
            const listingImage = 'https://opsje.github.io/my-vcfcard/0f09ccf92bba6d30cac4d577149c96bd-2small.jpeg';

            // Send an MMS response with the listing details and image
            await sendMMS(senderNumber, listingDetails, listingImage);
        } else {
            // Send an error SMS
            const errorMessage = 'Sorry, your request could not be processed. Please check the keyword and try again.';
            await sendSMS(senderNumber, errorMessage);
        }

        res.status(200).end();
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).send('Internal Server Error');
    }
});

function sendSMS(toNumber, message) {
    const smsData = new URLSearchParams();
    smsData.append('from', 'Your virtual phonenumber (mms functionality)');
    smsData.append('to', toNumber);
    smsData.append('message', message);


    const auth = Buffer.from(apiUsername + ':' + apiPassword).toString('base64');

    console.log('Authorization Header:', 'Basic ' + auth); // Debug: Log the auth header

    fetch('https://api.46elks.com/a1/sms', {
        method: 'POST',
        body: smsData,
        headers: {
            'Authorization': 'Basic ' + auth
        }
    })
    .then(response => {
        console.log('Response Status:', response.status); // Debug: Log the response status
        return response.text();
    })
    .then(text => console.log('SMS sent successfully:', text))
    .catch(error => console.error('Error sending SMS:', error));
}
function sendMMS(toNumber, message, imageUrl) {
    const mmsData = new URLSearchParams();
    mmsData.append('from', 'Your virtual phonenumber (mms functionality)');
    mmsData.append('to', toNumber);
    mmsData.append('message', message);
    mmsData.append('image', imageUrl);

    const auth = Buffer.from(apiUsername + ':' + apiPassword).toString('base64');

    fetch('https://api.46elks.com/a1/mms', {
        method: 'POST',
        body: mmsData,
        headers: {
            'Authorization': 'Basic ' + auth
        }
    })
    .then(response => response.text())
    .then(text => console.log('MMS sent successfully:', text))
    .catch(error => console.error('Error sending MMS:', error));
}

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});






