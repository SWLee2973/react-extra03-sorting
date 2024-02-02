import { useState, useEffect } from 'react'
import { Product } from './components'

const API = import.meta.env.VITE_PB_URL;

async function fetchProducts(options) {
  try{
    const response = await fetch(`${API}/api/collections/products/records?page=1&perPage=5`, options);
    const data = await response.json();

    console.log(data);

    return data;
  } catch (error) {
    throw new Error(error)
  }

}

function App() {
  const [productData, setProductData] = useState([]);

  // 최초 한번만 데이터 호출해서 렌더링
  useEffect(() => {
    const controller = new AbortController();

    fetchProducts({ signal: controller.signal })
      .then(data => {
        setProductData(data?.items);
      })
  }, [])

  return (
    <ul>
      {productData.map(product => {
        return <Product key={product.id} {...product}/>
      })}
    </ul>
  )
}

export default App
