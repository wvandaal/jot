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
  Jot.initialize();
});
