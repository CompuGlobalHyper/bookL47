const { google } = require('googleapis')
const Jotform = require('jotform').default
const { createClient } = require('@supabase/supabase-js')
const squareClient = require("./square");
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { generateHours, getTotal, createFee } = require('./prices.js')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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

async function sendVerificationEmail (user) {
    const supabase = supabaseClient()
    try {
        const token = crypto.randomBytes(32).toString("hex");
        const token_hash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")
        const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24) //24 hours
        const { error } = await supabase
        .from("email_verification")
        .upsert(
            {
                user_id: user.id,
                token_hash,
                expires_at,
            },
            {
                onConflict: "user_id",
            }
        );
        if (error) {
            throw error;
        }
        const link = `${process.env.CLIENT_URL}/email-verification?token=${token}`
        await sgMail.send({
            to: user.email,
            from: "info@afm47.org",
            subject: "Book L47: Email verification link",
            html: 
                `<body style="
                margin: 0;
                padding: 40px;
                background-color: #f4f4f4;
                font-family: Arial, Helvetica, sans-serif;
                ">
                <div style="
                    max-width: 500px;
                    margin: 0 auto;
                    background: white;
                    padding: 40px;
                    border-radius: 2px;
                ">
                    <div style="
                    text-align: center;
                    margin-bottom: 30px;
                    ">
                    <h1 style="
                        margin: 0;
                        font-size: 28px;
                        color: #222;
                    ">
                        Book L47
                    </h1>
                    </div>
                    <h2 style="
                    color: #222;
                    font-size: 22px;
                    margin-bottom: 20px;
                    ">
                    Verify your email
                    </h2>
                    <p style="
                    color: #555;
                    font-size: 16px;
                    line-height: 1.5;
                    ">
                    An email verification request was made for your Book L47 account.
                    </p>
                    <p style="
                    color: #555;
                    font-size: 16px;
                    line-height: 1.5;
                    ">
                    Click the button below to verify your email address. This link will expire in 24 hours.
                    </p>
                    <div style="
                    text-align: center;
                    margin: 30px 0;
                    ">
                    <a 
                        href="${link}"
                        style="
                        cursor: pointer;
                        font-weight: 900;
                        background-color: rgb(1, 179, 227);
                        color: white;
                        padding: 14px 28px;
                        border-radius: 2px;
                        text-decoration: none;
                        font-size: 16px;
                        display: inline-block;
                        "
                    >
                        Verify Email
                    </a>
                    </div>
                    <hr style="
                    border: none;
                    border-top: 1px solid #ddd;
                    margin: 30px 0;
                    "></hr>
                    <p style="
                    color: #888;
                    font-size: 12px;
                    text-align: center;
                    ">
                    Book L47<br></br>
                    booking@afm47.org<br></br>
                    323.993.3172
                    </p>
                    </div>
                </body>`
        })
        return true
    } catch (error) {
        console.log(error)
        return null
    }
}


const controllers = {

    //User profile routes
    async meGet(req, res) {
        const user = req.user
        if (user) {
            return res.status(200).json(
                { 
                    auth: true, 
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    role: user.role,
                    verified: user.verified
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
        jwt.sign({ id: user.id, sessionVersion: user.session_version }, process.env.JWT_SECRET, {expiresIn: '8hr'}, (err, token) => {
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
                    role: user.role,
                    verified: user.verified
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
        .select('*')
        if (error) {
            return res.status(400).json({error: error})
        }
        console.log('Created user')
        const userData = data[0]
        const sentEmail = await sendVerificationEmail(userData)
        if (!sentEmail) {
            console.log('Failed to send email verification')
        }
        return res.status(200).json({message: 'Successful registration'})
    },
    async logoutGet(req, res) {
        res.clearCookie("access_token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: '/',
        });
        console.log('logging you out..')
        return res.status(200).json({ role: 'guest' })

    },
    async resendEmailVerification(req, res) {
        const user = req.user
        console.log(user)
        const sentEmail = await sendVerificationEmail(user)
        if (sentEmail) {
            return res.status(200).json({ message: 'Sent verification email!'})
        } else {
            return res.status(400).json({ message: 'Verification email could not be sent'})
        }
    },
    async verifyEmail(req, res) {
        const { token } = req.body
        if (!token) {
            return res.status(400).json({message: 'Invalid or expired link.'})
        }
        try {
            const hash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")
            const supabase = supabaseClient()
            const { data, error } = await supabase
            .from('email_verification')
            .select('*')
            .eq('token_hash', hash)
            if (error) {
                throw(error)
            }
            if (!data[0]) {
                return res.status(400).json({message: 'Invalid or expired link.'})
            }
            if (new Date(data[0].expires_at) <= new Date() ) {
                return res.status(400).json({message: 'Invalid or expired link.'})
            }
            const { data: userData, error: userError } = await supabase
            .from('user')
            .update({verified: true})
            .eq('id', data[0].user_id)
            return res.status(200).json({message: 'Success!'})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Error processing request'})
        }

    },
    async passwordForgot(req, res) {
        try {
            const email = req.body.email
            const supabase = supabaseClient()
            const { data: userData, error: userError } = await supabase
            .from('user')
            .select('*')
            .eq('email', email)
            if (userError) {
                throw(userError)
            }
            const user = userData[0]
            if (!user) {
                return res.status(200).json({message: 'If account exists, sent an email.'})
            }
            const token = crypto.randomBytes(32).toString("hex");
            const token_hash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")
            const expires_at = new Date(Date.now() + 1000 * 60 * 60) //60 minutes
            const { data: resetData, error: resetError} = await supabase
            .from('password_reset')
            .insert({ 
                user_id: user.id,
                token_hash,
                expires_at
            })
            if (resetError) {
                throw(resetError)
            }
            const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`
            await sgMail.send({
                to: email,
                from: "info@afm47.org",
                subject: "Book L47: Password reset link",
                html: 
                    `<body style="
                    margin: 0;
                    padding: 40px;
                    background-color: #f4f4f4;
                    font-family: Arial, Helvetica, sans-serif;
                    ">
                    <div style="
                        max-width: 500px;
                        margin: 0 auto;
                        background: white;
                        padding: 40px;
                        border-radius: 2px;
                    ">
                        <div style="
                        text-align: center;
                        margin-bottom: 30px;
                        ">
                        <h1 style="
                            margin: 0;
                            font-size: 28px;
                            color: #222;
                        ">
                            Book L47
                        </h1>
                        </div>
                        <h2 style="
                        color: #222;
                        font-size: 22px;
                        margin-bottom: 20px;
                        ">
                        Reset your password
                        </h2>
                        <p style="
                        color: #555;
                        font-size: 16px;
                        line-height: 1.5;
                        ">
                        A password reset request was made for your Book L47 account.
                        </p>
                        <p style="
                        color: #555;
                        font-size: 16px;
                        line-height: 1.5;
                        ">
                        Click the button below to reset your password. This link will expire in 1 hour.
                        </p>
                        <div style="
                        text-align: center;
                        margin: 30px 0;
                        ">
                        <a 
                            href="${link}"
                            style="
                            cursor: pointer;
                            font-weight: 900;
                            background-color: rgb(1, 179, 227);
                            color: white;
                            padding: 14px 28px;
                            border-radius: 2px;
                            text-decoration: none;
                            font-size: 16px;
                            display: inline-block;
                            "
                        >
                            Reset Password
                        </a>
                        </div>
                        <p style="
                        color: #555;
                        font-size: 14px;
                        line-height: 1.5;
                        ">
                        If you did not request a password reset, you can safely ignore this email.
                        Your password will remain unchanged.
                        </p>
                        <hr style="
                        border: none;
                        border-top: 1px solid #ddd;
                        margin: 30px 0;
                        "></hr>
                        <p style="
                        color: #888;
                        font-size: 12px;
                        text-align: center;
                        ">
                        Book L47<br></br>
                        booking@afm47.org<br></br>
						323.993.3172
                        </p>
                        </div>
                    </body>`
            })
            return res.status(200).json({message: 'If account exists, sent an email.'})

        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Error processing request'})
        }
        

    },
    async passwordReset(req, res) {
        const { token, password } = req.body
        if (!token || !password || password.length < 8) {
            return res.status(400).json({message: 'Invalid or expired reset link.'})
        }
        try {
            const hash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")
            const supabase = supabaseClient()
            const { data: resetData, error: resetError } = await supabase
            .from('password_reset')
            .select('*')
            .eq('token_hash', hash)
            if (resetError) {
                throw(resetError)
            }
            if (!resetData[0]) {
                return res.status(400).json({message: 'Invalid or expired reset link.'})
            }
            if (new Date(resetData[0].expires_at) <= new Date() ) {
                return res.status(400).json({message: 'Invalid or expired reset link.'})
            }
            const { data: userData, error: userError } = await supabase
            .from('user')
            .select('*')
            .eq('id', resetData[0].user_id)
            const user = userData[0]
            const hashedPassword = await bcrypt.hash(password, 10)

            const { data: updateData, error: updateError } = await supabase
            .from('user')
            .update({ password: hashedPassword, session_version: user.session_version + 1 })
            .eq('id', user.id)
            if (updateError) {
                throw(updateError)
            }
            const { data: deleteData, error: deleteError } = await supabase
            .from('password_reset')
            .delete()
            .eq('token_hash', hash)
            if (deleteError) {
                throw(deleteError)
            }
            return res.status(200).json({message: 'Success!'})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Error processing request'})
        }
    },
    async profilePut(req, res) {
        const user = req.user
        const {firstName, lastName, email} = req.body
        const supabase = supabaseClient()
        console.log('attempting to update')
        try {
            const {error: updateError} = await supabase
            .from('user')
            .update({first_name: firstName, last_name: lastName, email, verified: false})
            .eq('id', user.id)
            if (updateError) {
                throw updateError
            }
            return res.status(200).json({message: 'Profile updated successfully, please re-verify email.'})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Database error, could not update.'})

        }

    },
    async linkAccountPost(req, res) {
        const memberId = Number(req.body.memberId)
        console.log(memberId)
        const id = req.user.id
        const supabase = supabaseClient()
        try {
            const {data: memberData, error: memberError} = await supabase
            .from('member')
            .select('*')
            .eq('id', memberId)
            if (memberError) {
                throw memberError
            }
            console.log(memberData)
            if (memberData[0]?.id === memberId
                && memberData[0]?.user_id === null
            ) {
                let role
                if (memberData[0].status === 'Life') {
                    role = 'life'
                }
                if (memberData[0].status === 'Regular') {
                    role = 'member'
                }
                const {error: userError} = await supabase
                .from('user')
                .update({member_id: memberId, role})
                .eq('id', id)
                if (userError) {
                    throw userError
                }

                const {error: updateError} = await supabase
                .from('member')
                .update({user_id: id})
                .eq('id', memberId)
                if (updateError) {
                    throw updateError
                }
                return res.status(200).json({message: "Member account linked!"})
            } else {
                return res.status(500).json({message: "No matching account found."})
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: "No matching account found."})

        }
        


    },
    //Current booking routes
    async bookingsGet(req, res) {
        if (!req.user) {
            return res.status(401).json({ message: 'not logged in' })
        }
        const now = new Date().toISOString()
        const upcomingPage = Number(req.query.upcomingPage) || 1;
        const pastPage = Number(req.query.pastPage) || 1;
        const amount = Number(req.query.amount) || 5;

        const upcomingFrom = (upcomingPage - 1) * amount;
        const upcomingTo = upcomingFrom + amount - 1;
        const pastFrom = (pastPage - 1) * amount;
        const pastTo = pastFrom + amount - 1;

        const user = req.user
        const supabase = supabaseClient()
        const { data: upcomingData, count: upcomingCount, error: upcomingError} = await supabase
        .from('booking')
        .select('*', {count: 'exact'})
        .eq("user_id", user.id)
        .gte('ends_at', now)
        .range(upcomingFrom, upcomingTo)
        .order('starts_at', { ascending: true })
        if (upcomingError) {
            console.log(upcomingError)
            return res.status(500).json({message: "Database error"})
        }
        const { data: pastData, count: pastCount, error: pastError} = await supabase
        .from('booking')
        .select('*', {count: 'exact'})
        .eq("user_id", user.id)
        .lt('ends_at', now)
        .range(pastFrom, pastTo )
        if (pastError) {
            console.log(pastError)
            return res.status(500).json({message: "Database error"})
        }
        return res.status(200).json({upcoming: upcomingData, upcomingCount, past: pastData, pastCount})
    },
    async bookingsCancel(req, res) {
        const id = req.body.id
        let message
        try {
            const supabase = supabaseClient()
            const { data: bookingData, error: bookingError } = await supabase
            .from('booking')
            .select('*')
            .eq("id", id)
            if (bookingError) {
                throw(bookingError)
            }
            const booking = bookingData[0]
            const now = new Date()
            const hoursUntilBooking = ((new Date(booking.starts_at) - now) / (1000 * 60 * 60))
            if (hoursUntilBooking < 48) {
                const { error: cancelError } = await supabase
                .from('booking')
                .update({ status: 'cancelled' })
                .eq("id", booking.id)
                if (cancelError) {
                    throw(cancelError)
                }
                message = "Cancelled booking, non-refundable"
            } else {
                const price = booking.price
                const paymentId = booking.payment_id
                const { refund } = await squareClient.refunds.refundPayment({
                    idempotencyKey: crypto.randomUUID(),
                    paymentId,
                    amountMoney: {
                        amount: BigInt(price * 100),
                        currency: "USD",
                    },
                });
                const { error: refundError } = await supabase
                .from('booking')
                .update({ status: 'cancelled', refund_id: refund.id })
                .eq("id", booking.id)
                if (refundError) {
                    throw(refundError)   
                }
                const { data: paymentData, error: paymentError } = await supabase
                .from('payment')
                .select('refunded_amount')
                .eq("id", paymentId)
                .single()
                if (paymentError) {
                    throw(paymentError)   
                }
                const { error: updatePaymentError } = await supabase
                .from('payment')
                .update({refunded_amount: paymentData.refunded_amount + (price * 100)})
                .eq("id", paymentId)
                if (updatePaymentError) {
                    throw(updatePaymentError)   
                }
                message = "Cancelled booking, refund pending"
            }
            console.log(booking.google_id)
            if (booking.google_id) {
                //retrieve google calendar tokens
                const oauth2Client = googleAuth()
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
                await calendar.events.delete({
                calendarId: 'c_lk6ofmjl263kkl6h66dai4orr8@group.calendar.google.com',
                eventId: booking.google_id,
                });
                console.log('Google event deleted successfully.');
            }
            return res.status(200).json({message})
        } catch(error) {
            console.log(error)
            return res.status(500).json({error: error.message})
        }
    },
    //Cart routes
    async cartGet(req, res) {
        if (!req.user) {
            return res.status(401).json({ message: 'not logged in' })
        }
        const user = req.user
        const supabase = supabaseClient()
        const { data: cartData, error: cartError } = await supabase
            .from('cart')
            .select('*')
            .eq("user_id", user.id)
            if (cartError) {
                console.log(cartError)
                return res.status(500).json({message: "Database error"})
        }
        async function checkConflicts(cart) { 
            for (const item of cart) {
                const { data: bookingData, error: bookingError } = await supabase
                .from('booking')
                .select('id')
                .eq('location_id', item.location_id)
                .lt('starts_at', item.ends_at)
                .gt('ends_at', item.starts_at)
                .neq('status', 'refunded')
                .neq('status', 'cancelled')
                if (bookingError) {
                    throw(bookingError)
                }
                const status = bookingData.length > 0 ? 'conflict' : 'pending'
                item.status = status
                const { error: updateError } = await supabase
                .from('cart')
                .update({status: status})
                .eq('id', item.id)
                if (updateError) {
                    console.log(updateError)
                    return res.status(500).json({message: "Database error"})
                }
            }
            return cart      
        }
        const updatedCart = await checkConflicts(cartData)
        return res.status(200).json(updatedCart)
    },
    async cartPost(req, res) {
        const supabase = supabaseClient()
        if (!req.user) {
            return res.status(401).json({ message: 'not logged in' })
        }

        const booking = req.body.booking
        const hours = generateHours(booking.start, booking.end)
        let hourly_rate = null
        let price
        const user = req.user
        if (user.role === 'member' || user.role === 'life') {
            const { data: priceData, error: priceError } = await supabase
            .from('location')
            .select('price')
            .eq('id', booking.location_id)
            if (priceError) {
                console.log(priceError)
                return res.status(500).json({ message: "There was a pricing error" })
            }
            if (user.role === 'life') {
                price = priceData[0].price - 5
            } else {
                price = priceData[0].price
            }         
        }
        if (user.role === 'nonMember') {
            hourly_rate = 65
            price = hourly_rate * hours
        }
        if (user.role === 'admin') {
            hourly_rate = 0
            price = 0
        }
        const { data, error } = await supabase
        .from('cart')
        .insert({...booking, user_id: user.id, hours, price, hourly_rate})
        if (error) {
            console.log(error)
            return res.status(500).json({ message: "There was a database error" })
        }
        return res.status(200).json(data)
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
            return res.status(500).json({message: "Database error"})
        }
        res.sendStatus(200)
    },
    //Checkout routes
    async checkoutGet(req, res) {
    },
    async checkoutPost(req, res) {
    },
    async paymentPost(req, res) {
        const { sourceId, locationId, idempotencyKey } = req.body
        if (!req.user) {
            return res.status(401).json({ message: 'not logged in' })
        }
        const user = req.user
        try {
            const supabase = supabaseClient()
            //retrieve data from cart db
            const { data: cartData, error: cartError } = await supabase
            .from('cart')
            .select('*')
            .eq("user_id", user.id)
            if (cartError) {
                    throw cartError;
            }
            //calculate prices
            const subtotal = Number(getTotal(cartData))
            const fee = Number(createFee(subtotal))
            const amount = Math.round((subtotal + fee) * 100)
            //insert data into booking db with pending status
            const { data: bookingData, error: bookingError } = await supabase
                .from('booking')
                .insert(cartData.map((booking) => ({
                    ...booking,
                    status: 'pending'
                })))
                .select('*')
            if (bookingError) {
                throw bookingError;
            }

            console.log('reached backend payment step')
            //attempt to charge the provided credit card
            const payment = await squareClient.payments.create({
                sourceId,
                idempotencyKey,
                locationId,
                amountMoney: {
                    amount: BigInt(amount),
                    currency: "USD"
                }
            });
            const paymentId = payment.payment.id
            const total_amount = Number(payment.payment.amountMoney.amount)
            const currency = payment.payment.amountMoney.currency
            //add data to payments db
            const { data: paymentData, error: paymentError } = await supabase
            .from('payment')
            .insert( {
                id: paymentId,
                total_amount,
                currency,
                user_id: user.id
            })
            if (paymentError) {
                throw paymentError;
            }
            //retrieve google calendar tokens
            const oauth2Client = googleAuth()
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
            //create booking objects for Google calendar
            const eventsList = bookingData.map((booking) => {
                return ({
                    id: booking.id,
                    event:{
                        'summary': `${booking.location} - ${booking.first_name} ${booking.last_name}`,
                        'location': `${booking.location}`,
                        'description': `${booking.equipment_request.join(', ')}
                        ${booking.description}`,
                        'start': {
                            'dateTime': booking.starts_at,
                            'timeZone': booking.timezone
                        },
                        'end': {
                            'dateTime': booking.ends_at,
                            'timeZone': booking.timezone
                        }
                    }
                })
            })
            //add to Google calendar
            for (const bookingEvent of eventsList) {
                await calendar.events.insert({
                calendarId: 'c_lk6ofmjl263kkl6h66dai4orr8@group.calendar.google.com',
                resource: bookingEvent.event,
                }, async function(err, event) {
                    if (err) {
                        console.log('There was an error contacting the Calendar service: ' + err);
                        return;
                    }
                    console.log('Event created:', event.data.id);
                    const { error: updateError } = await supabase
                    .from("booking")
                    .update({
                        status: "paid",
                        payment_id: paymentId,
                        google_id: event.data.id
                    })
                    .eq("id", bookingEvent.id);
                    if (updateError) {
                        throw updateError;
                    }
                });
                
            }
            const { data: deleteData, error: deleteError } = await supabase
            .from('cart')
            .delete()
            .eq("user_id", user.id)
            if (deleteError) {
                throw deleteError;
            }
            return res.status(200).json({ success: true, paymentId: payment.payment.id });
        } catch(error) {
            console.log(error);
            res.status(400).json({
                error: error.message
            });
        }

    },
    async confirmationGet(req, res) {
        const user = req.user
        if (!req.user) {
            return res.status(401).json({ message: 'not logged in' })
        }
        const paymentId = req.query.payment
        const supabase = supabaseClient()
        try {
            const {data: paymentData, error: paymentError} = await supabase
            .from('payment')
            .select('*')
            .eq('id', paymentId)
            .single()
            
            if (!paymentData.id) {
                return res.status(422).json({message: "Expired or invalid link"})
            }
            if (paymentData.user_id !== user.id) {
                return res.status(422).json({message: "Expired or invalid link"})
            }
            const now = new Date()
            const createdAt = new Date(paymentData.created_at)
            const minutesPassed = Math.floor((now - created) / 1000 * 60) // ms * secs
            if (minutesPassed > 15) {
                return res.status(422).json({message: "Expired or invalid link"})
            }
            return res.status(200).json({message: "Confirmation page allowable"})

        } catch(error) {
            console.log(error)
            return res.status(500).json({ message: 'Database error' })
        }
        
    },
    

    //sign in to get auth
    googleAuthGet(req, res) {
        const oauth2Client = googleAuth()
        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: [
                "https://www.googleapis.com/auth/calendar"
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
        .upsert(
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
        try {
            //get saved admin credentials
            const { data: adminData, error: adminError } = await supabase
            .from('admin')
            .select('google_token')
            .eq('name', 'phin')
            if (adminError) {
                throw adminError
            }
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
            //cleanup data
            const events = result.data.items
            //arrange for Supabase upload
            const rows = events.map((event) => {
                return {
                    google_id: event.id,
                    location: event.location || "No location found",
                    created_at: event.created,
                    date: event.start.dateTime.split('T')[0],
                    start: event.start.dateTime.split('T')[1].split('-')[0],
                    end: event.end.dateTime.split('T')[1].split('-')[0],
                    timezone: event.start.timeZone,
                    title: event.summary || "No title available",
                    description: event.description
                }
            })
            //upload 180 days of events to Supabase
            const { data: bookingData, error: bookingError } = await supabase
            .from('booking')
            .upsert(rows,{
                onConflict: 'google_id'
            })
            .select('*')
            if (bookingError) {
                throw bookingError
            }
            //create list of next 180 days
            const next180 = []
            for (let i = 0; i < 180; i++) {
                newDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * i )
                newDateStr = newDate.toISOString().split('T')[0]
                next180.push(newDateStr)
            }
            //create list of all rooms
            const { data: roomData, error: roomError } = await supabase
            .from('location')
            .select('name')
            if (roomError) {
                throw roomError
            }
            const calendarData = next180.map((date) => {
                let roomsAndSlots = roomData.map((room) => {
                    let filteredBookings = bookingData.filter((row) => row.location === room.name && row.date === date)
                    let timeObjects = filteredBookings.map((booking) => {
                        return { start: booking.start, end: booking.end }
                    })
                    return { name: room.name, filledTimes: timeObjects}
                })
                return { date: date, rooms: roomsAndSlots }
            })
            res.status(200).json(calendarData);
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Database Error"})
        }
        
        
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