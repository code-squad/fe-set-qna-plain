const React = (()=> {
  return {
      value: null,
      render(Component) {
          const comp = Component();
          comp.render();
          return comp;
      },
      useState(_initVal) {
        this.value = this.value || _initVal;
        const setFoo = (n) => {
          this.value = n;
          debugger;
        }

        return [this.value, setFoo];
      },
  }

})();

function MyComponent() {
  const [foo, setFoo] = React.useState(10);
  return {
      render() {
          setFoo(foo + 1);
          console.log(`foo value is ${foo}`);
      }
  }
}

React.render(MyComponent);
React.render(MyComponent);
React.render(MyComponent);