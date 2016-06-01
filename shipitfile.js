module.exports = function (shipit) {
    require('shipit-deploy')(shipit);


    shipit.initConfig({
        staging: {
            workspace: 'shipit_build',
            deployTo: '/home/deploy/www/inna-frontend-prod',
            repositoryUrl: 'ssh://git@gitlab.inna.ru:223/frontend-dev/inna-angular.git',
            branch: 'deploy',
            ignores: ['.git', 'node_modules'],
            keepReleases: 20,
            deleteOnRollback: true,
            shallowClone: false,
            restartService: 'sudo restart inna-frontend-prod',
            build: ' && NODE_ENV=production gulp build',
            servers: 'root@5.200.60.73:2223'
        },
        test: {
            workspace: 'shipit_build_test',
            deployTo: '/home/deploy/www/inna-frontend-test',
            repositoryUrl: 'ssh://git@gitlab.inna.ru:223/frontend-dev/inna-angular.git',
            branch: 'deploy',
            ignores: ['.git', 'node_modules'],
            keepReleases: 5,
            deleteOnRollback: true,
            shallowClone: true,
            restartService: 'sudo restart inna-frontend-test',
            build: ' && NODE_ENV=test gulp build',
            servers: 'deploy@5.200.60.73:2210',
        },
        beta: {
            workspace: 'shipit_build_test',
            deployTo: '/home/deploy/www/inna-frontend-beta',
            repositoryUrl: 'ssh://git@gitlab.inna.ru:223/frontend-dev/inna-angular.git',
            branch: 'deploy',
            ignores: ['.git', 'node_modules'],
            keepReleases: 5,
            deleteOnRollback: true,
            shallowClone: true,
            restartService: 'sudo restart inna-frontend-beta',
            build: ' && NODE_ENV=beta gulp build',
            servers: 'deploy@5.200.60.73:2210',
        }
    });

    shipit.task('pwd', function () {
        return shipit.remote('pwd');
    });

    shipit.task('ls', function () {
        return shipit.remote('ls -la');
    });

    shipit.on('fetched', function () {
        return shipit.start(
            'pre.deploy::build'
        );
    });

    shipit.on('cleaned', function () {
        return shipit.start(
            'after.deploy::copy.package.json',
            'after.deploy::run.npm.install',
            'after.deploy::restart.service',
            'print.rollback'
        );
    });

    shipit.task('print.rollback', function () {
        console.log('=================================================');
        console.log('Отменить деплой:');
        console.log('shipit staging rollback');
        console.log('=================================================');
    });

    //собирает проект локально, перед копированием на сервер
    shipit.blTask('pre.deploy::build', function () {
        return shipit.local('cd ' + shipit.config.workspace + shipit.config.build);
    });


    //копируем package.json в корневую папку,
    //чтобы каждый раз не устанавливать все пакеты заново
    shipit.blTask('after.deploy::copy.package.json', function () {
        return shipit.remote('cd ' + shipit.currentPath + ' && cp package.json ' + shipit.config.deployTo);
    });

    //запускаем npm install в корневой папке
    shipit.blTask('after.deploy::run.npm.install', function () {
        return shipit.remote('cd ' + shipit.config.deployTo + ' && npm install');
    });

    shipit.blTask('after.deploy::restart.service', function () {
        return shipit.remote(shipit.config.restartService);
    });
};