// @flow strict
import getRandomColor from './getRandomColor.js';
import getRandomNumberGenerator from './getRandomNumberGenerator.js';

type Args = {|
  previousItemCount?: number,
  name?: string,
  randomNumberSeed?: number,
  numberOfItems?: number,
  pinHeightsSample: $ReadOnlyArray<number>,
|};

type ExampleItem = {|
  color: string,
  height: number,
  name: string,
|};

/**
 * A NOTE ABOUT SSR:
 * This approach generates a finite set of pins with realistic heights — a fundamental shift from generating random pins on the fly. We have to take care to ensure that the same pins are generated on the server and the client. This is done by generating an array of random number seeds in `getServerSideProps` in docs/pages/integration-test/masonry.js, which are used to generate the pin heights. We then need to make sure we're pulling from these pin heights in a consistent way on the server and the client. This is where `randomNumberSeed` comes in: we pull the first `numberOfItems` heights from the array for SSR. For subsequent calls on the client, we use a random `randomNumberSeed` to pull random heights from the array. So SSR will always use the first `numberOfItems` heights, and we don't attempt to keep track of "where we are" in the heights array after that.
 */
export default function generateRealisticExampleItems({
  previousItemCount = 0,
  name = 'Pin',
  randomNumberSeed = 0,
  numberOfItems = 20,
  pinHeightsSample,
}: Args): $ReadOnlyArray<ExampleItem> {
  const getRandomNumber = getRandomNumberGenerator(randomNumberSeed);
  const baseIndex = Math.ceil(randomNumberSeed * 10);

  const pins = Array.from({ length: numberOfItems }).map((_, i) => ({
    name: `${name} ${i + previousItemCount}`,
    height: pinHeightsSample[baseIndex + i],
    color: getRandomColor(getRandomNumber),
  }));

  return pins;
}