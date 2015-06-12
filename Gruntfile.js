module.exports = function (grunt) {
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        uglify: {
            dist: {
                files: {
                    // 出力ファイル: 元ファイル
                    'public/front/javascripts/PatientsApplication.min.js': 'public/front/javascripts/PatientsApplication.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);
};