'use strict';

const request = require('request-promise');
const git = require('simple-git/promise');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const ora = require('ora')
const path = require('path');

const clone = async (url, templateName) => {

    try{

        const templateMap = await getTemplateMap(url);

        let templateList = Object.keys(templateMap);

        const template_name = await getTargetTemplateName(templateList, templateName);

        const cloneTemplate = templateMap[template_name];

        const clonedFolder = await gitCloneTemplate(cloneTemplate);

        return cloneTemplate.folderName;

    }catch(err){

        throw err;
    }
    
}

// Private
function getTemplateMap(url) {
    let GIT_ENDPOINT = url;
    let headers = {};
    headers['User-Agent'] = 'twilio-autopilot-cli/' + require('../../package.json').version +
        ' Node/' + process.version;
    let params = {
        url: GIT_ENDPOINT,
        method: 'GET',
        headers: headers
    };
    return request(params)
    .then((response) => {

        let templatesJSONMap = response;
        try {

            if (typeof(response) === 'string') {
                templatesJSONMap = JSON.parse(response);
            }
        } catch (e) {

            console.error('Failed to parse the response from Twilio Autopilot API Service.');
            throw new Error('Failed to parse the response from Twilio Autopilot API Service.');
        }
        return templatesJSONMap;

    }).catch((error) => {

        let err = 'Cannot retrieve Twilio Autopilot template list from GitHub repository.';
        throw new Error(err);
    });
}


function getTargetTemplateName(templateList, inputName) {
    if (inputName) {
        if (templateList.indexOf(inputName) === -1) {
            let error = '[Error]: no template associate with the input name';
            throw new Error(error);
        } else {
            return inputName;
        }
    } else {
        let templateChoiceQuestion = {
            type: 'list',
            message: 'List of templates you can chose',
            name: 'templateName',
            choices: templateList.sort()
        };

        return inquirer.prompt([templateChoiceQuestion])
                .then((answer) => {
                    let templateName = answer.templateName;
                    return templateName;
                });
    }
}

function gitCloneTemplate(cloneTemplate) {

    const spinner = ora().start(' Initializing Twilio Autopilot project from the chosen' +
    ' template...')
    
    let cloneDir = path.join(process.cwd(), cloneTemplate.folderName);

    return git().silent(true)
           .clone(cloneTemplate.gitUrl, cloneDir)
           .then(async (status) => {

                //const schemaPath = path.join(cloneDir, 'schema.json');

                const clonedAssistantFolder = path.join(cloneDir, 'Assistants',cloneTemplate.folderName);
                await fs.copySync(clonedAssistantFolder,cloneDir);

                await removeOtherClonedFolders(cloneDir, clonedAssistantFolder);

                spinner.stop()
                return cloneDir;
           }).catch((error) => {

                spinner.stop();
                throw error;
           })

}

function removeOtherClonedFolders(removeDir, clonedAssistantFolder){

    return fs.readdir(removeDir, (error, dirNames) => {

        const clonedFolder = fs.readdirSync(clonedAssistantFolder);
        if(error){
            console.log(error);
            return true;
        }else{

            if(clonedFolder.length){

                for(var file in dirNames)
                {
                    if(!clonedFolder.includes(dirNames[file])){

                        if(fs.statSync(path.join(removeDir, dirNames[file])).isDirectory())
                        {
                            fs.removeSync(path.join(removeDir, dirNames[file]));
                        }
                        else
                        {
                            fs.unlinkSync(path.join(removeDir, dirNames[file]))
                        }
                    }
                    
                }
            }else{
                
                for(var file in dirNames)
                {
                    
                    if(fs.statSync(path.join(removeDir, dirNames[file])).isDirectory())
                    {
                        fs.removeSync(path.join(removeDir, dirNames[file]));
                    }
                    else
                    {
                        fs.unlinkSync(path.join(removeDir, dirNames[file]))
                    }
                }
            }
            
            return true;
        }
    });
}

module.exports = {
    clone: clone
};