//Plain 구현
const Plain = (() => {
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