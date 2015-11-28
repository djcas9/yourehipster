"use strict";

import $ from "jquery";

class Grid {

  constructor(options) {
    var self = this;

    self.dance = false;

    self.firstInterval = 20500;

    self.options = {
      container: options.container || 'body',
      columns: options.columns || 10,
      rows: options.rows || 10
    };

    self.$grid = $(self.options.container);
    self.css = {
      position: 'absolute',
      display: 'block',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    };

    $('body, #youre-hipster').css(self.css);
    self.$grid.css(self.css);

    self.$footer = $('<div id="footer" />');
    self.$footer.html('<a href="http://twitter.com/mephux">Hipster Powered By Mephux</a> | Keep it Hipster Kids! | <span class="song-time">00:00</span>');
    self.$footer.appendTo('body');

    return self;
  }


  anStop(callback) {
    var self = this;
    clearInterval(self.changeImage);

    self.$imageHolder.removeClass('dance');
    self.dance = false;

    self.$imageHolder.attr('style', '');

    self.$imageHolder.addClass('basic-way').css(self.css)
    .css(self.css3Tran);

    self.imageRotate = 1;
    self.imageScale = 100;


    // var rotate = 0;
    // var scale = 0;

    // self.$imageHolder.css({
      // '-moz-transform': 'rotate('+rotate+'deg) scale('+scale+')',
      // '-ms-transform': 'rotate('+rotate+'deg) scale('+scale+')',
      // '-o-transform': 'rotate('+rotate+'deg) scale('+scale+')',
      // '-webkit-transform': 'rotate('+rotate+'deg) scale('+scale+')'
    // });

    return callback();
  }

  anDance() {
    var self = this;

    self.changeImage = setInterval(function() {
      self.image();
    }, 20);

    self.dance = true;

    clearInterval(self.toggleFace);

    if ($("#hipster").length <= 0) {
      $('<div id="hipster" />').appendTo('body');
    }

    self.$imageHolder.removeClass('wiggle');
    self.$imageHolder.removeClass('other-way');
    self.$imageHolder.removeClass('basic-way');
    self.$imageHolder.addClass('dance');
    self.dance = true;

    self.imageRotate = 20000;
    self.imageScale = 20000;
  }


  anStart() {
    var self = this;

    self.imageRotate = 1;
    self.imageScale = 100;

    self.toggleFace = setInterval(function() {
      if (self.$imageHolder.hasClass('other-way')) {
        self.$imageHolder.removeClass('other-way');
        self.$imageHolder.addClass('basic-way');
      } else {
        self.$imageHolder.addClass('other-way');
        self.$imageHolder.removeClass('basic-way');
      }; 

      self.build()
    }, 5000);

  }

  run() {
    var self = this;

    self.css3Tran = {
      "-webkit-transition": "-webkit-transform 3s ease-in-out",
      "-moz-transition": "-moz-transform 3s ease-in-out",
      "-ms-transform": "-ms-transform 3s ease-in-out",
      "-o-transition": "-o-transform 3s ease-in-out"      
    };

    $("#image-holder").remove();
    self.$imageHolder = $('<div id="image-holder">');

    self.$imageHolder.addClass('basic-way wiggle').css(self.css)
    .css(self.css3Tran).appendTo('body');

    self.anStop(function() {
      self.anStart()
      self.build();
    });

  }


  init() {
      var self = this;
      self.$grid.empty();

      self.width = self.$grid.width();
      self.height = self.$grid.height();
      self.count = (self.options.columns * self.options.rows)

      self.box = {
        html: $('<div class="box" />'),
        width: (self.width / self.options.columns),
        height: (self.height / self.options.rows)
      };
    }

    image() {
      var self = this;

      var rotate = Math.floor(self.imageRotate * Math.random());
      var scale = Math.floor(self.imageScale * Math.random());

      if (rotate % 2 == 1) {
        rotate = '-' + (rotate - 200);
      };

      if (scale % 2 == 0) {
        scale = parseFloat('-' + scale - 200);
      };

      // if (self.dance) {
        // scale = "1."+scale;
      // } else {
        // scale = "0."+scale;
      // }

      scale = "0."+scale;

      self.$imageHolder.css({
        '-moz-transform': 'rotate('+rotate+'deg) scale('+scale+')',
        '-ms-transform': 'rotate('+rotate+'deg) scale('+scale+')',
        '-o-transform': 'rotate('+rotate+'deg) scale('+scale+')',
        '-webkit-transform': 'rotate('+rotate+'deg) scale('+scale+')'
      });
    }

    build() {
      var self = this;
      self.init();

      for (var i = 0; i < self.count; i++) {
        var $box = self.box.html.clone();

        var s = i.toString().length;
        if (s < 2) {
          var i = '00' + i;
        } else if (s < 3) {
          var i = '0' + i;
        };

        $box.attr('id', 'box_' + i).css({
          display: 'block',
          position: 'reletive',
          width: self.box.width + 'px',
          height: self.box.height + 'px',
          backgroundColor: 'rgb(' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ')',
          float: 'left'
        }).appendTo(self.$grid);

        self.move = true;
      };

    }

}

export default Grid;
