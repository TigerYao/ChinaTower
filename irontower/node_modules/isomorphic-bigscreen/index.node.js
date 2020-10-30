const noop = () => {}

module.exports = {
  request: noop,
  exit: noop,
  toggle: noop,
  onenter: noop,
  onchange: noop,
  onexit: noop,
  onerror: noop,
  element: null,
  enabled: false,
  videoEnabled: () => false,
}
