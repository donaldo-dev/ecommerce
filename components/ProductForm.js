import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const router = useRouter();
  const [goToProducts, setGoToProducts] = useState(false);
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };
    if(_id){
      //update
      await axios.put('/api/products', {...data, _id})
    }else{
      //create
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push('/products')
  }
  async function uploadImages(ev){
    const files = ev.target?.files;
    if(files?.length > 0){
      const data = new FormData();
      for(const file of files){
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data, {
        headers: {'Content-Type': 'multipart/form-data'}
      });
      console.log(res.data)
    }
  }
  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="Product name"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />
      <label>Photos</label>
      <div className="mb-2">
        <label className="w-24 h-24 cursor-pointer text-center flex rounded-lg bg-gray-200 gap-1 text-sm text-gray-500 items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
          </svg>

          Upload 
          <input onChange={uploadImages} type="file" className="hidden"/>
        </label>
        {!images?.length && (
          <div>No photos in this product</div>
        )}
      </div>
      <label>Description</label>
      <textarea
        value={description}
        onChange={ev => setDescription(ev.target.value)}
        placeholder="Description">

      </textarea>
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={ev => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  )
}