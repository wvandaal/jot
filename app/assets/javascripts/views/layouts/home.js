Jot.Views.Home = Backbone.View.extend({
  className: 'container',
  template: JST['layouts/home'],

  initialize: function() {
    this.render();
  },

  render: function() {
    var content = this.template();
    this.$el.html(content);

    return this;
  }
});