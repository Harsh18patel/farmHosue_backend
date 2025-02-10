const sharp = require('sharp');
const fs = require('fs');
const path = require('path');


const convertToWebPBuffer = async (imageBuffer) => {
    try {
        // Convert image to WebP format using sharp
        const webpImage = await sharp(imageBuffer)
            .webp()  // Convert to WebP
            .toBuffer(); // Return the WebP buffer
        return webpImage;  // Return the binary data (WebP)
    } catch (err) {
        console.error('Error converting image to WebP:', err);
        throw new Error('Error converting image to WebP: ' + err.message);
    }
};


const saveWebPImageToDisk = async (imageBuffer, imageName, index) => {
    try {
        // Use the index to generate a unique image name with brackets
        const outputPath = path.resolve(__dirname, '..', '..', 'public', 'images', `${imageName}[${index}].webp`);
        
        // Create the 'public/images' folder if it doesn't exist
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write the WebP image to disk
        await fs.promises.writeFile(outputPath, imageBuffer);

        // Return the relative URL of the saved image in the public folder
        return `/images/${imageName}[${index}].webp`; // Relative URL for accessing the image
    } catch (err) {
        console.error('Error saving WebP image to disk:', err);
        throw new Error('Error saving WebP image to disk: ' + err.message);
    }
};




// Function to handle image conversion if it's a BLOB in the database
const convertBlobImageToWebP = async (propertyID, propertyModel) => {
    try {
        // Retrieve the property from the database by propertyID
        const property = await propertyModel.getPropertyById(propertyID);

        if (property && property.property_images) {
            // Image is a BLOB, so convert it to WebP format
            const imageBuffer = Buffer.from(property.property_images, 'base64');  // Convert BLOB to Buffer

            // Convert the image to WebP format
            const webpImageBuffer = await convertToWebPBuffer(imageBuffer);

            // Save the WebP image to disk and get the relative path
            const imagePath = await saveWebPImageToDisk(webpImageBuffer, propertyID, 1); // Use propertyID as base name

            // Prepare the path as JSON
            const imagePaths = [{ path: imagePath }];  // Wrap the image path in an object

            // Update the database with the new image path in JSON format
            await propertyModel.updatePropertyImage(propertyID, JSON.stringify(imagePaths)); // Ensure this method updates the image path in the DB

            return imagePaths;
        }
    } catch (err) {
        console.error('Error converting BLOB image to WebP:', err);
        throw err;
    }
};



// Export functions
module.exports = { convertToWebPBuffer, saveWebPImageToDisk, convertBlobImageToWebP };
