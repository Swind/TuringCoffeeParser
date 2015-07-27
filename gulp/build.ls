require! {
    gulp
    'main-bower-files': bowerfiles
    'gulp-flatten': flatten
    'gulp-livescript': livescript
    'gulp-browserify': browserify
    'gulp-mocha': mocha
}

src_path = './src'
test_path = './test'
dist_path = './dist'

handleError = (err) ->
    console.error err.toString!
    @emit "end"

compile_livescript = (path) ->
    gulp.src "#path/**/*.ls"
        .pipe livescript bare: true
        .on 'error', handleError
        .pipe gulp.dest "#path"

gulp.task 'build', ['build-livescript', 'browserify'] ->

gulp.task 'build-livescript' ->
    compile_livescript src_path
    compile_livescript test_path

gulp.task 'browserify', ['build-livescript'] ->
    return gulp.src "#src_path/parser.js", {base: src_path}
    .pipe browserify {insertGlobals: true, paths: [src_path]}
    .on 'error', handleError
    .pipe gulp.dest "#dist_path"

gulp.task 'mocha', ['build-livescript'] ->
    return gulp.src "#test_path/**/*.js", {read: false}
        .pipe mocha {reporter: 'spec'}
