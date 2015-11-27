"use strict";

import React from "react";
import autobind from "autobind-decorator";
import { History } from "react-router";
import Mixin from "react-mixin";
import h from "./helpers";

import $ from "jquery";
import Grid from "./grid";

import buzz from "../shared/buzz/buzz";
import Loader from "react-loader";

@autobind
class Hipster extends React.Component {

  constructor() {
    super();

    this.state = {
      loaded: false
    };

    var self = this;
    self.loaded = false;

    this._grid = null;
    this.song = new buzz.sound("/audio/crazyshit.ogg", {
      loop: true,
      volume: 100,
      webAudioApi: true
    });

    if (!buzz.isSupported()) {
      alert("Your browser is too old, time to update!");
    }

    this.song.bind("canplaythrough", function() {
      if (!self.loaded) {
        self.loaded = true;

        this.play()
        self.grid()

        self.setState({
          loaded: true
        });

        $(".loader").remove();
      }
    }).loop()
    .bind( "timeupdate", function() {
        var timer = buzz.toTimer( this.getTime() );
        $("span.song-time").html(timer);

        var t = this.getTime();

        if (t >= 13.25 && t < 55) {
          self._grid.build();
        } else if (t >= 55) {
           // wait
        }
    });
  }

  grid() {
    var self = this;

    if (self._grid) {
      self._grid.start();
      return
    }

    self._grid = new Grid({
      container: '.wrapper',
      columns: 8,
      rows: 8
    });

    self._grid.build();

    $(window).resize(function() {
      self._grid.build();
    });

    // self.rebuild = setInterval(function() {
      // self._grid.build();
    // }, 300);
  }

  componentDidMount() {
    this.grid()
  }

  componentWillUnmount() {
    $(window).off("resize");

    if (this.rebuild) {
      clearInterval(this.rebuild);
    }
  }

  render() {
    return (
      <Loader loaded={false} lines={13} length={20} width={10} radius={30}
        corners={1} rotate={0} direction={1} color="rgb(241, 212, 254)" speed={1}
        trail={60} shadow={false} hwaccel={true} className="spinner"
        zIndex={9999999999999999999999} top="50%" left="50%" scale={1.00} />
    );
  };

}


export default Hipster;
