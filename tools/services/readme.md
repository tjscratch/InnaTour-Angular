connect:
ssh -p 2210 deploy@5.200.60.73

install service:
sudo cp inna-frontend.conf /etc/init/inna-frontend.conf

run:
sudo service inna-frontend start

stop:
sudo service inna-frontend stop

logs:
sudo tail -f /var/log/upstart/inna-frontend.log