import { useState, useEffect, useRef } from 'react'
import { Product } from './components'
import classes from './App.module.css';
import { useIntersectionObserver, useAddProductData, useSortProductData } from './hook';

const PRODUCTS_INITIAL_STATE = {
  productData: [],
  sort: [],
  page: 1,
  totalItems: 0,
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

  const setPage = () => {
    setProducts(products => {
      return {...products, page: products.page + 1}
    })
  }

  const [observe, unobserve] = useIntersectionObserver(setPage);
  const observeTarget = useRef(null);

  useEffect(() => {
    if(products.page === 1) observe(observeTarget.current);

    const N = products.productData.length;
    const totalCount = products.totalItems;

    if(0 === N || totalCount <= N) {
      unobserve(observeTarget.current);
    }
  }, [products.productData])

  useAddProductData(products, setProducts);
  useSortProductData(products, setProducts);

    
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
      <ul 
        style={{
          inlineSize: '1050px',
          margin: '0 auto',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {products.productData.map(product => {
          return <Product key={product.id} {...product}/>
        })}
        <li ref={observeTarget}></li>
      </ul>
    </>
  )
}

export default App
