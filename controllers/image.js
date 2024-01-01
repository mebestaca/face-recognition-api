const handleImageDetect = (req, res) => {
    const { imageUrl } = req.body;
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // In this section, we set the user authentication, user and app ID, model details, and the URL
    // of the image we want as an input. Change these strings to run your own example.
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = process.env.REACT_APP_PAT;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = process.env.REACT_APP_USER_ID;       
    const APP_ID = process.env.REACT_APP_APP_ID;
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = process.env.REACT_APP_MODEL_ID;
    const MODEL_VERSION_ID = process.env.REACT_APP_MODEL_VERSION_ID;  
    const IMAGE_URL = imageUrl;

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch(process.env.REACT_APP_API_URL + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(result => res.json(result))
        .catch(error => console.log('error', error));
}

const handleImage = (req, res, database) => {
    const { id } = req.body;
    database('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries =>  res.json(entries[0].entries))
        .catch(err => res.json('unable to retrieve entries'));
};

module.exports = {
    handleImage,
    handleImageDetect,
}