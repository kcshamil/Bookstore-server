const books = require('../models/bookModel')
const stripe = require('stripe')(process.env.STRIPESECRET);


// add book 
exports.addBookController = async (req,res)=>{
    console.log("Inside addBookController");
    // get book details from req body,upload file from request files & seller mail from req payload
    const {title, author, pages, price, discountPrice, imageURL, abstract, language, publisher, isbn, category} = req.body
    const uploadImages = req.files.map(item=>item.filename)
     const sellerMail = req.payload
    console.log(title, author, pages, price, discountPrice, imageURL, abstract, language, publisher, isbn, category, uploadImages,sellerMail);
    try{
        //check book already exists
        const existingBook = await books.findOne({title,sellerMail})
        if(existingBook){
            res.status(401).json("uploaded book is already exists..request failed!!")
        }else{
            const newBook = await books.create({
                title, author, pages, price, discountPrice, imageURL, abstract, language, publisher, isbn, category, uploadImages,sellerMail
            })
            res.status(200).json(newBook)
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
}
    
// get home books
exports.getHomePageBooksController = async (req,res)=>{
    console.log("Inside getHomePageBooksController");
    // get login user mail from
    try{
        // get newly added 4 books from db
        const homeBooks = await books.find().sort({_id:-1}).limit(4)
        res.status(200).json(homeBooks)
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
}

// get all books - user : login user
exports.getUserAllBoookPageController = async (req,res)=>{
    console.log("Inside getUserAllBoookPageController");
    // get query from req
    const searchKey = req.query.search
    console.log(searchKey);
    
    // get login user mail from token
    const loginUserMail = req.payload
    try{
        // get all books from db except loggedin user
        const allBooks = await books.find({sellerMail:{$ne:loginUserMail},title:{$regex:searchKey,$options:'i'}})
        res.status(200).json(allBooks)
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }    
}


// get all user uploaded books
exports.getUserUploadBookProfilePageController = async (req,res)=>{
    console.log("Inside getUserUploadBookProfilePageController");
    // get login user mail from token
    const loginUserMail = req.payload
    try{
        // get all books from db except loggedin user
        const allUserBooks = await books.find({sellerMail:{$ne:loginUserMail}})
        res.status(200).json(allUserBooks)
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }    
}

// get all user bought books

exports.getUserBoughtBookProfilePageController = async (req,res)=>{
    console.log("Inside getUserBoughtBookProfilePageController");
    // get login user mail from token
    const loginUserMail = req.payload
    try{
        // get all books from db except loggedin user
        const allUserPurchaseBooks = await books.find({buyerMail:{$ne:loginUserMail}})
        res.status(200).json(allUserPurchaseBooks)
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }    
}

// view a book 
exports.viewBookController = async (req,res)=>{
    console.log("Inside viewBookController");
    // get id from req
    const {id} = req.params
    // get book details of given id fron db
    try{
        const bookDetails = await books.findById({_id:id})
        res.status(200).json(bookDetails)
    }catch(error){
        res.status(500).json(error)
    }
 
}
// get all books - admin : login user
exports.getAllBooksController = async (req,res)=>{
    console.log("Inside getAllBooksController");
    try{
        // get all books from db
        const allBooks = await books.find()
        res.status(200).json(allBooks)
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
}
// update book status - admin : login user
exports.updateBooksStatusController = async (req,res)=>{
    console.log("Inside updateBooksStatusController");
    // get _id of book
    const {id} = req.params
    try{
        // get book details from db
        const bookDetails = await books.findById({_id:id})
        bookDetails.status = "approved"
        // save changes to mongodb
        await bookDetails.save()
        res.status(200).json(bookDetails)
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
    
}

// delete user book - user
exports.deleteBookController = async (req,res)=>{
    console.log("Inside deleteBookController");
    // get _id of book
    const {id} = req.params
    try{
        // get book details from db
        const bookDetails = await books.findByIdAndDelete({_id:id})
        res.status(200).json(bookDetails)
    }catch(error){
        console.log(error);
        res.status(500).json(error)
    }
    
}

// payment
exports.bookPaymentController = async (req,res)=>{
    console.log("Inside bookPaymentController");
    const {title, author, pages, price, discountPrice, imageURL, abstract, language, publisher, isbn, category,_id,uploadImages,sellerMail} = req.body
    try{
        const updateBookDetails = await books.findByIdAndUpdate({_id},{title,author,pages,price,discountPrice,imageURL,abstract,language,publisher,isbn,category,uploadImages,sellerMail,status:'sold',buyerMail:email},{new:true})
    }catch(error){
        console.log(error);
        res.status(500).json(error)
        
    }
}
