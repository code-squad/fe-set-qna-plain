//Plain 구현
const Plain = (() => {
  let date, comp, eff;
  function action() {
    temp = comp();
    temp.render();
    if (eff) eff();
    return temp;
  }
  return {
    renderComponent(Component) {
      comp = Component;
      return action();
    },
    useState(_initVal) {
      if (!date) date = _initVal;
      function setDate(fn) {
        date = fn();
        action();
      }
      return [date, setDate];
    },
    useEffect(fn) {
      eff = fn;
    }
  };
})();

function plain_test() {
  const [foo, setFoo] = Plain.useState(``);
  const fireEvent = () => {
    setFoo(value => new Date().toLocaleTimeString() || value);
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
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve =>
      setTimeout(() => {
        pd.fakeEvent();
        resolve();
      }, 1000)
    );
  }
})();
