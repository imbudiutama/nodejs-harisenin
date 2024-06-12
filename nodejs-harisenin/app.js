const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "nama_database",
});
db.connect(function (err) {
  if (err) throw err;
  console.log("Connected to the database");
});

app.use(express.json());

let users = []; // Simulate a user database
let kelas = []; // Simulate a class database
let mataPelajaran = []; // Simulate a subject database
let bab = []; // Simulate a chapter database
let subBab = []; // Simulate a sub-chapter database
let material = []; // Simulate a material database

// 1. Login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (user && bcrypt.compareSync(password, user.password)) {
    const accessToken = jwt.sign({ id: user.id }, "your_jwt_secret");
    res.json({ accessToken });
  } else {
    res.status(401).send("Email or password is incorrect");
  }
});

// 2. Register
app.post("/auth/register", (req, res) => {
  const { nama, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ id: users.length + 1, nama, email, password: hashedPassword });
  res.status(201).send("User registered successfully");
});

// 3. Get list kelas & mode pembelajaran dari setiap kelas
app.get("/kelas", (req, res) => {
  res.json(kelas);
});

// 4. Get list mata pelajaran berdasarkan mode pembelajaran dan kelas
app.get("/mata-pelajaran", (req, res) => {
  const { id_kelas, id_mode_pembelajaran } = req.query;
  const mataPelajaranFiltered = mataPelajaran.filter((mp) => mp.id_kelas === id_kelas && mp.id_mode_pembelajaran === id_mode_pembelajaran);
  res.json(mataPelajaranFiltered);
});

// 5. Get list bab berdasarkan mata pelajaran 
app.get("/bab", (req, res) => {
  const { id_mata_pelajaran } = req.query;
  const babFiltered = bab.filter((b) => b.id_mata_pelajaran === id_mata_pelajaran);
  res.json(babFiltered);
});

// 6. Get list sub-bab berdasarkan bab 
app.get("/sub-bab", (req, res) => {
  const { id_bab } = req.query;
  const subBabFiltered = subBab.filter((sb) => sb.id_bab === id_bab);
  res.json(subBabFiltered);
});

// 7. Get list material berdasarkan sub-bab 
app.get("/material", (req, res) => {
  const { id_sub_bab } = req.query;
  const materialFiltered = material.filter((m) => m.id_sub_bab === id_sub_bab);
  res.json(materialFiltered);
});

app.listen(3000, () => console.log("Server started on port 3000"));
