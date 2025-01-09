process.env['NODE_DEV'] = 'TEST';

const {  getTextractAnalysis,  extractForms,   extractTables,  
    getTableResults, getFormResults,
    fixTableHeaders,  fixFormHeaders, getKeyValueMap,  getKeyValueRelationship 
} = require('./index.js');

const { readFileSync, writeFileSync } = require ("fs");

// const a = require('./index.js')

var inp; var out; // variables where we will store the intended input and output

const tableDict = { // this is a sample dict to be used for 
    headers: ['Invoice ID', 'Issued Date', 'Due Date', 'Amount'],
    mapping: {
        'Invoice ID':'Invoice ID', 'Issued Date':'Issued Date',
    'Ref No':'Invoice ID', 'Ref And Particulars':'Invoice ID', 'Tax Invoice':'Invoice ID', 
    'Document No':'Invoice ID', 'Doc No':'Invoice ID', 'References':'Invoice ID', 'No':'Invoice ID', 
    'Invoice No CN NO':'Invoice ID', 'Invoice no':'Invoice ID', 'REF':'Invoice ID', 
    'Inv No':'Invoice ID', 'DOCUMENT NO':'Invoice ID', 'DOCUMENT NUMBER':'Invoice ID', 
    'Our Ref':'Invoice ID', 'Document No':'Invoice ID', 'No':'Invoice ID', 'Reference':'Invoice ID',
    'Balance':'Amount', 'Accumulated Balance':'Amount', 'Balance Amount':'Amount', 
    'Document Amount':'Amount', 'Amount':'Amount', 'BALANCE':'Amount', 
    'Accumulated balanceFunctional currency':'Amount', 
    'Accum Balance':'Amount', 'OUTSTANDING BALANCE':'Amount',    
    'Date':'Issued Date', 'DATE':'Issued Date', 'TranDate':'Issued Date', 'Posting Date':'Issued Date', 
    '单据日期':'Issued Date', 'Invoice Date':'Issued Date',

        'Due Date':'Due Date'
   }
}

const formDict = {
    headers:['Company Registration Number', 'GST Registration Number', 'Date'],
    mapping:{
        'Company Registration Number':'Company Registration Number',
        'Company Reg No':'Company Registration Number',

        'GST Registration Number':'GST Registration Number',
        'GST Reg No':'GST Registration Number', 
        'GST Registration No':'GST Registration Number',
        'GST No':'GST Registration Number',

        'Date':'Date',
        '日付':'Date'

    }

};

// test test
test("Sanity check", () => {
    expect(true).toBe(true);
});
/// Test the textract function - make sure it works
test ('make sure the textract function works', async () => {
    res = await getTextractAnalysis('./censored.jpg');
    expect(Boolean(res && res.Blocks)).toBe(true);
}, 
15000 // add timeout of 15s
);
/// Test the textract function Again - make sure it works with raw bytes
test ('make sure the textract function works', async () => {
    fileContent = readFileSync('./censored.jpg');
    res = await getTextractAnalysis([fileContent, './censored.jpg']);
    expect(Boolean(res && res.Blocks)).toBe(true);
}, 
15000 // add timeout of 15s
);
/// Test the Form getting functions
console.log('TEST FORM FIXHEADERS')
// contains all of the headers

test ('all form headers present', () => {
    inp = {
    'Company Registration Number':'aaa', 'GST Registration Number':'bbb', 'Date':'ccc'
    };
    out = {
    'Company Registration Number':'aaa', 'GST Registration Number':'bbb', 'Date':'ccc'
    };
    res = fixFormHeaders(inp, formDict);
    expect(res).toEqual(out);
});
// contains none of the headers
test('no form headers present', () => {
    inp = {
        'hi lol':'a', 'loln':'b'
    };
    out = {
    'Company Registration Number':'', 'GST Registration Number':'', 'Date':''
    };
    res = fixFormHeaders(inp, formDict);
    expect(res).toEqual(out);
});

// input is an empty dictionary
test('input is empty', () => {
    inp = {};
    out = {
    'Company Registration Number':'', 'GST Registration Number':'', 'Date':''
    };
    res = fixFormHeaders(inp, formDict);
    expect(res).toEqual(out);
});
// input is not a dictionary
test('input is not a dictionary', () => {
    inp = 'hi';
    out = {
    'Company Registration Number':'', 'GST Registration Number':'', 'Date':''
    };
    res = fixFormHeaders(inp, formDict);
    expect(res).toEqual(out);
});
// contains some of the headers
test('input contains some of the headers', () => {
    inp = {
    'company reg no':'aaa', 'date':'ccc'
    }
    out = {
    'Company Registration Number':'aaa', 'GST Registration Number':'', 'Date':'ccc'
    };
    res = fixFormHeaders(inp, formDict);
    expect(res).toEqual(out);
});
// header names are misspelled
test('header names are misspelled', () => {
    inp = {
    'Com Reg n':'aaa', 'GS TRegistration Number':'bbb', 'Dae':'ccc'
    };
    out = {
    'Company Registration Number':'aaa', 'GST Registration Number':'bbb', 'Date':'ccc'
    };
    res = fixFormHeaders(inp, formDict);
    expect(res).toEqual(out);
});

// header names are misspelled (again)
test('header names are misspelled (again)', () => {
    inp = {
    'Com Reg n':'aaa', 'GS TRegistration o':'bbb', '日':'ccc'
    };

    out = {
    'Company Registration Number':'aaa', 'GST Registration Number':'bbb', 'Date':'ccc'
    }
    res = fixFormHeaders(inp, formDict);
    expect(res).toEqual(out);
});

/// Test the Table getting functions
// contains all fields, same length
test('Table contains all fields, and same length', () => {
    inp = {
        'Invoice ID':[1, 2], 
        'Issued Date':[3,4], 
        'Due Date':[5,6], 
        'Amount':[7,8]
    }
    out = {
        'Invoice ID':[1, 2], 
        'Issued Date':[3,4], 
        'Due Date':[5,6], 
        'Amount':[7,8]
    }
    res = fixTableHeaders(inp, tableDict);
    expect(res).toEqual(out);
});
// contains all fields, same length (again)
test('Table contains all fields, and same length (again)', () => {
    inp = {
        'our ref':[1, 2], 
        '单据日期':[3,4], 
        'Due Date':[5,6], 
        'Accumulated Balance':[7,8]
    }
    out = {
        'Invoice ID':[1, 2], 
        'Issued Date':[3,4], 
        'Due Date':[5,6], 
        'Amount':[7,8]
    }
    res = fixTableHeaders(inp, tableDict);
    expect(res).toEqual(out);
});

// contains none of the fields
test('Table contains none of the fields', () => {
    inp = {
        'stnaretnoeisrantseine':[1, 2], 
        'vtneraiovernae':[3,4], 
        'rstnareinstei':[5,6], 
        'vrnseianrsein':[7,8],
    }
    out = {
        'Invoice ID':[], 
        'Issued Date':[], 
        'Due Date':[], 
        'Amount':[]
    }
    res = fixTableHeaders(inp, tableDict);
    expect(res).toEqual(out);
});

// Input is empty
test('Input is an empty object', () => {
    inp = {
    }
    out = {
        'Invoice ID':[], 
        'Issued Date':[], 
        'Due Date':[], 
        'Amount':[]
    }
    res = fixTableHeaders(inp, tableDict);
    expect(res).toEqual(out);
});

// Input is not an object
test('Input is not an object', () => {
    inp = 'lol';
    out = {
        'Invoice ID':[], 
        'Issued Date':[], 
        'Due Date':[], 
        'Amount':[]
    };
    res = fixTableHeaders(inp, tableDict);
    expect(res).toEqual(out);
});

// contains some fields, and mixed lengths
test('Table contains some of the fields, and has mixed lengths', () => {
    inp = {
        'Invoice ID':[1, 2, 1, 1, 1, 1], 
        'Issued Date':[], 
        'Due Date':[5], 
    }
    out = {
        'Invoice ID':[1, 2, 1, 1, 1, 1], 
        'Issued Date':['','','','','',''], 
        'Due Date':[5,'','','','',''],  
        'Amount':['','','','','','']
    }
    res = fixTableHeaders(inp, tableDict);
    expect(res).toEqual(out);
});


// contains misspelled field names
test('Input contains misspelled field names', () => {
    inp = {
        'Inice ID':[1, 2], 
        'Isud ate':[3,4], 
        'Du ate':[5,6], 
        'Amon':[7,8]
    }
    out = {
        'Invoice ID':[1, 2], 
        'Issued Date':[3,4], 
        'Due Date':[5,6], 
        'Amount':[7,8]
    }
    res = fixTableHeaders(inp, tableDict);
    expect(res).toEqual(out);
});
// contains misspelled field names (again)
test('Input contains misspelled field names (again)', () => {
    inp = {
        'Invo':[1, 2], 
        '单日':[3,4], 
        'Duate':[5,6], 
        'balan':[7,8]
    }
    out = {
        'Invoice ID':[1, 2], 
        'Issued Date':[3,4], 
        'Due Date':[5,6], 
        'Amount':[7,8]
    }
    res = fixTableHeaders(inp, tableDict);
    expect(res).toEqual(out);
});

