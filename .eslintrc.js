module.exports = {
  extends: 'standard',
  rules:   {
    'comma-dangle':    ['error', 'always-multiline'],
    'key-spacing':     ['error', {
      beforeColon: false,
      afterColon:  true,
      mode:        'minimum',
      align:       'value'
    }],
    'linebreak-style': ['error', 'unix'],
  },
}