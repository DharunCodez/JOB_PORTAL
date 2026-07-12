import mongoose from 'mongoose';

const uri = 'mongodb://dharunaug_db_user:dharun_2525@ac-piq2c9l-shard-00-00.lzrjgth.mongodb.net:27017,ac-piq2c9l-shard-00-01.lzrjgth.mongodb.net:27017,ac-piq2c9l-shard-00-02.lzrjgth.mongodb.net:27017/JOB_PORTAL?ssl=true&replicaSet=atlas-jlnw13-shard-0&authSource=admin&retryWrites=true&w=majority&appName=JBstorage';

await mongoose.connect(uri);
const db = mongoose.connection.db;

// Find the recruiter user
const recruiter = await db.collection('users').findOne({ email: 'recruit1@gmail.com' });
console.log('Recruiter found:', recruiter.fullname, String(recruiter._id));

// Find all invalid applications where a recruiter is the applicant
const badApps = await db.collection('applications').find({ applicant: recruiter._id }).toArray();
console.log('Bad applications found:', badApps.length);
for (const app of badApps) {
    console.log(' - App ID:', String(app._id), '| Job:', String(app.job));
}

// Delete the invalid applications
const deleteResult = await db.collection('applications').deleteMany({ applicant: recruiter._id });
console.log('Deleted applications count:', deleteResult.deletedCount);

// Remove those application IDs from the jobs array
for (const app of badApps) {
    const updateResult = await db.collection('jobs').updateOne(
        { _id: app.job },
        { $pull: { applications: app._id } }
    );
    console.log('Removed from job', String(app.job), '- modified:', updateResult.modifiedCount);
}

console.log('Done! Database is clean.');
await mongoose.disconnect();
