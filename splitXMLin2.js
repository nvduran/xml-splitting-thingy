const fs = require("fs");
const xml2js = require("xml2js");

const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

function splitXML(filePath) {
        fs.readFile(filePath, (err, data) => {
                if (err) {
                        console.error("Error reading the file:", err);
                        return;
                }

                parser.parseString(data, (err, result) => {
                        if (err) {
                                console.error("Error parsing the XML:", err);
                                return;
                        }

                        const rootKeys = Object.keys(result);
                        if (rootKeys.length !== 1) {
                                console.error("The XML should have one root element.");
                                return;
                        }

                        const rootNode = result[rootKeys[0]];
                        const children = Object.keys(rootNode);
                        const midpoint = Math.ceil(children.length / 2);

                        const firstHalf = {};
                        const secondHalf = {};

                        firstHalf[rootKeys[0]] = {};
                        secondHalf[rootKeys[0]] = {};

                        for (let i = 0; i < midpoint; i++) {
                                firstHalf[rootKeys[0]][children[i]] = rootNode[children[i]];
                        }

                        for (let i = midpoint; i < children.length; i++) {
                                secondHalf[rootKeys[0]][children[i]] = rootNode[children[i]];
                        }

                        const xml1 = builder.buildObject(firstHalf);
                        const xml2 = builder.buildObject(secondHalf);

                        fs.writeFileSync("firstHalf.xml", xml1);
                        fs.writeFileSync("secondHalf.xml", xml2);
                        console.log("XML files have been split into 'firstHalf.xml' and 'secondHalf.xml'.");
                });
        });
}

splitXML("path_to_your_input_file.xml");
