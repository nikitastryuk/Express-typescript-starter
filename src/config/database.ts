import mongoose from 'mongoose';

// Debug mode for non-production environment
if (process.env.NODE_ENV === 'dev') {
  mongoose.set('debug', true);
}

// Connection events
mongoose.connection
  .once('open', () => console.info('Sucessfully connected to database'))
  .on('error', () => {
    throw new Error('Unable to connect to database');
  });

export async function connectToDatabase() {
  let url = process.env.DB_URL as string;
  if (process.env.NODE_ENV === 'test') {
    url = process.env.DB_LOCAL_URL as string;
  }
  await mongoose.connect(
    url,
    // Fix deprecation warnings
    { useNewUrlParser: true, useCreateIndex: true },
  );
}

export async function disconnectFromDatabase() {
  await mongoose.connection.close();
}
