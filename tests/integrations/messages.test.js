import axios from "axios";
import models from "../../models";
import authReq from "../utils/authRequest";

describe("messages resolvers", () => {
  test("query messages of channel", async () => {
    const res = await axios.post(url, {
      query: `
        query {
          messages(channelId: 1) {
            id
            text
            createdAt
            user {
              id
              username
            }
          }
        }
      `,
    });
    expect(res.status).toBe(200);
  });

  test("send message to channel", async () => {
    const text = "Test message";

    const res = await authReq({
      query: `
      mutation {
        createTeam(name: "team-x") {
          ok
          team {
            name
          }
        }
      }
          `,
    });

    expect(res.status).toBe(200);

    const team = await models.Team.findOne({ where: { name: "team-x" } });

    const channel = await models.Channel.findOne({
      where: { teamId: team.id },
    });

    const query = `
    mutation {
      createMessage(channelId: ${channel.id}, text: "${text}") 
    }
  `;

    const res2 = await authReq({
      query,
    });

    expect(res2.status).toBe(200);

    const message = await models.Message.findOne({
      where: { channel_id: channel.id },
    });

    expect(message.text).toBe(text);
  });
});
