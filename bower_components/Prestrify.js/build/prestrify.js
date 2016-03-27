(function () {
  'use strict';
  function Prestrify() {

  }

  window.Prestrify = window.Prestrify || Prestrify;

}());
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
function PrestrifyEngine(config) {
  this.config = config;
}

PrestrifyEngine.prototype.createPresentationTemplate = function () {
  var template = '<div class="reveal"><div class="slides">{{{slides}}}</div></div>';
  return template;
};

PrestrifyEngine.prototype.createSlideTemplate = function () {
  var template = '<section>{{{slideContent}}}</section>';
  return template;
};

PrestrifyEngine.prototype.getSlidesData = function () {
  var _this = this;
  var slides = Prestrify.getRegistry()['slide'];
  slides.sort(function (slide1, slide2) {
    return slide1.order - slide2.order;
  });
  var slideModels = [];

  slides.forEach(function (slide) {
    slideModels.push(_this.getSlideData(slide));
  });
  return slideModels;
};

PrestrifyEngine.prototype.getSlideData = function (slide) {
  var resources = [];
  if (slide.template.length) {
    resources.push(Prestrify.load(slide.template));
  }
  if (slide.controller.length) {
    resources.push(Prestrify.load(slide.controller));
  }
  if (slide.styles.length) {
    slide.styles.forEach(function (style) {
      resources.push(Prestrify.load(style));
    });
  }
  return Promise.all(resources).then(function (args) {
    return {
      template: args[0],
      controller: args[1]
    }
  }).catch(function (e) {
    throw Error(e);
  });
};

function TemplateCompiler(compiler) {
  this.compiler = compiler;
}

TemplateCompiler.prototype.compile = function (template) {
  return this.compiler.compile(template);
};

function create(config) {
  $this = this;
  console.log('Lets build this shit', config);

  $this.load('../bower_components/bluebird/js/browser/bluebird.js').then(function (promise) {
    window.Promise = Promise;
    return Promise.all([
      $this.load('../bower_components/jquery/dist/jquery.js'),
      $this.load('../bower_components/handlebars/handlebars.js'),
      $this.load('../bower_components/reveal.js/js/reveal.js'),
      $this.load('../bower_components/reveal.js/css/reveal.css'),
      $this.load('../bower_components/reveal.js/css/theme/white.css')
    ]);
  }).then(function (args) {
    var $ = args[0];
    var Handlebars = args[1];
    var Reveal = args[2];

    var engine = new PrestrifyEngine(config);
    var compiler = new TemplateCompiler(Handlebars);

    var presentationTemplate = compiler.compile(engine.createPresentationTemplate());
    var slideTemplate = compiler.compile(engine.createSlideTemplate());

    var slidesContent = '';
    var slidesDataModels = engine.getSlidesData();
    Promise.all(slidesDataModels).then(function (slides) {
      slides.forEach(function (slide) {
        if (slide.controller) {
          slide.controller();
        }
        slidesContent = slidesContent.concat(slideTemplate({slideContent: slide.template}));
      });
      var compiledPresentation = presentationTemplate({slides: slidesContent});
      $(config.selector).append(compiledPresentation);
      setTimeout(function () {
        Reveal.initialize();
        $('html').trigger('PrestrifyLoaded');
      }, 1000);
    });

  }).catch(function (e) {
    throw new Error(e);
  });

  if (config.theme) {
    this.load(config.theme);
  }

  var slides = this.getRegistry();
}


(function ($this) {
  $this.create = create.bind($this);
}(Prestrify));