const { google } = require('googleapis')

function googleAuth () {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "http://localhost:3000/auth/google/callback"
    );
}

let storedTokens = null


const controllers = {
    googleAuthGet(req, res) {
        const oauth2Client = googleAuth()
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: [
                "https://www.googleapis.com/auth/calendar.readonly"
            ],
            prompt: "consent"
        });
    res.redirect(url);
    },
    async googleAuthCallbackGet(req, res) {
        const oauth2Client = googleAuth()
        const code = req.query.code;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        console.log("TOKENS:", tokens);
        storedTokens = tokens

        res.redirect("http://localhost:3000/calendar");
    },
    async calendarGet(req, res) {
        const oauth2Client = googleAuth()
        oauth2Client.setCredentials(storedTokens);
        const calendar = google.calendar({
            version: "v3",
            auth: oauth2Client
        });
        const result = await calendar.events.list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            maxResults: 50,
            singleEvents: true,
            orderBy: "startTime"
        });
        res.json(result.data.items);
    }
}

module.exports = controllers