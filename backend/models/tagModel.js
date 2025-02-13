const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TagSchema = new Schema({
    // Name of each blog tag(blog category)
    // ex. Technology, Life-style, Travel
    tagName: {
        type: String,
        required: true,
        maxLength: 20,
    },
    // Color of tag - let admin select color for each tag
    tagColor: {
        type: String,
        required: true,       
    },
});

module.exports = mongoose.model('tagModel', TagSchema);