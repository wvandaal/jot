window.Jot = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  currentUser: null,
  initialize: function() {
    // Retrieves bootstrapped currentUser JSON
    this.currentUser = new Jot.Models.User(
      JSON.parse($('#currentUser').html()).currentUser
    );

    new Jot.Routers.AppRouter();
    Backbone.history.start();

    this.renderNavbar(currentUser);
  },

  // Renders the navbar for a given user
  renderNavbar: function() {
    var navbar = new Jot.Views.Header({
      model: this.currentUser
    });

    // Inserts the navbar
    $('#navbar').html(navbar.render().$el)

    // Add click handler for login modal
    // Note: this was moved from Jot.Routers to allow for global signin
    // on-site without redirection
    if ($('#login').length) {
      $('#login').on('click', function(e) {
        e.preventDefault(); 
        var view = new Jot.Views.SessionsNew();
        $('body').prepend(view.render().$el);
      });
    }

  }
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
