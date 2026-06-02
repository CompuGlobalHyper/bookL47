const { google } = require('googleapis')
const Jotform = require('jotform').default


function googleAuth () {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "http://localhost:3000/auth/google/callback"
    );
}

let storedTokens = null

const controllers = {
    //sign in to get auth
    googleAuthGet(req, res) {
        const oauth2Client = googleAuth()
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: [
                "https://www.googleapis.com/auth/calendar.readonly"
            ],
            prompt: "consent"
        });
    //redirect to the callback page
    res.redirect(url);
    },
    async googleAuthCallbackGet(req, res) {
        //get access and refresh token
        const oauth2Client = googleAuth()
        const code = req.query.code;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        console.log("TOKENS:", tokens);
        //store in db
        storedTokens = tokens
        res.redirect("http://localhost:3000/calendar");
    },
    async calendarGet(req, res) {
        const oauth2Client = googleAuth()
        oauth2Client.setCredentials(storedTokens);
        //create calendar client
        const calendar = google.calendar({
            version: "v3",
            auth: oauth2Client
        });
        const result = await calendar.events.list({
            calendarId: "primary",
            //from today onward
            timeMin: new Date().toISOString(),
            maxResults: 50,
            //expand recurring
            singleEvents: true,
            orderBy: "startTime"
        });
        res.json(result.data.items);
    },
    async jotformGet(req, res) {
        const result = await fetch(
            `https://api.jotform.com/form/223185389394973/submissions?apiKey=${process.env.JOTFORM_API}`
        );

        data = await result.json();
        const content = data.content
        const sortedContent = content
        .sort((a, b) => {
            return new Date(a.answers["6"].answer.date) - new Date(b.answers["6"].answer.date)
        })
        .map((item) => {
            return { name: item.answers["3"].prettyFormat, date: item.answers["6"].answer.date}
        })
        const sortedData = {content: sortedContent}
        res.json(sortedData);
    }
}

module.exports = controllers