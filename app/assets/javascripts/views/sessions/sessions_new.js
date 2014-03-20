Jot.Views.SessionsNew = Backbone.View.extend({
  tagName: 'div',
  className: 'modal',
  template: JST['sessions/new'],

  events: {
    "submit form": "submit",
    "click": "close"
  },

  render: function() {
    var content = this.template();
    this.$el.html(content);

    return this;
  },

  submit: function(e) {
    e.preventDefault();

    var params = $(e.target).serializeJSON(),
        user   = new Jot.Models.User(params);

    user.authenticate({
      success: function(response) {
        console.log(response);
      },

      fail: function (xhr) {
        console.log(xhr.responseText);
      }
    });

  },

  // Closes the modal if the click target is the modal itself
  close: function(e) {
    if (e.target.className === this.className) {
      var $modal = $(e.target);

      $modal.animate({top: -2000}, 750, function() {
        $modal.remove();
      })
    }
  }
  
});