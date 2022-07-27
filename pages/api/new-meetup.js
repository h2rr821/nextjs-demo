// /api/new-meetup
import { MongoClient } from 'mongodb';

async function handler(req, res) {
    if (req.method === 'POST') {
        const data = req.body;

        // const { title, image, address, description } = data;
        console.log("POST: ", data);                                        
        const client = await MongoClient.connect('mongodb+srv://user:pass@cluster0.r4yex.mongodb.net/emailyDB?retryWrites=true&w=majority');
        const db = client.db();

        const meetupsCollection = db.collection('meetups');

        const result = await meetupsCollection.insertOne(data);
        console.log('result: done ->', result);

        client.close();

        res.status(201).json({message: 'Meetup inserted'});
    }
}

export default handler;