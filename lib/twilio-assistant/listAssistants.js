
const listAssistants = async (profile) => {
  const client = await require('./client')(profile);

 // getting list of assistant
  return await client.autopilot
    .assistants.list().then((assistants) => {
        return assistants;
    });
}

module.exports = {listAssistants};