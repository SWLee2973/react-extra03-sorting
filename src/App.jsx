import { useState, useEffect } from 'react'
import { Product } from './components'
import classes from './App.module.css';

const API = import.meta.env.VITE_PB_URL

async function fetchProducts(options, sort) {
  try{
    const fetchURL = `${API}/api/collections/products/records?page=2&perPage=8&sort=${sort.join('%2C')}`
    const response = await fetch(fetchURL, options);
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(error)
  }
}

const PRODUCTS_INITIAL_STATE = {
  productData: [],
  sort: [],
};

function SortChecker({
  id, children, value, ...props
}) {
  return (
    <>
      <input 
        type="checkbox" 
        id={id} 
        value={value}
        {...props} />
      <label 
        className={classes.sortLabel} 
        htmlFor={id}
      >
        {children}
      </label>
    </>
  )
}

function App() {
  const [products, setProducts] = useState(PRODUCTS_INITIAL_STATE);

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts({ signal: controller.signal }, products.sort)
      .then(data => {
        setProducts({
          productData: data?.items,
          sort: products.sort
        });
      })
  }, [products.sort])

  const handleCheck = (e) => {
    const { value, checked } = e.target;
    setProducts({
      ...products,
      sort: checked ? [...products.sort, value] 
                    : products.sort.filter(s => s != value)
    })
  }

  return (
    <>
      <nav>
        <SortChecker
          onChange={handleCheck}
          id='product_name'
          value='product_name'
          checked={products.sort.includes('product_name')}
        >
          이름순
        </SortChecker>
        <SortChecker
          onChange={handleCheck}
          id='-created'
          value='-created'
          checked={products.sort.includes('-created')}
        >
          신상품순
        </SortChecker>
        <SortChecker
          onChange={handleCheck}
          id='price'
          value='price'
          checked={products.sort.includes('price')}
        >
          가격순
        </SortChecker>
      </nav>
      <ul style={{
        inlineSize: '1050px',
        margin: '0 auto',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',

      }}>
        {products.productData.map(product => {
          return <Product key={product.id} {...product}/>
        })}
      </ul>
    </>
  )
}

export default App
