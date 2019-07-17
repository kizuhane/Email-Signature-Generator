const fs = require('fs');
const glob = require('glob');
const csvToJson = require('convert-csv-to-json');

//change string to templete string
const fillTemplate = (templateString, templateVars) => {
  return new Function('return `' + templateString + '`;').call(templateVars);
};

function getJSON(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) return console.error(err);
      resolve(JSON.parse(data));
    });
  });
}

function getCSV(path) {
  return new Promise((resolve, reject) => {
    let data = csvToJson.formatValueByType().getJsonFromCsv(path);
    resolve(data);
  });
}

async function getData() {
  const signatureTemplate = await getJSON(glob.sync('template/*.json').toString());
  const dataBase = await getCSV(glob.sync('database/*.csv').toString());
  const templateVars = signatureTemplate.PersonalData;
  const templateString = signatureTemplate.HTMLTemplate;
  return { templateString: templateString, templateVars: templateVars, dataBase: dataBase };
}

async function GenerateSignature() {
  const files = await getData();
  files.dataBase.forEach((element, index) => {
    try {
      fs.writeFile(
        `output/${element.name} ${element.surname} - ${element.job_position}.html`,
        fillTemplate(files.templateString, files.dataBase[index]),
        err => {
          if (err) throw err;
          console.log(
            `${index}/${files.dataBase.length} : "${element.name} ${element.surname} - ${
              element.job_position
            }" | ✓`
          );
        }
      );
    } catch (error) {
      console.log(
        `${index}/${files.dataBase.length} : "${element.name} ${element.surname} - ${
          element.job_position
        }" | ✕`
      );
      throw error;
    }
  });
}
GenerateSignature();
