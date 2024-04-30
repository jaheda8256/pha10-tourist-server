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
console.log(uri);

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

    const touristCollection = client.db("touristsDB").collection("tourists");







    // my list
    app.get("/tourists", async (req, res) => {
      const cursor = touristCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

   
 // update code
 app.get("/tourists/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await touristCollection.findOne(query);
  res.send(result);
});
 

    // update put
    app.put("/tourists/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedTourists = req.body;
      
      const tourists = {
        $set: {
          name: updatedTourists.name,
          cost: updatedTourists.cost,
          seasonality: updatedTourists.seasonality,
          travel: updatedTourists.travel,
          totalVisitorsPerYear: updatedTourists.totalVisitorsPerYear,
          photo: updatedTourists.photo,
          country: updatedTourists.country,
          location: updatedTourists.location,
          description: updatedTourists.description,
        },
      };
      const result = await touristCollection.updateOne(filter, tourists, options);
      res.send(result);
    });

    // my list delete
    app.delete("/tourists/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/tourists", async (req, res) => {
      const addTourists = req.body;
      console.log(addTourists);
      const result = await touristCollection.insertOne(addTourists);
      res.send(result);
    });

    app.get("/tourists/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log(id);
        const result = await touristCollection.findOne({
          _id: new ObjectId(id),
        });
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

    //   user related apis
    app.get("/tourists-email/:email", async (req, res) => {
      const query = { email: req.params.email };
      const cursor = touristCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });

    app.get("/tourists/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristCollection.findOne(query);
      res.send(result);
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
