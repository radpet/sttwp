(function ($this, loader) {

  loader.config({
    baseURL: '',
    map: {
      text: '/bower_components/plugin-text/text.js',
      css: '/bower_components/plugin-css/css.js'
    }
  });

  function getFileType(url) {
    return url.substring(url.lastIndexOf('.') + 1);
  }

  $this.load = function (url) {
    // System.js needs proper suffixes in order to load the file
    var typeDictionary = {
      'html': '!text',
      'js': '',
      'css': '!css'
    };

    var filetype = getFileType(url);
    return loader.import(url + typeDictionary[filetype]);
  };

}(Prestrify, System));