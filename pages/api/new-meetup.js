// /api/new-meetup
import { MongoClient } from "mongodb";
export default async function handler(req, res) {
  if (req.method === "POST") {
    // getting the data from the form
    const data = req.body;
    // const { title, image, address, description } = data;
    // Sending the data to the database
    const client = await MongoClient.connect(
      "mongodb+srv://YoniGolfor:Yoni2023@cluster0.apmkq.mongodb.net/Meetups?retryWrites=true&w=majority"
    );
    const db = client.db();
    const meetupCollection = db.collection("meetups");
    const result = await meetupCollection.insertOne(data);
    console.log(result);
    client.close();

    res.status(201).json({ message: "Meetup Inserted Successfully" });
  }
}

// mongodb+srv://<username>:<password>@cluster0.apmkq.mongodb.net/?retryWrites=true&w=majority
