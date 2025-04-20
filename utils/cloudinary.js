const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadMultipleOnCloudinary = async (filesPath) => {
    try {
        if (!filesPath) return null;

        const uploadedFiles = [];

        for (const filePath of filesPath) {

            const response = await cloudinary.uploader.upload(filePath, {
                resource_type: "auto"
            })

            if (!response) {
                throw new Error("File Uploading Failed");
            }

            uploadedFiles.push(response.url);
            fs.unlinkSync(filePath);
        }
        return uploadedFiles;

    } catch (error) {
        console.error("Error while uploading multiple file on cloudinary: ", error)
        return null;
    }
};

module.exports = {
    uploadMultipleOnCloudinary
}