require! {
    gulp
    'main-bower-files': bowerfiles
    'gulp-flatten': flatten
    'gulp-livescript': livescript
    'gulp-browserify': browserify
}

root_path = '.'

handleError = (err) ->
    console.error err.toString!
    @emit "end"

#gulp.task 'build', ['build-livescript', 'browserify'] ->
gulp.task 'build', ['build-livescript'] ->

gulp.task 'build-livescript' ->
    return gulp.src "#root_path/**/*.ls"
           .pipe livescript bare: true
           .on 'error', handleError
           .pipe gulp.dest "#root_path"

gulp.task 'browserify', ['build-livescript'] ->
    return gulp.src '.tmpjs/parser.js', {base: '.tmpjs'}
    .pipe browserify {insertGlobals: true, paths: ['./node_modules', './.tmpjs']}
    .on 'error', handleError
    .pipe gulp.dest "#root_path"
