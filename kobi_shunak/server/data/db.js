const { MongoClient } = require('mongodb');

// Connection URI for MongoDB
const uri = 'mongodb://localhost:27017';

// Create a MongoDB client instance
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
async function disconnectFromDatabase() {

    if (client == null) {
        return
    }
    else
        client.Disconnect();
  
}

  
module.exports = { connectToDatabase };