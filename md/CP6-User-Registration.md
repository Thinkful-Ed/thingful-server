# NOTES:
# ASSIGNMENTS:
    REQUIREMENTS:
        Unique, between 8-72 characters, shouldn't start or end with spaces
        Contains at least 1 lower case letter, 1 number, 1 special character
        full_name is required, nickname is optional 
    HAPPY PATH:
        read req body-> validate fields->bcrypt the password->insert the user into the db
        send response:
            201 with the response location of the new user's id
            the res body should contain a serialized respresentation of the user, no pass down
            the user should have also had a date_created field auto-populated 