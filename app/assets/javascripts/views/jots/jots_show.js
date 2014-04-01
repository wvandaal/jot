Jot.Views.JotsShow = Backbone.CompositeView.extend({
  className: 'container',
  template: JST['jots/show'],

  events: {
    'click .reply': 'newComment'
  },

  initialize: function() {
    var promise = this.collection.fetch(),
        that    = this,
        comments;

        window.cc = this.collection;

    promise.done(function() {
      comments = new Jot.Views.CommentsShow({
        model: that.model,
        collection: that.collection
      });
      that.addSubview('#JOT-COMMENTS', comments);
      that.render();
    }).fail(function(errors) {
      Jot.Messages = errors.responseJSON;
      that.render();
    })
  },

  render: function() {
    var content = this.template({
      jot: this.model
    });

    this.$el.html(content);
    this.renderSubviews();

    return this;
  }

});