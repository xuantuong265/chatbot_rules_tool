const fs = require("fs");
const { NlpManager } = require("node-nlp");

const manager = new NlpManager({
    languages: ["en"],
});

(async() => {
    manager.addCorpora('src/data/corpus-en.json');
    await manager.train();
    manager.save();
})();