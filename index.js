import 'dotenv/config'
import express from 'express';
import bodyParser from 'body-parser';
import {sendMessage, createMessage, createDataCollection, listDataCollections, updateDataCollection, getDataCollection, saveDataItem} from './src/index.js';

const app = express();
const port = 3000;

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    res.send('Hello World!');
  
});

// TODO:
//  - Add image support
//  - Add unhappy path
//    - Detect duplicate entries/updates
//    - Handle errors
//  - Add Session handling
//    - Find existing items and update/remove them
//    - Conversational intents
//  - Add unit tests
//  - Set up TS configuration
//  - Switch files to TS


app.get("collections/make", async (req, res) => {
    // Request Format:
    // {
    //     "_id": "test-collection",
    //     "displayField": "test-collection",
    //     "displayName": "Test Collection",
    //     "fields": [
    //         {"description": "Name of person", "displayName": "Name", "encrypted": false, "key": "userName", "required": true, "type": "TEXT"},
    //         {"description": "Age of person", "displayName": "Age", "encrypted": false, "key": "userAge", "required": false, "type": "NUMBER"}
    //     ]

    // }
    await createDataCollection({
        _id: req.body.id,
        displayField: req.body.displayField,
        displayName: req.body.displayName,
        fields: req.body.fields
    }).then((collection) => {
        console.log('makeCollection:', collection);
        res.send(collection);
    }).error((error) => {
        console.log('got an error', error);
        res.send(error)
    })
  
});

app.get("/collections/get", async (req, res) => {
    await listDataCollections().then((collections) => {
        console.log('collectionsList:', collections);
        res.send(collections);
    }).catch((error) => {
        console.log('got an error: ', error);
        res.send('got an error: ', error);
    })
});

// app.get("/collections/update", async (req, res) => {
//     console.log('req.body', req.body.collectionId);
//     let colletionToUpdate;
//     await getDataCollection(req.body.collectionId, {consistentRead: true}).then((collection) => {
//         collectionToUpdate = collection;
//     }).error((error) => {
//         console.log('got an error finding collection: ', error);
//         res.send('got an error finding collection: ', error);
//     })

//     await updateDataCollection({}).then((collections) => {
//         console.log('collectionsList:', collections);
//         res.send(collections);
//     }).catch((error) => {
//         console.log('got an error: ', error);
//         res.send('got an error: ', error);
//     })
// });

app.get("/items/save", async (req, res) => {
    // Request Format:
    // {
    //     "collectionId": "Menu",
    //     "dataItem": {
    //         "data": {
    //             "title": "Blueberry",
    //             "description": "You're turning violet Violet!"
    //         }
    //     }
    // }
    console.log(req);
    await saveDataItem({dataCollectionId: req.body.collectionId, dataItem: req.body.dataItem}).then((data) => {
        console.log('data', data);
        res.send(data);
    }).catch((error) => {
        console.log('got an error: ', error);
        res.send('got an error: ', error);
    })
})

app.get("/twilio/send", async (req, res) => {
    await sendMessage(req.body.message)
        .then((message) => {console.log(message.sid); res.send(message);})
        .catch((error)=> {
            console.log('got an error sending message: ', error);
            res.send('got an error: ', error);
        });
});

app.post('/sms', async (req, res) => {
    console.log(req.body, req.body.Body);
    const items = req.body.Body.toString().split('/');
    const dataItem = {
                "data": {
                    "title": items[0],
                    "description": items[1]
                }
            }
    await saveDataItem({dataCollectionId: 'Menu', dataItem: dataItem}).then((data) => {
        console.log('data', data);
        res.send(data);
    }).catch((error) => {
        console.log('got an error: ', error);
        res.send('got an error: ', error);
    })
    // const message = createMessage(req.body);
    // res.type('text/xml').send(message);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});