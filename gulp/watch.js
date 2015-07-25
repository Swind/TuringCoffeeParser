var gulp, livereload, root_path;
gulp = require('gulp');
livereload = require('gulp-livereload');
root_path = "./src";
gulp.task('watch', function(){
  return gulp.watch(root_path + "/**/*.ls", ['build-livescript']);
});