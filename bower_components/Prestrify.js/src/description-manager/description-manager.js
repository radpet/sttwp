(function ($this) {

  var registry = {};

  function add(key, config) {
    if (!registry[key]) {
      registry[key] = [];
    }
    registry[key].push(config);
  }

  function getRegistry() {
    return registry;
  }

  // TODO
  function getConfig(name) {

  }

  $this.add = add;
  $this.getRegistry = getRegistry;
  $this.getConfig = getConfig;
}(Prestrify));