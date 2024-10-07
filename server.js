const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const ejs=require("ejs");
const app=express();
const Stripe=require("stripe");
const stripe = Stripe('sk_test_51Q7JatLtjViHkk8NNqRlo1opcHhEmSqr2jTEGU0Vy3yeemNItaak7izJucmy7hN3UoJLqsYv771SEkteuu1Kza7z00n8gjlOeF'); // Secret key

app.use(express.static(path.join(__dirname,"Design")));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set('views',path.join(__dirname,"views"));

main(); // Call the main function to connect

async function main() {
    try {
        await mongoose.connect('mongodb+srv://singhrohit4546:5bRligG7JB6vwcdA@cluster0.xhc7sl6.mongodb.net/BookShow', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas:', err);
    }
}

const User=require("./databases/user.js");
const Movie=require("./databases/movie.js");
const Event=require("./databases/event.js");
const Sport=require("./databases/sport.js");

app.get("/",(req,res)=>{
   res.render("signin.ejs");
});
app.post("/register",async (req,res)=>{
    const {email,password,confirmPassword}=req.body;
    if(password===confirmPassword){
        const Newuser= new User({
            email:email,
            password:password,
            confirmPassword:confirmPassword,
           });
         await Newuser.save();
         console.log("New User added Successfully !")
         res.redirect("/front");
    }
    else{
        return res.render("signin.ejs", { alert: "Passwords don't match!" });
    }
   
  
});

app.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    if(await User.findOne({email:email,password:password})){
        console.log("Right email & password !");
        res.redirect("/front");
    }
    else{
        return res.render("signin.ejs", { alert: "Wrong Email or Password!" });
    }
   
})
app.get("/front",(req,res)=>{
    res.render("front.ejs");
});
app.get("/book",(req,res)=>{
    res.render("book.ejs");
});
app.get("/payment",(req,res)=>{
    res.render("payment.ejs");
});
// Route to create payment intent
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body; // Get amount from request body
        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        // Create a PaymentIntent with the specified amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in cents
            currency: 'usd', // Specify your currency
            payment_method_types: ['card'], // Accept card payments
        });

        // Send the client secret back to the frontend
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});

app.get('/success', (req, res) => {
    res.render('success.ejs', { paymentIntentId: req.query.paymentIntentId });
});

const port=8080;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})