const dotenv = require("dotenv")
dotenv.config("./.env")
const environment = {
    mongo_url: process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio-dashboard",
    port: process.env.PORT || 5002,
    node_env: process.env.NODE_ENV || "development",
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "your_cloud_name",
    cloud_api_key: process.env.CLOUDINARY_API_KEY || "your_api_key",
    cloud_api_secret: process.env.CLOUDINARY_API_SECRET || "your_api_secret"
}

module.exports = environment