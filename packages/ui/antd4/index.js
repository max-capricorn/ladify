const modules = import.meta.globEager('./*.jsx')

const components = {}

for (const path in modules) {

  let name = path.replace(/(\.\/|\.jsx)/g, '')

  components[name] = modules[path].default
}

export default components
