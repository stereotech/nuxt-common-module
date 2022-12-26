export class Helpers {
  constructor() {
    this._firstLetters = {
      "\u0430": "a",
      "\u0431": "b",
      "\u0432": "v",
      "\u0434": "d",
      "\u0437": "z",
      "\u0439": "y",
      "\u043A": "k",
      "\u043B": "l",
      "\u043C": "m",
      "\u043D": "n",
      "\u043E": "o",
      "\u043F": "p",
      "\u0440": "r",
      "\u0441": "s",
      "\u0442": "t",
      "\u0443": "u",
      "\u0444": "f",
      "\u044C": "",
      "\u0433": "g",
      "\u0438": "i",
      "\u044A": "",
      "\u044B": "i",
      "\u044D": "e",
      "\u0435": "ye",
      "\u0451": "yo",
      "\u0436": "zh",
      "\u0445": "kh",
      "\u0446": "ts",
      "\u0447": "ch",
      "\u0448": "sh",
      "\u0449": "shch",
      "\u044E": "yu",
      "\u044F": "ya"
    };
    this._nonFirstLetters = Object.assign(
      {},
      this._firstLetters,
      {
        "\u0439": "i",
        "\u0435": "e"
      }
    );
  }
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  findDirectory(folder, dirArray) {
    if (folder !== void 0 && folder !== null && dirArray.length) {
      const parent = folder.find((element) => element.isDirectory && element.filename === dirArray[0]);
      if (parent) {
        dirArray.shift();
        if (parent.childrens && dirArray.length)
          return this.findDirectory(parent.childrens, dirArray);
        else if (parent.childrens)
          return parent.childrens;
      }
      return folder;
    }
    return null;
  }
  caseInsensitiveSort(values, orderType) {
    return values.sort((a, b) => {
      const stringA = a[orderType].toLowerCase();
      const stringB = b[orderType].toLowerCase();
      if (stringA < stringB)
        return -1;
      if (stringA > stringB)
        return 1;
      return 0;
    });
  }
  convertPanelnameToIcon(name) {
    switch (name) {
      case "webcam":
        return "mdi-webcam";
      case "zoffset":
        return "mdi-arrow-collapse-vertical";
      case "control":
        return "mdi-gamepad";
      case "macros":
        return "mdi-code-tags";
      case "printsettings":
        return "mdi-printer-3d";
      case "miscellaneous":
        return "mdi-dip-switch";
      case "tools":
        return "mdi-thermometer-lines";
      case "miniconsole":
        return "mdi-console-line";
      default:
        return "mdi-information";
    }
  }
  camelize(str) {
    return str.replace(/_/g, " ").replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, "");
  }
  formatConsoleMessage(message) {
    message = message.replace(/!! /g, "");
    message = message.replace(/\/\/ /g, "");
    message = message.replace("\n// ", "<br>");
    message = message.replace(/\r\n|\r|\n/g, "<br>");
    return message;
  }
  convertName(name) {
    let output = "";
    name = name.replace(/_/g, " ");
    name.split(" ").forEach((split) => {
      output += " " + split.charAt(0).toUpperCase() + split.slice(1);
    });
    output = output.slice(1);
    return output;
  }
  formatFilesize(fileSizeInBytes) {
    let i = -1;
    const byteUnits = [" kB", " MB", " GB", " TB", " PB", " EB", " ZB", " YB"];
    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);
    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  }
  formatDate(date, offset = 0) {
    date = date + (offset - 2) * 36e5 - 36e5;
    const tmp2 = new Date(date);
    return tmp2.toLocaleString().replace(",", "");
  }
  formatFrequency(frequency) {
    let i = -1;
    const units = [" kHz", " MHz", " GHz"];
    do {
      frequency = frequency / 1e3;
      i++;
    } while (frequency > 1e3);
    return Math.max(frequency, 0.1).toFixed() + units[i];
  }
  sortFiles(items, sortBy, sortDesc) {
    const sortBySingle = sortBy.length ? sortBy[0] : "filename";
    const sortDescSingle = sortDesc[0];
    if (items !== null) {
      items.sort(function(a, b) {
        if (a[sortBySingle] === b[sortBySingle])
          return 0;
        if (a[sortBySingle] === null || a[sortBySingle] === void 0)
          return -1;
        if (b[sortBySingle] === null || b[sortBySingle] === void 0)
          return 1;
        if (a[sortBySingle].constructor === String && b[sortBySingle].constructor === String) {
          return a[sortBySingle].localeCompare(b[sortBySingle], void 0, { sensivity: "base" });
        }
        if (a[sortBySingle] instanceof Array && b[sortBySingle] instanceof Array) {
          const reducedA = a[sortBySingle].length ? a.filament.reduce((a2, b2) => a2 + b2) : 0;
          const reducedB = b[sortBySingle].length ? b.filament.reduce((a2, b2) => a2 + b2) : 0;
          return reducedA - reducedB;
        }
        return a[sortBySingle] - b[sortBySingle];
      });
      if (sortDescSingle)
        items.reverse();
      items.sort((a, b) => a.isDirectory === b.isDirectory ? 0 : a.isDirectory ? -1 : 1);
    }
    return items || [];
  }
  strLongestEqual(a, b) {
    const l = Math.min(a.length, b.length);
    let i = 0;
    while (i < l && (a.charCodeAt(i) ^ b.charCodeAt(i)) === 0) {
      i += 1;
    }
    return a.substr(0, i);
  }
  reverseString(str) {
    return str === "" ? "" : this.reverseString(str.substr(1)) + str.charAt(0);
  }
  formatTime(date, offset = 0) {
    let numDate = date.getTime() + (offset * 36e5 - 36e5);
    const newDate = new Date(numDate);
    let hours = newDate.getHours();
    if (hours < 10)
      hours = "0" + hours.toString();
    let minutes = newDate.getMinutes();
    if (minutes < 10)
      minutes = "0" + minutes.toString();
    let seconds = newDate.getSeconds();
    if (seconds < 10)
      seconds = "0" + seconds.toString();
    return hours + ":" + minutes + ":" + seconds;
  }
  cyrillicTransform(input, spaceReplacement) {
    if (!input) {
      return "";
    }
    const normalizedInput = input.normalize();
    let newStr = "";
    let isWordBoundary = false;
    for (let i = 0; i < normalizedInput.length; i++) {
      const isUpperCaseOrWhatever = normalizedInput[i] === normalizedInput[i].toUpperCase();
      let strLowerCase = normalizedInput[i];
      if (strLowerCase === " ") {
        newStr += spaceReplacement ? spaceReplacement : " ";
        isWordBoundary = true;
        continue;
      }
      let newLetter;
      if (i === 0 || isWordBoundary) {
        newLetter = this._firstLetters[strLowerCase];
        isWordBoundary = false;
      } else {
        newLetter = this._nonFirstLetters[strLowerCase];
      }
      if ("undefined" === typeof newLetter) {
        newStr += isUpperCaseOrWhatever ? strLowerCase.toUpperCase() : strLowerCase;
      } else if (isUpperCaseOrWhatever) {
        newLetter.length > 1 ? newStr += newLetter[0].toUpperCase() + newLetter.slice(1) : newStr += newLetter.toUpperCase();
      } else {
        newStr += newLetter;
      }
    }
    return newStr;
  }
  formatPrintTime(totalSeconds, days = false) {
    if (totalSeconds) {
      let output = "";
      if (days) {
        const days2 = Math.floor(totalSeconds / (3600 * 24));
        if (days2) {
          totalSeconds %= 3600 * 24;
          output += days2 + "d";
        }
      }
      const hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      if (hours)
        output += " " + hours + "h";
      const minutes = Math.floor(totalSeconds / 60);
      if (minutes)
        output += " " + minutes + "m";
      const seconds = totalSeconds % 60;
      if (seconds)
        output += " " + seconds.toFixed(0) + "s";
      return output;
    }
    return "--";
  }
  formatLength(value) {
    if (value > 1e3)
      return (value / 1e3).toFixed(2) + " m";
    return value.toFixed(2) + " mm";
  }
}
