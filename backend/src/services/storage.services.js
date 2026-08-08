import ImageKit from "imagekit";

let imagekit;

function getImageKit() {
  if (!imagekit) {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }
  return imagekit;
}

async function uploadImage(fileBuffer, fileName) {
  const ik = getImageKit();

  const base64File = fileBuffer.toString("base64");

  const result = await ik.upload({
    file: base64File,
    fileName,
    folder:"/food-reel"
  });

  return result;
}
export { uploadImage };