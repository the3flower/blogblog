const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  blogTitle: {
    type: String,
    required: true,
    maxLength: 100,
  },
  blogDescription: {
    type: String,
    required: true,
    maxLength: 300,
  },
  // Relationship with tagModel
  // blogTag: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'tagModel',
  //   required: true,
  // },
  // Relationship with userModel
  blogAuthor: {
    type: Schema.Types.ObjectId,
    ref: "userModel",
    required: true,
  },
  blogCreatedAt: {
    type: Date,
  },
  // From Text-editor (Tiptap)
  blogContent: {
    type: [],
    required: true,
  },
  // Publised and Non-published, default: False
  // draft = !published = False
  // not draft = published = True
  blogPublished: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("blogModel", BlogSchema);
