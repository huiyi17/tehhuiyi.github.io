const mongoose = require('mongoose')
const url = 'mongodb+srv://reenee1601:QNbeHPQLj8pwP7UC@cluster0.i4ee9cb.mongodb.net/project_data?retryWrites=true&w=majority';
//const dbName = 'project_data'; // Replace with your desired database name

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to the database'))
    .catch((err) => console.error('Error connecting to the database:', err));


module.exports = mongoose;