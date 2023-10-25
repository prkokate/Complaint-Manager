const connectToMongo =require('./db');
connectToMongo();

const express=require('express');
const app = express();

app.use(express.json());
const port=8001;

app.use('/api/auth',require('./routes/auth'));
app.use('/api/applications',require('./routes/applications'));

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
});
