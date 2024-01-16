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

    // Test the connection point.
    // ตัวทดสอบสำหรับ Postman ว่าเชื่อมต่อกับ Postman ได้ไหม
    app.get("/", (req, res) => {
      try {
        return res.json("Hello Skill Checkpoint #2");
      } catch (error) {
        return res.json({
          Message: `${error}`,
        });
      }
    });

    // Start to coding Controller functions here.
    // 1 ) Controller function สำหรับสร้างคำถามใหม่ (title, description, category)
    app.post("/question", async (req, res) => {
      try {
        const collection = db.collection("questions");
        const questionData = { ...req.body };
        const newQuestionData = await collection.insertOne(questionData);
        return res.json({
          Message: "new question has been created successfully",
        });
      } catch (error) {
        return res.json({
          Message: `${error} 401 Can not create a new question. Please recheck your text again.`,
        });
      }
    });

    // 2 ) Controller function สำหรับดูคำถามทุกข้อ
    app.get("/questions", async (req, res) => {
      try {
        const collection = db.collection("questions");
        const allQuestions = await collection.find().toArray();
        return res.json({ data: allQuestions });
      } catch (error) {
        return res.json({
          Message: `${error} 402 Can not connect the DB. Please try again later.`,
        });
      }
    });

    // 3 ) Controller function สำหรับดูคำถามแต่ละข้อแบบระบุ ID
    app.get("/question/:questionId", async (req, res) => {
      try {
        const collection = db.collection("questions");
        const questionId = new ObjectId(req.params.questionId);

        const questionById = await collection.findOne({ _id: questionId });

        return res.json({
          data: questionById,
        });
      } catch (error) {
        return res.json({
          Message: `${error} 402 Can not connect the DB. Please try again later.`,
        });
      }
    });

    // 4 ) Controller function สำหรับแก้ไข อัปเดตตัวคำถาม (หัวข้อ คำอธิบาย หมวดหมู่)
    app.put("/question/:questionId", async (req, res) => {
      try {
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
      } catch (error) {
        return res.json({
          Message: `${error} 403 Please recheck your update text again.`,
        });
      }
    });

    // 5 ) Controller function สำหรับลบคำถามออกโดยระบุ ID
    app.delete("/question/:questionId", async (req, res) => {
      try {
        const collection = db.collection("questions");
        const questionId = new ObjectId(req.params.questionId);

        await collection.deleteOne({ _id: questionId });

        return res.json({
          Message: `question ${questionId} has been deleted successfully`,
        });
      } catch (error) {
        return res.json({
          Message: `${error} 501 Can not connect to the DB. Please try again later.`,
        });
      }
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
