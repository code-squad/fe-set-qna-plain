
//Plain 구현
const Plain = (() => {
  let time, plain_fn, effect_fn;
  return {
    useState(v) {
      time = time || v;
      return [
        time,
        (getTime_fn) => {
          time = getTime_fn();
          plain_fn().render();
          effect_fn();
        }
      ];
    },
    useEffect(fn) {
      effect_fn = fn;
    },
    renderComponent(fn) {
      plain_fn = fn;
      plain_fn().render();
      effect_fn();
      return plain_fn();
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
