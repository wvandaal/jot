Jot.Views.Help = Backbone.View.extend({
  id: 'HELP',
  className: 'container',
  template: JST['layouts/help'],

  initialize: function() {
    this.render();
  },

  render: function() {
    var content = this.template();
    this.$el.html(content);

    return this;
  }
});