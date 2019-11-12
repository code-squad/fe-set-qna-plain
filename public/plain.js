
//Plain 구현
const Plain = (() => {
  let val;
  let useEffectFn;
  let planTestObj;
  
  return {
    useState: (initVal)=> {
      val = !val ? initVal : val; 
      return [
        val,
        param => {
          planTestObj().render();
          val = param();
          useEffectFn();
        }
      ]
    },
    useEffect: cb => {
      useEffectFn = cb;
    },
    renderComponent: obj => {
      planTestObj = obj;
      return planTestObj();
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
