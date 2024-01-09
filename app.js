// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";

let assignmentsDatabase = assignments;

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello DTs");
});

app.get("/assignments", (req, res) => {
  if (req.query.limit > 10) {
    return res.json({
      message: "Invalid request,limit must not exceeds 10 assignments", //ถ้าข้อมูลเกิน 10 มันจะ return message แล้วไม่ทำต่อ
    });
  }
  const assignmentsResult = assignmentsDatabase.slice(0, req.query.limit); //เป็นการกำหนด สไลด์ข้อมูลตั้งแต่ indexที่ 0 ถึง index ที่ 10

  return res.json({
    data: assignmentsResult,
  });
});

app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let newAssignmentsData = assignmentsDatabase.filter(
    (item) => item.id === assignmentsIdFromClient // ถ้าใช้เป็นรูปแบบ Fn เต็มต้องใส่ return ด้วย
  );
  return res.json({
    data: newAssignmentsData[0],
  });
});

app.post("/assignments", (req, res) => {
  assignmentsDatabase.push({
    id: assignmentsDatabase[assignmentsDatabase.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "Blog post has been created successfully",
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let newAssignmentsData = assignmentsDatabase.filter((item) => {
    return item.id !== assignmentsIdFromClient;
  });
  assignmentsDatabase = newAssignmentsData;

  return res.json({
    message: `Assignment Id : ${req.params.assignmentsId}  has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromClient = Number(req.params.assignmentsId);
  let newAssignmentsData = {
    ...req.body,
  };

  const hasFound = assignmentsDatabase.find((item) => {
    //ใช้หาข้อมูลใน database ว่ามี id === ตัว parameter นี้ไหม
    return item.id === assignmentsIdFromClient;
  });

  if (!hasFound) {
    return res.json({
      message: " Cannot update, No data available! ",
    });
  } else {
    const assignmentsIndex = assignmentsDatabase.findIndex((item) => {
      //ใช้หาตำแหน่ง index ที่มี id === ตัว parameter
      return item.id === assignmentsIdFromClient;
    });
    assignmentsDatabase[assignmentsIndex] = {
      id: assignmentsIdFromClient,
      ...newAssignmentsData,
    };
  }
  return res.json({
    message: `Assignment Id : ${assignmentsIdFromClient}  has been updated successfully",
       data: ${newAssignmentsData}`,
  });
});
