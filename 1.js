var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();
var user = express.Router();
app.use(bodyParser.urlencoded({}));
app.use('/user', user);

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1169246214h',
    database: 'blog',
    port: 3306
})
user.post('/login', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var user = req.body.user;
    var pass = req.body.pass;
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log('connection::' + err);
            return
        }
        connection.query('select * from user where user=?', [user], function(err, data) {
            if (err) {
                console.log('mysql::' + err);
                return
            }
            if (data == '') {
                res.send('用户名不存在')
            } else {
                if (data[0].pass == pass) {
                    res.send('登陆成功')
                } else {
                    res.send('用户名或密码不对')
                }
            }

        })
    })
})

user.post('/login1', function(req, res) {
    var user = req.body.user;
    var pass = req.body.pass;
    pool.getConnection(function(err, connection) {
        if (err) {
            console.log('connection::' + err);
            return
        }

        connection.query('select * from user where user=?', [user], function(err, data) {
            if (err) {
                console.log('mysql::' + err);
                return
            }
            if (data == '') {
                connection.query('insert into user(user,pass) values(?,?)', [user, pass], function(err, data) {
                    if (err) {
                        console.log('mysql::' + err);
                        return
                    }
                    res.send('注册成功')
                })
            } else {
                res.send('用户名以存在')
            }

        })
    })

})

app.use(express.static('./'));
app.listen(8000, function() {
    console.log('ok')
})