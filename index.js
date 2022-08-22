const fs = require('fs-extra')
const path = require('path');

const ARGS = process.argv.slice(2);
const configPath = ARGS[0]

const jsonRaw = fs.readFileSync(configPath);
// Run in the collections page
// Array.from(document.querySelectorAll('.collectionItemDetails')).map(x => x.children[0].href.split('/?id=').last())
const configContent = JSON.parse(jsonRaw);

const { steamWorkshopPath, items, localWorkshopPath, name } = configContent

const modTemplatePath = path.join(localWorkshopPath, "ModTemplate")
const outputRootPath = path.join(localWorkshopPath, name)
const outputModsPath = path.join(outputRootPath, 'Contents/mods')

try {
    // Makes a new mod from the ModTemplate
    fs.copySync(modTemplatePath, outputRootPath, { overwrite: false })
    fs.rmSync(path.join(outputRootPath, 'Contents/mods/ModTemplate'), { force: true, recursive: true })
} catch (error) {
    // No thanks
}

items.forEach(id => {
    const modsInWorkshopFolder = path.join(steamWorkshopPath, id, 'mods')

    const modsDirectories = fs.readdirSync(modsInWorkshopFolder)

    modsDirectories.forEach((modDirectory) => {
        const inPath = path.join(modsInWorkshopFolder, modDirectory)
        const outPath = path.join(outputModsPath, modDirectory)
        console.log(`Copying From ${inPath} to ${outPath}`)
        fs.copySync(inPath, outPath, { recursive: true, overwrite: true })
    })
});
