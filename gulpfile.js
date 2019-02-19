const gulp = require('gulp');
const browserify = require('gulp-browserify');


function build() {
   return gulp.src('./main/*.js')
        .pipe(browserify())
        .pipe(gulp.dest('./build'))
}

gulp.task('watch', function() { 
    gulp.watch('./main/*.js', build);
    gulp.watch('./main/services/*.js', () => {
        build();
        return gulp.src('./main/services/*.js')
        .pipe(browserify())
        .pipe(gulp.dest('./build/services'))
    })
});