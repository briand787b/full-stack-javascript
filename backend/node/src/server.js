import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';

const app = express();
app.use(bodyParser.json());

app.get('/hello', (req, res) => res.send('Hello!'));
app.get('hello/:name', (req, res) => {
    const name = req.params.name;
    res.send(`Hello ${name}!`);
});
app.post('/hello', (req, res) => {
    const name = req.body.name;
    res.send(`Hello ${name}!!!!`);
});

app.get('/api/articles/:name', async (req, res) => {
    const articleName = req.params.name;
    
    try {
        const client = await MongoClient.connect(
            'mongodb://mongo:mongo@mongo:27017',
            {useNewUrlParser: true, useUnifiedTopology: true}
        );
    
        const db = client.db('mongo');
        
        const articleInfo = await db.collection('articles')
            .findOne({ name: articleName });
        
        client.close();
        
        if (!articleInfo) {
            return res.status(404).send('article not found');
        }
    
        res.status(200).json(articleInfo);
    } catch (e) {
        console.log(e);
        res.status(500).send('something went wrong');
    }
});

app.post('/api/articles/:name/upvote', async (req, res) => {
    const articleName = req.params.name;
    try {
        const client = await MongoClient.connect(
            'mongodb://mongo:mongo@mongo:27017',
            {useNewUrlParser: true, useUnifiedTopology: true}
        );
    
        const db = client.db('mongo');

        const articleInfo = await db.collection('articles')
            .findOne({ name: articleName });
        
        await db.collection('articles')
            .updateOne({ name: articleName }, {
                '$set': {
                    upvotes: articleInfo.upvotes + 1,
                }
            });

        const updatedArticleInfo = await db.collection('articles')
            .findOne({ name: articleName });
        
        client.close();
        
        if (!articleInfo) {
            return res.status(404).send('article not found');
        }
    
        res.status(200).json(updatedArticleInfo);
    } catch (e) {
        console.log(e);
        res.status(500).send('something went wrong');
    }
});

app.post('/api/articles/:name/add-comment', async (req, res) => {
    const articleName = req.params.name;
    const { comment } = req.body;

    try {
        const client = await MongoClient.connect(
            'mongodb://mongo:mongo@mongo:27017',
            {useNewUrlParser: true, useUnifiedTopology: true}
        );
    
        const db = client.db('mongo');

        const articleInfo = await db.collection('articles')
            .findOne({ name: articleName });
        
        await db.collection('articles')
            .updateOne({ name: articleName }, {
                '$set': {
                    comments: articleInfo.comments.concat(comment),
                }
            });

        const updatedArticleInfo = await db.collection('articles')
            .findOne({ name: articleName });
        
        client.close();
        
        if (!articleInfo) {
            return res.status(404).send('article not found');
        }
    
        res.status(200).json(updatedArticleInfo);
    } catch (e) {
        console.log(e);
        res.status(500).send('something went wrong');
    }

    res.status(200).send(articlesInfo[articleName]);
});

app.listen(8000, () => {
    console.log('server is listening on port 8000')
})