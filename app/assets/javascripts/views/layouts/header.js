Jot.Views.Header = Backbone.View.extend({
  tagName: 'nav',
  template: JST['layouts/_header'],

  render: function() {
    var content = this.template({
      user: this.model
    });
    this.$el.html(content);

    return this;
  }
});