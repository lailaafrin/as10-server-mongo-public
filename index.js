const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');





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

        // await client.connect();

        const brandCollection = client.db("brandDB").collection('brand');


        app.get('/brand', async (req, res) => {
            const cursor = brandCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // updatet 
        app.get('/brand/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await brandCollection.findOne(query)
            res.send(result);
        })


        app.post('/brand', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await brandCollection.insertOne(newProduct);
            res.send(result);
        })

        app.put('/brand/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateProduct = req.body;


            
            const product = {
                $set: {
                    name: updateProduct.name,
                    price: updateProduct.price,
                    brand: updateProduct.brand,
                    rating: updateProduct.rating,
                    category: updateProduct.category,
                    description: updateProduct.description,
                    photo: updateProduct.photo,
                   
                   
                }
            }

            const result = await brandCollection.updateOne(filter, product, options);
            res.send(result);
        })

        app.delete('/brand/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await brandCollection.deleteOne(query)
            res.send(result);
        })
        
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