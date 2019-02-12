import mongoose from 'mongoose';

mongoose.connection
  .once('open', () => console.info('Sucessfully connected to database'))
  .on('error', () => {
    throw new Error('Unable to connect to database');
  });

export async function initDatabase() {
  // Debug mode for non-production instances
  if (process.env.NODE_ENV === 'dev') {
    mongoose.set('debug', true);
  }
  if (!process.env.DB) {
    throw new Error('DB environment variable must be defined');
  }
  await mongoose.connect(
    process.env.DB,
    { useNewUrlParser: true },
  );
}
