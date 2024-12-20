import mongoose from "mongoose";

const connectDb = async () => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_ATLAS_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas!");
        
    }
};

export default connectDb;
