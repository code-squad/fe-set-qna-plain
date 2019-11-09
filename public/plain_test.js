
//Plain 구현
const Plain = (() => {
  let _val;

  function stateChanged() {
    Plain.renderComponent(plain_test);
  }

  return {
    renderComponent(Component) {
      const comp = Component();
      comp.render();
      return comp;
    },
    useState(_initVal) {
      const foo = _val || _initVal;
      
      const setFoo = _newVal => {
        _val = _newVal();
        // foo 변경시 다시 렌더링
        stateChanged();
      };

      return [foo, setFoo];
    },
    useEffect(callback) {
      // useEffect를 plain_test의 fakeEvent queue와 함께 실행
      setTimeout(callback, 0);
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
