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
  await mongoose.connect(
    process.env.DB_URL as string,
    { useNewUrlParser: true },
  );
}

export async function disconnectFromDatabase() {
  await mongoose.connection.close();
}
