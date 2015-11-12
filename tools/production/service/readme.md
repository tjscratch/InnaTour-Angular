install service:
sudo cp inna-frontend.conf /etc/init/inna-frontend.conf

run:
sudo service inna-frontend start

stop:
sudo service inna-frontend stop

logs:
sudo tail -f /var/log/upstart/inna-frontend.log