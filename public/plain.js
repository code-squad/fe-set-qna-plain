
//Plain 구현
const Plain = (() => {
  let value, comp, effect_fn;
  return {
    useState(v) {
      value = value || v;
      const setState = (fn) => {
        value = fn();
        comp().render();
        if(effect_fn) effect_fn();
      };
      return [value, setState];
    },
    useEffect(fn) {
      effect_fn = fn;
    },
    renderComponent(component) {
      comp = component;
      comp().render();
      if(effect_fn) effect_fn();
      return comp();
    }
  }
})();