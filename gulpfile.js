var gulp = require('gulp');
var yargs = require('yargs');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');

var fs = require('fs');
var path = require('path');

var ROOT_DIR = process.cwd();

require('coffee-script/register');

function buildArgs(args) {
  var argName, skipArgs = { _: true, '$0': true };

  for (argName in yargs.argv) {
    if (yargs.argv.hasOwnProperty(argName) && !skipArgs[argName]) {
      args[argName] = yargs.argv[argName];
    }
  }
  return args;
}

function makeTestTargetForDirectory(workDir) {
  if (!fs.existsSync(workDir)) {
    return function() { };
  }
  return function() {
    process.chdir(path.join(ROOT_DIR, workDir));
    return gulp.src('./test/*.js', {read: false})
      // Reporters:
      // https://github.com/mochajs/mocha/blob/master/lib/reporters/index.js
      .pipe(mocha(buildArgs({reporter: 'spec'})));
  };
}

gulp.task('test', makeTestTargetForDirectory('exercise'));
gulp.task('test-init', ['test'], makeTestTargetForDirectory('.exercise-init'));

/* eslint-disable max-len */
// Lifted from:
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
/* eslint-enable max-len */
function getSubdirs(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir)
    .filter(function(filename) {
      return fs.statSync(path.join(dir, filename)).isDirectory();
    })
    .sort();
}

function createTestSolutionsTasks() {
  var solutionDirs = getSubdirs(path.join(ROOT_DIR, 'solutions')),
      produceTask;

  produceTask = function(previousTarget, subdir) {
    var taskLabel = 'test-solutions-' + subdir,
        workDir = path.join('solutions', subdir);

    gulp.task(taskLabel, previousTarget, makeTestTargetForDirectory(workDir));
    return [taskLabel];
  };

  return solutionDirs.reduce(produceTask, ['test-init']);
}

gulp.task('test-all', createTestSolutionsTasks());

gulp.task('lint', function() {
  return gulp.src(['./exercise/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint-all', function() {
  var filePatterns = [
    '**/*.js',
    '.exercise-init/**/*.js',
    '!node_modules/**',
    '!_site/**'
  ];

  return gulp.src(filePatterns)
    .pipe(eslint())
    .pipe(eslint.format());
});
