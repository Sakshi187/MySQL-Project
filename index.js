//   C:\> cd  "C:\Program Files\MySQL\MySQL Server 8.0\bin"
// mysql -u root -p
// Enter password: ***********



const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid'); 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const connection  = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "delta_app",
    password: "9c6pg8i3kn3"
});

 let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ]
  };


app.get("/", (req,res) => {

  let q = "SELECT COUNT(*) FROM user";

  try{
    connection.query(q, (err, result) => {
    if(err ) throw err;
    let userCount = (result[0]["COUNT(*)"]);
    res.render("homepage.ejs", {userCount} );
})
} catch(err)
{
    console.log(err);
    res.send("some error in db");
}
});


app.get("/user", (req,res) => {
  let q = "SELECT * FROM user";

    try{
    connection.query(q, (err, users) => {
    if(err ) throw err;
    res.render("showusers.ejs", {users});
  })
} catch(err)
{
    console.log(err);
    res.send("some error in db");
}
});



app.get("/user/:id/edit", (req,res) => {

  let { id } = req.params;
  let q = ` SELECT * FROM user WHERE id = "${id}" ` ;

  try{
    connection.query(q, (err, result) => {
    if(err ) throw err;
    let user = result[0];
    res.render("check_pass.ejs", {user} );
})
} catch(err)
{
    console.log(err);
    res.send("error");
}
});



app.post("/user/:id/edit_id", (req, res) => {
  let {password} = req.body;
  let {id} = req.params;
  
  let q = `SELECT * FROM user WHERE id = ?`;

   try{
    connection.query(q, [id], (err, result) => {
    if(err ) throw err;
    let user = result[0];

    if(user.password === password){
      res.render("edit.ejs", {user});
    }else{
      res.send("incorrect password");
    }

});
} catch(err)
{
    console.log(err);
    res.send("error");
}
});



app.patch("/user/:id/edit_profile", (req,res) => {
  let {id} = req.params;
  let {username, password} = req.body;
  let q = `UPDATE user SET username = ? , password = ? WHERE id = ? `;

    try{
       connection.query(q, [username, password, id], (err, result) => {
       if(err) throw err;
       res.redirect("/user" );
       });
    } catch(err)
    {
        console.log(err);
        res.send("error");
    }
});

// add user route

app.get("/add_user", (req,res) => {
  let data = [];
  data.push(getRandomUser());
  let newUser = data[0];
  console.log(newUser);
  res.render("add.ejs", {newUser});
});

app.post("/add_new_user", (req,res) => {
  // let id =uuidv4();
  let {id, username, email, password} = req.body;
  console.log("rr",username, email, password);

  let q = `INSERT INTO user (id,username,email,password) VALUES (?,?,?,?)`;
  
   try{
    connection.query(q, [id, username, email, password], (err, result) => {
    if(err ) throw err;
    console.log(result);
    res.redirect("/user");
})
} catch(err)
{
    console.log(err);
}
});


app.delete("/user/:id/delete", (req,res) => {
  let { id } = req.params;
  let q = `DELETE FROM user where id = ?`;

    try{
    connection.query(q, [id], (err, result) => {
    if(err) throw err;
    console.log(result);
    res.redirect("/user");
});
} catch(err)
{
    console.log(err);
}
});

app.listen(port, () => {
  console.log("listening to port", port);
});

//   let data = [];
//   data.push(getRandomUser());
//   console.log(data);


//   try{
//     connection.query(q, [data], (err, result) => {
//     if(err ) throw err;
//     console.log(result);
//     res.redirect("/user");
// })
// } catch(err)
// {
//     console.log(err);
// }
// });




// try{
//     connection.query(q, [data], (err, result) => {
//     if(err ) throw err;
//     console.log(result);
// })
// } catch(err)
// {
//     console.log(err);
// }
// connection.end();