
//Plain 구현
const Plain = (() => {
  let foo = {};
  return {
    renderComponent(Component) {
      this.setFoo = (fn) => {
        this.value = typeof fn === 'function' ? fn(this.value) : null;
        this.component = Component();
        this.component.render();        
        if(typeof this.effect === 'function') {
          this.effect();
      };
      };
      this.setFoo();
      return this.component;
    },
    useState(value) {
      return [this.value || value, this.setFoo];
    },

    useEffect(e){
      this.effect = e;
    },
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
