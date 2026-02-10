const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let students = [];
let courses = [];

/* ---------- HOME ---------- */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* ---------- STUDENT REGISTRATION ---------- */
app.post("/registerStudent", (req, res) => {
  students.push({
    name: req.body.name,
    id: req.body.id,
    password: req.body.password,
    studentClass: req.body.class,
    address: req.body.address,
    gender: req.body.gender,
    mailid: req.body.mailid,
    marks: {}
  });

  res.send("Student Registered Successfully");
});

/* ---------- ADD COURSE ---------- */
app.post("/addCourse", (req, res) => {
  courses.push({
    courseId: req.body.courseId,
    courseName: req.body.courseName
  });
  res.send("Course Added Successfully");
});

/* ---------- UPDATE COURSE NAME ---------- */
app.post("/updateCourse", (req, res) => {
  const course = courses.find(c => c.courseId === req.body.courseId);

  if (!course) return res.send("Course Not Found");

  course.courseName = req.body.newName;
  res.send("Course Updated Successfully");
});

/* ---------- DELETE COURSE ---------- */
app.post("/deleteCourse", (req, res) => {
  const index = courses.findIndex(c => c.courseId === req.body.courseId);

  if (index === -1) return res.send("Course Not Found");

  courses.splice(index, 1);
  res.send("Course Deleted Successfully");
});

/* ---------- ADD MARKS + TOTAL ---------- */
app.post("/addMarks", (req, res) => {
  const student = students.find(s => s.id === req.body.studentId);
  if (!student) return res.send("Student Not Found");

  let total = 0;

  courses.forEach(course => {
    const mark = parseInt(req.body[course.courseId]) || 0;
    student.marks[course.courseId] = mark;
    total += mark;
  });

  student.total = total;
  res.send("Total Marks = " + total);
});

/* ---------- DISPLAY STUDENTS TABLE ---------- */
app.get("/studentsTable", (req, res) => {
  let html = `
  <h2>Student Details</h2>
  <table border="1" cellpadding="8">
    <tr>
      <th>ID</th><th>Name</th><th>Class</th>
      <th>Email</th><th>Gender</th><th>Total</th>
    </tr>`;

  students.forEach(s => {
    html += `
    <tr>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.studentClass}</td>
      <td>${s.mailid}</td>
      <td>${s.gender}</td>
      <td>${s.total || 0}</td>
    </tr>`;
  });

  html += "</table>";
  res.send(html);
});

/* ---------- API ---------- */
app.get("/students", (req, res) => res.json(students));
app.get("/courses", (req, res) => res.json(courses));

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
