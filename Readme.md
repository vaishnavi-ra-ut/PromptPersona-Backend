# Started PromptPersona
    Initialized node , express , mongoose
    Initialized Git

    Connected with MongoDB

    Made User Schema
    
    Added bcrypt for hashing 
        bcrypt.genSalt(rounds) - A salt is random data added to a password before hashing, so that two users with the same password don’t have the same hash
        const hashedPassword = await bcrypt.hash(password, 10); // 10 here is the salt

    Made /signup route
    
    Made User Authentication middleware

    Made /login

    Made /profile
    Made /profile/edit 
        Added multer for profile pictures - a middleware that handles multipart/form-data — that’s how browsers send files (like images) when you upload them.

    Added Cookies

    Made Persona Model
    Made persona routes 

    Made Chat Model
    Made Message Model
    Made /chat api
    Made /messages api to send messages to persona
    Made /history to see the chats history
    Made /user-chats to see all the chats till now with different personas

    Made an optionAuth for those who do not want to sign-up or log-in


