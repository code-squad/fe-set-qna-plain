
//Plain 구현
const Plain = (() => {
  let component = null;
  let runEffect = null;

  return {
    renderComponent: (plain_test) => {
      component = plain_test();
      return component;
    },

    useState: (value) => {
      value = [value];

      const setFoo = (fn) => {
        console.log(value);
        console.log(fn(value));
        component.render();
        runEffect();
        value = [fn(value)];
      }

      return [value, setFoo];
    },

    useEffect: (fn) => {
      runEffect = fn;
    }
  }
})();

function plain_test() {
  const [foo, setFoo] = Plain.useState(``);

  debugger;

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
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => setTimeout(() => {
      pd.fakeEvent();
      resolve()
    }, 1000));
  }
})();
