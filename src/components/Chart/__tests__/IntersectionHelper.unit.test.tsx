import { getDataIntersections } from "../IntersectionHelper";

describe("getDataIntersections", () => {
  test("two intersections", () => {
    const data = [
      {
        key1: 1.0,
        key2: 2.0,
      },
      {
        key1: 2.0,
        key2: 1.0,
      },
      {
        key1: 1.0,
        key2: 2.0,
      },
    ];

    const intersections = getDataIntersections(data, ["key1", "key2"]);

    /**
     * Data has two intersections.
     *
     * Between 0 and 1, halfway between 1.0 and 2.0
     *
     * Between 1 and 2, halfway between 2.0 and 1.0
     */
    expect(intersections[0]).toEqual({
      x: 0.5,
      y: 1.5,
      line1isHigher: false,
      line1isHigherNext: true,
    });
    expect(intersections[1]).toEqual({
      x: 1.5,
      y: 1.5,
      line1isHigher: true,
      line1isHigherNext: false,
    });
    expect(intersections.length).toEqual(2);
  });

  test("two intersections, more points", () => {
    const data = [
      {
        key1: 1.0,
        key2: 2.0,
      },
      {
        key1: 1.0,
        key2: 2.0,
      },
      {
        key1: 2.0,
        key2: 1.0,
      },
      {
        key1: 2.0,
        key2: 1.0,
      },
      {
        key1: 1.0,
        key2: 2.0,
      },
    ];

    const intersections = getDataIntersections(data, ["key1", "key2"]);

    /**
     * Data has two intersections.
     *
     * Between 1 and 2, halfway between 1.0 and 2.0
     *
     * Between 3 and 4, halfway between 2.0 and 1.0
     */
    expect(intersections[0]).toEqual({
      x: 1.5,
      y: 1.5,
      line1isHigher: false,
      line1isHigherNext: true,
    });
    expect(intersections[1]).toEqual({
      x: 3.5,
      y: 1.5,
      line1isHigher: true,
      line1isHigherNext: false,
    });
    expect(intersections.length).toEqual(2);
  });

  test("no intersections", () => {
    const data = [
      {
        key1: 1.0,
        key2: 2.0,
      },
      {
        key1: 1.0,
        key2: 2.0,
      },
      {
        key1: 1.0,
        key2: 2.0,
      },
    ];

    const intersections = getDataIntersections(data, ["key1", "key2"]);

    expect(intersections.length).toEqual(0);
  });
});
