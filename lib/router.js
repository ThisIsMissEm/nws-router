
//module.exports = Router;

function Router(options){
  var instance = this;
  
  this.routes = [];
  this.addListener("connection", function(connection){
    var url = connection._req.url;
    instance.routes.forEach(function(route){
      var captures
        , params = []
        , keys = route["keys"];
      if(captures = route["path"].exec(url)){
        for(var i=1, cl=captures.length, key; i<cl; ++i){
          key = keys[i-1];
          
          if(key){
            params[key] = captures[i];
          } else {
            params.push(captures[i]);
          }
        }
        
        route.callback.call(instance, connection, params);
      }
    });
  });
};

Router.prototype.on = function(path, callback){
  var route = normalizePath(path);
  
  this.routes.push({
    path: route.regexp,
    keys: route.keys,
    callback: callback
  });
};


function normalizePath(path, keys) {
  var keys = []
    , expr = path
        .concat('/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(\?)?/g, function(_, slash, format, key, optional){
            keys.push(key);
            slash = slash || '';
            return ''
                + (optional ? '' : slash)
                + '(?:'
                + (optional ? slash : '')
                + (format || '') + '([^/]+))'
                + (optional || '');
        })
        .replace(/([\/.-])/g, '\\$1')
        .replace(/\*/g, '(.+)');
    
    return {
      expr: new RegExp('^' + expr + '$', 'i'),
      keys: keys
    };
};