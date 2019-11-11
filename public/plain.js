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
      // effectFn();
      return comp;
    },
    useEffect(fn) {
      effectFn = fn;
    }
  };
})();