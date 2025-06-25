import all_product from '../../assets/products/All_product';
import './BulkUpload.css'; // Make sure to import your CSS file

const images = import.meta.glob('../../assets/products/*.png', { eager: true });
const productImages = Object.values(images);

const BulkUpload = () => {
  const uploadAll = async () => {
    for (let i = 0; i < all_product.length; i++) {
      try {
        const product = all_product[i];
        const imageURL = product.image;

        console.log("Fetching image URL:", imageURL);

        const blob = await fetch(imageURL).then(res => res.blob());
        const file = new File([blob], `product_${i + 1}.png`, { type: blob.type });

        const formData = new FormData();
        formData.append('product', file);

        const uploadRes = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });

        const { image_url } = await uploadRes.json();

        const finalProduct = {
          name: product.name,
          category: product.category,
          old_price: product.old_price,
          new_price: product.new_price,
          image: image_url,
        };

        await fetch('http://localhost:3000/add-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalProduct),
        });

        console.log(`✅ Uploaded ${product.name}`);
      } catch (err) {
        console.error(`❌ Error at product ${i + 1}:`, err);
      }
    }
  };

  return (
    <div className="upload-section">
      <div className="upload-header">
        <h1 className="upload-title">Build Product Upload</h1>
        <p className="upload-subtitle">Bulk upload all your products at once</p>
      </div>
      
      <button className="upload-button" onClick={uploadAll}>
        Upload All Products
      </button>
      
      <div className="upload-progress">
        {/* Progress indicators can go here */}
      </div>
    </div>
  );
};


export default BulkUpload;