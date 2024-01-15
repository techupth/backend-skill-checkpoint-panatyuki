import express from "express";
import { client, db } from "./utils/db.js";
import { ObjectId } from "mongodb";

async function init() {
  try {
    await client.connect();
    const app = express();
    const port = 4000;

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.get("/", (req, res) => {
      return res.json("Ready");
    });

    app.post("/question", async (req, res) => {
      const collection = db.collection("questions");
      const questionData = { ...req.body };
      const newQuestionData = await collection.insertOne(questionData);
      return res.json({
        Message: "new question has been created successfully",
      });
    });

    app.get("/questions", async (req, res) => {
      const collection = db.collection("questions");
      const allQuestions = await collection.find().toArray();
      return res.json({
        data: allQuestions,
      });
    });

    app.get("/question/:questionId", async (req, res) => {
      const collection = db.collection("questions");
      const questionId = new ObjectId(req.params.questionId);

      const questionById = await collection.findOne({ _id: questionId });

      return res.json({
        data: questionById,
      });
    });

    app.put("/question/:questionId", async (req, res) => {
      const collection = db.collection("questions");
      const updateData = { ...req.body };

      const questionid = new ObjectId(req.params.questionId);

      await collection.updateOne(
        {
          _id: questionid,
        },
        {
          $set: updateData,
        }
      );

      return res.json({ Message: "question has been updated successfully" });
    });

    app.delete("/question/:questionId", async (req, res) => {
      const collection = db.collection("questions");
      const questionId = new ObjectId(req.params.questionId);

      await collection.deleteOne({ _id: questionId });

      return res.json({
        Message: `question ${questionId} has been deleted successfully`,
      });
    });

    app.get("*", (req, res) => {
      return res.status(404).json("Not found");
    });

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

init();
