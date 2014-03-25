Jot.Views.Header = Backbone.View.extend({
  tagName: 'nav',
  template: JST['layouts/_header'],

  events: {
    "click #LOGIN": "renderLogin",
    "click #LOGOUT": "logout"
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    var content = this.template({
      user: this.model
    });
    this.$el.html(content);

    return this;
  },

  logout: function(e) {
    e.preventDefault();
    var session = new Jot.Models.Session(),
        promise = session.fetch();

    promise.done(function() {
      session.destroy({
        // Nullifies the currentUser and navigates to the root
        success: function(data) {
          Jot.currentUser = new Jot.Models.User();

          // TODO: REMOVE 
          // Jot.renderNavbar(null);

          // Note: fragment must be set to null in order to rerender the home page
          if (Backbone.history.fragment === '') {
            Backbone.history.fragment = null;
          }
          Backbone.history.navigate('', {trigger: true});
        },
        error: function(model, errors) {
          Jot.renderMessages(errors.responseJSON);
        }
      });
    });
  },

  renderLogin: function(e) {
    e.preventDefault();
    var view = new Jot.Views.SessionsNew();
    $('body').prepend(view.render().$el);
  }
});