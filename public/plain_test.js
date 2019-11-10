
//Plain 구현
const Plain = (() => {
  let value;
  let comp;
  let effects = {};

  const render = () => {
    const temp = comp();
      temp.render();
      for (const key in effects) {
        effects[key]();
      }
      return temp;
  }

  const setValue = (fn) => {
    value = fn();
    render();
  };

  return {
    renderComponent(Component) {
      comp = Component;
      return render();
    },
    render() {
      const temp = comp();
      temp.render();
      for (const key in effects) {
        effects[key]();
      }
      return temp;
    },
    useEffect(fn) {
      if (!fn) {
        return;
      }
      effects[fn.name] = fn;
    },
    useState(_initValue) {
      if (!value) value = _initValue;
      if (!setValue) {  
        setValue = (fn) => {
          value = fn();
          this.render();
        };
      }
      return [value, setValue];
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
