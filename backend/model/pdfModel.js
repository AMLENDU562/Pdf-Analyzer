const mongoose = require('mongoose');

const pdfSchema = mongoose.Schema({
   pdfName:{
    type:String,
    required:true,
    unique:true
   },
    pdfData:{
        type:String,
        required:true
    },
    prompt: [ 
        {
            user:{
                type:String,
                required:false
            },
          ai:{
            type:String,
            required:false
                
            
        }
    }
    ]

});

module.exports = mongoose.model("PdfModel", pdfSchema);
