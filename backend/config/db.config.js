import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected: " + connection.connection.host);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;