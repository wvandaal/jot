// TODO:
// 1) Add delete jots
// 2) Add delete comments
// 3) Add delete users
Jot.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "": "home",
    "users/:id": "showUser",
    "users": 'usersIndex',
    "jots/new": "newJot",
    "jots/:id/edit": "editJot",
    "jots/:id": "showJot",
    "help": "help",
    "info": "info"
  },

  // Note: All #ids must be capitalized to prevent style cross-contamination from
  // ids generated by markdown redering
  initialize: function() {
    this._currentView = null;
    this.$viewport = $('#VIEWPORT');

    // Move from Jot.initialize to prevent blank template rendering when clicking
    // back/forward browser buttons
    Backbone.history.start();
  },

  // Routes to banner page if not signed in, else routes to user profile
  home: function() {
    var view;

    // If logged in, root to profile page
    if (Jot.currentUser && Jot.currentUser.get('id')) {
      view = new Jot.Views.UsersShow({
        model: Jot.currentUser,
        collection: Jot.currentUser.jots()
      });
    // else render the welcome banner
    } else {
      view = new Jot.Views.Home();
    }
    this._swapView(view);
  },

  // Render the information page
  info: function() {
    var view = new Jot.Views.Info();
    this._swapView(view);
  },

  help: function() {
    var view = new Jot.Views.Help();
    this._swapView(view);
  },

  // Users' profile page
  showUser: function(id) {
    var user    = new Jot.Models.User({id: id}),
        promise = user.fetch(),
        that    = this,
        view;

    promise.done(function() {
      view = new Jot.Views.UsersShow({
        model: user,
        collection: user.jots()
      });
      that._swapView(view);
    }).fail(function(errors) {
      Jot.Messages = errors.responseJSON;
      that._swapView();
    });
  },

  usersIndex: function() {
    var users   = new Jot.Collections.Users(),
        promise = users.fetch(),
        that    = this,
        view;

    promise.done(function() {
      view = new Jot.Views.UsersIndex({
        collection: users
      });
      that._swapView(view);
    }).fail(function(errors) {
      Jot.Messages = errors.responseJSON;
      that._swapView();
    });
  },

  // View individual jots and their comments
  showJot: function(id) {
    var jot      = new Jot.Models.Jot({id: id}),
        that     = this,
        promise  = jot.fetch(), 
        view;

    promise.done(function() {
      view = new Jot.Views.JotsShow({
        model: jot,
        collection: jot.comments()
      });
      that._swapView(view);
    }).fail(function(errors) {
      Jot.Messages = errors.responseJSON;
      that._swapView();
    });
  },

  // Edit and update jots
  editJot: function(id) {
    var jot     = new Jot.Models.Jot({id: id}),
        that    = this,
        promise = jot.fetch(),
        view;

    promise.done(function () {
      view = new Jot.Views.JotsEdit({
        model: jot
      });
      that._swapView(view);
    }).fail(function(errors) {
      Jot.Messages = errors.responseJSON;
      that._swapView();
    });
  },

  // Create a new jot
  newJot: function () {
    var view = new Jot.Views.JotsNew();
    this._swapView(view);
  },

  // Swaps views and removes zombies to prevent memory leaks
  _swapView: function(view) {

    this._currentView && this._currentView.remove();
    Jot._currentView = this._currentView = view;

    // Inserts the navbar
    Jot.renderNavbar();

    // Render any messages on the page
    if (typeof Jot.Messages === 'object' && Object.keys(Jot.Messages).length) {
      Jot.renderMessages();
      Jot.Messages = {};
    }

    // Renders the view or empties the $viewport
    (!view ? $.fn.empty : $.fn.html).call(this.$viewport, view.$el);
  }
});
