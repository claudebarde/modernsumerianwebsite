const { SYLLABARY } = require("../sections/resources/syllabary/syllabaryData");

const validateSyllable = (_syllable, cuneiforms) => {
  let result;
  if (_syllable === "none") {
    result = "Ø";
  } else if (Array.isArray(_syllable)) {
    result = _syllable[0] === "none" ? "Ø" : _syllable[0];
  } else {
    result = _syllable;
  }

  return cuneiforms + result;
};
// slices CVC syllables
const sliceSyllable = syllable => {
  let result;

  const a = SYLLABARY[syllable.slice(0, syllable.length - 1).toUpperCase()];
  const b = SYLLABARY[syllable.slice(-2).toUpperCase()];
  // first part of syllable
  if (a === "none") {
    result = "Ø";
  } else if (Array.isArray(a)) {
    result = a[0] === "none" ? "Ø" : a[0];
  } else {
    result = a;
  }
  // second part of syllable
  if (b === "none") {
    result += "Ø";
  } else if (Array.isArray(b)) {
    result += b[0] === "none" ? "Ø" : b[0];
  } else {
    result += b;
  }

  return result;
};

module.exports = ({
  affixes,
  reduplicated,
  aspect,
  verbID,
  stem,
  defaultVerbs
}) => {
  if (!defaultVerbs) return;

  const { prefixes, suffixes } = affixes;
  const VOWELS = ["a", "e", "i", "u"];
  let cuneiforms, cuneiformVerb, cuneiformBase, imperfectiveForm;
  let characters = [];
  // we find the cuneiform form of the verb
  const _cuneiformVerb = defaultVerbs.filter(verb => verb.id === verbID);
  if (_cuneiformVerb.length > 0) {
    cuneiformVerb = _cuneiformVerb[0].cuneiform;
    imperfectiveForm = _cuneiformVerb[0].imperfective;
  } else {
    return null;
  }
  if (reduplicated && aspect === "perfective") {
    cuneiforms = cuneiformVerb + cuneiformVerb;
  } else if (reduplicated && aspect === "imperfective") {
    cuneiforms = cuneiformVerb + imperfectiveForm.cuneiform;
  } else if (!reduplicated && aspect === "perfective") {
    cuneiforms = cuneiformVerb;
  } else if (!reduplicated && aspect === "imperfective") {
    cuneiforms = imperfectiveForm.cuneiform;
  }
  cuneiformBase = cuneiforms;
  // we reverse the prefixes list so we can start building from the stem to the first prefix
  prefixes.reverse().forEach((syllable, index) => {
    let result = "";
    // excludes single consonants
    if (VOWELS.includes(syllable) || syllable.length === 2) {
      let _syllable = SYLLABARY[syllable.toUpperCase()];
      if (_syllable === "none") {
        result = "Ø";
      } else if (Array.isArray(_syllable)) {
        result = _syllable[0] === "none" ? "Ø" : _syllable[0];
      } else {
        result = _syllable;
      }
    } else if (syllable.length === 3 || syllable.length === 4) {
      result = sliceSyllable(syllable);
    } else {
      if (
        !VOWELS.includes(syllable) &&
        index === 0 &&
        VOWELS.includes(stem[0])
      ) {
        // consonant single prefix before vowel initial verb
        const _syllable =
          SYLLABARY[syllable.toUpperCase() + stem[0].toUpperCase()];
        if (_syllable) {
          result = _syllable;
        } else {
          result = "Ø";
        }
      } else {
        result = "Ø";
      }
    }
    // we push single characters in array
    if (result) characters.push(result);
    // we update the cuneiform chain
    cuneiforms = result + cuneiforms;
  });
  // we reverse the characters array and add before adding suffixes
  characters = characters.reverse();
  characters.push(cuneiformBase);
  // suffixes
  console.log(suffixes);
  let result;
  if (suffixes.length === 1) {
    if (!VOWELS.includes(stem[stem.length - 1])) {
      const _syllable = SYLLABARY[suffixes[0].toUpperCase()];
      cuneiforms = validateSyllable(_syllable, cuneiforms);
    } else {
      if (suffixes[0] === "n") {
        // suffix "n" after a vowel ending verb
        const constructedSuffix = stem[stem.length - 1].toUpperCase() + "N";
        const _syllable = SYLLABARY[constructedSuffix.toUpperCase()];
        cuneiforms = validateSyllable(_syllable, cuneiforms);
      } else if (suffixes[0] === "sh") {
        // suffix "sh" after a vowel ending verb
        const constructedSuffix = stem[stem.length - 1].toUpperCase() + "SH";
        const _syllable = SYLLABARY[constructedSuffix.toUpperCase()];
        cuneiforms = validateSyllable(_syllable, cuneiforms);
      }
    }
  } else if (suffixes.length === 2) {
    if (suffixes[0] === "n") {
      // first syllable
      let _syllable =
        SYLLABARY[(stem[stem.length - 1] + suffixes[0]).toUpperCase()];
      cuneiforms = validateSyllable(_syllable, cuneiforms);
      // second syllable
      cuneiforms = cuneiforms + sliceSyllable(suffixes[1]);
    } else {
      // first syllable
      let _syllable = SYLLABARY[suffixes[0].toUpperCase()];
      cuneiforms = validateSyllable(_syllable, cuneiforms);
      // second syllable
      cuneiforms = cuneiforms + sliceSyllable(suffixes[1]);
    }
  }
  // we push the suffix
  if (result) characters.push(result);

  return { chain: cuneiforms, characters };
};
