import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from "react";
import Head from "next/head";

export default function Homepage({ meetups }) {
  return (
    <Fragment>
      <Head>
        <title>React meetups</title>
        <meta
          name="description"
          content="Brows collection of meetups by Y.Golfor"
        />
      </Head>
      <MeetupList meetups={meetups} />
    </Fragment>
  );
}

export async function getStaticProps() {
  // can fetch data securely. this code will not appear in client-side.
  // This code will not appear even in other clients machines!
  const client = await MongoClient.connect(
    "mongodb+srv://YoniGolfor:Yoni2023@cluster0.apmkq.mongodb.net/Meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupCollection = db.collection("meetups");
  const meetups = await meetupCollection.find().toArray(); //gets all meetups
  console.log("Got all meetups Successfully: ", meetups);

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}
