# 3주차 과제(를 날먹해버린 회고용 일일 실습)
TODO-LIST

- [x] 바닐라 프로젝트의 데이터베이스 연동 부분을 리액트로 구현
- [x] 리액트 방식으로 앱의 상태 및 사이드 이펙트를 관리
- [ ] 커스텀 훅 함수를 1개이상 작성해 여러 곳에서 재사용 - **커스텀 훅 아직 안배움.**
- [ ] 가능한 경우, DOM 객체에 접근/조작하는 부분도 구현(옵션) - **과제에서 필요한 부분을 찾지 못했음..**
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
