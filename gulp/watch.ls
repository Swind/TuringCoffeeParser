require! {
    gulp
    'gulp-livereload': livereload
}

root_path = "./src"

gulp.task 'watch' ->
    gulp.watch "#root_path/*.ls", ['build-livescript']
