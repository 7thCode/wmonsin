module.exports = function (grunt) {
    grunt.initConfig(
        {'ftp-deploy': {
            build: {
                auth: {
                    host: 'seventh-code.com',
                    port: 21
                },
                src: '',
                dest: 'wmonsin',
                exclusions: [
                    '.settings',
                    'node_modules',
                    'parts',
                    'public/bower_components',
                    '**/*.ts',
                    '**/*.js.map'
                ]
            }
        }
    }
    );
    grunt.loadNpmTasks('grunt-ftp-deploy');
};