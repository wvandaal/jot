Jot.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "": "home",
    "jots/new": "newJot",
    "logout": "logout"
  },

  initialize: function() {
    this._currentView = null;
    this.$viewport = $('#viewport');
  },

  home: function() {
    var view;

    // If logged in, root to profile page
    if (!!Jot.currentUser.get('id')) {
      view = new Jot.Views.UsersShow({
        model: Jot.currentUser,
        collection: Jot.currentUser.jots()
      });
    // else render the welcome banner
    } else {
      view = new Jot.Views.Home();
    }
    this._animateView(view);
  },

  logout: function() {
    $.ajax({
      type: 'POST',
      url: 'api/session',
      data: {'_method': 'DELETE'},
      dataType: 'json'
    }).done(function(data) {

      // Reinstalls the navbar with the user logged out, navigates to the
      // homepage, and nullifies the currentUser
      Jot.renderNavbar(null);
      Backbone.history.navigate("", {trigger: true});
    }).fail(function(data) {
      console.log(data);
    });    
  },

  newJot: function () {
    var view = new Jot.Views.JotsNew();
    this._animateView(view);
  },

  // Animates views on transition and calls _swapView
  _animateView: function(view, direction) {
    var that        = this,
        $container  = $('.container').first();

    if (!!view) {
      if ($container.length) {
        $('.container').animate({top: -2000}, 1000, function(){
          that._swapView(view);
        });
      } else {
        this._swapView(view);
      }
    } else {
      $('.container').animate({top: -2000}, 1000, function(){
        that._swapView(null);
      });
    }
  },

  // Swaps views and removes zombies to prevent memory leaks
  _swapView: function(view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;

    (!!!view ? $.fn.empty : $.fn.html).call(this.$viewport, view.render().$el);
  }
});
