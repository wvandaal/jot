window.Jot = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    new Jot.Routers.AppRouter();
    Backbone.history.start();
  }, 
};

$(document).ready(function(){
  // Set highlighting options for marked
  marked.setOptions({
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });

  // Create new diff object
  Differ = new diff_match_patch();

  Jot.initialize();
});
