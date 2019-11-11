
//Plain 구현
const Plain = (() => {
  let _val;
  let _comp;
  let _effect;
  let _hasChanged;

  function stateChanged() {
    Plain.renderComponent(_comp);
    
    if (_hasChanged) {
      _effect();
    }
  }

  return {
    renderComponent(Component) {
      // 내부에서 사용하기 위해 저장
      _comp = Component;
      const comp = _comp();
      comp.render();
      return comp;
    },
    useState(_initVal) {
      const foo = _val || _initVal;

      const setFoo = _newVal => {
        _hasChanged = false;
        
        if (_val !== _newVal) {
          _val = _newVal();
          _hasChanged = true;
          stateChanged();
        }
      };

      return [foo, setFoo];
    },
    useEffect(callback) {
      _effect = callback;
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
