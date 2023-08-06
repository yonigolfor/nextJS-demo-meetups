// localhost:3000/meetupId
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import Head from "next/head";
import { Fragment } from "react";

export default function MeetupDetails({ meetupData }) {
  return (
    <Fragment>
      <Head>
        <title>{meetupData.title}</title>
        <meta name="description" content={meetupData.description} />
      </Head>
      <MeetupDetail
        img={meetupData.image}
        title={meetupData.title}
        address={meetupData.address}
        description={meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  // Added only at dynamic paths. Define here all Dynamic Values for re-generate.
  const client = await MongoClient.connect(
    "mongodb+srv://YoniGolfor:Yoni2023@cluster0.apmkq.mongodb.net/Meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupCollection = db.collection("meetups");

  // take all the meetups ids
  const meetups = await meetupCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
    fallback: false, // Do you define all options? False -> yes
  };
}

export async function getStaticProps(context) {
  // can fetch data securely. this code will not appear in client-side.
  // This code will not appear even in other clients machines!

  // fetch data for single meetup
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://YoniGolfor:Yoni2023@cluster0.apmkq.mongodb.net/Meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupCollection = db.collection("meetups");

  // take all the meetups ids
  const selectedMeetup = await meetupCollection.findOne({
    // convert to ObjectId because it's ObjectId at MongoDb.
    _id: new ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      // "meetupData" will be exposed as a prop to the component up there.
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
    revalidate: 1,
  };
}
