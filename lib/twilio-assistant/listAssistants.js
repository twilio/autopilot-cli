
const listAssistants = async (profile) => {
  const client = await require('./client')(profile);

  return await client.autopilot
    .assistants.list().then((assistants) => {
        return assistants;
    });
}

module.exports = {listAssistants};