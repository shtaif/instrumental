import {
  AsyncIterableChannel,
  type AsyncIterableChannelSubject,
} from '../../../node_modules/react-async-iterators/dist/esm/common/AsyncIterableChannel.js';

export {
  asyncIterChannelize,
  type ChannelArray,
  type ChannelItem,
  type AsyncIterableChannelSubject,
};

function asyncIterChannelize<TVals extends readonly unknown[], TKey = unknown>(opts: {
  key: (item: TVals[number]) => TKey;
}): (source: AsyncIterable<TVals>) => AsyncIterable<ChannelArray<TVals, TKey>, void, void> {
  return source => {
    return {
      [Symbol.asyncIterator]: () => {
        let iterator: undefined | AsyncIterator<TVals>;
        const currIterChannels = new Map<
          unknown,
          {
            diffCompId: number;
            channel: AsyncIterableChannel<TVals[number]>;
          }
        >();
        let currDiffCompId = 0;
        let isClosed = false;
        let lastYieldedChannelArray = [] as ChannelArray<TVals, TKey>;

        return {
          async next() {
            if (isClosed) {
              return { done: true, value: undefined };
            }

            iterator ??= source[Symbol.asyncIterator]();

            while (true) {
              const { done, value } = await (async () => {
                try {
                  return await iterator.next();
                } catch (err) {
                  isClosed = true;
                  // for (const info of currIterChannels.values()) {
                  //   info.channel.throw(err);
                  // }
                  throw err;
                }
              })();

              if (done) {
                break;
              }

              const nextDiffCompId = (currDiffCompId = currDiffCompId === 0 ? 1 : 0);

              const channelArray = value.map((item: TVals[number]) => {
                const itemKey = opts.key(item);

                let info = currIterChannels.get(itemKey);

                if (info) {
                  info.diffCompId = nextDiffCompId;
                } else {
                  const initialValue = item;
                  info = {
                    diffCompId: nextDiffCompId,
                    channel: new AsyncIterableChannel<TVals[number]>(initialValue),
                  };
                  currIterChannels.set(itemKey, info);
                }

                info.channel.put(item);

                return {
                  key: itemKey,
                  values: info.channel.out,
                } satisfies ChannelItem<TVals[number], TKey>;
              }) as ChannelArray<TVals, TKey>;

              for (const { 0: key, 1: info } of currIterChannels) {
                if (info.diffCompId !== nextDiffCompId) {
                  currIterChannels.delete(key);
                  info.channel.close();
                }
              }

              const hasArrayItselfChanged =
                channelArray.length !== lastYieldedChannelArray.length ||
                channelArray.some(
                  (_, i) => channelArray[i].values !== lastYieldedChannelArray[i].values
                );

              if (hasArrayItselfChanged) {
                lastYieldedChannelArray = channelArray;
                return { done: false, value: channelArray };
              }
            }

            isClosed = true;

            for (const info of currIterChannels.values()) {
              info.channel.close();
            }

            return { done: true, value: undefined };
          },

          async return() {
            if (!isClosed) {
              isClosed = true;
              await iterator?.return?.();
              for (const info of currIterChannels.values()) {
                info.channel.close();
              }
            }
            return { done: true, value: undefined };
          },
        };
      },
    };
  };
}

type ChannelArray<TVals extends readonly unknown[], TKey> = {
  [I in keyof TVals]: ChannelItem<TVals[I], TKey>;
};

type ChannelItem<T, TKey> = {
  key: TKey;
  values: AsyncIterableChannelSubject<T, T>;
};

// {
//   const value = [
//     { id: 0, name: 'lol_0' },
//     { id: 1, name: 'lol_1' },
//   ] as const;

//   const gen = (async function* () {
//     yield value;
//   })();

//   const results1 = asyncIterChannelize<typeof value>({ key: ({ id }) => id })(gen);
// }
