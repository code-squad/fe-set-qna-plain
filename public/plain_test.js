
//Plain 구현
const Plain = (() => {
  return {
    foo: null,
    renderComponent(Component) {
      const component = Component();
      this.render.bind(this, component.render);
      return component;
    },

    useState(value) {
      
      this.foo = value;

      debugger;

      const setFoo = (fn) => {
        this.foo = fn(this.foo);
        this.render();
      }
      return [this.foo, setFoo];
    },

    effect(fn) {
      fn();
    },

    render(fn) {
      fn();
      this.effect();
    },

    useEffect(fn) {
      this.effect.bind(this, fn);
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
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => setTimeout(() => {
      pd.fakeEvent();
      resolve()
    }, 1000));
  }
})();
