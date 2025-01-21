const express=require('express')
const router=express.Router()
const {getPdfInformation,getAnswers,postPdf,updatePromptData,deletePdf,postDatabase,downloadPdf}=require('../controllers/controllers')


router.post('/getPdfInformation',getPdfInformation);
router.post('/getAnswers',getAnswers);
router.get('/downloadPdf',downloadPdf);


router.post('/postPdf',postPdf);
router.post('/postDatabase',postDatabase);

router.put('/putDatabaseData',updatePromptData);


router.delete('/deletePdf',deletePdf);








module.exports=router;