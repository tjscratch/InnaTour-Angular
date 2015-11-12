## Ansible хрень для настройки сервера, в нашем случае создает пользователя, устанавливает необходимые зависимости
и настраивает nginx

### Создание и копирование публичного ключа на сервер:

ssh-keygen -t rsa -C "example@example.com"
cat ~/.ssh/id_rsa.pub | ssh -p 2223 root@5.200.60.73 'umask 077; cat >> ~/.ssh/authorized_keys'
cat ~/.ssh/id_rsa.pub | ssh -p 2223 root@5.200.60.73 'umask 077; cat >> /home/deploy/.ssh/authorized_keys'

### [Установка ansible под Mac Os X] (http://docs.ansible.com/ansible/intro_installation.html#latest-releases-via-pip)

```
sudo easy_install pip
```

```
sudo pip install ansible
```

### Клонируем репо ansible-nvm для node.js в roles
```
git clone https://github.com/leonidas/ansible-nvm
```


### Запуск ansible:

ansible-playbook -i hosts playbook.yml