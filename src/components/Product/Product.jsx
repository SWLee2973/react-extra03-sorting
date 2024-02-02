import classes from './Product.module.css';

const getProductImageURL = ( product) => {
  return `${import.meta.env.VITE_PB_API}/files/${product.collectionId}/${product.id}/${product.product_img}`;
}

const Product = (product) => {

  return (
  <li className={classes.product}>
    <a href="#">
      <Thumbnail {...product} />
      {product.brand_id && <p className={classes.brand_id}>{product.product_name}</p>}
      <p className={classes.title}>{product.product_name}</p>
      <Price {...product} />
      <span className={classes.description}>{product.product_description}</span>
      <Keyword {...product}/>
    </a>
  </li>  
  )
}

const Thumbnail = (product) => (
  <figure className={classes.thumbnail}>
    <img src={`${getProductImageURL(product)}`} alt={product.product_name} />
    <figcaption className={classes.cart} aria-label={`${product.product_name}을(를) 장바구니에 담기`}></figcaption>
  </figure>
)

const Price = (product) => {
  const realPrice = (
    Math.floor(
      (product.price * (1 - 0.01 * (product.discount ? product.discount : 0))) / 10) * 10
    ).toLocaleString('ko-KR');

  return (
    <>
      <p className={classes.discount}>
        {product.discount !=0? <span className={classes["discount-rate"]}>{product.discount}%</span>:''}
        <span className={classes["real-price"]}>{realPrice}원</span>
      </p>
      {product.discount !=0 ? <p className={classes["regular-price"]}>{product.price.toLocaleString('ko-KR')}원</p>:''}
    </>
  )
}

const Keyword = (product) => (
  <p className={classes["keyword-list"]}>
    {product.karly_only == 1? <span className={`${classes.keyword} ${classes.only}`}>Karly Only</span>
      : product.karly_only == 2? <span className={`${classes.keyword} ${classes.only}`}>희소가치 프로젝트</span>: ''}
    {product.limit == 1 ? <span className={classes.keyword}>한정수량</span>: ''}
  </p>
)

export default Product;