
const Task_Samples = async (intentSamples) => {
    let samples = [];

    if(intentSamples.length){

        for(let i = 0 ; i < intentSamples.length ; i ++){

            const sample = await combineSample(intentSamples[i].data);
            samples.push({
                "language" : "en-US",
                "taggedText" : sample
            })
        }
    }
    return samples;
    
}

const combineSample = async (data) => {
    let sample = ``;

    for(let i = 0 ; i < data.length ; i ++){
        sample+= (data[i].hasOwnProperty('alias')) ? `{${data[i].alias}}` : `${data[i].text}`;

        if(i === data.length - 1){
            return sample;
        }
    }
}

module.exports = {Task_Samples};