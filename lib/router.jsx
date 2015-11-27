"use strict";

import React from "react";
import { Router, Route, Redirect, IndexRedirect } from "react-router";
import { createHistory } from "history";

import Hipster from "./hipster";
import NotFound from "./not-found";

var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={Hipster} />
    <Route path="*" component={NotFound} />
  </Router>
);

export default routes;
