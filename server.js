const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const bodyParser =require('body-parser')
const { log } = require('console')
const mongoose = require('mongoose')
const http = require("http");
const helmet = require("helmet");
const compression = require("compression");
// const notifications = require("../routes/Notification");
const conversations = require("./api/routes/Conversations");

const app = express() 

// Conected to mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://Kasaby:'+ 
    process.env.MONGO_ATLAS_PW +
    '@cluster0.ylbq6.mongodb.net/Auth?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(console.log("mongose conected")) 


//Middlewarees
app.use(cors())
app.use(helmet());
app.use(compression());
app.use(morgan('dev'))
app.use(bodyParser.json())


// serve images in directory named images 
app.use('/images',express.static('images'))
//Routes
app.use('/user',require('./api/routes/user'))
app.use('/team',require('./api/routes/team'))
app.use('/post',require('./api/routes/post'))
app.use('/file',require('./api/routes/file'))
// app.use(notifications);
// app.use('/Conversations',require('./api/routes/Conversations'))

app.use(conversations);


const server = http.createServer(app);

module.exports = {
    up: (cb) => {
      // let server = app.listen(process.env.PORT);
      const port = process.env.PORT || 3000
      server.listen(port)
      server.on("listening", cb);
      server.on("error", function (err) {
        console.error(err.message.red);
      });
  
      require("./socketServer").up(server);
    },
  };
  


