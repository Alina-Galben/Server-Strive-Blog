import { v2 as cloudinary } from 'cloudinary';

/**
 * Rimuove un file da Cloudinary a partire dalla URL completa (es: https://res.cloudinary.com/.../nomefile.jpg)
 */
const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;

  // Estraggo la public_id rimuovendo la parte iniziale e l'estensione
  const parts = imageUrl.split('/');
  const fileNameWithExt = parts[parts.length - 1];
  const folderPath = parts.slice(-2, -1)[0]; // es: 'epicode-uploads'
  const publicId = `${folderPath}/${fileNameWithExt.split('.')[0]}`;

  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`🗑️ Immagine rimossa da Cloudinary: ${publicId}`);
  } catch (err) {
    console.warn("⚠️ Errore nella cancellazione da Cloudinary:", err.message);
  }
};

export default deleteFromCloudinary;
