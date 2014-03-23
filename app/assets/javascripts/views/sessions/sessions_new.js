Jot.Views.SessionsNew = Backbone.View.extend({
  tagName: 'div',
  className: 'modal',
  template: JST['sessions/new'],

  events: {
    "submit form": "submit",
    "click": "close",
    "click .signup": "renderSignup"
  },

  render: function() {
    var content = this.template();
    this.$el.html(content);

    return this;
  },

  submit: function(e) {
    e.preventDefault();

    var params = $(e.target).serializeJSON(),
        user   = new Jot.Models.User(params),
        $modal = $('.modal');

    user.authenticate({
      success: function(json) {
        $modal.animate({top: -2000}, 750, function() {
          $modal.remove();
        });
        Jot.currentUser = new Jot.Models.User(json);
        Jot.renderNavbar();
      },

      fail: function (errors) {
        
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