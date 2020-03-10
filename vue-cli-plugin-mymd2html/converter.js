module.exports = class {
  createVue(convertedHTML) {
    return `<template>
              <div>
                ${convertedHTML}
              </div>
            </template>
            <script>
              export default {}
            </script>`
  }
}
