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

    this.renderNavbar();
  },

  // Renders the navbar for a given user
  renderNavbar: function() {
    var navbar = new Jot.Views.Header({
      model: this.currentUser
    });

    // Inserts the navbar
    $('#navbar').html(navbar.render().$el);

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

  },

  renderErrors: function(errors) {
    var view    = new Jot.Views.Errors({collection: errors}),
        $errors = $('#errors');

    $errors.html(view.render().$el);
    $errors.children().delay(5000).fadeOut(1000);
  }
};


// CompositeView class for rendering subviews within a larger view
Backbone.CompositeView = Backbone.View.extend({

  // Subview stored as key-value pairs where values are arrays of views and  
  // keys are css element selectors where the views are to be rendered. 
  // I.e.: {selector: [subviews, ...]}
  // E.g.: {".container": [Jot.Views.JotsNew]}
  //
  // Note: subviews() is written as memoizing function to prevent sharing of
  // subviews property between instances (this prevents multiple-render errors)
  subviews: function() {
    if (!!!this._subviews) {
      this._subviews = {};
    }

    return this._subviews;
  },

  // Add a subview to the subviews object and append it to the corresponding
  // container element denoted by the given selector
  addSubview: function(selector, subview) {
    var $selectorEl       = this.$(selector),
        selectorSubviews  = 
      this.subviews()[selector] || (this.subviews()[selector] = []);

    selectorSubviews.push(subview);

    $selectorEl.append(subview);
  }, 

  renderSubviews: function() {
    var compView = this,
        $selectorEl;

    // For each key-value pair, render the subviews in the given selector 
    // element ($selectorEl) denoted by the key
    _(compView.subviews()).each(function(subviews, selector) {
      $selectorEl = compView.$(selector);
      $selectorEl.empty();

      subviews.forEach(function(subview) {
        $selectorEl.append(subview.render.$el);
        subview.delegateEvents();
      });
    });
  }
});



/////////////////////////
// Launch Application! //
/////////////////////////
$(document).ready(function(){
  // Set highlighting options for marked
  marked.setOptions({
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });

  // Create new diff object
  window.Differ = new diff_match_patch();

  Jot.initialize();
});
