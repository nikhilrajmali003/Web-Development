const express = require("express"); // Importing the Express module to create an Express application.
const app = express(); // Creating an instance of an Express application.

const userModel = require("./usermodel"); // Importing the user model (assumed to be a Mongoose model for interacting with MongoDB).

// Route to handle GET requests to the root URL ('/').
app.get("/", (req, res) => {
  res.send("Hi"); // Sends a simple "hy" response when the root URL is accessed.
});

// Route to handle GET requests to the '/create' URL for creating a new user.
app.get("/create", async (req, res) => {
  // Using async/await here because MongoDB operations are asynchronous.
  // We use `await` to ensure that the code waits for the `userModel.create()` function to complete before moving on.

  let createduser = await userModel.create({
    name: "karan", // Setting the 'name' field to "Nikhil".
    email: "karan@gmail.com", // Setting the 'email' field to the provided email.
    username: "karan", // Setting the 'username' field to "nikhil03".
  });

  // Sending the created user object back in the response.
  res.send(createduser);

  // console.log("HI");  // This will print "HI" to the console after the user is created.

  // Explanation: If we did not use async/await, "HI" would be logged to the console before the `userModel.create()` operation completes.
  // In JavaScript, async operations (like database interactions) don't block the execution flow, so without `await`, the code would continue running, and "HI" would print first.
  // Using `await` ensures that the create operation finishes before moving forward.

  // NOTE: All MongoDB-related operations like `create`, `read`, `update`, and `delete` are asynchronous by default.
  // So, using `await` is recommended to handle these operations. To use `await`, the surrounding function must be marked as `async`.
});
app.get("/read", async (req, res) => {
  let user = await userModel.find();
  // let user = await userModel.find({username:'karan'}); //NOTE :- this 'find()' function is used for find how many user are thre

  res.send(user);
});

app.get("/update", async (req, res) => {
  let updateduser = await userModel.findOneAndUpdate(
    { username: "nikhil03" },
    { name: "Nikhil Raj" },
    { new: true }
  );
  res.send(updateduser);
});

app.get("/delete", async (req, res) => {
  let users = await userModel.findOneAndDelete({ username: "karan" });
  res.send(users);
});
// Starting the server and making it listen for incoming requests on port 3000.
app.listen(3000, () => {
  // Logs a message to the console when the server is successfully running and listening on port 3000.
  console.log("Server running on port 3000");
});
