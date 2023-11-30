import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    postId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
