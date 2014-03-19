Jot.Views.UsersShow = Backbone.View.extend({
  tagName: 'div',
  className: 'container',
  template: JST['users/show'],

  initialize: function(options) {
    this.user = options.user,
    this.jots = options.user.entries
  },

  render: function() {
    var content = this.template();
    this.$el.html(content);

    return this;
  }

});
