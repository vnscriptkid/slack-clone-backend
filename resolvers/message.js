import { withFilter } from "graphql-subscriptions";
import { pubsub } from "../app";
import requireAuth from "../permissions";

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

export default {
  Query: {
    messages: requireAuth.createResolver(
      async (parent, { channelId }, { models, user }) => {
        // TODO: user must be authorized to see this channel
        return models.Message.findAll(
          {
            where: { channelId },
            order: [["created_at", "desc"]],
          },
          {
            raw: true,
          }
        );
      }
    ),
  },
  Mutation: {
    createMessage: requireAuth.createResolver(
      async (parent, { channelId, text }, { models, user }) => {
        try {
          const message = await models.Message.create({
            userId: user.id,
            text,
            channelId,
          });

          const asyncFunc = async () => {
            const currentUser = await models.User.findOne({
              where: {
                id: user.id,
              },
            });

            pubsub.publish(NEW_CHANNEL_MESSAGE, {
              channelId,
              newChannelMessage: {
                ...message.dataValues,
                user: currentUser.dataValues,
              },
            });
          };

          asyncFunc();

          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
      }
    ),
  },
  Message: {
    user: ({ userId, user }, args, { models }) => {
      if (user) return user;

      return models.User.findOne({ where: { id: userId } }, { raw: true });
    },
  },
  Subscription: {
    newChannelMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => payload.channelId === args.channelId
      ),
    },
  },
};
