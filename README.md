# Email signature generator
Create a package of e-mail signature from database in svg file using template created in Json file.


## Usage
Basic usage is creating e-mail signature, but the script can generate any type of repetitive text as long as possible is refer to headers from csv database in template string


## Instruction

### Installation
- instal latest [node.js](https://nodejs.org/)
- clone repository to own computer
- install node_modules

### Setup
**`DataBase`** in this folder place a database in csv format separate with **;** (semicolon)

**`Template file`** in this folder place a template in json file with

```json
{
  "PersonalData":["DataKey"],
  "Template":"Lorem Ipsum ${this.DataKey}"}
```

where:
- `PersonalData` Name for each variable key from Database
- `Template` is actual template what will be filled using data from database. Content is formated to [JavaScript Template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) so to put data you need call it using _${this.DataHeader}_


### Run Program
to run program in node console run `index.js`

## Config
In [settings.jsonc](/settings.jsonc) you can configure some options dictating the result of the script

#### OutputFileExtension
Specify extensions of output files

Valid options:
- any text based format

Default Option:
```json
"OutputFileExtension":"html"
```

#### SaveAllInOneFile
Specify if result of script will be save in one file or separate files

Valid options:
- `true` output will be saved in one file
- `false` output will be saved in separate files

Default Option:
```json
"SaveAllInOneFile":"false"
```

#### OutputFileName
File name of generated output

Valid options:
- Any valid file name

Default Option:
```json
"OutputFileName":"SavedTemplates"
```
> When saved in multiple files available is using javascript template string to create unique names like in template file: "${this.keyName}"

## Example
Headers form Databese need be the same as object.keys in json template.

### Database
| greeting | firstName | lastName  | jobTitleName            |
|----------|-----------|-----------|-------------------------|
| Hello    | Jo        | Lackham   | Teacher                 |
| Hi       | Sandor    | Heindrich | Legal Assistant         |
| Howdy    | Cameron   | Shotboult | GIS Technical Architect |
| Hello    | Karisa    | Duplain   | VP Quality Control      |


### Temple

```json
{
  "PersonalData":[
    "greeting",
    "firstName",
    "lastName",
    "jobTitleName"
  ],
  "Template":"${this.greeting},${this.firstName} ${this.lastName} - ${this.jobTitleName}"
}
```

| Expected output:                                   |
|----------------------------------------------------|
| Hello, Jo Lackham - Teacher                        |
| Hi, Sandor Heindrich - Legal Assistant             |
| Howdy, Cameron Shotboult - GIS Technical Architect |
| Hello, Karisa Duplain - VP Quality Control         |

## License
- [MIT license.](/LICENSE)