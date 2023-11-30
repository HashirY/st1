import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    tags: {
      type: String,
    },

    comments: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Cat", postSchema);
