# IWS Accounting

Accouting CRUD interface to calculate expenses, takings and salaries.

# Requirements

**On Linux Systems:**

- Figlet
- NodeJS
- Apache2
- MySQL / MariaDB

**On Windows Systems:**

- NodeJS
- XAMPP ( MySQL / MariaDB & Apache2 )

# Notes & Features

## Notes

- Download button outputs will be located in outputs/ folder
- Authentication parameters are located in auth.js. You can replace them.
- You can replace http://localhost with your domain (Not recommended in development environment)

## Features

- Automatically calculate takings, expenses, salaries
- Search tool using personal code
- Export data to .xlsx (Excel)
- Sorting tool


# Configuration

## Linux

**1. Configure your database connection and apache documentroot in config/config.ini**

    vim config/config.ini

**2. Start configuration script**

    bash configure.sh

## Windows

Setup MySQL Database for CRUD, copy PHP/ folder to htdocs, configure MySQL Connection on NodeJS and PHP applications. 

Use git bash terminal or powershell to configure node app.

**1. Import SQL**

    On XAMPP go to MySQL -> Admin. 
    
    You will get into phpmyadmin. 
    
    Go to import. 
    
    Select file -> SQL/crud_db_test.sql. Encoding is UTF-8.

**2. Copy PHP folder to your XAMPP htdocs folder**
            
    cp -rf PHP/ D:\Development

**3. Replace SQL Connection with your database in PHP/search.php**

    vim D:\Development\PHP\search.php

**4. Replace database information in app.js**

    vim app.js

**5. Uncomment line in .htaccess**

    vim D:\Development\PHP\search.php
    # Require ip ::1

# Installation

**1. Install npm dependencies(node_modules)**

    npm install

**2. Start NodeJS App**

    nodejs app.js

# Usage

**1. Open your browser**

**2. Go to http://localhost:3000 or http://127.0.0.1:3000**

# Troubleshooting

## Having troubles with endings

If you have some troubles with endings, install dos2unix and use it

```
dos2unix CRUD/
```
## npm does not support Node.js v10.24.0

This error means that npm version is not compatible with NodeJS version. Basically just update your npm.

```
sudo npm install npm@latest -g
```

Link: https://github.com/nodejs/help/issues/1877


# Authors

**Кристофер** - [KostLinux](https://github.com/KostLinux) - Team Leader, System Administrator, Network Administrator, Automatization Engineer

**Мартин** - [Matrix278](https://github.com/Matrix278) - FullStack Web Developer

**Валерия** - [ValeriaKey](https://github.com/ValeriaKey) - Junior Web Developer
