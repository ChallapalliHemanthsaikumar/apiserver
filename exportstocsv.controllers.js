
const he = require( 'export-to-csv-file');
const fs = require('fs');
 
var data = [
  {
    name: 'Test 1',
    age: 13,
    average: 8.2,
    approved: true,
    description: "using 'Content here, content here' "
  },
  {
    name: 'Test 2',
    age: 11,
    average: 8.2,
    approved: true,
    description: "using 'Content here, content here' "
  },
  {
    name: 'Test 4',
    age: 10,
    average: 8.2,
    approved: true,
    description: "using 'Content here, content here' "
  },
];
 
  const options = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    showTitle: true,
    title: 'My Awesome CSV',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    filename: 'generated',
     // Won't work with useKeysAsHeaders present!
  };
 
const csvExporter = new he.ExportToCsv(options); 
 






// data sholud be in json fomrat 




  async function csvgenerator() {
   try{
 
   
   

 
    const csvData = csvExporter.generateCsv(data, true)
// fs.writeFileSync('data.csv',csvData)
  }catch(err){
      console.log(err)
  }
}

 

exports.csv = () => {

    csvgenerator()


}
