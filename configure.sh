#!/bin/bash

source config/config.ini

figlet -c "IWS Accounting"

# Configure database with test data
mysql -u $db_user -p$db_pass -P $db_port -h $db_host < SQL/crud_db_test.sql

# Configure PHP/search.php
sed -i "s/localhost/${db_host}/g" PHP/search.php
sed -i "s/root/${db_user}/g" PHP/search.php
sed -i "s/iwscrud/${db_pass}/g" PHP/search.php
sed -i "s/3306/${db_port}/g" PHP/search.php


# Configure NodeJS app.js
sed -i "19s/localhost/${db_host}/g" app.js
sed -i "s/root/${db_user}/g" app.js
sed -i "s/iwscrud/${db_pass}/g" app.js
sed -i "s/3306/${db_port}/g" app.js

# Configure .htaccess
sed -i "s/# Require ip 127.0.0.1/Require ip 127.0.0.1/g" PHP/.htaccess

# Configure Search tool
cp -rf PHP/ $www

echo "Configuration done! Thanks for using IWS Accounting CRUD Application!"