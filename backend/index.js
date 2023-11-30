import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import { Post } from "./models/postSchema.js";
import { Comment } from "./models/commentSchema.js";

const app = express();

app.use(express.json());

// middleware for hadling CORS errors

app.use(cors());

app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("Welcome to my home");
});

app.post("/api/posts", async (req, res) => {
  try {
    if (!req.body.title || !req.body.content || !req.body.author) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const newPost = {
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      tags: req.body.tags || "",
      comments: req.body.comments,
    };

    const post = await Post.create(newPost);

    return res.status(201).send(post);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();

    return res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

app.get("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    return res.status(200).send(post);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

app.put("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Post.findByIdAndUpdate(id, req.body);

    if (!result) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).send({ message: "Post updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

app.get("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Post.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

app.post("/api/posts/:postId/comments", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = new Comment({
      content: req.body.content,
      postId: req.body.postId,
      author: req.body.author,
    });

    const comment = await Comment.create(newComment);

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/posts/:postId/comments", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.text = req.body.text; // Update other fields as needed
    await post.save();

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/posts/:postId/comments/:commentId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.id(commentId).remove();
    await post.save();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
