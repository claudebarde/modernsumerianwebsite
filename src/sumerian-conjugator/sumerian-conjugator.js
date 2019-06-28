// imports personal prefixes and suffixes
const {
  personalSuffixes1,
  personalSuffixes2,
  personalPrefixes
} = require("./personalPrefixesAndSuffixes/personalPrefixesAndSuffixes");
// imports oblique object prefixes
const {
  obliqueObjectPrefixes
} = require("./personalPrefixesAndSuffixes/obliqueObjectPrefixes");
// imports dimensional prefixes and initial person-prefixes
const {
  dimensionalPrefixes,
  initialPersonPrefixes
} = require("./dimensionalPrefixes/dimensionalPrefixes");

const {
  indirectObjectPrefixes
} = require("./personalPrefixesAndSuffixes/indirectObjectPrefixes");

const syllableParser = require("./syllableParser");

const VOWELS = ["a", "e", "i", "u"];

// checks if vowel of suffix will contract
const willSuffixVowelContract = (stem, suffix) => {
  if (VOWELS.includes(stem[stem.length - 1]) && suffix[0] === "e") return true;

  return false;
};

module.exports = ({
  stem,
  aspect,
  transitive,
  subject,
  directObject,
  obliqueObject,
  dimensionalPrefix,
  initialPersonPrefix,
  indirectObject,
  ventive,
  preformative,
  proclitic
}) => {
  // initializes empty results
  let conjugatedVerb = "";
  let affixes = [];
  let notes = [];
  // builds verb
  // TRANSITIVITY
  if (
    stem === undefined ||
    stem.length === 0 ||
    transitive === undefined ||
    aspect === undefined ||
    subject === undefined
  ) {
    return;
  }

  if (transitive !== true) {
    if (!willSuffixVowelContract(stem, personalSuffixes2[subject])) {
      // if last letter is consonant
      conjugatedVerb = stem + personalSuffixes2[subject];
      // saves affixes
      affixes.push({
        type: "suffix",
        function: "intransitive subject",
        rawForm: personalSuffixes2[subject],
        form: personalSuffixes2[subject]
      });
    } else {
      // if last letter is vowel
      // if suffix starts with "e"
      if (personalSuffixes2[subject][0] === "e") {
        const personalSuffix = personalSuffixes2[subject].slice(1);
        conjugatedVerb = stem + personalSuffix;
        // saves affixes
        affixes.push({
          type: "suffix",
          function: "intransitive subject",
          rawForm: personalSuffixes2[subject],
          form: personalSuffix
        });
        notes.push(
          `${personalSuffixes2[subject]} becomes ${personalSuffix} after vowel.`
        );
      }
    }
  } else {
    // if verb is transitive
    if (aspect === "perfective") {
      // adds prefixes and suffixes
      // if verb ends in a vowel
      let personalPrefix = "";
      let personalSuffix = "";

      if (subject) {
        if (subject === "secondSingular") {
          // contracts with a preceding vowel, lengthening that vowel
          if (obliqueObject) {
            const obliquePrefix = obliqueObjectPrefixes[obliqueObject];
            personalPrefix = obliquePrefix[obliquePrefix.length - 1];
          } else if (
            dimensionalPrefix &&
            dimensionalPrefix.length > 0 &&
            dimensionalPrefix[0].prefix
          ) {
            const dimPrefix = dimensionalPrefixes[dimensionalPrefix[0].prefix];
            personalPrefix = dimPrefix[dimPrefix.length - 1];
          } else if (indirectObject) {
            const indirectPrefix = indirectObjectPrefixes[indirectObject];
            personalPrefix = indirectPrefix[indirectPrefix.length - 1];
          } else if (ventive) {
            personalPrefix = "u";
          } else if (preformative) {
            personalPrefix = preformative;
          } else if (proclitic) {
            personalPrefix = proclitic[proclitic.length - 1];
          } else {
            personalPrefix = personalPrefixes[subject];
          }

          if (personalPrefix !== "e") {
            notes.push(
              `"e" contracts with a preceding vowel, lengthening that vowel.`
            );
          }
        } else {
          personalPrefix = personalPrefixes[subject];
        }

        affixes.push({
          type: "prefix",
          function: "transitive subject",
          rawForm: personalPrefixes[subject] || "",
          form: personalPrefix
        });
      }

      if (directObject) {
        if (willSuffixVowelContract(stem, personalSuffixes2[directObject])) {
          personalSuffix = personalSuffixes2[directObject].slice(1) || "";
          notes.push(
            `${personalSuffixes2[directObject]} becomes ${personalSuffixes2[
              directObject
            ].slice(1)} after vowel.`
          );
        } else {
          // if verb ends in a consonant
          personalSuffix = personalSuffixes2[directObject] || "";
        }

        // saves affixes
        affixes.push({
          type: "suffix",
          function: "transitive direct object",
          rawForm: personalSuffixes2[directObject],
          form: personalSuffix
        });
      }
      conjugatedVerb = personalPrefix + stem + personalSuffix;
    } else if (aspect === "imperfective") {
      // adds prefixes and suffixes
      // if verb ends in a vowel
      let personalPrefix = "";
      let personalSuffix = "";
      if (willSuffixVowelContract(stem, personalSuffixes1[subject])) {
        personalSuffix = personalSuffixes1[subject].slice(1);
        notes.push(
          `${personalSuffixes1[subject]} becomes ${personalSuffixes1[
            subject
          ].slice(1)} after vowel.`
        );
      } else {
        personalSuffix = personalSuffixes1[subject];
      }
      // prefix "e" assimilates with previous vowel

      if (directObject) {
        personalPrefix = personalPrefixes[directObject];

        if (directObject === "secondSingular") {
          // contracts with a preceding vowel, lengthening that vowel
          if (obliqueObject) {
            const obliquePrefix = obliqueObjectPrefixes[obliqueObject];
            personalPrefix = obliquePrefix[obliquePrefix.length - 1];
          } else if (
            dimensionalPrefix &&
            dimensionalPrefix.length > 0 &&
            dimensionalPrefix[0].prefix
          ) {
            const dimPrefix = dimensionalPrefixes[dimensionalPrefix[0].prefix];
            personalPrefix = dimPrefix[dimPrefix.length - 1];
          } else if (indirectObject) {
            const indirectPrefix = indirectObjectPrefixes[indirectObject];
            personalPrefix = indirectPrefix[indirectPrefix.length - 1];
          } else if (ventive) {
            personalPrefix = "u";
          } else if (preformative) {
            personalPrefix = preformative;
          } else if (proclitic) {
            personalPrefix = proclitic[proclitic.length - 1];
          } else {
            personalPrefix = personalPrefixes[directObject];
          }

          if (personalPrefix !== "e") {
            notes.push(
              `Personal prefix "e" contracts with preceding vowel and lengthens it.`
            );
          }
        }
        // saves affixes
        affixes.push({
          type: "prefix",
          function: "transitive direct object",
          rawForm: personalPrefixes[directObject],
          form: personalPrefix
        });
      }

      conjugatedVerb = personalPrefix + stem + personalSuffix;
      // saves affixes
      affixes.push({
        type: "suffix",
        function: "transitive subject",
        rawForm: personalSuffixes2[subject],
        form: personalSuffix
      });
    }
  }

  /*
        OBLIQUE OBJECT PREFIXES
  */
  if (obliqueObject && obliqueObject.length > 0) {
    let obliqueObjectPrefix = obliqueObjectPrefixes[obliqueObject];
    // bi assimilates with venitive to "mmi"
    if (
      obliqueObject === "thirdSingularInanimate" &&
      ventive &&
      !dimensionalPrefix[0].prefix &&
      !dimensionalPrefix[0].initialPersonPrefix &&
      !indirectObject
    ) {
      obliqueObjectPrefix = "mi";
    }
    // "bi" does not appear with dimensional prefixes and "ba"
    if (
      obliqueObject === "thirdSingularInanimate" &&
      dimensionalPrefix &&
      dimensionalPrefix[0].prefix.length > 0
    ) {
      notes.push(
        `Oblique object "bi" does not appear with dimensional prefixes.`
      );
    }
    // "bi", "ri", "nni" are never found with the indirect-object prefixes
    // and the prefixes "da", "ta", "shi", "e", and "ni"
    if (
      obliqueObject === "secondSingular" ||
      obliqueObject === "thirdSingularAnimate" ||
      obliqueObject === "thirdSingularInanimate"
    ) {
      if (
        dimensionalPrefix &&
        dimensionalPrefix[0].prefix &&
        dimensionalPrefixes.hasOwnProperty(dimensionalPrefix[0].prefix)
      ) {
        notes.push(
          `"bi" / "ri" / "nni" are never found with the prefixes "da", "ta", "shi", "e", and "ni".`
        );
      }

      if (indirectObject && indirectObject.length > 0) {
        notes.push(
          `"bi" / "ri" / "nni" are never found with the indirect-object prefixes.`
        );
      }
    }
    // "bi" does not appear with "ba"
    if (
      obliqueObject === "thirdSingularInanimate" &&
      indirectObject === "thirdSingularInanimate"
    ) {
      notes.push(
        `Oblique object "bi" does not appear with indirect object prefix "ba".`
      );
    }

    conjugatedVerb = obliqueObjectPrefix + conjugatedVerb;
    // saves affixes
    affixes.push({
      type: "prefix",
      function: "oblique object",
      rawForm: obliqueObjectPrefixes[obliqueObject],
      form: obliqueObjectPrefix
    });
  }

  /*
        DIMENSIONAL PREFIXES
  */
  if (
    dimensionalPrefix &&
    dimensionalPrefix.length > 0 &&
    dimensionalPrefix[0].hasOwnProperty("prefix") &&
    dimensionalPrefix[0]["prefix"] &&
    dimensionalPrefix[0]["prefix"].length > 0 &&
    dimensionalPrefix[0].hasOwnProperty("initialPersonPrefix") &&
    dimensionalPrefix[0]["initialPersonPrefix"] &&
    dimensionalPrefix[0]["initialPersonPrefix"].length > 0
  ) {
    dimensionalPrefix.forEach(({ prefix, initialPersonPrefix }) => {
      let ipprefix = initialPersonPrefixes[initialPersonPrefix];
      if (initialPersonPrefix === "secondSingular") {
        // prefix "e" assimilates with previous vowel
        if (indirectObject && indirectObject.length > 0) {
          // in case of indirect object prefix
          const indirectPrefix = indirectObjectPrefixes[indirectObject];
          if (indirectPrefix[indirectPrefix.length - 1] === "a") {
            ipprefix = "a";
          } else {
            ipprefix = "";
          }
        } else if (ventive) {
          // in case of ventive prefix
          ipprefix = "u";
        } else if (preformative && preformative.length > 0) {
          // in case of preformative suffix
          if (proclitic && !ventive && !indirectObject) {
            // preformative will change according to preceding proclitic
            if (proclitic === "nu") {
              ipprefix = "u";
            } else if (proclitic === "ha") {
              ipprefix = "a";
            }
          } else {
            ipprefix = preformative;
          }
        } else if (proclitic && proclitic.length > 0) {
          // in case of preformative suffix
          ipprefix = proclitic[proclitic.length - 1];
        }
        notes.push(
          `Initial personal prefix "e" contracts with preceding vowel and lengthens it.`
        );
      } else if (initialPersonPrefix === "thirdSingularInanimate") {
        if (
          ventive &&
          !indirectObject &&
          ["with", "from", "towards", "in"].includes(prefix)
        ) {
          // "da" / "ta" / "shi" / "ni" always lack non-human person-prefix when preceded by ventive
          ipprefix = "";
          notes.push(
            `"${
              dimensionalPrefixes[prefix]
            }" always lacks non-human person-prefix when preceded by ventive.`
          );
        }
      }
      conjugatedVerb = ipprefix + dimensionalPrefixes[prefix] + conjugatedVerb;
      // saves affixes
      affixes.push(
        {
          type: "prefix",
          function: "dimensional prefix",
          rawForm: dimensionalPrefixes[prefix],
          form: dimensionalPrefixes[prefix]
        },
        {
          type: "prefix",
          function: "initial person prefix",
          rawForm: initialPersonPrefixes[initialPersonPrefix],
          form: ipprefix
        }
      );
    });
  }

  /*
        INDIRECT OBJECT PREFIXES
  */
  if (indirectObject && indirectObject.length > 0) {
    let indirectObjectPrefix = indirectObjectPrefixes[indirectObject];
    // "ba" assimilates with ventive to "mma"
    if (indirectObject === "thirdSingularInanimate" && ventive) {
      indirectObjectPrefix = "ma";
    }

    conjugatedVerb = indirectObjectPrefix + conjugatedVerb;
    // saves affixes
    affixes.push({
      type: "prefix",
      function: "indirect object",
      rawForm: indirectObjectPrefixes[indirectObject],
      form: indirectObjectPrefix
    });
  }

  /*
        VENTIVE
  */
  if (ventive) {
    let ventivePrefix = "mu";
    // if verb starts with /CV/ but not "ra", "ri" or "ni"
    if (
      !VOWELS.includes(conjugatedVerb[0]) &&
      VOWELS.includes(conjugatedVerb[1]) &&
      indirectObject !== "secondSingular" &&
      indirectObject !== "secondPlural" &&
      indirectObject !== "thirdPersonInanimate" &&
      dimensionalPrefix[0].prefix !== "in" &&
      obliqueObject !== "secondSingular" &&
      (proclitic || preformative)
    ) {
      ventivePrefix = "m";
      notes.push(`Ventive prefix contracts to "m" before /CV/ cluster.`);
    } else if (
      obliqueObject === "thirdSingularInanimate" &&
      !dimensionalPrefix[0].prefix &&
      !dimensionalPrefix[0].initialPersonPrefix &&
      !indirectObject
    ) {
      // "bi" assimilates with ventive to "mmi"
      ventivePrefix = "m";
      notes.push(`"bi" assimilates with ventive to "mmi".`);
    } else if (indirectObject === "thirdPersonInanimate") {
      // "ba" assimilates with ventive to "mma"
      ventivePrefix = "m";
      notes.push(`"ba" assimilates with ventive to "mma".`);
    }
    conjugatedVerb = ventivePrefix + conjugatedVerb;
    //saves affixes
    affixes.push({
      type: "prefix",
      function: "ventive",
      rawForm: "mu",
      form: ventivePrefix
    });
  }

  /*
        PREFORMATIVES
  */

  if (!preformative && !ventive && !proclitic) {
    notes.push(
      `The verb must start with a preformative, a ventive or a proclitic suffix.`
    );
  } else if (preformative && preformative.length > 0 && !ventive) {
    // preformative but no ventive
    if (
      transitive === false &&
      !directObject &&
      !obliqueObject &&
      !dimensionalPrefix[0].prefix &&
      !dimensionalPrefix[0].initialPersonPrefix &&
      !indirectObject
    ) {
      // if there is no other prefix between the preformative and the stem
      if (preformative === "i") {
        conjugatedVerb = "i" + conjugatedVerb;
        // saves affixes
        affixes.push({
          type: "prefix",
          function: "preformative",
          rawForm: "i",
          form: "i"
        });
      } else if (preformative === "a") {
        conjugatedVerb = "al" + conjugatedVerb;
        notes.push(`Preformative "a" becomes "al" just before the verb stem.`);
        // saves affixes
        affixes.push({
          type: "prefix",
          function: "preformative",
          rawForm: "a",
          form: "al"
        });
      } else if (preformative === "u") {
        conjugatedVerb = "ul" + conjugatedVerb;
        notes.push(`Preformative "u" becomes "ul" just before the verb stem.`);
        // saves affixes
        affixes.push({
          type: "prefix",
          function: "preformative",
          rawForm: "u",
          form: "ul"
        });
      }
    } else {
      if (preformative === "i") {
        // i is never found before CV
        if (
          !VOWELS.includes(conjugatedVerb[0]) &&
          VOWELS.includes(conjugatedVerb[1])
        ) {
          preformative = "";
          notes.push(
            `Preformative "i" is never found before a prefix that consists of a consonant and a vowel.`
          );
        } else {
          conjugatedVerb = "i" + conjugatedVerb;
        }
        // saves affixes
        affixes.push({
          type: "prefix",
          function: "preformative",
          rawForm: "i",
          form: preformative
        });
      } else if (preformative === "a") {
        // a is never found before CV
        if (
          !VOWELS.includes(conjugatedVerb[0]) &&
          VOWELS.includes(conjugatedVerb[1])
        ) {
          preformative = "";
          notes.push(
            `Preformative "a" is never found before a prefix that consists of a consonant and a vowel.`
          );
        } else {
          conjugatedVerb = "a" + conjugatedVerb;
        }
        // saves affixes
        affixes.push({
          type: "prefix",
          function: "preformative",
          rawForm: "a",
          form: preformative
        });
      } else if (preformative === "u") {
        if (aspect !== "perfective") {
          notes.push(`Preformative "u" only appears in perfective forms.`);
        } else {
          conjugatedVerb = "u" + conjugatedVerb;
        }
        // saves affixes
        affixes.push({
          type: "prefix",
          function: "preformative",
          rawForm: "u",
          form: "u"
        });
      }
    }
  } else if (!preformative && !proclitic && ventive) {
    // no preformative, no proclitic but ventive
    // contracted ventive must be prefixed with preformative
    if (
      affixes.findIndex(
        item => item.function === "ventive" && item.form === "m"
      ) !== -1
    ) {
      notes.push(`Add a preformative before a contracted ventive form.`);
    }
  } else if (preformative && preformative.length > 0 && ventive) {
    // preformative and ventive
    const ventiveForm = affixes.find(item => item[0] === "ventive");
    let preformativePrefix = preformative;
    if (
      ventiveForm &&
      ventiveForm[1] === "mu" &&
      (preformative === "a" || preformative === "i")
    ) {
      preformativePrefix = "";
      notes.push(`Preformatives "i" and "a" do not appear before "mu".`);
    } else if (ventiveForm && ventiveForm[1] === "m") {
      // the loss of "u" lengthens the preceding vowel
      preformativePrefix = preformative + preformative;
      notes.push(
        `The loss of "u" in the ventive lengthens the preceding vowel.`
      );
    }

    conjugatedVerb = preformative + conjugatedVerb;
    affixes.push({
      type: "prefix",
      function: "preformative",
      rawForm: preformative,
      form: preformativePrefix
    });
  }

  /*
      PROCLITICS
  */
  if (proclitic) {
    let newProclitic = "";
    // NU
    if (proclitic === "nu") {
      if (VOWELS.includes(conjugatedVerb[0])) {
        // vowel after "nu" assimilates to "u"
        newProclitic = "nu";
        conjugatedVerb = "u" + conjugatedVerb.slice(1);
        // checks if vowel is preformative to update affixes array
        affixes = affixes.map(item => {
          if (item.function === "preformative") {
            item.form = "u";
          }

          return item;
        });
        notes.push(`Vowel after "nu" becomes "u".`);
      } else if (
        !VOWELS.includes(conjugatedVerb[0]) &&
        VOWELS.includes(conjugatedVerb[1]) &&
        conjugatedVerb[0] !== "b"
      ) {
        // vowel of "nu" assimilates to following vowel if /CV/
        newProclitic = "n" + conjugatedVerb[1];
        notes.push(
          `Vowel in proclitic "nu" assimilates to following vowel in /CV/ syllable.`
        );
      } else if (
        conjugatedVerb[0] === "b" &&
        VOWELS.includes(conjugatedVerb[1])
      ) {
        // vowel of "nu" assimilates to following vowel if /CV/
        // "n" becomes "l" if consonant if /bV/
        newProclitic = "l" + conjugatedVerb[1];
        notes.push(
          `Vowel in proclitic "nu" assimilates to following vowel in /CV/ syllable.`
        );
        notes.push(`Initial "n" in proclitic "nu" becomes "l" before "b".`);
      } else {
        newProclitic = "nu";
      }
    }
    // HA
    else if (proclitic === "ha") {
      if (conjugatedVerb[0] === "i") {
        newProclitic = "he";
        conjugatedVerb = conjugatedVerb.slice(1);
        notes.push(
          `Initial "i" assimilates to proclitic "ha" which becomes "he".`
        );
        // modifies preformative entry in array because of "i" being assimilated
        affixes = affixes.map(entry => {
          if (entry.function === "preformative" && entry.rawForm === "i") {
            entry.form = "";
          }

          return entry;
        });
      } else {
        newProclitic = "ha";
      }
    }
    // NAN
    else if (proclitic === "nan") {
      if (
        !VOWELS.includes(conjugatedVerb[0]) &&
        !VOWELS.includes(conjugatedVerb[1])
      ) {
        newProclitic = "na";
        notes.push(`Proclitic "na" is found before /CC/.`);
      } else if (conjugatedVerb[0] === "b" || conjugatedVerb[0] === "m") {
        newProclitic = "nam";
        notes.push(`Proclitic "nam" is found before "m" and "b".`);
      } else if (
        !VOWELS.includes(conjugatedVerb[0]) &&
        VOWELS.includes(conjugatedVerb[1])
      ) {
        newProclitic = "nan";
        notes.push(`Proclitic "nan" is found before /CV/.`);
      } else {
        newProclitic = "nan";
      }
    }
    // GA
    else if (proclitic === "ga") {
      newProclitic = "ga";
    }
    // BARA
    else if (proclitic === "bara") {
      newProclitic = "bara";
    }

    conjugatedVerb = newProclitic + conjugatedVerb;
    affixes.push({
      type: "prefix",
      function: "proclitic",
      rawForm: proclitic,
      form: newProclitic
    });
  }
  // parse final verb for syllables
  const syllables = syllableParser(conjugatedVerb, stem);

  return { conjugatedVerb, affixes, notes, syllables };
};
