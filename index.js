const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wotzmkf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
  
    const touristCollection = client.db('touristsDB').collection('tourists');



    app.get('/tourists', async(req, res) =>{
        const cursor = touristCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    app.post('/tourists', async(req, res)=>{
        const addTourists = req.body;
        console.log(addTourists);
        const result = await touristCollection.insertOne(addTourists);
        res.send(result);
    })



    app.get("/tourists/:id", async (req, res) => {
        try {
          const id = req.params.id;
          console.log(id);
          const result = await touristCollection.findOne({ _id: new ObjectId(id) });
          if (result) {
            res.send(result);
          } else {
            res.status(404).json({ error: "Tourists not found" });
          }
        } catch (error) {
          console.error("Error fetching tourists:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });

    // Send a ping to confirm a successful connection
   
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("tourist server is running");
});

app.listen(port, () => {
  console.log(` tourist server is running on port: ${port}`);
});
