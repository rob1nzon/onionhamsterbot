const express = require('express');
const faunadb = require('faunadb');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
});

app.use(express.json());
app.use(express.static('public'));

app.post('/api/user-data', async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await client.query(
      q.Let(
        {
          match: q.Match(q.Index('user_by_id'), userId)
        },
        q.If(
          q.Exists(q.Var('match')),
          q.Get(q.Var('match')),
          q.Create(q.Collection('users'), { data: { userId, coins: 0 } })
        )
      )
    );
    res.json(result.data);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/save-data', async (req, res) => {
  const { userId, coins } = req.body;
  try {
    await client.query(
      q.Let(
        {
          match: q.Match(q.Index('user_by_id'), userId)
        },
        q.If(
          q.Exists(q.Var('match')),
          q.Update(q.Select('ref', q.Get(q.Var('match'))), { data: { coins } }),
          q.Create(q.Collection('users'), { data: { userId, coins } })
        )
      )
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
