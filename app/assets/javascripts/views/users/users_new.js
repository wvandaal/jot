Jot.Views.UsersNew = Backbone.View.extend({
  tagName: 'form',
  template: JST['users/new'],

  events: {
    "click .signup": "submit",
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
        $modal.animate({top: -2000}, 750, function() {
          $modal.remove();
        });
        Jot.currentUser = new Jot.Models.User(json);
        Jot.renderNavbar();
      },

      fail: function (errors) {
        console.log(errors);
      }
    });
  }
});