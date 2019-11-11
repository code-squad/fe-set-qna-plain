//Plain 구현
const Plain = (() => {
  let value;
  let effectFn;
  let thisComp;

  return {
    useState(initVal) {
      let state = value || initVal;
      const setState = newVal => {
        value = newVal();
        this.renderComponent(thisComp);
      };
      return [state, setState];
    },

    renderComponent(Component) {
      thisComp = Component;
      const comp = Component();
      comp.render();
      effectFn();
      return comp;
    },
    useEffect(fn) {
      effectFn = fn;
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
      this.render();
      this.useEffect();
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
