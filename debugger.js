function Debugger(name, enabled) {
    this.debug = {}
    if (!window.console) {
        return function () {
        }
    }
    for (let m in console) {
        if (typeof console[m] === 'function') {
            if (enabled) {
                this.debug[m] = console[m].bind(window.console + ': ' + name + ': ')
            } else {
                this.debug[m] = function () {
                }
            }
        }
    }
    return this.debug
}