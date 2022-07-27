import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from "../../components/meetups/MeetupDetail";
import Head from 'next/head';
import { Fragment } from 'react';

function MeetupDetails(props) {

    return (

        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta 
                    name="description"
                    content={props.meetupData.description}
                />
            </Head>
            <MeetupDetail 
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </Fragment>
    );
}

export async function getStaticPaths() {

    const client = await MongoClient.connect('mongodb+srv://admin:admin@cluster0.r4yex.mongodb.net/emailyDB?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find({}, {_id: 1}).toArray();

    client.close();
    return {
        fallback: false,
        paths:meetups.map(meetup => ({
            params: {meetupId: meetup._id.toString()}
        }))
        // [
        //     { 
        //         params: {
        //             meetupId: 'm1'
        //         }
        //     }, 
        //     { 
        //         params: {
        //             meetupId: 'm2'
        //         }
        //     }
        // ]
    }
}

// execute pre-rendering process 
export async function getStaticProps(context) {

    const meetupId = context.params.meetupId;

    console.log(meetupId);
    // fetch data from API

    
    const client = await MongoClient.connect('mongodb+srv://user:pass@cluster0.r4yex.mongodb.net/emailyDB?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)});

    client.close();

    return {
        props: {
            meetupData: {

                image: selectedMeetup.image,
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                description: selectedMeetup.description
            }
            // {
            //     image: 'https://c.wallhere.com/photos/e0/09/pink_lake_view_amazing_Pink_nature_view-1550757.jpg!d',
            //     id: meetupId, 
            //     title: 'First meetup',
            //     address: 'Some Street 5, some city',
            //     description:'This is a first meetup',
            // }
        },
        revalidate: 1  //every one second
    };

}

export default MeetupDetails;