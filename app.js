const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { response } = require("express");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//MailChimp
const listId = "03f80446a7";
mailchimp.setConfig({
  apiKey: process.env.MC_API_KEY,
  server: process.env.MC_SERVER,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

let add = async (firstName, lastName, email) => {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  });
};

app.post("/", (req, res) => {
  let firstName = req.body.firstname;
  let lastName = req.body.lastname;
  let email = req.body.email;

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  add(
    subscribingUser.firstName,
    subscribingUser.lastName,
    subscribingUser.email
  )
    .then(() => {
        res.sendFile(__dirname + "/success.html");
    })
    .catch(() => {
        res.sendFile(__dirname + "/failure.html");
    });
});

app.post("/failure", (req, res) => {
    res.redirect("/")
})

app.post("/success", (req, res) => {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000.");
});
