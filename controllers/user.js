const bcrypt = require('bcrypt');
const { User, validate, validateEmail, validateProfileUpdate} = require('../models/User');
const { newCloudinary1 } = require("../services/cloudinary");
const { generateCode } = require("../services/utils");
// const fs = require("fs");
const {mailService} = require('../services/mail');


const user = {
    //create user
    createUser: async (req, res) => {
        // //check for validation errors
        const { error } = validateEmail(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //check for already registered user email
        let user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (user) return res.status(400).send({ success: false, message: 'Email already registered' });

        //check for already registered username
        user = await User.findOne({ username: req.body.username.toLowerCase() });
        if (user) return res.status(400).send({ success: false, message: 'Username already taken' });

        // define req.body variables
        const username = req.body.username;
        const email = req.body.email;
        const code = generateCode();
        const phone = req.body.phone;
        const name = "";
        const password = "";
        const school = "";
        const department = "";
        const country = "";
        const region = "";
        const displayPicture = "";
        const about = "";

        //init user model
        user = new User(
            {
                username,
                email,
                name,
                code,
                phone,
                password,
                school,
                department,
                country,
                region,
                displayPicture,
                about

            }
        )

        await user.save();

        res.send({ success: true, message: "Successfully registered" })

        //send email messages
        //append "/" after dirname b4 d relative path to be able to move out of d current folder/directory
        // let htmlFile;
        // const readFile = () => {
        //     return new Promise((res, rej) => {
        //         fs.readFile(__dirname + "/../services/index.html", 'utf8', (error, html) => {
        //             if (error) return rej(error);
        //             res(html)
        //         })
        //     })
        // }

        // try {
        //     htmlFile = await readFile();
        //     console.log(htmlFile);
        // }

        // catch (err) {
        //     console.log("err is " + err);
        // }

        mailService(user.email, 'Verify Email', ` 
        <!DOCTYPE html>
            <html lang='en' xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'>
            <head>
                <meta charset='utf-8'> <!-- utf-8 works for most cases -->
                <meta name='viewport' content='width=device-width'> <!-- Forcing initial-scale shouldn't be necessary -->
                <meta http-equiv='X-UA-Compatible' content='IE=edge'> <!-- Use the latest (edge) version of IE rendering engine -->
                <meta name='x-apple-disable-message-reformatting'>  <!-- Disable auto-scale in iOS 10 Mail entirely -->
                <meta name='format-detection' content='telephone=no,address=no,email=no,date=no,url=no'> <!-- Tell iOS not to automatically link certain text strings. -->
                <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
            
                <!-- Web Font / @font-face : BEGIN -->
                <!-- NOTE: If web fonts are not required, lines 10 - 27 can be safely removed. -->
            
                <!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->
                <!--[if mso]>
                    <style>
                        * {
                            font-family: sans-serif !important;
                        }
                    </style>
                <![endif]-->
            
                <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
                <!--[if !mso]><!-->
                <!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->
                <!--<![endif]-->
            
                <!-- Web Font / @font-face : END -->
            
                <!-- CSS Reset : BEGIN -->
                <style>
            
                    /* What it does: Remove spaces around the email design added by some email clients. */
                    /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
                    html,
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        height: 100% !important;
                        width: 100% !important;
                    }
            
                    /* What it does: Stops email clients resizing small text. */
                    * {
                        -ms-text-size-adjust: 100%;
                        -webkit-text-size-adjust: 100%;
                    }
            
                    /* What it does: Centers email on Android 4.4 */
                    div[style*='margin: 16px 0'] {
                        margin: 0 !important;
                    }
            
                    /* What it does: Stops Outlook from adding extra spacing to tables. */
                    table,
                    /* td {
                        mso-table-lspace: 0pt !important;
                        mso-table-rspace: 0pt !important;
                    } */
            
                    /* What it does: Replaces default bold style. */
                    th {
                        font-weight: normal;
                    }
            
                    /* What it does: Fixes webkit padding issue. */
                    table {
                        border-spacing: 0 !important;
                        border-collapse: collapse !important;
                        table-layout: fixed !important;
                        margin: 0 auto !important;
                    }
            
                    /* What it does: Prevents Windows 10 Mail from underlining links despite inline CSS. Styles for underlined links should be inline. */
                    a {
                        text-decoration: none;
                    }
            
                    /* What it does: Uses a better rendering method when resizing images in IE. */
                    img {
                        -ms-interpolation-mode:bicubic;
                    }
            
                    /* What it does: A work-around for email clients meddling in triggered links. */
                    a[x-apple-data-detectors],  /* iOS */
                    .unstyle-auto-detected-links a,
                    .aBn {
                        border-bottom: 0 !important;
                        cursor: default !important;
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
            
                    /* What it does: Prevents Gmail from changing the text color in conversation threads. */
                    .im {
                        color: inherit !important;
                    }
            
                    /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
                    .a6S {
                       display: none !important;
                       opacity: 0.01 !important;
                    }
                    /* If the above doesn't work, add a .g-img class to any image in question. */
                    img.g-img + div {
                       display: none !important;
                    }
            
                    /* What it does: Removes right gutter in Gmail iOS app: https://github.com/TedGoas/Cerberus/issues/89  */
                    /* Create one of these media queries for each additional viewport size you'd like to fix */
            
                    /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
                    @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                        u ~ div .email-container {
                            min-width: 320px !important;
                        }
                    }
                    /* iPhone 6, 6S, 7, 8, and X */
                    @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                        u ~ div .email-container {
                            min-width: 375px !important;
                        }
                    }
                    /* iPhone 6+, 7+, and 8+ */
                    @media only screen and (min-device-width: 414px) {
                        u ~ div .email-container {
                            min-width: 414px !important;
                        }
                    }
            
                </style>
            
                <!-- What it does: Makes background images in 72ppi Outlook render at correct size. -->
                <!--[if gte mso 9]>
                <xml>
                    <o:OfficeDocumentSettings>
                        <o:AllowPNG/>
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
            
                <!-- CSS Reset : END -->
            
                <!-- Progressive Enhancements : BEGIN -->
                <style>
            
                    /* What it does: Hover styles for buttons */
                    .button-td,
                    .button-a {
                        transition: all 100ms ease-in;
                    }
                    .button-td-primary:hover,
                    .button-a-primary:hover {
                        background: #555555 !important;
                        border-color: #555555 !important;
                    }
            
                    /* Media Queries */
                    @media screen and (max-width: 600px) {
            
                        .email-container {
                            width: 100% !important;
                            margin: auto !important;
                        }
            
                        /* What it does: Forces table cells into full-width rows. */
                        .stack-column,
                        .stack-column-center {
                            display: block !important;
                            width: 100% !important;
                            max-width: 100% !important;
                            direction: ltr !important;
                        }
                        /* And center justify these ones. */
                        .stack-column-center {
                            text-align: center !important;
                        }
            
                        /* What it does: Generic utility class for centering. Useful for images, buttons, and nested tables. */
                        .center-on-narrow {
                            text-align: center !important;
                            display: block !important;
                            margin-left: auto !important;
                            margin-right: auto !important;
                            float: none !important;
                        }
                        table.center-on-narrow {
                            display: inline-block !important;
                        }
            
                        /* What it does: Adjust typography on small screens to improve readability */
                        .email-container p {
                            font-size: 17px !important;
                        }
                    }
            
                </style>
                <!-- Progressive Enhancements : END -->
            
            </head>
            <!--
                The email background color (#222222) is defined in three places:
                1. body tag: for most email clients
                2. center tag: for Gmail and Inbox mobile apps and web versions of Gmail, GSuite, Inbox, Yahoo, AOL, Libero, Comcast, freenet, Mail.ru, Orange.fr
                3. mso conditional: For Windows 10 Mail
            -->
            <body width='100%' style='margin: 0; padding: 0 !important; background-color: #222222;'>
                <center style='width: 100%; background-color: #222222;'>
                <!--[if mso | IE]>
                <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color: #222222;'>
                <tr>
                <td>
                <![endif]-->
            
                    <!-- Visually Hidden Preheader Text : BEGIN -->
                    <!--  <div style='display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; font-family: sans-serif;'>
                         (Optional) This text will appear in the inbox preview, but not the email body. It can be used to supplement the email subject line or even summarize the email's contents. Extended text preheaders (~490 characters) seems like a better UX for anyone using a screenreader or voice-command apps like Siri to dictate the contents of an email. If this text is not included, email clients will automatically populate it using the text (including image alt text) at the start of the email's body.
                    </div> -->
                    <!-- Visually Hidden Preheader Text : END -->
            
                    <!-- Create white space after the desired preview text so email clients don’t pull other distracting text into the inbox preview. Extend as necessary. -->
                    <!-- Preview Text Spacing Hack : BEGIN -->
                    <!-- <div style='display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;'>
                        &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
                    </div> -->
                    <!-- Preview Text Spacing Hack : END -->
            
                    <!-- Email Body : BEGIN -->
                    <table align='center' role='presentation' cellspacing='0' cellpadding='0' border='0' width='600' style='margin: auto;' class='email-container'>
                        <!-- Email Header : BEGIN -->
                        <!-- <tr>
                            <td style='padding: 20px 0; text-align: center'>
                                <img src='https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80' width='200px' height='20px' alt='alt_text' border='0' style='height: 30px; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 15px; color: #555555;'>
                            </td>
                        </tr> -->
                        <!-- Email Header : END -->
            
                        <!-- Hero Image, Flush : BEGIN -->
                        <tr>
                            <td style='background-color: #ffffff;'>
                                <img src='https://res.cloudinary.com/ugonna1054/image/upload/v1584815090/2020-03-21T18:24:48.479Z.png' width='20' height='' alt='alt_text' border='0' style='width: 20%; max-width: 600px; height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 15px; color: #555555; margin: 30px; display: block;' class='g-img'>
                            </td>
                        </tr>
                        <!-- Hero Image, Flush : END -->
            
                        <!-- 1 Column Text + Button : BEGIN -->
                        <tr>
                            <td style='background-color: #ffffff;'>
                                <table role='presentation' cellspacing='0' cellpadding='0' border='0' width='100%'>
                                    <tr>
                                        <td style='padding: 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;'>
                                            <h1 style='margin: 0 0 10px; font-size: 25px; line-height: 30px; color: #333333; font-weight: bold;'>Verify Your Email</h1>
                                            <p style='margin: 0 0 10px;'>Hello ${username}!</p>
                                            <p style='margin: 0 0 10px;'>Your verification code is <strong>${code}</strong> </p>
                                            <p style='margin: 0 0 10px;'>Welcome to Gchat. <span class="text-center" style="font-size:15px"> 🎉 🎉 🎉 🎉</span> </p>
                                            
                                            
                                        </td>
                                    </tr>
                                   
            
                                </table>
                            </td>
                        </tr>
                       
                       
            
                    <!-- Email Footer : BEGIN -->
                    <!-- <table align='center' role='presentation' cellspacing='0' cellpadding='0' border='0' width='600' style='margin: auto;' class='email-container'>
                        <tr>
                            <td style='padding: 20px; font-family: sans-serif; font-size: 12px; line-height: 15px; text-align: center; color: #888888;'>
                                <webversion style='color: #cccccc; text-decoration: underline; font-weight: bold;'>View as a Web Page</webversion>
                                <br><br>
                                MyEazziSolution Limited <br><span class='unstyle-auto-detected-links'>64 Adeniyi Jones Avenue, Ikeja , Lagos, NG<br>08076520000</span>
                                <br><br>
                                <unsubscribe style='color: #888888; text-decoration: underline;'>unsubscribe</unsubscribe>
                            </td>
                        </tr>
                    </table> -->
                    <!-- Email Footer : END -->
                <!--[if mso | IE]>
                </td>
                </tr>
                </table>
                <![endif]-->
                </center>
            </body>
            </html>
        `)
    },

    //get all users
    getUsers: async (req, res) => {
        const user = await User.find().select('-password');
        if (!user[0]) return res.status(404).send({ success: false, message: "User not found" });
        res.send(user)
    },

    //get one user by id
    getOneUser: async (req, res) => {
        //define req.body variables
        const id = req.params.id

        //check if user exists
        const user = await User.findById(id).select('-password'); //Other properties can be excluded from the user like credit card details e.t.c
        if (!user) return res.status(404).send({ success: false, message: "User not found" })
        
        res.send(user);
    },

    //get user profile
    getUserProfile: async (req, res) => {
        //check if user exists
        const user = await User.findById(req.user._id).select('-password'); //Other properties can be excluded from the user like credit card details e.t.c
        if (!user) return res.status(404).send({ success: false, message: "User not found" })
        
        res.send(user);
    },

    //Verify email
    verify: async (req, res) => {
        //define req.body parameters
        const code = req.params.code
        
        //check if user exists
        const user = await User.findOne({ code }).select('-password'); //Other properties can be excluded from the user like credit card details e.t.c
        if (!user) return res.status(404).send({ success: false, message: "Invalid Code" })
        
        //update users isVerified status and clear code
        user.isVerified = true;
        user.code = "";

        //save user and send response to client
        await user.save();
        res.send({ success: true, message: "Verification Successful" })
    },


    //update other user info on signup
    updateProfileSignup: async (req, res) => {
        const email = req.params.email
        // //check for validation errors
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email }).select('-password');
        if (!user) return res.status(404).send({ success: false, message: "User not found" });

        //check if user is verified
        if (!user.isVerified) return res.status(403).send({ success: false, message: "Verification Needed" })

        //Generate new JWT token
        const token = user.generateAuthToken()
       
        //save and update
        await User.updateOne({email:email} ,req.body)
        .then(() => res.send({success:true,  message:"Successfully Registered", token}))
        .catch(err => res.status(500).send(err))

    },

    // update display picture
    updatePicture: async (req, res) => {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send({ success: false, message: "User not found" });

        //save images to cloudinary
        const paths = req.files;
        const values = Object.values(paths)
        const keys = Object.keys(paths);
        let arr = [];
        let errors = []
        let validImage = [];
        let validSize = []


        //check if image is valid
        values.forEach((item) => {
            if (item[0].mimetype == "image/png" || item[0].mimetype == "image/jpeg" || item[0].mimetype == "image/svg+xml") return;
            validImage.push("invalid")
        })

        //throw eror if not valid
        if (validImage[0]) return res.status(400).send({ success: false, message: 'Invalid file format. Only jpegs, pngs or pdfs' })

        //check size of the image
        values.forEach((item) => {
            if (item[0].size <= 10000000) return;
            validSize.push("invalid")
        })

        //throw eror if greater than 2mb 
        if (validSize[0]) return res.status(400).send({ success: false, message: 'File size must not be more than 2mb' })

        //save image to cloud
        for (let i = 0; i < keys.length; i++) {
            const uniqueFileName = new Date().toISOString()
            await newCloudinary1(values[i][0].path, uniqueFileName)
                .then(data => {
                    console.log(data);
                    data.name = keys[i]
                    arr.push(data)
                })
                .catch(err => {
                    console.error(err);
                    errors.push(err)
                })
        }

        //throw err if any
        if (errors[0]) {
            if (errors[0].error.errno == "ENOTFOUND" || errors[0].error.code == "ENOTFOUND") return res.status(400).send({ success: false, message: "Check your internet connection" });
            res.status(500).send(errors)
        }

        const displayPicture = arr[0].secure_url;

        user.displayPicture = displayPicture;

        await user.save();
        res.send({ status: true, message: "updated successfully" });
    },

    // update user profile 
    updateProfile: async (req, res) => {
        //check for validation errors
        const { error } = validateProfileUpdate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
       
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send({ success: false, message: "User not found" });
        
        await User.updateOne({_id:req.user._id} ,req.body)

        res.send({ status: true, message: "updated successfully" });
    }
}


module.exports = user