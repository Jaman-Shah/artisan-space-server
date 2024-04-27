const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5003;

// for solving cors problem for client side
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
app.use(cors(corsConfig));

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kvwwfig.mongodb.net/?retryWrites=true&w=majority`;

// const uri = "mongodb://localhost:27017";

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
    // await client.connect();

    const allAddedCraftCollection = client
      .db("usersCraftDB")
      .collection("user_crafts");

    // getting all users created crafts
    app.get("/getallcrafts", async (req, res) => {
      const cursor = allAddedCraftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // getting craft by id
    app.get("/getcraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const craft = await allAddedCraftCollection.findOne(query);
      res.send(craft);
    });

    // getting single users crafts by email

    app.get("/getcraftsbyemail/:email", async (req, res) => {
      const email = req.params.email;
      const query = { user_email: email };
      const cursor = allAddedCraftCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //   creating crafts for individual users
    app.post("/createcrafts", async (req, res) => {
      const craftData = req.body;
      const result = await allAddedCraftCollection.insertOne(craftData);
      res.send(result);
    });

    // updating craft by id

    app.put("/updatecraft/:id", async (req, res) => {
      const id = req.params.id;
      const CraftDetails = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateCraft = {
        $set: {
          image: CraftDetails.image,
          item_name: CraftDetails.item_name,
          subcategory_name: CraftDetails.subcategory_name,
          short_description: CraftDetails.short_description,
          price: CraftDetails.price,
          rating: CraftDetails.rating,
          customization: CraftDetails.customization,
          processing_time: CraftDetails.processing_time,
          stock_status: CraftDetails.stock_status,
        },
      };
      const options = { upsert: true };
      const result = await allAddedCraftCollection.updateOne(
        filter,
        updateCraft,
        options
      );
      res.send(result);
    });

    // deleting craft by id

    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allAddedCraftCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is server home route");
});

app.listen(port, () => {
  console.log(`Server is running at the port ${port}`);
});
