const { google } = require('googleapis')
const Jotform = require('jotform').default
const { createClient } = require('@supabase/supabase-js')


function supabaseClient () {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SECRET_KEY
    )
}

function googleAuth () {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "http://localhost:3000/auth/google/callback"
    );
}


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
        const supabase = supabaseClient()
        const { data, error } = await supabase
        .from('admin')
        .insert(
            {
                name: 'phin',
                google_token: tokens, 
            }
        )
        if (error) console.log(error)
        res.redirect("http://localhost:3000/calendar");
    },
    async calendarGet(req, res) {
        const oauth2Client = googleAuth()
        const supabase = supabaseClient()
        const { data: adminData, error: adminError } = await supabase
        .from('admin')
        .select('google_token')
        .eq('name', 'phin')
        const tokens = adminData[0].google_token
        oauth2Client.setCredentials(tokens);
        //create calendar client
        const calendar = google.calendar({
            version: "v3",
            auth: oauth2Client
        });
        const result = await calendar.events.list({
            calendarId: "primary",
            //from today onward
            timeMin: new Date().toISOString(),
            timeMax: new Date(
                Date.now() + 1000 * 60 * 60 * 24 * 180
            ).toISOString(),
            //expand recurring
            singleEvents: true,
            orderBy: "startTime"
        });
        const events = result.data.items
        const rows = events.map((event) => {
            return {
                google_id: event.id,
                created_at: event.created,
                start: event.start.dateTime,
                end: event.end.dateTime,
                location: event.location || "No location found",
                timezone: event.start.timeZone,
                description: event.summary || "No description"
            }
        })
        const { bookingdData, bookingError } = await supabase
        .from('booking')
        .upsert(rows,{
            onConflict: 'google_id'
        })
        res.json(events);
    },
    async jotformGet(req, res) {
        const getAllSubmissions = async () => {
            let all = []
            let limit = 100
            let offset = 0

            while (true) {
                const result = await fetch(
                    `https://api.jotform.com/form/223185389394973/submissions?apiKey=${process.env.JOTFORM_API}&limit=${limit}&offset=${offset}`
                );
                const data = await result.json();
                const content = data.content || []
                all.push(...content)
                if (content.length < limit) break
                offset += limit

            }
            console.log(all.length)
            return all
        }
        const unsortedContent = await getAllSubmissions()
        const sortedContent = unsortedContent
        .sort((a, b) => {
            return new Date(a.answers["6"].answer.date) - new Date(b.answers["6"].answer.date)
        })
        .map((item) => {
            return { name: item.answers["3"].prettyFormat, date: item.answers["6"].answer.date}
        })
        res.json(sortedContent);
    }
}

module.exports = controllers