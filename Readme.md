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

    


