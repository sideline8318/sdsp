const KEY_ACTIONS = {
  ArrowLeft: 'left',
  a: 'left',
  A: 'left',
  ArrowRight: 'right',
  d: 'right',
  D: 'right',
  ArrowDown: 'softDrop',
  s: 'softDrop',
  S: 'softDrop',
  ArrowUp: 'rotate',
  w: 'rotate',
  W: 'rotate',
  ' ': 'hardDrop',
  p: 'pause',
  P: 'pause',
  r: 'restart',
  R: 'restart'
};

export function actionForEvent(event) {
  return KEY_ACTIONS[event.key] || null;
}

export function bindInput(target, handler) {
  const onKeyDown = (event) => {
    const action = actionForEvent(event);
    if (action) {
      event.preventDefault();
      handler(action);
    }
  };
  target.addEventListener('keydown', onKeyDown);
  return () => target.removeEventListener('keydown', onKeyDown);
}
