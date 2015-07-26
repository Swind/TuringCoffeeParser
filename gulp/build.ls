require! {
    gulp
    'main-bower-files': bowerfiles
    'gulp-flatten': flatten
    'gulp-livescript': livescript
    'gulp-browserify': browserify
}

src_path = './src'
test_path = './test'

handleError = (err) ->
    console.error err.toString!
    @emit "end"

compile_livescript = (path) ->
    gulp.src "#path/**/*.ls"
        .pipe livescript bare: true
        .on 'error', handleError
        .pipe gulp.dest "#path"


#gulp.task 'build', ['build-livescript', 'browserify'] ->
gulp.task 'build', ['build-livescript'] ->

gulp.task 'build-livescript' ->
    compile_livescript src_path
    compile_livescript test_path

gulp.task 'browserify', ['build-livescript'] ->
    return gulp.src '.tmpjs/parser.js', {base: '.tmpjs'}
    .pipe browserify {insertGlobals: true, paths: ['./node_modules', './.tmpjs']}
    .on 'error', handleError
    .pipe gulp.dest "#root_path"
