import express from "express";

import { assignments } from "./data/assignments.js";

let assignmentsMockDatabase = assignments;

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request, limit must not exceeds 10 assignments",
    });
  }

  const assignmentsResult = assignmentsMockDatabase.slice(0, limit);

  return res.json({
    data: assignmentsResult,
  });
});

app.get("/assignments/:assighmentsId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assighmentsId);

  const newAssignments = assignmentsMockDatabase.filter((item) => {
    return item.id === assignmentIdFromClient;
  });

  return res.json({
    data: newAssignments[0],
  });
});

app.post("/assignments", function (req, res) {
  assignmentsMockDatabase.push({
    id: assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New assignment has been created successfully",
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentsId);

  const newAssignments = assignmentsMockDatabase.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  assignmentsMockDatabase = newAssignments;

  return res.json({
    message: `Assignments Id : ${assignmentIdFromClient} has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentsId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentsId);

  const assignmentIndex = assignmentsMockDatabase.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });

  assignmentsMockDatabase[assignmentIndex] = {
    id: assignmentIdFromClient,
    ...req.body,
  };
  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient} has been update successfully`,
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
