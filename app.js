// Добавить скачку про зарплаты, доходы, расходы во отдельности
const express = require("express");
const url = require("url");
const fs = require("fs")
const auth = require("./auth");
const path = require("path");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { join } = require("path");
const { timeStamp } = require("console");
const app = express();
const excel = require('exceljs');
const http = require("http");



const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"iwscrud",
    database:"crud_db",
    port: 3306,
    multipleStatements: true
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log("Database Connected!");
});





app.set("views", path.join(__dirname,"views"));

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));




app.use(auth)
app.get("/",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date from crud_users";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_index", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});

// SUMMARY TAKINGS
app.get("/takings-sum-month",(req, res) => {
    let sql = "SELECT id,service,MONTHNAME(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price > 0 GROUP BY MONTH(date) DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_takings_sum", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
//conclusion-year-takings
app.get("/takings-sum-year",(req, res) => {
    let sql = "SELECT id,service,YEAR(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price > 0 GROUP BY YEAR(date) DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_takings_sum", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
// SUMMARY TAKINGS DOWNLOAD MONTH
app.get("/download-takings-sum-month",(req, res) => {
    let sql = "SELECT id,service,MONTHNAME(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price > 0 GROUP BY MONTH(date) DESC";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Месяц', key: "date", width: 30, },
                { header: 'Доходы', key: 'price', width: 30},
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-takings-sum-month.xlsx")
            .then(function() {
              res.redirect("/takings");
            });
        });
});
// SUMMARY TAKINGS DOWNLOAD YEAR
app.get("/download-takings-sum-year",(req, res) => {
    let sql = "SELECT id,service,YEAR(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price > 0 GROUP BY YEAR(date) DESC";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Год', key: "date", width: 30, },
                { header: 'Доходы', key: 'price', width: 30},
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-takings-sum-year.xlsx")
            .then(function() {
              res.redirect("/takings");
            });
        });
});
// SUMMARY EXPENSES
app.get("/expenses-sum-month",(req, res) => {
    let sql = "SELECT id,service,MONTHNAME(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price < 0 GROUP BY MONTH(date) DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_expenses_sum", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/expenses-sum-year",(req, res) => {
    let sql = "SELECT id,service,YEAR(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price < 0 GROUP BY YEAR(date) DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_expenses_sum", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/download-expenses-sum-month",(req, res) => {
    let sql = "SELECT id,service,MONTHNAME(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price < 0 GROUP BY MONTH(date) DESC";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Месяц', key: "date", width: 30, },
                { header: 'Расходы', key: 'price', width: 30},
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-expenses-sum-month.xlsx")
            .then(function() {
              res.redirect("/expenses");
            });
        });
});
app.get("/download-expenses-sum-year",(req, res) => {
    let sql = "SELECT id,service,YEAR(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price < 0 GROUP BY YEAR(date) DESC";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Год', key: "date", width: 30, },
                { header: 'Расходы', key: 'price', width: 30},
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-expenses-sum-year.xlsx")
            .then(function() {
              res.redirect("/expenses");
            });
        });
});
// SUMMARY SALARIES
app.get("/salaries-sum-month",(req, res) => {
    let sql = "SELECT id,service,MONTHNAME(date) AS date, sum(price) as price FROM crud_users WHERE service LIKE '%Зарплата%' GROUP BY MONTH(date) DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_salaries_sum", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/salaries-sum-year",(req, res) => {
    let sql = "SELECT id,service,YEAR(date) AS date, sum(price) as price FROM crud_users WHERE service LIKE '%Зарплата%' GROUP BY YEAR(date) DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_salaries_sum", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/download-salaries-sum-month",(req, res) => {
    let sql = "SELECT id,service,MONTHNAME(date) AS date, sum(price) as price FROM crud_users WHERE service LIKE '%Зарплата%' GROUP BY MONTH(date) DESC";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Месяц', key: "date", width: 30, },
                { header: 'Выплаченные зарплаты', key: 'price', width: 30},
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-salaries-sum-month.xlsx")
            .then(function() {
              res.redirect("/salaries");
            });
        });
});
app.get("/download-salaries-sum-year",(req, res) => {
    let sql = "SELECT id,service,YEAR(date) AS date, sum(price) as price FROM crud_users WHERE service LIKE '%Зарплата%' GROUP BY YEAR(date) DESC";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Годы', key: "date", width: 30, },
                { header: 'Выплаченные зарплаты', key: 'price', width: 30},
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-salaries-sum-year.xlsx")
            .then(function() {
              res.redirect("/salaries");
            });
        });
});

// REDIRECT TO SEARCH BOX
app.get('/search', (req, res) => {
    res.redirect('http://localhost/PHP/ajax-search.php');
  });

// ADD User
app.get("/add", (req, res) => {
    res.render("user_add", {
        title : "База данных клиентов IT & Web Solutions"
    });
});


app.post("/save", (req, res) => {
    let data = {first_name: req.body.first_name, last_name: req.body.last_name, personal_id_code: req.body.personal_id_code, email: req.body.email, service: req.body.service, price: req.body.price, date: req.body.date};
    let sql = `INSERT INTO crud_users SET ?`;
    let query = connection.query(sql, data, (err, results) => {
        if(err) throw err;
        res.redirect("/");
    });
});
// TAKINGS
app.get("/takings",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price >= 0 AND service NOT LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_takings", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});

app.get("/takings-month",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price >= 0 AND date > NOW() - INTERVAL 1 MONTH AND service NOT LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_takings", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});

app.get("/takings-year",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price >= 0 AND date > NOW() - INTERVAL 1 YEAR AND service NOT LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_takings", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
// EXPENSES
app.get("/expenses",(req, res) => {
    let sql = "SELECT id,service,price,DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price <= 0 AND service NOT LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_expenses", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/expenses-month",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price <= 0 AND date > NOW() - INTERVAL 1 MONTH AND service NOT LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_expenses", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/expenses-year",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price <= 0 AND date > NOW() - INTERVAL 1 YEAR AND service NOT LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_expenses", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
// SALARIES
app.get("/salaries",(req, res) => {
    let sql = "SELECT id,first_name,last_name,price,DATE_FORMAT(date,'%d/%m/%Y') AS date,service FROM crud_users WHERE service LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_salaries", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/salaries-month",(req, res) => {
    let sql = "SELECT id,first_name,last_name,price,DATE_FORMAT(date,'%d/%m/%Y') AS date,service FROM crud_users WHERE service LIKE '%Зарплата%' AND date > NOW() - INTERVAL 1 MONTH";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_salaries", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/salaries-year",(req, res) => {
    let sql = "SELECT id,first_name,last_name,price,DATE_FORMAT(date,'%d/%m/%Y') AS date,service FROM crud_users WHERE service LIKE '%Зарплата%' AND date > NOW() - INTERVAL 1 YEAR";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_salaries", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});

//conclusion-month-takings
app.get("/conclusionmonth",(req, res) => {
    let sql = "SELECT id,service,MONTHNAME(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price > 0 GROUP BY MONTH(date) DESC,service";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_every_takings", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
//conclusion-year-takings
app.get("/conclusionyear",(req, res) => {
    let sql = "SELECT id,service,YEAR(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price > 0 GROUP BY YEAR(date) DESC,service";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_every_takings", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
//conclusion-month-expenses
app.get("/expensesmonth",(req, res) => {
    let sql = "SELECT id,service,MONTHNAME(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price < 0 GROUP BY MONTH(date) DESC,service";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_every_expenses", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
//conclusion-year-takings
app.get("/expensesyear",(req, res) => {
    let sql = "SELECT id,service,YEAR(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price < 0 GROUP BY YEAR(date) DESC,service";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_every_expenses", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
// SALARIES
app.get("/salariesmonth",(req, res) => {
    let sql = "SELECT id,last_name,first_name,MONTHNAME(date) AS date, sum(price) as price FROM crud_users WHERE service LIKE '%Зарплата%' GROUP BY MONTH(date) DESC,first_name,last_name";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_every_salaries", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/salariesyear",(req, res) => {
    let sql = "SELECT id,last_name,first_name,YEAR(date) AS date, sum(price) as price FROM crud_users WHERE service LIKE '%Зарплата%' GROUP BY YEAR(date) DESC,first_name,last_name";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_every_salaries", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
// GET FROM ALL SQL TO EXCEL
app.get("/download",(req, res) => {
    let sql = "SELECT *,DATE_FORMAT(date,'%d/%m/%Y') AS date FROM `crud_users`";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Имя', key: 'first_name', width: 30 },
                { header: 'Фамилия', key: 'last_name', width: 30},
                { header: 'Персональный Код', key: 'personal_id_code', width: 30, },
                { header: 'Почта', key: 'email', width: 30 },
                { header: 'Услуга', key: 'service', width: 60 },
                { header: 'Цена', key: 'price', width: 30},
                { header: 'Дата', key: "date", width: 30, },
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-all.xlsx")
            .then(function() {
              res.redirect("/user_every_takings");
            });
        });
});

app.get("/download-month",(req, res) => {
    let sql = "SELECT *,DATE_FORMAT(date,'%d/%m/%Y') AS date FROM `crud_users` WHERE date > NOW() - INTERVAL 1 MONTH";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Имя', key: 'first_name', width: 30 },
                { header: 'Фамилия', key: 'last_name', width: 30},
                { header: 'Персональный Код', key: 'personal_id_code', width: 30, },
                { header: 'Почта', key: 'email', width: 30 },
                { header: 'Услуга', key: 'service', width: 60 },
                { header: 'Цена', key: 'price', width: 30},
                { header: 'Дата', key: "date", width: 30, },
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-all-month.xlsx")
            .then(function() {
              res.redirect("/");
            });
        });
});
app.get("/download-year",(req, res) => {
    let sql = "SELECT *,DATE_FORMAT(date,'%d/%m/%Y') AS date FROM `crud_users` WHERE date > NOW() - INTERVAL 1 YEAR";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Имя', key: 'first_name', width: 30 },
                { header: 'Фамилия', key: 'last_name', width: 30},
                { header: 'Персональный Код', key: 'personal_id_code', width: 30, },
                { header: 'Почта', key: 'email', width: 30 },
                { header: 'Услуга', key: 'service', width: 60 },
                { header: 'Цена', key: 'price', width: 30},
                { header: 'Дата', key: "date", width: 30, },
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-all-year.xlsx")
            .then(function() {
              res.redirect("/");
            });
        });
});


// GET ALL TAKINGS SQL TO EXCEL

app.get("/download-takings",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price >= 0 AND service NOT LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Услуга', key: 'service', width: 60 },
                { header: 'Доходы', key: 'price', width: 30},
                { header: 'Дата', key: "date", width: 30, },
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-takings.xlsx")
            .then(function() {
              res.redirect("/takings");
            });
        });
});

app.get("/download-month-takings",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price >= 0 AND date > NOW() - INTERVAL 1 MONTH AND service NOT LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Услуга', key: 'service', width: 60 },
                { header: 'Доходы', key: 'price', width: 30},
                { header: 'Дата', key: "date", width: 30, },
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-takings-month.xlsx")
            .then(function() {
              res.redirect("/takings");
            });
        });
});
app.get("/download-year-takings",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price >= 0 AND date > NOW() - INTERVAL 1 YEAR AND service NOT LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Услуга', key: 'service', width: 30 },
                { header: 'Доходы', key: 'price', width: 30},
                { header: 'Дата', key: "date", width: 30, },
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-takings-year.xlsx")
            .then(function() {
              res.redirect("/takings");
            });
        });
});
app.get("/download-every-month-takings",(req, res) => {
    let sql = "SELECT id,service,MONTHNAME(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price > 0 GROUP BY MONTH(date),service";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Дата', key: "date", width: 30, },
                { header: 'Услуга', key: "service", width: 70, },
                { header: 'Доходы', key: 'price', width: 30},
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-takings-every-month.xlsx")
            .then(function() {
              res.redirect("/takings");
            });
        });
});
app.get("/download-every-year-takings",(req, res) => {
    let sql = "SELECT id,service,YEAR(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price > 0 GROUP BY YEAR(date),service";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Дата', key: "date", width: 30, },
                { header: 'Услуга', key: "service", width: 70, },
                { header: 'Доходы', key: 'price', width: 30},
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-takings-every-year.xlsx")
            .then(function() {
              res.redirect("/takings");
            });
        });
});
// GET ALL EXPENSES SQL TO EXCEL

app.get("/download-expenses",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price <= 0 AND service NOT LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  

                { header: 'Услуга', key: 'service', width: 60 },
                { header: 'Расходы', key: 'price', width: 30},
                { header: 'Дата', key: "date", width: 30, },
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-expenses.xlsx")
            .then(function() {
              res.redirect("/expenses");
            });
        });
});

app.get("/download-month-expenses",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price <= 0 AND date > NOW() - INTERVAL 1 MONTH AND service NOT LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Услуга', key: 'service', width: 60 },
                { header: 'Расходы', key: 'price', width: 30},
                { header: 'Дата', key: "date", width: 30, },
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-expenses-month.xlsx")
            .then(function() {
              res.redirect("/expenses");
            });
        });
});
app.get("/download-year-expenses",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price <= 0 AND date > NOW() - INTERVAL 1 YEAR AND service NOT LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  

                { header: 'Услуга', key: 'service', width: 30 },
                { header: 'Расходы', key: 'price', width: 30},
                { header: 'Дата', key: "date", width: 30, },
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-expenses-year.xlsx")
            .then(function() {
              res.redirect("/expenses");
            });
        });
});

app.get("/download-every-month-expenses",(req, res) => {
    let sql = "SELECT id,service,MONTHNAME(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price < 0 GROUP BY MONTH(date),service";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Дата', key: "date", width: 30, },
                { header: 'Услуга', key: "service", width: 70, },
                { header: 'Расходы', key: 'price', width: 30},
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-expenses-every-month.xlsx")
            .then(function() {
              res.redirect("/expenses");
            });
        });
});
app.get("/download-every-year-expenses",(req, res) => {
    let sql = "SELECT id,service,YEAR(date) AS date, sum(price) as price FROM crud_users WHERE service NOT LIKE '%Зарплата%' AND price < 0 GROUP BY MONTH(date),service";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Дата', key: "date", width: 30, },
                { header: 'Услуга', key: "service", width: 70, },
                { header: 'Расходы', key: 'price', width: 30},
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-expenses-every-year.xlsx")
            .then(function() {
              res.redirect("/expenses");
            });
        });
});
// GET ALL EXPENSES SQL TO EXCEL

// GET ALL SALARIES SQL TO EXCEL

app.get("/download-salaries",(req, res) => {
    let sql = "SELECT id,first_name,last_name,price,DATE_FORMAT(date,'%d/%m/%Y') AS date,service FROM crud_users WHERE service LIKE '%Зарплата%'";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  

                { header: 'Услуга', key: 'service', width: 60 },
                { header: 'Зарплата', key: 'price', width: 30},
                { header: 'Дата', key: "date", width: 30, },
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-salaries.xlsx")
            .then(function() {
              res.redirect("/salaries");
            });
        });
});

app.get("/download-month-salaries",(req, res) => {
    let sql = "SELECT id,first_name,last_name,price,DATE_FORMAT(date,'%d/%m/%Y') AS date,service FROM crud_users WHERE service LIKE '%Зарплата%' AND date > NOW() - INTERVAL 1 MONTH";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Услуга', key: 'service', width: 60 },
                { header: 'Зарплата', key: 'price', width: 30},
                { header: 'Дата', key: "date", width: 30, },
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-salaries-month.xlsx")
            .then(function() {
              res.redirect("/salaries");
            });
        });
});
app.get("/download-year-salaries",(req, res) => {
    let sql = "SELECT id,first_name,last_name,price,DATE_FORMAT(date,'%d/%m/%Y') AS date,service FROM crud_users WHERE service LIKE '%Зарплата%' AND date > NOW() - INTERVAL 1 YEAR";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  

                { header: 'Услуга', key: 'service', width: 30 },
                { header: 'Зарплата', key: 'price', width: 30},
                { header: 'Дата', key: "date", width: 30, },
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-salaries-year.xlsx")
            .then(function() {
              res.redirect("/salaries");
            });
        });
});
app.get("/download-every-month-salaries",(req, res) => {
    let sql = "SELECT id,first_name,last_name,MONTHNAME(date) AS date, sum(price) as price FROM crud_users WHERE service LIKE '%Зарплата%' GROUP BY MONTH(date),first_name,last_name";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Дата', key: "date", width: 30, },
                { header: 'Имя', key: "first_name", width: 70, },
                { header: 'Фамилия', key: "last_name", width: 70, },
                { header: 'Зарплата', key: 'price', width: 30},
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-salaries-every-month.xlsx")
            .then(function() {
              res.redirect("/salaries");
            });
        });
});
app.get("/download-every-year-salaries",(req, res) => {
    let sql = "SELECT id,first_name,last_name,YEAR(date) AS date, sum(price) as price FROM crud_users WHERE service LIKE '%Зарплата%' GROUP BY YEAR(date),first_name,last_name";
    let query = connection.query(sql, (err, customers, fields) => {
        if (err) throw err;
            const jsonCustomers = JSON.parse(JSON.stringify(customers));
            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
            worksheet.columns = [  
                { header: 'Дата', key: "date", width: 30, },
                { header: 'Имя', key: "first_name", width: 70, },
                { header: 'Фамилия', key: "last_name", width: 70, },
                { header: 'Зарплата', key: 'price', width: 30},
            ];
            worksheet.addRows(jsonCustomers);
            workbook.xlsx.writeFile("outputs/output-salaries-every-year.xlsx")
            .then(function() {
              res.redirect("/salaries");
            });
        });
});
// CRUD OPERATIONS
app.get("/edit/:userId", (req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from crud_users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render("user_edit", {
            title : "База данных клиентов IT & Web Solutions",
            user : result[0]
        });
    });
});

app.post("/update", (req, res) => {
    const userId = req.body.id;
    let sql = "update crud_users SET first_name ='"+req.body.first_name+"', last_name = '"+req.body.last_name+"', personal_id_code = '"+req.body.personal_id_code+"', email = '"+req.body.email+"', service = '"+req.body.service+"', price = '"+req.body.price+"' where id = "+userId;
    let query = connection.query(sql,(err, results) => {
        if(err) throw err;
        res.redirect("/");
    });
});





app.get("/delete/:userId", (req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from crud_users where id = ${userId}; ALTER TABLE crud_users DROP COLUMN id; ALTER TABLE crud_users ADD COLUMN id INT UNSIGNED NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (ID);`;
    let query = connection.query(sql, [2, 1], function(error, results, fields) {
        if (error) {
            throw error;
        }
    console.log(results[0]);
    console.log(results[1]);
    });
});

// MAIN PAGE
app.get("/sort-by-name",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date from crud_users ORDER BY first_name";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_index", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-surname",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date from crud_users ORDER BY last_name";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_index", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-pid",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date from crud_users ORDER BY personal_id_code";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_index", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-email",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date from crud_users ORDER BY email";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_index", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-service",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date from crud_users ORDER BY service";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_index", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-price",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date from crud_users ORDER BY price DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_index", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-date",(req, res) => {
    let sql = "SELECT *,DATE_FORMAT(date,'%d/%m/%Y') AS `date` FROM crud_users ORDER BY crud_users.`date` DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_index", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});

// TAKINGS
app.get("/sort-by-service-takings",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price > 0 AND service NOT LIKE '%Зарплата%' ORDER BY service";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_takings", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-price-takings",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price > 0 AND service NOT LIKE '%Зарплата%' ORDER BY price DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_takings", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-date-takings",(req, res) => {
    let sql = "SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS `date` FROM crud_users WHERE price > 0 AND service NOT LIKE '%Зарплата%' ORDER BY crud_users.`date` DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_takings", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
// EXPENSES
app.get("/sort-by-service-expenses",(req, res) => {
    let sql = "SELECT service,price,DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price < 0 AND service NOT LIKE '%Зарплата%' ORDER BY service";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_expenses", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-price-expenses",(req, res) => {
    let sql = "SELECT service,price,DATE_FORMAT(date,'%d/%m/%Y') AS date FROM crud_users WHERE price < 0 AND service NOT LIKE '%Зарплата%' ORDER BY price DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_expenses", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-date-expenses",(req, res) => {
    let sql = "SELECT service,price,DATE_FORMAT(date,'%d/%m/%Y') AS `date` FROM crud_users WHERE price < 0 AND service NOT LIKE '%Зарплата%' ORDER BY crud_users.`date` DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_expenses", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
// SALARIES
app.get("/sort-by-fn-salary",(req, res) => {
    let sql = "SELECT first_name,last_name,price,DATE_FORMAT(date,'%d/%m/%Y') AS date,service FROM crud_users WHERE service LIKE '%Зарплата%' ORDER BY first_name";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_salaries", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-ln-salary",(req, res) => {
    let sql = "SELECT first_name,last_name,price,DATE_FORMAT(date,'%d/%m/%Y') AS date,service FROM crud_users WHERE service LIKE '%Зарплата%' ORDER BY last_name";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_salaries", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-price-salary",(req, res) => {
    let sql = "SELECT first_name,last_name,price,DATE_FORMAT(date,'%d/%m/%Y') AS date,service FROM crud_users WHERE service LIKE '%Зарплата%' ORDER BY price DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_salaries", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});
app.get("/sort-by-date-salary",(req, res) => {
    let sql = "SELECT first_name,last_name,price,DATE_FORMAT(date,'%d/%m/%Y') AS `date`,service FROM crud_users WHERE service LIKE '%Зарплата%' ORDER BY crud_users.`date` DESC";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render("user_salaries", {
            title : "База данных клиентов IT & Web Solutions",
            users : rows
        });
    });
});



// SERVER RUNNING PORT
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

