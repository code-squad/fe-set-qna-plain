//Plain 구현
const Plain = (() => {
  let component;
  let value;
  let effect;
  let setFoo;

  return {
    renderComponent(Component) {
      setFoo = (fn) => {
        value = typeof fn === 'function' ? fn(this.value) : null;
        component = Component();
        component.render();
        if (typeof effect === 'function') {
          effect();
        };
      };

      setFoo();
      return component;
    },
    useState(_value) {
      return [value || _value, setFoo];
    },

    useEffect(e) {
      effect = e;
    },
  }
})();