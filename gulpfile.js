//
// gulpfile for csos-ui
// use either: gulp [dev|prod]
//

var autoprefixer = require("gulp-autoprefixer");
var babelify = require("babelify");
var browserify = require("browserify");
var buffer = require("vinyl-buffer");
var concatcss = require("gulp-concat-css");
var cssmin = require("gulp-cssmin");
var eslint = require("gulp-eslint");
var gulp = require("gulp");
var gutil = require("gulp-util");
var imagemin = require("gulp-imagemin");
var notify = require("gulp-notify");
var pngquant = require("imagemin-pngquant");
var rename = require("gulp-rename");
var source = require("vinyl-source-stream");
var uglify = require("gulp-uglify");
var watchify = require("watchify");
var lintFormatter = require("./shared/lint-formatter");

//
// development lint
//

var lintIgnoreList = [
  "**/*.js",
  "**/*.jsx",
  "!shared/logger/logger.js",
  "!gulpfile.js",
  "!build/**",
];

gulp.task("lint-dev", function() {
  return gulp.src(lintIgnoreList).pipe(eslint({
    useEslintrc: true,
    baseConfig:{
      parser: "babel-eslint"
    }
  }))
  .pipe(eslint.result(function(result) {
    return lintFormatter(result);
  })) 
});

//
// production eslint
//

gulp.task("lint-prod", function() {
  return gulp.src(lintIgnoreList).pipe(eslint({
    useEslintrc: true,
    baseConfig:{
      parser: "babel-eslint"
    }
  }))
  .pipe(eslint.failAfterError())
  .pipe(eslint.result(function(result) {
    return lintFormatter(result);
  })) 
});

//
// css 
//

gulp.task("css", function() {
  gulp.src("./css/**/*.css")
  .pipe(concatcss("hipster.css"))
  .pipe(cssmin())
  .pipe(gulp.dest("./build"));
});

//
// Copy Stuff
//

gulp.task("copy-assets", function() {
  gulp.src("./audio/**/*")
  .pipe(gulp.dest("./build/audio"));

  gulp.src("./index.html")
  .pipe(gulp.dest("./build/"));
});

//
// images
//

gulp.task("images", function() {
  gulp.src("./images/**/*")
  .pipe(imagemin({
    progressive: true,
    use: [
      pngquant()
    ],
    multipass: true,
  }))
  .pipe(gulp.dest("./build/images"));
});

//
// compile errors
//

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit("end");
}

//
// source
//

function buildScript(file, watch) {
  var props = {
    entries: ["./" + file],
    debug : true,
    extensions: [".jsx"],
    transform: [babelify.configure({stage: 0 })]
  };

  // watchify() if watch requested, otherwise run browserify() once 
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
    .on("error", handleErrors)
      .pipe(source("hipster.js"))
      .pipe(gulp.dest("./build/"))
      .pipe(buffer())
      // .pipe(uglify({
        // mangle: false
      // }))
      .pipe(rename("hipster.js"))
      .pipe(gulp.dest("./build"))
  }

  // listen for an update and run rebundle
  bundler.on("update", function() {
    rebundle();
    gutil.log("Rebundle...");
  });

  // run it once the first time buildScript is called
  return rebundle();
}

// development
gulp.task("src-dev", [
  "copy-assets",
  "lint-dev"
], function() {
  return buildScript("hipster.jsx", false); 
});

gulp.task("src-dev-fast", function() {
  return buildScript("hipster.jsx", false); 
});

gulp.task("dev-fast", [
  "css",
  "src-dev-fast"
], function() {
  gulp.watch([
    "index.html",
    "css/**/*",
    "**/*.jsx",
    "!build/**",
    "!node_modules/**" 
  ],[
    "css",
    "src-dev-fast"
  ]);
});
 
gulp.task("dev", [
  "css",
  "copy-assets",
  "src-dev"
], function() {
  gulp.watch([
    "index.html",
    "css/**/*",
    "**/*.js",
    "**/*.jsx",
    "!build/**",
    "!node_modules/**" 
  ],[
    "css",
    "src-dev"
  ]);
});

// production
gulp.task("src-prod", ["lint-prod"], function() {
  return buildScript("hipster.jsx", false); 
});

gulp.task("prod", [
  "css",
  "images",
  "copy-assets",
  "src-prod"
]);
