import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';
import Head from 'next/head';
import { Fragment } from 'react';

const DUMMY_MEETUPS = [

    {
        id: 'm1',
        title: 'A first meeting up',
        image: 'https://c.wallhere.com/photos/e0/09/pink_lake_view_amazing_Pink_nature_view-1550757.jpg!d',
        address: 'Some address 5, 123 some City',
        description: 'This is a first meetup'
    },

    {
        id: 'm2',
        title: 'A second meeting up',
        image: 'https://c.wallhere.com/photos/e0/09/pink_lake_view_amazing_Pink_nature_view-1550757.jpg!d',
        address: 'Some address 10, 123 some City',
        description: 'This is a second meetup'
    }

];

function HomePage(props) {
    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta 
                    name='description' 
                    content='Browse a huge list of highly active react meetups'
                />
            </Head>
            <MeetupList meetups={props.meetups}/>
        </Fragment>
    ); 
}

// execute pre-rendering process 
export async function getStaticProps() {
    // fetch data from API                                       
    const client = await MongoClient.connect('mongodb+srv://user:pass@cluster0.r4yex.mongodb.net/emailyDB?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find().toArray();
    client.close();

    return {
        props: {
            // meetups: DUMMY_MEETUPS
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString()
            }))
        },
        revalidate: 1  //every one second
    };

}

// execute on server pre-render for every incoming request
// export async function getServerSideProps(context) {
    
//     const req = context.req;
//     const res = context.res;

//     // fetch data from API
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     };

// }

export default HomePage;