Jot.Views.UsersNew = Backbone.View.extend({
  tagName: 'form',
  template: JST['users/new'],

  events: {
    "click .signup": "submit"
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

    var params = this.$el.serializeJSON(),
        user   = new Jot.Models.User(params),
        $modal = $('.modal');

    user.save({}, {
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

      fail: function (model, errors) {
        Jot.renderMessages(errors.responseJSON);
      }
    });
  }
});