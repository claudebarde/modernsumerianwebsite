const VOWELS = ["a", "e", "i", "u"];

// parse syllables according to scheme
const returnSyllables = (syllableStruct, affixes) => {
  let syllablesCount = 0;
  const syllables = [];

  syllableStruct.forEach(syllable => {
    const result = affixes.slice(
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
    .replace("sh", "š")
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
    case "CVCVCCVC":
      result = returnSyllables(["CV", "CVC", "CVC"], prefixes);
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
    case "VVCV":
      result = returnSyllables(["V", "V", "CV"], prefixes);
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
    case "VCVCCV":
      result = returnSyllables(["V", "CVC", "CV"], prefixes);
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
  // parses suffixes
  let _suffixes = [];
  switch (suffixes) {
    case "e":
      _suffixes = returnSyllables(["V"], "e");
      break;
    case "n":
      _suffixes = returnSyllables(["C"], "n");
      break;
    case "en":
      _suffixes = returnSyllables(["VC"], "en");
      break;
    case "nden":
      _suffixes = returnSyllables(["C", "CVC"], "nden");
      break;
    case "enden":
      _suffixes = returnSyllables(["VC", "CVC"], "enden");
      break;
    case "nzen":
      _suffixes = returnSyllables(["C", "CVC"], "nzen");
      break;
    case "enzen":
      _suffixes = returnSyllables(["VC", "CVC"], "enzen");
      break;
    case "sh":
      _suffixes = returnSyllables(["C"], "š");
      break;
    case "esh":
      _suffixes = returnSyllables(["VC"], "eš");
      break;
    case "enee":
      _suffixes = returnSyllables(["V", "CV", "V"], "enee");
      break;
    default:
      break;
  }

  return {
    prefixes: syllables
      .flat()
      .map(syllable => syllable.replace("š", "sh").replace("q", "kh")),
    suffixes: _suffixes.map(suffix => suffix.replace("š", "sh"))
  };
};

module.exports = syllableParser;
