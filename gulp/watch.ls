require! {
    gulp
    'gulp-livereload': livereload
}

src_path = "./src"
test_path = "./test"

gulp.task 'watch' ->
    gulp.watch ["#src_path/**/*.ls", "#test_path/**/*.ls"], ['build-livescript']
