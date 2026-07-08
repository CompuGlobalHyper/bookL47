const { google } = require('googleapis')
const Jotform = require('jotform').default
const { createClient } = require('@supabase/supabase-js')
const jwt = require('jsonwebtoken')
const { register } = require('node:module')
const bcrypt = require('bcryptjs')
const { generateHours } = require('./prices.js')

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

    async meGet(req, res) {
        const user = req.user
        if (user) {
            return res.status(200).json(
                { 
                    auth: true, 
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    role: user.role
                })
        } else {
            return res.status(200).json({ auth: false })
        }
    },

    async loginPost(req, res) {
        //get id from req.user
        const user = req.user
        if (!user) {
            console.log('login failed')
            //frontend reads res.auth = false
            return res.status(400).json({auth: false})
        }
        //store id in token as well as secret
        jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '8hr'}, (err, token) => {
            if (err) {
                console.error(err);
                //frontend reads res.auth = false
                return res.status(500).json({ auth: false });
            }
            res.cookie('access_token', token, {
                httpOnly: true, //frontend can't read?
                secure: true, //cookie sent over https
                sameSite: 'none', //allow cross site requests
                maxAge: 60000 * 60 * 8 // 1 min * 60 (1hr) * 8 (8hr)
            })
            console.log('login successful, token created')
            //frontend reads res.auth = true
            return res.status(200).json(
                { 
                    auth: true, 
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    role: user.role
                })
        })
    },
    async registerPost(req, res) {
        if (!req.body.firstName
            || !req.body.lastName
            || !req.body.email
            || !req.body.password) {
                return res.status(400).json({error: "Missing fields"})
            }
        const password = await bcrypt.hash(req.body.password, 10)
        const user = {
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            password: password
        }
        const supabase = supabaseClient()
        const { data, error } =  await supabase
        .from('user')
        .insert(user)

        if (error) {
            return res.status(400).json({error: error})
        }
        return res.status(200).json({message: 'successful registration'})
    },

    async cartGet(req, res) {
        if (!req.user) {
            return res.status(401).json({ message: 'not logged in' })
        }
        const user = req.user[0]
        const supabase = supabaseClient()
        const { data, error } = await supabase
        .from('cart')
        .select('*')
        .eq("user_id", user.id)
        if (error) {
            console.log(error)
            res.status(500).json({message: "Database error"})
        }
        res.status(200).json(data)
    },
    async cartPost(req, res) {
        const supabase = supabaseClient()
        if (!req.user) {
            return res.status(401).json({ message: 'not logged in' })
        }

        const booking = req.body.booking
        const hours = generateHours(booking.start, booking.end)
        let hourly_rate
        let price
        const user = req.user[0]
        if (user.role === 'member') {
            const {data: priceData, error: priceError} = await supabase
            .from('location')
            .select('price')
            .eq('id', booking.location_id)
            if (priceError) {
                return console.log(priceError)
            }
            console.log(data)
        }

        const { data, error } = await supabase
        .from('cart')
        .insert({...booking, user_id: user.id, hours, })
        if (error) console.log(error)
        res.json(data)

    },
    async cartDelete(req, res) {
        const id = req.body.id
        const supabase = supabaseClient()
        const { data, error } = await supabase
        .from('cart')
        .delete()
        .eq("id", id)
        if (error) {
            console.log(error)
            return res.status(500).json({message: "Database error"})
        }
        return res.status(200).json({message: "Successful delete"})
        
    },
    async cartPut(req, res) {
        const supabase = supabaseClient()
        const id = req.body.id
        const newItem = req.body.newItem
        console.log(newItem)
        if (req.body.checked === undefined) {
            const { data, error } = await supabase
                .from('cart')
                .update({description: newItem})
                .eq("id", id)
            if (error) {
                console.log(error)
                return res.status(500).json({message: "Database error"})
            }
            return res.status(200).json(data)
        }
        const { data: equipmentData, error: equipmentError } = await supabase
            .from('cart')
            .select('equipment_request')
            .eq("id", id)
        if (equipmentError) {
            console.log(equipmentError)
            return res.status(500).json({message: "Database error"})
        }
        console.log(equipmentData)
        let equipmentCopy = equipmentData[0].equipment_request.map(item => item)
        if (req.body.checked) {
            equipmentCopy.push(newItem)
        } else {
            equipmentCopy = equipmentCopy.filter((item) => item !== newItem)
        }
        const { data: updateData, error: updateError } = await supabase
            .from('cart')
            .update({equipment_request: equipmentCopy})
            .eq("id", id)
            .select('*')
        if (updateError) {
            console.log(updateError)
            res.status(500).json({message: "Database error"})
        }
        res.status(200)
    },

    async checkoutGet(req, res) {

    },

    async checkoutPost(req, res) {

    },
    async logoutGet(req, res) {
        res.clearCookie("access_token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: '/',
        });
        console.log('logging you out..')
        res.sendStatus(200)

    },






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
    //get the token & store in db
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
    //populate db with google calendar data
    async calendarGet(req, res) {
        const oauth2Client = googleAuth()
        const supabase = supabaseClient()
        //get saved admin credentials
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
        //get 180 days of events from Google calendar
        const result = await calendar.events.list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            timeMax: new Date(
                Date.now() + 1000 * 60 * 60 * 24 * 180
            ).toISOString(),
            singleEvents: true,
            orderBy: "startTime"
        });
        //cleanup
        const events = result.data.items
        //arrange for Supabase upload
        const rows = events.map((event) => {
            return {
                google_id: event.id,
                room: event.location || "No location found",
                created_at: event.created,
                date: event.start.dateTime.split('T')[0],
                start: event.start.dateTime.split('T')[1].split('-')[0],
                end: event.end.dateTime.split('T')[1].split('-')[0],
                timezone: event.start.timeZone,
                description: event.summary || "No description"
            }
        })
        //upload 180 days of events to Supabase
        const { data: bookingdData, error: bookingError } = await supabase
        .from('google_calendar')
        .upsert(rows,{
            onConflict: 'google_id'
        })
        //create list of next 180 days
        const next180 = []
        for (let i = 0; i < 180; i++) {
            newDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * i )
            newDateStr = newDate.toISOString().split('T')[0]
            next180.push({ booking_date: newDateStr })
        }
        //insert next 180 days into date table
        const { data: dateData, error: dateError } = await supabase
        .from('date')
        .upsert(next180,{
            onConflict: 'booking_date'
        })
        //create list of all rooms
        const { data: roomData, error: roomError } = await supabase
        .from('location')
        .select('name')
        
        const bookingData = next180.map((date) => {
            let roomsAndSlots = roomData.map((room) => {
                let filteredBookings = rows.filter((row) => row.room === room.name && row.date === date.booking_date)
                let timeObjects = filteredBookings.map((booking) => {
                    return { start: booking.start, end: booking.end }
                })
                return { name: room.name, filledTimes: timeObjects}
            })
            return { date: date.booking_date, rooms: roomsAndSlots }
        })

        res.json(bookingData);
    },
    //populate db with jotform data
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
    },
    //get room data
    async roomsGet(req, res) {
        const supabase = supabaseClient()
        const { data, error } = await supabase
        .from('location')
        .select('*')
        if (error) return console.log(error)
        return res.status(200).json(data)
    }
        
}

module.exports = controllers