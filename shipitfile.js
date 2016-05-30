module.exports = function (shipit) {
    require('shipit-deploy')(shipit);


    shipit.initConfig({
        default: {
            workspace: 'shipit_build',
            deployTo: '/home/deploy/www/inna-frontend',
            repositoryUrl: 'ssh://git@gitlab.inna.ru:223/frontend-dev/inna-angular.git',
            branch: 'master',
            ignores: ['.git', 'node_modules'],
            keepReleases: 20,
            deleteOnRollback: true,
            //key: '~/.ssh/id_rsa.pub',
            shallowClone: false,
            stopService: 'sudo service inna-frontend stop; ',
            startService: 'sudo service inna-frontend start'
        },
        staging: {
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
            shallowClone: false,
            stopService: 'sudo service inna-frontend-test stop; ',
            startService: 'sudo service inna-frontend-test start',
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
            //'after.deploy::run.build',
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
        return shipit.local('cd ' + shipit.config.workspace + '&& NODE_ENV=production gulp build');
    });


    //копируем package.json в корневую папку,
    //чтобы каждый раз не устанавливать все пакеты заново
    //для ускорения билда короче
    shipit.blTask('after.deploy::copy.package.json', function () {
        return shipit.remote('cd ' + shipit.currentPath + ' && cp package.json ' + shipit.config.deployTo);
    });

    //запускаем npm install в корневой папке
    shipit.blTask('after.deploy::run.npm.install', function () {
        return shipit.remote('cd ' + shipit.config.deployTo + ' && npm install');
    });

    //запускаем build --release в текущем билде
    shipit.blTask('after.deploy::run.build', function () {
        return shipit.remote('cd ' + shipit.currentPath + ' && NODE_ENV=production gulp build');
    });

    //перезапускаем приложение
    //forever list | grep -q build.server.js - возвращает 0 - если не нашлось строки 'build.server.js', 1 - если нашлось
    //и соответственно запускается команда
    //shipit.blTask('after.deploy::restart.forever', function () {
    //    var cmd = '';
    //    cmd += ' forever list | grep -q build.server.js && forever stop '+ shipit.currentPath + '/build/server.js;';
    //    cmd += ' forever start '+ shipit.currentPath + '/build/server.js;';
    //    return shipit.remote(cmd);
    //});

    shipit.blTask('after.deploy::restart.service', function () {
        var cmd = '';
        cmd += shipit.config.stopService;
        cmd += shipit.config.startService;
        return shipit.remote(cmd);
    });
};


//ssh -p 2223 root@5.200.60.73 "cd /home/deploy/www/inna-react/current; forever list | grep -q build.server.js && forever restart build/server.js; !(forever list | grep -q build.server.js) && forever start build/server.js;"