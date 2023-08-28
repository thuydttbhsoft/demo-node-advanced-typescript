require('dotenv').config();
import express from 'express';
import config from 'config';
import connectDB from './utils/connectDb';
import router from './routes/index.route';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', router);
// app.get("/", (req, res) => {
//   res.send("Let's build a CRUD API!");
// });
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  // ? call the connectDB function here
  connectDB();
});