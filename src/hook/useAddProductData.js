import { useEffect } from 'react';
import fetchProducts from '../lib/fetchProducts';

const useAddProductData = (products, setProducts) => {
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
}

export default useAddProductData;