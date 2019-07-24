# Email signature generator
Create a package of e-mail signature from database in svg file using template created in Json file.


additional usage

## Setup

## Config

## Instruction

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
    "jobTitleName",
    ...
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

- MIT license