const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express();

const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.ngizs27.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();

        const brandCollection = client.db("brandDB").collection('brand');


        app.get('/brand', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.post('/brand', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await brandCollection.insertOne(newProduct);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Brand-name is sever running')
})


app.listen(port, () => {
    console.log(`Brand server is runing on port:${ port }`)
})