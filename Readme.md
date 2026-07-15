
# Initializing EC2 instance
#Go to aws console
#Navigate EC2
#launch instance 
#select ubuntu
#check box "Allow HTTP traffic from the internet"
#click Connect
#click securtiy tab then click security groups instance
#click edit inbound rules
#delete all 
#click add new rule
#put
[http:80,https:433,ssh:80]
#then the Source = Anywhere IPv4
#click save go back to instance click Connect
#go to ssh client tab
#then go to your file explorer 
#navigate the pem file 
#then rright click the folder where pem file is stored
#the click run with terminal or git bash
#run these command: 
[
1.chmod 400 your_pem_file
2.ssh -i your_pem_file ubuntu@your_public_dns
]
#type yes


#installing Temux (remove <> when executing in linux terminal)
#firstly update the environment
#run these commands 
[
<sudo apt update -y>
<sudo apt upgrade -y>
]
#now install tmux 
#run this command 
<sudo apt install tmux -y>
#starts new tmux session
<tmux new -s name_of_session>

#installing nginx
#run this command 
<sudo apt install nginx -y>
#verify if its running sudo systemctl status nginx (You should see "active (running)" in green.)
#Crtl + C to exit

#installing maria DB
<sudo apt install mariadb-server -y>

#install php based on your project php version
#check the version of your php first by going to windows terminal 
#then type 
<php -v>
#now in linux terminal install specific php version
#run this command 
<sudo apt install php8.2-fpm php8.2-mysql php8.2-curl php8.2-xml php8.2-mbstring php8.2-zip php8.2-gd php8.2-bcmath -y>
#if error run these commands first then return to the php installing
[
<sudo add-apt-repository ppa:ondrej/php -y>
#updata package list again
<sudo apt update>]

#Create No-Ip domain
#in chrome search for https://my.noip.com/dns
#create an account 
#then create Host name
#the only field you change is 
[Host=(eg.. kickslogix),use ddns.net, IPv4 = your public ip in ec2]
#to find public ip in c2 
#go to connect in ec2 instance then click connect then EC2 Instance Connect Tab you will find IPv4 address click copy
#then replace ipv4 in no-ip with your public IP
#Click create

#Create configuration file
#run this command <sudo nano /etc/nginx/sites-available/config_file_name>
#copy this json
server {
    listen 80;
    server_name your_no-ip_dns;
    root /var/www/config_file_name/public;

    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
    }
}
#then press <CTRL+X then CTRL+Y then Enter>

#then enable site and test
<sudo ln -s /etc/nginx/sites-available/config_file_name /etc/nginx/sites-enabled/>
<sudo nginx -t>
<sudo systemctl restart nginx>

#dding ssl certificate(Certbot)
#install certbot first
<sudo apt install certbot python3-certbot-nginx -y>
#then run this
<sudo certbot --nginx -d your_no-ip_dns>
#you will see enter email address
#enter you email
#press y enter
#press y enter

#Cloning Project
#navigate first to /var/www
<cd /var/www>
#then change the permission to ubuntu /var/www
<sudo chown ubuntu:ubuntu /var/www>
#then run
<sudo git clone your_github_repo >
#Give the web server group (www-data) access to the project
<sudo chgrp -R www-data /var/www/project_folder>
# Give the web server WRITE access to the specific folders it needs
<sudo chmod -R 775 /var/www/project_folder/storage /var/www/config_file_name/bootstrap/cache>

#Since we're using T3 1Gb of free space we need higher than that
#so run these commands
[
# 1. Create a 2GB file (this may take 10-20 seconds)
<sudo fallocate -l 2G /swapfile>

# 2. Set the correct security permissions
<sudo chmod 600 /swapfile>

# 3. Format the file into 'Swap' format
<sudo mkswap /swapfile>

# 4. Turn the swap on
<sudo swapon /swapfile>

# 5. Verify it is working
<free -h>
]

#installing dependecies and .env
#firstly go to your project folder 
<cd /var/www/project_folder>
#copy .env.example o .env
<cp .env.example .env>
#then type this command
<nano .env>
#uncomment this environment
[
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
]
#change the DB_CONNECTION=sqlite to DB_CONNECTION=mysql
#change the APP_URL value to your no-ip-dns4
#change DB_DATABASE to your desired DB name
#then press <CTRL+X then CTRL+Y then Enter>
#then insall composer
<sudo apt install composer -y>
<composer install --no-dev --optimize-autoloader>
#if <composer install --no-dev --optimize-autoloader> is error
#run these first 
#install missing extension
<sudo apt install php8.2-intl -y>
#install npm (version msut be same with your project in vscode used)
<curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash ->
<sudo apt install nodejs -y>
#check both vite and node exist
<node -v
npm -v>
#restart php-fpm
<sudo systemctl restart php8.2-fpm>
#then run the compuser again
<composer install --no-dev --optimize-autoloader> 
<npm aduit fix>
#then generate application key

#build react-laravel assets
<npm install>
<NODE_OPTIONS="--max-old-space-size=1536" npx vite build>
<npm run build>

# Set permissions one last time for the build folder
<sudo chown -R ubuntu:www-data storage bootstrap/cache>
<sudo chmod -R 775 storage bootstrap/cache>
#setup database
<sudo mysql -u root>
run these queries
[
CREATE DATABASE IF NOT EXISTS Brgy29C;
CREATE USER IF NOT EXISTS 'brgy_admin'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON Brgy29C.* TO 'brgy_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
]

#update .env 
#DB_CONNECTION=mysql
#DB_HOST=127.0.0.1
#DB_PORT=3306
#DB_DATABASE=your_database_name
#DB_USERNAME=brgy_admin
#DB_PASSWORD=YourStrongPassword123!

#then run
<php artisan migrate --force>
<php artisan migrate:fresh --seed>


#The final boss
<php artisan key:generate>
<php artisan wayfinder:generate>

#For security purpose 
update your Nginx file to this
<
# Rate limit zones (http context usually in nginx.conf)
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

server {
    server_name it20brgy29.ddns.net;
    root /var/www/brgy-29C/public;
    index index.php index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # HSTS (enable only if HTTPS is always valid)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Disable directory listing
    autoindex off;

    # Main app
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Protect sensitive hidden files
    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Never expose .env and other secrets explicitly
    location ~* \.(env|ini|log|conf|sql|bak)$ {
        deny all;
    }

    # PHP handling
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Block direct access to storage/app and vendor (extra defense)
    location ^~ /storage/app/ { deny all; }
    location ^~ /vendor/ { deny all; }

    # Static assets cache
    location ~* \.(css|js|jpg|jpeg|png|gif|svg|ico|webp|woff|woff2|ttf)$ {
        expires 30d;
        access_log off;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Optional rate limits for sensitive routes
    location = /login {
        limit_req zone=login_limit burst=10 nodelay;
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ^~ /api/ {
        limit_req zone=api_limit burst=30 nodelay;
        try_files $uri $uri/ /index.php?$query_string;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/it20brgy29.ddns.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/it20brgy29.ddns.net/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name it20brgy29.ddns.net;
    return 301 https://$host$request_uri;
}
>

#Save and restart nginx
<
sudo nginx -t
sudo systemctl reload nginx
>
