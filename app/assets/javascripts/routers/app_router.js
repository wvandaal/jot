Jot.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "jots/new": "newJot",
    "login": "login",
    "logout": "logout",
  },

  newJot: function () {
    var view = new Jot.Views.JotsNew();
    $('.container').animate({top: -2000}, 1000, function(){
      $('#viewport').html(view.render().$el);
    })
  }
});
