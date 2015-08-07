require! {
    gulp
    'main-bower-files': bowerfiles
    'gulp-less': less
    'gulp-sass': sass
    'gulp-flatten': flatten
    'gulp-livescript': livescript
    'gulp-browserify': browserify
    'gulp-mocha': mocha
}

src_path = './src'
test_path = './test'
dist_path = './src/static/js'
client_src_path = './src/static/ls'

handleError = (err) ->
    console.error err.toString!
    @emit "end"

compile_livescript = (path) ->
    gulp.src "#path/**/*.ls"
        .pipe livescript bare: true
        .on 'error', handleError
        .pipe gulp.dest "#path"

gulp.task 'build', ['build-livescript', 'browserify', 'build-sass', 'copy-js', 'copy-css'] ->

gulp.task 'build-livescript' ->
    compile_livescript src_path
    compile_livescript test_path

gulp.task 'build-sass' ->
    return gulp.src "#src_path/static/scss/*.scss"
           .pipe sass!
           .pipe gulp.dest "#src_path/static/css"

gulp.task 'browserify', ['build-livescript'] ->
    return gulp.src "#client_src_path/coffee.js", {base: client_src_path}
    .pipe browserify {insertGlobals: true, paths: [client_src_path]}
    .on 'error', handleError
    .pipe gulp.dest "#dist_path"

gulp.task 'mocha' ->
    return gulp.src "#test_path/**/*.js", {read: false}
        .pipe mocha {reporter: 'spec'}

gulp.task 'copy-js' ->
    return gulp.src bowerfiles ['**/*.js'], {base: './vendor'}
           .pipe gulp.dest "#src_path/static/js"

gulp.task 'copy-css' ->

    config = {
        overrides: {
                        bootstrap: {
                            main: [
                                './dist/js/bootstrap.js'
                                './dist/css/*.min.*'
                                './dist/fonts/*.*'
                            ]
                        }
        }
    }
    return gulp.src bowerfiles ['**/*.css'], config
           .pipe gulp.dest "#src_path/static/css"
