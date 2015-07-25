var gulp, bowerfiles, flatten, livescript, browserify, root_path, handleError;
gulp = require('gulp');
bowerfiles = require('main-bower-files');
flatten = require('gulp-flatten');
livescript = require('gulp-livescript');
browserify = require('gulp-browserify');
root_path = '.';
handleError = function(err){
  console.error(err.toString());
  return this.emit("end");
};
gulp.task('build', ['build-livescript'], function(){});
gulp.task('build-livescript', function(){
  return gulp.src(root_path + "/**/*.ls").pipe(livescript({
    bare: true
  })).on('error', handleError).pipe(gulp.dest(root_path + ""));
});
gulp.task('browserify', ['build-livescript'], function(){
  return gulp.src('.tmpjs/parser.js', {
    base: '.tmpjs'
  }).pipe(browserify({
    insertGlobals: true,
    paths: ['./node_modules', './.tmpjs']
  })).on('error', handleError).pipe(gulp.dest(root_path + ""));
});