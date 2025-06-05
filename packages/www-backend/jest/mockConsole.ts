import SpyInstance = jest.SpyInstance;

const spies: SpyInstance[] = [];

global.beforeEach(() => {
  if (spies.length > 0) {
    return;
  }

  const consoleMethods = Object.keys(console).filter(
    // @ts-ignore
    (paramName) => typeof console[paramName] === 'function'
  );

  consoleMethods.forEach((methodName) => {
    // @ts-ignore
    spies.push(jest.spyOn(console, methodName));
  });
});

global.afterEach(() => {
  spies.forEach((spy) => spy.mockReset());
});
