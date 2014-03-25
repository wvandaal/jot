Jot.Views.Info = Backbone.View.extend({
  id: 'ABOUT',
  className: 'container',
  template: JST['layouts/info'],

  initialize: function() {
    this.render();
  },

  render: function() {
    var content = this.template();
    this.$el.html(content);

    return this;
  }
});