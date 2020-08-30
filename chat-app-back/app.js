const express = require('express');

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//setup Cross Origin
app.use(require('cors')());

app.get("/", (req, res) => {
    res.json({ message: "welcome to hanif application." });
});

//Bring in the routes
app.use('/user', require('./routes/userRoute'));
app.use('/chatroom', require('./routes/chatromRoute'));

//Setup Error Handlers
const errorHandlers = require('./handlers/errorHandlers');
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if(process.env.ENV === "DEVELOPMENT"){
    app.use(errorHandlers.developmentErrors);
} else {
    app.use(errorHandlers.productionErrors);
}

module.exports = app;