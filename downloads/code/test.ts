const test = "this is test only";

// here is more code

for (const [index, character] of test.split("").entries()) {
  console.log("this is character", character);
  if (character === "t") {
    console.log(character, "is shown", index + 1, "time(s)");
  }
}