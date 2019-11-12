
//Plain 구현
const Plain = (() => {
  //구현이 필요해....

  // 테스트
  //debugger;

  // 변수 선언
  let setValue;
  let readComponent;
  let showEffectFunction;
  let foo = '';

  return {
    // renderComponent 구현
    renderComponent (Component) {
      readComponent = Component;
        
        // Component 랜더링
        readComponent().render();
        showEffectFunction();
      
        return readComponent();
    },
    // useState 구현
    useState (initValue) {
      foo = setValue || initValue;
      let setFoo = (newValue) => {
        // 성공! 그런데 왜 foo가 아니라 setValue에서 작동하지?
        setValue = newValue();
        
        // renderComponent 함수 호출
        this.renderComponent(readComponent);
      }
      return [foo, setFoo];
    },
    // useEffect 구현
    useEffect (effectFunction) {
      showEffectFunction = effectFunction;
      return showEffectFunction;
    }
  }
})();

function plain_test() {
  const [foo, setFoo] = Plain.useState(``);

  const fireEvent = () => {
    setFoo(value => (new Date).toLocaleTimeString() || value);
  };

  Plain.useEffect(() => {
    console.log(`[effect]`);
    console.log(`-----------------------`);
  });

  return {
    render() {
      console.log(`[render] : ${foo}`);
    },
    fakeEvent() {
      fireEvent();
    },
    initComponent() {
      //초기화코드가 있다면 넣을수도 있음
    }
  };
}

let pd = Plain.renderComponent(plain_test);

(async function loop() {
  for(let i=0; i<5; i++) {
    await new Promise( (resolve) => setTimeout( ()=> {
      pd.fakeEvent();
    resolve()
    }, 1000));
  }
})();
