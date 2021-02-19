const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Spratty:w3RjzRTGO5bFA24D@clusterarg0.cr24j.mongodb.net/freeCodeCamp?retryWrites=true&w=majority',{useNewUrlParser: true,useUnifiedTopology: true})
    .then(console.log('DB is connected'))
    .catch(err => console.error(err));