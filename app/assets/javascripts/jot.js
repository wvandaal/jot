window.Jot = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  Messages: {},
  currentUser: null,

  // Note: All #ids must be capitalized to prevent style cross-contamination from
  // ids generated by markdown redering
  initialize: function() {
    // Retrieves bootstrapped currentUser JSON
    this.currentUser = new Jot.Models.User(
      JSON.parse($('#CURRENT-USER').html()).currentUser
    );

    new Jot.Routers.AppRouter();
  },

  // Renders the navbar for a given user
  // TODO: Remove this method
  renderNavbar: function() {
    var header = new Jot.Views.Header({
      model: this.currentUser
    });

    // Inserts the navbar
    $('#NAVBAR').html(navbar.render().$el);

    // Add click handler for login modal
    // Note: this was moved from Jot.Routers to allow for global signin
    // on-site without redirection
    if ($('#LOGIN').length) {
      $('#LOGIN').on('click', function(e) {
        e.preventDefault(); 
        var view = new Jot.Views.SessionsNew();
        $('body').prepend(view.render().$el);
      });
    }

  },

  renderMessages: function(msgs) {
    var view      = new Jot.Views.Messages({messages: msgs || Jot.Messages}),
        $messages = $('#MESSAGES');

    $messages.html(view.$el);
    $messages.children().delay(5000).fadeOut(1000);
  },

  renderNavbar: function(user) {
    var header = new Jot.Views.Header({
      model: user || Jot.currentUser 
    });

    $('#NAVBAR').html(header.$el);
  }
};


// CompositeView class for rendering subviews within a larger view
Backbone.CompositeView = Backbone.View.extend({

  // Subview stored as key-value pairs where values are arrays of views and  
  // keys are css element selectors where the views are to be rendered. 
  // I.e.: {selector: [subviews, ...]}
  // E.g.: {".container": [Jot.Views.JotsNew]}
  //
  // Note: subviews() is written as memoizing function to prevent sharing of
  // subviews property between instances (this prevents multiple-render errors)
  subviews: function() {
    if (!!!this._subviews) {
      this._subviews = {};
    }

    return this._subviews;
  },

  // Add a subview to the subviews object and append it to the corresponding
  // container element denoted by the given selector
  addSubview: function(selector, subview) {
    var $selectorEl       = this.$(selector),
        selectorSubviews  = 
      this.subviews()[selector] || (this.subviews()[selector] = []);

    selectorSubviews.push(subview);

    $selectorEl.append(subview);
  }, 

  renderSubviews: function() {
    var compView = this,
        $selectorEl;

    // For each key-value pair, render the subviews in the given selector 
    // element ($selectorEl) denoted by the key
    _(compView.subviews()).each(function(subviews, selector) {
      $selectorEl = compView.$(selector);
      $selectorEl.empty();

      subviews.forEach(function(subview) {
        $selectorEl.append(subview.render.$el);
        subview.delegateEvents();
      });
    });
  }
});



/////////////////////////
// Launch Application! //
/////////////////////////

//TODO: Remove diff_match_patch 
$(document).ready(function(){
  var renderer = new marked.Renderer();

  // Rewrites code method of marked renderer to allow for waypoint addition.
  // By default, any necessary waypoint will be added to the end of code block.
  renderer.code = function(code, lang, escaped, token) {
    var waypoint    = '<span id="_WAYPOINT"></span>',
        waypointInd = code.indexOf(waypoint);

    // Adds test for empty code blocks to prevent escaping of whitespace characters
    // by highlighter
    if (this.options.highlight && code.match(/\w+/)) {
      var out = this.options.highlight(code.replace(waypoint, ""), lang);
      if (out != null && out !== code) {
        token.escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return '<pre><code>'
        + (token.escaped ? code : escape(code, true))
        + (waypointInd !== -1 ? waypoint : "")
        + '\n</code></pre>';
    }

    return '<pre><code class="'
      + this.options.langPrefix
      + escape(lang, true)
      + '">'
      + (token.escaped ? code : escape(code, true))
      + (waypointInd !== -1 ? waypoint : "")
      + '\n</code></pre>\n';
  };

  // Set highlighting options for marked
  marked.setOptions({
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }, 
    renderer: renderer
  });

  // Create new diff object for use in Jot.View.JotsNew._insertWaypoint
  // window.Differ = new diff_match_patch();

  Jot.initialize();
});
