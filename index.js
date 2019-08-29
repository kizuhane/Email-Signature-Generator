const fs = require('fs');
const glob = require('glob');
const csvToJson = require('convert-csv-to-json');

//Default setting
let settingFileDefault = `{
    "OutputFileExtension":"html",
    "SaveAllInOneFile":"false",
    "OutputFileName":"SavedTemplates"
}`;

//change string to template string
const fillTemplate = (templateString, templateVars) => {
  return new Function('return `' + templateString + '`;').call(templateVars);
};
//change format from 1,2..15 to 01,02..15
function numbering(number, padLength, z) {
  z = z || '0';
  number = number + 1 + '';
  padLength = padLength.toString().length;
  return number.length >= padLength
    ? number
    : new Array(padLength - number.length + 1).join(z) + number;
}

//call main function
GenerateSignature();

function getSetting() {
  return new Promise((resolve, reject) => {
    fs.readFile('settings.jsonc', function(err, data) {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log("ERROR : can't find setting file");
          fs.writeFile('settings.jsonc', settingFileDefault, err => {
            if (err) throw err;
          });
          return console.log(
            'Created Default Setting File, run program again with default setting'
          );
        } else {
          return console.error(err);
        }
      }
      resolve(
        JSON.parse(
          data.toString().replace(/(\/\*[\s\S]*?\*\/)|(([^:"\S]|^|(\S\"[^\S]?))\/\/.*$)/gm, '')
        )
      );
    });
  });
}

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

function CheckElement(object, array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < object.length; j++) {
      if (object[j] === array[i]) {
        break;
      }
      if (j + 1 == object.length) {
        console.log(
          `ERROR : Arguments form temple don't mach data base header \n  Can't find Template(${array[i]})`
        );
        process.exit(1);
      }
    }
  }
}

async function getData() {
  const signatureTemplate = await getJSON(glob.sync('template/*.json').toString());
  const dataBase = await getCSV(glob.sync('database/*.csv').toString());
  const setting = await getSetting();
  const templateVars = signatureTemplate.PersonalData;
  const templateString = signatureTemplate.Template;

  CheckElement(Object.keys(dataBase[0]), templateVars);

  return {
    templateString: templateString,
    templateVars: templateVars,
    dataBase: dataBase,
    settings: setting
  };
}

async function GenerateSignature() {
  const files = await getData();

  if (files.settings.SaveAllInOneFile == 'true') {
    //save all template in one file
    try {
      let streamFile = fs.createWriteStream(
        `output/${files.settings.OutputFileName}.${files.settings.OutputFileExtension}`
      );
      files.dataBase.forEach((element, index) => {
        try {
          streamFile.write(fillTemplate(files.templateString, files.dataBase[index]) + '\n\n');
          console.log(
            `${numbering(index, files.dataBase.length)}/${files.dataBase.length} : "${fillTemplate(
              files.settings.OutputFileName,
              files.dataBase[index]
            )}" | ✓`
          );
        } catch (error) {
          console.log(
            `${numbering(index, files.dataBase.length)}/${files.dataBase.length} : "${fillTemplate(
              files.settings.OutputFileName,
              files.dataBase[index]
            )}" | ✕`
          );
        }
      });
    } catch (error) {
      throw error;
    }
  }

  if (files.settings.SaveAllInOneFile == 'false') {
    //save file in separate files
    files.dataBase.forEach((element, index) => {
      try {
        fs.writeFile(
          `output/${numbering(index, files.dataBase.length)}-${fillTemplate(
            files.settings.OutputFileName,
            files.dataBase[index]
          )}.${files.settings.OutputFileExtension}`,
          fillTemplate(files.templateString, files.dataBase[index]),
          err => {
            if (err) {
              console.log(
                `${numbering(index, files.dataBase.length)}/${
                  files.dataBase.length
                } : "${fillTemplate(files.settings.OutputFileName, files.dataBase[index])}" | ✕`
              );
              throw err;
            }
            console.log(
              `${numbering(index, files.dataBase.length)}/${
                files.dataBase.length
              } : "${fillTemplate(files.settings.OutputFileName, files.dataBase[index])}" | ✓`
            );
          }
        );
      } catch (error) {
        console.log(
          `${numbering(index, files.dataBase.length)}/${files.dataBase.length} : "${fillTemplate(
            files.settings.OutputFileName,
            files.dataBase[index]
          )}" | ✕`
        );
        throw error;
      }
    });
  }
}
