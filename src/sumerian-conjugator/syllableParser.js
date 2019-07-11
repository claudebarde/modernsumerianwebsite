/*const syllableParser = (verb, stem) => {
  let syllables = [];
  const affixes = verb.split(stem);
  const prefixes = affixes[0].replace("sh", "&").replace("'", "").replace("kh", "q");
  const suffix = affixes[1];
  // we split prefixes into syllable structure
  let prefixesStruct = prefixes
    .split("")
    .map(letter => {
      if (VOWELS.includes(letter)) return "V";
      return "C";
    })
    .join("");
  // first finds closed syllables in verb
  let results = [];
  // looks CVC with C before and after
  const cvcRegex = RegExp("C?(CVC)C+", "g");
  while ((results = cvcRegex.exec(prefixesStruct)) !== null) {
    const index = results.index;
    //console.log(`Found ${results[1]} at index ${index}`);
    // we replace the CVC by ### to continue the parsing
    prefixesStruct =
      prefixesStruct.slice(0, index) + "###" + prefixesStruct.slice(index + 3);
    // updates syllables array
    const syllable = prefixes.slice(index, 3);
    syllables.push(syllable);
  }
  // then we capture CV and V at the beginning and the end of the string
  // or a CV and V alone
  const CVandVregex = RegExp("#(CV)$|^(CV)#|#(V)$|^(V)#|^(CV|V)$", "g");
  while ((results = CVandVregex.exec(prefixesStruct)) !== null) {
    const index = results.index;
    //console.log(`Found ${results[1]} at index ${index}`);
    // we replace the CV and V by ## or # to continue the parsing
    console.log(results);
    let length, replacement;
    if (results[0] === "CV") {
      length = 2;
      replacement = "##";
    } else if (results[0] === "V") {
      length = 1;
      replacement = "#";
    }
    prefixesStruct =
      prefixesStruct.slice(0, index) +
      replacement +
      prefixesStruct.slice(index + length);
    // updates syllables array
    const syllable = prefixes.slice(index, length);
    syllables.push(syllable);
  }
  // looks for adjacent vowels
  const VVregex = RegExp("(C|#|^)(V)(V)(C|#|$)", "g");
  while ((results = VVregex.exec(prefixesStruct)) !== null) {
    // index of results
    const index = results.index;
    const string = results.shift();
    /*eslint no-loop-func: "off"*/
/*results.forEach((letter, i) => {
      if (letter.length > 0) {
        prefixesStruct =
          prefixesStruct.slice(0, index + i) +
          "#" +
          prefixesStruct.slice(index + i + 1);
      }
    });
    switch (string){
      case "VV":
        // these are 2 different syllables
        const syllable1 = prefixes.slice(index, 1)
        const syllable2 = prefixes.slice(index + 1, 1);
        syllables.push(syllable1, syllable2);
        break;
      case "VVC":
        break;
      case "CVV":
        if(index === 0){
          // first string in the word
        }
        break;
      case "CVVC":
        break;
      default:
        break;
    }
  }
  console.log(prefixesStruct);

  // we turn back "&"" into "sh"
  syllables = syllables.map(syllable => syllable.replace("&", "sh").replace("q", "kh"));

  return syllables.join("/");
};*/

const VOWELS = ["a", "e", "i", "u"];

// parse syllables according to scheme
const returnSyllables = (syllableStruct, prefixes) => {
  let syllablesCount = 0;
  const syllables = [];

  syllableStruct.forEach(syllable => {
    const result = prefixes.slice(
      syllablesCount,
      syllablesCount + syllable.length
    );
    syllablesCount += syllable.length;
    syllables.push(result);
  });

  return syllables;
};

const syllableParser = (verb, stem) => {
  let syllables = [];
  let result = [];
  const affixes = verb.split(stem);
  const prefixes = affixes[0]
    .replace("sh", "&")
    .replace("'", "")
    .replace("kh", "q");
  const suffixes = affixes[1];
  // we split prefixes into syllable structure
  let prefixesStruct = prefixes
    .split("")
    .map(letter => {
      if (VOWELS.includes(letter)) return "V";
      return "C";
    })
    .join("");
  // we compare the result with prematched data
  switch (prefixesStruct) {
    // starts with consonant
    case "C":
      syllables.push(prefixes);
      break;
    case "CV":
      syllables.push(prefixes);
      break;
    case "CVV":
      result = returnSyllables(["CV", "V"], prefixes);
      syllables.push(result);
      break;
    case "CVC":
      result = returnSyllables(["CVC"], prefixes);
      syllables.push(result);
      break;
    case "CCV":
      result = returnSyllables(["C", "CV"], prefixes);
      syllables.push(result);
      break;
    case "CCVV":
      result = returnSyllables(["C", "CV", "V"], prefixes);
      syllables.push(result);
      break;
    case "CVCV":
      result = returnSyllables(["CV", "CV"], prefixes);
      syllables.push(result);
      break;
    case "CCVC":
      result = returnSyllables(["C", "CVC"], prefixes);
      syllables.push(result);
      break;
    case "CVCVC":
      result = returnSyllables(["CV", "CVC"], prefixes);
      syllables.push(result);
      break;
    case "CVVCV":
      result = returnSyllables(["CV", "V", "VC"], prefixes);
      syllables.push(result);
      break;
    case "CVCCV":
      result = returnSyllables(["CVC", "CV"], prefixes);
      syllables.push(result);
      break;
    case "CVCVV":
      result = returnSyllables(["CV", "CV", "CV"], prefixes);
      syllables.push(result);
      break;
    case "CVVCVV":
      result = returnSyllables(["CV", "V", "CV", "V"], prefixes);
      syllables.push(result);
      break;
    case "CVCCVV":
      result = returnSyllables(["CVC", "CV", "V"], prefixes);
      syllables.push(result);
      break;
    case "CVCCVC":
      result = returnSyllables(["CVC", "CVC"], prefixes);
      syllables.push(result);
      break;
    case "CCVVCVV":
      result = returnSyllables(["C", "CV", "V", "CV", "V"], prefixes);
      syllables.push(result);
      break;
    case "CVCVCCV":
      result = returnSyllables(["CV", "CVC", "CV"], prefixes);
      syllables.push(result);
      break;
    case "CVVCCVV":
      result = returnSyllables(["CV", "VC", "CV", "V"], prefixes);
      syllables.push(result);
      break;
    // starts with vowel
    case "V":
      syllables.push(prefixes);
      break;
    case "VC":
      syllables.push(prefixes.replace("&", "sh").replace("q", "kh"));
      break;
    case "VCV":
      result = returnSyllables(["V", "CV"], prefixes);
      syllables.push(result);
      break;
    case "VCC":
      result = returnSyllables(["VC", "C"], prefixes);
      syllables.push(result);
      break;
    case "VCVV":
      result = returnSyllables(["V", "CV", "V"], prefixes);
      syllables.push(result);
      break;
    case "VCVC":
      result = returnSyllables(["V", "CVC"], prefixes);
      syllables.push(result);
      break;
    case "VCCV":
      result = returnSyllables(["VC", "CV"], prefixes);
      syllables.push(result);
      break;
    case "VCCVC":
      result = returnSyllables(["VC", "CVC"], prefixes);
      syllables.push(result);
      break;
    case "VCCVV":
      result = returnSyllables(["VC", "CV", "V"], prefixes);
      syllables.push(result);
      break;
    case "VCVCVV":
      result = returnSyllables(["V", "CV", "CV", "V"], prefixes);
      syllables.push(result);
      break;
    case "VCVVCV":
      result = returnSyllables(["V", "CV", "V", "CV"], prefixes);
      syllables.push(result);
      break;
    case "VCVVCVC":
      result = returnSyllables(["V", "CV", "V", "CVC"], prefixes);
      syllables.push(result);
      break;
    case "VCCVVCV":
      result = returnSyllables(["VC", "CV", "V", "CV"], prefixes);
      syllables.push(result);
      break;
    case "VCCVVCVV":
      result = returnSyllables(["VC", "CV", "V", "CV", "V"], prefixes);
      syllables.push(result);
      break;
    case "VCVCVCCV":
      result = returnSyllables(["V", "CV", "CVC", "CV"], prefixes);
      syllables.push(result);
      break;
    case "VCVCVCCVV":
      result = returnSyllables(["V", "CV", "CVC", "CV", "V"], prefixes);
      syllables.push(result);
      break;
    default:
      break;
  }

  console.log(prefixesStruct, syllables.flat());

  return {
    prefixes: syllables
      .flat()
      .map(syllable => syllable.replace("&", "sh").replace("q", "kh")),
    suffixes
  };
};

module.exports = syllableParser;
