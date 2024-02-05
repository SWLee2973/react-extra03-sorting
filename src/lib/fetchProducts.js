
const API = import.meta.env.VITE_PB_URL;

export default async function fetchProducts(options, sort, page) {
  try{
    const fetchURL = `${API}/api/collections/products/records?page=${page}&perPage=8&sort=${sort.join('%2C')}`
    const response = await fetch(fetchURL, options);
    const data = await response.json();

    return data;
  } catch (error) {
    if(!(error instanceof DOMException)) {
      throw new Error(error);
    }
  }
}