const johnPackage = require('john-package');
const { unlink } = require('fs');


// function to run OCR
exports.performOcr = async (filepath, tablesDict, formsDict) => {
    var ocrData 
    try {
        ocrData = await johnPackage.getTextractAnalysis(filepath);
    } catch (err) {
        console.error('error performing ocr');
        console.error(err)
        return ({})
    }

    const formsData = johnPackage.extractForms(ocrData, formsDict);
    const tablesData = johnPackage.extractTables(ocrData, tablesDict);
    console.log('utils forms and tables')
    console.log(formsData);
    console.log(tablesData);
    console.log('utils forms and tables')
    
    res = {'Company Name':ocrData['Company Name'] , ...formsData, ...tablesData}
    return res
}

// function to run OCR for payment
exports.performOcrPayment = async (filepath, tablesDict) => {
    var ocrDataPayment 
    try {
        ocrDataPayment = await johnPackage.getTextractAnalysis(filepath);
    } catch (err) {
        console.error('error performing ocr payment');
        console.error(err)
        return ({})
    }

    const tablesData = johnPackage.extractForms(ocrDataPayment, tablesDict);
    console.log('utils tables')
    console.log(tablesData);
    console.log('utils tables')
    
    res = {...tablesData}
    return res
}


/*
exports.textractData = async function(req, res) { // function for textractData POST endpoint
    console.log('start of console');
    file = await req.file;
    var ocrData;

    // do file operations here
    try{
        // perform ocr AND extract the tables and forms; look at utils.js for more info
        ocrData = await utils.performOcr(file.path, tablesDict, formsDict);

    } catch (err) {
        console.error('Error performing OCR on file ' + file.originalname, err);
        res.status(500).json({message: 'Error performing OCR on file ' + file.originalname})
    }

    // delete the file after operations
    unlink(file.path, err => {console.log('file deleted'); if (err) {console.log(err)} })
    console.log('end of console')
    
    // return the data to the front end
    res.json(ocrData)
    // res.json({message:'file uploaded successfully at '})
}
*/
/*
exports.textractFunction = function(formsDict, tablesDict) {
    // in the 3 documents, the only difference is the dictionaries 
    // used to run the textract funcitons, so what we can do here is to 
    // make a function that takes in 2 dictionaries, then returns an 
    // async (req, res) function which does all the ocr stuff based on the 2 dictionaries
    // async function performOcr (req, res, next) {
    async function performOcr (req, next, res) { // try another signature
        file = await req.file;
        var ocrData;
        try { // do the textract function here
            ocrData = await johnPackage.getTextractAnalysis(file.path);
        } catch (err) {
            console.error('Error in doing ocr on file ' + file.originalname, err);
            return res.status(500).json(
                {message: 'Error in doing ocr on file ' + file.originalname}
            );
        }
        const formsData = johnPackage.extractForms(ocrData, formsDict);
        const tablesData = johnPackage.extractTables(ocrData, tablesDict);
        
        res = {'Company Name':ocrData['Company Name'] , ...formsData, ...tablesData}
        // delete the file
        unlink(file.path, err => {console.log('file deleted'); if (err) {console.log(err)} });

        return res.status(200).json(ocrData);

    }

    return performOcr
}*/
