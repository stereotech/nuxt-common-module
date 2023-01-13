import { FileStateFile, IHelpers } from '../../types/helpers';

export class Helpers implements IHelpers {

  capitalize (str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  findDirectory (folder: FileStateFile[], dirArray: string[]): FileStateFile[] | null {
    if (folder !== undefined && folder !== null && dirArray.length) {

      const parent = folder.find((element: FileStateFile) => (element.isDirectory && element.filename === dirArray[0]));
      if (parent) {
        dirArray.shift();
        if (parent.childrens && dirArray.length) return this.findDirectory(parent.childrens, dirArray)
        else if (parent.childrens) return parent.childrens
      }
      return folder
    }
    return null
  }

  caseInsensitiveSort (values: any[], orderType: string): any[] {
    console.log('---!--- caseInsensitiveSort from common-module');

    return values.sort((a, b) => {
      const stringA = a[orderType].toLowerCase()
      const stringB = b[orderType].toLowerCase()

      if (stringA < stringB) return -1
      if (stringA > stringB) return 1

      return 0
    })
  }

  convertPanelnameToIcon (name: string): string {
    switch (name) {
      case 'webcam': return 'mdi-webcam'
      case 'zoffset': return 'mdi-arrow-collapse-vertical'
      case 'control': return 'mdi-gamepad'
      case 'macros': return 'mdi-code-tags'
      case 'printsettings': return 'mdi-printer-3d'
      case 'miscellaneous': return 'mdi-dip-switch'
      case 'tools': return 'mdi-thermometer-lines'
      case 'miniconsole': return 'mdi-console-line'

      default: return 'mdi-information'
    }
  }

  camelize (str: string): string {
    return str.replace(/_/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  formatConsoleMessage (message: string): string {
    message = message.replace(/!! /g, '')
    message = message.replace(/\/\/ /g, '')
    message = message.replace('\n// ', '<br>')
    message = message.replace(/\r\n|\r|\n/g, '<br>')
    //message = message.replaceAll('<br />', '<br>')
    //return message.split('<br>');
    return message
  }

  convertName (name: string): string {
    let output = ""
    name = name.replace(/_/g, ' ')
    name.split(" ").forEach(split => {
      output += " " + split.charAt(0).toUpperCase() + split.slice(1)
    })
    output = output.slice(1)

    return output
  }

  formatFilesize (fileSizeInBytes: number): string {
    let i = -1
    const byteUnits = [' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB']
    do {
      fileSizeInBytes = fileSizeInBytes / 1024
      i++
    } while (fileSizeInBytes > 1024)

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i]
  }

  formatDate (date: number, offset: number = 0): string {
    date = date + (offset - 2) * 3600000 - 3600000
    const tmp2 = new Date(date)
    return tmp2.toLocaleString().replace(',', '')
  }

  formatFrequency (frequency: number): string {
    let i = -1
    const units = [' kHz', ' MHz', ' GHz']
    do {
      frequency = frequency / 1000
      i++
    } while (frequency > 1000)

    return Math.max(frequency, 0.1).toFixed() + units[i]
  }

  sortFiles (items: FileStateFile[] | null, sortBy: string[], sortDesc: boolean[]): FileStateFile[] {
    const sortBySingle = sortBy.length ? sortBy[0] : 'filename';
    const sortDescSingle = sortDesc[0];

    if (items !== null) {
      // Sort by index
      items.sort(function (a: any, b: any) {
        if (a[sortBySingle] === b[sortBySingle]) return 0
        if (a[sortBySingle] === null || a[sortBySingle] === undefined) return -1
        if (b[sortBySingle] === null || b[sortBySingle] === undefined) return 1

        if (a[sortBySingle].constructor === String && b[sortBySingle].constructor === String) {
          return a[sortBySingle].localeCompare(b[sortBySingle], undefined, { sensivity: 'base' })
        }

        if (a[sortBySingle] instanceof Array && b[sortBySingle] instanceof Array) {
          const reducedA = a[sortBySingle].length ? a.filament.reduce((a: any, b: any) => a + b) : 0
          const reducedB = b[sortBySingle].length ? b.filament.reduce((a: any, b: any) => a + b) : 0
          return reducedA - reducedB
        }

        return a[sortBySingle] - b[sortBySingle]
      })

      // Deal with descending order
      if (sortDescSingle) items.reverse()

      // Then make sure directories come first
      items.sort((a: any, b: any) => (a.isDirectory === b.isDirectory) ? 0 : (a.isDirectory ? -1 : 1))
    }

    return items || []
  }

  strLongestEqual (a: string, b: string): string {
    const l = Math.min(a.length, b.length);
    let i = 0;
    while (i < l && (a.charCodeAt(i) ^ b.charCodeAt(i)) === 0) {
      i += 1;
    }
    return a.substr(0, i);
  }

  reverseString (str: string): string {
    return (str === '') ? '' : this.reverseString(str.substr(1)) + str.charAt(0);
  }

  formatTime (date: Date, offset: number = 0): string {
    let numDate = date.getTime() + (offset * 3600000 - 3600000)
    const newDate = new Date(numDate)
    let hours: string | number = newDate.getHours()
    if (hours < 10) hours = "0" + hours.toString()
    let minutes: string | number = newDate.getMinutes()
    if (minutes < 10) minutes = "0" + minutes.toString()
    let seconds: string | number = newDate.getSeconds()
    if (seconds < 10) seconds = "0" + seconds.toString()


    return hours + ":" + minutes + ":" + seconds
  }


  cyrillicTransform (input: string, spaceReplacement?: string): string {
    if (!input) {
      return "";
    }

    // We must normalize string for transform all unicode chars to uniform form
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
    const normalizedInput = input.normalize();

    let newStr = "";
    let isWordBoundary = false;

    for (let i = 0; i < normalizedInput.length; i++) {
      const isUpperCaseOrWhatever = normalizedInput[i] === normalizedInput[i].toUpperCase();
      let strLowerCase = normalizedInput[i]//.toLowerCase();

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
        // handle multi-symbol letters
        newLetter.length > 1
          ? newStr += newLetter[0].toUpperCase() + newLetter.slice(1)
          : newStr += newLetter.toUpperCase();
      } else {
        newStr += newLetter;
      }
    }
    return newStr;
  }

  _firstLetters: { [letter: string]: string } = {
    "а": "a",
    "б": "b",
    "в": "v",
    "д": "d",
    "з": "z",
    "й": "y",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "ь": "",
    "г": "g",
    "и": "i",
    "ъ": "",
    "ы": "i",
    "э": "e",
    "е": "ye",
    "ё": "yo",
    "ж": "zh",
    "х": "kh",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "shch",
    "ю": "yu",
    "я": "ya",
  };

  _nonFirstLetters = Object.assign({}, this._firstLetters,
    {
      "й": "i",
      "е": "e"
    })


  // formate date seconds => dd hh:mm:ss
  formatPrintTime (totalSeconds: number, days: boolean = false): string {
    if (totalSeconds) {
      let output = "";

      if (days) {
        const days = Math.floor(totalSeconds / (3600 * 24))
        if (days) {
          totalSeconds %= (3600 * 24)
          output += days + "d"
        }
      }
      const hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      if (hours) output += " " + hours + "h";

      const minutes = Math.floor(totalSeconds / 60);
      if (minutes) output += " " + minutes + "m";

      const seconds = totalSeconds % 60;
      if (seconds) output += " " + seconds.toFixed(0) + "s";

      return output;
    }

    return "--";
  }

  formatLength (value: number): string {
    if (value > 1000) return (value / 1000).toFixed(2) + " m";
    return value.toFixed(2) + " mm";
  }


  constructor () { }
}