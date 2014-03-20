Jot.Views.Home = Backbone.View.extend({
  className: 'container banner',
  template: JST['layouts/home'],

  render: function() {
    var content = this.template();
    this.$el.html(content);

    return this;
  }
});