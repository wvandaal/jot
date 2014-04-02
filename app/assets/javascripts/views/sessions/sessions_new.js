Jot.Views.SessionsNew = Backbone.View.extend({
  className: 'modal',
  template: JST['sessions/new'],

  events: {
    "submit form": "submit",
    "click": "close",
    "click .signup": "renderSignup"
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    var content = this.template();
    this.$el.html(content);

    return this;
  },

  submit: function(e) {
    e.preventDefault();

    var params  = $(e.target).serializeJSON(),
        session = new Jot.Models.Session(params),
        $modal  = $('.modal');

    session.save({}, {
      success: function(json) {
        var promise;

        Jot.currentUser = new Jot.Models.User(json);
        promise = Jot.currentUser.fetch();

        promise.done(function() {
          // Rerender navbar
          Jot.renderNavbar();

          // Animate out modal, remove it, redirect if necessary
          $modal.animate({top: -2000}, 750, function() {
            $modal.remove();
            if (Backbone.history.fragment !== 'jots/new') {
              Backbone.history.fragment = null;
              Backbone.history.navigate('', {trigger: true});
            }
          });
        });
      },
      error: function (model, errors) {
        Jot.renderMessages(errors.responseJSON);
      }
    });
  },

  // Closes the modal if the click target is the modal itself
  close: function(e) {
    if (e.target.className === this.className) {
      var $modal = $(e.target);

      $modal.animate({top: -2000}, 750, function() {
        $modal.remove();
      });
    }
  },

  renderSignup: function() {
    var signup = new Jot.Views.UsersNew();
    this.$el.html(signup.render().$el);
  }
});