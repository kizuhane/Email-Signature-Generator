const fs = require('fs');
const glob = require('glob');
const csvToJson = require('convert-csv-to-json');

//Default setting
let settingFileDefault = `{
    // File extension of output files
    "OutputFileExtension":"html",
    // Save All output in one file
    "SaveAllInOneFile":"true"
}`;

//change string to templete string
const fillTemplate = (templateString, templateVars) => {
  return new Function('return `' + templateString + '`;').call(templateVars);
};

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

async function getData() {
  const signatureTemplate = await getJSON(glob.sync('template/*.json').toString());
  const dataBase = await getCSV(glob.sync('database/*.csv').toString());
  const setting = await getSetting();
  const templateVars = signatureTemplate.PersonalData;
  const templateString = signatureTemplate.HTMLTemplate;
  /*
  Object.keys(dataBase[0]).forEach((element, index) => {
    console.log('-' + element);
    if (
      element ===
      templateVars.forEach(el => {
        console.log('---' + el);
        if (element == el) return;
      })
    )
      console.log('true');
    if (element != templateVars[index]) {
      console.log(
        `ERROR : Arguments form temple don't mach data base header \n  DataBase(${element}) != Template(${
          templateVars[index]
        })`
      );
      process.exit(1);
    }
  });
  */
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
    try {
      let content = [];
      files.dataBase.forEach((element, index) => {
        try {
          content +=
            `<!-- ${element.name} ${element.surname} - ${element.job_position}--> \n` +
            fillTemplate(files.templateString, files.dataBase[index]) +
            '\n\n';
          console.log(
            `${index}/${files.dataBase.length} : "${element.name} ${element.surname} - ${
              element.job_position
            }" | ✓`
          );
        } catch (error) {
          console.log(
            `${index}/${files.dataBase.length} : "${element.name} ${element.surname} - ${
              element.job_position
            }" | ✕`
          );
        }
      });
      console.log(content);
      fs.writeFile(`output/SavedTemplates.${files.settings.OutputFileExtension}`, content, err => {
        if (err) {
          throw err;
        }
        console.log(`SavedTemplates.${files.settings.OutputFileExtension} | ✓`);
      });
    } catch (error) {
      throw error;
    }
  }

  if (files.settings.SaveAllInOneFile == 'false') {
    files.dataBase.forEach((element, index) => {
      try {
        fs.writeFile(
          `output/${element.name} ${element.surname} - ${element.job_position}.${
            files.settings.OutputFileExtension
          }`,
          fillTemplate(files.templateString, files.dataBase[index]),
          err => {
            if (err) {
              console.log(
                `${index}/${files.dataBase.length} : "${element.name} ${element.surname} - ${
                  element.job_position
                }" | ✕`
              );
              throw err;
            }
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
}
