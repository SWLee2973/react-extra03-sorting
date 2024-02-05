import { useEffect } from 'react';
import fetchProducts from '../lib/fetchProducts';

const useSortProductData = (products, setProducts) => {
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
  }, [products.sort]);
}

export default useSortProductData;