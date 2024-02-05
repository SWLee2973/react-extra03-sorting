# 3주차 과제(를 날먹해버린 회고용 일일 실습)
TODO-LIST

- [x] 바닐라 프로젝트의 데이터베이스 연동 부분을 리액트로 구현
- [x] 리액트 방식으로 앱의 상태 및 사이드 이펙트를 관리
- [x] 커스텀 훅 함수를 1개이상 작성해 여러 곳에서 재사용 - **커스텀 훅 분리 - 정렬 / 관찰 / 데이터 로드(2.5 추가)**
- [x] 가능한 경우, DOM 객체에 접근/조작하는 부분도 구현(옵션) - **무한 스크롤 구현을 위해 관찰 대상 DOM 객체에 접근**
- [ ] 가능한 경우, Storybook 활용(옵션) - **설치하고 스토리북을 실행하면 에러때문에 실행이 안되는데 해결이 안됨..**

## 1. 바닐라 프로젝트의 데이터베이스 연동 부분을 리액트로 구현
- `App.jsx` : `useEffect`를 사용해 `정렬 정보`를 의존성 배열에 등록해 정렬 요청이 있을때마다 정렬 데이터 렌더링
```js
async function fetchProducts(options, sort) {
  try{
    const fetchURL = `${API}/api/collections/products/records?page=2&perPage=8&sort=${sort.join('%2C')}`
    const response = await fetch(fetchURL, options);
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(error);
  }
}
...
function App() {
  useEffect(() => {
    const controller = new AbortController();

    fetchProducts({ signal: controller.signal }, products.sort)
      .then(data => {
        setProducts({
          productData: data?.items,
          sort: products.sort
        });
      })

    return () => controller.abort();
  }, [products.sort])
  ...
  return (/* JSX */)
}
```

## 2. 리액트 방식으로 앱의 상태 및 사이드 이펙트를 관리
- `App.jsx` : 초기값을 객체`PRODUCTS_INITIAL_STATE`로 지정해 상품 데이터(상태, 사이드 이펙트)와 정렬 정보(사이드 이펙트)를 관리
```js
function App() {
  const [products, setProducts] = useState(PRODUCTS_INITIAL_STATE);
  useEffect(() => fetchProducts(...)

  return (/* JSX */)
}
```
![상품 정렬](https://velog.velcdn.com/images/sang2973/post/c3e16f3f-b9e8-4d60-9c7d-3d27d5d643bc/image.gif)

## 회고
포켓베이스에서 다중 정렬 결과를 제대로 내주질 않는 것 같다. 콘솔에 링크 로그를 찍어 직접 url을 호출해도 데이터가 바뀌지 않는다. <br />
2개이상 클릭했을 때 화면이 일부 바뀌기는 하는 걸 보니 체크박스 작동은 하는 것 같은데..<br />

useState 실습하면서 리액트 개쉽네~ 껌이네~ 그랬는데... 또 레프트훅 라이트훅 얻어맞은 느낌이다. <br />
그래서 이름이 리액트 훅임????? <br />

useEffect를 예제가 코드가 길어지고 주석이 많아지니 가독성이 점점 떨어져 이해가 힘들었어서 더 그랬던거 같기도 하고.. <br />

하지만 오늘도 해냈다. 익숙해질 때까지 하고 또 해보는 수 밖에 없다.

## 3. 무한 스크롤 로딩 - intersection Observer API
데이터가 많아질 때 사용해볼 만한 기법으로 `무한 스크롤 기법`을 사용해 보았다.
리액트에 대해 배운 것이 늘어감에 따라 실습도 점점 고도화 되어야지~

구현 순서를 다음과 같이 정리했다.

> 1. `Intersection Observer` 선언
>   - observer가 타겟이 관찰되면 실행할 `intersectionCallback` 함수 및 options 전달
>      intersectionCallback 함수는 API 설명 사이트에 구현 방식이 설명되어 있었다.
>   - options의 `threshold` 값은 대상이 확인 될 범위를 말한다. 
>      0~1의 값이며 1이면 대상이 100% 확인되어야 한다.
>
> 1-1, 1-2. observer의 타겟 관찰을 시작하는 함수와 끝내는 함수 `observe`와 `unobserve` 선언
>    - `useRef`를 사용했기 때문에 `current.observe`를 사용하기 쉽게 observe로 재선언하였다.
>
> 1-3. observer가 관찰할 타겟 지정, 실제 DOM에 렌더링 된 상황에서 지정되기 때문에 `useRef` 사용
> 2. observer가 관찰 중인 대상이 확인되면 실행할 콜백 함수 선언
> -  관찰 중인 대상이 확인되면 page 값을 1 증가시켜 준다.
> 3. `useEffect`의 의존성 배열에 `page`값을 지정해 page의 값이 변경되면 `productData`를 추가한다.
> - 기존 데이터를 유지하고 밑에 추가해야 하기 때문에 `spread syntax`로 추가해주었다.
> 4. `useEffect`의 의존성 배열에 `productData`값을 지정해 productData가 변경되면 관찰 종료 여부를 판단한다.
> 5. productData의 개수가 없거나 총 개수보다 많거나 같아지면 관찰을 종료한다.

구현 결과는 대성공이었다!
![무한스크롤](https://velog.velcdn.com/images/sang2973/post/7be3c8d5-6a36-4edd-9fdf-0df030ae360b/image.gif)

이후에 지저분해진 코드 정리를 위해 커스텀 훅으로 정리까지 해주었다.
```js
/* useSortProductData.js */
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

/* useAddProductData.js */
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
            
/* useIntersectionObserver.js */
const useIntersectionObserver = (callback) => {
  const options = { threshold: 1 };
  const intersectionCallback = (entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        callback();
      }
    });
  }

  const observer = useRef(new IntersectionObserver(intersectionCallback, options));
  
  const observe = element => observer.current.observe(element);
  const unobserve = element => observer.current.unobserve(element);

  return [observe, unobserve];
}
```

