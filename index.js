const express = require("express");
const app = express();
const port = 3000;
const db = require("./connection");
const response = require("./response");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const aesEncrypt = require("./enc");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const sql_query = "SELECT * FROM tb_pegawai";
  db.query(sql_query, (error, results) => {
    // SQL Results
    response(200, results, "Get all data from pegawai", res);
  });
});

app.get("/role", (req, res) => {
  const sql_query = `SELECT name, role FROM tb_pegawai`;
  db.query(sql_query, (error, results) => {
    response(200, results, "Get name and role from pegawai", res);
  });
});

app.get("/search/:name", (req, res) => {
  const name = req.params.name;
  const sql_query = `SELECT nip FROM tb_pegawai WHERE name LIKE '%${name}%'`;
  db.query(sql_query, (error, results) => {
    // SQL Results
    response(200, results, "Get pegawai NIP by name", res);
  });
});

app.get("/presensi", (req, res) => {
  const sql_query = `SELECT * FROM tb_presensi`;
  db.query(sql_query, (error, results) => {
    response(200, results, "Get all presence from presensi", res);
  });
});

app.get("/presensi/date/:date", (req, res) => {
  const date = req.params.date;
  const sql_query = `SELECT * FROM tb_presensi WHERE date LIKE '${date}'`;
  db.query(sql_query, (error, results) => {
    response(200, results, "Get presence by date", res);
  });
});

app.get("/presensi/nip/:nip", (req, res) => {
  const nip = req.params.nip;
  const sql_query = `SELECT * FROM tb_presensi WHERE nip LIKE '${nip}'`;
  db.query(sql_query, (error, results) => {
    response(200, results, "Get presence by name", res);
  });
});

app.post("/pegawai", (req, res) => {
  const id = uuidv4();
  const { nip, password, name, phone, address, role } = req.body;
  const encryptedPass = aesEncrypt.encryptPassword(password);

  console.log(req.body);
  const sql_query = `INSERT INTO tb_pegawai VALUES ('${id}', '${nip}', '${encryptedPass}', '${name}', '${phone}', '${address}', '${role}')`;
  db.query(sql_query, (err, results) => {
    if (err) response(500, "Invalid Data", "Data Error", res);
    if (results?.affectedRows) {
      response(200, results.affectedRows, "Pegawai Added Successfuly", res);
    }
  });
});

app.put("/pegawai", (req, res) => {
  const { nip, password, name, phone, address, role } = req.body;
  const sql_query = `UPDATE tb_pegawai SET name = '${name}', phone = '${phone}', address = '${address}' WHERE nip LIKE '${nip}'`;

  db.query(sql_query, (err, results) => {
    response(200, results.affectedRows, "Pegawai Updated Successfuly", res);
  });
});

app.delete("/pegawai", (req, res) => {
  const { nip } = req.body;
  const sql_query = `DELETE FROM tb_pegawai WHERE nip LIKE ${nip}`;
  db.query(sql_query, (err, results) => {
    response(200, results.affectedRows, "Pegawai Deleted Successfuly", res);
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
