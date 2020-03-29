const bcrypt = require('bcrypt');
const { User, validateLogin, validatePassword, validatePasswordReset } = require('../models/User');
const { generateToken, generateCode } = require("../services/utils")
const { mailService } = require("../services/mail")
const moment = require("moment")

const auth = {
    //Login

    /**
     *  @description = Login function for the auth route
     */
    LoginStart: async (req, res) => {
        // //check for validation errors
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);
     
        //check for correct username or email
        let user = await User.findOne({ $or: [{ "email": req.body.username.toLowerCase() }, { "username": req.body.username.toLowerCase() }] });
        if (!user) return res.status(400).send({ success: false, message: 'Invalid username or email.' });
        
        //check if user is verified
        if(!user.isVerified) return res.status(403).send({success:false, message:"Verification Needed"})
       
        //generate new code/otp
        const code = generateCode();

        //save otp to database
        user.code = code;
        await user.save()
        .then(() => {
            res.send({success:true, message:"Verification code sent"})
        })
        .catch(err => {
            res.send({success:false, message:err})
        })
        
        //send verification code to email
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
                                            <h1 style='margin: 0 0 10px; font-size: 25px; line-height: 30px; color: #333333; font-weight: bold;'>One Time Password</h1>
                                            <p style='margin: 0 0 10px;'>Hello ${user.username}!</p>
                                            <p style='margin: 0 0 10px;'>Your otp is <strong>${code}</strong> </p>
                                            <p style='margin: 0 0 10px;'>Enjoy your stay :)  </p>
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
    LoginComplete: async (req, res) => {
        //define req parameter
        const code = req.params.code
        
        //check if code is valid
        const user = await User.findOne({ code }).select('-password'); //Other properties can be excluded from the user like credit card details e.t.c
        if (!user) return res.status(404).send({ success: false, message: "Invalid Code" })
    
        //Create new JWT token
        const token = user.generateAuthToken();

        //reset otp/code to null
        user.code = "";
        await user.save();
       
        res.send({
            success:true,
            username: user.username,
            token,
            isAdmin: user.isAdmin
        });
    },

    ChangePassword: async (req, res) => {
        // //check for validation errors
        const { error } = validatePassword(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        //check if user exists
        let user = await User.findById(req.user._id);
        if (!user) return res.status(400).send({ success: false, message: 'User not Found.' });

        //check if old password is correct
        const validPassword = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!validPassword) return res.status(400).send(({ success: false, message: 'Wrong Password' }));

        //change password to new password 
        user.password = req.body.newPassword

        //hash password with salt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)

        await user.save();

        //save 
        res.send(user)
    },
    //reset Password
    ResetPassword: async (req, res) => {
        const token = req.params.token

        //check for validation errors
        const { error } = validatePasswordReset(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //Check if user with the given token exists
        const user = await User.findOne({ 'tokenSchema.token': token })
        if (!user) return res.status(404).send('User not found');

        //check if token is stil valid
        const currentDate = new Date()
        if (currentDate > user.tokenSchema.expiryDate) return res.status(400).send('expired token')

        //change password
        user.password = req.body.password

        //hash password with salt   
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)

        //save user
        await user.save()

        res.send({ success: true, message: "Password reset successfull" })
    },

    //Send password reset email
    ResetEmail: async (req, res) => {
        //define parameter
        const email = req.params.email

        //Check if email exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send({ success: false, message: "User not Found" });

        //create new token and expiry date
        let newToken = generateToken();
        let expiration = moment().add(30, 'm');

        //update database with new token and expiry date
        user.tokenSchema.token = newToken;
        user.tokenSchema.expiryDate = expiration;

        await user.save()


        res.send({ success: true, message: "A password reset email has been sent to you" })

        //Send user password reset email
        mailService(user.email, 'Reset Password', `<!DOCTYPE html>
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
                            <img src='https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80' width='200' height='50' alt='alt_text' border='0' style='height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 15px; color: #555555;'>
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
                                        <h1 style='margin: 0 0 10px; font-size: 25px; line-height: 30px; color: #333333; font-weight: bold;'>Reset Your Password</h1>
                                        <p style='margin: 0 0 10px;'>Hello ${user.username}!</p>
                                        <p style='margin: 0 0 10px;'>You recently requested to reset your password for your Gchat Account. Kindly click the below link to reset it. </p>   
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding: 0 20px 20px;'>
                                        <!-- Button : BEGIN -->
                                        <table align='center' role='presentation' cellspacing='0' cellpadding='0' border='0' style='margin: auto;'>
                                            <tr>
                                                <td class='button-td button-td-primary' style='border-radius: 4px; background: #222222;'>
                                                    <a class='button-a button-a-primary' href="http://localhost:8080/Password?token=${newToken}" style='background:rgb(63, 95, 222); border: 1px solid rgb(63, 95, 222); font-family: sans-serif; font-size: 15px; line-height: 15px; text-decoration: none; padding: 13px 17px; color: #ffffff; display: block; border-radius: 4px;'>Reset Password</a>
                                                </td>
                                            </tr>
                                        </table>
                                        <!-- Button : END -->
                                    </td>
                                </tr>
      
                                <tr>
                                    <td style='padding:0px 20px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;'>
                                        <p style='margin: 0 0 10px;'>If you did not request a password reset, please ignore this email or reply to let us know. This
                                            password reset is only valid for the next 30 minutes
                                        </p>
                                        <br> <br>
                                        <p style='margin: 0 0 10px;'>Thanks :)  </p>   
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
                            The Chartered Institute of Bankers of Nigeria.<br><span class='unstyle-auto-detected-links'>Bankers House,PC 19, Adeola Hopewell Street, Victoria Island, Lagos, NG<br>0700-DIAL-CIBN</span>
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
        </html>`)


    },

    //update user token
    updateSchema: async (req, res) => {
        let user = await User.updateMany(
            {},
            {
                "$set": {
                    "tokenSchema.token": 400,
                    "tokenSchema.expiryDate": 400,
                }
            },
            function (err, doc) {
                if (err) throw err
            }
        );
        res.send(user)
    }
}


module.exports = auth