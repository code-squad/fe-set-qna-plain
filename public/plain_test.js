
//Plain 구현
const Plain = (() => {
  //구현이 필요해....
  let date;
  let comp;
  let eff;
  return {
    renderComponent(Component) {
        comp = Component;
        tempcomp = comp(); 
        tempcomp.render();
        eff();
        return tempcomp;
    },
    useState(_initVal) {
      if(!date) date = _initVal;
      function setDate(fn){
        date = fn();
        tempcomp = comp(); 
        tempcomp.render();
        if(eff) eff();
      }
      return [date, setDate];
    },
    useEffect(fn){
      eff = fn;
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
  for(let i=0; i<5; i++) {
    await new Promise( (resolve) => setTimeout( ()=> {
      pd.fakeEvent();
    resolve()
    }, 1000));
  }
})();
