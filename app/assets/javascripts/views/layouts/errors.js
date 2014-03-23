Jot.Views.Errors = Backbone.View.extend({
  tagName: 'ul',
  template: JST['layouts/errors'],

  render: function() {
    var content = this.template({
      errors: this.collection
    });

    this.$el.html(content);

    return this;
  }
});