var util = require('util');


var TEMPLATE = '' +
  'window.__html__ = window.__html__ || {};\n' +
  'window.__html__[\'%s\'] = \'%s\'';

var escapeContent = function(content) {
  return content.replace(/'/g, '\\\'').replace(/\r?\n/g, '\\n\' +\n    \'');
};

var getTemplateName = function(templateFile) {
  var dir = '/templates';
  var template;
  
  templateFile = templateFile.substr(templateFile.lastIndexOf(dir) + dir.length);
  template = templateFile.substr(0,templateFile.lastIndexOf('.'));
  template = template.replace(/index/i,'').replace(/\/$/,'');
  
  if (template.match('pages/page')) {
    template = 'page';
  } else if (template.match('thumbnails/thumbnail')) {
    template = 'thumbnail';
  } else {
    template = template.replace(/\/([a-zA-Z{1})/g, function(all, letter) {
      return letter.toUpperCase();  
    });
  }
  
  return template;
}

var createHtml2JsPreprocessor = function(logger, basePath) {
  var log = logger.create('preprocessor.html2js');

  return function(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);

    var htmlPath = file.originalPath.replace(basePath + '/', '');

    file.path = file.path + '.js';
    done(util.format(TEMPLATE, getTemplateName(htmlPath, escapeContent(content)));
  };
};

createHtml2JsPreprocessor.$inject = ['logger', 'config.basePath'];

module.exports = createHtml2JsPreprocessor;
