import { useState, useEffect, useRef } from 'react'
import { Product } from './components'
import classes from './App.module.css';

const API = import.meta.env.VITE_PB_URL

async function fetchProducts(options, sort, page) {
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

  const callback = () => {
    setProducts(products => {
      return {...products, page: products.page + 1}
    })
  }

  const options = { threshold: 1 };
  const callbackFn = (entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        callback();
      }
    });
  }

  const observer = useRef(new IntersectionObserver(callbackFn, options));

  const observe = item => observer.current.observe(item);
  const unobserve = item => observer.current.unobserve(item);

  const observeTarget = useRef(null);

  useEffect(() => {
    if(products.page === 1) observe(observeTarget.current);

    const N = products.productData.length;
    const totalCount = products.totalItems;

    if(0 === N || totalCount <= N) {
      unobserve(observeTarget.current);
    }
  }, [products.productData])

  // 
  useEffect(() => {
    const controller = new AbortController();

    fetchProducts({ signal: controller.signal }, products.sort, products.page)
      .then(data => {
        setProducts({
          ...products,
          productData: data?.items,
          sort: products.sort,
          totalItems: data?.totalItems,
        });
      })
      
      return () => controller.abort();
  }, [products.sort])

  //
  useEffect(() => {
    const controller = new AbortController();

    fetchProducts({ signal: controller.signal }, products.sort, products.page)
      .then(data => {
        setProducts({
          ...products,
          productData: [...products.productData, ...data.items],
          sort: products.sort,
          totalItems: data?.totalItems,
        });
      })
      
      return () => controller.abort();
  }, [products.page])    
    
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
